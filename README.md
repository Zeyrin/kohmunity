# KOHMUNITY — website

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind v4 · GSAP + ScrollTrigger · Lenis. Fully static; deploy on Vercel as-is.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # fails on purpose if anything becomes request-time (ensureStatic = "navigation")
npm run photos     # only when changing which photos are used (reads /photos, writes /public/photos)
```

## Editing content (no component changes needed)

| What | File |
| --- | --- |
| Booking URL, socials, address, ratings, policies, Full Moon date overrides | `content/config.ts` |
| Rooms, prices, one-liners | `content/rooms.ts` |
| Weekly line-up — **owners edit it at `/admin`**, see below (`content/events.ts` is the fallback) | `/admin` |
| Group-chat reviews (**placeholder copy**, replace with real guest quotes) | `content/reviews.ts` |
| Polaroid wall photos, captions, positions | `content/tribe.ts` |
| Alt text + crop focus for every photo | `content/photos.ts` |

Search the repo for `PLACEHOLDER` to find everything that still needs a real value.

### Photos
Camera originals live in `/photos` (not deployed, see `.vercelignore`). `scripts/optimize-photos.mjs`
picks the curated set, crops the portrait hero variants, strips EXIF (GPS!), writes 2400px masters to
`/public/photos` and a typed manifest (`content/photos.generated.ts`). `next/image` serves AVIF/WebP from those.

### Line-up admin (`/admin`)
Owners log in with a password and edit, reorder, add or delete events; saving is live immediately.
The line-up is stored as one JSON row in Supabase (`site_content`, key `lineup`); until something is saved,
or if Supabase is unreachable, the site shows `content/events.ts`.

Setup: run `supabase/site_content.sql` in the Supabase SQL editor, then set `ADMIN_PASSWORD`, `SUPABASE_URL`
and `SUPABASE_SERVICE_ROLE_KEY` in Vercel (see `.env.example`). Code: `app/admin/`, `lib/lineup.ts`.

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
