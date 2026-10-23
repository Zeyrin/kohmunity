import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { site } from "@/content/config";
import { formatPartyDate, nextPartyNights } from "@/lib/moon";

/**
 * SEO landing page: "full moon party dates 2026/2027" is the biggest search in this niche,
 * and every hostel on the island competes for it. Dates come from lib/moon.ts and the page
 * regenerates daily ('use cache' + cacheLife('days')), so it never goes stale and never needs editing.
 */
async function getUpcoming() {
  "use cache";
  cacheLife("days");
  const now = new Date();
  return nextPartyNights(now, 13).map((p) => ({
    dateKey: p.dateKey,
    label: formatPartyDate(p, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    moonAt: new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Bangkok",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(p.fullMoonAt),
    overridden: p.overridden,
    year: Number(p.dateKey.slice(0, 4)),
  }));
}

export async function generateMetadata(): Promise<Metadata> {
  const parties = await getUpcoming();
  const years = [...new Set(parties.map((p) => p.year))].join(" & ");
  const title = `Full Moon Party Dates ${years} — Koh Phangan Calendar`;
  const description = `Every upcoming Full Moon Party date on Haad Rin, Koh Phangan (${years}), calculated from the lunar calendar — plus where to stay and how to get there.`;
  return {
    title,
    description,
    alternates: { canonical: "/full-moon-party-dates" },
    openGraph: { title, description },
  };
}

export default async function FullMoonDatesPage() {
  const parties = await getUpcoming();
  const [next] = parties;
  const years = [...new Set(parties.map((p) => p.year))].join(" & ");

  return (
    <main id="main" className="px-4 pb-24 pt-28 md:px-12 md:pt-36">
      <nav aria-label="Breadcrumb" className="label text-ink-dim">
        <Link href="/" className="hover:text-accent">
          {site.name}
        </Link>{" "}
        / Full Moon Party dates
      </nav>

      <h1 className="display mt-6 text-[13vw] text-ink md:text-[7vw]">
        Full Moon Party <span className="text-accent glow">dates</span>
      </h1>
      <p className="serif-accent mt-3 text-2xl text-accent-2 md:text-4xl">Koh Phangan · {years}</p>

      <p className="mt-8 max-w-2xl font-mono text-sm leading-relaxed text-ink-dim md:text-base">
        The Full Moon Party happens on Haad Rin Sunrise Beach on the night of every full moon. The next one is on{" "}
        <strong className="text-ink">{next.label}</strong>. Dates below are calculated from the lunar calendar
        (Bangkok time). Occasionally the party moves a day to avoid a Buddhist holiday — we update this page when
        it does, but always double-check before you book flights.
      </p>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full border-collapse text-left font-mono text-sm">
          <caption className="sr-only">Upcoming Full Moon Party dates on Koh Phangan</caption>
          <thead className="label bg-bg-2 text-ink-dim">
            <tr>
              <th scope="col" className="px-4 py-3 font-normal">#</th>
              <th scope="col" className="px-4 py-3 font-normal">Party night</th>
              <th scope="col" className="hidden px-4 py-3 font-normal sm:table-cell">Exact full moon (BKK)</th>
            </tr>
          </thead>
          <tbody>
            {parties.map((p, i) => (
              <tr key={p.dateKey} className={`border-t border-line ${i === 0 ? "bg-accent text-on-accent" : "text-ink"}`}>
                <td className="px-4 py-3">{String(i + 1).padStart(2, "0")}</td>
                <td className="px-4 py-3 font-bold">
                  <time dateTime={p.dateKey}>{p.label}</time>
                  {i === 0 ? " ← next" : ""}
                  {p.overridden ? " *" : ""}
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">{p.moonAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section aria-labelledby="stay" className="mt-20 grid gap-8 md:grid-cols-2 md:gap-16">
        <div>
          <h2 id="stay" className="display text-4xl text-ink md:text-6xl">
            Where to stay for the Full Moon
          </h2>
        </div>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-ink-dim md:text-base">
          <p>
            Haad Rin hostels are loud, pricey and full of people who&apos;ll be gone tomorrow. {site.name} is in Thong
            Sala, 15 minutes by taxi from Haad Rin: we throw the
            pre-party (UV paint, buckets, the whole family), sort the taxis together, and you come home to a pool
            instead of a 6am sandwich on the beach.
          </p>
          <p>
            Beds go fast on Full Moon week and prices rise island-wide — book early and book direct for the best
            price.
          </p>
          <a href={site.bookingUrl} className="cta mt-2" data-magnetic>
            Grab a bed <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section aria-labelledby="faq" className="mt-20 max-w-3xl">
        <h2 id="faq" className="display text-3xl text-ink md:text-5xl">
          Quick answers
        </h2>
        <dl className="mt-6 divide-y divide-line border-y border-line font-mono text-sm leading-relaxed md:text-base">
          {[
            ["What time does the Full Moon Party start?", "Things get going on Haad Rin around 8–9pm and run until well after sunrise."],
            ["How much is the entry?", "There's a small entrance fee on the night, paid at the beach. Bring cash."],
            ["How do I get there from Thong Sala?", "Shared taxis (songthaews) run all night, about 15 minutes each way. We organise group rides from the pre-party."],
            ["Is it safe to go alone?", "Go alone, arrive with a crew. That's literally what our pre-party is for. Stick together, watch your drink, and keep your phone in a zip bag."],
          ].map(([q, a]) => (
            <div key={q} className="py-5">
              <dt className="font-bold text-ink">{q}</dt>
              <dd className="mt-1 text-ink-dim">{a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
