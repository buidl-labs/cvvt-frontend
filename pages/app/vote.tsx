import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { BigNumber } from "bignumber.js";

import useStore from "../../store/store";

import Layout from "../../components/app/layout";
import VotingSummary from "../../components/app/voting-summary";
import Select from "../../components/app/select";
import CeloInput from "../../components/app/celo-input";
import VoteVGDialog from "../../components/app/dialogs/vote-vg";
import RevokeVGDialog from "../../components/app/dialogs/revoke-vg";
import ActivateVGDialog from "../../components/app/dialogs/activate-vg";

import {
  fetchPendingWithdrawals,
  getCELOBalance,
  getNonVotingLockedGold,
  getVGName,
  getVotingCelo,
  getVotingSummary,
  hasActivatablePendingVotes,
} from "../../lib/celo";

import useVG from "../../hooks/useValidatorGroupSuggestion";

import { calculateBarWidth, fetchExchangeRate } from "../../lib/utils";

import { VGSuggestion, GroupVoting } from "../../lib/types";

import CeloCoin from "../../components/icons/celo-coin";
import InfoIcon from "../../components/icons/info";

const options = ["Vote", "Revoke"];
function vote() {
  const [selected, setSelected] = useState<string>(options[0]);
  const [vgDialogOpen, setVGDialogOpen] = useState<boolean>(false);

  const [votingSummary, setVotingSummary] = useState<GroupVoting[]>([]);
  const [loadingVotingSummary, setLoadingVotingSummary] =
    useState<boolean>(false);

  const [pendingCELO, setPendingCELO] = useState<BigNumber>(new BigNumber(0));
  const [activeCELO, setActiveCELO] = useState<BigNumber>(new BigNumber(0));
  const [totalLockedCELO, setTotalLockedCELO] = useState<BigNumber>(
    new BigNumber(0)
  );
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [maxCELOAmount, setMaxCELOAmount] = useState<BigNumber>(
    new BigNumber(0)
  );

  const [validatorGroups, setValidatorGroups] = useState<VGSuggestion[]>([]);
  const [validatorGroupsForDialog, setValidatorGroupsForDialog] = useState<
    any[]
  >([]);
  const [selectedVG, setSelectedVG] = useState<string | null>();
  const [celoAmountToInvest, setCeloAmountToInvest] = useState<string>("");
  const [hasActivatableVotes, setHasActivatableVotes] =
    useState<boolean>(false);

  const { address, network, kit, performActions } = useContractKit();
  const state = useStore();
  const { fetching: fetchingVG, error: errorFetchingVG, data } = useVG(true);

  const fetchVotingSummary = useCallback(() => {
    if (address == null) return;
    setLoadingVotingSummary(true);
    getVotingSummary(kit, address)
      .then((groupVotes) =>
        Promise.all(
          groupVotes.map(async (group) => ({
            vg: group.group,
            name: await getVGName(kit, group.group),
            active: group.active,
            pending: group.pending,
          }))
        )
      )
      .then((summary) => {
        setVotingSummary(summary);
        setLoadingVotingSummary(false);
      });
  }, []);

  const fetchActivatablePendingVotes = useCallback(() => {
    if (address == null) return;
    hasActivatablePendingVotes(kit, address).then((hasActivatable) =>
      setHasActivatableVotes(hasActivatable)
    );
  }, []);

  const calculateActiveAndPendingCelo = useCallback(() => {
    let pendingCelo = new BigNumber(0);
    let activeCelo = new BigNumber(0);

    for (let v of votingSummary) {
      pendingCelo = pendingCelo.plus(v.pending);
      activeCelo = activeCelo.plus(v.active);
    }

    setPendingCELO(pendingCelo);
    setActiveCELO(activeCelo);
    setTotalLockedCELO(
      state.userBalances.nonVotingLockedCelo.plus(
        state.userBalances.votingLockedCelo
      )
    );
  }, [votingSummary]);

  async function fetchAllAccountData(address: string) {
    const { totalCeloUnlocking, totalCeloWithdrawable } =
      await fetchPendingWithdrawals(kit, address);
    const celoBalance = await getCELOBalance(kit, address);
    const nonVotingLockedGold = await getNonVotingLockedGold(kit, address);
    const votingLockedCelo = await getVotingCelo(kit, address);

    const totalCelo = celoBalance
      .plus(nonVotingLockedGold)
      .plus(votingLockedCelo)
      .plus(totalCeloUnlocking)
      .plus(totalCeloWithdrawable);

    state.setTotalCelo(totalCelo);
    state.setUnlockedCelo(celoBalance);
    state.setNonVotingLockedCelo(nonVotingLockedGold);
    state.setVotingLockedCelo(votingLockedCelo);
    state.setWithdrawableCelo(totalCeloWithdrawable);
    state.setUnlockingCelo(totalCeloUnlocking);
  }

  useEffect(() => {
    fetchActivatablePendingVotes();
  }, []);

  useEffect(() => {
    if (fetchingVG == false && errorFetchingVG == undefined) {
      setValidatorGroups(data["ValidatorGroups"]);
    }
  }, [fetchingVG, errorFetchingVG, data]);

  useEffect(() => {
    // validatorGroupsForDialog
    if (validatorGroups.length == 0) return;
    setSelectedVG("");

    if (selected === options[0]) {
      setValidatorGroupsForDialog(validatorGroups.slice(0, 5));
    } else if (selected === options[1]) {
      const validatorsToRevoke = votingSummary.filter((vs) => vs.active.gt(0));
      setValidatorGroupsForDialog(
        validatorsToRevoke.map((vg) => {
          const vgData = validatorGroups.find(
            (group) => group.Address === vg.vg.toLowerCase()
          );
          return {
            address: vg.vg,
            name: vg.name,
            active: vg.active,
            performanceScore: vgData?.PerformanceScore,
            transparencyScore: vgData?.TransparencyScore,
            estimatedAPY: vgData?.EstimatedAPY,
          };
        })
      );
    }
  }, [selected, validatorGroups]);

  useEffect(() => {
    if (address == null) return;
    fetchAllAccountData(address);
    fetchVotingSummary();
    fetchActivatablePendingVotes();

    fetchExchangeRate().then((rate) => setExchangeRate(rate));
  }, [address]);

  useEffect(() => {
    if (votingSummary.length == 0) return;

    calculateActiveAndPendingCelo();
  }, [votingSummary]);

  const voteOnVG = async () => {
    if (address == null) return;
    if (selectedVG == undefined || selectedVG == null) return;
    if (!celoAmountToInvest) return;

    try {
      await performActions(async (k) => {
        const election = await k.contracts.getElection();
        await (
          await election.vote(
            selectedVG,
            new BigNumber(parseFloat(celoAmountToInvest)).times(1e18)
          )
        ).sendAndWaitForReceipt({ from: k.defaultAccount });
      });
    } catch (e) {
      console.log("unable to vote", e.message);
    } finally {
      fetchAllAccountData(address);
      fetchVotingSummary();
      fetchActivatablePendingVotes();
      calculateActiveAndPendingCelo();
    }
  };

  const revokeVG = async () => {
    if (address == null) return;
    try {
      await performActions(async (k) => {
        console.log(k.defaultAccount);

        const election = await k.contracts.getElection();
        if (!selectedVG) return;
        console.log(selectedVG);
        await Promise.all(
          (
            await election.revoke(
              address,
              selectedVG,
              new BigNumber(parseFloat(celoAmountToInvest)).times(1e18)
            )
          ).map((tx) => tx.sendAndWaitForReceipt({ from: k.defaultAccount }))
        );
      });
      console.log("Vote cast");
    } catch (e) {
      console.log(`Unable to vote ${e.message}`);
    } finally {
      fetchAllAccountData(address);
      fetchVotingSummary();
      fetchActivatablePendingVotes();
      calculateActiveAndPendingCelo();
    }
  };

  const activateVG = async () => {
    if (address == null) return;
    try {
      await performActions(async (k) => {
        const election = await k.contracts.getElection();
        await Promise.all(
          (
            await election.activate(address)
          ).map((tx) => tx.sendAndWaitForReceipt({ from: k.defaultAccount }))
        );
      });

      console.log("Votes activated");
    } catch (e) {
      console.log(`Unable to activate votes ${e.message}`);
    } finally {
      fetchAllAccountData(address);
      fetchVotingSummary();
      fetchActivatablePendingVotes();
      calculateActiveAndPendingCelo();
    }
  };

  return (
    <Layout>
      <>
        <ActivateVGDialog open={hasActivatableVotes} activate={activateVG} />
        {vgDialogOpen ? (
          selected === options[0] ? (
            <VoteVGDialog
              open={vgDialogOpen}
              setOpen={setVGDialogOpen}
              selectedVG={selectedVG}
              setSelectedVG={setSelectedVG}
              validatorGroups={validatorGroupsForDialog}
            />
          ) : (
            <RevokeVGDialog
              open={vgDialogOpen}
              setOpen={setVGDialogOpen}
              selectedVG={selectedVG}
              setSelectedVG={setSelectedVG}
              validatorGroups={validatorGroupsForDialog}
            />
          )
        ) : null}
        <header className="flex justify-between items-baseline">
          <h3 className="text-gray-dark font-medium text-2xl">
            Vote/Revoke CELO
          </h3>
          <h3 className="text-secondary">
            <span className="font-medium">Locked CELO:</span>{" "}
            <span className="font-medium text-2xl">
              {totalLockedCELO.div(1e18).toFormat(2)}
            </span>{" "}
            <span className="text-secondary-light text-sm font-medium">
              ($ {totalLockedCELO.div(1e18).times(exchangeRate).toFormat(2)})
            </span>
          </h3>
        </header>
        <main className="mt-10">
          <div className="border border-white rounded-full h-3 flex overflow-hidden">
            <div
              className="bg-secondary-light h-full"
              style={{
                width: calculateBarWidth(
                  state.userBalances.nonVotingLockedCelo,
                  totalLockedCELO
                ),
              }}
            ></div>
            <div
              className="bg-accent-light h-full "
              style={{ width: calculateBarWidth(pendingCELO, totalLockedCELO) }}
            ></div>
            <div
              className="bg-accent-dark h-full"
              style={{ width: calculateBarWidth(activeCELO, totalLockedCELO) }}
            ></div>
          </div>
          <ul className="mt-5 grid grid-cols-3 gap-10">
            <li className="px-10 py-7 flex flex-col border border-gray-light rounded-md space-y-2.5">
              <div className="flex justify-between items-center">
                <div className={`flex items-center text-secondary-dark`}>
                  <CeloCoin />
                  <h4 className="text-sm font-medium ml-2.5">
                    Unused Locked CELO
                  </h4>
                </div>
                <InfoIcon />
              </div>
              <p className="text-xl font-medium">
                {state.userBalances.nonVotingLockedCelo.div(1e18).toFormat(2)}{" "}
                <span className="text-base">CELO</span>
              </p>

              <p className="text-sm text-gray">
                ${" "}
                {state.userBalances.nonVotingLockedCelo
                  .div(1e18)
                  .times(exchangeRate)
                  .toFormat(2)}
              </p>
            </li>
            <li className="px-10 py-7 flex flex-col border border-gray-light rounded-md space-y-2.5">
              <div className="flex justify-between items-center">
                <div className={`flex items-center text-accent-light`}>
                  <CeloCoin />
                  <h4 className="text-sm font-medium ml-2.5">
                    Pending-Vote CELO
                  </h4>
                </div>
                <InfoIcon />
              </div>
              <p className="text-xl font-medium">
                {pendingCELO.div(1e18).toFormat(2)}{" "}
                <span className="text-base">CELO</span>
              </p>

              <p className="text-sm text-gray">
                $ {pendingCELO.div(1e18).times(exchangeRate).toFormat(2)}
              </p>
            </li>
            <li className="px-10 py-7 flex flex-col border border-gray-light rounded-md space-y-2.5">
              <div className="flex justify-between items-center">
                <div className={`flex items-center text-accent-dark`}>
                  <CeloCoin />
                  <h4 className="text-sm font-medium ml-2.5">
                    Activated-Voting CELO
                  </h4>
                </div>
                <InfoIcon />
              </div>
              <p className="text-xl font-medium">
                {activeCELO.div(1e18).toFormat(2)}{" "}
                <span className="text-base">CELO</span>
              </p>

              <p className="text-sm text-gray">
                $ {activeCELO.div(1e18).times(exchangeRate).toFormat(2)}
              </p>
            </li>
          </ul>
          <div className="mt-10 px-10 py-8 border border-gray-light rounded-md">
            <h3 className="text-2xl text-gray-dark font-medium">
              Vote/Revoke for Validator Group
            </h3>
            <div className="grid grid-cols-3 gap-10 mt-8">
              <div>
                <Select
                  options={options}
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>
              <div className="flex flex-col">
                <span className="block text-sm font-medium text-gray-dark">
                  Validator Group
                </span>
                <button
                  type="button"
                  className="whitespace-nowrap truncate bg-gray-light-light relative mt-2.5 w-full border border-gray-light rounded-md shadow-sm px-5 py-2.5 text-left cursor-default focus:outline-none focus:bg-primary-light-light focus:border-primary text-lg text-gray-dark"
                  onClick={() => setVGDialogOpen(true)}
                >
                  {selectedVG
                    ? `${selectedVG.slice(0, 5)}...${selectedVG.slice(-5)}`
                    : "Select Validator Group"}

                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </span>
                </button>
              </div>
              <CeloInput
                celoAmountToInvest={celoAmountToInvest}
                setCeloAmountToInvest={setCeloAmountToInvest}
                exchangeRate={exchangeRate}
                maxAmount={state.userBalances.nonVotingLockedCelo}
              />
            </div>
            <button
              className="bg-primary mt-5 w-full text-white text-xl py-3 rounded-md"
              onClick={() => {
                if (selectedVG == undefined) return;
                if (selected === options[0]) voteOnVG();
                if (selected === options[1]) revokeVG();
              }}
            >
              {selected}
            </button>
          </div>
          <VotingSummary
            votingSummary={votingSummary}
            loading={loadingVotingSummary}
          />
        </main>
      </>
    </Layout>
  );
}

export default vote;
