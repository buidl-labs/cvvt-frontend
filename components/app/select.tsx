import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

const Select = ({
  options,
  selected,
  setSelected,
  showLabel,
}: {
  options: string[];
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  showLabel: boolean;
}) => {
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          {showLabel && (
            <Listbox.Label className="block text-sm font-medium text-gray-dark">
              Assigned to
            </Listbox.Label>
          )}
          <div className={`${showLabel && "mt-2.5"} relative`}>
            <Listbox.Button className="bg-gray-light-light relative w-full border border-gray-light rounded-md shadow-sm px-5 py-2.5 text-left cursor-default focus:outline-none focus:bg-primary-light-light focus:border-primary text-lg">
              <span className="block truncate">{selected}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none  border border-primary-light-light"
              >
                {options.map((op) => (
                  <Listbox.Option
                    key={op}
                    className={({ active }) =>
                      `${
                        active
                          ? "text-dark-gray bg-primary-light-light border border-primary-light-light"
                          : "text-gray-900"
                      } cursor-default select-none relative py-2 px-3 mx-1 text-lg border border-white rounded-md`
                    }
                    value={op}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`${
                            selected ? "font-semibold" : "font-normal"
                          } block truncate`}
                        >
                          {op}
                        </span>

                        {selected ? (
                          <span
                            className={`${
                              active
                                ? "text-gray-dark-dark"
                                : "text-primary-dark"
                            } absolute inset-y-0 right-0 flex items-center pr-4`}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default Select;
