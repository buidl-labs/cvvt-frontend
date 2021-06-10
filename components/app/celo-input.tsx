import React, { useMemo } from "react";
import { BigNumber } from "bignumber.js";

const CeloInput = ({
  celoAmountToInvest,
  setCeloAmountToInvest,
  exchangeRate,
  nonVotingLockedCelo,
}: {
  celoAmountToInvest: string;
  setCeloAmountToInvest: React.Dispatch<React.SetStateAction<string>>;
  exchangeRate: number;
  nonVotingLockedCelo: BigNumber;
}) => {
  const celoToInvestInUSD = useMemo((): number => {
    if (celoAmountToInvest === "") return 0;

    return parseFloat(celoAmountToInvest) * exchangeRate;
  }, [exchangeRate, celoAmountToInvest]);

  return (
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
              nonVotingLockedCelo.div(1e18).minus(0.5).toFormat(2)
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
            <span>$ {celoToInvestInUSD.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CeloInput;
