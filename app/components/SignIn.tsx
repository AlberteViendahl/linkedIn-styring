import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function SignIn() {
  const { signIn } = useAuthActions();

  const [step, setStep] = useState<"signIn" | "signUp" | { email: string }>(
    "signIn",
  );

  // Fejlbeskeder
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center">
      {step === "signIn" || step === "signUp" ? (
        <form
          key="sign-in-form"
          className="flex flex-col items-center gap-4 w-80 p-6 border-2 border-pink-300 bg-pink-100 rounded-2xl"
          onSubmit={(event) => {
            event.preventDefault();

            // Nulstil gamle fejl
            setEmailError("");
            setPasswordError("");

            const formData = new FormData(event.currentTarget);

            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            let hasError = false;

            // Tjek email
            if (!email.trim()) {
              setEmailError("Du skal indtaste en email.");
              hasError = true;
            }

            // Tjek password
            if (!password.trim()) {
              setPasswordError("Du skal indtaste en adgangskode.");
              hasError = true;
            } else if (password.length < 8) {
              setPasswordError("Adgangskoden skal være mindst 8 tegn.");
              hasError = true;
            }

            // Stop hvis der er fejl
            if (hasError) {
              return;
            }

            void signIn("password", formData).then(() =>
              setStep({
                email: formData.get("email") as string,
              }),
            );
          }}
        >
          <input
            className="border-2 border-pink-300 p-2 rounded-2xl w-full bg-white"
            name="email"
            placeholder="Email"
            type="email"
          />

          {emailError && (
            <p className="text-red-500 text-sm w-full">{emailError}</p>
          )}

          <input
            className="border-2 border-pink-300 p-2 rounded-2xl w-full bg-white"
            name="password"
            placeholder="Password"
            type="password"
          />

          {passwordError && (
            <p className="text-red-500 text-sm w-full">{passwordError}</p>
          )}

          <input name="flow" value={step} type="hidden" readOnly />

          <button
            className="border-2 border-pink-300 p-2 rounded-2xl w-28 bg-white hover:bg-pink-50"
            type="submit"
          >
            {step === "signIn" ? "Sign in" : "Sign up"}
          </button>

          <button
            className="border-2 border-pink-300 p-2 rounded-2xl bg-white hover:bg-pink-50"
            type="button"
            onClick={() => {
              setEmailError("");
              setPasswordError("");

              setStep(step === "signIn" ? "signUp" : "signIn");
            }}
          >
            {step === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </form>
      ) : (
        <form
          key="verification-form"
          className="flex flex-col items-center gap-4 w-80 p-6 border-2 border-pink-300 bg-pink-100 rounded-2xl"
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            void signIn("password", formData);
          }}
        >
          <h2 className="text-xl font-bold">Bekræft din email</h2>

          <p className="text-sm text-center">
            Vi har sendt en kode til
            <br />
            <strong>{step.email}</strong>
          </p>

          <input
            className="border-2 border-pink-300 p-2 rounded-2xl w-full bg-white"
            name="code"
            placeholder="Code"
            type="text"
          />

          <input
            name="flow"
            type="hidden"
            value="email-verification"
            readOnly
          />

          <input name="email" value={step.email} type="hidden" readOnly />

          <button
            className="border-2 border-pink-300 p-2 rounded-2xl bg-white hover:bg-pink-50"
            type="submit"
          >
            Continue
          </button>

          <button
            className="border-2 border-pink-300 p-2 rounded-2xl bg-white hover:bg-pink-50"
            type="button"
            onClick={() => setStep("signIn")}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
