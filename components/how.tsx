import React from "react";
import FeatureIllustrationOne from "./home/illustrations/feature-illustration-one";
import Report from "./home/illustrations/report";
import Clipboard from "./home/illustrations/clipboard";
import Note from "./home/illustrations/note";
import FAQ from "./FAQ";

function How() {
  const faqs = [
    {
      question: "How does Celo Investing work?",
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
      question: "What is Staking?",
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
      question: "What is Locking & Unlocking of CELO?",
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
      question: "What is Voting, Activating Vote & Unvoting of CELO?",
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
      question: "Am I eligible to Invest CELO?",
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
      question: "Is there a fee associated with this service?",
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },

    {
      question: "Will I be taxed on my Investment profits/returns?",
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
  ];

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="text-center">
          <div>
            <p className="text-gray text-sm font-medium">
              Simplicity First, and Second.
            </p>
            <h2 className="text-gray-dark text-4xl font-medium font-serif mt-2">
              Investing CELO is Easy, as it should be.
            </h2>
          </div>
          <section className="my-32 space-y-28">
            <div>
              <p className="text-gray text-sm font-medium">STEP 1</p>
              <h3 className="font-serif font-medium text-3xl text-gray-dark mt-2">
                Select the investment amount
              </h3>
              <div className="mt-10 flex justify-center">
                <FeatureIllustrationOne />
              </div>
              <p className="text-gray mt-6">
                Start earning profits with as low as 1 CELO in your wallet.{" "}
                <br />
                The more you hold & invest, the more you earn.
              </p>
            </div>
            <div>
              <p className="text-gray text-sm font-medium">STEP 2</p>
              <h3 className="font-serif font-medium text-3xl text-gray-dark mt-2">
                Vote for Validator Group
              </h3>
              <div className="mt-10 -ml-7 flex justify-center">
                <Clipboard />
              </div>
              <p className="text-gray mt-6">
                Vote for efficient & reliable Validator Groups on the <br />
                Network that operate a well-run Organization.
              </p>
            </div>
            <div>
              <p className="text-gray text-sm font-medium">STEP 3</p>
              <h3 className="font-serif font-medium text-3xl text-gray-dark mt-2">
                Activate Your Vote
              </h3>
              <div className="mt-10 -mr-10 flex justify-center">
                <Note />
              </div>
              <p className="text-gray mt-6">
                Activate vote in a subsequent epoch to convert <br />
                the pending vote to one that earns rewards.
              </p>
            </div>
            <div>
              <p className="text-gray text-sm font-medium">All set!</p>
              <h3 className="font-serif font-medium text-3xl text-gray-dark mt-2">
                Earn Profits & Monitor Growth
              </h3>
              <div className="mt-10 flex justify-center">
                <Report />
              </div>
              <p className="text-gray mt-6">
                Monitor growth as the CELOs earned in profit automatically
                <br />
                gets added to your invested CELO for compounding.
              </p>
            </div>
          </section>
        </div>
      </div>
      <FAQ faqs={faqs} />
    </>
  );
}

export default How;
