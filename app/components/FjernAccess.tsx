"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function PostAccessList() {
  const accesses = useQuery(api.post.getPostAccess);

  const removeAccess = useMutation(api.post.removePostAccess);

  if (!accesses) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid gap-2">
      <h2 className="font-bold">Personer med adgang</h2>

      {accesses.map((access) => (
        <div
          key={access.accessId}
          className="
            flex
            items-center
            justify-between
            rounded-lg
            p-3
          "
        >
          <p>{access.email}</p>
          <span className="text-sm text-gray-500">Rolle: {access.role}</span>

          <button
            onClick={async () => {
              await removeAccess({
                accessId: access.accessId,
              });
            }}

            className="
              rounded-lg
 
              bg-white
              px-3
              py-1
              shadow
              border 
              border-pink-300
              hover:bg-pink-50
            "
          >
            Fjern adgang
          </button>
        </div>
      ))}
    </div>
  );
}
