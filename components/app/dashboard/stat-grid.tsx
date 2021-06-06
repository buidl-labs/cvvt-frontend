import { useEffect, useState } from "react";
import StatCard from "./stat-card";
import useStore from "../../../store/store";
import axios from "axios";
import { BigNumber } from "bignumber.js";

async function fetchExchangeRate(): Promise<number> {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=celo"
  );
  const data = response.data;
  return data[0]["current_price"];
}

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
