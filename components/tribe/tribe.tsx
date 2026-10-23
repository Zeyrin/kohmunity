import Image from "next/image";
import { photo } from "@/content/photos";
import { tribe } from "@/content/tribe";
import { site } from "@/content/config";
import { SectionHeading } from "../section-heading";
import { TribeDrag } from "./tribe-drag";

/**
 * Scattered polaroids. Layout is pure CSS (positions/rotations from content/tribe.ts via custom
 * properties), straightening is pure CSS (:hover / :focus — a tap focuses the card on mobile),
 * so the wall is complete without JS. Dragging is a desktop-only enhancement in TribeDrag.
 */
export function Tribe() {
  return (
    <section
      id="tribe"
      aria-labelledby="tribe-title"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <SectionHeading
        index="03"
        label="The Tribe"
        id="tribe-title"
        aside="(complete strangers, one week ago)"
      >
        Meet the <span className="text-accent-2">family.</span>
      </SectionHeading>
      <p className="label mt-6 max-w-md px-4 text-ink-dim md:px-12">
        <span className="hidden md:inline">
          Drag them around. Hover to straighten.
        </span>
        <span className="md:hidden">Tap one to straighten it.</span>
      </p>

      <ul
        data-tribe-wall
        className="relative mx-auto mt-8 h-[420vw] max-w-[1600px] px-3 md:mt-4 md:h-[min(120vh,72vw)] md:px-8"
        aria-label="Guest photos"
      >
        {tribe.map((t, i) => {
          const p = photo(t.photo);
          return (
            <li
              key={t.photo}
              // left/top = x%/y% of the wall, then shift back by x%/y% of the card itself,
              // so 0 → flush start, 100 → flush end: cards can never overflow the wall.
              className="absolute left-[var(--x)] top-[var(--y)] w-[44vw] [--x:var(--mx)] [--y:var(--my)] [translate:calc(var(--x)*-1)_calc(var(--y)*-1)] md:w-[clamp(180px,16vw,280px)] md:[--x:var(--dx)] md:[--y:var(--dy)]"
              style={
                {
                  "--mx": `${t.mobile.x}%`,
                  "--my": `${t.mobile.y}%`,
                  "--dx": `${t.desktop.x}%`,
                  "--dy": `${t.desktop.y}%`,
                  zIndex: i + 1,
                } as React.CSSProperties
              }
            >
              {/* GSAP (drop-in, drag) only ever touches this wrapper — positioning stays pure CSS */}
              <div data-polaroid>
                <figure
                  tabIndex={0}
                  className="group block cursor-grab rotate-[var(--r)] bg-cream p-2.5 pb-3 text-night shadow-[0_18px_40px_-12px_rgb(0_0_0/.6)] outline-offset-4 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:rotate-0 hover:scale-[1.06] focus:rotate-0 focus:scale-[1.06] active:cursor-grabbing md:p-3 md:pb-4"
                  style={{ "--r": `${t.rotate}deg` } as React.CSSProperties}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-night/10">
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      draggable={false}
                      // photos are pre-cropped to the frame's 4:5, so this is the true rendered
                      // width (+ headroom for the 1.06 hover zoom)
                      sizes="(min-width: 768px) 300px, 47vw"
                      quality={85}
                      placeholder="blur"
                      blurDataURL={p.blurDataURL}
                      className="pointer-events-none select-none object-cover"
                      style={{ objectPosition: p.focus }}
                    />
                  </div>
                  <figcaption className="serif-accent mt-2 text-center text-base leading-tight md:text-lg">
                    {t.caption}
                  </figcaption>
                </figure>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-24 flex flex-col items-center gap-3 px-4 text-center md:mt-10">
        <p className="serif-accent text-3xl text-ink md:text-5xl">
          Your face goes here next.
        </p>
        <a href={site.bookingUrl} className="cta" data-magnetic>
          Join the family <span aria-hidden="true">→</span>
        </a>
      </div>
      <TribeDrag />
    </section>
  );
}
