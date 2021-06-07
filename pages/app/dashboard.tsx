import { useState, useEffect } from "react";
import { Mainnet, useContractKit } from "@celo-tools/use-contractkit";

import useStore from "../../store/store";
import {
  getCELOBalance,
  getNonVotingLockedGold,
  getVotingCelo,
  fetchPendingWithdrawals,
} from "../../lib/celo/balances";

import Layout from "../../components/app/layout";
import StatGrid from "../../components/app/dashboard/stat-grid";
import VotingSummary from "../../components/app/dashboard/voting-summary";
import { getVotingSummary } from "../../lib/celo/voting";

export default function dashboard() {
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
    fetchAllAccountData(address);
    getVotingSummary(kit, address).then(console.log);
  }, [address]);

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
          <VotingSummary />
        </div>
      )}
    </Layout>
  );
}
