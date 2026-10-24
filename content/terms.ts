import { site } from "./config";

/**
 * Terms & Conditions / house rules, shown on /terms.
 * DRAFT: built from the facts in config.ts and the Hostelworld listing — the owners must read and
 * confirm every line (especially cancellation and deposits) before launch. Edit freely: each
 * section is a title + a list of plain-text points.
 */
export const termsUpdated = "2026-10"; // bump when you change anything below

export const terms: { title: string; points: string[] }[] = [
  {
    title: "Bookings & payment",
    points: [
      "Prices and availability are the ones shown by the booking engine (or the platform you booked on) at the time of booking.",
      "Bookings made on Hostelworld, Booking.com or other platforms follow that platform's payment and cancellation terms.",
    ],
  },
  {
    title: "Cancellations",
    points: [
      "During Full Moon Party and festival periods prices rise island-wide and all bookings are non-refundable.",
      "Outside those periods, the cancellation policy shown when you book applies.",
    ],
  },
  {
    title: "Check-in & check-out",
    points: [
      `Check-in: ${site.policies.checkIn}. Check-out: ${site.policies.checkOut}.`,
      `Reception is open ${site.policies.reception}.`,
      "A valid passport or ID is required at check-in.",
      "Late check-out depends on availability — ask reception.",
    ],
  },
  {
    title: "Who can stay",
    points: [
      `${site.name} is a social hostel for guests aged ${site.policies.ages}.`,
      "Dorms are mixed. Only registered guests may enter the dorms.",
    ],
  },
  {
    title: "House rules",
    points: [
      `Music off at ${site.policies.musicOff}. There is no curfew — just keep it quiet for the people sleeping.`,
      "No illegal drugs on the property. Thai law is strict and so are we: guests breaking this rule will be asked to leave without refund.",
      "Respect the staff, the other guests and the neighbours. Violent, aggressive or discriminatory behaviour means immediate check-out without refund.",
    ],
  },
  {
    title: "Your stuff & damages",
    points: [
      "Every bed has a locker: please use it. The hostel is not responsible for valuables left outside lockers.",
      "Damage to the property, lost keys or key cards will be charged at cost.",
    ],
  },
  {
    title: "Events & activities",
    points: [
      "Events, trips and parties are optional and you join them at your own risk. Line-ups can change with weather and the moon.",
      "Swimming pool: no lifeguard, no glass, and no swimming when intoxicated.",
    ],
  },
  {
    title: "Privacy & photos",
    points: [
      "We only use your details to manage your booking, as required by Thai law (guest registration).",
      "We sometimes take photos at events for our website and social media. Tell reception if you'd rather not appear in them.",
    ],
  },
];
