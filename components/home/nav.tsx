import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import ChurroFi from "../icons/churrofi";

export default function Nav() {
  const router = useRouter();
  const currentPath = router.pathname;
  return (
    <nav className="bg-white fixed inset-x-0 top-0 z-40 flex justify-between items-center px-5 py-3 lg:px-16 :py-4 shadow-md">
      <Link href="/" passHref>
        <a className="focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-4">
          <ChurroFi />
        </a>
      </Link>
      <div className="items-center space-x-10 hidden lg:flex">
        <NavLink
          isButton={false}
          to="/validators"
          active={currentPath == "/validators"}
        >
          Validator Explorer
        </NavLink>

        <NavLink isButton={false} to="/vg" active={currentPath == "/vg"}>
          For Validator Groups
        </NavLink>
        <NavLink isButton={true} to="/app/dashboard" active={false}>
          Dashboard
        </NavLink>
      </div>
      <div className="lg:hidden flex items-center justify-center">
        <button>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}

function NavLink({
  children,
  isButton,
  active,
  to,
}: {
  children: React.ReactChild;
  isButton: boolean;
  active: boolean;
  to: string;
}) {
  return (
    <Link href={to} passHref>
      <a
        className={`${
          !isButton
            ? `text-lg hover:underline transition-all focus:outline-none focus:underline ${
                active
                  ? "text-primary hover:text-primary-dark focus:text-primary-dark"
                  : "text-gray hover:text-gray-dark focus:text-gray-dark"
              }`
            : "bg-primary hover:bg-primary-dark focus:bg-primary-dark active:bg-primary-dark-dark focus:outline-none px-14 py-3 rounded-md text-white text-base shadow-sm transition-all"
        }`}
        href="#"
      >
        {children}
      </a>
    </Link>
  );
}
