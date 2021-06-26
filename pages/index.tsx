import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BigNumber } from "bignumber.js";
import Nav from "../components/home/nav";
import HeroIllustration from "../components/home/hero-illustration";
import { fetchExchangeRate, fetchTargetAPY } from "../lib/utils";
import FeatureIllustrationOne from "../components/home/feature-illustration-one";
import FeatureIllustrationTwo from "../components/home/feature-illustration-two";
import FeatureIllustrationThree from "../components/home/feature-illustration-three";

export default function Home() {
  return (
    <div>
      <Nav />
      <main className="my-32">
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
        <div className="mt-28 relative">
          <div className="absolute top-0">
            <svg
              width="542"
              height="254"
              viewBox="0 0 542 254"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-8.42555 201.127L10.9552 202.105C100.929 206.643 189.314 177.148 258.532 119.488V119.488V119.488C336.031 68.7295 426.12 40.526 518.728 38.03L525.489 37.8477"
                stroke="#FDEABD"
              />
              <g clip-path="url(#clip0)">
                <path
                  d="M523.563 28.6451C519.834 27.5837 515.74 30.4919 514.419 35.1419C513.097 39.7926 515.051 44.4225 518.78 45.4832C522.51 46.5458 526.607 43.6365 527.926 38.9869C529.246 34.3354 527.293 29.7076 523.563 28.6451Z"
                  fill="#FCDB8C"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect
                    width="16.734"
                    height="16.743"
                    fill="white"
                    transform="translate(511 31.0126) rotate(-14.2654)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-gray text-sm">A simple and smart way of</p>
            <p className="mt-5  text-3xl font-serif">Putting CELOs to Work</p>
            <FeatureGrid />
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

function FeatureGrid() {
  const features = [
    {
      asset: <FeatureIllustrationOne />,
      heading: "Start with 1 CELO",
      subtext:
        "Start earning profits with as low as 1 CELO in your wallet. The more you hold & invest, the more you earn.",
    },
    {
      asset: <FeatureIllustrationTwo />,
      heading: "Earn Automatically",
      subtext:
        "The CELOs earned in profit automatically gets added to your invested CELO for compounding.",
    },
    {
      asset: <FeatureIllustrationThree />,
      heading: "Earn without Risk",
      subtext:
        "When you invest CELO the invested CELO is never exposed to slashing, making it a risk free investment.",
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-x-20 mt-16 px-56">
      {features.map((f) => (
        <FeatureItem asset={f.asset} heading={f.heading} subtext={f.subtext} />
      ))}
    </div>
  );
}

function FeatureItem({
  asset,
  heading,
  subtext,
}: {
  asset: JSX.Element;
  heading: string;
  subtext: string;
}) {
  return (
    <div className="flex flex-col items-center">
      {asset}
      <h4 className="mt-10 text-xl font-medium">{heading}</h4>
      <p className="mt-5 text-gray">{subtext}</p>
    </div>
  );
}
