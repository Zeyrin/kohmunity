// Snapshots real guest reviews from Hostelworld into content/reviews.hostelworld.json.
// Run: npm run reviews  (commit the JSON). The site never calls Hostelworld at build or runtime.
//
// Filters: 9+/10 overall, readable length, newest first. Text is kept VERBATIM — never edit a
// quote; if one shouldn't be shown, drop it via EXCLUDE below.
import { writeFile } from "node:fs/promises";
import path from "node:path";

const PROPERTY_ID = 336440;
const PAGES = 6;
const KEEP = 14;
const EXCLUDE = new Set([]); // review ids to hide
const ROOT = path.resolve(import.meta.dirname, "..");

const all = [];
for (let page = 1; page <= PAGES; page++) {
  const url = `https://prod.apigee.hostelworld.com/legacy-hwapi-service/2.2/properties/${PROPERTY_ID}/reviews/?sort=-date&allLanguages=false&page=${page}&monthCount=36`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (kohmunity review snapshot)" } });
  if (!res.ok) throw new Error(`Hostelworld ${res.status} on page ${page}`);
  const { reviews = [] } = await res.json();
  if (!reviews.length) break;
  all.push(...reviews);
}

const clean = (t) => t.replace(/\r/g, "").replace(/\n{2,}/g, "\n").trim();
const picked = all
  .filter((r) => r.notes && !EXCLUDE.has(r.id) && r.rating?.overall >= 90)
  .map((r) => ({
    id: r.id,
    date: r.date,
    text: clean(r.notes),
    rating: r.rating.overall / 10,
    country: r.user?.nationality?.name ?? null,
    countryCode: r.user?.nationality?.code ?? null,
    age: r.groupInformation?.age ?? null,
  }))
  .filter((r) => r.text.length >= 40 && r.text.length <= 360)
  .slice(0, KEEP);

const out = { source: "Hostelworld", propertyId: PROPERTY_ID, fetchedAt: new Date().toISOString().slice(0, 10), reviews: picked };
await writeFile(path.join(ROOT, "content/reviews.hostelworld.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`kept ${picked.length} of ${all.length} reviews`);
