import type { PhotoSlug } from "./photos";

export type Room = {
  id: string;
  name: string;
  kicker: string;
  /** PLACEHOLDER prices in THB per bed / per room per night. Full Moon week is higher (see note). */
  priceFrom: number;
  priceUnit: "bed" | "room";
  beds: string;
  oneLiner: string;
  features: string[];
  photo: PhotoSlug;
  /** Non-bookable "joke" card (the pool) — renders without price/bed info. */
  isBonus?: boolean;
};

export const currency = "฿";
export const priceNote = "Prices go up island-wide on Full Moon & festival weeks. Between moons? Dirt cheap.";

// Facts from the listing: privacy curtains on every bed, A/C, bedside light + plug, ensuite, lockers, free towel.
export const rooms: Room[] = [
  {
    id: "dorm-8",
    name: "The Big Dorm",
    kicker: "8-bed mixed dorm",
    priceFrom: 290, // PLACEHOLDER
    priceUnit: "bed",
    beds: "8 bunks · curtains",
    oneLiner: "Eight strangers at check-in. Eight people in your group chat by checkout.",
    features: ["Privacy curtain", "A/C", "Reading light + plug", "Ensuite", "Locker", "Free towel"],
    photo: "room-dorm-8",
  },
  {
    id: "dorm-4",
    name: "The Small Dorm",
    kicker: "4-bed mixed dorm",
    priceFrom: 390, // PLACEHOLDER
    priceUnit: "bed",
    beds: "4 bunks · curtains",
    oneLiner: "Fewer snorers, same chaos. The statistically quieter choice.",
    features: ["Privacy curtain", "A/C", "Reading light + plug", "Ensuite", "Locker", "Free towel"],
    photo: "room-dorm-4",
  },
  {
    id: "private",
    name: "The Double",
    kicker: "Private room · private bathroom",
    priceFrom: 990, // PLACEHOLDER
    priceUnit: "room",
    beds: "1 double bed",
    oneLiner: "Came alone, leaving with someone? We don't ask questions. Towel swans included.",
    features: ["Double bed", "Private bathroom", "A/C", "Free towels"],
    photo: "room-private",
  },
  {
    id: "pool",
    name: "Your Actual Bedroom",
    kicker: "Open 24/7 · zero beds",
    priceFrom: 0,
    priceUnit: "bed",
    beds: "1 big pool",
    oneLiner: "Let's be honest: you'll sleep four hours a night. The other twenty happen here.",
    features: [],
    photo: "pool-mural",
    isBonus: true,
  },
];
