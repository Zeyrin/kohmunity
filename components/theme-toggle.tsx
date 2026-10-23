"use client";

import { setTheme, useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const theme = useTheme(); // null during prerender → render neutral, the CSS knows the real mode
  const isNight = theme !== "day";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isNight}
      aria-label="Night mode"
      onClick={() => setTheme(isNight ? "day" : "night")}
      className="group relative flex h-11 w-[5.5rem] items-center rounded-full border border-line bg-bg-2/80 p-1 backdrop-blur-md"
      data-magnetic
    >
      <span className="label pointer-events-none absolute inset-1 grid grid-cols-2 place-items-center text-[0.56rem] tracking-[0.08em] text-ink-dim">
        <span aria-hidden="true">Day</span>
        <span aria-hidden="true">Night</span>
      </span>
      {/* knob position is driven by CSS from <html data-theme>, so it's right even before hydration */}
      <span
        aria-hidden="true"
        className="relative z-10 grid size-9 translate-x-[2.75rem] place-items-center rounded-full bg-accent text-on-accent transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] in-data-[theme=day]:translate-x-0"
      >
        <svg viewBox="0 0 24 24" className="size-5 day-only" fill="currentColor">
          <circle cx="12" cy="12" r="5" />
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 1.5v2.5M12 20v2.5M1.5 12H4M20 12h2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
          </g>
        </svg>
        <svg viewBox="0 0 24 24" className="size-5 night-only" fill="currentColor">
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
        </svg>
      </span>
    </button>
  );
}
