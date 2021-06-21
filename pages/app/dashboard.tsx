import { useState, useEffect, useMemo, useCallback } from "react";
import { Mainnet, useContractKit } from "@celo-tools/use-contractkit";
import { BigNumber } from "bignumber.js";

import useStore from "../../store/store";

import ActivateVGDialog from "../../components/app/dialogs/activate-vg";
import CreateAccountDialog from "../../components/app/dialogs/create-account";

import {
  getCELOBalance,
  getNonVotingLockedGold,
  getVotingCelo,
  fetchPendingWithdrawals,
  getVGName,
  getVotingSummary,
} from "../../lib/celo";
import { GroupVoting } from "../../lib/types";

import Layout from "../../components/app/layout";
import StatGrid from "../../components/app/stat-grid";
import VotingSummary from "../../components/app/voting-summary";

export default function dashboard() {
  const [votingSummary, setVotingSummary] = useState<GroupVoting[]>([]);

  const {
    kit,
    address,
    network,
    updateNetwork,
    connect,
    destroy,
    performActions,
  } = useContractKit();

  const userConnected = useMemo(() => address.length > 0, [address]);
  const state = useStore();
  const hasActivatableVotes = useStore().hasActivatableVotes;

  const fetchVotingSummary = useCallback(() => {
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
  }, []);

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
    state.setUser(address);
    // fetches and sets the data to global store.
    fetchAllAccountData(address);

    // gets all VGs voted for by the user.
    fetchVotingSummary();
  }, [address]);

  async function connectWallet() {
    await connect();
  }

  async function destroyWallet() {
    await destroy();
  }

  const activateVG = async () => {
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
    }
  };

  return (
    <Layout>
      <>
        <ActivateVGDialog open={hasActivatableVotes} activate={activateVG} />
        <CreateAccountDialog />
        {!userConnected ? (
          <div>
            <div>
              <h3 className="text-2xl font-medium">Welcome, celo holder!</h3>
              <p className="mt-2.5 text-gray text-lg">
                Safest way to put your CELOs to work &amp; earn profits on the
                go! All you need to get started is a Celo Wallet &amp; some
                CELOs in it. Investing CELOs has never been this easy.
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
      </>
    </Layout>
  );
}
