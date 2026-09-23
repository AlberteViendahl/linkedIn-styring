"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

import Kalender from "./components/Kalender";
import Nav from "./components/Nav";

import GivePostAccess from "./components/GivePostAccess";

export default function Home() {
  return (
    <div>
      {/*      <GivePostAccess /> */}
      <Nav />
      <Kalender />
    </div>
  );
}

/* "use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

import { SignIn } from "./components/SignIn";
import Kalender from "./components/Kalender";
import Nav from "./components/Nav";

export default function Home() {
  return (
    <main>
      <AuthLoading>
        <p>Loading...</p>
      </AuthLoading>

      <Unauthenticated>
        <SignIn />
      </Unauthenticated>

      <Authenticated>
        <Nav />
        <Kalender />
      </Authenticated>
    </main>
  );
}
 */
