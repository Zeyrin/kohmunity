/**
 * Full-moon math (Meeus, "Astronomical Algorithms", ch. 49) + Full Moon Party date rules.
 * Accuracy of the phase instant: ~1 minute, which is plenty for a party countdown.
 * Pure functions, no dependencies — safe to run on the server (SEO page) and in the browser (countdown).
 */
import { site } from "@/content/config";

const SYNODIC_MONTH = 29.530588861;
const DELTA_T_DAYS = 69 / 86400; // TT − UT, ≈69 s in the 2020s
const BANGKOK_OFFSET_MS = 7 * 3600_000; // Thailand has no DST

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Instant of the full moon for lunation index k (k = n + 0.5), as a JS Date (UTC). */
function fullMoonForK(k: number): Date {
  const T = k / 1236.85;
  const T2 = T * T, T3 = T2 * T, T4 = T3 * T;
  const jde =
    2451550.09766 + SYNODIC_MONTH * k + 0.00015437 * T2 - 0.00000015 * T3 + 0.00000000073 * T4;
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const M = rad(2.5534 + 29.1053567 * k - 0.0000014 * T2 - 0.00000011 * T3);
  const Mp = rad(201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4);
  const F = rad(160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4);
  const O = rad(124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3);
  const s = Math.sin;
  const correction =
    -0.40614 * s(Mp) +
    0.17302 * E * s(M) +
    0.01614 * s(2 * Mp) +
    0.01043 * s(2 * F) +
    0.00734 * E * s(Mp - M) -
    0.00514 * E * s(Mp + M) +
    0.00209 * E * E * s(2 * M) -
    0.00111 * s(Mp - 2 * F) -
    0.00057 * s(Mp + 2 * F) +
    0.00056 * E * s(2 * Mp + M) -
    0.00042 * s(3 * Mp) +
    0.00042 * E * s(M + 2 * F) +
    0.00038 * E * s(M - 2 * F) -
    0.00024 * E * s(2 * Mp - M) -
    0.00017 * s(O) -
    0.00007 * s(Mp + 2 * M) +
    0.00004 * s(2 * Mp - 2 * F) +
    0.00004 * s(3 * M) +
    0.00003 * s(Mp + M - 2 * F) +
    0.00003 * s(2 * Mp + 2 * F) -
    0.00003 * s(Mp + M + 2 * F) +
    0.00003 * s(Mp - M + 2 * F) -
    0.00002 * s(Mp - M - 2 * F) -
    0.00002 * s(3 * Mp + M) +
    0.00002 * s(4 * Mp);
  const jdUT = jde + correction - DELTA_T_DAYS;
  return new Date((jdUT - 2440587.5) * 86400_000);
}

/** All full-moon instants from `from` onward, in order. */
export function fullMoonsAfter(from: Date, count: number): Date[] {
  const years = from.getUTCFullYear() + (from.getUTCMonth() + 0.5) / 12 - 2000;
  let k = Math.floor(years * 12.3685) - 1.5; // start a little early, then skip past `from`
  const out: Date[] = [];
  while (out.length < count) {
    const d = fullMoonForK(k);
    if (d.getTime() >= from.getTime() - 2 * 86400_000) out.push(d);
    k += 1;
  }
  return out;
}

/** "YYYY-MM-DD" of an instant, in Bangkok time. */
export function bangkokDateKey(d: Date): string {
  return new Date(d.getTime() + BANGKOK_OFFSET_MS).toISOString().slice(0, 10);
}

export type PartyNight = {
  /** Bangkok calendar date the party starts on (evening). */
  dateKey: string;
  /** Party start as an absolute instant. */
  startsAt: Date;
  /** The astronomical full moon it belongs to. */
  fullMoonAt: Date;
  /** True when the date comes from the manual override list, not the default rule. */
  overridden: boolean;
};

/**
 * Default rule: the party is on the Bangkok calendar date of the full-moon instant
 * (checked against published 2026 calendars: 28 Aug, 26 Sep, 26 Oct, 24 Nov, 24 Dec).
 * Organisers occasionally shift a date for Buddhist holidays — those go in site.fullMoonOverrides.
 */
export function partyNightFor(fullMoonAt: Date): PartyNight {
  const ruleKey = bangkokDateKey(fullMoonAt);
  const override = site.fullMoonOverrides[ruleKey];
  const dateKey = override ?? ruleKey;
  const [h, m] = site.partyStartsLocal.split(":").map(Number);
  const startsAt = new Date(
    Date.parse(`${dateKey}T00:00:00Z`) - BANGKOK_OFFSET_MS + (h * 60 + m) * 60_000,
  );
  return { dateKey, startsAt, fullMoonAt, overridden: Boolean(override) };
}

/** Next `count` party nights whose party hasn't ended yet (party runs until sunrise, ~10h). */
export function nextPartyNights(now: Date, count: number): PartyNight[] {
  return fullMoonsAfter(now, count + 2)
    .map(partyNightFor)
    .filter((p) => p.startsAt.getTime() + 10 * 3600_000 > now.getTime())
    .slice(0, count);
}

export function formatPartyDate(p: PartyNight, opts: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Bangkok",
    ...opts,
  }).format(p.startsAt);
}
