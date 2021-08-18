import Link from "next/link";
import Head from "next/head";
import React from "react";
import FAQ from "../components/FAQ";
import FeatureGridVG from "../components/home/feature-grid-vg";
import Footer from "../components/home/footer";
import Nav from "../components/home/nav";

const ChurrofiWidget = () => (
  <churrofi-widgets-lg
    theme="green"
    address="0x481eade762d6d0b49580189b78709c9347b395bf"
    name="HappyCelo"
  />
);

export default function VGLanding() {
  const faqs = [
    {
      question: "How do you select Validator Groups to recommend to the users?",
      answer:
        "Every few minutes we calculate a score for all the Groups based on several on-chain metrics - the better the Group scores, higher it is ranked.",
    },
    {
      question: "How can I improve my Group's ranking?",
      answer:
        "Apart from just making sure the validators in your Group perform well - you can access the Validator Group dashboard and complete your profile. We recommend based on a combination of on-chain metrics and a transparency score, which you can bump up by completing your profile.",
    },
  ];

  return (
    <>
      <Head>
        <script
          src="https://unpkg.com/churrofi-widgets@0.0.9/dist/churrofi-widgets-lg.js?module"
          type="module"
        />
      </Head>
      <div>
        <Nav />
        <main className="md:mb-32 md:mt-52 mt-32 mb-16">
          <section className="lg:grid lg:grid-cols-2 lg:gap-x-12 text-center lg:text-left lg:pl-36">
            <div className="flex flex-col justify-center lg:max-w-lg">
              <div className="px-10 lg:px-0">
                <p className="text-gray text-sm font-medium">
                  Build Profile & Market Yourself to
                </p>
                <h2 className="text-gray-dark font-serif font-medium text-4xl mt-3">
                  Earn More Epoch Rewards
                </h2>
                <p className="text-gray-dark mt-5">
                  Mitigate the information disparity between Voters & Validators
                  by building your Profile & enjoy various perks, including
                  greater Epoch Rewards. Here’s how it works...
                </p>
              </div>
              <div className="relative ml-8 mt-5 block lg:hidden">
                <img
                  // className="absolute right-0"
                  src="/assets/home/vg-landing-hero.png"
                />
              </div>
              <div className="flex justify-center lg:block mt-10">
                <Link href="/vg/dashboard" passHref>
                  <a className="py-2 text-lg bg-white text-primary border-2 border-primary hover:border-primary-dark hover:text-primary-dark focus:border-primary-dark focus:text-primary-dark focus:outline-none active:bg-primary-light-light active:border-primary-dark-dark active:text-primary-dark-dark font-medium rounded-md shadow-md flex justify-center whitespace-nowrap truncate w-3/4">
                    Validator Group’s Dashboard
                  </a>
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <img
                // className="absolute right-0"
                src="/assets/home/vg-landing-hero.png"
              />
            </div>
          </section>
          <section className="mt-28 relative">
            <div className="text-center text-gray-dark px-10 lg:px-36">
              <p className="text-gray text-sm">
                Make the most of your profile &
              </p>
              <p className="mt-3 text-3xl font-serif">
                Boost Your Validator Group’s Performance
              </p>
              <FeatureGridVG />
            </div>
          </section>
          <section className="lg:grid lg:grid-cols-2 lg:gap-x-12 text-center lg:text-right lg:pr-36 mt-32 hidden">
            <div className="relative hidden lg:block">
              <img src="/assets/home/widget-laptop.png" />
              <div className="absolute inset-0 right-32 top-4 flex items-center justify-center ml-4">
                <ChurrofiWidget />
              </div>
            </div>
            <div className="flex flex-col justify-center lg:max-w-lg justify-self-end">
              <div className="px-10 lg:px-0">
                <p className="text-gray text-sm font-medium">
                  Enable one-click vote by adding
                </p>
                <h2 className="text-gray-dark font-serif font-medium text-4xl mt-3">
                  Voting Widget for Your Website
                </h2>
                <p className="text-gray-dark mt-5">
                  Choose from a vide range of Voting Wigets to make it easy for
                  CELO Holders to vote. Log into the Validator Group Dashboard,
                  copy any widget’s <code>{" <code-snippet />"}</code> from
                  Widget tab and paste it in your website’s code. Voila!
                </p>
              </div>

              <div className="mt-10 flex justify-end">
                <Link href="/vg/dashboard" passHref>
                  <a className="w-3/4 py-2 border-2 text-lg bg-white text-primary border-primary hover:border-primary-dark hover:text-primary-dark focus:border-primary-dark focus:text-primary-dark focus:outline-none active:bg-primary-light-light active:border-primary-dark-dark active:text-primary-dark-dark font-medium rounded-md shadow-md flex justify-center whitespace-nowrap truncate">
                    Validator Group’s Dashboard
                  </a>
                </Link>
              </div>
            </div>
          </section>
          <section className="mt-32 px-10 lg:px-36 text-gray-dark">
            <div className="text-center">
              <p className="text-gray text-sm">Your Question, Answered</p>
              <p className="mt-5  text-3xl font-serif">
                Frequently Asked Questions
              </p>
            </div>
            <div className="mt-14">
              <FAQ faqs={faqs} />
            </div>
            <div className="mt-10 text-center">
              <p className="text-gray text-sm font-medium">
                Can’t find an answer to your query? Don’t worry, we’ve got your
                back...
              </p>
              <div className="mt-5 space-x-4 text-lg">
                <Link href="/app/dashboard" passHref>
                  <a className="inline-block px-14 py-2 border-2 border-primary bg-primary hover:bg-primary-dark focus:bg-primary-dark hover:border-primary-dark focus:border-primary-dark focus:outline-none text-white font-medium rounded-md shadow-md">
                    Contact Us
                  </a>
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
