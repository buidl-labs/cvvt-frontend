import React, { useEffect, useState } from "react";
import StatCard from "./stat-card";
import useStore from "../../store/store";
import { fetchExchangeRate } from "../../lib/utils";

export default function StatGrid({ advanced }: { advanced: boolean }) {
  const [exchangeRate, setExchangeRate] = useState<number | undefined>(
    undefined
  );
  const balances = useStore((state) => state.userBalances);
  useEffect(() => {
    fetchExchangeRate().then((rate) => setExchangeRate(rate));
  }, []);

  return (
    <>
      <ul
        className={`text-gray-dark grid gap-10 ${
          advanced ? "grid-cols-4" : "grid-cols-3"
        }`}
      >
        {advanced ? (
          <>
            <StatCard
              label="Total CELO"
              labelColor="text-gray-dark"
              value={balances.totalCelo}
              tipText={
                "Total CELOs present in your account, including Unlocked, Locked & Activated CELOs"
              }
              exchangeRate={exchangeRate}
            />
            <StatCard
              label="Unlocked CELO"
              labelColor="text-primary"
              value={balances.unlockedCelo}
              tipText={"CELO which has not been locked yet."}
              exchangeRate={exchangeRate}
            />
            <StatCard
              label="Locked CELO"
              labelColor="text-secondary"
              value={balances.nonVotingLockedCelo}
              tipText={"CELO held in escrow at the Locked Gold contract."}
              exchangeRate={exchangeRate}
            />
            <StatCard
              label="Voting CELO"
              labelColor="text-accent-dark"
              value={balances.votingLockedCelo}
              tipText={"CELO that has been locked, and voted with."}
              exchangeRate={exchangeRate}
            />
          </>
        ) : (
          <>
            <StatCard
              label="Total CELO"
              labelColor="text-gray-dark"
              value={balances.totalCelo}
              exchangeRate={exchangeRate}
              tipText={
                "Total CELO present in your account, including Invested & Waiting for Activation CELOs."
              }
            />
            <StatCard
              label="Invested CELO"
              labelColor="text-secondary"
              value={balances.votingLockedCelo}
              exchangeRate={exchangeRate}
              tipText={
                "CELO that has been invested, including activated and pending votes."
              }
            />
            <StatCard
              label="CELO available to invest"
              labelColor="text-primary"
              value={balances.nonVotingLockedCelo.plus(balances.unlockedCelo)}
              exchangeRate={exchangeRate}
              tipText={"CELO amount that you can invest."}
            />
          </>
        )}
      </ul>
    </>
  );
}
