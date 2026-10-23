"use client";

import { useEffect, useRef } from "react";
import { isFinePointer, loadMotion } from "@/lib/motion";

/**
 * Enhancements for the polaroid wall:
 *  - all devices (motion allowed): polaroids "drop" onto the wall as it scrolls in
 *  - desktop with a mouse: GSAP Draggable (lazy-imported, never shipped to phones), bounded
 *    to the wall, with throw-free drag and "bring to front" on press.
 * Touch devices don't get drag on purpose: it would hijack the page scroll gesture.
 */
export function TribeDrag() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wall = marker.current?.closest("section")?.querySelector<HTMLElement>("[data-tribe-wall]");
    if (!wall) return;
    let cancelled = false;
    let cleanup = () => {};

    loadMotion().then(async (m) => {
      if (!m || cancelled) return;
      const { gsap, ScrollTrigger } = m;
      const cards = gsap.utils.toArray<HTMLElement>("[data-polaroid]", wall);

      const ctx = gsap.context(() => {
        gsap.set(cards, { autoAlpha: 0, y: -80, rotate: () => gsap.utils.random(-25, 25) });
        ScrollTrigger.batch(cards, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, rotate: 0, duration: 0.9, ease: "back.out(1.6)", stagger: 0.08 }),
        });
      });

      let draggables: { kill: () => void }[] = [];
      if (isFinePointer()) {
        const { Draggable } = await import("gsap/Draggable");
        if (cancelled) return;
        gsap.registerPlugin(Draggable);
        let top = cards.length + 10;
        draggables = cards.flatMap((card) =>
          Draggable.create(card, {
            type: "x,y",
            bounds: wall,
            zIndexBoost: false,
            onPress() {
              card.parentElement!.style.zIndex = String(++top);
            },
          }),
        );
      }

      cleanup = () => {
        ctx.revert();
        draggables.forEach((d) => d.kill());
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return <span ref={marker} hidden />;
}
