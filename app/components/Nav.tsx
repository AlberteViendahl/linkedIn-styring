"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Adgang from "./Adgang";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-pink-100 bg-white px-4 py-3">
      <div
        className="
          mx-auto
          grid
          max-w-7xl
          grid-cols-2
          items-center
          gap-3
          md:grid-cols-[1fr_auto_1fr]
        "
      >
        {/* Venstre */}
        <Link
          href="/"
          className="
            justify-self-start
            text-base
            font-bold
            whitespace-nowrap
            sm:text-lg
            md:text-xl
          "
        >
          LinkedIn Styring
        </Link>

        {/* Midten */}
        <div
          className="
            order-3
            col-span-2
            flex
            items-center
            justify-center
            gap-1
            md:order-none
            md:col-span-1
            md:gap-2
            md:justify-self-center
          "
        >
          <Link
            href="/"
            className={`
              rounded-lg
              px-2
              py-2
              text-sm
              transition
              sm:px-3
              sm:text-base
              ${pathname === "/" ? " font-bold" : ""}
            `}
          >
            Kalender
          </Link>

          <Link
            href="/Ideer"
            className={`
              rounded-lg
              px-2
              py-2
              text-sm
              transition
              sm:px-3
              sm:text-base
              ${pathname === "/Ideer" ? " font-bold" : ""}
            `}
          >
            Ideer
          </Link>

          <Link
            href="/Retningslinjer"
            className={`
              rounded-lg
              px-2
              py-2
              text-sm
              transition
              sm:px-3
              sm:text-base
              ${pathname === "/Retningslinjer" ? "font-bold" : ""}
            `}
          >
            Retningslinjer
          </Link>
        </div>

        {/* Højre */}
        <div className="justify-self-end">
          <Adgang />
        </div>
      </div>
    </nav>
  );
}
