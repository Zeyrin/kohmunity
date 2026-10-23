"use client";

import { useEffect, useId, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { setFullMoon } from "@/lib/theme";
import { INITIAL_FRACTION, MoonSvg, litPath } from "./moon";

const FILL_MS = 1300; // holding this long fills the moon
const DRAIN_MS = 700; // letting go early drains it back to a crescent

/**
 * Press-and-hold the moon to fill it (touch, mouse or Space/Enter). Pointer events work the same
 * on iOS/Android/desktop, and the button has touch-action:none so holding never scrolls the page.
 * A rAF loop writes one path `d` + a few styles per frame; React never re-renders while filling.
 * The rest of the hero (photos, copy) is server-rendered; we drive it through data-hero hooks.
 */
export function MoonHold() {
  const btn = useRef<HTMLButtonElement>(null);
  const pathId = `moon-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    const el = btn.current!;
    const section = el.closest<HTMLElement>("section")!;
    const path = el.querySelector<SVGPathElement>(`#${pathId}`)!;
    const glow = el.querySelector<HTMLElement>("[data-moon-glow]")!;
    const hint = el.querySelector<HTMLElement>("[data-moon-hint]")!;
    const flash = section.querySelector<HTMLElement>("[data-hero-flash]");
    const sticker = section.querySelector<HTMLElement>("[data-hero-sticker]");
    const calm = prefersReducedMotion();

    let p = 0; // fill progress 0..1
    let held = false;
    let full = false;
    let raf = 0;
    let last = 0;

    const draw = () => {
      // ease-in so the crescent lingers, then the moon rushes to full
      const f = INITIAL_FRACTION + (1 - INITIAL_FRACTION) * p * p;
      path.setAttribute("d", litPath(f));
      glow.style.transform = `scale(${0.6 + 0.6 * f})`;
      glow.style.opacity = String(0.15 + 0.85 * f);
      el.style.transform = held && !full ? `scale(${1 + 0.05 * p})` : "";
      hint.style.opacity = String(Math.max(0, 1 - p * 3));
    };

    const erupt = (on: boolean) => {
      full = on;
      setFullMoon(on);
      el.setAttribute("aria-pressed", String(on));
      section.toggleAttribute("data-full", on);
      if (on) navigator.vibrate?.(40);
      if (on && !calm) {
        flash?.animate([{ opacity: 0.95 }, { opacity: 0 }], { duration: 1100, easing: "cubic-bezier(.16,1,.3,1)" });
        el.animate(
          [{ transform: "scale(1.14)" }, { transform: "scale(0.96)" }, { transform: "scale(1.02)" }, { transform: "scale(1)" }],
          { duration: 900, easing: "ease-out" },
        );
      }
      sticker?.animate(
        on
          ? [
              { opacity: 0, transform: "scale(.4) rotate(12deg)" },
              { opacity: 1, transform: "scale(1.1) rotate(-10deg)", offset: 0.7 },
              { opacity: 1, transform: "scale(1) rotate(-8deg)" },
            ]
          : [{ opacity: 1, transform: "scale(1) rotate(-8deg)" }, { opacity: 0, transform: "scale(.4) rotate(12deg)" }],
        { duration: calm ? 1 : on ? 600 : 250, easing: "ease-out", fill: "forwards" },
      );
    };

    const tick = (t: number) => {
      const dt = last ? t - last : 16;
      last = t;
      p = held ? Math.min(1, p + dt / FILL_MS) : Math.max(0, p - dt / DRAIN_MS);
      draw();
      if (held && p >= 1) {
        held = false;
        erupt(true);
      }
      raf = (held || p > 0) && !full ? requestAnimationFrame(tick) : 0;
    };

    const start = () => {
      section.toggleAttribute("data-armed", true); // start fetching the UV photo while the moon fills
      el.removeAttribute("data-idle");
      if (full) {
        // tap a full moon to send it back to a crescent and play again
        erupt(false);
        p = 0;
        draw();
        return;
      }
      if (calm) {
        p = 1;
        draw();
        erupt(true);
        return;
      }
      held = true;
      last = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (!held) return;
      held = false;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      el.setPointerCapture(e.pointerId); // keep receiving pointerup even if the finger drifts off
      start();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "Enter") && !e.repeat) {
        e.preventDefault();
        start();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") stop();
    };
    const noMenu = (e: Event) => e.preventDefault(); // long-press would open the context menu on Android

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", stop);
    el.addEventListener("pointercancel", stop);
    el.addEventListener("lostpointercapture", stop);
    el.addEventListener("keydown", onKeyDown);
    el.addEventListener("keyup", onKeyUp);
    el.addEventListener("blur", stop);
    el.addEventListener("contextmenu", noMenu);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", stop);
      el.removeEventListener("pointercancel", stop);
      el.removeEventListener("lostpointercapture", stop);
      el.removeEventListener("keydown", onKeyDown);
      el.removeEventListener("keyup", onKeyUp);
      el.removeEventListener("blur", stop);
      el.removeEventListener("contextmenu", noMenu);
      setFullMoon(false);
    };
  }, [pathId]);

  return (
    <button
      ref={btn}
      type="button"
      aria-pressed="false"
      aria-label="Fill the moon: press and hold"
      data-idle
      className="group relative block aspect-square w-full cursor-pointer touch-none select-none rounded-full [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] focus-visible:outline-offset-8"
    >
      <span
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
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-30%] rounded-full opacity-0 transition-opacity duration-700 in-data-[moon=full]:opacity-100"
        style={{
          background:
            "radial-gradient(circle, transparent 38%, rgb(255 47 179 / .45) 44%, rgb(139 92 255 / .35) 55%, rgb(200 255 26 / .12) 64%, transparent 72%)",
        }}
      />
      {/* "touch me" ring: pulses until the first press */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-3%] hidden rounded-full border border-cream/50 group-data-idle:block group-data-idle:motion-safe:animate-ping [animation-duration:2.2s]"
      />
      <MoonSvg fraction={INITIAL_FRACTION} pathId={pathId} />
      <span
        data-moon-hint
        aria-hidden="true"
        className="label pointer-events-none absolute inset-0 grid place-content-center text-center text-[0.6rem] leading-relaxed text-cream/85 md:text-[0.72rem]"
      >
        Press &amp;
        <br />
        hold
      </span>
    </button>
  );
}
