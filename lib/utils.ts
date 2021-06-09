import {BigNumber} from "bignumber.js"
export function calculateBarWidth(amount: BigNumber, total: BigNumber): string {
  const percent = amount.div(total).times(100);

  if (percent.isNaN()) return "0";
  return `${percent.toFormat(0)}%`;
}