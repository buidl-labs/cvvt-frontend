import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useRouter } from "next/router";
import Nav from "./nav";
import useStore from "../../store/vg-store";
import Mobile from "../mobile-view";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface layoutProps {
  children: React.ReactChild;
}
const toastClasses = {
  success: "bg-primary",
  error: "bg-alert",
};

export default function layout({ children }: layoutProps) {
  const navigation = [
    {
      text: "Dashboard",
      to: "/vg/dashboard",
      icon: "/assets/nav/nav-home",
    },
    {
      text: "View Profile",
      to: "/vg/profile",
      icon: "/assets/nav/nav-view-profile",
    },
    {
      text: "Edit Profile",
      to: "/vg/edit",
      icon: "/assets/nav/nav-edit-profile",
    },
    {
      text: "Widgets",
      to: "/vg/widgets",
      icon: "/assets/nav/nav-widget",
    },
  ];
  const { destroy } = useContractKit();
  const router = useRouter();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const userConnected = useMemo(() => user.length > 0, [user]);

  const disconnectWallet = useCallback(() => {
    destroy();
    setUser("");
  }, []);

  useEffect(() => {
    console.log("userConnected", userConnected);
  }, [userConnected]);

  return (
    <>
      <div className="h-screen overflow-hidden hidden flex-col lg:flex">
        <ToastContainer
          className="space-y-2"
          toastClassName={({ type }) =>
            `${toastClasses[type]} relative flex p-3 rounded justify-between overflow-hidden cursor-pointer`
          }
        />
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

                  return (
                    <MenuLink
                      text={item.text}
                      to={item.to}
                      icon={item.icon}
                      isActive={path == item.to}
                      disabled={disabled}
                      key={item.to}
                    />
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
      <Mobile />
    </>
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
        <img
          src={`${icon}${isActive ? "" : "-outlined"}.svg`}
          className="h-5 w-5"
        />
        <span>{text}</span>
      </a>
    </Link>
  );
}
