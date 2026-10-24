"use client";

import { useRef, useState, type ReactNode } from "react";
import { loadMotion } from "@/lib/motion";

/**
 * Keeps the group chat short: the server-rendered history is clipped to a few messages with a
 * fade, and the visitor can open the whole thread (and fold it back).
 */
export function ChatExpander({ count, children }: { count: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    requestAnimationFrame(() => {
      // the page got taller/shorter: every scroll trigger below (and in) the chat has moved
      loadMotion().then((m) => m?.ScrollTrigger.refresh());
      if (!next) root.current?.scrollIntoView({ block: "nearest" });
    });
  };

  return (
    <div ref={root} className="relative">
      <div id="chat-history" className={open ? "" : "max-h-[22rem] overflow-hidden md:max-h-[26rem]"}>
        {children}
      </div>
      <div
        className={`flex justify-center px-3 pb-3 ${
          open ? "" : "absolute inset-x-0 bottom-0 bg-linear-to-b from-transparent to-[var(--chat-bg)] pt-20"
        }`}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls="chat-history"
          onClick={toggle}
          className="min-h-10 rounded-full bg-[var(--chat-in)] px-4 text-sm font-semibold text-[#00a884] shadow-md"
        >
          {open ? "Show less ↑" : `See all ${count} messages ↓`}
        </button>
      </div>
    </div>
  );
}
