"use client";

import { useSectionMotion } from "@/lib/use-section-motion";

/** Giant sign-off lines slide in from alternating sides, scrubbed to scroll (transform only). */
export function FooterMotion() {
  const marker = useSectionMotion(({ gsap }, footer) => {
    gsap.utils.toArray<HTMLElement>("[data-footer-line]", footer).forEach((line, i) => {
      gsap.from(line, {
        xPercent: i % 2 ? 18 : -18,
        ease: "none",
        scrollTrigger: { trigger: line, start: "top bottom", end: "bottom 85%", scrub: true },
      });
    });
  });

  return <span ref={marker} hidden />;
}
