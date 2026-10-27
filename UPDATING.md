# Updating the site (no coding needed)

Everything you'll want to change lives in the `content/` folder. Edit a file on GitHub, save
("Commit changes"), and the site rebuilds by itself in a minute or two (once the repo is
connected to Vercel).

**How to edit a file on GitHub:** open the file → click the ✏️ pencil (top right) → change the
text → click **Commit changes**. Only change the text between quotes `"like this"` and keep the
commas and brackets as they are. If something breaks, the site keeps the last working version
and GitHub shows a red ✗ — just undo your change.

## The weekly line-up → `/admin`

Go to **yoursite.com/admin**, log in with the admin password, and edit the events right there:
change the day, time, title or description, tick **Free** for the badge, pick a photo, use ↑ ↓ to
reorder, **+ Add event** / **Delete** to add or remove. Hit **Save** — it's live straight away.

(`content/events.ts` is only the backup list the site shows if nothing has been saved yet.)

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
