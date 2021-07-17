import { Transition } from "@headlessui/react";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { spawn } from "xstate";
import Footer from "../../components/home/footer";
import Nav from "../../components/home/nav";
import useValidatorGroups from "../../hooks/useValidatorGroups";
import { Validator, ValidatorGroup } from "../../lib/types";

const formatter = new Intl.NumberFormat("en-US");

enum Order {
  ASC,
  DESC,
}

type SortStatus = {
  key: string;
  order: Order;
};

const FIELDS = [
  {
    name: "Group Name",
    key: "name",
  },
  {
    name: "Elected/Total Validators",
    key: "validators",
  },
  {
    name: "Recieved Votes",
    key: "recieved",
  },
  {
    name: "Available Votes",
    key: "available",
  },
  {
    name: "Attestation Score",
    key: "attestation",
  },
  {
    name: "Overall Score",
    key: "score",
  },
  {
    name: "Estimated APY",
    key: "apy",
  },
];

function ValidatorExplorer() {
  const [validatorGroups, setValidatorGroups] = useState([]);
  const [sortStatus, setSortStatus] = useState<SortStatus>({
    key: "score",
    order: Order.DESC,
  });

  const {
    fetching,
    error,
    data: validatorGroupsFromAPI,
  } = useValidatorGroups(true);

  useEffect(() => {
    if (fetching || error) return;

    if (validatorGroupsFromAPI?.ValidatorGroups.length > 0) {
      setValidatorGroups(validatorGroupsFromAPI.ValidatorGroups);
    }
  }, [fetching, validatorGroupsFromAPI]);

  const handleSort = (key: string) => {
    if (sortStatus.key == key)
      setSortStatus((currStatus) => ({
        key,
        order: currStatus.order == Order.ASC ? Order.DESC : Order.ASC,
      }));
    else setSortStatus({ key, order: Order.DESC });

    console.log(sortStatus);
  };

  return (
    <div className="text-gray-dark">
      <Nav />
      <div className="flex flex-col">
        <div className="px-40 py-10 border-b border-gray-light shadow">
          <h3 className="font-medium text-2xl">Validator Groups</h3>
          <div className="mt-8 px-9 grid grid-cols-7 font-medium text-sm text-gray text-center">
            {FIELDS.map((f) => (
              <button
                key={f.key}
                onClick={() => handleSort(f.key)}
                className={`hover:text-gray-dark focus:ring-2 focus:ring-primary focus:text-gray-dark transition-all rounded py-2 flex items-center justify-center ${
                  sortStatus.key == f.key && "text-gray-dark"
                }`}
              >
                <span>{f.name}</span>
                {sortStatus.key == f.key && (
                  <span className="ml-0.5">
                    {sortStatus.order == Order.ASC ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <Transition
          show={fetching}
          enter="transition-opacity duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-50"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-x-0 inset-y-0 bg-white bg-opacity-70 flex justify-center items-center text-xl">
            Fetching Validator Groups...
          </div>
        </Transition>

        <div className="px-40 py-10 space-y-5 flex-1 min-h-screen">
          {validatorGroups?.map((VG: ValidatorGroup) => (
            <Link href={`/validators/${VG.Address}`} key={VG.Address}>
              <div className="grid grid-cols-7 text-center font-medium px-9 py-6 border border-gray-light rounded-md cursor-pointer hover:shadow-lg hover:-translate-y-0.5 hover:border-primary-light-light transform transition-all duration-100">
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
                <div>{(VG.AttestationScore * 100).toFixed(2)} %</div>
                <div>
                  {(
                    (VG.TransparencyScore * 0.1 + VG.PerformanceScore * 0.9) *
                    100
                  ).toFixed(2)}{" "}
                  %
                </div>
                <div>{VG.EstimatedAPY.toFixed(2)} %</div>
              </div>
            </Link>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default ValidatorExplorer;
