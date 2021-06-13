import React, { Fragment, useEffect, useState } from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { BigNumber } from "bignumber.js";

import useStore from "../../store/store";

import Layout from "../../components/app/layout";

import Select from "../../components/app/select";
import CeloInput from "../../components/app/celo-input";

import {
  fetchPendingWithdrawals,
  getCELOBalance,
  getNonVotingLockedGold,
  getVotingCelo,
} from "../../lib/celo";

import { calculateBarWidth, fetchExchangeRate } from "../../lib/utils";

import CeloCoin from "../../components/icons/celo-coin";
import InfoIcon from "../../components/icons/info";

const options = ["Lock", "Unlock"];
function vote() {
  const [selected, setSelected] = useState<string>(options[0]);

  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [maxCELOAmount, setMaxCELOAmount] = useState<BigNumber>(
    new BigNumber(0)
  );

  const [celoAmount, setCeloAmount] = useState("");

  const { address, network, kit, performActions } = useContractKit();
  const state = useStore();

  useEffect(() => {
    state.setUser(address);
    state.setNetwork(network.name);
  }, []);

  useEffect(() => {
    if (selected === options[0]) {
      setMaxCELOAmount(state.userBalances.unlockedCelo);
    } else if (selected === options[1]) {
      setMaxCELOAmount(state.userBalances.nonVotingLockedCelo);
    }
  }, [selected]);

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
    fetchExchangeRate().then((rate) => setExchangeRate(rate));
  }, [address]);

  const lockCELO = async () => {
    try {
      await performActions(async (k) => {
        // await ensureAccount(k, k.defaultAccount);
        const lockedCelo = await k.contracts.getLockedGold();
        return lockedCelo.lock().sendAndWaitForReceipt({
          value: new BigNumber(parseFloat(celoAmount)).times(1e18).toString(),
          from: k.defaultAccount,
        });
      });

      console.log("CELO locked");
    } catch (e) {
      console.error(e.message);
    }
  };

  const unlockCELO = async () => {
    try {
      await performActions(async (k) => {
        const lockedCelo = await k.contracts.getLockedGold();
        await lockedCelo
          .unlock(new BigNumber(parseFloat(celoAmount)).times(1e18))
          .sendAndWaitForReceipt({ from: k.defaultAccount });
      });

      console.log("CELO unlocked");
    } catch (e) {
      console.error(e.message);
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
        <header className="flex justify-between items-baseline">
          <h3 className="text-gray-dark font-medium text-2xl">
            Lock/Unlock CELO
          </h3>
          <h3 className="text-gray-dark">
            <span className="font-medium">Total CELO:</span>{" "}
            <span className="font-medium text-2xl">
              {state.userBalances.totalCelo.div(1e18).toFormat(2)}
            </span>{" "}
            <span className="text-gray text-sm font-medium">
              (${" "}
              {state.userBalances.totalCelo
                .div(1e18)
                .times(exchangeRate)
                .toFormat(2)}
              )
            </span>
          </h3>
        </header>
        <main className="mt-10">
          <div className="border border-white rounded-full h-3 flex overflow-hidden">
            <div
              className="bg-primary h-full"
              style={{
                width: calculateBarWidth(
                  state.userBalances.unlockedCelo,
                  state.userBalances.totalCelo
                ),
              }}
            ></div>
            <div
              className="bg-secondary h-full "
              style={{
                width: calculateBarWidth(
                  state.userBalances.votingLockedCelo.plus(
                    state.userBalances.nonVotingLockedCelo
                  ),
                  state.userBalances.totalCelo
                ),
              }}
            ></div>
            <div
              className="bg-primary-light h-full"
              style={{
                width: calculateBarWidth(
                  state.userBalances.withdrawableCelo,
                  state.userBalances.totalCelo
                ),
              }}
            ></div>
            <div
              className="bg-accent-dark h-full"
              style={{
                width: calculateBarWidth(
                  state.userBalances.unlockingCelo,
                  state.userBalances.totalCelo
                ),
              }}
            ></div>
          </div>
          <ul className="mt-5 grid grid-cols-4 gap-10">
            <li className="px-10 py-7 flex flex-col border border-gray-light rounded-md space-y-2.5">
              <div className="flex justify-between items-center">
                <div className={`flex items-center text-primary`}>
                  <CeloCoin />
                  <h4 className="text-sm font-medium ml-2.5">Unlocked CELO</h4>
                </div>
                <InfoIcon />
              </div>
              <p className="text-xl font-medium">
                {state.userBalances.unlockedCelo.div(1e18).toFormat(2)}{" "}
                <span className="text-base">CELO</span>
              </p>

              <p className="text-sm text-gray">
                ${" "}
                {state.userBalances.unlockedCelo
                  .div(1e18)
                  .times(exchangeRate)
                  .toFormat(2)}
              </p>
            </li>
            <li className="px-10 py-7 flex flex-col border border-gray-light rounded-md space-y-2.5">
              <div className="flex justify-between items-center">
                <div className={`flex items-center text-secondary`}>
                  <CeloCoin />
                  <h4 className="text-sm font-medium ml-2.5">Locked CELO</h4>
                </div>
                <InfoIcon />
              </div>
              <p className="text-xl font-medium">
                {state.userBalances.votingLockedCelo
                  .plus(state.userBalances.nonVotingLockedCelo)
                  .div(1e18)
                  .toFormat(2)}{" "}
                <span className="text-base">CELO</span>
              </p>

              <p className="text-sm text-gray">
                ${" "}
                {state.userBalances.votingLockedCelo
                  .plus(state.userBalances.nonVotingLockedCelo)
                  .div(1e18)
                  .times(exchangeRate)
                  .toFormat(2)}
              </p>
            </li>
            <li className="px-10 py-7 flex flex-col border border-gray-light rounded-md space-y-2.5">
              <div className="flex justify-between items-center">
                <div className={`flex items-center text-primary-light`}>
                  <CeloCoin />
                  <h4 className="text-sm font-medium ml-2.5">
                    Withdrawable CELO
                  </h4>
                </div>
                <InfoIcon />
              </div>
              <p className="text-xl font-medium">
                {state.userBalances.withdrawableCelo.div(1e18).toFormat(2)}{" "}
                <span className="text-base">CELO</span>
              </p>

              <p className="text-sm text-gray">
                ${" "}
                {state.userBalances.withdrawableCelo
                  .div(1e18)
                  .times(exchangeRate)
                  .toFormat(2)}
              </p>
            </li>
            <li className="px-10 py-7 flex flex-col border border-gray-light rounded-md space-y-2.5">
              <div className="flex justify-between items-center">
                <div className={`flex items-center text-accent-dark`}>
                  <CeloCoin />
                  <h4 className="text-sm font-medium ml-2.5">Unlocking CELO</h4>
                </div>
                <InfoIcon />
              </div>
              <p className="text-xl font-medium">
                {state.userBalances.unlockingCelo.div(1e18).toFormat(2)}{" "}
                <span className="text-base">CELO</span>
              </p>

              <p className="text-sm text-gray">
                ${" "}
                {state.userBalances.unlockingCelo
                  .div(1e18)
                  .times(exchangeRate)
                  .toFormat(2)}
              </p>
            </li>
          </ul>
          <div className="mt-10 px-10 py-8 border border-gray-light rounded-md">
            <h3 className="text-2xl text-gray-dark font-medium">
              Lock/Unlock CELO
            </h3>
            <div className="grid grid-cols-2 gap-10 mt-8">
              <div>
                <Select
                  options={options}
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>

              <CeloInput
                celoAmountToInvest={celoAmount}
                setCeloAmountToInvest={setCeloAmount}
                exchangeRate={exchangeRate}
                maxAmount={maxCELOAmount}
              />
            </div>
            <button
              className="bg-primary mt-5 w-full text-white text-xl py-3 rounded-md"
              onClick={() => {
                if (selected === options[0]) {
                  lockCELO();
                } else if (selected === options[1]) {
                  unlockCELO();
                }
              }}
            >
              {selected}
            </button>
          </div>
        </main>
      </>
    </Layout>
  );
}

export default vote;
