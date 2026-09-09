import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  const { messages, description } =
    await request.json();

  if (!messages) {
    return NextResponse.json(
      {
        error: "Mangler 'messages'",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-5.6-luna",

        messages: [
          {
            role: "system",
            content: `
Du er en hjælpsom assistent til at skrive og omskrive tekster til LinkedIn.

Din opgave er at hjælpe med at forbedre LinkedIn-opslag.

Du skal:
- omskrive tekster så de bliver mere engagerende
- lave stærkere åbninger
- forbedre sproget
- bevare brugerens budskab
- skrive professionelt på dansk

FORMATREGLER:

Alt skal være i HTML uden body- eller head-tags.

Brug kun ul, li og p.

ul og li skal bruges til alle former for lister.

p skal bruges hvis der ikke nævnes en række af ting.

Tilføj "-" foran indholdet i hvert li-element.
            `,
          },

          {
            role: "system",
            content: `
Her er den aktuelle tekst fra brugerens LinkedIn-opslag:

${description || "(Der er ingen tekst i opslaget endnu)"}

Du kan læse og bruge denne tekst som kontekst, når brugeren spørger om opslaget.

Hvis brugeren skriver ting som:
"Gør åbningen bedre"
"Hvad synes du om teksten?"
"Kan den gøres kortere?"
"Har du forslag til en CTA?"
Eller lignende 

så skal du forstå, at brugeren henviser til teksten ovenfor.

Du må ikke antage, at brugeren har kopieret teksten ind i chatten.
            `,
          },

          ...messages,
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const svar =
      data.choices[0].message.content;

    return NextResponse.json(
      {
        svar,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Fejl:",
        error.response?.data ||
          error.message
      );
    }

    return NextResponse.json(
      {
        error: "Noget gik galt",
      },
      {
        status: 500,
      }
    );
  }
}