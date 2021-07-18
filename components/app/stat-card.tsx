import React, { useMemo } from "react";
import ReactTooltip from "react-tooltip";
import CeloCoin from "../icons/celo-coin";
import InfoIcon from "../icons/info";

function weiToCelo(wei: any): string {
  return wei.div(1e18).toFormat(2);
}

export default function StatCard({
  label,
  labelColor,
  value,
  tipText,
  exchangeRate,
}: {
  label: string;
  labelColor: string;
  value: any;
  tipText: string;
  exchangeRate: number | undefined;
}) {
  const displayValue = useMemo(() => {
    return weiToCelo(value);
  }, [value.toString()]);

  return (
    <>
      <ReactTooltip place="top" type="dark" effect="solid" />
      <li className="px-10 py-7 flex flex-col border border-gray-light rounded-md space-y-2.5">
        <div className="flex justify-between items-center">
          <div className={`flex items-center ${labelColor}`}>
            <CeloCoin />
            <h4 className="text-sm font-medium ml-2.5">{label}</h4>
          </div>
          <button data-tip={tipText}>
            <InfoIcon />
          </button>
        </div>
        <p className="text-xl font-medium">
          {displayValue} <span className="text-base">CELO</span>
        </p>

        <p className="text-sm text-gray">
          {exchangeRate
            ? value.div(1e18).times(exchangeRate).toFormat(2)
            : "..."}{" "}
          USD
        </p>
      </li>
    </>
  );
}
