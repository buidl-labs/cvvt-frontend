import Link from "next/link";

import Nav from "../components/home/nav";

import HeroIllustration from "../components/home/illustrations/hero-illustration";
import EarningCalculator from "../components/home/earning-calc";
import FeatureGrid from "../components/home/feature-grid";
import SecondFeatureGrid from "../components/home/feature-grid-2";

import PiggyBank from "../components/home/illustrations/piggy-bank";
import Website from "../components/home/illustrations/website";
import Exchange from "../components/home/illustrations/exchange";

import FAQ from "../components/FAQ";
import Footer from "../components/home/footer";

export default function Home() {
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
      <main className="md:mb-32 md:mt-52 mt-32 mb-16 px-10 lg:px-36">
        <div className="lg:grid lg:grid-cols-2">
          <div className="text-gray-dark text-center lg:text-left">
            <div className="text-secondary text-sm">Invest • Earn • Grow</div>
            <h2 className="mt-3 font-serif font-medium text-4xl">
              Earn Profits by Investing CELO
            </h2>
            <p className="mt-5 leading-relaxed">
              Simple & smart way to put CELOs to work & earn profits on the go!
              <br />
              All you need to get started is a Celo Wallet and some CELOs in it.
              <br />
              Investing CELOs has never been this easy. Let’s get started.
            </p>
            <div className="mt-10">
              <HeroIllustration />
            </div>
            <div className="mt-10 md:space-x-4 text-lg space-y-4">
              <Link href="/app/dashboard" passHref>
                <a className="inline-block px-14 py-2 border-2 border-primary bg-primary hover:bg-primary-dark focus:bg-primary-dark hover:border-primary-dark focus:border-primary-dark focus:outline-none text-white font-medium rounded-md shadow-md">
                  Start Investing
                </a>
              </Link>
              <Link href="/how" passHref>
                <a className="inline-block px-14 py-2 bg-white text-primary border-2 border-primary hover:border-primary-dark hover:text-primary-dark font-medium rounded-md shadow-md">
                  How it works?
                </a>
              </Link>
            </div>
            {/* <div className="mt-20">
              <HeroIllustration />
            </div> */}
          </div>
          <div>
            <EarningCalculator />
          </div>
        </div>
        <div className="mt-28 relative">
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
          <div className="text-center">
            <p className="text-gray text-sm">A simple and smart way of</p>
            <p className="mt-3 text-3xl font-serif">Putting CELOs to Work</p>
            <FeatureGrid />
          </div>
        </div>
        <div className="mt-32 lg:grid lg:grid-cols-2 lg:gap-x-16 text-center lg:text-left">
          <div>
            <p className="text-sm text-gray">
              Welcome to the Future of Staking
            </p>
            <h4 className="font-serif text-dark-gray text-3xl mt-2">
              Simple. Secure. Surreal.
            </h4>
            <p className="mt-3 text-gray max-w-xl">
              Investing CELO is simple & easy, as it should be. We take pride in
              binding this simplicity with utmost security by securing your
              investment related transactions on the Celo blockchain.
            </p>

            <div className="mt-7 lg:mt-5 text-left">
              <div className="flex items-center mt-5">
                <div>
                  <PiggyBank />
                </div>
                <p className="ml-5 text-gray">
                  Simple, Quick & Delightful Investing Experience for You!
                </p>
              </div>
              <div className="flex items-center mt-5">
                <div>
                  <Website />
                </div>
                <p className="ml-5 text-gray">
                  Secure Investment based on Celo’s blockchain protocol.
                </p>
              </div>
              <div className="flex items-center mt-5">
                <div>
                  <Exchange />
                </div>
                <p className="ml-5 text-gray">
                  Withdraw the Invested CELO within 3 days (unlocking period).
                </p>
              </div>
            </div>
            <div className="mt-10 lg:space-x-4 space-y-4 text-lg">
              <Link href="/app/dashboard" passHref>
                <a className="inline-block px-14 py-2 border-2 border-primary bg-primary hover:bg-primary-dark focus:bg-primary-dark hover:border-primary-dark focus:border-primary-dark focus:outline-none text-white font-medium rounded-md shadow-md">
                  Start Investing
                </a>
              </Link>
              <Link href="/how" passHref>
                <a className="inline-block px-14 py-2 bg-white text-primary border-2 border-primary hover:border-primary-dark hover:text-primary-dark font-medium rounded-md shadow-md">
                  How it works?
                </a>
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <img
              className="absolute right-0"
              src="/assets/home/home-dashboard.png"
            />
          </div>
        </div>
        <div className="mt-40 text-gray-dark">
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
            <div className="mt-5 flex flex-col space-y-4 lg:space-y-0 lg:block lg:space-x-4 text-lg">
              <Link href="#" passHref>
                <a className="inline-block px-14 py-2 border-2 border-primary bg-primary hover:bg-primary-dark focus:bg-primary-dark hover:border-primary-dark focus:border-primary-dark focus:outline-none text-white font-medium rounded-md shadow-md">
                  Contact Us
                </a>
              </Link>
              <Link href="/how" passHref>
                <a className="inline-block px-14 py-2 bg-white text-primary border-2 border-primary hover:border-primary-dark hover:text-primary-dark font-medium rounded-md shadow-md">
                  How it works?
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-primary-light-light mt-32 rounded-md">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between p-8 lg:p-16">
            <div>
              <h4 className="text-xl text-gray-dark font-medium">
                Ready to Earn Profits?
              </h4>
              <p className="mt-3 text-gray-dark max-w-md">
                Start earning maximum Profits by investing your CELOs based on
                our Recommendations-Algorithm.
              </p>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <Link href="/app/dashboard" passHref>
                <a className="inline-block px-14 py-2 border-2 border-primary bg-primary hover:bg-primary-dark focus:bg-primary-dark hover:border-primary-dark focus:border-primary-dark focus:outline-none text-white font-medium rounded-md shadow-md">
                  Start Investing
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-28 relative">
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
            <p className="text-gray text-sm">Staking made Easy</p>
            <p className="mt-5  text-3xl font-serif">
              Benefits of Investing CELO
            </p>
            <SecondFeatureGrid />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  //       {/* TESTIMONIAL SECTION WILL BE INCLUDED ONCE WE HAVE REVIEWS */}
  //       {/* <div className="mt-44">
  //         <div className="text-center">
  //           <p className="text-gray text-sm">Don't take our word for it</p>
  //           <p className="mt-5  text-3xl font-serif">
  //             See what other investors are saying
  //           </p>
  //         </div>
  //         <div className="mt-12">
  //           <TestimonialGrid />
  //         </div>
  //       </div> */}
}

function TestimonialGrid() {
  const testimonials = [
    {
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas lacinia dui eu gravida mollis. Cras nec scelerisque ligula. Nulla id aliquam dolor, vitae.",
      name: "John DOe",
      subtitle: "Software Developer",
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas lacinia dui eu gravida mollis. Cras nec scelerisque ligula. Nulla id aliquam dolor, vitae.",
      name: "John DOe",
      subtitle: "Software Developer",
    },
    {
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas lacinia dui eu gravida mollis. Cras nec scelerisque ligula. Nulla id aliquam dolor, vitae.",
      name: "John DOe",
      subtitle: "Software Developer",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-x-10 px-8">
      {testimonials.map((t) => (
        <TestimonialCard
          avatar={t.avatar}
          testimonial={t.text}
          name={t.name}
          subtitle={t.subtitle}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  avatar,
  testimonial,
  name,
  subtitle,
}: {
  avatar: string;
  testimonial: string;
  name: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto bg-white border border-gray-light rounded-md p-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 z-0 transform scale-y-150">
        <svg
          width="120"
          height="240"
          viewBox="0 0 120 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 5.99999C0 2.68629 2.68629 0 6 0H120L87.1749 240H6C2.6863 240 0 237.314 0 234V5.99999Z"
            fill="#D6F5E5"
          />
        </svg>
      </div>
      <div className="flex relative">
        <div className="mr-6 flex flex-col justify-end">
          <div className="rounded-full w-20 h-20 overflow-hidden -mb-4">
            <img src={avatar} alt="" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="max-w-sm text-gray">{testimonial}</div>
          <div className="mt-5 space-y-3">
            <p className="text-secondary">{name}</p>
            <p className="text-gray">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
