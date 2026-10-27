import Image from "next/image";
import { site } from "@/content/config";
import { photo } from "@/content/photos";
import { priceNote, rooms, type Room } from "@/content/rooms";
import { SectionHeading } from "../section-heading";
import { RoomsPin } from "./rooms-pin";

function RoomCard({ room, n }: { room: Room; n: number }) {
  const p = photo(room.photo);
  return (
    <li
      className="on-photo relative h-[min(72svh,560px)] w-[84vw] shrink-0 snap-center overflow-hidden rounded-[1.75rem] bg-bg-3 sm:w-[60vw] md:h-[58svh] lg:w-[34vw]"
      data-room-card
    >
      <Image
        src={p.src}
        alt={p.alt}
        fill
        // 3:4 photo covering a taller card on phones renders ~1.3× the card width
        sizes="(min-width: 1024px) 34vw, (min-width: 640px) 78vw, 108vw"
        placeholder="blur"
        blurDataURL={p.blurDataURL}
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.04]"
        style={{ objectPosition: p.focus }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgb(7 6 26 / .55) 0%, transparent 30%, transparent 45%, rgb(7 6 26 / .92) 100%)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
        <p className="label text-ink-dim">
          {String(n).padStart(2, "0")} / {room.kicker}
        </p>
        {room.isBonus ? (
          <span className="display rotate-6 rounded-full bg-acid px-3 py-1.5 text-xs text-night">Free</span>
        ) : null}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        <h3 className="display text-[2.4rem] leading-[0.85] md:text-5xl">{room.name}</h3>
        <p className="serif-accent mt-3 text-xl leading-tight text-ink md:text-2xl">{room.oneLiner}</p>
        <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-4">
          <p className="label text-ink-dim">{room.beds}</p>
          {room.isBonus ? null : (
            <a href={site.bookingUrl} className="label shrink-0 border-b border-accent pb-0.5 text-ink hover:text-accent">
              See prices →
            </a>
          )}
        </div>
        {room.features.length ? (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Included">
            {room.features.map((f) => (
              <li key={f} className="label rounded-full border border-line px-2.5 py-1 text-[0.58rem] text-ink-dim">
                {f}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

export function Rooms() {
  return (
    <section id="rooms" aria-labelledby="rooms-title" className="relative py-24 md:py-0" data-rooms>
      <div className="md:flex md:h-svh md:flex-col md:justify-center md:pt-20 [&_h2]:md:text-[6.2vw]" data-rooms-pin>
        <SectionHeading index="02" label="Beds" id="rooms-title" aside="(you won’t use it much)">
          Pick your <span className="text-accent glow">bunk.</span>
        </SectionHeading>
        <ul
          data-rooms-track
          aria-label="Room types"
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-4 [scrollbar-width:none] md:mt-8 md:gap-6 md:px-12 [&::-webkit-scrollbar]:hidden in-data-[pinned]:overflow-visible"
        >
          {rooms.map((room, i) => (
            <RoomCard key={room.id} room={room} n={i + 1} />
          ))}
          <li className="flex w-[70vw] shrink-0 snap-center flex-col justify-center gap-5 pr-4 sm:w-[45vw] lg:w-[28vw]">
            <p className="display text-4xl leading-[0.9] text-ink md:text-5xl">
              Beds go fast on Full Moon week.
            </p>
            <p className="font-mono text-sm text-ink-dim">{priceNote}</p>
            <a href={site.bookingUrl} className="cta self-start" data-magnetic>
              Grab a bed <span aria-hidden="true">→</span>
            </a>
          </li>
        </ul>
        <p className="label mt-2 px-4 text-[0.6rem] text-ink-dim md:hidden" aria-hidden="true">
          ← swipe →
        </p>
      </div>
      <RoomsPin />
    </section>
  );
}
