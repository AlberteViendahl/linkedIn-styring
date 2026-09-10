"use client";

import axios from "axios";
import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatProps = {
  description: string;
};

export default function Chat({ description }: ChatProps) {
  const [besked, setBesked] = useState("");
  const [svar, setSvar] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendBesked = async () => {
    if (!besked.trim()) {
      return;
    }

    try {
      setIsLoading(true);

      const updatedMessages: Message[] = [
        ...messages,
        {
          role: "user",
          content: besked,
        },
      ];

      const { data } = await axios.post("/api/chat", {
        messages: updatedMessages,
        description,
      });

      setSvar(data.svar);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.svar,
        },
      ]);

      setBesked("");
    } catch (error) {
      console.error(error);
      setSvar("Der skete en fejl");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full shrink-0">
      <div className="text-sm">
        {svar && (
          <div
            dangerouslySetInnerHTML={{
              __html: svar,
            }}
          />
        )}
      </div>

      <div className="lg:m-5 flex lg:gap-3 gap-1">
        <input
          className="flex-1 rounded-lg border border-pink-300 bg-white px-3 py-2 text-sm focus:border-2 focus:border-pink-500 focus:outline-none"
          value={besked}
          onChange={(event) => setBesked(event.target.value)}
          placeholder="Skriv til mig..."
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();

              if (!isLoading && besked.trim()) {
                sendBesked();
              }
            }
          }}
        />

        <button
          type="button"
          className="rounded-lg bg-pink-400 px-2 lg:px-4 md:py-2 text-sm font-medium text-white disabled:opacity-50"
          onClick={sendBesked}
          disabled={isLoading || !besked.trim()}
        >
          {isLoading ? "Sender..." : "Send"}
        </button>
      </div>
    </div>
  );
}
