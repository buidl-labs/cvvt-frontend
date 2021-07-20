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
            className="text-primary-light mr-2.5 w-9 h-9"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.75"
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
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
