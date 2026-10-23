import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // AVIF first (~30% smaller than WebP on these photos), WebP fallback.
    formats: ["image/avif", "image/webp"],
    // 70 for big full-bleed photos, 75 default for cards/polaroids.
    qualities: [70, 75],
    // cap at 2400 — the masters in /public/photos are 2400px on the long edge
    deviceSizes: [390, 640, 828, 1080, 1440, 1920, 2400],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
