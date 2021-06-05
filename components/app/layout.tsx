import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Nav from "./nav";

interface layoutProps {
  children: React.ReactChild;
  userConnected: boolean;
  disconnectWallet(): Promise<void>;
}

export default function layout({
  children,
  userConnected = false,
  disconnectWallet,
}: layoutProps) {
  const router = useRouter();
  const navigation = [
    {
      text: "Dashboard",
      to: "/app/dashboard",
      icon: "/assets/nav/nav-home.png",
    },
    {
      text: "Invest CELO",
      to: "#",
      icon: "/assets/nav/nav-invest.png",
    },
    {
      text: "Lock / Unlock",
      to: "#",
      icon: "/assets/nav/nav-lock.png",
    },
    {
      text: "Vote / Revoke",
      to: "#",
      icon: "/assets/nav/nav-vote.png",
    },
    {
      text: "Validator Groups",
      to: "#",
      icon: "/assets/nav/nav-validator-groups.png",
    },
    {
      text: "How it works?",
      to: "#",
      icon: "/assets/nav/nav-how-it-works.png",
    },
  ];

  console.log(userConnected);
  return (
    <div className="h-screen flex flex-col">
      <Nav />
      <div className="flex-1 flex">
        <div className="bg-primary-light-light w-64 flex flex-col flex-shrink-0">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-7 flex-1 px-2.5 space-y-4">
              {navigation.map((item) => {
                let path = router.asPath;
                let disabled = !userConnected;

                if (router.asPath.charAt(router.asPath.length - 1) == "#")
                  path = router.asPath.slice(0, -1);
                if (item.to.includes("dashboard")) disabled = false;
                return (
                  <MenuLink
                    text={item.text}
                    to={item.to}
                    icon={item.icon}
                    isActive={path == item.to}
                    disabled={disabled}
                    key={item.text}
                  />
                );
              })}
            </nav>
            <div className="mb-40 mx-7 text-primary-dark">
              {userConnected && (
                <button
                  className="flex items-center focus:ring-outline-none"
                  onClick={disconnectWallet}
                >
                  <img src="/assets/nav/nav-logout-outlined.png" />
                  <span className="ml-5 text-lg">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
        <main className="flex-1 p-16">{children}</main>
      </div>
    </div>
  );
}

function MenuLink({
  text,
  to,
  icon,
  isActive,
  disabled,
}: {
  text: string;
  to: string;
  icon: string;
  isActive: boolean;
  disabled: boolean;
}) {
  return (
    <Link href={to} passHref>
      <a
        className={`${
          disabled
            ? "opacity-40 text-primary-dark cursor-not-allowed"
            : isActive
            ? "bg-primary text-white"
            : "text-primary-dark hover:bg-primary-light transition-all duration-150"
        }  group flex justify-start items-center px-6 py-3 text-lg rounded-md space-x-2`}
      >
        <img src={icon} className="h-5 w-5" />
        <span>{text}</span>
      </a>
    </Link>
  );
}
