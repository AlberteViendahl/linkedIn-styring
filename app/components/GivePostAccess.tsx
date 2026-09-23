"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function GivePostAccess() {
  // Gemmer emailen fra inputfeltet
  const [email, setEmail] = useState("");

  // Kalder vores mutation i post.ts
  const givePostAccess = useMutation(api.post.givePostAccess);

  // role
  const [role, setRole] = useState<"Læser" | "Rediger">("Læser");

  async function handleSubmit() {
    try {
      // Sender email til backend
      await givePostAccess({
        email,
        role,
      });
      setEmail("");
      setRole("Læser");

      alert("Adgang givet");
    } catch (error) {
      console.error(error);
      alert("Kunne ikke give adgang");
    }
  }

  return (
    <div className="flex w-full gap-2">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="
        min-w-0
        flex-1
        rounded-lg
        border
        border-pink-300
        bg-white
        px-3
        py-1
        md:px-4
        md:py-2
      "
      />

      <select
        value={role}
        onChange={(event) => setRole(event.target.value as "Læser" | "Rediger")}
        className="
        rounded-lg
        border
        border-pink-300
        bg-white
        px-2
        py-1
      "
      >
        <option value="Læser">Læser</option>
        <option value="Rediger">Rediger</option>
      </select>

      <button
        onClick={handleSubmit}
        className="
        rounded-lg
        border
        border-pink-300
        bg-white
        px-3
        py-1
        md:px-4
        md:py-2
        shadow
        hover:bg-pink-50
      "
      >
        Giv adgang
      </button>
    </div>
  );
}
