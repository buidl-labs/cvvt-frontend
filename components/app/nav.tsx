import useStore from "../../store/store";
import Link from "next/link";
import ChurroFi from "../icons/churrofi";

export default function nav() {
  const user = useStore((state) => state.user);
  const network = useStore((state) => state.network);

  return (
    <nav className="flex justify-between items-center px-16 py-4 shadow-md flex-shrink-0 relative z-20">
      <Link href="/" passHref>
        <a>
          <ChurroFi />
        </a>
      </Link>
      {user.length > 0 && (
        <div className="flex items-center">
          <svg
            className="mr-2 h-9 w-9"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="18"
              cy="18"
              r="17"
              fill="white"
              stroke="#D6F5E5"
              stroke-width="2"
            />
            <path
              d="M18.0018 6C14.5732 6 11.7705 8.80271 11.7705 12.2313C11.7705 15.6599 14.5732 18.4626 18.0018 18.4626C21.4304 18.4626 24.2331 15.6599 24.2331 12.2313C24.2331 8.80271 21.4304 6 18.0018 6Z"
              fill="#D6F5E5"
            />
            <path
              d="M28.6958 23.4422C28.5325 23.034 28.3148 22.6531 28.07 22.2993C26.8182 20.449 24.8863 19.2245 22.7094 18.9252C22.4373 18.898 22.138 18.9523 21.9203 19.1156C20.7774 19.9592 19.4169 20.3945 18.0019 20.3945C16.5869 20.3945 15.2264 19.9592 14.0835 19.1156C13.8658 18.9523 13.5665 18.8707 13.2944 18.9252C11.1176 19.2245 9.15839 20.449 7.93391 22.2993C7.68901 22.6531 7.4713 23.0613 7.30807 23.4422C7.22646 23.6055 7.25365 23.7959 7.33526 23.9592C7.55297 24.3402 7.82505 24.7211 8.06995 25.0477C8.45089 25.5647 8.85906 26.0272 9.32167 26.4626C9.70261 26.8435 10.138 27.1973 10.5734 27.551C12.723 29.1565 15.3081 30 17.9747 30C20.6414 30 23.2265 29.1565 25.3761 27.551C25.8115 27.2245 26.2468 26.8435 26.6278 26.4626C27.0632 26.0272 27.4985 25.5646 27.8795 25.0477C28.1516 24.6939 28.3966 24.3402 28.6142 23.9592C28.7502 23.7959 28.7774 23.6054 28.6958 23.4422Z"
              fill="#D6F5E5"
            />
          </svg>
          <div className="flex flex-col">
            <div className="flex items-center justify-end">
              <div className="ml-auto h-2 w-2 bg-secondary rounded-full mr-2.5"></div>
              <p className="text-secondary text-sm">{network}</p>
            </div>
            <p className="text-gray text-sm mt-0.5">{user}</p>
          </div>
        </div>
      )}
    </nav>
  );
}
