import type { MetadataRoute } from "next";
import { site } from "@/content/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/full-moon-party-dates`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
