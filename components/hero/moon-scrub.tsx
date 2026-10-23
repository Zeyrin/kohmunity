"use client";

import { useEffect, useId, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { setFullMoon } from "@/lib/theme";
import { useSectionMotion } from "@/lib/use-section-motion";
import { INITIAL_FRACTION, MoonSvg, litPath } from "./moon";

const FULL_AT = 0.72; // scroll progress at which the moon is full and the page erupts

/**
 * Scroll progress → moon phase. Owns no React state while scrolling: every frame writes one
 * path `d` and a few styles directly, so React never re-renders during the scrub.
 * The rest of the hero (photos, copy) is server-rendered; we drive it through data-hero hooks.
 */
export function MoonScrub() {
  const root = useRef<HTMLDivElement>(null);
  const pathId = `moon-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  // Calm fallback: a still, full moon. No eruption, no flash.
  useEffect(() => {
    if (!prefersReducedMotion() || !root.current) return;
    root.current.querySelector(`#${pathId}`)?.setAttribute("d", litPath(1));
    root.current.querySelector<HTMLElement>("[data-moon-glow]")!.style.opacity = "0.8";
  }, [pathId]);

  const marker = useSectionMotion(
    ({ gsap, ScrollTrigger }, section) => {
      const el = root.current!;
      const path = el.querySelector<SVGPathElement>(`#${pathId}`)!;
      const glow = el.querySelector<HTMLElement>("[data-moon-glow]")!;
      const flash = section.querySelector<HTMLElement>("[data-hero-flash]");
      const copy = section.querySelector<HTMLElement>("[data-hero-copy]");
      const hint = section.querySelector<HTMLElement>("[data-hero-hint]");
      const sticker = section.querySelector<HTMLElement>("[data-hero-sticker]");
      let full = false;

      const erupt = (on: boolean) => {
        full = on;
        setFullMoon(on);
        section.toggleAttribute("data-armed", true); // make sure the UV photo is mounted
        if (on && flash) {
          gsap.fromTo(flash, { opacity: 0.95 }, { opacity: 0, duration: 1.1, ease: "power2.out" });
          gsap.fromTo(el, { scale: 1.12 }, { scale: 1, duration: 0.9, ease: "elastic.out(1, 0.45)" });
        }
        if (sticker) {
          gsap.to(
            sticker,
            on
              ? { autoAlpha: 1, scale: 1, rotate: -8, duration: 0.6, ease: "back.out(2.2)" }
              : { autoAlpha: 0, scale: 0.4, rotate: 12, duration: 0.25 },
          );
        }
      };
      if (sticker) gsap.set(sticker, { autoAlpha: 0, scale: 0.4, rotate: 12 });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: ({ progress }) => {
          const p = Math.min(progress / FULL_AT, 1);
          // ease-in so the crescent lingers, then the moon rushes to full
          const f = INITIAL_FRACTION + (1 - INITIAL_FRACTION) * p * p;
          path.setAttribute("d", litPath(f));
          glow.style.transform = `scale(${0.6 + 0.6 * f})`;
          glow.style.opacity = String(0.15 + 0.85 * f);
          // start fetching the UV photo early so it's decoded by the time the moon is full
          if (progress > 0.15 && !section.hasAttribute("data-armed")) section.toggleAttribute("data-armed", true);
          if (!full && progress >= FULL_AT) erupt(true);
          else if (full && progress < FULL_AT - 0.04) erupt(false);
        },
      });

      const scrubbed = { trigger: section, start: "top top", end: "bottom bottom", scrub: true };
      if (copy) gsap.to(copy, { yPercent: -12, ease: "none", scrollTrigger: scrubbed });
      if (hint) gsap.to(hint, { autoAlpha: 0, ease: "none", scrollTrigger: { ...scrubbed, end: "10% top" } });

      return () => setFullMoon(false);
    },
    { lazy: false },
  );

  return (
    <div ref={root} className="relative aspect-square w-full will-change-transform">
      <span ref={marker} hidden />
      <div
        data-moon-glow
        aria-hidden="true"
        className="absolute inset-[-45%] rounded-full opacity-20 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgb(255 250 235 / .55) 0%, rgb(255 250 235 / .18) 30%, rgb(139 92 255 / .22) 48%, transparent 68%)",
          transform: "scale(0.6)",
        }}
      />
      {/* UV halo — only visible at full moon (CSS keyed off <html data-moon>) */}
      <div
        aria-hidden="true"
        className="absolute inset-[-30%] rounded-full opacity-0 transition-opacity duration-700 in-data-[moon=full]:opacity-100"
        style={{
          background:
            "radial-gradient(circle, transparent 38%, rgb(255 47 179 / .45) 44%, rgb(139 92 255 / .35) 55%, rgb(200 255 26 / .12) 64%, transparent 72%)",
        }}
      />
      <MoonSvg fraction={INITIAL_FRACTION} pathId={pathId} />
    </div>
  );
}
