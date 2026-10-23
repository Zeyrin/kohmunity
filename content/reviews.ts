/**
 * The "group chat" reviews.
 *
 * PLACEHOLDER COPY: these messages are written to match what real guests repeatedly praise on
 * Hostelworld (staff, free yoga, pool, family dinner, feeling at home) but they are NOT real
 * quotes. Before launch, replace them with real guest words (with permission) — e.g. collect them
 * from a "leave us a voice note" QR code at checkout. Keep `from` to first name + country.
 */
export type ChatMessage = {
  from: string;
  country: string; // flag emoji
  text: string;
  time: string;
  /** Messages sent by the hostel render on the right, like "you". */
  isHostel?: boolean;
};

export const chatTitle = "Kohmunity Fam 🌕";
export const chatSubtitle = "Guests, past and present — 3,912 members"; // PLACEHOLDER count

export const chat: ChatMessage[] = [
  { from: "Kohmunity", country: "🌴", text: "Welcome to the fam 🫶 Family dinner tonight at 7, poolside pre-drinks from 6", time: "17:02", isHostel: true },
  { from: "Lena", country: "🇩🇪", text: "Booked 2 nights. Currently on night 9. Send help (don't)", time: "17:04" },
  { from: "Jake", country: "🇬🇧", text: "Came alone, now have 14 best friends and a tan line I can't explain", time: "17:05" },
  { from: "Valentina", country: "🇵🇪", text: "Free yoga every morning?? and it actually fixed my hangover??", time: "17:09" },
  { from: "Meg", country: "🇨🇦", text: "Staff treated me like family from minute one. Felt like home but with a pool", time: "17:12" },
  { from: "Tom", country: "🇦🇺", text: "Pre-party > the actual Full Moon. Don't tell Haad Rin", time: "17:16" },
  { from: "Kohmunity", country: "🌴", text: "We won't 🤫 Taxis to Haad Rin sorted at 22:30", time: "17:17", isHostel: true },
  { from: "Sofia", country: "🇮🇹", text: "Is it weird I miss the cat more than my ex", time: "17:21" },
];
