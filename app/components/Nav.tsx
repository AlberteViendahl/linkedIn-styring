"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  return (
    <div className="flex justify-around">
      <Link href="/" className="text-xl font-bold sm:m-5 m-2 ">
        LinkedIn Styring
      </Link>

      <div className="m-6">
        <Link href="/" className={`p-2 ${pathname === "/" ? "font-bold" : ""}`}>
          Kalender
        </Link>

        <Link
          href="/Ideer"
          className={`p-2 ${pathname === "/Ideer" ? "font-bold" : ""}`}
        >
          Ideer
        </Link>

        <Link
          href="/Retningslinjer"
          className={`p-2 ${pathname === "/Retningslinjer" ? "font-bold" : ""}`}
        >
          Retningslinjer
        </Link>
      </div>
    </div>
  );
}
