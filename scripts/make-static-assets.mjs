// Generates the grain tile and app icons. Run: node scripts/make-static-assets.mjs
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

// 160×160 monochrome noise tile (alpha-only so it works on both day and night backgrounds)
const N = 160;
const px = Buffer.alloc(N * N * 4);
for (let i = 0; i < N * N; i++) {
  const v = Math.random() * 255;
  px.set([v, v, v, Math.random() < 0.5 ? 255 : 0], i * 4);
}
await sharp(px, { raw: { width: N, height: N, channels: 4 } }).png({ compressionLevel: 9, palette: true }).toFile("public/noise.png");

// Moon icon: full moon with a UV halo on night indigo
const svg = (size, pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" rx="${pad ? 14 : 0}" fill="#07061a"/>
  <circle cx="32" cy="32" r="22" fill="#8b5cff" opacity=".35"/>
  <circle cx="32" cy="32" r="17" fill="#fbf6ec"/>
  <circle cx="26" cy="27" r="3.2" fill="#d9d1bd"/><circle cx="37" cy="37" r="4.4" fill="#d9d1bd"/><circle cx="38" cy="24" r="2" fill="#d9d1bd"/>
  <path d="M10 50 Q32 40 54 50" stroke="#c8ff1a" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;
await writeFile("app/icon.svg", svg(64, true));
await sharp(Buffer.from(svg(180, false))).png().toFile("app/apple-icon.png");
console.log("ok");
