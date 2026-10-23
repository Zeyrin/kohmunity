// Turns the camera originals in /photos into web masters in /public/photos
// and writes content/photos.generated.ts (dimensions + blur placeholders).
// Run: npm run photos — only needed when the selection below changes.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public/photos");
const LONG_EDGE = 2400; // next/image never needs more than this (deviceSizes max 3840 is only hit by 4K desktops, 2400 is plenty)

/** slug → original file (or { file, crop } for an art-directed crop). Keep slugs semantic: they end up in URLs and alt-text keys. */
const SELECTION = {
  // hero
  "night-dancer": "fullmoon/-_SK94570.NEFs.JPG",
  "night-crew": "fullmoon/-_SK94401.NEFs.JPG",
  "uv-flex": "fullmoon/-_SK94604.NEFs.JPG",
  "uv-garden": "fullmoon/-_SK94615.NEFs.JPG",
  "uv-painting": "fullmoon/-_SK94410.NEFs.JPG",
  "day-floaties": "guest/-_SK95225.NEFs.JPG",
  "day-family": "guest/-_SK95329.NEFs.JPG",
  // portrait crops for the mobile hero (x = horizontal center of the crop, 0–1)
  "day-floaties-portrait": { file: "guest/-_SK95225.NEFs.JPG", crop: { aspect: 2 / 3, x: 0.72 } },
  "uv-flex-portrait": { file: "fullmoon/-_SK94604.NEFs.JPG", crop: { aspect: 2 / 3, x: 0.6 } },
  // rooms
  "room-dorm-8": { file: "room/-_SK92749.NEFs.JPG", crop: { aspect: 3 / 4, x: 0.5 } },
  "room-dorm-4": { file: "room/-_SK98632.NEFs.JPG", crop: { aspect: 3 / 4, x: 0.55 } },
  "room-private": { file: "room/-_SK98618.NEFs.JPG", crop: { aspect: 3 / 4, x: 0.5 } },
  "room-private-alt": "room/-_SK98608.NEFs.JPG",
  "room-bathroom": "room/-_SK92776.NEFs.JPG",
  "pool-mural": { file: "guest/-_SK95349.NEFs.JPG", crop: { aspect: 3 / 4, x: 0.6 } },
  // tribe
  "tribe-cat": { file: "guest/-_SK95779.NEFs.JPG", crop: { aspect: 4 / 5, y: 0.35 } },
  "tribe-hug-yoga": { file: "guest/-_SK95166.NEFs.JPG", crop: { aspect: 4 / 5, y: 0.35 } },
  "tribe-bear-hug": { file: "karaoke/-_SK92815.NEFs.JPG", crop: { aspect: 4 / 5, x: 0.45 } },
  "tribe-bench-crew": { file: "guest/-_SK95727.NEFs.JPG", crop: { aspect: 4 / 5, x: 0.5 } },
  "tribe-sunnies": { file: "guest/-_SK95498.NEFs.JPG", crop: { aspect: 4 / 5, y: 0.3 } },
  "tribe-magic-cool": { file: "guest/-_SK95693.NEFs.JPG", crop: { aspect: 4 / 5, x: 0.55 } },
  "tribe-dance": { file: "karaoke/-_SK97703.NEFs.JPG", crop: { aspect: 4 / 5, x: 0.55 } },
  "tribe-dreads": { file: "karaoke/-_SK98866.NEFs.JPG", crop: { aspect: 4 / 5, y: 0.45 } },
  "tribe-barefoot": { file: "guest/-_SK95516.NEFs.JPG", crop: { aspect: 4 / 5, y: 0.35 } },
  "tribe-goofy": { file: "karaoke/-_SK97640.NEFs.JPG", crop: { aspect: 4 / 5, x: 0.4 } },
  "tribe-besties": { file: "guest/-_SK95337.NEFs.JPG", crop: { aspect: 4 / 5, x: 0.5 } },
  "tribe-hammock": { file: "guest/-_SK96067.NEFs.JPG", crop: { aspect: 4 / 5, x: 0.55 } },
  // events
  "event-yoga": "guest/-_SK95159.NEFs.JPG",
  "event-pool": "guest/-_SK95243.NEFs.JPG",
  "event-karaoke": "karaoke/-_SK97532.NEFs.JPG",
  "event-karaoke-crowd": "karaoke/-_SK98882.NEFs.JPG",
  "event-beerpong": "guest/-_SK95665.NEFs.JPG",
  "event-courtyard": "fullmoon/-_SK94637.NEFs.JPG",
  "event-bar": "fullmoon/-_SK94897.NEFs.JPG",
};

await mkdir(OUT, { recursive: true });
const manifest = {};
for (const [slug, entry] of Object.entries(SELECTION)) {
  const { file, crop } = typeof entry === "string" ? { file: entry } : entry;
  const src = path.join(ROOT, "photos", file);
  // .rotate() bakes EXIF orientation; metadata is dropped by default (strips GPS/camera serials).
  let base = sharp(src).rotate();
  if (crop) {
    const oriented = await base.toBuffer({ resolveWithObject: true });
    const { width: w, height: h } = oriented.info;
    if (w / h > crop.aspect) {
      // source wider than target → trim the sides around crop.x
      const cw = Math.round(h * crop.aspect);
      const left = Math.min(Math.max(Math.round(w * (crop.x ?? 0.5) - cw / 2), 0), w - cw);
      base = sharp(oriented.data).extract({ left, top: 0, width: cw, height: h });
    } else {
      // source taller than target → trim top/bottom around crop.y
      const ch = Math.round(w / crop.aspect);
      const top = Math.min(Math.max(Math.round(h * (crop.y ?? 0.5) - ch / 2), 0), h - ch);
      base = sharp(oriented.data).extract({ left: 0, top, width: w, height: ch });
    }
  }
  const img = base.clone().resize(LONG_EDGE, LONG_EDGE, { fit: "inside" });
  const { data, info } = await img
    .jpeg({ quality: 90, mozjpeg: true, progressive: true }) // high: next/image re-encodes to AVIF, avoid double loss
    .toBuffer({ resolveWithObject: true });
  await writeFile(path.join(OUT, `${slug}.jpg`), data);
  const blur = await base.clone().resize(16, 16, { fit: "inside" }).jpeg({ quality: 50 }).toBuffer();
  manifest[slug] = {
    src: `/photos/${slug}.jpg`,
    width: info.width,
    height: info.height,
    blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}`,
  };
  console.log(`${slug.padEnd(20)} ${info.width}x${info.height} ${(data.length / 1024).toFixed(0)}KB`);
}

// Open Graph background: pre-cropped here so the OG route needs no image library at runtime.
await sharp(path.join(OUT, "night-crew.jpg"))
  .resize(1200, 630, { fit: "cover", position: "attention" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(ROOT, "assets/og-base.jpg"));

const ts = `// AUTO-GENERATED by scripts/optimize-photos.mjs — do not edit by hand.
export const photoFiles = ${JSON.stringify(manifest, null, 2)} as const;

export type PhotoSlug = keyof typeof photoFiles;
`;
await writeFile(path.join(ROOT, "content/photos.generated.ts"), ts);
