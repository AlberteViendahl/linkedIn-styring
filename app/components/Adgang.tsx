"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

import GivePostAccess from "./GivePostAccess";
import PostAccessList from "./FjernAccess";

export default function PostAccessManager() {
  const [open, setOpen] = useState(false);

  const { signOut } = useAuthActions();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/Login";
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          rounded-lg
          border
          border-pink-300
          bg-white
          px-4
          py-2
          shadow-sm
          hover:bg-pink-50
        "
      >
        Administrer adgang
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          {/* Mørk baggrund */}
          <button
            aria-label="Luk"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* Drawer */}
          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              flex
              max-h-[80vh]
              flex-col
              rounded-t-2xl
              bg-white
              shadow-xl
              md:bottom-auto
              md:left-auto
              md:right-0
              md:top-0
              md:h-full
              md:max-h-none
              md:w-[420px]
              md:rounded-none
            "
          >
            {/* Header */}
            <div className="relative border-b p-5">
              <button
                onClick={() => setOpen(false)}
                aria-label="Luk"
                className="
                  absolute
                  right-4
                  top-4
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  text-xl
                  text-gray-500
                  transition
                  hover:bg-pink-50
                  hover:text-gray-900
                "
              >
                ×
              </button>

              <h2 className="pr-10 text-lg font-semibold">
                Administrer adgang
              </h2>

              <p className="mt-1 pr-10 text-sm text-gray-500">
                Tilføj eller fjern personer med adgang til opslaget.
              </p>
            </div>

            {/* Indhold */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid gap-6">
                <GivePostAccess />

                <div className="border-t pt-5">
                  <PostAccessList />
                </div>
              </div>
            </div>

            {/* Bund */}
            <div className="mt-auto border-t p-5">
              <button
                onClick={handleSignOut}
                className="
                  mx-auto
                  flex
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-pink-300
                  bg-white
                  px-4
                  py-2
                  shadow-sm
                  transition
                  hover:bg-pink-50
                "
              >
                Log ud
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
