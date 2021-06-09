import React, { Fragment, useEffect, useState } from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { BigNumber } from "bignumber.js";
import useStore from "../../store/store";
import Layout from "../../components/app/layout";
import {
  fetchPendingWithdrawals,
  getCELOBalance,
  getNonVotingLockedGold,
  getVGName,
  getVotingCelo,
  getVotingSummary,
} from "../../lib/celo";
import useVG from "../../hooks/useValidatorGroup";
import CeloCoin from "../../components/icons/celo-coin";
import InfoIcon from "../../components/icons/info";
import VotingSummary from "../../components/app/dashboard/voting-summary";
import { Dialog, Listbox, RadioGroup, Transition } from "@headlessui/react";
import {
  calculateBarWidth,
  floatToPercentage,
  fetchExchangeRate,
} from "../../lib/utils";
import { VGSuggestion, GroupVoting } from "../../lib/types";

function vote() {
  const options = ["Vote", "Revoke"];
  const [selected, setSelected] = useState(options[0]);
  const [vgDialogOpen, setVGDialogOpen] = useState<boolean>(false);

  const [votingSummary, setVotingSummary] = useState<GroupVoting[]>([]);
  const [pendingCELO, setPendingCELO] = useState<BigNumber>(new BigNumber(0));
  const [activeCELO, setActiveCELO] = useState<BigNumber>(new BigNumber(0));
  const [totalLockedCELO, setTotalLockedCELO] = useState<BigNumber>(
    new BigNumber(0)
  );
  const [exchangeRate, setExchangeRate] = useState<number>(0);

  const [validatorGroups, setValidatorGroups] = useState<VGSuggestion[]>([]);
  const [selectedVG, setSelectedVG] = useState<string | null>();
  const [celoAmountToInvest, setCeloAmountToInvest] = useState<string>("");

  const { address, network, kit, performActions } = useContractKit();
  const state = useStore();
  const { fetching: fetchingVG, error: errorFetchingVG, data } = useVG(true, 5);

  useEffect(() => {
    state.setUser(address);
    state.setNetwork(network.name);
  }, []);
  useEffect(() => {
    if (fetchingVG == false && errorFetchingVG == undefined) {
      setValidatorGroups(data["ValidatorGroups"]);
    }
  }, [fetchingVG, errorFetchingVG, data]);

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
    if (address.length < 1) return;
    fetchAllAccountData(address);
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
      .then((summary) => setVotingSummary(summary));
    fetchExchangeRate().then((rate) => setExchangeRate(rate));
  }, [address]);

  useEffect(() => {
    if (votingSummary.length == 0) return;

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

  const voteOnVG = async () => {
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
    }
  };

  return (
    <Layout
      // TODO: Fix the state structure so you don't have to pass disconnectWallet to layout everytime.
      disconnectWallet={async () => {
        console.log("destroy wallet function");
      }}
    >
      <>
        {vgDialogOpen && (
          <Transition.Root show={vgDialogOpen} as={Fragment}>
            <Dialog
              as="div"
              static
              className="fixed z-10 inset-0 overflow-y-auto"
              open={vgDialogOpen}
              onClose={setVGDialogOpen}
            >
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0 bg-gray-dark bg-opacity-90 transition-opacity" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle px-10 py-7">
                    <div>
                      <div className="mt-5">
                        <div className="flex justify-between items-baseline">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium text-gray-dark"
                          >
                            Select Validator Group
                          </Dialog.Title>
                          <button
                            className="px-8 py-2 bg-primary text-white text-lg border border-primary rounded-md shadow focus:outline-none"
                            onClick={() => setVGDialogOpen(false)}
                          >
                            Continue
                          </button>
                        </div>
                        <div className="mt-5">
                          <div>
                            <RadioGroup
                              value={selectedVG}
                              onChange={setSelectedVG}
                            >
                              <div className="relative bg-white rounded-md -space-y-px">
                                <div
                                  className="grid gap-12 p-4 text-sm text-gray"
                                  style={{
                                    gridTemplateColumns:
                                      "0.5fr 1fr 1fr 1fr 1fr 1fr",
                                  }}
                                >
                                  <div className="text-center">Select</div>
                                  <div className="text-left">
                                    Validator Group
                                  </div>
                                  <div className="text-center">Group Score</div>
                                  <div className="text-center">
                                    Performance Score
                                  </div>
                                  <div className="text-center">
                                    Transparency Score
                                  </div>
                                  <div className="text-center">
                                    Estimated APY
                                  </div>
                                </div>
                                {validatorGroups.map((vg, vgIdx) => (
                                  <RadioGroup.Option
                                    key={vg.Address}
                                    value={vg.Address}
                                    className={({ checked }) =>
                                      `${
                                        vgIdx === 0
                                          ? "rounded-tl-md rounded-tr-md"
                                          : ""
                                      } ${
                                        vgIdx === validatorGroups.length - 1
                                          ? "rounded-bl-md rounded-br-md"
                                          : ""
                                      } ${
                                        checked
                                          ? "bg-primary-light-light border-primary-light z-10"
                                          : "border-gray-light"
                                      } relative border p-4 cursor-pointer focus:outline-none`
                                    }
                                  >
                                    {({ active, checked }) => (
                                      <>
                                        <div
                                          className="grid gap-12 text-gray-dark text-lg"
                                          style={{
                                            gridTemplateColumns:
                                              "0.5fr 1fr 1fr 1fr 1fr 1fr",
                                          }}
                                        >
                                          <span
                                            className={`${
                                              checked
                                                ? "bg-primary-dark border-transparent"
                                                : "bg-white border-gray-dark"
                                            } ${
                                              active
                                                ? "ring-2 ring-offset-2 ring-primary"
                                                : ""
                                            } h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0 mx-auto`}
                                            aria-hidden="true"
                                          >
                                            <span className="rounded-full bg-white w-1.5 h-1.5" />
                                          </span>

                                          <RadioGroup.Label
                                            as="span"
                                            className="text-left"
                                          >
                                            {vg.Name == ""
                                              ? `...${vg.Address.slice(-7)}`
                                              : vg.Name}
                                          </RadioGroup.Label>
                                          <RadioGroup.Description className="text-center">
                                            {floatToPercentage(vg.GroupScore)}%
                                          </RadioGroup.Description>
                                          <RadioGroup.Description className="text-center">
                                            {floatToPercentage(
                                              vg.PerformanceScore
                                            )}
                                            %
                                          </RadioGroup.Description>
                                          <RadioGroup.Description className="text-center">
                                            {floatToPercentage(
                                              vg.TransparencyScore
                                            )}
                                            %
                                          </RadioGroup.Description>
                                          <RadioGroup.Description className="text-center">
                                            {vg.EstimatedAPY.toFixed(2)}%
                                          </RadioGroup.Description>
                                        </div>
                                      </>
                                    )}
                                  </RadioGroup.Option>
                                ))}
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
        )}
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
          <div className="border border-gray-light-light rounded-full h-3 flex overflow-hidden">
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
                <Listbox value={selected} onChange={setSelected}>
                  {({ open }) => (
                    <>
                      <Listbox.Label className="block text-sm font-medium text-gray-dark">
                        Assigned to
                      </Listbox.Label>
                      <div className="mt-2.5 relative">
                        <Listbox.Button className="bg-gray-light-light relative w-full border border-gray-light rounded-md shadow-sm px-5 py-2.5 text-left cursor-default focus:outline-none focus:bg-primary-light-light focus:border-primary text-lg">
                          <span className="block truncate">{selected}</span>
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
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options
                            static
                            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none  border border-primary-light-light"
                          >
                            {options.map((op) => (
                              <Listbox.Option
                                key={op}
                                className={({ active }) =>
                                  `${
                                    active
                                      ? "text-dark-gray bg-primary-light-light border border-primary-light-light"
                                      : "text-gray-900"
                                  } cursor-default select-none relative py-2 px-3 mx-1 text-lg border border-white rounded-md`
                                }
                                value={op}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={`${
                                        selected
                                          ? "font-semibold"
                                          : "font-normal"
                                      } block truncate`}
                                    >
                                      {op}
                                    </span>

                                    {selected ? (
                                      <span
                                        className={`${
                                          active
                                            ? "text-gray-dark-dark"
                                            : "text-primary-dark"
                                        } absolute inset-y-0 right-0 flex items-center pr-4`}
                                      >
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
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>
              <div className="flex flex-col">
                <span className="block text-sm font-medium text-gray-dark">
                  Validator Group
                </span>
                <button
                  type="button"
                  className="bg-gray-light-light relative mt-2.5 w-full border border-gray-light rounded-md shadow-sm px-5 py-2.5 text-left cursor-default focus:outline-none focus:bg-primary-light-light focus:border-primary text-lg text-gray-dark"
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
              <div>
                <div className="flex justify-between items-baseline">
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-dark"
                  >
                    Amount
                  </label>
                  <button
                    className="text-primary-dark focus:ring-0 focus:outline-none text-xs focus:underline"
                    onClick={() =>
                      setCeloAmountToInvest(
                        state.userBalances.nonVotingLockedCelo
                          .div(1e18)
                          .minus(0.5)
                          .toFormat(2)
                      )
                    }
                  >
                    Max Amount
                  </button>
                </div>
                <div className="relative mt-2.5 w-full rounded-md shadow-sm text-left cursor-default focus:outline-none text-gray-dark-dark">
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    className="block w-full h-full px-5 py-2.5 text-lg bg-gray-light-light border border-gray-light rounded-md focus:border-primary focus:ring-primary focus:bg-primary-light-light"
                    placeholder="0.00 CELO"
                    value={celoAmountToInvest}
                    onChange={(e) => setCeloAmountToInvest(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="currency" className="sr-only">
                      Currency
                    </label>
                    <div className="h-full py-0 pl-2 pr-7 text-sm rounded-md flex items-center justify-center">
                      <span>
                        ${" "}
                        {(
                          parseFloat(celoAmountToInvest) * exchangeRate
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="bg-primary mt-5 w-full text-white text-xl py-3 rounded-md"
              onClick={() => {
                if (selectedVG == undefined) return;
                voteOnVG();
              }}
            >
              Vote
            </button>
          </div>
          <VotingSummary votingSummary={votingSummary} />
        </main>
      </>
    </Layout>
  );
}

export default vote;
