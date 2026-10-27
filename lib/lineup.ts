import { cacheLife, cacheTag } from "next/cache";
import { lineup as fallbackLineup, type EventItem } from "@/content/events";
import { photoFiles, type PhotoSlug } from "@/content/photos.generated";

/**
 * The weekly line-up, edited by the owners at /admin and stored as one JSON row in Supabase
 * (table `site_content`, key `lineup`). Saving there calls updateTag(LINEUP_TAG), so the homepage
 * shows the change on the next visit. If Supabase isn't configured or can't be reached,
 * content/events.ts is used.
 */
export const LINEUP_TAG = "lineup";

export async function getLineup(): Promise<EventItem[]> {
  "use cache";
  cacheTag(LINEUP_TAG);
  cacheLife("hours");
  try {
    return (await readStoredLineup()) ?? fallbackLineup;
  } catch (err) {
    console.error("[lineup] Supabase unavailable, using content/events.ts:", err);
    return fallbackLineup;
  }
}

/** Uncached read for the admin editor. null = nothing saved yet (or Supabase not configured). */
export async function readStoredLineup(): Promise<EventItem[] | null> {
  const db = supabase();
  if (!db) return null;
  const res = await fetch(`${db.url}/rest/v1/site_content?key=eq.lineup&select=value`, {
    headers: db.headers,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase read failed: HTTP ${res.status}`);
  const rows: { value: unknown }[] = await res.json();
  return rows.length ? sanitizeLineup(rows[0].value) : null;
}

export async function writeStoredLineup(items: EventItem[]): Promise<void> {
  const db = supabase();
  if (!db) throw new Error("Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  const res = await fetch(`${db.url}/rest/v1/site_content?on_conflict=key`, {
    method: "POST",
    headers: { ...db.headers, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({ key: "lineup", value: items, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`Supabase write failed: HTTP ${res.status} ${await res.text()}`);
}

/** Server-only: the service-role key bypasses RLS, so it must never reach the browser. */
function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), headers: { apikey: key, Authorization: `Bearer ${key}` } };
}

export const DAYS: EventItem["day"][] = ["DAILY", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN", "MONTHLY"];

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Anything coming from the database or the admin form goes through here before it renders. */
export function sanitizeLineup(input: unknown): EventItem[] {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 40).flatMap((raw): EventItem[] => {
    if (!raw || typeof raw !== "object") return [];
    const e = raw as Record<string, unknown>;
    const title = text(e.title, 120);
    const day = DAYS.find((d) => d === e.day);
    if (!title || !day) return [];
    const photo = typeof e.photo === "string" && e.photo in photoFiles ? (e.photo as PhotoSlug) : undefined;
    return [
      {
        day,
        time: text(e.time, 40),
        title,
        blurb: text(e.blurb, 400),
        free: e.free === true,
        photo,
        vibe: e.vibe === "day" ? "day" : "night",
      },
    ];
  });
}
