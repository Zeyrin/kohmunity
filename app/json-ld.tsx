import { site } from "@/content/config";
import { rooms } from "@/content/rooms";

/**
 * schema.org/Hostel for Google (local pack, hotel knowledge panel, "official site" signal).
 * No aggregateRating on purpose: Google treats ratings copied from third-party platforms as
 * self-serving and can issue a manual action. Let the platforms carry the stars.
 */
export function HostelJsonLd() {
  const bookable = rooms.filter((r) => !r.isBonus);
  const data = {
    "@context": "https://schema.org",
    "@type": "Hostel",
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    description: site.description,
    image: [`${site.url}/opengraph-image`],
    slogan: site.tagline,
    priceRange: "฿",
    currenciesAccepted: "THB",
    checkinTime: site.policies.checkIn.split("–")[0],
    checkoutTime: "12:00",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.location.street,
      addressLocality: site.location.locality,
      addressRegion: site.location.region,
      postalCode: site.location.postalCode,
      addressCountry: site.location.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.location.geo.lat, longitude: site.location.geo.lng },
    hasMap: site.location.mapsUrl,
    sameAs: [
      site.socials.instagram.url,
      site.socials.tiktok.url,
      ...site.ratings.map((r) => r.url),
    ],
    amenityFeature: ["Swimming pool", "Free Wi-Fi", "Air conditioning", "Free yoga", "Bar", "Lockers", "Luggage storage"].map(
      (name) => ({ "@type": "LocationFeatureSpecification", name, value: true }),
    ),
    makesOffer: bookable.map((r) => ({
      "@type": "Offer",
      name: `${r.name} (${r.kicker})`,
      url: site.bookingUrl,
    })),
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: no user input, and we escape "<" defensively
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
