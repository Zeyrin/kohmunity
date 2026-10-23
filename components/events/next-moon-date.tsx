"use client";

import { useSyncExternalStore } from "react";
import { formatPartyDate, nextPartyNights } from "@/lib/moon";

const noop = () => () => {};

/** Next party date, computed in the browser (the static HTML must not bake in a date). */
export function NextMoonDate({ fallback = "every full moon" }: { fallback?: string }) {
  const label = useSyncExternalStore(
    noop,
    () => formatPartyDate(nextPartyNights(new Date(), 1)[0], { year: undefined }),
    () => null,
  );
  return <>{label ? `next: ${label}` : fallback}</>;
}
