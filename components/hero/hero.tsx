import { site } from "@/content/config";
import { HERO_BREAKPOINT, heroSources, type HeroVariant } from "@/lib/hero-images";
import { Countdown } from "./countdown";
import { MoonHold } from "./moon-hold";

/**
 * Art-directed <picture>. Always loading="lazy": the head script already preloaded the one
 * variant this visitor sees, and lazy + display:none means the other modes are never fetched.
 */
function HeroPicture({ variant, className }: { variant: HeroVariant; className: string }) {
  const h = heroSources(variant);
  return (
    <picture className={className}>
      <source media={HERO_BREAKPOINT} srcSet={h.desktop.srcSet} sizes={h.sizes} />
      <img
        srcSet={h.mobile.srcSet}
        src={h.mobile.src}
        sizes={h.sizes}
        alt={h.mobile.alt}
        width={h.mobile.width}
        height={h.mobile.height}
        loading="lazy"
        fetchPriority="high"
        decoding="async"
        className="h-full w-full object-cover"
        style={{ objectPosition: h.mobile.focus }}
      />
    </picture>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative h-svh"
    >
      <div className="on-photo relative h-full overflow-hidden">
        {/* photo layers */}
        <div className="absolute inset-0">
          <HeroPicture variant="night" className="night-only absolute inset-0 block" />
          <HeroPicture variant="day" className="day-only absolute inset-0 block" />
          {/* UV layer: display:none until JS arms it near full moon, then fades in on eruption */}
          <HeroPicture
            variant="uv"
            className="absolute inset-0 hidden opacity-0 transition-opacity duration-700 in-data-armed:block in-data-[moon=full]:opacity-100"
          />
          <div className="absolute inset-0" style={{ background: "var(--photo-veil)" }} aria-hidden="true" />
          <div
            data-hero-flash
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen"
            style={{ background: "radial-gradient(circle at 50% 35%, #ff2fb3 0%, #8b5cff 45%, #07061a 100%)" }}
          />
        </div>

        {/* moon */}
        <div className="absolute left-1/2 top-[max(5.5rem,11svh)] w-[min(46vw,24svh)] -translate-x-1/2 md:left-auto md:right-[7vw] md:top-1/2 md:w-[min(40vw,68svh)] md:-translate-y-1/2 md:translate-x-0">
          <MoonHold />
          <p
            data-hero-sticker
            aria-hidden="true"
            className="display pointer-events-none absolute left-[-12%] top-[-6%] whitespace-nowrap rounded-full bg-acid px-4 py-2 text-xs text-night opacity-0 shadow-[0_0_30px_#ff2fb3] md:left-[-4%] md:top-[2%] md:text-sm"
          >
            Full moon, baby 🌕
          </p>
        </div>

        {/* copy */}
        {/* pointer-events-none so the copy never swallows a press meant for the moon; links opt back in */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-12 md:pb-12 [&_a]:pointer-events-auto">
          <p className="label mb-3 text-ink-dim">
            Koh Phangan · Thong Sala · <span className="text-accent">The Full Moon island</span>
          </p>
          <h1 id="hero-title" className="display glow text-[18.5vw] text-ink md:text-[9.6vw]">
            <span className="block">Come</span>
            <span className="block md:mt-[-0.05em]">alone.</span>
            <span className="serif-accent mt-1 block text-[0.42em] leading-[0.95] text-accent md:mt-3 md:text-[0.4em]">
              Leave with a family.
            </span>
          </h1>
          <div className="mt-6 flex flex-col gap-5 md:mt-10 md:flex-row md:items-end md:justify-between">
            <Countdown />
            <div className="flex flex-col items-start gap-2">
              <a href={site.bookingUrl} className="cta text-base" data-magnetic>
                Grab a bed <span aria-hidden="true">→</span>
              </a>
              <p className="label text-[0.62rem] text-ink-dim">
                ★ {site.rating.score}/10 · {site.rating.count} reviews on {site.rating.source}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
