import Link from "next/link";
import React from "react";
import Layout from "../../../components/app/layout";

import useValidatorGroups from "../../../hooks/useValidatorGroups";
import { Validator, ValidatorGroup } from "../../../lib/types";

const formatter = new Intl.NumberFormat("en-US");
function ValidatorExplorer() {
  const { fetching, error, data: validatorGroups } = useValidatorGroups(true);
  return (
    <Layout>
      <div className="text-gray-dark">
        <div className="border-b-2 border-gray-light pb-5">
          <h3 className="font-medium text-2xl">Validator Groups</h3>
          <div className="mt-8 px-9 grid grid-cols-7 font-medium text-sm text-gray text-center">
            <p>Group Name</p>
            <p>Elected/Total Validators</p>
            <p>Recieved Votes</p>
            <p>Available Votes</p>
            <p>Transparency Score</p>
            <p>Performance Score</p>
            <p>Estimated APY</p>
          </div>
        </div>
        <div className="py-5 space-y-3">
          {validatorGroups?.ValidatorGroups.map((VG: ValidatorGroup) => (
            <Link href={`/app/validators/${VG.Address}`}>
              <div className="grid grid-cols-7 text-center font-medium px-9 py-6 border border-gray-light rounded-md cursor-pointer">
                <div>{VG.Name ? VG.Name : "Unkown Group"}</div>
                <div className="flex flex-wrap justify-center">
                  {VG.Validators.map((v: Validator) => (
                    <svg
                      className={`h-4 w-4 ml-2 shadow-lg  ${
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
                <div>{formatter.format(VG.RecievedVotes)} CELO</div>
                <div>{formatter.format(VG.AvailableVotes)} CELO</div>
                <div>{(VG.TransparencyScore * 100).toFixed(0)} %</div>
                <div>{(VG.PerformanceScore * 100).toFixed(2)} %</div>
                <div>{VG.EstimatedAPY.toFixed(2)} %</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default ValidatorExplorer;
