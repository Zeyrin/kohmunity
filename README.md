# KOHMUNITY — website

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind v4 · GSAP + ScrollTrigger · Lenis. Fully static; deploy on Vercel as-is.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # fails on purpose if anything becomes request-time (ensureStatic = "navigation")
npm run photos     # only when changing which photos are used (reads /photos, writes /public/photos)
npm run reviews    # refresh the real Hostelworld reviews snapshot (content/reviews.hostelworld.json)
```

## Editing content (no component changes needed)

| What | File |
| --- | --- |
| Booking URL, socials, address, ratings, policies, Full Moon date overrides | `content/config.ts` |
| Rooms, prices, one-liners | `content/rooms.ts` |
| Weekly line-up (`source: "draft"` = invented, confirm before launch) | `content/events.ts` |
| Group-chat reviews: real Hostelworld reviews, verbatim (`npm run reviews`; hide one via `EXCLUDE` in the script) | `content/reviews.hostelworld.json` |
| Group-chat hostel lines, live announcements, how many reviews are static vs "arrive live" | `content/reviews.ts` |
| Moon bot answers to visitors (built from the content files) | `lib/chat-replies.ts` |
| Polaroid wall photos, captions, positions | `content/tribe.ts` |
| Alt text + crop focus for every photo | `content/photos.ts` |

Search the repo for `PLACEHOLDER` to find everything that still needs a real value.

### Photos
Camera originals live in `/photos` (not deployed, see `.vercelignore`). `scripts/optimize-photos.mjs`
picks the curated set, crops the portrait hero variants, strips EXIF (GPS!), writes 2400px masters to
`/public/photos` and a typed manifest (`content/photos.generated.ts`). `next/image` serves AVIF/WebP from those.

### Full Moon dates
`lib/moon.ts` computes full moons (Meeus algorithm, ~1 min accuracy) and maps them to party nights
(Bangkok calendar date of the full moon). When the organisers shift a date for a Buddhist holiday, add it to
`fullMoonOverrides` in `content/config.ts`. The countdown runs client-side; `/full-moon-party-dates`
regenerates daily.

## Architecture notes
- **Theme**: `<html data-theme="day|night">` is set by a tiny inline head script before first paint
  (saved choice → else local hour, 07–19 = day). All colours are CSS variables remapped per mode;
  `.on-photo` scopes always-light tokens for text sitting on photos. Full-moon eruption = `data-moon="full"`.
- **Hero LCP**: the same head script preloads only the hero image variant (mode × viewport) the visitor sees.
- **Motion**: `lib/use-section-motion.ts` boots each animated section after load + idle and only when it
  nears the viewport. Reduced motion → the runtime resolves `null` and the static layout stays.
  Every section is complete without JS.
- **Mobile first**: rooms use native scroll-snap on phones (pinned GSAP scroll only ≥768px);
  drag on the polaroid wall and the magnetic cursor only load for fine pointers.
