import type { PhotoSlug } from "./photos";

export type Room = {
  id: string;
  name: string;
  kicker: string;
  beds: string;
  oneLiner: string;
  features: string[];
  photo: PhotoSlug;
  /** Non-bookable "joke" card (the pool) — renders without the "book" link. */
  isBonus?: boolean;
};

/** No prices on the site on purpose: they change too often. The booking engine always has the live ones. */
export const priceNote = "Prices change with the moon. Live rates and availability are one tap away.";

// Facts from the listing: privacy curtains on every bed, A/C, bedside light + plug, ensuite, lockers, free towel.
export const rooms: Room[] = [
  {
    id: "dorm-10",
    name: "The Party Dorm",
    kicker: "10-bed mixed dorm",
    beds: "10 bunks · curtains",
    oneLiner: "Ten beds, ten countries, one group chat. The cheapest way into the family.",
    features: ["Privacy curtain", "A/C", "Reading light + plug", "Ensuite", "Locker", "Free towel"],
    photo: "room-dorm-8", // PLACEHOLDER: swap for a real photo of the 10-bed dorm
  },
  {
    id: "dorm-8",
    name: "The Classic Dorm",
    kicker: "8-bed mixed dorm",
    beds: "8 bunks · curtains",
    oneLiner: "Eight strangers at check-in. Eight people in your group chat by checkout.",
    features: ["Privacy curtain", "A/C", "Reading light + plug", "Ensuite", "Locker", "Free towel"],
    photo: "room-dorm-8",
  },
  {
    id: "dorm-4",
    name: "The Small Dorm",
    kicker: "4-bed mixed dorm",
    beds: "4 bunks · curtains",
    oneLiner: "Fewer snorers, same chaos. The statistically quieter choice.",
    features: ["Privacy curtain", "A/C", "Reading light + plug", "Ensuite", "Locker", "Free towel"],
    photo: "room-dorm-4",
  },
  {
    id: "private",
    name: "The Double",
    kicker: "Private room · private bathroom",
    beds: "1 double bed",
    oneLiner: "Came alone, leaving with someone? We don't ask questions. Towel swans included.",
    features: ["Double bed", "Private bathroom", "A/C", "Free towels"],
    photo: "room-private",
  },
  {
    id: "pool",
    name: "Your Actual Bedroom",
    kicker: "Open 24/7 · zero beds",
    beds: "1 big pool",
    oneLiner: "Let's be honest: you'll sleep four hours a night. The other twenty happen here.",
    features: [],
    photo: "pool-mural",
    isBonus: true,
  },
];
