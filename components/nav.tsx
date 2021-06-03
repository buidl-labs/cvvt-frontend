import Link from "next/link";
import React from "react";

export default function Nav() {
  return (
    <nav className="flex justify-between items-center px-16 py-4 shadow-md">
      <div className="flex items-center space-x-3">
        <img src="/assets/celo-logo-32.png" />
        <h1 className="text-2xl">CVVT</h1>
      </div>
      <div className="flex items-center space-x-10">
        <NavLink isButton={false} to="#">
          How it works?
        </NavLink>
        <NavLink isButton={false} to="#">
          For Validator Groups
        </NavLink>
        <NavLink isButton={true} to="#">
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
    <Link href={to}>
      <a
        className={`${
          !isButton
            ? "text-gray"
            : "bg-primary px-14 py-3 rounded-md text-white text-sm shadow-sm"
        }`}
      >
        {children}
      </a>
    </Link>
  );
}
