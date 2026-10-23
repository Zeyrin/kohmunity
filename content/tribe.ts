import type { PhotoSlug } from "./photos";

/**
 * The polaroid wall. Positions are % of the wall (left/top of the card's center),
 * separately for mobile (narrow, tall wall) and desktop (wide wall). Rotation in degrees.
 */
export type Polaroid = {
  photo: PhotoSlug;
  caption: string;
  rotate: number;
  mobile: { x: number; y: number };
  desktop: { x: number; y: number };
};

export const tribe: Polaroid[] = [
  { photo: "tribe-cat", caption: "met the real boss", rotate: -6, mobile: { x: 28, y: 6 }, desktop: { x: 10, y: 22 } },
  { photo: "tribe-bear-hug", caption: "day 2. already family", rotate: 4, mobile: { x: 72, y: 10 }, desktop: { x: 27, y: 14 } },
  { photo: "tribe-bench-crew", caption: "the alt council", rotate: -3, mobile: { x: 30, y: 21 }, desktop: { x: 46, y: 20 } },
  { photo: "tribe-hug-yoga", caption: "namaste & never leave", rotate: 7, mobile: { x: 70, y: 27 }, desktop: { x: 65, y: 13 } },
  { photo: "tribe-magic-cool", caption: "order the “special drink”. trust us", rotate: -5, mobile: { x: 30, y: 37 }, desktop: { x: 84, y: 24 } },
  { photo: "tribe-sunnies", caption: "sunnies at 11pm. iconic", rotate: 3, mobile: { x: 70, y: 44 }, desktop: { x: 15, y: 62 } },
  { photo: "tribe-dance", caption: "midnight, allegedly", rotate: -8, mobile: { x: 30, y: 53 }, desktop: { x: 34, y: 56 } },
  { photo: "tribe-dreads", caption: "cheers to staying 3 more weeks", rotate: 5, mobile: { x: 70, y: 60 }, desktop: { x: 53, y: 64 } },
  { photo: "tribe-hammock", caption: "productive tuesday", rotate: -4, mobile: { x: 30, y: 69 }, desktop: { x: 72, y: 56 } },
  { photo: "tribe-goofy", caption: "when they say last round", rotate: 6, mobile: { x: 70, y: 76 }, desktop: { x: 89, y: 66 } },
  { photo: "tribe-barefoot", caption: "shoes are a construct", rotate: -6, mobile: { x: 30, y: 86 }, desktop: { x: 24, y: 88 } },
  { photo: "tribe-besties", caption: "strangers on monday", rotate: 3, mobile: { x: 70, y: 92 }, desktop: { x: 62, y: 88 } },
];
