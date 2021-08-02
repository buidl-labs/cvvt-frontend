import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useContractKit } from "@celo-tools/use-contractkit";

import { createMachine } from "xstate";
import { useMachine } from "@xstate/react";

import { BigNumber } from "bignumber.js";
import axios from "axios";

import useStore from "../../store/store";

import Layout from "../../components/app/layout";
import VoteVGDialog from "../../components/app/dialogs/vote-vg";
import CeloInput from "../../components/app/celo-input";
import { fetchExchangeRate, fetchTargetAPY } from "../../lib/utils";
import { getCELOBalance, getNonVotingLockedGold } from "../../lib/celo";
import useVG from "../../hooks/useValidatorGroups";
import InfoIcon from "../../components/icons/info";
import ReactTooltip from "react-tooltip";
import {
  trackCELOLockedOrUnlockedOrWithdraw,
  trackVoteOrRevoke,
} from "../../lib/supabase";
// import { supabase } from "../../lib/supabase";

const InvestMachine = createMachine({
  id: "InvestFlow",
  initial: "idle",
  states: {
    idle: {
      on: { NEXT: "voting" },
    },
    voting: {
      on: { NEXT: "activating" },
    },
    activating: {
      on: { NEXT: "completed" },
    },
    completed: {
      on: { NEXT: "idle" },
    },
  },
});

const formatter = new Intl.NumberFormat("en-US");

function Invest() {
  const { address, network, kit, performActions } = useContractKit();

  const [current, send] = useMachine(InvestMachine);

  const [celoToInvest, setCeloToInvest] = useState("");
  const [monthlyEarning, setMonthlyEarning] = useState<BigNumber>(
    new BigNumber(0)
  );
  const [yearlyEarning, setYearlyEarning] = useState<BigNumber>(
    new BigNumber(0)
  );
  const [maxCeloToInvest, setMaxCeloToInvest] = useState(new BigNumber(0));
  const [unlockedCelo, setUnlockedCelo] = useState<BigNumber>();
  const [nonVotingLockedCelo, setNonVotingLockedCelo] = useState<BigNumber>();
  const [exchangeRate, setExchangeRate] = useState(0);
  const [estimatedAPY, setEstimatedAPY] = useState<BigNumber>(new BigNumber(0));
  const [validatorGroups, setValidatorGroups] = useState<any[]>([]);
  const [selectedVGAddress, setSelectedVGAddress] = useState<string>("");
  const [vgDialogOpen, setVGDialogOpen] = useState<boolean>(false);

  const selectedVG = useMemo<any>(() => {
    return validatorGroups.find((vg) => vg.Address === selectedVGAddress);
  }, [selectedVGAddress]);
  const [expandedVG, setExpandedVG] = useState(false);

  const { fetching: fetchingVG, error: errorFetchingVG, data } = useVG(true, 5);

  const state = useStore();

  useEffect(() => {
    fetchExchangeRate().then((rate) => setExchangeRate(rate));
    fetchTargetAPY().then((resp) =>
      setEstimatedAPY(new BigNumber(parseFloat(resp.target_apy)))
    );
  }, []);

  useEffect(() => {
    if (fetchingVG == false && errorFetchingVG == undefined) {
      setValidatorGroups(data["ValidatorGroups"]);
      setSelectedVGAddress(data["ValidatorGroups"][0].Address);
    }
  }, [fetchingVG, errorFetchingVG, data]);

  const fetchAccountData = useCallback(
    async (address: string) => {
      const [unlockedCelo, nonVotingLockedCelo] = await Promise.all([
        getCELOBalance(kit, address),
        getNonVotingLockedGold(kit, address),
      ]);

      return { unlockedCelo, nonVotingLockedCelo };
    },
    [address]
  );

  useEffect(() => {
    if (address == null) return;

    fetchAccountData(address).then(({ unlockedCelo, nonVotingLockedCelo }) => {
      setUnlockedCelo(unlockedCelo);
      setNonVotingLockedCelo(nonVotingLockedCelo);
      setMaxCeloToInvest(unlockedCelo.minus(1e18).plus(nonVotingLockedCelo));
    });
  }, [address]);

  useEffect(() => {
    if (celoToInvest === "") {
      setMonthlyEarning(new BigNumber(0));
      setYearlyEarning(new BigNumber(0));
      return;
    }

    const celoToInvestBN = new BigNumber(celoToInvest);
    const yearly = celoToInvestBN.times(estimatedAPY).div(100);
    const monthly = yearly.div(12);
    setMonthlyEarning(monthly);
    setYearlyEarning(yearly);
  }, [celoToInvest]);

  useEffect(() => {
    console.log("State machine:", current.value);
  }, [current.value]);

  const lockCELO = async (amount: BigNumber) => {
    if (!unlockedCelo) return;
    console.log("Locking CELO");
    console.log(amount.lt(unlockedCelo));
    try {
      await performActions(async (k) => {
        // await ensureAccount(k, k.defaultAccount);
        const lockedCelo = await k.contracts.getLockedGold();
        return lockedCelo.lock().sendAndWaitForReceipt({
          value: amount.toString(),
          from: k.defaultAccount,
        });
      });

      console.log("CELO locked");
      trackCELOLockedOrUnlockedOrWithdraw(
        amount.div(1e18).toNumber(),
        address,
        "lock"
      );
      send("NEXT");
    } catch (e) {
      console.log("Couldn't lock");
      console.error(e.message);
    }
  };

  const voteOnVG = async () => {
    if (selectedVGAddress == undefined || selectedVGAddress == null) return;

    if (!celoToInvest) return;

    try {
      await performActions(async (k) => {
        const election = await k.contracts.getElection();
        await (
          await election.vote(
            selectedVGAddress,
            new BigNumber(parseFloat(celoToInvest)).times(1e18)
          )
        ).sendAndWaitForReceipt({ from: k.defaultAccount });
      });

      trackVoteOrRevoke(
        parseFloat(celoToInvest),
        address,
        selectedVGAddress,
        "vote"
      );
      send("NEXT");
    } catch (e) {
      console.log("unable to vote", e.message);
    }
  };

  return (
    <Layout>
      <>
        <ReactTooltip place="top" type="dark" effect="solid" />
        <VoteVGDialog
          open={vgDialogOpen}
          setOpen={setVGDialogOpen}
          selectedVG={selectedVGAddress}
          setSelectedVG={setSelectedVGAddress}
          validatorGroups={validatorGroups}
        />
        <h1 className="text-2xl font-medium text-gray-dark">Invest CELO</h1>
        <main className="space-y-10 mt-10">
          {/* Amount Panel */}
          <div
            className={`border ${
              current.matches("idle")
                ? "border-gray-light"
                : "border-primary bg-primary-light-light"
            } rounded-md py-8 px-10`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center justify-start  space-x-3">
                <h3
                  className={`${
                    current.matches("idle")
                      ? "text-gray-dark"
                      : "text-primary-dark"
                  } text-xl`}
                >
                  Step 1: Investment Amount
                </h3>
                {current.matches("idle") ? (
                  <div
                    className="-mb-1"
                    data-tip="This is the amount of CELOs you want to invest to gain profits."
                  >
                    <InfoIcon />
                  </div>
                ) : (
                  <svg
                    viewBox="0 0 32 32"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M16 0C7.17794 0 0 7.17794 0 16C0 24.8221 7.17794 32 16 32C24.8221 32 32 24.8221 32 16C32 7.17794 24.8221 0 16 0ZM24.9424 11.7895L14.7168 21.9348C14.1153 22.5363 13.1529 22.5764 12.5113 21.9749L7.09774 17.0426C6.45614 16.4411 6.41604 15.4386 6.97744 14.797C7.57895 14.1554 8.58145 14.1153 9.22306 14.7168L13.5138 18.6466L22.6566 9.50376C23.2982 8.86215 24.3008 8.86215 24.9424 9.50376C25.584 10.1454 25.584 11.1479 24.9424 11.7895Z" />
                  </svg>
                )}
              </div>
              {!current.matches("idle") && (
                <p className="text-primary-light text-lg font-medium">
                  You are investing:{" "}
                  {parseFloat(celoToInvest == "" ? "0" : celoToInvest).toFixed(
                    2
                  )}{" "}
                  CELO (${" "}
                  {(
                    parseFloat(celoToInvest == "" ? "0" : celoToInvest) *
                    exchangeRate
                  ).toFixed(2)}
                  )
                </p>
              )}
            </div>
            <div className={`${!current.matches("idle") && "hidden"}`}>
              <div className="flex items-end mt-5">
                <div className="w-1/3">
                  <CeloInput
                    celoAmountToInvest={celoToInvest}
                    setCeloAmountToInvest={setCeloToInvest}
                    exchangeRate={exchangeRate}
                    maxAmount={maxCeloToInvest}
                  />
                </div>
                <div className="ml-5 mb-3 text-gray">
                  / out of {maxCeloToInvest.div(1e18).toFormat(2)} Total CELO ($
                  {maxCeloToInvest.div(1e18).times(exchangeRate).toFormat(2)})
                  in your Wallet
                </div>
              </div>
              <div className="mt-5 flex space-x-32">
                <div className="text-gray-dark">
                  <p className="text-sm">You could be earning</p>
                  <p className="mt-2 text-lg font-medium">
                    {estimatedAPY.toFormat(2)}% APY
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray">Yearly Earnings</p>
                  <div className="mt-2 space-x-5 flex items-baseline">
                    <p className="text-lg text-gray-dark">
                      {yearlyEarning.toFormat(2)} CELO
                    </p>
                    <p className="text-gray">
                      $ {yearlyEarning.times(exchangeRate).toFormat(2)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray">Monthly Earnings</p>
                  <div className="mt-2 space-x-5 flex items-baseline">
                    <p className="text-lg text-gray-dark">
                      {monthlyEarning.toFormat(2)} CELO
                    </p>
                    <p className="text-gray">
                      $ {monthlyEarning.times(exchangeRate).toFormat(2)}
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="transition-all text-lg font-medium block w-full rounded-md mt-5 py-3 bg-primary text-white hover:bg-primary-dark focus:bg-primary-dark focus:outline-none active:bg-primary-dark-dark"
                onClick={() => {
                  if (
                    unlockedCelo === undefined ||
                    nonVotingLockedCelo === undefined
                  )
                    return;
                  /* 
                - If celoToInvest is lesser than nonVotingLocked
                  - continue to next step 
                - If celoToInvest is higher than nonVotingLockedCelo and lesser than the sum of unlockedCelo and nonVotingLockedCelo
                  - Lock the required CELO
                - If celoToInvest is higher than the sum of nonVotingLockedCelo and unlockedCelo
                  - Error state.
                */
                  const celoToInvestBN = new BigNumber(
                    parseFloat(celoToInvest)
                  ).times(1e18);

                  if (nonVotingLockedCelo.gte(celoToInvestBN)) {
                    // if available locked celo is more than celoToInvest
                    console.log("Continue.");
                    send("NEXT");
                  } else if (
                    nonVotingLockedCelo.plus(unlockedCelo).gt(celoToInvestBN)
                  ) {
                    // if the total of nonVotingLockedCelo and unlocked Celo is greater than celoToInvesdt
                    console.log("need to lock CELO");

                    lockCELO(celoToInvestBN.minus(nonVotingLockedCelo));
                  } else if (
                    nonVotingLockedCelo.plus(unlockedCelo).lt(celoToInvestBN)
                  ) {
                    // can't move forward, error.
                    console.log("can't move forward, error.");
                  }
                }}
              >
                Confirm &amp; Continue
              </button>
            </div>
          </div>

          {/* Voting Panel */}
          <div
            className={`border ${
              current.matches("idle") || current.matches("voting")
                ? "border-gray-light"
                : "border-primary bg-primary-light-light"
            } rounded-md py-8 px-10`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start space-x-3">
                <h3
                  className={`${
                    current.matches("activating") ||
                    current.matches("completed")
                      ? "text-primary-dark"
                      : "text-gray-dark"
                  } text-xl`}
                >
                  Step 2: Vote For Validator
                </h3>
                {current.matches("activating") ||
                current.matches("completed") ? (
                  <svg
                    viewBox="0 0 32 32"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M16 0C7.17794 0 0 7.17794 0 16C0 24.8221 7.17794 32 16 32C24.8221 32 32 24.8221 32 16C32 7.17794 24.8221 0 16 0ZM24.9424 11.7895L14.7168 21.9348C14.1153 22.5363 13.1529 22.5764 12.5113 21.9749L7.09774 17.0426C6.45614 16.4411 6.41604 15.4386 6.97744 14.797C7.57895 14.1554 8.58145 14.1153 9.22306 14.7168L13.5138 18.6466L22.6566 9.50376C23.2982 8.86215 24.3008 8.86215 24.9424 9.50376C25.584 10.1454 25.584 11.1479 24.9424 11.7895Z" />
                  </svg>
                ) : (
                  <button
                    className="-mb-1"
                    data-tip="In order to invest CELOs, you need to cast vote towards electing Validator Groups on the network."
                  >
                    <InfoIcon />
                  </button>
                )}
              </div>
              {(current.matches("activating") ||
                current.matches("completed")) && (
                <p className="text-primary-light text-lg font-medium">
                  You are voting for: {selectedVG.Name}
                </p>
              )}
            </div>
            <div className={`${!current.matches("voting") && "hidden"}`}>
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
                  <button
                    className="text-primary flex items-center"
                    onClick={() => setVGDialogOpen(true)}
                  >
                    <span>
                      <svg
                        viewBox="0 0 32 32"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-primary mr-2"
                      >
                        <g clip-path="url(#clip0)">
                          <path d="M19.8984 5.39233L26.4079 11.9018L9.93051 28.3792L3.42468 21.8697L19.8984 5.39233ZM31.3474 3.8224L28.4444 0.919403C27.3225 -0.202505 25.5007 -0.202505 24.375 0.919403L21.5942 3.70018L28.1038 10.2097L31.3474 6.96608C32.2175 6.09586 32.2175 4.69255 31.3474 3.8224ZM0.0181145 31.0193C-0.100351 31.5525 0.381012 32.0302 0.914225 31.9005L8.168 30.1418L1.66216 23.6323L0.0181145 31.0193Z" />
                        </g>
                        <defs>
                          <clipPath id="clip0">
                            <rect width="32" height="32" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                    Edit Validator Group preference
                  </button>
                </div>
                <div className="border border-gray-light rounded-md pl-6 pr-12 py-5 mt-3">
                  <div className="flex">
                    <div className="flex items-center justify-center w-6">
                      <button
                        className="text-gray-dark mx-auto flex items-center justify-center rounded-full p-2 relative z-20 hover:bg-primary-light-light focus:outline-none"
                        onClick={() => setExpandedVG((curr) => !curr)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`${expandedVG ? "rotate-180" : "rotate-0"}
                              h-6 w-6 transform transition-all duration-200`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-5 gap-9 flex-1 text-center">
                      <div className="grid grid-rows-2 gap-2">
                        <span className="text-gray">Name</span>
                        <span className="text-gray-dark text-base">
                          {selectedVG?.Name}
                        </span>
                      </div>
                      <div className="grid grid-rows-2 gap-2">
                        <span className="text-gray">Group Score</span>
                        <span className="text-gray-dark text-base">
                          {selectedVG?.GroupScore
                            ? (selectedVG.GroupScore * 100).toFixed(2)
                            : "-"}{" "}
                          %
                        </span>
                      </div>
                      <div className="grid grid-rows-2 gap-2">
                        <span className="text-gray">Performance Score</span>
                        <span className="text-gray-dark text-base">
                          {selectedVG?.PerformanceScore
                            ? (selectedVG.PerformanceScore * 100).toFixed(2)
                            : "-"}{" "}
                          %
                        </span>
                      </div>
                      <div className="grid grid-rows-2 gap-2">
                        <span className="text-gray">Transparency Score</span>
                        <span className="text-gray-dark text-base">
                          {selectedVG?.TransparencyScore
                            ? (selectedVG.TransparencyScore * 100).toFixed(2)
                            : "-"}{" "}
                          %
                        </span>
                      </div>
                      <div className="grid grid-rows-2 gap-2">
                        <span className="text-gray">Estimated APY</span>
                        <span className="text-gray-dark text-base">
                          {selectedVG?.EstimatedAPY
                            ? selectedVG.EstimatedAPY.toFixed(2)
                            : "-"}{" "}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                  {expandedVG && (
                    <div className="pl-6 mt-5 grid grid-cols-7 text-center">
                      <div className="grid grid-rows-2 gap-2">
                        <span className="text-gray">
                          Elected/Total Validators
                        </span>
                        <div className="flex flex-wrap justify-center items-center">
                          {selectedVG.Validators.map((v) => (
                            <svg
                              key={v.address}
                              className={`h-4 w-4 ml-2 shadow-lg  ${
                                v.currently_elected
                                  ? "text-gray-dark"
                                  : "text-gray"
                              }`}
                              viewBox="0 0 32 32"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M31.9217 28.2182L25.8851 2.03636C25.53 0.872727 24.2102 0 23.5 0H8.5C7.61226 0 6.53233 0.872727 6.17724 2.03636L0.140599 28.2182C-0.392046 29.9636 0.673244 32 1.91608 32H29.9687C31.3891 32 32.2768 29.9636 31.9217 28.2182Z"
                                fill="currentColor"
                              />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-rows-2 gap-2">
                        <span className="text-gray">Recieved Votes</span>
                        <span className="text-gray-dark text-base">
                          {selectedVG?.RecievedVotes
                            ? formatter.format(selectedVG.RecievedVotes)
                            : "-"}{" "}
                          CELO
                        </span>
                      </div>
                      <div className="grid grid-rows-2 gap-2">
                        <span className="text-gray">Available Votes</span>
                        <span className="text-gray-dark text-base">
                          {selectedVG?.AvailableVotes
                            ? formatter.format(selectedVG.AvailableVotes)
                            : "-"}{" "}
                          CELO
                        </span>
                      </div>
                      <div className="grid grid-rows-2 gap-2">
                        <span className="text-gray">Epochs Served</span>
                        <span className="text-gray-dark text-base">
                          {selectedVG?.EpochsServed
                            ? formatter.format(selectedVG.EpochsServed)
                            : "-"}{" "}
                        </span>
                      </div>
                      <div className="grid grid-rows-2 gap-2">
                        <span className="text-gray">Locked CELO</span>
                        <span className="text-gray-dark text-base">
                          {selectedVG?.LockedCelo
                            ? formatter.format(selectedVG.LockedCelo)
                            : "-"}{" "}
                          CELO
                        </span>
                      </div>
                      <div className="grid grid-rows-2 gap-2">
                        <span className="text-gray">Slashing Penalty</span>
                        <span className="text-gray-dark text-base">
                          {selectedVG?.SlashingPenaltyScore
                            ? selectedVG.SlashingPenaltyScore.toFixed(2)
                            : "-"}{" "}
                        </span>
                      </div>
                      <div className="grid grid-rows-2 gap-2">
                        <span className="text-gray">
                          Attestation Percentage
                        </span>
                        <span className="text-gray-dark text-base">
                          {selectedVG?.AttestationScore
                            ? (selectedVG.AttestationScore * 100).toFixed(2)
                            : "-"}{" "}
                          %
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                className="font-medium text-lg block w-full rounded-md mt-5 py-3 transition-all bg-primary text-white hover:bg-primary-dark focus:bg-primary-dark focus:outline-none active:bg-primary-dark-dark"
                onClick={() => {
                  voteOnVG();
                }}
              >
                Confirm & Continue
              </button>
            </div>
          </div>

          {/* Activate Votes Panel */}
          <div className="border border-gray-light rounded-md py-8 px-10">
            <div className="flex items-center justify-start space-x-3">
              <h3 className="text-gray-dark text-xl">
                Step 3: Activate Investment
              </h3>
              <button
                className="-mb-1"
                data-tip="For security purposes, you need to Activate Vote in the next epoch. Only then the investment process will be complete."
              >
                <InfoIcon />
              </button>
            </div>
            <div className={`${!current.matches("activating") && "hidden"}`}>
              <p className="text-gray font-medium mt-5">Almost there!</p>
              <p className="text-gray mt-3">
                To finish your investment & start earning profits - please
                return back in a day.
              </p>
            </div>
          </div>
        </main>
      </>
    </Layout>
  );
}

export default Invest;
