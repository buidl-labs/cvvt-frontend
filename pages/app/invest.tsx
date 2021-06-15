import React, { useState } from "react";
import Layout from "../../components/app/layout";
import CeloInput from "../../components/app/celo-input";
import { BigNumber } from "bignumber.js";

function Invest() {
  const [celoToInvest, setCeloToInvest] = useState("");
  const [exchangeRate, setExchangeRate] = useState(2.5);
  return (
    <Layout
      // TODO: Fix the state structure so you don't have to pass disconnectWallet to layout everytime.
      disconnectWallet={async () => {
        console.log("destroy wallet function");
      }}
    >
      <>
        <h1 className="text-2xl font-medium mb-10 text-gray-dark">
          Invest CELO
        </h1>
        <main>
          <div className="border border-gray-light rounded-md py-8 px-10">
            <h3 className="text-gray-dark text-xl">
              Step 1: Investment Amount
            </h3>
            <div className="flex items-end mt-5">
              <div className="w-1/3">
                <CeloInput
                  celoAmountToInvest={celoToInvest}
                  setCeloAmountToInvest={setCeloToInvest}
                  exchangeRate={exchangeRate}
                  maxAmount={new BigNumber(0)}
                />
              </div>
              <div className="ml-5 mb-3 text-gray">
                / out of 1000.00 Total CELO ($ 5142.00) in your Wallet
              </div>
            </div>
            <div className="mt-5 flex space-x-32">
              <div className="text-gray-dark">
                <p className="text-sm">You could be earning</p>
                <p className="mt-2 text-lg font-medium">0.00% APY</p>
              </div>
              <div>
                <p className="text-sm text-gray">Yearly Earnings</p>
                <div className="mt-2 space-x-5 flex items-baseline">
                  <p className="text-lg text-gray-dark">0.00 CELO</p>
                  <p className="text-gray">$ 0.00</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray">Monthly Earnings</p>
                <div className="mt-2 space-x-5 flex items-baseline">
                  <p className="text-lg text-gray-dark">0.00 CELO</p>
                  <p className="text-gray">$ 0.00</p>
                </div>
              </div>
            </div>
            <button className="bg-primary text-white text-lg block w-full rounded-md mt-5 py-3">
              Confirm &amp; Continue
            </button>
          </div>
        </main>
      </>
    </Layout>
  );
}

export default Invest;
