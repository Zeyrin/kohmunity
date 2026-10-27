import type { PhotoSlug } from "./photos";

/**
 * The polaroid wall. x/y are 0–100: 0 = flush left/top of the wall, 100 = flush right/bottom
 * (the card never overflows). Separate for mobile (2 columns) and desktop. Rotation in degrees.
 */
export type Polaroid = {
  photo: PhotoSlug;
  caption: string;
  rotate: number;
  mobile: { x: number; y: number };
  desktop: { x: number; y: number };
};

export const tribe: Polaroid[] = [
  { photo: "tribe-cat", caption: "met the real boss", rotate: -6, mobile: { x: 2, y: 0 }, desktop: { x: 2, y: 18 } },
  { photo: "tribe-bear-hug", caption: "day 2. already family", rotate: 4, mobile: { x: 98, y: 8 }, desktop: { x: 20, y: 4 } },
  { photo: "tribe-bench-crew", caption: "the alt council", rotate: -3, mobile: { x: 2, y: 17 }, desktop: { x: 40, y: 14 } },
  { photo: "tribe-hug-yoga", caption: "namaste & never leave", rotate: 7, mobile: { x: 98, y: 25 }, desktop: { x: 60, y: 0 } },
  { photo: "uv-garden", caption: "glow paint, one bucket, two straws", rotate: -5, mobile: { x: 2, y: 33 }, desktop: { x: 80, y: 10 } },
  { photo: "tribe-sunnies", caption: "sunnies at 11pm. iconic", rotate: 3, mobile: { x: 98, y: 42 }, desktop: { x: 98, y: 22 } },
  { photo: "tribe-dance", caption: "midnight, allegedly", rotate: -8, mobile: { x: 2, y: 50 }, desktop: { x: 6, y: 78 } },
  { photo: "tribe-dreads", caption: "cheers to staying 3 more weeks", rotate: 5, mobile: { x: 98, y: 58 }, desktop: { x: 28, y: 92 } },
  { photo: "tribe-hammock", caption: "productive tuesday", rotate: -4, mobile: { x: 2, y: 67 }, desktop: { x: 48, y: 70 } },
  { photo: "tribe-goofy", caption: "when they say last round", rotate: 6, mobile: { x: 98, y: 75 }, desktop: { x: 68, y: 96 } },
  { photo: "tribe-barefoot", caption: "shoes are a construct", rotate: -6, mobile: { x: 2, y: 83 }, desktop: { x: 88, y: 74 } },
  { photo: "tribe-besties", caption: "strangers on monday", rotate: 3, mobile: { x: 98, y: 92 }, desktop: { x: 16, y: 46 } },
  { photo: "tribe-mic", caption: "first song, zero shame", rotate: -5, mobile: { x: 2, y: 100 }, desktop: { x: 64, y: 46 } },
];
