import Link from "next/link";
import React from "react";
import FAQComponent from "../components/FAQ";
import Footer from "../components/home/footer";
import Nav from "../components/home/nav";

function FAQ() {
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
  ];

  return (
    <div>
      <Nav />
      <div className="mb-32 pt-16 px-5 lg:px-0">
        <div className="text-center mt-16">
          <p className="text-sm text-gray">Your Question, Answered</p>
          <h2 className="text-gray-dark text-3xl font-medium font-serif mt-2">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="mt-16">
          <FAQComponent faqs={faqs} />
        </div>
        <div className="mt-10 text-center">
          <p className="text-gray text-sm font-medium">
            Can’t find an answer to your query? Don’t worry, we’ve got your
            back...
          </p>
          <div className="mt-5 space-y-5 lg:space-x-4 text-lg px-6 text-center">
            <a
              href="https://discord.com/invite/5uWg3DVd2B"
              target="_blank"
              className="inline-block w-full lg:w-auto px-14 py-2 border-2 border-primary bg-primary text-white font-medium rounded-md shadow-md"
            >
              Contact Us
            </a>

            <Link href="/how" passHref>
              <a className="inline-block w-full lg:w-auto px-14 py-2 bg-white text-primary border-2 border-primary font-medium rounded-md shadow-md">
                How it works?
              </a>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FAQ;
