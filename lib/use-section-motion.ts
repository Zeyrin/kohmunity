"use client";

import { useEffect, useRef, type RefObject } from "react";
import { loadMotion, type Motion } from "./motion";

type Setup = (m: Motion, root: HTMLElement) => void | (() => void);

/** Resolves after window load + an idle slot, so motion never competes with LCP / hydration. */
let idle: Promise<void> | null = null;
function afterLoadIdle() {
  idle ??= new Promise<void>((resolve) => {
    const go = () =>
      "requestIdleCallback" in window ? window.requestIdleCallback(() => resolve(), { timeout: 1500 }) : setTimeout(resolve, 150);
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
  });
  return idle;
}

/**
 * Shared boot sequence for every animated section:
 *   1. wait for load + idle  2. (optionally) wait until the section is within one viewport
 *   3. load the motion runtime (null for reduced motion → nothing happens, static layout stays)
 *   4. run `setup` inside a gsap.context scoped to the section, reverted on unmount.
 * Lazy per-section init spreads ScrollTrigger's layout reads over the scroll instead of
 * paying for all of them in one long task at startup.
 *
 * Returns a ref for a hidden marker element; the section is its closest <section>/<footer>.
 */
export function useSectionMotion(setup: Setup, { lazy = true } = {}): RefObject<HTMLSpanElement | null> {
  const marker = useRef<HTMLSpanElement>(null);
  const setupRef = useRef(setup);

  useEffect(() => {
    const root = marker.current?.closest<HTMLElement>("section, footer");
    if (!root) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let io: IntersectionObserver | undefined;

    const start = async () => {
      const m = await loadMotion();
      if (!m || cancelled) return;
      const ctx = m.gsap.context(() => {
        const result = setupRef.current(m, root);
        if (typeof result === "function") cleanup = result;
      }, root);
      const prevCleanup = cleanup;
      cleanup = () => {
        prevCleanup?.();
        ctx.revert();
      };
    };

    afterLoadIdle().then(() => {
      if (cancelled) return;
      if (!lazy) return void start();
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io?.disconnect();
            start();
          }
        },
        { rootMargin: "100% 0px 100% 0px" },
      );
      io.observe(root);
    });

    return () => {
      cancelled = true;
      io?.disconnect();
      cleanup?.();
    };
  }, [lazy]);

  return marker;
}
