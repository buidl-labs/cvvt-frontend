import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Mainnet, useContractKit } from "@celo-tools/use-contractkit";
import { useRouter } from "next/router";
import Nav from "./nav";
import useStore from "../../store/store";
import { hasActivatablePendingVotes } from "../../lib/celo";

interface layoutProps {
  children: React.ReactChild;
}

export default function layout({ children }: layoutProps) {
  const navigation = [
    {
      text: "Dashboard",
      to: "/app/dashboard",
      icon: "/assets/nav/nav-home",
    },
    {
      text: "Invest CELO",
      to: "/app/invest",
      icon: "/assets/nav/nav-invest",
    },
    {
      text: "Withdraw CELO",
      to: "/app/withdraw",
      icon: "/assets/nav/nav-withdraw",
    },
    {
      text: "Lock / Unlock",
      to: "/app/lock",
      icon: "/assets/nav/nav-lock",
    },
    {
      text: "Vote / Revoke",
      to: "/app/vote",
      icon: "/assets/nav/nav-vote",
    },
    {
      text: "Validator Groups",
      to: "/app/validators",
      icon: "/assets/nav/nav-validator-groups",
    },
    {
      text: "How it works?",
      to: "/app/how",
      icon: "/assets/nav/nav-how-it-works",
    },
  ];
  const { address, network, updateNetwork, destroy, kit } = useContractKit();

  const router = useRouter();
  const state = useStore();

  const userConnected = !(address == null);

  const disconnectWallet = useCallback(() => {
    destroy();
    state.setUser("");
    state.setHasActivatableVotes(false);
  }, []);

  useEffect(() => {
    if (!userConnected) {
      router.push(navigation[0].to);
    } else {
      if (address == null) return;
      state.setUser(address);
      updateNetwork(Mainnet);
      state.setNetwork(network.name);

      hasActivatablePendingVotes(kit, address).then((res) => {
        if (res) {
          state.setHasActivatableVotes(res);
        }
      });
    }
  }, [userConnected]);

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Nav />
      <div className="flex-1 flex overflow-hidden">
        <div className="bg-primary-light-light w-64 flex flex-col flex-shrink-0">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-7 flex-1 px-2.5 space-y-4">
              {navigation.map((item) => {
                let path = router.asPath;
                let disabled = !userConnected;

                if (router.asPath.charAt(router.asPath.length - 1) == "#")
                  path = router.asPath.slice(0, -1);
                if (item.to.includes("dashboard")) disabled = false;
                const isActive = path.includes(item.to);
                const classes = isActive
                  ? "bg-primary text-white"
                  : "text-primary-dark hover:bg-primary-light transition-all duration-150";

                return (
                  <Link href={item.to} passHref key={item.to}>
                    <a
                      className={`${classes} group flex justify-start items-center px-6 py-3 text-lg rounded-md space-x-4`}
                    >
                      <img
                        src={`${item.icon}${isActive ? "" : "-outlined"}.svg`}
                        className="h-5 w-5"
                      />
                      <span>{item.text}</span>
                    </a>
                  </Link>
                );
              })}
            </nav>

            {userConnected && (
              <button
                className="mx-2.5 mb-8 px-6 flex items-center focus:ring-outline-none text-primary-dark hover:text-primary-dark-dark focus:outline-none focus:text-primary-dark-dark"
                onClick={disconnectWallet}
              >
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#prefix__clip0)">
                    <path d="M19.375 9.375h-7.917a.625.625 0 010-1.25h7.917a.625.625 0 010 1.25z" />
                    <path d="M16.25 12.5a.625.625 0 01-.442-1.067L18.49 8.75l-2.683-2.684a.625.625 0 11.884-.884l3.125 3.125a.625.625 0 010 .884l-3.125 3.125a.62.62 0 01-.442.184zM6.667 20c-.179 0-.348-.025-.517-.077l-5.015-1.67A1.682 1.682 0 010 16.666v-15C0 .749.748.002 1.667.002c.178 0 .347.025.516.077L7.198 1.75a1.682 1.682 0 011.135 1.585v15c0 .919-.747 1.666-1.666 1.666zm-5-18.75a.418.418 0 00-.417.418v15c0 .177.12.342.29.4l4.99 1.664a.452.452 0 00.137.018c.229 0 .416-.187.416-.416v-15a.433.433 0 00-.29-.401l-4.99-1.664a.452.452 0 00-.136-.018z" />
                    <path d="M12.708 6.667a.625.625 0 01-.625-.624v-3.75c0-.575-.467-1.042-1.042-1.042H1.667a.625.625 0 010-1.25h9.374a2.293 2.293 0 012.292 2.292v3.75c0 .345-.28.624-.625.624zM11.041 17.5H7.708a.625.625 0 010-1.25h3.333c.575 0 1.042-.467 1.042-1.041v-3.75a.625.625 0 011.25 0v3.75A2.293 2.293 0 0111.04 17.5z" />
                  </g>
                  <defs>
                    <clipPath id="prefix__clip0">
                      <path fill="#fff" d="M0 0h20v20H0z" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="ml-5 text-lg">Logout</span>
              </button>
            )}
          </div>
        </div>
        <main className="flex-1 p-16 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
