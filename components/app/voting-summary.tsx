import Link from "next/link";
import React from "react";
import ReactTooltip from "react-tooltip";
import InfoIcon from "../icons/info";

export default function VotingSummary({
  votingSummary,
  loading,
  showWithdraw = false,
}: {
  votingSummary: any;
  loading: boolean;
  showWithdraw?: boolean;
}) {
  return (
    <div className="mt-10 pt-8">
      <ReactTooltip place="top" type="dark" effect="solid" />
      <div className="flex justify-start space-x-3 items-center">
        <h3 className="text-xl font-medium">
          Current {showWithdraw ? "Investment" : "Voting"} Summary
        </h3>
        <button
          data-tip={
            "This summary highlights the performance & returns of your invested CELO"
          }
          className="-mb-1"
        >
          <InfoIcon />
        </button>
      </div>
      <div className="overflow-hidden border border-gray-light rounded-lg shadow-sm mt-5">
        <table className="min-w-full divide-y divide-gray-light">
          <thead className="border-b border-gray-light">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-normal text-gray tracking-wider"
              >
                Validator Group
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center text-sm font-normal text-gray tracking-wider"
              >
                Voting Status
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center text-sm font-normal text-accent-light tracking-wider"
              >
                Pending CELO
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center font-normal text-sm text-accent-dark tracking-wider"
              >
                Activated CELO
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-light">
            {votingSummary.map((group: any) => (
              <tr key={group.vg} className="mt-2.5">
                <td className="px-6 py-4 whitespace-nowrap text-left text-gray-dark">
                  {group.name}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-center ${
                    group.pending.gt(0)
                      ? "text-accent-dark"
                      : "text-primary-dark"
                  } `}
                >
                  {group.pending.gt(0) ? "Pending" : "Activated"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-dark">
                  {group.pending.div(1e18).toFormat(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-dark">
                  {group.active.div(1e18).toFormat(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(() => {
          if (loading) {
            return (
              <p className="w-full flex py-4 justify-center items-center text-gray">
                Loading your investments...
              </p>
            );
          } else if (votingSummary.length == 0) {
            return (
              <p className="w-full flex py-4 justify-center items-center text-gray">
                You've no current investments.
              </p>
            );
          }
        })()}
      </div>
      {showWithdraw && votingSummary.length > 0 && (
        <Link href="/app/withdraw" passHref>
          <a className="border-2 border-alert py-2 mt-7 text-lg font-medium rounded-md text-alert shadow flex justify-center">
            Withdraw Investments
          </a>
        </Link>
      )}
    </div>
  );
}
