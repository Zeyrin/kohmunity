"use client";

import { useSectionMotion } from "@/lib/use-section-motion";

/** Rows slam in like a printed line-up; FREE stamps thud. */
export function EventsMotion() {
  const marker = useSectionMotion(({ gsap, ScrollTrigger }, section) => {
    const rows = gsap.utils.toArray<HTMLElement>("[data-event-row]", section);
    gsap.set(rows, { autoAlpha: 0, x: -40 });
    ScrollTrigger.batch(rows, {
      start: "top 90%",
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out", stagger: 0.07 });
        batch.forEach((row) => {
          const stamp = row.querySelector("[data-stamp]");
          if (stamp) gsap.from(stamp, { scale: 2.6, autoAlpha: 0, duration: 0.45, delay: 0.35, ease: "back.out(3)" });
        });
      },
    });
  });

  return <span ref={marker} hidden />;
}
