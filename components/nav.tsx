import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex justify-between items-center px-16 py-4 shadow-md">
      <div>
        <h1 className="text-2xl">CVVT</h1>
      </div>
      <div className="flex items-center space-x-10">
        <Link href="#">
          <a className="text-gray">How it works?</a>
        </Link>
        <Link href="#">
          <a className="text-gray">For Validator Groups</a>
        </Link>
        <button className="bg-primary px-14 py-3 rounded-md text-white text-sm shadow-sm">
          Dashboard
        </button>
      </div>
    </nav>
  );
}
