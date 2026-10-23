"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { botName, chatInitialCount, guestReviews, liveAnnouncements } from "@/content/reviews";
import { replyTo, type Reply } from "@/lib/chat-replies";
import { formatPartyDate, nextPartyNights } from "@/lib/moon";
import { getLenis, prefersReducedMotion } from "@/lib/motion";
import { BubbleBody, TypingDots, bubbleIn, chatFont, type ChatItem } from "./bubble";

/**
 * The live part of the group chat — all local to this browser, nothing is sent anywhere:
 *  - "live" messages drop in at random intervals while the chat is on screen: the real reviews
 *    not shown in the HTML, mixed with hostel announcements (never invented guest messages);
 *  - the visitor can type; Moon bot answers from /content. Their thread is kept in localStorage.
 */
type Msg = { id: string; time: string } & (
  | { from: "me"; text: string }
  | { from: "bot"; text: string; cta?: Reply["cta"] }
  | { from: "live"; item: ChatItem }
);

const KEY = "k-chat";
const MAX_LEN = 280;
const MAX_KEPT = 30;
const FIRST_DELAY: [number, number] = [1500, 3500];
const NEXT_DELAY: [number, number] = [4500, 11000];

const clock = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
const rand = ([min, max]: [number, number]) => min + Math.random() * (max - min);
const uid = () => crypto.randomUUID();

function load(): Msg[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.slice(-MAX_KEPT) : [];
  } catch {
    return [];
  }
}
/** Only the visitor's own conversation is remembered; live drops replay fresh each visit. */
function persist(msgs: Msg[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(msgs.filter((m) => m.from !== "live").slice(-MAX_KEPT)));
  } catch {
    /* private mode: the chat still works for this visit */
  }
}

/** Remaining real reviews + announcements, shuffled — but alternating so it feels like a group. */
function buildLivePool(): ChatItem[] {
  const shuffle = <T,>(a: T[]) => a.map((v) => [Math.random(), v] as const).sort((x, y) => x[0] - y[0]).map(([, v]) => v);
  const next = formatPartyDate(nextPartyNights(new Date(), 1)[0], { year: undefined });
  const reviews: ChatItem[] = shuffle(guestReviews.slice(chatInitialCount)).map((review) => ({ kind: "guest", review }));
  const notes: ChatItem[] = shuffle(liveAnnouncements).map((t) => ({ kind: "hostel", text: t.replace("{nextFullMoon}", next) }));
  const pool: ChatItem[] = [];
  while (reviews.length || notes.length) {
    if (reviews.length) pool.push(reviews.shift()!);
    if (notes.length) pool.push(notes.shift()!);
  }
  return pool;
}

export function ChatComposer() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [liveTyping, setLiveTyping] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [announce, setAnnounce] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const listEnd = useRef<HTMLLIElement>(null);
  const userActed = useRef(false);
  const busy = useRef(false); // visitor typing / bot answering → live drops wait
  const pool = useRef<ChatItem[] | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const anchorTop = useRef<number | null>(null);

  /** Call right before content is inserted above the input: the page will be shifted so the input stays put. */
  const holdInput = () => {
    if (form.current) anchorTop.current = form.current.getBoundingClientRect().top;
  };

  useEffect(() => {
    busy.current = botTyping || draft.length > 0;
  }, [botTyping, draft]);

  useEffect(() => {
    // restore after mount (the server can't know this browser's history)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
    setMsgs(load());
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "0px 0px -15% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Chat-style growth: new bubbles push older ones UP instead of pushing the input (and the footer)
  // down under the visitor's eyes. Done by hand because Safari has no CSS scroll anchoring.
  useLayoutEffect(() => {
    if (anchorTop.current === null || !form.current) return;
    const delta = form.current.getBoundingClientRect().top - anchorTop.current;
    anchorTop.current = null;
    if (Math.abs(delta) < 1) return;
    window.scrollBy(0, delta);
    getLenis()?.scrollTo(window.scrollY, { immediate: true, force: true });
  }, [msgs.length, liveTyping]);

  // Writing to storage where messages are added (not in an effect) means a restore can never be
  // overwritten by the initial empty state — including under StrictMode's double effects.
  const append = (msg: Msg) =>
    setMsgs((m) => {
      const next = [...m, msg];
      persist(next);
      return next;
    });

  // Live drops: random rhythm, only while the chat is visible and the tab is in the foreground.
  useEffect(() => {
    if (!onScreen) return;
    pool.current ??= buildLivePool();
    const typingFor = prefersReducedMotion() ? 0 : 1200;
    let timer: ReturnType<typeof setTimeout>;
    let first = true;
    const schedule = () => {
      if (!pool.current?.length) return;
      timer = setTimeout(tick, rand(first ? FIRST_DELAY : NEXT_DELAY));
      first = false;
    };
    const tick = () => {
      if (document.hidden || busy.current) return schedule();
      holdInput();
      setLiveTyping(true);
      timer = setTimeout(() => {
        holdInput();
        setLiveTyping(false);
        const item = pool.current?.shift();
        if (item) append({ id: uid(), time: clock(), from: "live", item });
        schedule();
      }, typingFor + Math.random() * 900);
    };
    schedule();
    return () => {
      clearTimeout(timer);
      setLiveTyping(false);
    };
  }, [onScreen]);

  useEffect(() => {
    // follow the conversation only when the visitor is in it and looking at it — never yank the page
    if (!userActed.current || !onScreen) return;
    listEnd.current?.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [msgs.length, botTyping, onScreen]);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim().slice(0, MAX_LEN);
    if (!text || botTyping) return;
    setDraft("");
    userActed.current = true;
    append({ id: uid(), from: "me", text, time: clock() });
    setBotTyping(true);
    const reply = replyTo(text);
    setTimeout(
      () => {
        setBotTyping(false);
        append({ id: uid(), from: "bot", time: clock(), ...reply });
        setAnnounce(`${botName}: ${reply.text}`); // screen readers hear replies, not the ambient drops
      },
      prefersReducedMotion() ? 250 : 900 + Math.min(text.length * 12, 900),
    );
  };

  return (
    <div ref={root} className="[overflow-anchor:none]">
      <ol className="flex flex-col gap-1.5 px-3 pb-4 md:px-4" aria-label="Live chat">
        {msgs.map((m) => (
          <li key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            {m.from === "live" ? (
              <div className={`${bubbleIn} animate-[pop_.35s_cubic-bezier(.34,1.56,.64,1)]`}>
                <BubbleBody item={m.item} time={m.time} />
              </div>
            ) : (
              <div
                className={`max-w-[85%] rounded-xl px-3 pb-1.5 pt-2 text-[0.92rem] leading-snug shadow-sm ${chatFont} ${
                  m.from === "me" ? "rounded-tr-sm bg-[var(--chat-out)]" : "rounded-tl-sm bg-[var(--chat-in)]"
                }`}
              >
                {m.from === "bot" ? <p className="text-[0.8rem] font-bold text-[#b69bff] in-data-[theme=day]:text-[#6d28d9]">{botName}</p> : null}
                <p className="whitespace-pre-wrap break-words">
                  {m.text}
                  <span className="float-right ml-3 mt-1.5 text-[0.66rem]" style={{ color: "var(--chat-meta)" }}>
                    {m.time}
                    {m.from === "me" ? <span className="ml-1 text-[#53bdeb]">✓✓</span> : null}
                  </span>
                </p>
                {m.from === "bot" && m.cta ? (
                  <a
                    href={m.cta.href}
                    target={m.cta.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener"
                    className="mt-2 flex min-h-10 items-center justify-center rounded-lg border-t border-[var(--chat-meta)]/30 text-sm font-semibold text-[#53bdeb]"
                  >
                    {m.cta.label}
                  </a>
                ) : null}
              </div>
            )}
          </li>
        ))}
        {botTyping || liveTyping ? (
          <li className="flex justify-start" aria-hidden="true">
            <div className="rounded-xl bg-[var(--chat-in)] px-3.5 py-3">
              <TypingDots />
            </div>
          </li>
        ) : null}
        <li ref={listEnd} aria-hidden="true" />
      </ol>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>

      <form ref={form} onSubmit={send} className="flex items-center gap-2 bg-[var(--chat-in)] px-3 py-2.5">
        <label htmlFor="chat-input" className="sr-only">
          Message the group
        </label>
        <input
          id="chat-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={MAX_LEN}
          autoComplete="off"
          enterKeyHint="send"
          placeholder="Say hi to the fam…"
          // 16px+ font: stops iOS Safari zooming the page on focus
          className={`min-h-11 min-w-0 flex-1 rounded-full bg-[var(--chat-bg)] px-4 text-base outline-none ${chatFont} placeholder:text-[var(--chat-meta)] focus-visible:ring-2 focus-visible:ring-[#00a884]`}
          style={{ color: "var(--chat-ink)" }}
        />
        <button
          type="submit"
          disabled={!draft.trim() || botTyping}
          aria-label="Send"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-[#008069] text-white transition-opacity disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
            <path d="M3.4 20.4 21 12 3.4 3.6l-.01 6.53L15 12 3.39 13.87z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
