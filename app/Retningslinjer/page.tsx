import Nav from "../components/Nav";

export default function Retningslinjer() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <main className="mx-auto max-w-6xl px-4 py-5">
        <div className="mb-5 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Retningslinjer for LinkedIn-posts
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Best practices og content-spor til vores LinkedIn-indhold
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Best practice */}
          <section className="rounded-xl border border-pink-300 bg-pink-100 p-6">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
              Best practice LinkedIn
            </h2>

            <ul className="list-disc space-y-4 pl-5 text-sm leading-6 text-gray-700 marker:text-pink-500">
              <li>
                Post én gang om ugen, gerne tirsdag eller torsdag i tidsrummet
                9.00-10.30 eller 12.30-13.30.
              </li>

              <li>
                Helst om morgenen. Vi kan sagtens poste mere end én gang om
                ugen, hvis der er ressourcer til det.
              </li>

              <li>
                Pas på med for meget direkte salg i opslagene. Ideen er, at vi
                viser vores følgere, at vi er fede mennesker, der laver seje
                ting. På den måde lærer de os at kende, og vi er top of mind,
                når de skal bruge et bureau.
              </li>

              <li>
                Opslag, der viser personlighed og behind the scenes, fungerer
                godt. Gerne med billeder af teamet.
              </li>

              <li>
                Man behøver ikke altid inkludere links i opslagene, da man
                risikerer, at algoritmen straffer det.
              </li>

              <li>
                Hav et klart hook i første sætning, som gør det interessant for
                læseren at læse videre.
              </li>

              <li>
                Inkluder 🌱 et sted i opslagets tekst for en visuel rød tråd og
                brand-genkendelighed.
              </li>

              <li>
                Andre emojis, vi typisk bruger, når de passer til indholdet: 👀
                👋🏼 🚀
              </li>

              <li>Afslut opslaget med en CTA, CTF eller CTE.</li>

              <li>
                Når opslaget bliver postet, så del det med resten af teamet med
                det samme, så der hurtigt kommer likes, kommentarer og
                aktivitet.
              </li>

              <li>
                Husk at besvare kommentarer til opslaget. Det skaber mere
                engagement.
              </li>

              <li>
                Tænk gerne i mere visuelt indhold, eksempelvis PDF'er, der
                bliver til scrollable karuseller på LinkedIn.
              </li>

              <li>
                Hvis vi inkluderer mennesker eller virksomheder i teksten, så
                husk at tagge dem med @. Det kan øge reach.
              </li>
            </ul>
          </section>

          {/* Contentspor */}
          <section className="rounded-xl border border-pink-300 bg-pink-100 p-6">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
              Contentspor
            </h2>

            <ol className="list-decimal space-y-6 pl-5 text-sm leading-6 text-gray-700 marker:font-bold marker:text-pink-500">
              <li>
                <span className="font-semibold text-gray-900">
                  Nyheder inden for vores felt
                </span>

                <p className="mt-1">
                  Viser følgerne, at vi er thought leaders og eksperter inden
                  for vores felt. Det understøtter vores ekspertposition og
                  viser vores markedsviden.
                </p>
              </li>

              <li>
                <span className="font-semibold text-gray-900">
                  Interne opslag og nyheder
                </span>

                <p className="mt-1">
                  Hvad laver vi i teamet, nye ansigter, sjov og ballade samt
                  inspiration fra hverdagen. Det viser, at vi er mennesker, som
                  andre gerne vil arbejde sammen med.
                </p>
              </li>

              <li>
                <span className="font-semibold text-gray-900">Cases</span>

                <p className="mt-1">
                  Del arbejdet og resultaterne fra vores kunder samt interne
                  projekter. Det viser, at vi har styr på vores ydelser og kan
                  levere.
                </p>
              </li>

              <li>
                <span className="font-semibold text-gray-900">
                  Direkte salg
                </span>

                <p className="mt-1">
                  Bruges kun en sjælden gang imellem, når vi deler information
                  om vores ydelser og det, vi kan tilbyde.
                </p>

                <div className="mt-3 rounded-lg border border-pink-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                    Eksempel på CTA
                  </p>

                  <p className="mt-1 italic text-gray-600">
                    "Hiv fat i os til en kop kaffe og en god snak om, hvordan vi
                    kan hjælpe dig."
                  </p>
                </div>
              </li>
            </ol>
          </section>
        </div>
      </main>
    </div>
  );
}
