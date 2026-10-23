import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Unbounded } from "next/font/google";
import { site } from "@/content/config";
import { Header } from "@/components/header";
import { MotionRoot } from "@/components/motion-root";
import { ThemeScript } from "./theme-script";
import { HostelJsonLd } from "./json-ld";
import "./globals.css";

// The whole site is static. This makes the build FAIL if anyone adds request-time rendering.
export const ensureStatic = "navigation";

// Only the display face is preloaded (it's in the first viewport). Serif + mono swap in.
// One static 900 cut (~16KB) instead of the variable font (~50KB): it's the LCP text's font.
const unbounded = Unbounded({ subsets: ["latin"], weight: "900", variable: "--font-unbounded", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
  preload: false,
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Social Hostel on Koh Phangan | ${site.tagline}`,
    template: `%s | ${site.name} Koh Phangan`,
  },
  description: site.description,
  keywords: [
    "Koh Phangan hostel",
    "Full Moon Party hostel",
    "Thong Sala hostel",
    "social hostel Thailand",
    "solo travel Koh Phangan",
    "party hostel Koh Phangan",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: `${site.name} — ${site.tagline}`, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07061a" },
    { media: "(prefers-color-scheme: light)", color: "#f3e4c8" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // data-theme is written by ThemeScript before hydration
      suppressHydrationWarning
      className={`${unbounded.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <head>
        <ThemeScript />
        <HostelJsonLd />
      </head>
      <body>
        <a
          href="#main"
          className="label sr-only z-[100] rounded-full bg-accent px-4 py-3 text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header />
        {children}
        <div className="grain" aria-hidden="true" />
        <MotionRoot />
      </body>
    </html>
  );
}
