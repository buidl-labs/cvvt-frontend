import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";

function ActivateVG({ open, activate }: { open: boolean; activate(): void }) {
  return (
    <Transition
      as={Fragment}
      show={open}
      appear={true}
      enter="transition-all transform ease-out duration-250"
      enterFrom="translate-y-32"
      enterTo="translate-y-0"
    >
      <div className="bg-white shadow-lg sm:rounded-lg fixed bottom-12 right-12 border border-primary-light-light max-w-md z-30">
        <div className="p-6">
          <h3 className="text-xl leading-6 font-medium text-gray-dark">
            Activate your votes
          </h3>
          <div className="mt-2 max-w-xl text-gray">
            <p>
              You've pending votes that need to be activated. Votes need to be
              activated to start earning rewards on them.
            </p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="px-10 py-3 rounded-md bg-primary text-white hover:bg-primary-dark focus:bg-primary-dark focus:outline-none active:bg-primary-dark-dark"
              onClick={activate}
            >
              Activate
            </button>
          </div>
        </div>
      </div>
    </Transition>
  );
}

export default ActivateVG;
