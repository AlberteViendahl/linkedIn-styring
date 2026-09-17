import Kalender from "./components/Kalender";
import Nav from "./components/Nav";

export default function Home() {
  return (
    <div>
      <Nav />
      <div className="flex justify-center">
        <Kalender />
      </div>
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
