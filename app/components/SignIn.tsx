import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function SignIn() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  return (
    <div className="flex min-h-screen items-center justify-center bg-pink-100 px-4">
      <form
        className="grid w-full max-w-sm gap-5 rounded-2xl border border-pink-300 bg-white p-8 shadow-lg"
        onSubmit={(event) => {
          event.preventDefault();

          const formData = new FormData(event.currentTarget);
          void signIn("password", formData);
        }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {step === "signIn" ? "LinkedIn Styring" : "Opret bruger"}
          </h1>

          <p className="mt-1 text-sm">
            {step === "signIn" ? "Log ind på din konto" : "Opret en ny konto"}
          </p>
        </div>

        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>

          <input
            id="email"
            name="email"
            placeholder="din@email.dk"
            type="email"
            className="w-full rounded-lg border border-pink-300 bg-white px-3 py-2 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>

          <input
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            className="w-full rounded-lg border border-pink-300 bg-white px-3 py-2 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
          />
        </div>

        <input name="flow" type="hidden" value={step} />

        <button
          className="rounded-lg border border-pink-300 bg-pink-500 text-white px-3 py-1 md:px-4 md:py-2 shadow hover:bg-pink-50 hover:text-black"
          type="submit"
        >
          {step === "signIn" ? "Sign in" : "Sign up"}
        </button>

        <button
          className="rounded-lg border border-pink-300 bg-white px-3 py-1 md:px-4 md:py-2 shadow hover:bg-pink-50"
          type="button"
          onClick={() => {
            setStep(step === "signIn" ? "signUp" : "signIn");
          }}
        >
          {step === "signIn" ? "Sign up instead" : "Sign in instead"}
        </button>
      </form>
    </div>
  );
}
