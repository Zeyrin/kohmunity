"use client";

import { useSyncExternalStore } from "react";
import { formatPartyDate, nextPartyNights } from "@/lib/moon";

// One shared 1s ticker; prerender gets `null` so the build never bakes a stale time.
let now = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(cb);
    if (!listeners.size) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}
const getNow = () => now || Date.now();

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown() {
  const t = useSyncExternalStore(subscribe, getNow, () => null);
  const next = t ? nextPartyNights(new Date(t), 1)[0] : null;
  const ms = next ? next.startsAt.getTime() - t! : 0;
  const live = next && ms <= 0;
  const s = Math.max(0, Math.floor(ms / 1000));
  const parts = [
    { v: Math.floor(s / 86400), u: "days" },
    { v: Math.floor((s % 86400) / 3600), u: "hrs" },
    { v: Math.floor((s % 3600) / 60), u: "min" },
    { v: s % 60, u: "sec" },
  ];

  return (
    <div className="font-mono">
      <p className="label text-ink-dim">
        Next Full Moon Party{" "}
        <span className="text-ink">{next ? `· ${formatPartyDate(next, { year: undefined })}` : "· loading the moon…"}</span>
      </p>
      {live ? (
        <p className="display glow mt-2 text-3xl text-accent md:text-4xl">It&apos;s happening. Right now.</p>
      ) : (
        // role=timer is polite by default; we don't announce every second
        <div role="timer" aria-live="off" className="mt-2 flex gap-3 tabular-nums md:gap-5">
          {parts.map((p) => (
            <div key={p.u} className="min-w-[3.2ch]">
              <span className="display block text-3xl text-ink md:text-5xl">{next ? pad(p.v) : "--"}</span>
              <span className="label text-[0.6rem] text-ink-dim">{p.u}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
