import useStore from "../../store/store";

export default function nav() {
  const user = useStore((state) => state.user);

  return (
    <nav className="flex justify-between items-center px-16 py-4 shadow-md flex-shrink-0">
      <div className="flex items-center space-x-3">
        <img src="/assets/celo-logo-32.png" />
        <h1 className="text-2xl">CVVT</h1>
      </div>
      {user.length > 0 && (
        <div className="flex items-center">
          <svg
            className="w-8 h-8 text-primary-light mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-gray text-sm">{user}</p>
        </div>
      )}
    </nav>
  );
}
