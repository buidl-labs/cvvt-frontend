import Link from "next/link";
import React from "react";
import ChurroFi from "../icons/churrofi";

export default function Nav() {
  return (
    <nav className="bg-white fixed inset-x-0 top-0 z-40 flex justify-between items-center px-16 py-4 shadow-md">
      <Link href="/" passHref>
        <a>
          <ChurroFi />
        </a>
      </Link>
      <div className="flex items-center space-x-10">
        <NavLink isButton={false} to="/validators">
          Validator Explorer
        </NavLink>

        <NavLink isButton={false} to="/vg">
          For Validator Groups
        </NavLink>
        <NavLink isButton={true} to="/app/dashboard">
          Dashboard
        </NavLink>
      </div>
    </nav>
  );
}

function NavLink({
  children,
  isButton,
  to,
}: {
  children: React.ReactChild;
  isButton: boolean;
  to: string;
}) {
  return (
    <Link href={to} passHref>
      <a
        className={`${
          !isButton
            ? "text-gray text-lg hover:text-gray-dark hover:underline transition-all"
            : "bg-primary px-14 py-3 rounded-md text-white text-base shadow-sm hover:bg-primary-dark transition-all"
        }`}
        href="#"
      >
        {children}
      </a>
    </Link>
  );
}
