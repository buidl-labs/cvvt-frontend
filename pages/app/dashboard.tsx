import { useState, useEffect } from "react";
import { Mainnet, useContractKit } from "@celo-tools/use-contractkit";
import { BigNumber } from "bignumber.js";

import useStore from "../../store/store";

import {
  getCELOBalance,
  getNonVotingLockedGold,
  getVotingCelo,
  fetchPendingWithdrawals,
  getVGName,
  getVotingSummary,
} from "../../lib/celo";

import Layout from "../../components/app/layout";
import StatGrid from "../../components/app/dashboard/stat-grid";
import VotingSummary from "../../components/app/dashboard/voting-summary";

export default function dashboard() {
  type GroupVoting = {
    name: string;
    vg: string;
    active: BigNumber;
    pending: BigNumber;
  };
  const [votingSummary, setVotingSummary] = useState<GroupVoting[]>([]);

  const {
    kit,
    address,
    network,
    updateNetwork,
    connect,
    destroy,
    performActions,
    walletType,
  } = useContractKit();

  const state = useStore();

  useEffect(() => {
    state.setUser(address);
    updateNetwork(Mainnet);
    state.setNetwork(network.name);
  }, []);

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
    // fetches and sets the data to global store.
    fetchAllAccountData(address);

    // gets all VGs voted for by the user.
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
  }, [address]);

  // Logging data for debugging.
  useEffect(() => {
    console.log("--- USER DATA ---");
    console.log(
      state.userBalances.totalCelo.div(1e18).toFormat(2),
      "TOTAL CELO"
    );
    console.log(
      state.userBalances.unlockedCelo.div(1e18).toFormat(2),
      "UNLOCKED CELO"
    );
    console.log(
      state.userBalances.nonVotingLockedCelo.div(1e18).toFormat(2),
      "NON-VOTING LOCKED CELO"
    );
    console.log(
      state.userBalances.votingLockedCelo.div(1e18).toFormat(2),
      "VOTING LOCKED CELO"
    );
    console.log(
      state.userBalances.withdrawableCelo.div(1e18).toFormat(2),
      "CELO READY FOR WITHDRAWAL"
    );
    console.log(
      state.userBalances.unlockingCelo.div(1e18).toFormat(2),
      "UNLOCKING CELO"
    );
  }, [state.userBalances]);

  async function connectWallet() {
    await connect();
    state.setUser(address);
  }

  async function destroyWallet() {
    await destroy();
    state.setUser("");
    console.log("Wallet disconnected.");
  }

  return (
    <Layout disconnectWallet={destroyWallet}>
      {!(state.user.length > 0) ? (
        <div>
          <div>
            <h3 className="text-2xl font-medium">Welcome, celo holder!</h3>
            <p className="mt-2.5 text-gray text-lg">
              Safest way to put your CELOs to work &amp; earn profits on the go!
              All you need to get started is a Celo Wallet &amp; some CELOs in
              it. Investing CELOs has never been this easy.
              <br /> Let’s get started by connecting your Celo Wallet...
            </p>
          </div>
          <div className="mt-24 flex flex-col justify-center items-center">
            <img src="/assets/wallet.png" />
            <button
              className="text-white bg-primary rounded-md px-10 py-3 mt-14 space-x-3 flex items-center"
              onClick={connectWallet}
            >
              <img src="/assets/celo-wallet.png" />
              <span>Connect Celo Wallet</span>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-2xl font-medium">Dashboard</h3>
          <StatGrid />
          <VotingSummary votingSummary={votingSummary} />
        </div>
      )}
    </Layout>
  );
}
