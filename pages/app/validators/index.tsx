import { Transition } from "@headlessui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/app/layout";

import useValidatorGroups from "../../../hooks/useValidatorGroups";
import { Validator, ValidatorGroup } from "../../../lib/types";
import { FIELDS, Order, SortStatus } from "../../../lib/explorer-types";
import ReactTooltip from "react-tooltip";
import CopyIcon from "../../../components/icons/copy";

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

  const [expandedVG, setExpandedVG] = useState("");

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
          <div className="mt-8 px-9 grid grid-cols-8 font-medium text-sm text-gray text-center">
            <div />
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
        <ul className="py-5 space-y-3">
          {validatorGroups?.map((VG: ValidatorGroup) => (
            <li className="relative overflow-hidden  font-medium px-9 py-6 border border-gray-light rounded-md cursor-pointer hover:border-primary-light-light hover:shadow-lg transform transition-all duration-100">
              <Link href={`/app/validators/${VG.Address}`} passHref>
                <a className="absolute inset-0 z-10" />
              </Link>
              <div className="grid grid-cols-8 text-center">
                <div>
                  <button
                    className="mx-auto flex items-center justify-center rounded-full p-2 relative z-20 hover:bg-primary-light-light"
                    onClick={() =>
                      setExpandedVG((curr) =>
                        curr == VG.Address ? "" : VG.Address
                      )
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`${
                        expandedVG == VG.Address ? "rotate-180" : "rotate-0"
                      }
                              h-6 w-6 transform transition-all duration-200`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="whitespace-nowrap truncate">
                    {VG.Name ? VG.Name : "Unkown Group"}
                  </span>
                  {VG.VerifiedDns && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0)">
                        <path
                          d="M16 7.99998L14.1887 5.989L14.4723 3.2968L11.8238 2.73609L10.4728 0.38913L8.00002 1.49423L5.52728 0.38913L4.17625 2.73609L1.52771 3.2968L1.81127 5.989L0 7.99998L1.81124 10.011L1.52768 12.7032L4.17622 13.2639L5.52725 15.6108L7.99998 14.5057L10.4727 15.6108L11.8237 13.2639L14.4723 12.7032L14.1887 10.011L16 7.99998ZM11.3538 6.24831L7.33811 10.7473L4.54765 7.95684L5.21136 7.29312L7.29935 9.38111L10.6535 5.62327L11.3538 6.24831Z"
                          fill="#FBCC5C"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  )}
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
              {expandedVG == VG.Address && (
                <div
                  className="mt-3 mb-10 grid"
                  style={{ gridTemplateColumns: "1fr 7fr" }}
                >
                  <div />
                  <div>
                    <p className="inline-flex items-center text-gray space-x-1">
                      <span className="text-sm">{VG.Address}</span>
                      <button
                        className="relative z-20 p-2"
                        onClick={() =>
                          navigator.clipboard.writeText(VG.Address)
                        }
                      >
                        <CopyIcon size="sm" />
                      </button>
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-5">
                      {VG.Validators.map((validator) => (
                        <div className="border border-gray-light rounded-md px-5 py-3">
                          <div className="flex items-baseline justify-between">
                            <h5 className="font-medium">
                              {validator.name
                                ? validator.name
                                : "Unknown Validator"}
                            </h5>
                            <p
                              className={`${
                                validator.currently_elected
                                  ? "text-gray-dark"
                                  : "text-gray"
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
                                {validator.currently_elected
                                  ? "Elected"
                                  : "Refused"}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-baseline space-x-2">
                            <p className="text-gray text-sm mt-2">
                              {validator.address}
                            </p>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(validator.address)
                              }
                              className="relative z-20"
                            >
                              <CopyIcon size="sm" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

export default ValidatorExplorer;
