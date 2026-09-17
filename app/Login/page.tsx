"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

import { SignIn } from "@/app/components/SignIn";

export default function Home() {
  return (
    <main>
      <SignIn />
    </main>
  );
}
