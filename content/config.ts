/**
 * Site-wide config. Everything a non-dev might need to change lives here or in the other
 * /content files — components never hard-code business facts.
 */
export const site = {
  name: "KOHMUNITY",
  legalName: "Kohmunity Hostel",
  url: "https://kohmunity.com", // PLACEHOLDER: production domain (used for canonical URLs, sitemap, OG)
  tagline: "Come alone. Live with a family.",
  description:
    "Social hostel in Thong Sala, Koh Phangan — big pool, free morning yoga, family dinners and the island's best Full Moon pre-party. 100 m from the beach.",

  /**
   * PLACEHOLDER: the direct-booking engine URL. Every "Grab a bed" CTA points here.
   * Until a direct engine is live this points at Hostelworld so the button actually works.
   * Swap it the day the direct engine (Cloudbeds / Little Hotelier / etc.) is live.
   */
  bookingUrl: "https://www.hostelworld.com/hostels/p/336440/kohmunity-hostel/",

  /** PLACEHOLDER perks — only show what the owners actually honour for direct bookings. */
  bookDirectPerks: ["Best price, always", "Free welcome drink", "No platform fees"],

  socials: {
    instagram: { handle: "@kohmunityhostel", url: "https://www.instagram.com/kohmunityhostel/" },
    tiktok: { handle: "@kohmunityhostel", url: "https://www.tiktok.com/@kohmunityhostel" }, // PLACEHOLDER: confirm handle
  },

  location: {
    area: "Thong Sala, Koh Phangan",
    street: "112/19 Koh Phangan", // from the Hostelworld listing — confirm exact format
    locality: "Koh Phangan",
    region: "Surat Thani",
    postalCode: "84280",
    country: "TH",
    geo: { lat: 9.7135, lng: 100.0145 }, // PLACEHOLDER: approximate (Thong Sala) — paste the exact pin
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Kohmunity+Hostel+Koh+Phangan",
    facts: [
      "100 m to the beach",
      "5 min taxi from Thong Sala Pier",
      "15 min taxi to the Full Moon Party",
    ],
  },

  policies: {
    checkIn: "14:00–00:00",
    checkOut: "until 12:00",
    reception: "10:00–00:00",
    ages: "18–40",
    musicOff: "00:00",
  },

  /**
   * Social proof, copied from each platform — update the numbers + date when you refresh them.
   * The first one is also where the group-chat reviews come from.
   */
  ratings: [
    {
      score: 9.4,
      outOf: 10,
      count: 493,
      source: "Hostelworld",
      url: "https://www.hostelworld.com/hostels/p/336440/kohmunity-hostel/",
      asOf: "2026-10",
    },
    {
      score: 9.2,
      outOf: 10,
      count: 250, // approximate — paste the exact number from the listing
      source: "Booking.com",
      // PLACEHOLDER: paste the listing's own URL (booking.com/hotel/th/…). Until then this searches for it.
      url: "https://www.booking.com/searchresults.html?ss=Kohmunity+Hostel+Koh+Phangan",
      asOf: "2026-10",
    },
  ],

  /** Full Moon Party: local start time + manual date fixes (rule-date → real date). */
  partyStartsLocal: "20:00",
  fullMoonOverrides: {
    "2026-10-26": "2026-10-27", // confirmed by the hostel
    // e.g. "2027-02-20": "2027-02-21", // shifted for Makha Bucha
  } as Record<string, string>,
} as const;
