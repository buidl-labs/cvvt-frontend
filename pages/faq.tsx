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
            <Link href="#" passHref>
              <a className="inline-block w-full lg:w-auto px-14 py-2 border-2 border-primary bg-primary text-white font-medium rounded-md shadow-md">
                Contact Us
              </a>
            </Link>
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
