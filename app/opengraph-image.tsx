import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/config";

export const alt = `${site.name} — ${site.tagline} A crew of travellers who met at the hostel, under a full moon.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// satori supports a CSS subset: no `inset`, every box is flex. Static inputs → read once at module scope (prerendered at build).
// No sharp here: its ESM build imports package.json as a JSON module, which Node < 22.12 reports as an
// ExperimentalWarning that the Next dev overlay shows as an error. satori's objectFit does the crop.
const root = process.cwd();
const [photo, display, serif] = await Promise.all([
  readFile(join(root, "public/photos/night-crew.jpg")),
  readFile(join(root, "assets/fonts/Unbounded-Black.ttf")),
  readFile(join(root, "assets/fonts/InstrumentSerif-Italic.ttf")),
]);
const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: "#07061a" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- satori renders plain <img>, not next/image */}
        <img src={photoSrc} width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }} alt="" />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background: "linear-gradient(90deg, rgba(7,6,26,.92) 0%, rgba(7,6,26,.65) 45%, rgba(7,6,26,.1) 100%)",
          }}
        />
        {/* full moon + UV halo */}
        <div
          style={{
            position: "absolute",
            left: 22,
            top: 14,
            width: 230,
            height: 230,
            borderRadius: 999,
            background: "radial-gradient(circle, transparent 52%, rgba(255,47,179,.55) 58%, rgba(139,92,255,.4) 66%, transparent 74%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 999,
              background: "radial-gradient(circle at 38% 35%, #ffffff 0%, #f8f1e1 55%, #dccfb0 100%)",
              boxShadow: "0 0 80px rgba(255,250,235,.55)",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 64px 56px", width: "100%" }}>
          <div style={{ fontFamily: "Unbounded", fontSize: 128, lineHeight: 0.84, color: "#fbf6ec", letterSpacing: -4, display: "flex", flexDirection: "column" }}>
            <span>COME</span>
            <span>ALONE.</span>
          </div>
          <div style={{ fontFamily: "Instrument", fontSize: 64, color: "#c8ff1a", marginTop: 10 }}>Leave with a family.</div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 22, letterSpacing: 4, color: "#c7c0e8", fontFamily: "Unbounded" }}>
            KOHMUNITY · KOH PHANGAN · FULL MOON ISLAND
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Unbounded", data: display, weight: 900, style: "normal" },
        { name: "Instrument", data: serif, weight: 400, style: "italic" },
      ],
    },
  );
}
