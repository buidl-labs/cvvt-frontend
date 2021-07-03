import { Question } from "../lib/types";
import { Disclosure } from "@headlessui/react";

export default function FAQ({ faqs }: { faqs: Question[] }) {
  return (
    <div>
      <div className="mx-auto">
        <div className="mx-auto max-w-4xl">
          <dl className="mt-6 space-y-6">
            {faqs.map((faq) => (
              <Disclosure
                as="div"
                key={faq.question}
                className="border border-gray-light rounded-md p-5"
              >
                {({ open }) => (
                  <>
                    <dt className="text-lg">
                      <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-dark focus:outline-none">
                        <span className="font-medium text-gray-dark">
                          {faq.question}
                        </span>
                        <span className="ml-6 h-7 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`${open ? "-rotate-180" : "rotate-0"}
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
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base text-gray">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
