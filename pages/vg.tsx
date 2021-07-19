import Link from "next/link";
import React from "react";
import FAQ from "../components/FAQ";
import FeatureGridVG from "../components/home/feature-grid-vg";
import Footer from "../components/home/footer";
import Nav from "../components/home/nav";

export default function VGLanding() {
  const faqs = [
    {
      question:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro, tempore.",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa deleniti dolorem, nulla voluptatibus placeat dicta quo natus? Amet sequi expedita minima ipsa quibusdam. Eligendi, nostrum?",
    },
    {
      question:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro, tempore.",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa deleniti dolorem, nulla voluptatibus placeat dicta quo natus? Amet sequi expedita minima ipsa quibusdam. Eligendi, nostrum?",
    },
    {
      question:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro, tempore.",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa deleniti dolorem, nulla voluptatibus placeat dicta quo natus? Amet sequi expedita minima ipsa quibusdam. Eligendi, nostrum?",
    },
    {
      question:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro, tempore.",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa deleniti dolorem, nulla voluptatibus placeat dicta quo natus? Amet sequi expedita minima ipsa quibusdam. Eligendi, nostrum?",
    },
  ];
  return (
    <div>
      <Nav />
      <main className="mb-32 mt-52">
        <section className="grid grid-cols-2 pl-36 gap-x-12">
          <div className="flex flex-col justify-center max-w-lg">
            <p className="text-gray text-sm font-medium">
              Build Profile & Market Yourself to
            </p>
            <h2 className="text-gray-dark font-serif font-medium text-4xl mt-3">
              Earn More Epoch Rewards
            </h2>
            <p className="text-gray-dark mt-5">
              Mitigate the information disparity between Voters & Validators{" "}
              <br />
              by building your Profile & enjoy various perks, <br />
              including greater Epoch Rewards. Here’s how it works...
            </p>
            <Link href="/vg/dashboard" passHref>
              <a className="py-2 text-lg bg-white text-primary border-2 border-primary font-medium rounded-md shadow-md flex justify-center mt-10 whitespace-nowrap truncate w-3/4">
                Validator Group’s Dashboard
              </a>
            </Link>
          </div>

          <div className="relative">
            <img
              // className="absolute right-0"
              src="/assets/home/vg-landing-hero.png"
            />
          </div>
        </section>
        <section className="mt-28 relative">
          {/* <div className="absolute top-0">
            <svg
              width="542"
              height="254"
              viewBox="0 0 542 254"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-8.42555 201.127L10.9552 202.105C100.929 206.643 189.314 177.148 258.532 119.488V119.488V119.488C336.031 68.7295 426.12 40.526 518.728 38.03L525.489 37.8477"
                stroke="#FDEABD"
              />
              <g clip-path="url(#clip0)">
                <path
                  d="M523.563 28.6451C519.834 27.5837 515.74 30.4919 514.419 35.1419C513.097 39.7926 515.051 44.4225 518.78 45.4832C522.51 46.5458 526.607 43.6365 527.926 38.9869C529.246 34.3354 527.293 29.7076 523.563 28.6451Z"
                  fill="#FCDB8C"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect
                    width="16.734"
                    height="16.743"
                    fill="white"
                    transform="translate(511 31.0126) rotate(-14.2654)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div> */}
          <div className="text-center text-gray-dark">
            <p className="text-gray text-sm">Make the most of your profile &</p>
            <p className="mt-3  text-3xl font-serif">
              Boost Your Validator Group’s Performance
            </p>
            <FeatureGridVG />
          </div>
        </section>
        <section className="mt-32 px-36 text-gray-dark">
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
                <a className="inline-block px-14 py-2 border-2 border-primary bg-primary text-white font-medium rounded-md shadow-md">
                  Contact Us
                </a>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
