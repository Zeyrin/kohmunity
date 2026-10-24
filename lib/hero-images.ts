import { getImageProps } from "next/image";
import { photo, type PhotoSlug } from "@/content/photos";

/**
 * Art-directed hero sources (portrait crop < 768px, landscape above) for each mode.
 * Shared by the <picture> elements in the hero AND the inline <head> script that preloads only
 * the variant the visitor will actually see — so we never download the hidden mode's image.
 */
export const HERO_BREAKPOINT = "(min-width: 768px)";
const SIZES = "100vw";
const QUALITY = 70;

const sets = {
  night: { mobile: "night-dancer", desktop: "night-crew" },
  day: { mobile: "day-floaties-portrait", desktop: "day-floaties" },
  uv: { mobile: "uv-flex-portrait", desktop: "uv-flex" },
} satisfies Record<string, { mobile: PhotoSlug; desktop: PhotoSlug }>;

export type HeroVariant = keyof typeof sets;

function srcSetFor(slug: PhotoSlug) {
  const p = photo(slug);
  const { props } = getImageProps({ src: p.src, width: p.width, height: p.height, alt: p.alt, sizes: SIZES, quality: QUALITY });
  return { srcSet: props.srcSet ?? "", src: props.src, alt: p.alt, width: p.width, height: p.height, focus: p.focus };
}

export function heroSources(variant: HeroVariant) {
  const s = sets[variant];
  return { mobile: srcSetFor(s.mobile), desktop: srcSetFor(s.desktop), sizes: SIZES };
}

/** Minimal payload for the head preload script. */
export function heroPreloadPayload() {
  const pick = (v: HeroVariant) => {
    const h = heroSources(v);
    return [h.mobile.srcSet, h.desktop.srcSet];
  };
  return { bp: HERO_BREAKPOINT, sizes: SIZES, night: pick("night"), day: pick("day") };
}
