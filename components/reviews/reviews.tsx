import { site } from "@/content/config";
import { chatSubtitle, chatTitle, guestReviews, hostelIntro, hostelName, hostelOutro, type GuestReview } from "@/content/reviews";
import { flag } from "@/lib/flags";
import { SectionHeading } from "../section-heading";
import { ChatComposerLazy } from "./chat-composer-lazy";
import { ChatMotion } from "./chat-motion";

const SHOWN = 10;
const chatFont = "[font-family:system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif]";

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

/** WhatsApp-ish doodle wallpaper, pure CSS. */
const wallpaper = {
  backgroundColor: "var(--chat-bg)",
  backgroundImage:
    "radial-gradient(circle at 20% 30%, var(--chat-doodle) 0 2px, transparent 3px), radial-gradient(circle at 70% 80%, var(--chat-doodle) 0 1.5px, transparent 2.5px), radial-gradient(circle at 90% 20%, var(--chat-doodle) 0 1px, transparent 2px)",
  backgroundSize: "46px 46px, 62px 62px, 38px 38px",
};

const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

type Item = { kind: "hostel"; key: string; text: string } | { kind: "guest"; key: string; review: GuestReview };

function TypingDots() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map((d) => (
        <span key={d} className="typing-dot size-1.5 rounded-full" style={{ background: "var(--chat-meta)", animationDelay: `${d * 0.15}s` }} />
      ))}
    </span>
  );
}

function Bubble({ item }: { item: Item }) {
  const isHostel = item.kind === "hostel";
  const [dark, light] = isHostel ? ["#c8ff1a", "#4d7c0f"] : colorFor(item.review.id);
  return (
    <li data-chat-item className="relative flex flex-col items-start">
      <div data-typing aria-hidden="true" className="absolute left-0 top-0 hidden rounded-xl bg-[var(--chat-in)] px-3.5 py-3">
        <TypingDots />
      </div>
      <div data-msg className={`max-w-[88%] rounded-xl rounded-tl-sm bg-[var(--chat-in)] px-3 pb-1.5 pt-2 text-[0.92rem] leading-snug shadow-sm ${chatFont}`}>
        <p
          className="text-[0.8rem] font-bold text-[var(--n-dark)] in-data-[theme=day]:text-[var(--n-light)]"
          style={{ "--n-dark": dark, "--n-light": light } as React.CSSProperties}
        >
          {isHostel ? (
            <>
              {hostelName} <span className="ml-1 rounded bg-[var(--chat-bg)] px-1 py-px text-[0.62rem] font-semibold text-[var(--chat-ink)]">admin</span>
            </>
          ) : (
            <>
              ~ Guest {flag(item.review.countryCode)} {item.review.country}
              {item.review.age ? <span className="font-normal"> · {item.review.age.replace("-", "–")}</span> : null}
            </>
          )}
        </p>
        {isHostel ? (
          <p>{item.text}</p>
        ) : (
          <blockquote cite={site.rating.url} className="whitespace-pre-line">
            {item.review.text}
          </blockquote>
        )}
        {!isHostel ? (
          <p className="mt-1 flex justify-between gap-3 text-[0.66rem]" style={{ color: "var(--chat-meta)" }}>
            <span className="text-[#f5b301]" aria-label={`Rated ${item.review.rating} out of 10`}>
              ★★★★★ <span style={{ color: "var(--chat-meta)" }}>{item.review.rating}/10</span>
            </span>
            <time dateTime={item.review.date}>{shortDate(item.review.date)}</time>
          </p>
        ) : null}
      </div>
    </li>
  );
}

export function Reviews() {
  const items: Item[] = [
    { kind: "hostel", key: "intro", text: hostelIntro },
    ...guestReviews.slice(0, SHOWN).map((review) => ({ kind: "guest" as const, key: review.id, review })),
    { kind: "hostel", key: "outro", text: hostelOutro },
  ];

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative py-24 md:py-32">
      <div className="md:grid md:grid-cols-[1fr_minmax(0,30rem)] md:items-start md:gap-12 md:pr-12">
        <div className="md:sticky md:top-32">
          <SectionHeading index="05" label="Reviews" id="reviews-title" aside="(real ones. unedited.)">
            The group <span className="text-accent">chat.</span>
          </SectionHeading>
          <a
            href={site.rating.url}
            rel="noopener"
            target="_blank"
            className="mx-4 mt-8 inline-flex items-center gap-4 rounded-2xl border border-line px-5 py-4 transition-colors hover:border-accent md:mx-12"
          >
            <span className="display text-5xl text-accent">{site.rating.score}</span>
            <span className="label leading-relaxed text-ink-dim">
              /{site.rating.outOf} · {site.rating.count} reviews
              <br />
              Read them all on {site.rating.source} ↗
            </span>
          </a>
        </div>

        {/* the chat window */}
        <div
          className="mx-3 mt-12 overflow-hidden rounded-[1.75rem] border border-line shadow-[0_30px_80px_-30px_rgb(0_0_0/.7)] md:mx-0 md:mt-0 [--chat-bg:#0b141a] [--chat-doodle:rgb(255_255_255/.05)] [--chat-in:#202c33] [--chat-out:#005c4b] [--chat-ink:#e9edef] [--chat-meta:#8696a0] in-data-[theme=day]:[--chat-bg:#efeae2] in-data-[theme=day]:[--chat-doodle:rgb(0_0_0/.06)] in-data-[theme=day]:[--chat-in:#ffffff] in-data-[theme=day]:[--chat-out:#d9fdd3] in-data-[theme=day]:[--chat-ink:#111b21] in-data-[theme=day]:[--chat-meta:#54656f]"
          style={{ color: "var(--chat-ink)" }}
        >
          <div className="flex items-center gap-3 bg-[var(--chat-in)] px-4 py-3">
            <span className="grid size-10 place-items-center rounded-full bg-night text-xl" aria-hidden="true">
              🌕
            </span>
            <div className="min-w-0">
              <p className={`truncate text-[0.95rem] font-bold ${chatFont}`}>{chatTitle}</p>
              <p className="truncate text-xs" style={{ color: "var(--chat-meta)" }}>
                {chatSubtitle}
              </p>
            </div>
          </div>

          <div style={wallpaper}>
            <ol className="flex flex-col gap-1.5 px-3 py-5 md:px-4" aria-label={`Guest reviews from ${site.rating.source}`}>
              {items.map((item) => (
                <Bubble key={item.key} item={item} />
              ))}
            </ol>
            <ChatComposerLazy />
          </div>
        </div>
      </div>
      <ChatMotion />
    </section>
  );
}
