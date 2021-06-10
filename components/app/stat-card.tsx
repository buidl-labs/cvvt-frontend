import { useMemo } from "react";
import CeloCoin from "../icons/celo-coin";
import InfoIcon from "../icons/info";

function weiToCelo(wei: any): string {
  return wei.div(1e18).toFormat(2);
}

export default function StatCard({
  label,
  labelColor,
  value,
  exchangeRate,
}: {
  label: string;
  labelColor: string;
  value: any;
  exchangeRate: number | undefined;
}) {
  const displayValue = useMemo(() => {
    return weiToCelo(value);
  }, [value.toString()]);

  return (
    <li className="px-10 py-7 flex flex-col border border-gray-light rounded-md space-y-2.5">
      <div className="flex justify-between items-center">
        <div className={`flex items-center ${labelColor}`}>
          <CeloCoin />
          <h4 className="text-sm font-medium ml-2.5">{label}</h4>
        </div>
        <InfoIcon />
      </div>
      <p className="text-xl font-medium">
        {displayValue} <span className="text-base">CELO</span>
      </p>

      <p className="text-sm text-gray">
        {exchangeRate ? value.div(1e18).times(exchangeRate).toFormat(2) : "..."}{" "}
        USD
      </p>
    </li>
  );
}
