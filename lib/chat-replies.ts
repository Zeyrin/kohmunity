import { site } from "@/content/config";
import { currency, rooms } from "@/content/rooms";
import { lineup } from "@/content/events";
import { formatPartyDate, nextPartyNights } from "./moon";

/**
 * Moon bot: instant, honest auto-replies for the group-chat composer. Every answer is built from
 * /content, so it can never contradict the rest of the site. Unknown questions get routed to a
 * real human (Instagram DM). Pure functions — safe to unit test, no network.
 */
export type Reply = { text: string; cta?: { label: string; href: string } };

const book = { label: "Grab a bed →", href: site.bookingUrl };
const dm = { label: "DM us on Instagram ↗", href: site.socials.instagram.url };

const escape = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Word-start match ("price" ↔ "prices", but "old" ✗ "hold"); phrases/symbols match as substrings. */
const has = (msg: string, ...words: string[]) =>
  words.some((w) => (/^[a-z]+$/.test(w) ? new RegExp(`\\b${w}`).test(msg) : msg.includes(w)));
/** Exact whole-word match, for short words like greetings ("hi" ✗ "this", ✗ "hike"). */
const is = (msg: string, ...words: string[]) => words.some((w) => new RegExp(`\\b${escape(w)}\\b`).test(msg));

export function replyTo(raw: string, now = new Date()): Reply {
  const msg = raw.toLowerCase();

  if (has(msg, "full moon", "fullmoon", "party", "haad rin", "fmp")) {
    const next = nextPartyNights(now, 1)[0];
    return {
      text: `Next Full Moon Party: ${formatPartyDate(next, { year: undefined })} 🌕 Pre-party here from 19:00 (UV paint, buckets), then we ride to Haad Rin together. Beds go fast that week.`,
      cta: book,
    };
  }
  if (has(msg, "price", "cost", "how much", "cheap", "baht", "฿", "$", "€", "budget")) {
    const list = rooms
      .filter((r) => !r.isBonus)
      .map((r) => `${r.kicker} from ${currency}${r.priceFrom}`)
      .join(" · ");
    return { text: `${list}. Book direct for the best price 😉`, cta: book };
  }
  if (has(msg, "book", "bed", "room", "dorm", "private", "available", "availability", "vacan")) {
    return { text: "8-bed and 4-bed dorms (curtains, A/C, ensuite) or a private double. Check live availability here 👇", cta: book };
  }
  if (has(msg, "yoga", "stretch")) {
    return { text: "Free yoga every morning at 09:30. Hangover-friendly, we promise 🧘" };
  }
  if (has(msg, "event", "tonight", "what's on", "whats on", "schedule", "activit", "karaoke", "dinner", "boat")) {
    const week = lineup.filter((e) => e.day !== "DAILY" && e.day !== "MONTHLY").map((e) => `${e.day} ${e.title}`).join(" · ");
    return { text: `This week: ${week}. Plus free yoga daily 🌴` };
  }
  if (has(msg, "where", "location", "address", "beach", "pier", "far", "map", "taxi")) {
    return {
      text: `${site.location.area}: ${site.location.facts.join(", ")}.`,
      cta: { label: "Open in Google Maps ↗", href: site.location.mapsUrl },
    };
  }
  if (has(msg, "age", "old") || is(msg, "18", "40")) {
    return { text: `Guests are ${site.policies.ages}. Music off at ${site.policies.musicOff}, no curfew 🌙` };
  }
  if (has(msg, "alone", "solo", "friends", "single", "meet")) {
    return { text: "Come alone, leave with a family. Literally the point of this place. Family dinner Wednesday, you'll know everyone by Thursday 🫶", cta: book };
  }
  if (is(msg, "hi", "hey", "heyy", "hello", "yo", "sup", "salut", "hola", "ciao", "bonjour")) {
    return { text: "Heyyy 👋 Welcome to the fam! Ask me about prices, the next Full Moon, events or how to find us." };
  }
  return {
    text: "I'm just a bot under the moon 🤖 A real human from reception will answer that on Instagram.",
    cta: dm,
  };
}
