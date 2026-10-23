"use client";

import { useSyncExternalStore } from "react";

/**
 * The <html data-theme> attribute IS the store: it's set before first paint by the inline head
 * script (see app/theme-script.tsx), so React just subscribes to it instead of owning it.
 * This avoids the classic "flash of wrong theme" and any hydration mismatch.
 */
export type Theme = "day" | "night";
import { THEME_KEY } from "./theme-key";

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-moon"] });
  return () => mo.disconnect();
}

const getTheme = (): Theme => (document.documentElement.dataset.theme === "day" ? "day" : "night");

export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, getTheme, () => null);
}

export function useFullMoon(): boolean {
  return useSyncExternalStore(subscribe, () => document.documentElement.dataset.moon === "full", () => false);
}

export function setTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {
    /* private mode — choice just won't persist */
  }
}

export function setFullMoon(on: boolean) {
  const el = document.documentElement;
  if (on) el.dataset.moon = "full";
  else delete el.dataset.moon;
}
