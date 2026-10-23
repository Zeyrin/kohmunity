"use client";

/**
 * Lazy motion runtime. GSAP + ScrollTrigger + Lenis (~50KB gz) are NOT in the initial bundle:
 * the first section that needs them triggers one shared dynamic import after hydration.
 * Resolves to null when the visitor prefers reduced motion — callers then keep the static layout,
 * so every animated section has a calm fallback by construction.
 */
import type { gsap as GSAP } from "gsap";
import type { ScrollTrigger as ST } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

export type Motion = { gsap: typeof GSAP; ScrollTrigger: typeof ST; lenis: Lenis | null };

let promise: Promise<Motion | null> | null = null;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isFinePointer() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function loadMotion(): Promise<Motion | null> {
  if (typeof window === "undefined" || prefersReducedMotion()) return Promise.resolve(null);
  promise ??= (async () => {
    const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("lenis"),
    ]);
    gsap.registerPlugin(ScrollTrigger);
    // Mobile address-bar show/hide resizes the viewport; don't recompute every trigger for that.
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Lenis only where it helps (wheel/trackpad). On touch, native momentum scrolling is
    // smoother and cheaper than anything scripted, so we leave it alone.
    let lenis: Lenis | null = null;
    if (isFinePointer()) {
      lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis!.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    return { gsap, ScrollTrigger, lenis };
  })();
  return promise;
}
