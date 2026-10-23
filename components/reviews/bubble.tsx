import { site } from "@/content/config";
import { hostelName, type GuestReview } from "@/content/reviews";
import { flag } from "@/lib/flags";

/**
 * Presentational pieces shared by the server-rendered thread (reviews.tsx) and the live,
 * client-side part of the chat (chat-composer.tsx). No hooks, no "use client": works in both.
 */
export type ChatItem = { kind: "hostel"; text: string } | { kind: "guest"; review: GuestReview };

export const chatFont = "[font-family:system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif]";
export const bubbleIn = `max-w-[88%] rounded-xl rounded-tl-sm bg-[var(--chat-in)] px-3 pb-1.5 pt-2 text-[0.92rem] leading-snug shadow-sm ${chatFont}`;

/** Deterministic name colours, like WhatsApp groups — [on dark bubble, on light bubble], all ≥4.5:1. */
const NAME_COLORS = [
  ["#ff7ac6", "#c2185b"],
  ["#7ee0ff", "#0b6b9a"],
  ["#c8ff1a", "#4d7c0f"],
  ["#ffb35c", "#b45309"],
  ["#b69bff", "#6d28d9"],
  ["#5cffb0", "#047857"],
];
const colorFor = (key: string) => NAME_COLORS[[...key].reduce((a, c) => a + c.charCodeAt(0), 0) % NAME_COLORS.length];

const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

export function TypingDots() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map((d) => (
        <span key={d} className="typing-dot size-1.5 rounded-full" style={{ background: "var(--chat-meta)", animationDelay: `${d * 0.15}s` }} />
      ))}
    </span>
  );
}

/** Name line + text (+ stars/date for guests). `time` overrides the review date with a clock time. */
export function BubbleBody({ item, time }: { item: ChatItem; time?: string }) {
  const isHostel = item.kind === "hostel";
  const [dark, light] = isHostel ? ["#c8ff1a", "#4d7c0f"] : colorFor(item.review.id);
  return (
    <>
      <p
        className="text-[0.8rem] font-bold text-[var(--n-dark)] in-data-[theme=day]:text-[var(--n-light)]"
        style={{ "--n-dark": dark, "--n-light": light } as React.CSSProperties}
      >
        {isHostel ? (
          <>
            {hostelName}{" "}
            <span className="ml-1 rounded bg-[var(--chat-bg)] px-1 py-px text-[0.62rem] font-semibold text-[var(--chat-ink)]">admin</span>
          </>
        ) : (
          <>
            ~ Guest {flag(item.review.countryCode)} {item.review.country}
            {item.review.age ? <span className="font-normal"> · {item.review.age.replace("-", "–")}</span> : null}
          </>
        )}
      </p>
      {isHostel ? (
        <p>
          {item.text}
          {time ? (
            <span className="float-right ml-3 mt-1.5 text-[0.66rem]" style={{ color: "var(--chat-meta)" }}>
              {time}
            </span>
          ) : null}
        </p>
      ) : (
        <>
          <blockquote cite={site.rating.url} className="whitespace-pre-line">
            {item.review.text}
          </blockquote>
          <p className="mt-1 flex justify-between gap-3 text-[0.66rem]" style={{ color: "var(--chat-meta)" }}>
            <span className="text-[#f5b301]" aria-label={`Rated ${item.review.rating} out of 10`}>
              ★★★★★ <span style={{ color: "var(--chat-meta)" }}>{item.review.rating}/10</span>
            </span>
            <time dateTime={item.review.date}>{shortDate(item.review.date)}</time>
          </p>
        </>
      )}
    </>
  );
}
