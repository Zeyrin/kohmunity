import { photoFiles, type PhotoSlug } from "./photos.generated";

/**
 * Alt text + art-direction hints for every real photo on the site.
 * `focus` is a CSS object-position used whenever the photo gets cropped (cards, polaroids, mobile hero).
 */
const meta: Record<PhotoSlug, { alt: string; focus?: string }> = {
  "night-dancer": { alt: "A guest with wet hair dances and laughs at the Kohmunity bar, flecks of UV paint glowing on her skin", focus: "45% 40%" },
  "night-crew": { alt: "Seven travellers who met at the hostel squeeze together for a photo, one holding a green party bucket", focus: "55% 40%" },
  "uv-flex": { alt: "A shirtless guest flexes his arms to show off neon green and pink UV body paint at the Full Moon pre-party", focus: "62% 35%" },
  "uv-garden": { alt: "Two friends with glowing UV face paint share a bucket in the hostel garden under string lights", focus: "45% 45%" },
  "uv-painting": { alt: "A guest in glasses paints neon patterns onto another traveller's back on floor cushions before the party", focus: "45% 50%" },
  "day-floaties": { alt: "Two tattooed guests flex on inflatable pool floats in the Kohmunity pool under a clear blue sky", focus: "60% 50%" },
  "day-floaties-portrait": { alt: "A grinning guest in sunglasses flexes on an inflatable ring in the sunny Kohmunity pool", focus: "50% 50%" },
  "uv-flex-portrait": { alt: "A shirtless guest flexes to show off neon green and pink UV body paint at the Full Moon pre-party", focus: "50% 35%" },
  "day-family": { alt: "About sixteen guests pose together by the pool with palm trees and blue sky behind them", focus: "50% 50%" },

  "room-dorm-8": { alt: "The 8-bed dorm: black metal bunks with privacy curtains, reading lights and air conditioning", focus: "50% 55%" },
  "room-dorm-4": { alt: "The 4-bed dorm: two bunk beds with fresh striped sheets, privacy curtains and a blue accent wall", focus: "55% 55%" },
  "room-private": { alt: "A private double room with mustard-yellow walls, towels folded into swans and a bedside lamp", focus: "50% 60%" },
  "room-private-alt": { alt: "Another view of the private double room with a big bed, wooden wall panels and an ensuite door", focus: "40% 60%" },
  "room-bathroom": { alt: "A clean ensuite bathroom with a glass rain shower, toilet and sink", focus: "50% 55%" },
  "pool-mural": { alt: "The hostel pool beside a bungalow painted with a rainbow sunset mural, a guest mid-jump on the edge", focus: "55% 55%" },

  "tribe-cat": { alt: "A guest in a fishnet top and big glasses cuddles the hostel's calico cat in front of pink bougainvillea", focus: "45% 35%" },
  "tribe-hug-yoga": { alt: "Two guests share a long hug after yoga in front of a green painted wall", focus: "55% 35%" },
  "tribe-bear-hug": { alt: "Three friends crush each other in a laughing group hug against a yellow wall", focus: "45% 40%" },
  "tribe-bench-crew": { alt: "Four tattooed friends pull faces together on a bench in the common area", focus: "50% 40%" },
  "tribe-sunnies": { alt: "A smiling guest with sunglasses pushed up on her head sits on cushions at night", focus: "55% 30%" },
  "tribe-magic-cool": { alt: "Two guests and a bartender raise drinks at the bar under a hand-chalked Special Drink board", focus: "55% 45%" },
  "tribe-dance": { alt: "Two friends dance with their arms in the air under festoon lights at night", focus: "55% 40%" },
  "tribe-dreads": { alt: "A couple with blonde dreadlocks clink beer bottles at a table at night", focus: "50% 45%" },
  "tribe-barefoot": { alt: "A barefoot guest laughs on a wooden bench holding a water bottle", focus: "50% 35%" },
  "tribe-goofy": { alt: "A guest with a fringe pulls a mock-shocked face while holding a drink at the bar", focus: "40% 35%" },
  "tribe-besties": { alt: "Two friends smile side by side at the hostel bar", focus: "50% 35%" },
  "tribe-duet": { alt: "A guest in glasses and a guy in a white T-shirt belt out a karaoke duet into the same microphone", focus: "50% 40%" },
  "tribe-hammock": { alt: "Two guests in sunglasses lounge in a rainbow-striped hammock under a tree", focus: "55% 50%" },

  "event-yoga": { alt: "Guests lie on purple mats during the free morning yoga session in the open-air shala", focus: "55% 55%" },
  "event-pool": { alt: "Guests hang out on the pool edge on a sunny afternoon, one with a towel draped over his head", focus: "55% 55%" },
  "event-karaoke": { alt: "Two guests scream a karaoke duet into microphones under a blue spotlight", focus: "45% 40%" },
  "event-karaoke-crowd": { alt: "A packed karaoke crowd cheers from wooden benches under pink and purple lights", focus: "50% 55%" },
  "event-beerpong": { alt: "Two guests pose at the beer pong table with red cups at night", focus: "50% 40%" },
  "event-courtyard": { alt: "The hostel courtyard from above, full of guests at long tables at night", focus: "50% 55%" },
  "event-bar": { alt: "Guests celebrate on the bar top under a disco ball during the Full Moon pre-party", focus: "50% 40%" },
  "event-dinner": { alt: "A table of new friends squeezes together for a photo under the string lights after dinner", focus: "50% 40%" },
  "event-boat": { alt: "The wooden bow of a longtail boat heading across turquoise water towards a hidden beach between limestone cliffs", focus: "50% 60%" },
};

export type Photo = (typeof photoFiles)[PhotoSlug] & { slug: PhotoSlug; alt: string; focus: string };

export function photo(slug: PhotoSlug): Photo {
  return { ...photoFiles[slug], slug, alt: meta[slug].alt, focus: meta[slug].focus ?? "50% 50%" };
}

export type { PhotoSlug };
