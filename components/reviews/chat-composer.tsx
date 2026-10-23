"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { botName } from "@/content/reviews";
import { replyTo, type Reply } from "@/lib/chat-replies";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * The bit of the group chat visitors can actually type into. Their messages + Moon bot replies
 * live in this browser only (localStorage) — nothing is sent anywhere, so there's no spam or
 * moderation surface. To make it a shared wall, swap `persist`/`load` for an API call.
 */
type Msg = { id: string; from: "me" | "bot"; text: string; time: string; cta?: Reply["cta"] };

const KEY = "k-chat";
const MAX_LEN = 280;
const MAX_KEPT = 30;

const clock = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

function load(): Msg[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.slice(-MAX_KEPT) : [];
  } catch {
    return [];
  }
}
function persist(msgs: Msg[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(msgs.slice(-MAX_KEPT)));
  } catch {
    /* private mode: the chat still works for this visit */
  }
}

export function ChatComposer() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const listEnd = useRef<HTMLLIElement>(null);
  const userActed = useRef(false);

  useEffect(() => {
    // restore after mount (the server can't know this browser's history)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
    setMsgs(load());
  }, []);

  // Storage is written where messages are added (not in an effect), so a restore can never be
  // overwritten by the initial empty state — including under StrictMode's double effects.
  const append = (msg: Msg) =>
    setMsgs((m) => {
      const next = [...m, msg];
      persist(next);
      return next;
    });

  useEffect(() => {
    // follow the conversation only once the visitor is in it — never jump the page on load
    if (!userActed.current) return;
    listEnd.current?.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [msgs.length, typing]);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim().slice(0, MAX_LEN);
    if (!text || typing) return;
    setDraft("");
    userActed.current = true;
    append({ id: crypto.randomUUID(), from: "me", text, time: clock() });
    setTyping(true);
    const reply = replyTo(text);
    setTimeout(
      () => {
        setTyping(false);
        append({ id: crypto.randomUUID(), from: "bot", time: clock(), ...reply });
      },
      prefersReducedMotion() ? 250 : 900 + Math.min(text.length * 12, 900),
    );
  };

  return (
    <>
      <ol className="flex flex-col gap-1.5 px-3 pb-4 md:px-4" aria-live="polite" aria-label="Your messages">
        {msgs.map((m) => (
          <li key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-xl px-3 pb-1.5 pt-2 text-[0.92rem] leading-snug shadow-sm [font-family:system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] ${
                m.from === "me" ? "rounded-tr-sm bg-[var(--chat-out)]" : "rounded-tl-sm bg-[var(--chat-in)]"
              }`}
            >
              {m.from === "bot" ? (
                <p className="text-[0.8rem] font-bold text-[#b69bff] in-data-[theme=day]:text-[#6d28d9]">{botName}</p>
              ) : null}
              <p className="whitespace-pre-wrap break-words">
                {m.text}
                <span className="float-right ml-3 mt-1.5 text-[0.66rem]" style={{ color: "var(--chat-meta)" }}>
                  {m.time}
                  {m.from === "me" ? <span className="ml-1 text-[#53bdeb]">✓✓</span> : null}
                </span>
              </p>
              {m.cta ? (
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
          </li>
        ))}
        {typing ? (
          <li className="flex justify-start" aria-label={`${botName} is typing`}>
            <div className="rounded-xl bg-[var(--chat-in)] px-3.5 py-3">
              <span className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="typing-dot size-1.5 rounded-full" style={{ background: "var(--chat-meta)", animationDelay: `${d * 0.15}s` }} />
                ))}
              </span>
            </div>
          </li>
        ) : null}
        <li ref={listEnd} aria-hidden="true" />
      </ol>

      <form onSubmit={send} className="flex items-center gap-2 bg-[var(--chat-in)] px-3 py-2.5">
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
          className="min-h-11 min-w-0 flex-1 rounded-full bg-[var(--chat-bg)] px-4 text-base outline-none [font-family:system-ui,-apple-system,'Segoe_UI',Roboto,sans-serif] placeholder:text-[var(--chat-meta)] focus-visible:ring-2 focus-visible:ring-[#00a884]"
          style={{ color: "var(--chat-ink)" }}
        />
        <button
          type="submit"
          disabled={!draft.trim() || typing}
          aria-label="Send"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-[#008069] text-white transition-opacity disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
            <path d="M3.4 20.4 21 12 3.4 3.6l-.01 6.53L15 12 3.39 13.87z" />
          </svg>
        </button>
      </form>
    </>
  );
}
