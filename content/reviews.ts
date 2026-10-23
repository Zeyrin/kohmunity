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
