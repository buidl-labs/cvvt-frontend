import CeloCoin from "../../icons/celo-coin";
import InfoIcon from "../../icons/info";

export default function StatCard({
  label,
  labelColor,
  value,
}: {
  label: string;
  labelColor: string;
  value: number;
}) {
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
        {value} <span className="text-base">CELO</span>
      </p>

      <p className="text-sm text-gray">Stat subtext</p>
    </li>
  );
}
