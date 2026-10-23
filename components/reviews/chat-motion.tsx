"use client";

import { useSectionMotion } from "@/lib/use-section-motion";

/**
 * Messages "type in" as you scroll: each one shows a typing bubble, then pops in.
 * Messages are visible in the server HTML and only hidden once motion is confirmed (the
 * section is below the fold by then, so there's no visible flash).
 * Reduced motion / no JS → the full conversation is simply there.
 */
export function ChatMotion() {
  const marker = useSectionMotion(({ gsap, ScrollTrigger }, section) => {
    gsap.utils.toArray<HTMLElement>("[data-chat-item]", section).forEach((item) => {
      const msg = item.querySelector<HTMLElement>("[data-msg]")!;
      const typing = item.querySelector<HTMLElement>("[data-typing]")!;
      // autoAlpha (not display) keeps each bubble's space reserved: no layout shift,
      // and every trigger stays where its message will appear
      gsap.set(msg, { autoAlpha: 0 });
      const tl = gsap
        .timeline({ paused: true })
        .set(typing, { display: "block" })
        .from(typing, { autoAlpha: 0, scale: 0.6, transformOrigin: "left bottom", duration: 0.2 })
        .set(typing, { display: "none" }, "+=0.65")
        .fromTo(
          msg,
          { autoAlpha: 0, y: 10, scale: 0.94 },
          { autoAlpha: 1, y: 0, scale: 1, transformOrigin: "left bottom", duration: 0.35, ease: "back.out(2)" },
        );
      ScrollTrigger.create({ trigger: item, start: "top 82%", once: true, onEnter: () => tl.play() });
    });
  });

  return <span ref={marker} hidden />;
}
