"use client";

import { useEffect, useRef } from "react";
import { loadMotion } from "@/lib/motion";

/**
 * Desktop-only cursor: a blend-mode dot that follows the mouse with quickTo (one tween reused,
 * no per-frame allocations), grows over interactive elements, and pulls [data-magnetic] elements
 * a few pixels toward the pointer. Native cursor stays visible — this is decoration, not a
 * replacement, so nothing breaks if JS is slow.
 */
export default function MagneticCursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;
    loadMotion().then((m) => {
      if (!m || cancelled || !dot.current) return;
      const { gsap } = m;
      const el = dot.current;
      gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
      const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
        gsap.to(el, { opacity: 1, duration: 0.2, overwrite: "auto" });
      };

      const magnets = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
      const handlers = magnets.map((target) => {
        const mx = gsap.quickTo(target, "x", { duration: 0.5, ease: "elastic.out(1, 0.4)" });
        const my = gsap.quickTo(target, "y", { duration: 0.5, ease: "elastic.out(1, 0.4)" });
        const move = (e: PointerEvent) => {
          const r = target.getBoundingClientRect();
          mx((e.clientX - (r.left + r.width / 2)) * 0.3);
          my((e.clientY - (r.top + r.height / 2)) * 0.3);
        };
        const enter = () => gsap.to(el, { scale: 3.2, duration: 0.3 });
        const leave = () => {
          mx(0);
          my(0);
          gsap.to(el, { scale: 1, duration: 0.3 });
        };
        target.addEventListener("pointermove", move);
        target.addEventListener("pointerenter", enter);
        target.addEventListener("pointerleave", leave);
        return () => {
          target.removeEventListener("pointermove", move);
          target.removeEventListener("pointerenter", enter);
          target.removeEventListener("pointerleave", leave);
        };
      });

      window.addEventListener("pointermove", onMove, { passive: true });
      cleanup = () => {
        window.removeEventListener("pointermove", onMove);
        handlers.forEach((h) => h());
      };
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] size-4 rounded-full bg-cream mix-blend-difference"
    />
  );
}
