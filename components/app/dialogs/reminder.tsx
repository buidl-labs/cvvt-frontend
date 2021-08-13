import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { toast } from "react-toastify";

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

async function addReminder(action, email) {
  const resp = await axios.post(
    "https://churrofi-reminders.onrender.com/reminder",
    {
      action,
      email,
    }
  );

  return resp;
}

function Reminder({ open, setOpen, action }) {
  const [email, setEmail] = useState("");
  const [addingReminder, setAddingReminder] = useState(false);
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
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-medium text-primary"
                    >
                      Add Email Reminder
                    </Dialog.Title>
                    <Dialog.Description as="p" className="mt-5 text-gray">
                      We’ll send an email to you on this address when its time
                      to finally {action} your CELO.
                    </Dialog.Description>

                    <div className="mt-8 flex flex-col w-full">
                      <div className="text-left mb-5">
                        <label
                          htmlFor="email"
                          className="text-sm text-gray-dark mb-3"
                        >
                          Your email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="block w-full h-full px-5 py-2.5 text-lg bg-gray-light-light border border-gray-light rounded-md focus:border-primary focus:ring-primary focus:bg-primary-light-light"
                          placeholder="example@mail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <button
                        disabled={email === "" || !validateEmail(email)}
                        className="transition px-8 py-2 w-full bg-primary text-white text-lg border border-primary rounded-md shadow focus:outline-none disabled:opacity-50"
                        onClick={() => {
                          console.log("Adding reminder.");
                          setAddingReminder(true);
                          addReminder(action, email).then((res) => {
                            if (res.status === 201) {
                              toast.success("Reminder added successfully.");
                            } else {
                              toast.error("Not able to add reminder.");
                            }
                            setOpen(false);
                            setAddingReminder(false);
                          });
                        }}
                      >
                        {!addingReminder
                          ? "Add Reminder"
                          : "Please wait, adding reminder"}
                      </button>
                    </div>
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

export default Reminder;
