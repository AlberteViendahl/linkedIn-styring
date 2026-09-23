"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, FormEvent } from "react";
import { Doc } from "@/convex/_generated/dataModel";

export default function Ideer() {
  const createIdea = useMutation(api.ide.createIdea);
  const ideas = useQuery(api.ide.getIdeas);
  const updateIdea = useMutation(api.ide.updateIdea);
  const deleteIdea = useMutation(api.ide.deleteIdea);

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    setIsCreating(true);

    try {
      await createIdea({
        title: trimmedTitle,
        description: description.trim() || undefined,
      });

      setTitle("");
      setDescription("");
    } finally {
      setIsCreating(false);
    }
  }

  function startEditing(ideaId: string, title: string, description?: string) {
    setEditingId(ideaId);
    setEditTitle(title);
    setEditDescription(description ?? "");
  }

  return (
    <div className="w-full rounded-lg border border-pink-300 bg-pink-100 p-3 sm:p-4">
      <h2 className="mb-4 text-center font-bold">Ideer til opslag</h2>

      <form onSubmit={handleCreate} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Titel"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded border border-pink-300 bg-white p-2 focus:border-2 focus:border-pink-500 focus:outline-none"
        />

        <textarea
          placeholder="Beskrivelse"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="min-h-32 w-full resize-none rounded border border-pink-300 bg-white p-2  focus:border-pink-500 focus:outline-none sm:min-h-40"
        />

        <button
          type="submit"
          disabled={isCreating}
          className="w-full rounded bg-emerald-700 p-2 text-white disabled:opacity-50 sm:w-20"
        >
          {isCreating ? "Opretter..." : "Opret"}
        </button>
      </form>

      <div className="mt-6 flex  flex-col gap-3">
        {ideas?.map((idea: Doc<"idea">) => (
          <div
            key={idea._id}
            className="w-full rounded-lg border border-pink-300 bg-white p-3"
          >
            {editingId === idea._id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  className="mb-2 w-full  rounded border border-pink-300 p-2 text-sm focus:border-pink-500 focus:outline-none"
                />

                <textarea
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  className="mb-2 h-32 resize-none w-full rounded border border-pink-300 p-2 text-sm focus:border-2 focus:border-pink-500 focus:outline-none sm:h-40"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={async () => {
                      await updateIdea({
                        ideaId: idea._id,
                        title: editTitle,
                        description: editDescription.trim() || undefined,
                      });

                      setEditingId(null);
                    }}
                    className="rounded bg-emerald-900 px-3 py-1 text-sm text-white"
                  >
                    Gem
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded border px-3 py-1 text-sm"
                  >
                    Annuller
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="wrap-break-words font-bold">{idea.title}</h3>

                {idea.description && (
                  <p className="wrap-break-words whitespace-pre-wrap text-sm text-gray-600">
                    {idea.description}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap justify-end gap-2">
                  <button
                    onClick={() =>
                      startEditing(idea._id, idea.title, idea.description)
                    }
                    className="rounded bg-gray-200 px-2 py-1 text-sm"
                  >
                    Rediger
                  </button>

                  <button
                    onClick={() =>
                      deleteIdea({
                        ideaId: idea._id,
                      })
                    }
                    className="rounded bg-red-500 px-2 py-1 text-sm text-white"
                  >
                    Slet
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
