import type { PhotoSlug } from "./photos";

export type EventItem = {
  day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN" | "DAILY" | "MONTHLY";
  time: string;
  title: string;
  blurb: string;
  free?: boolean;
  photo?: PhotoSlug;
  /** Which mode the event belongs to — drives highlighting when Day/Night is toggled. */
  vibe: "day" | "night";
  /**
   * "listing" = taken from the hostel's current Hostelworld listing.
   * "draft"   = invented to fill the week — confirm or edit before launch.
   */
  source: "listing" | "draft";
};

export const lineup: EventItem[] = [
  {
    day: "DAILY",
    time: "09:30",
    title: "Hangover Yoga",
    blurb: "Free. Stretch out last night's bad decisions by the pool.",
    free: true,
    photo: "event-yoga",
    vibe: "day",
    source: "listing",
  },
  {
    day: "MON",
    time: "21:00",
    title: "Mic Drop Karaoke",
    blurb: "Nobody can sing. Everybody sings. Bohemian Rhapsody is mandatory.",
    photo: "event-karaoke",
    vibe: "night",
    source: "draft",
  },
  {
    day: "TUE",
    time: "20:00",
    title: "Beer Pong Cup + OXA Jungle Pre-Party",
    blurb: "Pick a partner, win the cup, ride to the jungle as legends.",
    photo: "event-beerpong",
    vibe: "night",
    source: "listing",
  },
  {
    day: "WED",
    time: "19:00",
    title: "Family Dinner",
    blurb: "Free dinner, one long table, poolside pre-drinks. This is where it happens.",
    free: true,
    vibe: "night",
    source: "listing",
  },
  {
    day: "THU",
    time: "10:00",
    title: "Boat Trip",
    blurb: "Longtail, snorkels, a hidden beach and zero phone signal. Bring sunscreen, lose inhibitions.",
    vibe: "day",
    source: "draft",
  },
  {
    day: "FRI",
    time: "20:00",
    title: "Reggae Night",
    blurb: "Slow it down. Bob on the speakers, everyone on the cushions.",
    photo: "event-courtyard",
    vibe: "night",
    source: "listing",
  },
  {
    day: "SAT",
    time: "16:00",
    title: "Sunset Pool Party → Walking Street → Eden Garden",
    blurb: "Floaties at four, street food at seven, pre-party at nine. Pace yourself (you won't).",
    photo: "event-pool",
    vibe: "day",
    source: "listing",
  },
  {
    day: "SUN",
    time: "All day",
    title: "Recovery Sunday",
    blurb: "Pool. Hammock. Mango shake. Repeat. Talking is optional.",
    vibe: "day",
    source: "draft",
  },
  {
    day: "MONTHLY",
    time: "From 19:00",
    title: "Full Moon Pre-Party",
    blurb: "UV paint, buckets, the whole family — then we sort the ride to Haad Rin together.",
    photo: "event-bar",
    vibe: "night",
    source: "listing",
  },
];
