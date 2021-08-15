import Link from "next/link";
import React from "react";
import Footer from "./home/footer";
import NavHome from "./home/nav";

function Mobile() {
  return (
    <div className="lg:hidden text-center flex flex-col items-center justify-center min-h-screen">
      <NavHome />
      <div className="mt-32 mb-16  mx-10 max-w-md flex flex-col flex-1">
        <p className="text-lg text-gray">
          Oops! We don’t support access of Dashboard via mobile devices.
        </p>
        <div className="mt-8">
          <img src="/assets/broken-phone.png" className="block mx-auto" />
        </div>
        <p className="text-lg text-gray-dark mt-8">
          Please visit ChurroFi Dashboard via a Personal Computer or Laptop
          device.
        </p>
        <Link href="/" passHref>
          <a className="inline-flex items-center justify-center transition px-8 py-2 bg-primary text-white text-lg border border-primary rounded-md shadow focus:outline-none mt-16">
            Back to Home
          </a>
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default Mobile;
