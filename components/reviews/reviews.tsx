import { site } from "@/content/config";
import { chatInitialCount, chatSubtitle, chatTitle, guestReviews, hostelIntro, hostelOutro } from "@/content/reviews";
import { SectionHeading } from "../section-heading";
import { BubbleBody, TypingDots, bubbleIn, chatFont, type ChatItem } from "./bubble";
import { ChatComposerLazy } from "./chat-composer-lazy";
import { ChatExpander } from "./chat-expander";
import { ChatMotion } from "./chat-motion";

/** WhatsApp-ish doodle wallpaper, pure CSS. */
const wallpaper = {
  backgroundColor: "var(--chat-bg)",
  backgroundImage:
    "radial-gradient(circle at 20% 30%, var(--chat-doodle) 0 2px, transparent 3px), radial-gradient(circle at 70% 80%, var(--chat-doodle) 0 1.5px, transparent 2.5px), radial-gradient(circle at 90% 20%, var(--chat-doodle) 0 1px, transparent 2px)",
  backgroundSize: "46px 46px, 62px 62px, 38px 38px",
};

/** Server-rendered message; ChatMotion swaps its typing dots for the text as it scrolls in. */
function Bubble({ item }: { item: ChatItem }) {
  return (
    <li data-chat-item className="relative flex flex-col items-start">
      <div data-typing aria-hidden="true" className="absolute left-0 top-0 hidden rounded-xl bg-[var(--chat-in)] px-3.5 py-3">
        <TypingDots />
      </div>
      <div data-msg className={bubbleIn}>
        <BubbleBody item={item} />
      </div>
    </li>
  );
}

export function Reviews() {
  const items: (ChatItem & { key: string })[] = [
    { kind: "hostel", key: "intro", text: hostelIntro },
    ...guestReviews.slice(0, chatInitialCount).map((review) => ({ kind: "guest" as const, key: review.id, review })),
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
            <ChatExpander count={items.length}>
              <ol className="flex flex-col gap-1.5 px-3 py-5 md:px-4" aria-label={`Guest reviews from ${site.rating.source}`}>
                {items.map((item) => (
                  <Bubble key={item.key} item={item} />
                ))}
              </ol>
            </ChatExpander>
            <ChatComposerLazy />
          </div>
        </div>
      </div>
      <ChatMotion />
    </section>
  );
}
