"use client";

import { useEffect, useRef } from "react";
import { loadMotion } from "@/lib/motion";

/**
 * Desktop only: pins the rooms block and converts vertical scroll into horizontal travel.
 * Mobile keeps native CSS scroll-snap (no JS) — swiping a real scroller beats any scripted
 * carousel on a phone. Until (or unless) this runs, desktop also gets the native scroller.
 */
export function RoomsPin() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = marker.current?.closest<HTMLElement>("[data-rooms]");
    const pin = section?.querySelector<HTMLElement>("[data-rooms-pin]");
    const track = section?.querySelector<HTMLElement>("[data-rooms-track]");
    if (!section || !pin || !track) return;
    let revert = () => {};
    let cancelled = false;

    loadMotion().then((m) => {
      if (!m || cancelled) return;
      const { gsap } = m;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        section.setAttribute("data-pinned", "");
        track.scrollLeft = 0;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const cards = gsap.utils.toArray<HTMLElement>("[data-room-card]", track);
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        // subtle skew-in per card as it enters, tied to the same horizontal tween
        cards.forEach((card) => {
          gsap.from(card, {
            rotate: 3,
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left right",
              end: "center center",
              scrub: true,
            },
          });
        });
        return () => section.removeAttribute("data-pinned");
      });
      revert = () => mm.revert();
    });

    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return <span ref={marker} hidden />;
}
