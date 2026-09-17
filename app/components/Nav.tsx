"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Nav() {
  const pathname = usePathname();
  const { signOut } = useAuthActions();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/Login";
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 sm:justify-around sm:px-0 sm:py-0">
      <Link href="/" className="text-base font-bold sm:m-5 sm:text-xl">
        LinkedIn Styring
      </Link>

      <div className="flex flex-wrap items-center gap-1 sm:m-6 sm:gap-2">
        <Link
          href="/"
          className={`rounded-lg px-2 py-1 text-sm sm:p-2 sm:text-base ${
            pathname === "/" ? "font-bold" : ""
          }`}
        >
          Kalender
        </Link>

        <Link
          href="/Ideer"
          className={`rounded-lg px-2 py-1 text-sm sm:p-2 sm:text-base ${
            pathname === "/Ideer" ? "font-bold" : ""
          }`}
        >
          Ideer
        </Link>

        <Link
          href="/Retningslinjer"
          className={`rounded-lg px-2 py-1 text-sm sm:p-2 sm:text-base ${
            pathname === "/Retningslinjer" ? "font-bold" : ""
          }`}
        >
          Retningslinjer
        </Link>

        <button
          className="ml-1 rounded-lg border border-pink-300 bg-white px-2 py-1.5 text-sm shadow hover:bg-pink-50 sm:ml-3 sm:px-3 sm:py-2 sm:text-base"
          onClick={handleSignOut}
        >
          Log ud
        </button>
      </div>
    </div>
  );
}
