import React, { useEffect, useState } from "react";
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
import CeloCoin from "../../components/icons/celo-coin";
import InfoIcon from "../../components/icons/info";
import axios from "axios";
import VotingSummary from "../../components/app/dashboard/voting-summary";

async function fetchExchangeRate(): Promise<number> {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=celo"
  );
  const data = response.data;
  return data[0]["current_price"];
}

function vote() {
  type GroupVoting = {
    name: string;
    vg: string;
    active: BigNumber;
    pending: BigNumber;
  };
  const [votingSummary, setVotingSummary] = useState<GroupVoting[]>([]);
  const [pendingCELO, setPendingCELO] = useState<BigNumber>(new BigNumber(0));
  const [activeCELO, setActiveCELO] = useState<BigNumber>(new BigNumber(0));
  const [totalLockedCELO, setTotalLockedCELO] = useState<BigNumber>(
    new BigNumber(0)
  );
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const { address, network, kit } = useContractKit();
  const state = useStore();

  useEffect(() => {
    state.setUser(address);
    state.setNetwork(network.name);
  }, []);

  function calculateBarWidth(amount: BigNumber): string {
    const percent = amount.div(totalLockedCELO).times(100);

    if (percent.isNaN()) return "0";
    return `${percent.toFormat(0)}%`;
  }

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

  return (
    <Layout
      // TODO: Fix the state structure so you don't have to pass disconnectWallet to layout everytime.
      disconnectWallet={async () => {
        console.log("destroy wallet function");
      }}
    >
      <>
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
                  state.userBalances.nonVotingLockedCelo
                ),
              }}
            ></div>
            <div
              className="bg-accent-light h-full "
              style={{ width: calculateBarWidth(pendingCELO) }}
            ></div>
            <div
              className="bg-accent-dark h-full"
              style={{ width: calculateBarWidth(activeCELO) }}
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
          <VotingSummary votingSummary={votingSummary} />
        </main>
      </>
    </Layout>
  );
}

export default vote;
