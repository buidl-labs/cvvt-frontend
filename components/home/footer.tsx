import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-light-light">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="/" passHref>
            <a className="text-gray-dark hover:text-black">Disclaimer</a>
          </Link>
          <Link href="/" passHref>
            <a className="text-gray-dark hover:text-black">Privacy</a>
          </Link>
          <Link href="/" passHref>
            <a className="text-gray-dark hover:text-black">
              Terms & Conditions
            </a>
          </Link>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-base text-gray-dark">
            Built with ❤️ &nbsp; by{" "}
            <a href="https://buidllabs.io" className="underline">
              BUIDL Labs
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
