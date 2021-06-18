import Layout from "../../components/app/layout";

import React, { useEffect, useState } from "react";
import {
  fetchPendingWithdrawals,
  getVGName,
  getVotingSummary,
} from "../../lib/celo";
import { useContractKit } from "@celo-tools/use-contractkit";
import { PendingWithdrawal } from "@celo/contractkit/lib/wrappers/LockedGold";
import useStore from "../../store/store";
import { GroupVoting } from "../../lib/types";

function Withdraw() {
  /* 
    1. Current votes
      - ability to unvote and unlock
    2. Current withdrawals
      - Show when they will be ready for withdrawal 
      - If a withdrawal is ready for withdrawal, action button to withdraw
  */
  const [votingSummary, setVotingSummary] = useState<GroupVoting[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<
    PendingWithdrawal[]
  >([]);
  const { address, network, kit, performActions } = useContractKit();
  const state = useStore();

  useEffect(() => {
    state.setUser(address);
    state.setNetwork(network.name);
    getVotingSummary(kit, address)
      .then((groupVotes) =>
        Promise.all(
          groupVotes.map(async (group) => ({
            vg: group.group,
            name: await getVGName(kit, group.group),
            active: group.active,
            pending: group.pending,
          }))
        )
      )
      .then((summary) => setVotingSummary(summary));
    fetchPendingWithdrawals(kit, address).then(({ pendingWithdrawals }) =>
      setPendingWithdrawals(pendingWithdrawals)
    );
  }, []);

  return (
    <Layout
      disconnectWallet={async () => {
        console.log("Disconnect wallet");
      }}
    >
      <div>
        <h3 className="text-gray-dark font-medium text-2xl">
          Withdraw Invested CELO
        </h3>
        <div>
          <h4 className="text-gray-dark text-xl font-medium">
            Current Investment Summary
          </h4>
          <div className="mt-10 pt-8">
            <h3 className="text-xl font-medium">Current Voting Summary</h3>
            <div className="overflow-hidden border border-gray-light rounded-lg shadow-sm mt-5">
              <table className="min-w-full divide-y divide-gray-light">
                <thead className="border-b border-gray-light">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-sm font-normal text-gray tracking-wider"
                    >
                      Validator Group
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-4 text-center font-normal text-sm text-accent-dark tracking-wider"
                    >
                      Activated CELO
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center font-normal text-sm text-accent-dark tracking-wider"
                    >
                      Total Invested CELO
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center font-normal text-sm text-gray tracking-wider"
                    >
                      Withdraw Invested CELO
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-light">
                  {votingSummary.map((group: any) => (
                    <tr key={group.vg} className="mt-2.5 text-base">
                      <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-gray-dark">
                        {group.name}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-dark">
                        {group.active.div(1e18).toFormat(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-dark">
                        {group.active.plus(group.pending).div(1e18).toFormat(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-dark">
                        <button className="border-4 rounded-md  text-alert font-medium shadow-sm text-base px-4 py-2">
                          Unvote & Unlock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* <div className="overflow-hidden border border-gray-light rounded-lg shadow-sm mt-5">
            <table className="min-w-full divide-y divide-gray-light">
              <thead className="border-b border-gray-light">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-center text-sm font-normal text-gray tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-center text-sm font-normal text-accent-light tracking-wider"
                  >
                    CELO to withdraw
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-center font-normal text-sm text-accent-dark tracking-wider"
                  >
                    Withdrawable
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-4 text-center font-normal text-sm text-gray tracking-wider"
                  >
                    Withdraw Invested CELO
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-light">
                {pendingWithdrawals.map((w: PendingWithdrawal) => (
                  <tr key={w.time.toString()} className="mt-2.5 text-base">
                    <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-gray-dark">
                      {group.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-dark">
                      {group.pending.div(1e18).toFormat(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-dark">
                      {group.active.div(1e18).toFormat(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-dark">
                      <button className="border-4 rounded-md  text-alert font-medium shadow-sm text-base px-4 py-2">
                        Unvote & Unlock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}
          <pre>{JSON.stringify(pendingWithdrawals, null, 2)}</pre>
        </div>
      </div>
    </Layout>
  );
}

export default Withdraw;
