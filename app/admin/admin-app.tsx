"use client";

import { useEffect, useState, useTransition } from "react";
import type { EventItem } from "@/content/events";
import { loadLineup, login, logout, saveLineup } from "./actions";

type Photo = { slug: string; src: string };

const DAY_OPTIONS: { value: EventItem["day"]; label: string }[] = [
  { value: "DAILY", label: "Every day" },
  { value: "MON", label: "Monday" },
  { value: "TUE", label: "Tuesday" },
  { value: "WED", label: "Wednesday" },
  { value: "THU", label: "Thursday" },
  { value: "FRI", label: "Friday" },
  { value: "SAT", label: "Saturday" },
  { value: "SUN", label: "Sunday" },
  { value: "MONTHLY", label: "Full moon (shows next date)" },
];

const field =
  "mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2.5 font-mono text-sm text-ink outline-none focus:border-accent";
const smallBtn = "label rounded-full border border-line px-3 py-2 text-[0.62rem] text-ink-dim hover:text-ink disabled:opacity-30";

export function AdminApp({ photos }: { photos: Photo[] }) {
  const [state, setState] = useState<"loading" | "login" | "edit">("loading");
  const [items, setItems] = useState<EventItem[]>([]);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const refresh = () =>
    loadLineup().then((res) => {
      if (res.ok) {
        setItems(res.data);
        setState("edit");
      } else {
        setState(res.authed ? "edit" : "login");
        if (res.authed) setMessage({ tone: "error", text: res.error });
      }
    });

  useEffect(() => {
    refresh();
  }, []);

  // don't lose unsaved edits to a stray tab close
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (i: number, patch: Partial<EventItem>) => {
    setItems((list) => list.map((e, j) => (j === i ? { ...e, ...patch } : e)));
    setDirty(true);
    setMessage(null);
  };
  const move = (i: number, by: number) => {
    setItems((list) => {
      const next = [...list];
      [next[i], next[i + by]] = [next[i + by], next[i]];
      return next;
    });
    setDirty(true);
  };
  const remove = (i: number) => {
    if (!confirm(`Delete "${items[i].title || "this event"}"?`)) return;
    setItems((list) => list.filter((_, j) => j !== i));
    setDirty(true);
  };
  const add = () => {
    setItems((list) => [...list, { day: "MON", time: "20:00", title: "", blurb: "", vibe: "night" }]);
    setDirty(true);
  };

  const save = () =>
    startTransition(async () => {
      const res = await saveLineup(items);
      if (res.ok) {
        setItems(res.data);
        setDirty(false);
        setMessage({ tone: "ok", text: "Saved — it's live on the site." });
      } else {
        setMessage({ tone: "error", text: res.error });
        if (res.error.includes("log in")) setState("login");
      }
    });

  if (state === "loading") return <p className="label mt-10 text-ink-dim">Loading…</p>;

  if (state === "login") {
    return (
      <form
        className="mt-10 rounded-2xl border border-line bg-bg-2 p-5"
        action={(fd) =>
          startTransition(async () => {
            const res = await login(String(fd.get("password") ?? ""));
            if (res.ok) {
              setMessage(null);
              await refresh();
            } else setMessage({ tone: "error", text: res.error });
          })
        }
      >
        <label className="label text-ink-dim">
          Password
          <input name="password" type="password" autoComplete="current-password" required autoFocus className={field} />
        </label>
        {message ? <p className="mt-3 font-mono text-sm text-accent-2">{message.text}</p> : null}
        <button type="submit" disabled={pending} className="cta mt-5">
          {pending ? "Checking…" : "Log in"}
        </button>
      </form>
    );
  }

  return (
    <>
      <p className="serif-accent mt-2 text-xl text-ink-dim">Edit, reorder, hit save. Top of the list shows first.</p>

      <ol className="mt-8 space-y-4">
        {items.map((e, i) => {
          const photo = photos.find((p) => p.slug === e.photo);
          return (
            <li key={i} className="rounded-2xl border border-line bg-bg-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="label text-accent">#{i + 1}</span>
                <div className="flex gap-1.5">
                  <button type="button" className={smallBtn} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                    ↑
                  </button>
                  <button
                    type="button"
                    className={smallBtn}
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button type="button" className={`${smallBtn} hover:!text-accent-2`} onClick={() => remove(i)}>
                    Delete
                  </button>
                </div>
              </div>

              <label className="label mt-3 block text-ink-dim">
                Title
                <input className={field} value={e.title} maxLength={120} onChange={(ev) => update(i, { title: ev.target.value })} />
              </label>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="label block text-ink-dim">
                  Day
                  <select
                    className={field}
                    value={e.day}
                    onChange={(ev) => update(i, { day: ev.target.value as EventItem["day"] })}
                  >
                    {DAY_OPTIONS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="label block text-ink-dim">
                  Time
                  <input
                    className={field}
                    value={e.time}
                    maxLength={40}
                    placeholder="21:00"
                    onChange={(ev) => update(i, { time: ev.target.value })}
                  />
                </label>
              </div>

              <label className="label mt-3 block text-ink-dim">
                Description
                <textarea
                  className={`${field} min-h-20 resize-y`}
                  value={e.blurb}
                  maxLength={400}
                  onChange={(ev) => update(i, { blurb: ev.target.value })}
                />
              </label>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="label block text-ink-dim">
                  Vibe
                  <select
                    className={field}
                    value={e.vibe}
                    onChange={(ev) => update(i, { vibe: ev.target.value as EventItem["vibe"] })}
                  >
                    <option value="day">Day</option>
                    <option value="night">Night</option>
                  </select>
                </label>
                <label className="label flex items-center gap-2 self-end pb-3 text-ink">
                  <input
                    type="checkbox"
                    className="size-5 accent-[var(--accent)]"
                    checked={!!e.free}
                    onChange={(ev) => update(i, { free: ev.target.checked })}
                  />
                  Free
                </label>
              </div>

              <div className="mt-3 flex items-end gap-3">
                <label className="label block flex-1 text-ink-dim">
                  Photo
                  <select
                    className={field}
                    value={e.photo ?? ""}
                    onChange={(ev) => update(i, { photo: (ev.target.value || undefined) as EventItem["photo"] })}
                  >
                    <option value="">No photo</option>
                    {photos.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.slug}
                      </option>
                    ))}
                  </select>
                </label>
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- tiny admin preview, no need for the image pipeline
                  <img src={photo.src} alt="" className="aspect-[4/3] w-20 rounded-md object-cover" />
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <button type="button" onClick={add} className={`${smallBtn} mt-4 w-full py-3 text-[0.7rem]`}>
        + Add event
      </button>

      {/* sticky save bar — reachable with a thumb on a phone */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <p
            role="status"
            className={`font-mono text-xs ${message?.tone === "error" ? "text-accent-2" : message ? "text-accent" : "text-ink-dim"}`}
          >
            {message?.text ?? (dirty ? "Unsaved changes" : "All saved")}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className={smallBtn}
              onClick={() =>
                startTransition(async () => {
                  await logout();
                  setState("login");
                })
              }
            >
              Log out
            </button>
            <button type="button" onClick={save} disabled={pending || !dirty} className="cta disabled:opacity-40">
              {pending ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
