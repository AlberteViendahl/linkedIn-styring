"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, FormEvent } from "react";

export default function Ideer() {
  const createQuestion = useMutation(api.question.createQuestion);
  const questions = useQuery(api.question.getQuestion);
  const updateQuestion = useMutation(api.question.updateQuestion);
  const deleteQuestion = useMutation(api.question.deleteQuestion);

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
      await createQuestion({
        title: trimmedTitle,
        description: description.trim() || undefined,
      });

      setTitle("");
      setDescription("");
    } finally {
      setIsCreating(false);
    }
  }

  function startEditing(
    questionId: string,
    title: string,
    description?: string,
  ) {
    setEditingId(questionId);
    setEditTitle(title);
    setEditDescription(description ?? "");
  }

  return (
    <div className="w-170 m-10 rounded-lg border border-pink-300 bg-pink-100 p-4">
      <h2 className="font-bold text-center mb-4">
        Spørgsmål vi kan stille medarbejderne
      </h2>

      <form onSubmit={handleCreate} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Hovedspørgsmål"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="border rounded p-2  bg-white  border-pink-300 focus:border-2 focus:border-pink-500 focus:outline-none"
        />

        <textarea
          placeholder="Underspørgsmål"
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

      <div className="mt-6 flex flex-col gap-3">
        {questions?.map((question) => (
          <div
            key={question._id}
            className="rounded-lg border border-pink-300 p-3  bg-white"
          >
            {editingId === question._id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  className="mb-2 w-full text-sm rounded border border-pink-300 focus:border-2 focus:border-pink-500 focus:outline-none p-2 "
                />

                <textarea
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  className="mb-2 w-full h-40 rounded border border-pink-300 focus:border-2 focus:border-pink-500 focus:outline-none p-2 text-sm "
                />

                <button
                  onClick={async () => {
                    await updateQuestion({
                      questionId: question._id,
                      title: editTitle,
                      description: editDescription.trim() || undefined,
                    });

                    setEditingId(null);
                  }}
                  className="mr-2 rounded text-sm bg-emerald-900 text-white px-3 py-1 "
                >
                  Gem
                </button>

                <button
                  onClick={() => setEditingId(null)}
                  className="rounded border text-sm px-3 py-1 "
                >
                  Annuller
                </button>
              </>
            ) : (
              <>
                <h3 className="font-bold ">{question.title}</h3>

                {question.description && (
                  <p className="text-sm whitespace-pre-wrap text-gray-600 ">
                    {/* // whitespace-pre-wrap laver formatering  */}
                    {question.description}
                  </p>
                )}

                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() =>
                      startEditing(
                        question._id,
                        question.title,
                        question.description,
                      )
                    }
                    className="rounded bg-gray-200 px-1 py-1 text-sm"
                  >
                    Rediger
                  </button>

                  <button
                    onClick={() =>
                      deleteQuestion({
                        questionId: question._id,
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
