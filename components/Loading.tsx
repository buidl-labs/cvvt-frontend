import React, { Fragment } from "react";
import { Transition } from "@headlessui/react";
import Loader from "react-loader-spinner";

export default function Loading({ open }: { open: boolean }) {
  return (
    <Transition
      show={open}
      as={Fragment}
      enter="ease-out duration-100"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-dark bg-opacity-90 transition-opacity" />{" "}
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="inline-block overflow-hidden transform transition-all">
            <Loader type="Oval" color="#35d07f" height={90} width={90} />
          </div>
        </div>
      </div>
    </Transition>
  );
}
