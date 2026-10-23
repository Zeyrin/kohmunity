"use client";

import dynamic from "next/dynamic";

/** Same footprint as the real input bar, so swapping it in causes no layout shift. */
function ComposerPlaceholder() {
  return (
    <div className="flex items-center gap-2 bg-[var(--chat-in)] px-3 py-2.5" aria-hidden="true">
      <span className="min-h-11 flex-1 rounded-full bg-[var(--chat-bg)]" />
      <span className="size-11 shrink-0 rounded-full bg-[#008069] opacity-50" />
    </div>
  );
}

/**
 * The composer sits at the very bottom of a long page: keep its JS out of the initial bundle and
 * hydration (that work competes with the hero's LCP on mid-range phones).
 */
export const ChatComposerLazy = dynamic(() => import("./chat-composer").then((m) => m.ChatComposer), {
  ssr: false,
  loading: ComposerPlaceholder,
});
