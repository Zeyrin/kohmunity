import Image from "next/image";
import { lineup, type EventItem } from "@/content/events";
import { photo } from "@/content/photos";
import { site } from "@/content/config";
import { SectionHeading } from "../section-heading";
import { EventsMotion } from "./events-motion";
import { NextMoonDate } from "./next-moon-date";

const DAY_NAMES: Record<EventItem["day"], string> = {
  DAILY: "Every day",
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
  MONTHLY: "Every full moon",
};

/** Halftone dots, the rave-flyer staple — one CSS gradient, no image request. */
const halftone = {
  backgroundImage: "radial-gradient(circle at center, var(--line) 1.2px, transparent 1.6px)",
  backgroundSize: "9px 9px",
};

function EventRow({ e, i }: { e: EventItem; i: number }) {
  const p = e.photo ? photo(e.photo) : null;
  const isMoon = e.day === "MONTHLY";
  return (
    <li
      data-event-row
      data-vibe={e.vibe}
      className={`group relative grid grid-cols-[4.6rem_1fr] gap-x-3 border-t border-dashed border-line py-6 md:grid-cols-[11.5rem_1fr_14rem] md:items-center md:gap-x-8 md:py-7 ${
        isMoon ? "-mx-4 rounded-2xl bg-night px-4 text-cream md:-mx-6 md:px-6" : ""
      }`}
    >
      <div className={isMoon ? "on-photo" : undefined}>
        <p className="display text-[1.6rem] leading-none text-accent md:text-5xl">
          <abbr title={DAY_NAMES[e.day]} className="no-underline">
            {e.day === "MONTHLY" ? "🌕" : e.day === "DAILY" ? "7/7" : e.day}
          </abbr>
        </p>
        <p className="label mt-2 text-[0.62rem] text-ink-dim">{e.time}</p>
      </div>

      <div className={isMoon ? "on-photo" : undefined}>
        <h3 className="display text-[1.55rem] leading-[0.92] md:text-[2.6rem]">
          {e.title}
          {e.free ? (
            <span
              data-stamp
              className="label ml-2 inline-block -rotate-6 rounded-full border-2 border-accent-2 px-2 py-0.5 align-middle text-[0.6rem] text-accent-2"
            >
              Free
            </span>
          ) : null}
        </h3>
        <p className="mt-2 max-w-xl font-mono text-sm leading-relaxed text-ink-dim">
          {e.blurb}
          {isMoon ? (
            <span className="mt-1 block text-accent">
              <NextMoonDate />
            </span>
          ) : null}
        </p>
      </div>

      {p ? (
        <div
          className={`relative col-start-2 mt-4 aspect-[4/3] w-40 overflow-hidden rounded-md md:col-start-3 md:mt-0 md:w-full ${
            i % 2 ? "rotate-2" : "-rotate-2"
          }`}
        >
          <Image
            src={p.src}
            alt={p.alt}
            fill
            sizes="(min-width: 768px) 224px, 160px"
            placeholder="blur"
            blurDataURL={p.blurDataURL}
            // duotone-ish: grayscale photo, accent shows through via multiply layer
            className="object-cover grayscale contrast-125 transition-[filter] duration-500 group-hover:grayscale-0"
            style={{ objectPosition: p.focus }}
          />
          <div className="pointer-events-none absolute inset-0 bg-accent-3 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" aria-hidden="true" />
        </div>
      ) : null}
    </li>
  );
}

export function Events() {
  return (
    <section id="events" aria-labelledby="events-title" className="relative py-24 md:py-32">
      <SectionHeading index="04" label="The Week" id="events-title" aside="(sleep is not on the schedule)">
        This week <span className="text-accent">at home.</span>
      </SectionHeading>

      {/* the flyer */}
      <div className="mt-12 px-3 md:mt-16 md:px-12">
        <article
          data-flyer
          aria-label="Weekly line-up"
          className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] border border-line bg-bg-2 px-4 py-8 md:-rotate-1 md:px-10 md:py-12"
        >
          <div className="pointer-events-none absolute inset-0 opacity-70" style={halftone} aria-hidden="true" />
          <div className="relative">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-4">
              <p className="label text-ink">{site.name} presents</p>
              <p className="label text-ink-dim">Thong Sala · Koh Phangan</p>
            </div>
            <p className="display mt-6 text-[17vw] leading-[0.8] text-ink md:text-[7.5rem]">
              The <span className="text-accent-2">line</span>&#8209;up
            </p>
            <p className="serif-accent mt-2 text-xl text-ink-dim md:text-2xl">
              Weekly, forever. Show up to one, leave with twelve friends.
            </p>

            <ol className="mt-8 md:mt-12">
              {lineup.map((e, i) => (
                <EventRow key={e.title} e={e} i={i} />
              ))}
            </ol>

            <div className="mt-8 flex flex-col gap-5 border-t-2 border-ink pt-6 md:flex-row md:items-center md:justify-between">
              <p className="label max-w-md leading-relaxed text-ink-dim">
                Ages {site.policies.ages} · music off at {site.policies.musicOff} · no curfew · taxis to every big
                party sorted at reception
              </p>
              <a href={site.bookingUrl} className="cta self-start" data-magnetic>
                Get on the list <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </article>
      </div>
      <EventsMotion />
    </section>
  );
}
