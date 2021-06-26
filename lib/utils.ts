import { BigNumber } from "bignumber.js";
import axios from "axios";

export function calculateBarWidth(amount: BigNumber, total: BigNumber): string {
  const percent = amount.div(total).times(100);

  if (percent.isNaN()) return "0";
  return `${percent.toFormat(0)}%`;
}

export function floatToPercentage(amount: number): string {
  return new BigNumber(amount).times(100).toFormat(2);
}

export async function fetchExchangeRate(): Promise<number> {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=celo"
  );
  const data = response.data;
  return data[0]["current_price"];
}

export async function fetchTargetAPY() {
  const resp = await axios.get(
    "https://celo-on-chain-data-service.onrender.com/target-apy"
  );
  return resp.data;
}
