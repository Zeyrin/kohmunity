# Updating the site (no coding needed)

Everything you'll want to change lives in the `content/` folder. Edit a file on GitHub, save
("Commit changes"), and the site rebuilds by itself in a minute or two (once the repo is
connected to Vercel).

**How to edit a file on GitHub:** open the file → click the ✏️ pencil (top right) → change the
text → click **Commit changes**. Only change the text between quotes `"like this"` and keep the
commas and brackets as they are. If something breaks, the site keeps the last working version
and GitHub shows a red ✗ — just undo your change.

## The weekly line-up → `content/events.ts`

Each event is one block like this:

```ts
  {
    day: "MON",              // MON TUE WED THU FRI SAT SUN, or DAILY / MONTHLY
    time: "21:00",
    title: "Mic Drop Karaoke",
    blurb: "Nobody can sing. Everybody sings.",
    photo: "event-karaoke",  // optional — delete this line for no photo
    vibe: "night",           // "day" or "night"
  },
```

- **Change an event:** edit its `time`, `title` or `blurb`.
- **Add an event:** copy a whole block (from `{` to `},`) and paste it where you want it.
- **Remove an event:** delete its whole block.
- Add `free: true,` to show a "Free" badge.

## Full Moon Party date → `content/config.ts`

Dates are calculated automatically. When the real party is on a different day, add a line in
`fullMoonOverrides`: `"calculated date": "real date",` (format `YYYY-MM-DD`), e.g.

```ts
    "2026-10-26": "2026-10-27",
```

The site lists the calculated dates at `/full-moon-party-dates`.

## Booking button → `content/config.ts`

`bookingUrl` is where every "Grab a bed" button goes. Paste the direct reservation link there.

## Ratings → `content/config.ts`

Under `ratings`, update `score` and `count` for Hostelworld and Booking.com from time to time.

## Rooms → `content/rooms.ts`

Names, one-liners and features of each room. There are no prices on the site on purpose — the
booking engine always shows the live ones.

## Terms & Conditions → `content/terms.ts`

Each section is a title and a list of points. Change `termsUpdated` when you edit it.
