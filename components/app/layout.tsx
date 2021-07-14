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
  console.log(address);
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
                // const classes = disabled
                //   ? "opacity-40 text-primary-dark cursor-not-allowed"
                //   : path.includes(item.to)
                //   ? "bg-primary text-white"
                //   : "text-primary-dark hover:bg-primary-light transition-all duration-150";

                return (
                  <Link href={item.to} passHref key={item.to}>
                    <a
                      className={`${classes} group flex justify-start items-center px-6 py-3 text-lg rounded-md space-x-2`}
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
        <main className="flex-1 p-16 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
