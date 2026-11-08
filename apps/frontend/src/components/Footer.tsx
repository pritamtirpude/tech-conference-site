import { Link } from "@tanstack/react-router";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto mt-16 w-full max-w-[1676px]">
      <div className="border-t-dev-neutral-600 border-b-dev-neutral-600 flex flex-col justify-between gap-5 border-t border-b py-10 md:gap-8 lg:flex-row">
        <div className="flex flex-col gap-4">
          <img
            className="size-max"
            src="/icons/logo.svg"
            alt="Tech Conference Logo"
          />
          <p className="font-jetbrains-mono text-preset-6 text-dev-neutral-200">
            A three-day conference for engineers who build the interfaces humans
            use every day.
          </p>
        </div>
        <div className="flex flex-col gap-8 md:flex-row md:gap-20">
          <div>
            <h6 className="text-dev-green-200 font-jetbrains-mono font-medium uppercase">
              // Navigate
            </h6>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link
                  className="font-jetbrains-mono focus:outline-dev-green-200 hover:text-dev-neutral-100 text-preset-6 text-dev-neutral-200 transition-colors focus:outline-dashed"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="font-jetbrains-mono focus:outline-dev-green-200 hover:text-dev-neutral-100 text-preset-6 text-dev-neutral-200 transition-colors focus:outline-dashed"
                  to="/schedule"
                >
                  Schedule
                </Link>
              </li>
              <li>
                <Link
                  className="font-jetbrains-mono focus:outline-dev-green-200 hover:text-dev-neutral-100 text-preset-6 text-dev-neutral-200 transition-colors focus:outline-dashed"
                  to="/speakers"
                >
                  Speakers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="text-dev-green-200 font-jetbrains-mono font-medium uppercase">
              // Tracks
            </h6>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link
                  className="font-jetbrains-mono focus:outline-dev-green-200 hover:text-dev-neutral-100 text-preset-6 text-dev-neutral-200 transition-colors focus:outline-dashed"
                  to="/schedule"
                >
                  Frontend
                </Link>
              </li>
              <li>
                <Link
                  className="font-jetbrains-mono focus:outline-dev-green-200 hover:text-dev-neutral-100 text-preset-6 text-dev-neutral-200 transition-colors focus:outline-dashed"
                  to="/schedule"
                >
                  Performance
                </Link>
              </li>
              <li>
                <Link
                  className="font-jetbrains-mono focus:outline-dev-green-200 hover:text-dev-neutral-100 text-preset-6 text-dev-neutral-200 transition-colors focus:outline-dashed"
                  to="/schedule"
                >
                  Accessibility
                </Link>
              </li>
              <li>
                <Link
                  className="font-jetbrains-mono focus:outline-dev-green-200 hover:text-dev-neutral-100 text-preset-6 text-dev-neutral-200 transition-colors focus:outline-dashed"
                  to="/schedule"
                >
                  Tooling
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h6 className="text-dev-green-200 font-jetbrains-mono font-medium uppercase">
              // Venue
            </h6>
            <p className="font-jetbrains-mono text-preset-6 text-dev-neutral-200">
              Pier 70 <br /> San Francisco, CA <br /> Nov 15–17, 2026
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-between gap-3 py-6 md:flex-row md:items-center md:gap-0">
        <p className="text-preset-7 font-jetbrains-mono text-dev-neutral-200 uppercase">
          &copy; {year} Devhorizon. All rights reserved.
        </p>
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="text-preset-7 hover:text-dev-neutral-100 font-jetbrains-mono text-dev-neutral-200 cursor-pointer uppercase transition-colors"
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
