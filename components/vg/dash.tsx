import Link from "next/link";
import React, { useEffect, useState } from "react";
import useVG from "../../hooks/useVG";
import { Validator, ValidatorGroup } from "../../lib/types";
import useStore from "../../store/vg-store";
import TransparencyScoreBar from "./transparency-score-bar";
import WelcomeHeading from "./welcome-heading";

const formatter = new Intl.NumberFormat("en-US");
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
              <TransparencyScoreBar score={Number(VG.TransparencyScore)} />
              <NavButtons />
              <PerformanceMetricsPanel VG={VG} />
              <ValidatorsPanel VG={VG} />
            </>
          );
        }
      })()}
    </>
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
          <div className="text-2xl font-medium flex flex-wrap">
            {VG.Validators.map((v) => (
              <svg
                className={`h-5 w-5 ml-2 mt-0.5 ${
                  v.currently_elected ? "text-gray-dark" : "text-gray"
                }`}
                viewBox="0 0 32 32"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M31.9217 28.2182L25.8851 2.03636C25.53 0.872727 24.2102 0 23.5 0H8.5C7.61226 0 6.53233 0.872727 6.17724 2.03636L0.140599 28.2182C-0.392046 29.9636 0.673244 32 1.91608 32H29.9687C31.3891 32 32.2768 29.9636 31.9217 28.2182Z"
                  fill="currentColor"
                />
              </svg>
            ))}
          </div>
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
          <p className="text-base font-medium">
            {formatter.format(VG.RecievedVotes)} CELO
          </p>
        </div>
        <div className="grid grid-rows-2 gap-1 text-center">
          <p className="text-sm text-gray">Available Votes</p>
          <p className="text-base font-medium">
            {formatter.format(VG.AvailableVotes)} CELO
          </p>
        </div>
        <div className="grid grid-rows-2 gap-1 text-center">
          <p className="text-sm text-gray">Epochs Served</p>
          <p className="text-base font-medium">
            {formatter.format(VG.EpochsServed)}
          </p>
        </div>
        <div className="grid grid-rows-2 gap-1 text-center">
          <p className="text-sm text-gray">Locked CELO</p>
          <p className="text-base font-medium">
            {formatter.format(VG.LockedCelo)} CELO
          </p>
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

function ValidatorsPanel({ VG }: { VG: ValidatorGroup }) {
  return (
    <div className="mt-10 border border-gray-light rounded-md p-10 text-gray-dark">
      <div className="flex items-baseline justify-between">
        <h4 className="text-xl font-medium">Affiliated Validators</h4>
        <p className="font-medium">
          Group Share: {(VG.GroupShare * 100).toFixed(0)}%
        </p>
      </div>
      <div className="grid grid-cols-2 gap-5 mt-5">
        {VG.Validators.map((v) => (
          <ValidatorBlock validator={v} />
        ))}
      </div>
    </div>
  );
}

function ValidatorBlock({ validator }: { validator: Validator }) {
  return (
    <div className="border border-gray-light rounded-md px-5 py-3">
      <div className="flex items-baseline justify-between">
        <h5 className="font-medium">
          {validator.name ? validator.name : "Unknown Validator"}
        </h5>
        <p
          className={`${
            validator.currently_elected ? "text-gray-dark" : "text-gray"
          } flex items-center`}
        >
          <svg
            className={`h-4 w-4`}
            viewBox="0 0 32 32"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.9217 28.2182L25.8851 2.03636C25.53 0.872727 24.2102 0 23.5 0H8.5C7.61226 0 6.53233 0.872727 6.17724 2.03636L0.140599 28.2182C-0.392046 29.9636 0.673244 32 1.91608 32H29.9687C31.3891 32 32.2768 29.9636 31.9217 28.2182Z"
              fill="currentColor"
            />
          </svg>
          <span className="ml-3 mt-0.5">
            {validator.currently_elected ? "Elected" : "Refused"}
          </span>
        </p>
      </div>

      <p className="text-gray text-sm mt-2">{validator.address}</p>
    </div>
  );
}
