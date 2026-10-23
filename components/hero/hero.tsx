import { site } from "@/content/config";
import { HERO_BREAKPOINT, heroSources, type HeroVariant } from "@/lib/hero-images";
import { Countdown } from "./countdown";
import { MoonScrub } from "./moon-scrub";

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
      // desktop: tall wrapper = scroll runway for the moon. Mobile fills it by press-and-hold
      // instead, so the hero is just one screen there (and for reduced motion).
      className="relative h-svh md:h-[260svh] motion-reduce:h-svh"
    >
      <div className="on-photo sticky top-0 h-svh overflow-hidden">
        {/* photo layers */}
        <div className="absolute inset-0">
          <HeroPicture variant="night" className="night-only absolute inset-0 block" />
          <HeroPicture variant="day" className="day-only absolute inset-0 block" />
          {/* UV layer: display:none until JS arms it near full moon, then fades in on eruption */}
          <HeroPicture
            variant="uv"
            className="absolute inset-0 hidden opacity-0 transition-opacity duration-700 in-data-[armed]:block in-data-[moon=full]:opacity-100"
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
        <div className="absolute left-1/2 top-[10svh] w-[min(54vw,30svh)] -translate-x-1/2 md:left-auto md:right-[7vw] md:top-1/2 md:w-[min(40vw,68svh)] md:-translate-y-1/2 md:translate-x-0">
          <MoonScrub />
          <p
            data-hero-sticker
            aria-hidden="true"
            className="display invisible absolute -left-[4%] top-[2%] whitespace-nowrap rounded-full bg-acid px-4 py-2 text-xs text-night shadow-[0_0_30px_#ff2fb3] md:text-sm"
          >
            Full moon, baby 🌕
          </p>
          {/* mobile: sits on the dark disc, revealed by JS once the moon is holdable */}
          <p
            data-moon-hint
            aria-hidden="true"
            className="label pointer-events-none invisible absolute inset-0 grid place-items-center text-center text-[0.6rem] leading-relaxed text-ink md:hidden"
          >
            <span className="animate-pulse">
              Press &amp; hold
              <br />
              to fill the moon
            </span>
          </p>
        </div>

        {/* copy */}
        <div
          data-hero-copy
          className="absolute inset-x-0 bottom-0 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-12 md:pb-12"
        >
          <p className="label mb-3 text-ink-dim">
            Koh Phangan · Thong Sala · <span className="text-accent">The Full Moon island</span>
          </p>
          <h1 id="hero-title" className="display glow text-[16vw] text-ink md:text-[8vw]">
            <span className="serif-accent mb-2 block text-[0.42em] leading-[0.95] text-accent md:mb-3 md:text-[0.4em]">
              Come alone.
            </span>
            <span className="block">
              Live<br className="md:hidden" /> with<br className="hidden md:inline" /> a family.
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

        <p
          data-hero-hint
          aria-hidden="true"
          className="label absolute bottom-12 right-6 hidden origin-right -rotate-90 text-[0.6rem] text-ink-dim md:block motion-reduce:hidden"
        >
          Scroll to fill the moon ↓
        </p>
      </div>
    </section>
  );
}
