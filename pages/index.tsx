import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BigNumber } from "bignumber.js";
import Nav from "../components/home/nav";
import HeroIllustration from "../components/home/hero-illustration";
import { fetchExchangeRate, fetchTargetAPY } from "../lib/utils";

export default function Home() {
  return (
    <div>
      <Nav />
      <main className="mt-32">
        <div className="px-36 grid grid-cols-2 gap-y-16">
          <div className="text-gray-dark">
            <div className="text-secondary-dark text-sm">
              Invest • Earn • Grow
            </div>
            <h2 className="mt-3 font-serif text-4xl">
              Earn Profits by Investing CELO
            </h2>
            <p className="mt-5 leading-relaxed">
              Simple & smart way to put CELOs to work & earn profits on the go!
              <br />
              All you need to get started is a Celo Wallet and some CELOs in it.
              <br />
              Investing CELOs has never been this easy. Let’s get started.
            </p>
            <div className="mt-10 space-x-4 text-lg">
              <Link href="/app/dashboard" passHref>
                <a className="inline-block px-14 py-2 border-2 border-primary bg-primary text-white font-medium rounded-md shadow-md">
                  Start Investing
                </a>
              </Link>
              <Link href="/how" passHref>
                <a className="inline-block px-14 py-2 bg-white text-primary border-2 border-primary font-medium rounded-md shadow-md">
                  How it works?
                </a>
              </Link>
            </div>
            <div className="mt-20">
              <HeroIllustration />
            </div>
          </div>
          <div>
            <EarningCalculator />
          </div>
        </div>
      </main>
    </div>
  );
}

function EarningCalculator() {
  const [exchangeRate, setExchangeRate] = useState(0);
  const [estimatedAPY, setEstimatedAPY] = useState(new BigNumber(0));
  const [celoAmountToInvest, setCeloAmountToInvest] = useState("1000.00");
  const celoToInvestInUSD = useMemo(
    () => parseFloat(celoAmountToInvest) * exchangeRate,
    [celoAmountToInvest, exchangeRate]
  );
  const yearlyEarning = useMemo(() => {
    if (celoAmountToInvest === "") return new BigNumber(0);
    return new BigNumber(celoAmountToInvest).times(estimatedAPY).div(100);
  }, [celoAmountToInvest, estimatedAPY]);
  const yearlyEarningInUSD = useMemo(
    () => yearlyEarning.times(exchangeRate),
    [yearlyEarning, exchangeRate]
  );

  const monthlyEarning = useMemo(() => yearlyEarning.div(12), [yearlyEarning]);
  const monthlyEarningInUSD = useMemo(
    () => monthlyEarning.times(exchangeRate),
    [monthlyEarning, exchangeRate]
  );

  useEffect(() => {
    fetchExchangeRate().then((resp) => setExchangeRate(resp));
    fetchTargetAPY().then((resp) =>
      setEstimatedAPY(new BigNumber(parseFloat(resp.target_apy)))
    );
  }, []);
  return (
    <div className="p-10 text-gray-dark border border-gray-light rounded-md">
      <h3 className="text-xl font-medium">Calculate Your Earnings</h3>
      <div className="mt-5">
        <label htmlFor="amount" className="block text-sm text-gray-dark">
          If you invest this much CELO:
        </label>

        <div className="relative mt-2.5 w-full rounded-md shadow-sm text-left cursor-default focus:outline-none text-gray-dark-dark">
          <input
            type="number"
            name="amount"
            id="amount"
            className="block w-full h-full px-5 py-4 text-xl bg-gray-light-light border border-gray-light rounded-md focus:border-primary focus:ring-primary focus:bg-primary-light-light"
            placeholder="0.00 CELO"
            value={celoAmountToInvest}
            onChange={(e) => setCeloAmountToInvest(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <label htmlFor="currency" className="sr-only">
              Currency
            </label>
            <div className="h-full py-0 pl-2 pr-7 text-lg rounded-md flex items-center justify-center text-primary">
              <span>
                $ {celoToInvestInUSD ? celoToInvestInUSD.toFixed(2) : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <p className="text-sm">You could be earning:</p>
        <div className="flex items-center mt-3">
          <p className="text-3xl text-primary font-medium">
            {estimatedAPY ? `${estimatedAPY.toFixed(2)}%` : "-"} APY
          </p>
          <p className="text-gray ml-5">(Annual Percentage Yield)</p>
        </div>
        <div className="mt-5">
          <p className="text-gray text-sm">Yearly Earning</p>
          <div className="flex justify-between items-baseline mt-2">
            <p>{yearlyEarning.toFixed(2)} CELO</p>
            <p className="text-gray">$ {yearlyEarningInUSD.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-5">
          <p className="text-gray text-sm">Monthly Earning</p>
          <div className="flex justify-between items-baseline mt-2">
            <p>{monthlyEarning.toFixed(2)} CELO</p>
            <p className="text-gray">${monthlyEarningInUSD.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
