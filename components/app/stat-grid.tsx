import { useEffect, useState } from "react";
import StatCard from "./stat-card";
import useStore from "../../store/store";
import { fetchExchangeRate } from "../../lib/utils";

export default function StatGrid() {
  const [exchangeRate, setExchangeRate] =
    useState<number | undefined>(undefined);
  const balances = useStore((state) => state.userBalances);
  useEffect(() => {
    fetchExchangeRate().then((rate) => setExchangeRate(rate));
  }, []);

  return (
    <ul className="mt-10 grid gap-10 grid-cols-4">
      <StatCard
        label="Total CELO"
        labelColor="text-gray-dark"
        value={balances.totalCelo}
        exchangeRate={exchangeRate}
      />
      <StatCard
        label="Unlocked CELO"
        labelColor="text-primary"
        value={balances.unlockedCelo}
        exchangeRate={exchangeRate}
      />
      <StatCard
        label="Locked CELO"
        labelColor="text-secondary"
        value={balances.nonVotingLockedCelo}
        exchangeRate={exchangeRate}
      />
      <StatCard
        label="Voting CELO"
        labelColor="text-accent-dark"
        value={balances.votingLockedCelo}
        exchangeRate={exchangeRate}
      />
    </ul>
  );
}
