import { Link } from "@tanstack/react-router";
import HamburgerMenu from "./HamburgerMenu";

export default function Header() {
  return (
    <header className="">
      <nav className="font-jetbrains-mono flex items-center justify-between py-6">
        <div>
          <img src="/icons/logo.svg" alt="Tech Conference Logo" />
        </div>
        <ul className="hidden space-x-6 md:flex">
          <li>
            <Link
              className="hover:outline-dev-neutral-100 text-dev-neutral-100 text-preset-6 px-6 py-2.5 uppercase outline transition-all duration-100"
              to="/"
              activeProps={{
                className:
                  "shadow-dev-1 hover:shadow-dev-2 outline-dev-green-200",
              }}
              inactiveProps={{
                className: "hover:shadow-dev-2 outline-dev-neutral-100",
              }}
              activeOptions={{
                exact: true,
              }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className="hover:outline-dev-neutral-100 text-dev-neutral-100 text-preset-6 px-6 py-2.5 uppercase outline transition-all duration-100"
              to="/speakers"
              activeProps={{
                className:
                  "shadow-dev-1 hover:shadow-dev-2 outline-dev-green-200",
              }}
              inactiveProps={{
                className: "hover:shadow-dev-2 outline-dev-neutral-100",
              }}
              activeOptions={{
                exact: true,
              }}
            >
              Speakers
            </Link>
          </li>
          <li>
            <Link
              className="hover:outline-dev-neutral-100 text-dev-neutral-100 text-preset-6 px-6 py-2.5 uppercase outline transition-all duration-100"
              to="/schedule"
              activeProps={{
                className:
                  "shadow-dev-1 hover:shadow-dev-2 outline-dev-green-200",
              }}
              inactiveProps={{
                className: "hover:shadow-dev-2 outline-dev-neutral-100",
              }}
              activeOptions={{
                exact: true,
              }}
            >
              Schedule
            </Link>
          </li>
        </ul>
        <HamburgerMenu />
      </nav>
    </header>
  );
}
