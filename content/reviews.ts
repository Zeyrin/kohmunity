import snapshot from "./reviews.hostelworld.json";

/**
 * The "group chat" section.
 *
 * Guest messages are REAL Hostelworld reviews, verbatim, snapshotted by `npm run reviews`
 * (scripts/fetch-reviews.mjs → reviews.hostelworld.json). Don't edit quotes by hand — exclude
 * them in the script instead. Only the hostel's own lines below are copywriting.
 */
export type GuestReview = (typeof snapshot.reviews)[number];

export const guestReviews: GuestReview[] = snapshot.reviews;
export const reviewsFetchedAt = snapshot.fetchedAt;

export const chatTitle = "Kohmunity Fam 🌕";
export const chatSubtitle = "Real reviews from Hostelworld guests · you";

/** Hostel's own lines that open and close the thread. */
export const hostelIntro = "Welcome to the fam 🫶 These are real reviews from Hostelworld, unedited. Scroll, then say hi below 👇";
export const hostelOutro = "We didn’t pay them. We did feed them (family dinner, Wednesdays) 🍜";

/** Name shown on the hostel's own bubbles, and on the auto-replies to visitors. */
export const hostelName = "Kohmunity";
export const botName = "Moon bot 🌕";

/** How many real reviews are in the page HTML; the rest "arrive" live while the chat is on screen. */
export const chatInitialCount = 8;

/**
 * Hostel announcements that pop into the chat at random moments, mixed with the remaining real
 * reviews. Keep them true and evergreen: they're the hostel speaking, never a fake guest.
 * {nextFullMoon} is replaced with the computed date.
 */
export const liveAnnouncements = [
  "🧘 Free yoga tomorrow 09:30 by the pool. Hangovers welcome.",
  "🌕 Next Full Moon Party: {nextFullMoon}. Pre-party here from 19:00, UV paint on us.",
  "🍜 Family dinner is Wednesday, 19:00. Free. One long table. Bring your appetite.",
  "🎤 Monday = Mic Drop Karaoke. Someone always does Bohemian Rhapsody. Could be you.",
  "🏊 Pool check: perfect. Floaties: inflated. Your excuse: none.",
  "🛵 Scooter rental right next door. Ask reception for the safe-driving speech 🙃",
  "🌅 Saturday sunset pool party → Walking Street → Eden Garden. Pace yourself (you won’t).",
];
