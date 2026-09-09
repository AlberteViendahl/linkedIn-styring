"use client";

import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Chat from "@/app/components/Chat";

export default function Kalender() {
  // Kalender
  const [dato, setDato] = useState(new Date());
  const [valgtDag, setValgtDag] = useState<number | null>(null);

  // Error
  const [error, setError] = useState("");

  // Formular
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Billede
  const [selectedImage, setSelectedImage] = useState<File[]>([]);

  // Status
  const [status, setStatus] = useState<"draft" | "klar" | "postet">("draft");

  // Ansvarlig
  const [ansvarlig, setAnsvarlig] = useState<"Anton" | "Alberte" | "Begge">(
    "Begge",
  );

  // Convex
  const savePost = useMutation(api.post.savePost);
  const posts = useQuery(api.post.getPosts);
  const deletePost = useMutation(api.post.deletePost);
  const generateUploadUrl = useMutation(api.post.generateUploadUrl);
  const deletePostImage = useMutation(api.post.deletePostImage);

  const aar = dato.getFullYear();
  const maaned = dato.getMonth();

  const antalDage = new Date(aar, maaned + 1, 0).getDate();

  // Mandag som første dag
  const foersteDag = (new Date(aar, maaned, 1).getDay() + 6) % 7;

  const maaneder = [
    "Januar",
    "Februar",
    "Marts",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "December",
  ];

  // Datoen på den valgte dag
  const valgtDato =
    valgtDag !== null ? `${aar}-${maaned + 1}-${valgtDag}` : null;

  // Find post på den valgte dag
  const valgtPost = posts?.find((post) => post.date === valgtDato);

  // Når man åbner en dag
  useEffect(() => {
    if (valgtDag === null) {
      return;
    }

    if (valgtPost) {
      setTitle(valgtPost.title);
      setDescription(valgtPost.description ?? "");
      setStatus(valgtPost.status);
      setAnsvarlig(valgtPost.ansvarlig);
    } else {
      setTitle("");
      setDescription("");
      setStatus("draft");
      setAnsvarlig("Begge");
    }
  }, [valgtDag, valgtPost]);

  function forrigeMaaned() {
    setDato(new Date(aar, maaned - 1, 1));
  }

  function naesteMaaned() {
    setDato(new Date(aar, maaned + 1, 1));
  }

  function handleCloseModal() {
    setSelectedImage([]);
    setValgtDag(null);
  }

  // Gem eller opdater post
  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle || valgtDag === null) {
      setError("Det skal tilføjes en titel!");
      return;
    }

    setError("");
    setIsCreating(true);
    setSelectedImage([]);

    // til image - [] for at gøre så man kan gemme mere end 1
    const storageIds = [];

    for (const image of selectedImage) {
      const uploadUrl = await generateUploadUrl();

      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": image.type,
        },
        body: image,
      });

      const data = await result.json();

      storageIds.push(data.storageId);
    }

    try {
      const postDate = `${aar}-${maaned + 1}-${valgtDag}`;

      await savePost({
        title: trimmedTitle,
        description: description.trim() || undefined,
        date: postDate,
        status: status,
        ansvarlig: ansvarlig,
        images: storageIds,
      });

      setValgtDag(null);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="min-h-screen w-full mx-4 mb-5 rounded-xl bg-pink-100 px-5 py-6">
      {/* Måned navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={forrigeMaaned}
          className="rounded-lg border border-pink-300 bg-white px-4 py-2 shadow hover:bg-pink-50"
        >
          ←
        </button>

        <h1 className="text-3xl font-bold">
          {maaneder[maaned]} {aar}
        </h1>

        <button
          onClick={naesteMaaned}
          className="rounded-lg border border-pink-300 bg-white px-4 py-2 shadow hover:bg-pink-50"
        >
          →
        </button>
      </div>

      {/* Ugedage */}
      <div className="grid grid-cols-7">
        {[
          "Mandag",
          "Tirsdag",
          "Onsdag",
          "Torsdag",
          "Fredag",
          "Lørdag",
          "Søndag",
        ].map((ugedag) => (
          <div
            key={ugedag}
            className="p-2 text-center font-semibold text-gray-600"
          >
            {ugedag}
          </div>
        ))}
      </div>

      {/* Kalender */}
      <div className="grid w-full grid-cols-7 gap-2">
        {/* Tomme felter */}
        {Array.from({ length: foersteDag }).map((_, index) => (
          <div
            key={`tom-${index}`}
            className="min-h-30 rounded-xl border border-pink-200 bg-pink-200"
          />
        ))}

        {/* Dage */}
        {Array.from({ length: antalDage }).map((_, index) => {
          const dag = index + 1;

          const dagensDato = `${aar}-${maaned + 1}-${dag}`;

          const dagensPost = posts?.find((post) => post.date === dagensDato);

          return (
            <div
              key={dag}
              onClick={() => setValgtDag(dag)}
              className="relative min-h-30 min-w-30 cursor-pointer rounded-xl border border-pink-300 bg-white p-2 shadow-sm transition hover:bg-pink-50 hover:shadow-md"
            >
              <div className="mb-3 text-lg font-bold">{dag}</div>

              {dagensPost && (
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 shrink-0 rounded-full ${
                      dagensPost.status === "draft"
                        ? "bg-red-500"
                        : dagensPost.status === "klar"
                          ? "bg-amber-400"
                          : "bg-green-600"
                    }`}
                  />

                  <p className="truncate text-sm font-medium">
                    {dagensPost.title}
                  </p>

                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {dagensPost.ansvarlig}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {valgtDag !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex h-[88vh] w-full max-w-8xl flex-col rounded-xl border border-pink-300 bg-white shadow-xl">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-pink-200 px-6 py-4">
              <h2 className="text-xl font-bold">
                {valgtDag}. {maaneder[maaned]} {aar}
              </h2>

              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-lg border border-pink-300 px-3 py-1 text-sm hover:bg-pink-50"
              >
                Luk ✕
              </button>
            </div>

            <form
              onSubmit={handleCreate}
              className="grid min-h-0 flex-1 grid-cols-3 gap-6 overflow-hidden px-6 py-6"
            >
              {/* KOLONNE 1 - TEKST */}
              <div className="col-span-1 flex min-h-0 flex-col overflow-hidden">
                <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-2">
                  {/* Status + ansvarlig */}
                  <div className="flex gap-2">
                    {/* Status */}
                    <select
                      value={status}
                      onChange={(event) =>
                        setStatus(
                          event.target.value as "draft" | "klar" | "postet",
                        )
                      }
                      className={`rounded-lg border p-2 text-sm ${
                        status === "draft"
                          ? "border-red-300 bg-red-500 text-white"
                          : status === "klar"
                            ? "border-amber-300 bg-amber-400 text-black"
                            : "border-green-300 bg-green-600 text-white"
                      }`}
                    >
                      <option value="draft">Draft</option>
                      <option value="klar">Klar</option>
                      <option value="postet">Postet</option>
                    </select>

                    {/* Ansvarlig */}
                    <select
                      value={ansvarlig}
                      onChange={(event) =>
                        setAnsvarlig(
                          event.target.value as "Anton" | "Alberte" | "Begge",
                        )
                      }
                      className="rounded-lg border border-pink-300 p-2 text-sm focus:border-2 focus:border-pink-500 focus:outline-none"
                    >
                      <option value="Anton">Anton</option>
                      <option value="Alberte">Alberte</option>
                      <option value="Begge">Begge</option>
                    </select>
                  </div>

                  {/* Titel */}
                  <input
                    type="text"
                    placeholder="Titel"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="rounded-lg border border-pink-300 bg-white p-2 focus:border-2 focus:border-pink-500 focus:outline-none"
                  />

                  {/* Beskrivelse */}
                  <textarea
                    placeholder="Beskrivelse"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="min-h-40 flex-1 resize-none rounded-lg border border-pink-300 bg-white p-2 text-sm focus:border-2 focus:border-pink-500 focus:outline-none"
                  />
                </div>

                {/* Gem / slet opslag */}
                <div className="flex shrink-0 items-center justify-between border-t border-pink-200 pt-4">
                  {error ? (
                    <p className="text-sm text-red-600">{error}</p>
                  ) : (
                    <span />
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="rounded-lg bg-emerald-700 px-4 py-2 text-sm text-white disabled:opacity-50"
                    >
                      {isCreating
                        ? "Gemmer..."
                        : valgtPost
                          ? "Gem"
                          : "Opret opslag"}
                    </button>

                    {valgtPost && (
                      <button
                        type="button"
                        onClick={async () => {
                          await deletePost({
                            postId: valgtPost._id,
                          });

                          setSelectedImage([]);
                          setValgtDag(null);
                        }}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
                      >
                        Slet
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* KOLONNE 2 - BILLEDER */}
              <div className="col-span-1 flex min-h-0 flex-col overflow-hidden rounded-lg border border-pink-200 p-4">
                {/* Billede header */}
                <div className="mb-4 flex shrink-0 items-center justify-between">
                  <h3 className="font-semibold">Billeder</h3>

                  <label className="cursor-pointer rounded-lg border border-pink-300 px-3 py-1.5 text-sm hover:bg-pink-50">
                    Vælg billeder
                    <input
                      className="hidden"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => {
                        const files = Array.from(event.target.files ?? []);

                        setSelectedImage((previous) => [...previous, ...files]);

                        // Gør det muligt at vælge samme fil igen
                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>

                {/* Alle billeder */}
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-3">
                    {/* GEMTE BILLEDER */}
                    {valgtPost?.imageUrls?.map((url, index) => {
                      const imageId = valgtPost.images?.[index];

                      if (!url || !imageId) {
                        return null;
                      }

                      return (
                        <div
                          key={imageId}
                          className="relative overflow-hidden rounded-lg border border-pink-200"
                        >
                          <img
                            src={url}
                            alt={`${valgtPost.title} ${index + 1}`}
                            className="h-48 w-full object-contain"
                          />

                          {/* Slet gemt billede */}
                          <button
                            type="button"
                            onClick={async () => {
                              await deletePostImage({
                                postId: valgtPost._id,
                                imageId: imageId,
                              });
                            }}
                            className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-xs font-bold text-red-600 shadow hover:bg-red-50"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}

                    {/* NYE VALGTE BILLEDER */}
                    {selectedImage.map((file, index) => (
                      <div
                        key={`${file.name}-${file.lastModified}-${index}`}
                        className="relative overflow-hidden rounded-lg border border-pink-200"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="h-48 w-full object-contain"
                        />

                        {/* Fjern nyt billede */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage((images) =>
                              images.filter(
                                (_, imageIndex) => imageIndex !== index,
                              ),
                            );
                          }}
                          className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-xs font-bold text-red-600 shadow hover:bg-red-50"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Ingen billeder */}
                  {selectedImage.length === 0 &&
                    !valgtPost?.imageUrls?.some(Boolean) && (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-gray-400">
                          Ingen billeder valgt
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {/* KOLONNE 3 - CHAT */}
              <div className="col-span-1 flex min-h-0 flex-col overflow-hidden rounded-lg border border-pink-300 bg-pink-50 p-4">
                <div className="mt-auto">
                  <Chat description={description} />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
