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
        "First, you need to lock your CELO. Once your CELO is locked, you can use that to vote on a Validator Group. If the Validator Group you vote on performs well - you earn an amount of CELO every day.",
    },
    {
      question: "What is voting?",
      answer:
        "Celo is a proof of stake blockchain. On CELO, users can use their CELO to vote/stake on a Validator Group. This earns a reward for the voters and also helps secure the CELO network.",
    },
    {
      question: "What is Locking & Unlocking of CELO?",
      answer:
        "To invest your CELO, you need to first lock it on the network. When you want to get your CELO back, you need to unlock your CELO and you'll be able to withdraw it in three days.",
    },
    {
      question: "What is Activating of CELO?",
      answer:
        "Once your CELO is locked, and you've voted it with it. It needs to be activated the next day to start earning with it.",
    },
    {
      question: "Am I eligible to Invest CELO?",
      answer: "If you've CELO, you can invest with it.",
    },
    {
      question: "How do we suggest which group to vote on?",
      answer:
        "Every few minutes, we crunch the data from the Celo blockchain and run our algorithm on top of it to figure out the best groups to vote on.",
    },
  ];

  return (
    <div className="px-10 lg:px-36">
      <div className="w-full flex justify-center">
        <div className="text-center">
          <div>
            <p className="text-gray font-medium">
              Simplicity First, and Second.
            </p>
            <h2 className="text-gray-dark text-4xl font-medium font-serif mt-2">
              Investing CELO is Easy, as it should be.
            </h2>
            <p className="text-gray text-lg mt-5 lg:w-2/3 mx-auto">
              ChurroFi is a simple & smart way to put CELOs to work & earn
              profits on the go! All you need to get started is a Celo Wallet
              and some CELOs in it.
            </p>
          </div>
          <section className="mt-32 mb-20 space-y-28">
            <div>
              <p className="text-gray font-medium">STEP 1</p>
              <h3 className="font-serif font-medium text-3xl text-gray-dark mt-2">
                Select the investment amount
              </h3>
              <div className="mt-5 lg:mt-10 flex justify-center">
                <FeatureIllustrationOne />
              </div>
              <p className="text-gray mt-6 max-w-sm mx-auto text-lg">
                Start earning profits with as low as 1 CELO in your wallet. The
                more you hold & invest, the more you earn.
              </p>
            </div>
            <div>
              <p className="text-gray font-medium">STEP 2</p>
              <h3 className="font-serif font-medium text-3xl text-gray-dark mt-2">
                Vote for Validator Group
              </h3>
              <div className="mt-10 -ml-7 flex justify-center">
                <Clipboard />
              </div>
              <p className="text-gray mt-6 max-w-sm mx-auto text-lg">
                Vote for efficient & reliable Validator Groups on the Network
                that operate a well-run Organization.
              </p>
            </div>
            <div>
              <p className="text-gray font-medium">STEP 3</p>
              <h3 className="font-serif font-medium text-3xl text-gray-dark mt-2">
                Activate Your Vote
              </h3>
              <div className="mt-10 -mr-10 flex justify-center">
                <Note />
              </div>
              <p className="text-gray mt-6 max-w-sm text-lg mx-auto">
                Activate vote in a subsequent epoch to convert the pending vote
                to one that earns rewards.
              </p>
            </div>

            <div>
              <p className="text-gray font-medium">All set!</p>
              <h3 className="font-serif font-medium text-3xl text-gray-dark mt-2">
                Earn Profits & Monitor Growth
              </h3>
              <div className="mt-10 flex justify-center">
                <Report />
              </div>
              <p className="text-gray mt-6 text-lg max-w-sm mx-auto">
                Monitor growth as the CELOs earned in profit automatically gets
                added to your invested CELO for compounding.
              </p>
            </div>
          </section>
        </div>
      </div>
      <div>
        <div className="text-center mb-14">
          <p className="text-gray">Your Question, Answered</p>
          <p className="mt-4 text-3xl font-serif">Frequently Asked Questions</p>
        </div>
        <FAQ faqs={faqs} />
      </div>
    </div>
  );
}

export default How;
