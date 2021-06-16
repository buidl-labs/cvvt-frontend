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
        <main className="space-y-10">
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
          <div className="border border-gray-light rounded-md py-8 px-10">
            <h3 className="text-gray-dark text-xl">
              Step 2: Vote For Validator
            </h3>
            <div className="text-gray mt-5">
              <p className="font-medium">
                Why am I voting? What are Validator Groups?
              </p>
              <p className="mt-3 max-w-5xl">
                Its easier than it sounds. Here’s how it work:
                <ul className="list-disc list-inside my-2 space-y-1">
                  <li>
                    The investment process of Celo is based on the mechanism
                    where you vote for Validator Groups with your CELO
                  </li>
                  <li>
                    When the Validator Groups you vote for performs well - you
                    earn CELOs. Its that simple!
                  </li>
                </ul>
                You don’t have to go through the hustle of deciding which
                Validator Group to vote for. We have the most suited Group for
                you. You can vote for it right-away!
              </p>
            </div>
            <div className="mt-5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-dark">
                  Recommended Validator Group to vote for:
                </span>
                <button className="text-primary">
                  Edit Validator Group preference
                </button>
              </div>
              <div className="border border-gray-light rounded-md grid grid-cols-5 gap-9 px-12 py-5 mt-3 text-center">
                <div className="grid grid-rows-2 gap-2">
                  <span className="text-gray">Name</span>
                  <span className="text-gray-dark text-base">VG Name</span>
                </div>
                <div className="grid grid-rows-2 gap-2">
                  <span className="text-gray">Group Score</span>
                  <span className="text-gray-dark text-base">95.00%</span>
                </div>
                <div className="grid grid-rows-2 gap-2">
                  <span className="text-gray">Performance Score</span>
                  <span className="text-gray-dark text-base">96.34%</span>
                </div>
                <div className="grid grid-rows-2 gap-2">
                  <span className="text-gray">Trust Score</span>
                  <span className="text-gray-dark text-base">55.00%</span>
                </div>
                <div className="grid grid-rows-2 gap-2">
                  <span className="text-gray">Estimated APY</span>
                  <span className="text-gray-dark text-base">5.6%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-gray-light rounded-md py-8 px-10">
            <h3 className="text-gray-dark text-xl">
              Step 3: Activate Investment
            </h3>
            <p className="text-gray font-medium mt-5">Almost there!</p>
            <p className="text-gray mt-3">
              To finish your investment & start earning profits - please return
              back in a day.
            </p>
            <button className="bg-primary text-white text-lg block w-full rounded-md mt-5 py-3">
              Activate
            </button>
          </div>
        </main>
      </>
    </Layout>
  );
}

export default Invest;
