import React, { Fragment } from "react";
import { Transition } from "@headlessui/react";

function CheckingVG({ dialogOpen }: { dialogOpen: boolean }) {
  return (
    <Transition.Root show={dialogOpen} as={Fragment}>
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-dark bg-opacity-90 transition-opacity" />{" "}
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block bg-white rounded-lg text-center overflow-hidden shadow-xl transform transition-all my-8 align-middle p-10 max-w-sm">
              <div>
                <div className="mt-5">
                  <div className="flex flex-col items-center">
                    <h3 className="text-2xl font-medium text-primary">
                      Checking if you're a Validator Group
                    </h3>
                    <p className="mt-5 text-gray">
                      Give us a second, we're just confirming if the connected
                      address is a validator group
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition.Root>
  );
}

export default CheckingVG;
