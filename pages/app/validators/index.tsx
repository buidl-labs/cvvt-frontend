import { Transition } from "@headlessui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/app/layout";

import useValidatorGroups from "../../../hooks/useValidatorGroups";
import { Validator, ValidatorGroup } from "../../../lib/types";
import { FIELDS, Order, SortStatus } from "../../../lib/explorer-types";
import ReactTooltip from "react-tooltip";

const formatter = new Intl.NumberFormat("en-US");

function calculateScore(VG) {
  return VG.TransparencyScore * 0.1 + VG.PerformanceScore * 0.9;
}

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
    // set new sort status
    let newSortStatus;
    if (sortStatus.key == key) {
      newSortStatus = {
        key,
        order: sortStatus.order == Order.ASC ? Order.DESC : Order.ASC,
      };
      setSortStatus(newSortStatus);
    } else {
      newSortStatus = { key, order: Order.DESC };
      setSortStatus(newSortStatus);
    }

    // handle sorting logic
    let sortFn;
    if (newSortStatus.key == "score") {
      sortFn = (a, b) =>
        newSortStatus.order == Order.ASC
          ? calculateScore(a) - calculateScore(b)
          : calculateScore(b) - calculateScore(a);
    } else if (newSortStatus.key == "name") {
      sortFn = (a, b) =>
        newSortStatus.order == Order.ASC
          ? a.Name > b.Name
            ? 1
            : -1
          : a.Name < b.Name
          ? 1
          : -1;
    } else if (newSortStatus.key == "available") {
      sortFn = (a, b) =>
        newSortStatus.order == Order.ASC
          ? a.AvailableVotes - b.AvailableVotes
          : b.AvailableVotes - a.AvailableVotes;
    } else if (newSortStatus.key == "recieved") {
      sortFn = (a, b) =>
        newSortStatus.order == Order.ASC
          ? a.RecievedVotes - b.RecievedVotes
          : b.RecievedVotes - a.RecievedVotes;
    } else if (newSortStatus.key == "attestation") {
      sortFn = (a, b) =>
        newSortStatus.order == Order.ASC
          ? a.AttestationScore - b.AttestationScore
          : b.AttestationScore - a.AttestationScore;
    } else if (newSortStatus.key == "apy") {
      sortFn = (a, b) =>
        newSortStatus.order == Order.ASC
          ? a.EstimatedAPY - b.EstimatedAPY
          : b.EstimatedAPY - a.EstimatedAPY;
    } else if (newSortStatus.key == "validators") {
      sortFn = (a, b) =>
        newSortStatus.order == Order.ASC
          ? a.Validators.length - b.Validators.length
          : b.Validators.length - a.Validators.length;
    }

    setValidatorGroups(validatorGroups.sort(sortFn));
  };

  return (
    <Layout>
      <div className="text-gray-dark">
        <div className="border-b-2 border-gray-light pb-5">
          <ReactTooltip place="top" type="dark" effect="solid" />
          <h3 className="font-medium text-2xl">Validator Groups</h3>
          <div className="mt-8 px-9 grid grid-cols-7 font-medium text-sm text-gray text-center">
            {FIELDS.map((f) => (
              <button
                key={f.key}
                onClick={() => handleSort(f.key)}
                className={`hover:text-gray-dark focus:ring-2 focus:ring-primary focus:text-gray-dark transition-all rounded p-2 flex items-center justify-center ${
                  sortStatus.key == f.key && "text-gray-dark"
                }`}
                data-tip={f.tip && f.tip}
                data-delay-show="350"
              >
                <span className="truncate">{f.name}</span>
                {sortStatus.key == f.key && (
                  <span className="ml-0.5">
                    {sortStatus.order == Order.DESC ? (
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
        <div className="py-5 space-y-3">
          {validatorGroups?.map((VG: ValidatorGroup) => (
            <Link href={`/app/validators/${VG.Address}`}>
              <div className="grid grid-cols-7 text-center font-medium px-9 py-6 border border-gray-light rounded-md cursor-pointer hover:shadow-lg hover:-translate-y-0.5 hover:border-primary-light-light transform transition-all duration-100">
                <div className="whitespace-nowrap truncate">
                  {VG.Name ? VG.Name : "Unkown Group"}
                </div>
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
                <div className="whitespace-nowrap truncate">
                  {formatter.format(VG.RecievedVotes)} CELO
                </div>
                <div className="whitespace-nowrap truncate">
                  {formatter.format(VG.AvailableVotes)} CELO
                </div>
                <div className="whitespace-nowrap truncate">
                  {(VG.AttestationScore * 100).toFixed(2)} %
                </div>
                <div className="whitespace-nowrap truncate">
                  {(calculateScore(VG) * 100).toFixed(2)} %
                </div>
                <div className="whitespace-nowrap truncate">
                  {VG.EstimatedAPY.toFixed(2)} %
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default ValidatorExplorer;
