import { useState, useEffect } from "react";
import { Mainnet, useContractKit } from "@celo-tools/use-contractkit";
import Layout from "../../components/app/layout";
import StatGrid from "../../components/app/dashboard/stat-grid";
import VotingSummary from "../../components/app/dashboard/voting-summary";
import useStore from "../../store/store";

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
  }, []);

  async function connectWallet() {
    await connect();
    state.setUser(address);
    console.log(state);
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
              Safest way to put your CELOs to work & earn profits on the go! All
              you need to get started is a Celo Wallet & some CELOs in it.
              Investing CELOs has never been this easy.
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
