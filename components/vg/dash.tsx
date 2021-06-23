import Link from "next/link";
import React, { useEffect, useState } from "react";
import useVG from "../../hooks/useVG";
import { ValidatorGroup } from "../../lib/types";
import useStore from "../../store/vg-store";

export default function VGDash() {
  const [VG, setVG] = useState<ValidatorGroup>();
  const user = useStore((state) => state.user);
  const { fetching, error, data: validatorGroup } = useVG(user);
  console.log(fetching, error, validatorGroup);

  useEffect(() => {
    if (!fetching && !error) {
      setVG(validatorGroup["ValidatorGroup"]);
    }
  }, [fetching, validatorGroup]);

  return (
    <>
      {(() => {
        if (error) {
          console.log(error);
        } else if (!fetching && VG) {
          return (
            <>
              <WelcomeHeading name={VG.Name} address={VG.Address} />
              <TransparencyScoreBar score={Number(VG?.TransparencyScore)} />
              <NavButtons />
              <PerformanceMetricsPanel VG={VG} />
            </>
          );
        }
      })()}
    </>
  );
}

function WelcomeHeading({ name, address }: { name: string; address: string }) {
  return (
    <h1 className="text-2xl text-gray-dark font-medium">
      Welcome, {name ? name : `${address.slice(0, 3)}...${address.slice(-5)}`}
    </h1>
  );
}

function TransparencyScoreBar({ score }: { score: number }) {
  return (
    <div className="space-y-5 mt-6">
      <p className="text-gray-dark">
        Complete your profile to increase your Transparency Score:{" "}
        <span className="ml-1 text-2xl font-medium">
          {(score * 100).toFixed(0)}/100%
        </span>
      </p>
      <div className="border border-white rounded-full h-4 flex overflow-hidden bg-primary-light-light">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${score * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

function NavButtons() {
  return (
    <div className="mt-10 space-x-4 text-center">
      <Link href="/vg/edit" passHref>
        <a className="inline-block px-11 py-3 border-2 border-primary bg-primary text-white font-medium rounded-md">
          Complete Your Profile
        </a>
      </Link>
      <Link href="/vg/profile" passHref>
        <a className="inline-block px-11 py-3 bg-white text-primary border-2 border-primary font-medium rounded-md">
          View Your Profile
        </a>
      </Link>
    </div>
  );
}

function PerformanceMetricsPanel({ VG }: { VG: ValidatorGroup }) {
  return (
    <div className="mt-10 border border-gray-light rounded-md p-10 text-gray-dark">
      <h4 className="text-xl font-medium">Performance Metrics</h4>
      {/* first row in performance metrics panel */}
      <div className="grid grid-cols-4 mt-5 gap-28">
        <div className="grid grid-rows-2 gap-1 text-left">
          <p className="text-sm text-gray">Elected/Total Validators</p>
          <p className="text-2xl font-medium">1/2</p>
        </div>
        <div className="grid grid-rows-2 gap-1 text-center">
          <p className="text-sm text-gray">Transparency Score</p>
          <p className="text-2xl font-medium">
            {(VG.TransparencyScore * 100).toFixed(2)}/100
          </p>
        </div>
        <div className="grid grid-rows-2 gap-1 text-center">
          <p className="text-sm text-gray">Performance Score</p>
          <p className="text-2xl font-medium">
            {(VG.PerformanceScore * 100).toFixed(2)}/100
          </p>
        </div>
        <div className="grid grid-rows-2 gap-1 text-center">
          <p className="text-sm text-gray">Estimated APY</p>
          <p className="text-2xl font-medium">{VG.EstimatedAPY.toFixed(2)}%</p>
        </div>
      </div>
      {/* second row in performance metrics panel */}
      <div className="grid grid-cols-6 mt-10 gap-20">
        <div className="grid grid-rows-2 gap-1 text-center">
          <p className="text-sm text-gray">Recieved Votes</p>
          <p className="text-base font-medium">{VG.RecievedVotes}</p>
        </div>
        <div className="grid grid-rows-2 gap-1 text-center">
          <p className="text-sm text-gray">Available Votes</p>
          <p className="text-base font-medium">{VG.AvailableVotes}</p>
        </div>
        <div className="grid grid-rows-2 gap-1 text-center">
          <p className="text-sm text-gray">Epochs Served</p>
          <p className="text-base font-medium">{VG.EpochsServed}</p>
        </div>
        <div className="grid grid-rows-2 gap-1 text-center">
          <p className="text-sm text-gray">Locked CELO</p>
          <p className="text-base font-medium">{VG.LockedCelo} CELO</p>
        </div>
        <div className="grid grid-rows-2 gap-1 text-center">
          <p className="text-sm text-gray">Slashing Score</p>
          <p className="text-base font-medium">
            {VG.SlashingPenaltyScore.toFixed(2)}
          </p>
        </div>
        <div className="grid grid-rows-2 gap-1 text-center">
          <p className="text-sm text-gray">Group Score</p>
          <p className="text-base font-medium">
            {(VG.GroupScore * 100).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}
