"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, FormEvent } from "react";

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
    <div className="w-170 m-10 rounded-lg border bg-pink-100 border-pink-300 focus:border-2 focus:border-pink-500 focus:outline-none p-4">
      <h2 className="font-bold text-center mb-4">Ideer til opslag</h2>

      <form onSubmit={handleCreate} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Titel"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="border rounded p-2 bg-white border-pink-300 focus:border-2 focus:border-pink-500 focus:outline-none"
        />

        <textarea
          placeholder="Beskrivelse"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="border rounded p-2 min-h-40 bg-white border-pink-300 focus:border-2 focus:border-pink-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={isCreating}
          className="bg-emerald-700 w-20 text-white rounded p-2 disabled:opacity-50"
        >
          {isCreating ? "Opretter..." : "Opret"}
        </button>
      </form>

      <div className="mt-6  flex flex-col gap-3">
        {ideas?.map((idea) => (
          <div
            key={idea._id}
            className="rounded-lg border p-3 bg-white border-pink-300"
          >
            {editingId === idea._id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  className="mb-2 w-full text-sm rounded border border-pink-300 focus:border-2 focus:border-pink-500 focus:outline-none p-2"
                />

                <textarea
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  className="mb-2 w-full h-40 rounded text-sm border p-2 border-pink-300 focus:border-2 focus:border-pink-500 focus:outline-none"
                />

                <button
                  onClick={async () => {
                    await updateIdea({
                      ideaId: idea._id,
                      title: editTitle,
                      description: editDescription.trim() || undefined,
                    });

                    setEditingId(null);
                  }}
                  className="mr-2 rounded text-sm bg-emerald-900 px-3 py-1 text-white"
                >
                  Gem
                </button>

                <button
                  onClick={() => setEditingId(null)}
                  className="rounded border text-sm px-3 py-1"
                >
                  Annuller
                </button>
              </>
            ) : (
              <>
                <h3 className="font-bold">{idea.title}</h3>

                {idea.description && (
                  <p className="text-sm whitespace-pre-wrap text-gray-600">
                    {idea.description}
                  </p>
                )}

                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() =>
                      startEditing(idea._id, idea.title, idea.description)
                    }
                    className="rounded bg-gray-200 px-1 py-1 text-sm"
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
