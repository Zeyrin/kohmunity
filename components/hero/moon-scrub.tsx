"use client";

import { useEffect, useId, useRef } from "react";
import { HERO_BREAKPOINT } from "@/lib/hero-images";
import { prefersReducedMotion } from "@/lib/motion";
import { setFullMoon } from "@/lib/theme";
import { useSectionMotion } from "@/lib/use-section-motion";
import { INITIAL_FRACTION, MoonSvg, litPath } from "./moon";

const FULL_AT = 0.72; // scroll progress at which the moon is full and the page erupts
const HOLD_TO_FULL = 1.6; // seconds of press-and-hold to wax from crescent to full (mobile)
const MOBILE = "(max-width: 767.98px)";

/**
 * Two ways to fill the moon, one renderer:
 *   - desktop: scroll progress → moon phase (sticky hero, tall scroll runway)
 *   - mobile: press-and-hold the moon to charge it; let go early and it wanes back.
 *     Once full it stays full; a tap brings back the crescent for another go.
 * Owns no React state while animating: every frame writes one path `d` and a few styles
 * directly, so React never re-renders. The rest of the hero (photos, copy) is server-rendered;
 * we drive it through data-hero hooks.
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
      const holdHint = section.querySelector<HTMLElement>("[data-moon-hint]");
      const sticker = section.querySelector<HTMLElement>("[data-hero-sticker]");
      const arm = () => section.toggleAttribute("data-armed", true); // mount the UV photo
      let full = false;

      const render = (f: number) => {
        path.setAttribute("d", litPath(f));
        glow.style.transform = `scale(${0.6 + 0.6 * f})`;
        glow.style.opacity = String(0.15 + 0.85 * f);
      };

      const erupt = (on: boolean) => {
        full = on;
        setFullMoon(on);
        arm();
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

      const mm = gsap.matchMedia();

      mm.add(HERO_BREAKPOINT, () => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: ({ progress }) => {
            const p = Math.min(progress / FULL_AT, 1);
            // ease-in so the crescent lingers, then the moon rushes to full
            render(INITIAL_FRACTION + (1 - INITIAL_FRACTION) * p * p);
            // start fetching the UV photo early so it's decoded by the time the moon is full
            if (progress > 0.15) arm();
            if (!full && progress >= FULL_AT) erupt(true);
            else if (full && progress < FULL_AT - 0.04) erupt(false);
          },
        });

        const scrubbed = { trigger: section, start: "top top", end: "bottom bottom", scrub: true };
        if (copy) gsap.to(copy, { yPercent: -12, ease: "none", scrollTrigger: scrubbed });
        if (hint) gsap.to(hint, { autoAlpha: 0, ease: "none", scrollTrigger: { ...scrubbed, end: "10% top" } });

        return () => erupt(false);
      });

      mm.add(MOBILE, () => {
        const moon = { f: INITIAL_FRACTION };
        const draw = () => render(moon.f);
        const buzz = (ms: number) => navigator.vibrate?.(ms);
        let holding = false;

        const wax = () => {
          gsap.killTweensOf(moon);
          gsap.to(moon, {
            f: 1,
            // the rest of the way at the same pace, so re-pressing mid-wane picks up where it was
            duration: HOLD_TO_FULL * (1 - moon.f),
            ease: "power1.in",
            onUpdate: draw,
            onComplete: () => {
              holding = false;
              gsap.to(el, { scale: 1, duration: 0.2, overwrite: "auto" });
              buzz(60);
              erupt(true);
            },
          });
          // squeeze while charging, released with a bounce
          gsap.to(el, { scale: 0.93, duration: 0.25, ease: "power2.out", overwrite: "auto" });
        };

        const wane = (duration: number) => {
          gsap.killTweensOf(moon);
          gsap.to(moon, { f: INITIAL_FRACTION, duration, ease: "power2.out", onUpdate: draw });
          gsap.to(el, { scale: 1, duration: 0.4, ease: "back.out(3)", overwrite: "auto" });
        };

        const press = (e: Event) => {
          e.preventDefault();
          arm();
          if (full) {
            // tap a full moon → back to the crescent, ready for another go
            erupt(false);
            wane(0.8);
            return;
          }
          holding = true;
          buzz(10);
          if (holdHint) gsap.to(holdHint, { autoAlpha: 0, duration: 0.3 });
          wax();
        };

        const release = () => {
          if (!holding) return;
          holding = false;
          if (!full) wane(0.9);
        };

        const key = (e: KeyboardEvent) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) press(e);
        };
        const keyUp = (e: KeyboardEvent) => {
          if (e.key === " " || e.key === "Enter") release();
        };
        const noMenu = (e: Event) => e.preventDefault(); // long-press must not open the context menu

        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
        el.setAttribute("aria-label", "Hold to fill the moon");
        el.addEventListener("pointerdown", press);
        el.addEventListener("keydown", key);
        el.addEventListener("keyup", keyUp);
        el.addEventListener("contextmenu", noMenu);
        window.addEventListener("pointerup", release);
        window.addEventListener("pointercancel", release);
        el.addEventListener("blur", release);
        if (holdHint) gsap.fromTo(holdHint, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.4 });

        return () => {
          for (const a of ["role", "tabindex", "aria-label"]) el.removeAttribute(a);
          el.removeEventListener("pointerdown", press);
          el.removeEventListener("keydown", key);
          el.removeEventListener("keyup", keyUp);
          el.removeEventListener("contextmenu", noMenu);
          window.removeEventListener("pointerup", release);
          window.removeEventListener("pointercancel", release);
          el.removeEventListener("blur", release);
          gsap.killTweensOf(moon);
          render(INITIAL_FRACTION);
          erupt(false);
        };
      });

      return () => {
        mm.revert();
        setFullMoon(false);
      };
    },
    { lazy: false },
  );

  return (
    <div
      ref={root}
      // touch-none + no callout: a long press on mobile must charge the moon, not scroll or select
      className="relative aspect-square w-full touch-none select-none rounded-full outline-none will-change-transform [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] focus-visible:ring-2 focus-visible:ring-accent md:touch-auto"
    >
      <span ref={marker} hidden />
      <div
        data-moon-glow
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-45%] rounded-full opacity-20 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgb(255 250 235 / .55) 0%, rgb(255 250 235 / .18) 30%, rgb(139 92 255 / .22) 48%, transparent 68%)",
          transform: "scale(0.6)",
        }}
      />
      {/* UV halo — only visible at full moon (CSS keyed off <html data-moon>) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-30%] rounded-full opacity-0 transition-opacity duration-700 in-data-[moon=full]:opacity-100"
        style={{
          background:
            "radial-gradient(circle, transparent 38%, rgb(255 47 179 / .45) 44%, rgb(139 92 255 / .35) 55%, rgb(200 255 26 / .12) 64%, transparent 72%)",
        }}
      />
      <MoonSvg fraction={INITIAL_FRACTION} pathId={pathId} />
    </div>
  );
}
