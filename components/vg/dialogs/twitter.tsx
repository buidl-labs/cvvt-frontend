import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaTwitter } from "react-icons/fa";
import { GoKebabHorizontal } from "react-icons/go";

function TwitterDialog({ open, setOpen }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={open}
        onClose={setOpen}
      >
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
            <Dialog.Overlay className="fixed inset-0 z-20 bg-gray-dark bg-opacity-90 transition-opacity" />{" "}
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
            <div className="inline-block bg-white rounded-lg text-center overflow-hidden shadow-xl transform transition-all my-8 align-middle p-14 max-w-lg relative z-30">
              <div>
                <div className="mt-5">
                  <div className="flex flex-col items-center">
                    <Dialog.Title as="h3" className="text-2xl font-medium">
                      🎉<span className="ml-2.5">Success</span>
                    </Dialog.Title>
                    <Dialog.Description as="p" className="mt-5 text-gray">
                      Congratulations! You’ve built your Validator Group profile
                      on ChurroFi. Share with your followers on Twitter.
                      <p className="mt-10 border border-gray-light rounded-md p-4 flex">
                        <div className="bg-gray-light h-8 w-8 rounded-full flex-shrink-0 mr-3"></div>
                        <div className="flex-1 flex flex-col text-left">
                          <div>
                            <span className="text-gray-dark text-sm">
                              Validator Group
                            </span>
                            <span className="text-gray text-xs ml-2">
                              @username
                            </span>
                          </div>
                          <p className="text-xs text-gray-dark mt-2 leading-relaxed">
                            We just built our Validator Group profile on{" "}
                            <span className="text-accent-dark">@ChurroFi</span>.
                            This not only brings us closer to the community of{" "}
                            <span className="text-accent-dark">$CELO</span>{" "}
                            Holders but also helps us earning higher
                            Epoch-Rewards on{" "}
                            <span className="text-accent-dark">@CeloOrg</span>{" "}
                            protocol. Build your Validator Group profile today:{" "}
                            <span className="text-accent-dark">
                              https://churrofi.app
                            </span>
                          </p>
                        </div>
                        <div className="ml-2">
                          <GoKebabHorizontal />
                        </div>
                      </p>
                    </Dialog.Description>
                    <a
                      href={`https://twitter.com/intent/tweet?text=We just built our Validator Group profile on @ChurroFi. This not only brings us closer to the community of $CELO Holders but also helps us earning higher Epoch-Rewards on @CeloOrg protocol. Build your Validator Group profile today: https://churrofi.app`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition px-8 py-2 w-full bg-white text-primary text-lg border-2 border-primary rounded-md shadow focus:outline-none disabled:opacity-50 mt-5 flex items-center justify-center space-x-3"
                    >
                      <FaTwitter /> <span>Share on Twitter</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default TwitterDialog;
