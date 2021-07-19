import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import ChurroFi from "../icons/churrofi";

export default function Nav() {
  const router = useRouter();
  const currentPath = router.pathname;
  return (
    <nav className="bg-white fixed inset-x-0 top-0 z-40 flex justify-between items-center px-16 py-4 shadow-md">
      <Link href="/" passHref>
        <a>
          <ChurroFi />
        </a>
      </Link>
      <div className="flex items-center space-x-10">
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
            ? `text-lg hover:underline transition-all ${
                active
                  ? "text-primary hover:text-primary-dark"
                  : "text-gray hover:text-gray-dark"
              }`
            : "bg-primary px-14 py-3 rounded-md text-white text-base shadow-sm hover:bg-primary-dark transition-all"
        }`}
        href="#"
      >
        {children}
      </a>
    </Link>
  );
}
