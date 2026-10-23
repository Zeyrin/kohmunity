"use client";

import { useSectionMotion } from "@/lib/use-section-motion";

/**
 * Desktop only: pins the rooms block and converts vertical scroll into horizontal travel.
 * Mobile keeps native CSS scroll-snap (no JS) — swiping a real scroller beats any scripted
 * carousel on a phone. Until (or unless) this runs, desktop also gets the native scroller.
 */
export function RoomsPin() {
  const marker = useSectionMotion(({ gsap, ScrollTrigger }, section) => {
    const pin = section.querySelector<HTMLElement>("[data-rooms-pin]");
    const track = section.querySelector<HTMLElement>("[data-rooms-track]");
    if (!pin || !track) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      section.setAttribute("data-pinned", "");
      track.scrollLeft = 0;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
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
      // subtle tilt-in per card, driven by the horizontal tween
      gsap.utils.toArray<HTMLElement>("[data-room-card]", track).forEach((card) => {
        gsap.from(card, {
          rotate: 3,
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "center center", scrub: true },
        });
      });
      // the pin adds scroll distance: re-measure triggers further down the page
      ScrollTrigger.refresh();
      return () => section.removeAttribute("data-pinned");
    });
    return () => mm.revert();
  });

  return <span ref={marker} hidden />;
}
