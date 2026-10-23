import { chat, chatSubtitle, chatTitle } from "@/content/reviews";
import { site } from "@/content/config";
import { SectionHeading } from "../section-heading";
import { ChatMotion } from "./chat-motion";

/** Deterministic name colours, like WhatsApp groups — [on dark bubble, on light bubble], all ≥4.5:1. */
const NAME_COLORS = [
  ["#ff7ac6", "#c2185b"],
  ["#7ee0ff", "#0b6b9a"],
  ["#c8ff1a", "#4d7c0f"],
  ["#ffb35c", "#b45309"],
  ["#b69bff", "#6d28d9"],
  ["#5cffb0", "#047857"],
];
const colorFor = (name: string) => NAME_COLORS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % NAME_COLORS.length];

/** WhatsApp-ish doodle wallpaper, pure CSS. */
const wallpaper = {
  backgroundColor: "var(--chat-bg)",
  backgroundImage:
    "radial-gradient(circle at 20% 30%, var(--chat-doodle) 0 2px, transparent 3px), radial-gradient(circle at 70% 80%, var(--chat-doodle) 0 1.5px, transparent 2.5px), radial-gradient(circle at 90% 20%, var(--chat-doodle) 0 1px, transparent 2px)",
  backgroundSize: "46px 46px, 62px 62px, 38px 38px",
};

export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative py-24 md:py-32">
      <div className="md:grid md:grid-cols-[1fr_minmax(0,30rem)] md:items-start md:gap-12 md:pr-12">
        <div className="md:sticky md:top-32">
          <SectionHeading index="05" label="Reviews" id="reviews-title" aside="(we didn’t pay them. we did feed them)">
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
              on {site.rating.source} ↗
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
              <p className="truncate [font-family:system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] text-[0.95rem] font-bold">{chatTitle}</p>
              <p className="truncate text-xs" style={{ color: "var(--chat-meta)" }}>
                {chatSubtitle}
              </p>
            </div>
          </div>

          <ol className="flex flex-col gap-1.5 px-3 py-5 md:px-4" style={wallpaper} aria-label="Guest messages">
            {chat.map((m, i) => (
              <li key={i} data-chat-item className={`relative flex flex-col ${m.isHostel ? "items-end" : "items-start"}`}>
                <div
                  data-typing
                  aria-hidden="true"
                  className={`absolute top-0 hidden rounded-xl bg-[var(--chat-in)] px-3.5 py-3 ${m.isHostel ? "right-0" : "left-0"}`}
                >
                  <span className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="typing-dot size-1.5 rounded-full"
                        style={{ background: "var(--chat-meta)", animationDelay: `${d * 0.15}s` }}
                      />
                    ))}
                  </span>
                </div>
                <div
                  data-msg
                  className={`max-w-[85%] rounded-xl px-3 pb-1.5 pt-2 [font-family:system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] text-[0.92rem] leading-snug shadow-sm ${
                    m.isHostel ? "rounded-tr-sm bg-[var(--chat-out)]" : "rounded-tl-sm bg-[var(--chat-in)]"
                  }`}
                >
                  {!m.isHostel ? (
                    <p
                      className="text-[0.8rem] font-bold text-[var(--n-dark)] in-data-[theme=day]:text-[var(--n-light)]"
                      style={{ "--n-dark": colorFor(m.from)[0], "--n-light": colorFor(m.from)[1] } as React.CSSProperties}
                    >
                      ~ {m.from} {m.country}
                    </p>
                  ) : null}
                  <p>
                    {m.text}
                    <span className="float-right ml-3 mt-1.5 text-[0.66rem]" style={{ color: "var(--chat-meta)" }}>
                      {m.time}
                      {m.isHostel ? <span className="ml-1 text-[#53bdeb]">✓✓</span> : null}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex items-center gap-2 bg-[var(--chat-in)] px-3 py-2.5">
            <span className="flex-1 truncate rounded-full bg-[var(--chat-bg)] px-4 py-2.5 text-sm" style={{ color: "var(--chat-meta)" }}>
              Message the fam…
            </span>
            <a
              href={site.bookingUrl}
              className="display grid h-10 shrink-0 place-items-center rounded-full bg-[#008069] px-4 text-xs text-white"
            >
              Join →
            </a>
          </div>
        </div>
      </div>
      <ChatMotion />
    </section>
  );
}
