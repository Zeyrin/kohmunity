"use server";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { lineup as fallbackLineup, type EventItem } from "@/content/events";
import { LINEUP_TAG, readStoredLineup, sanitizeLineup, writeStoredLineup } from "@/lib/lineup";

/**
 * Admin auth: one shared password (ADMIN_PASSWORD env var). A successful login sets an httpOnly cookie
 * holding an expiry + HMAC of it keyed by the password, so changing the password logs everyone out.
 * Every action re-checks the cookie — the /admin page itself is static and holds no data.
 */
const COOKIE = "k_admin";
const SESSION_DAYS = 30;

type Result<T = null> = { ok: true; data: T } | { ok: false; error: string };

function sign(value: string, password: string) {
  return createHmac("sha256", password).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

async function isAuthed() {
  const password = process.env.ADMIN_PASSWORD;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!password || !token) return false;
  const [exp, mac] = token.split(".");
  return Number(exp) > Date.now() && !!mac && safeEqual(mac, sign(exp, password));
}

export async function login(password: string): Promise<Result> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return { ok: false, error: "ADMIN_PASSWORD is not set on the server." };
  if (typeof password !== "string" || !safeEqual(password, expected)) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return { ok: false, error: "Wrong password." };
  }
  const exp = String(Date.now() + SESSION_DAYS * 864e5);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp, expected)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
  return { ok: true, data: null };
}

export async function logout(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function loadLineup(): Promise<Result<EventItem[]> & { authed: boolean }> {
  if (!(await isAuthed())) return { ok: false, error: "Not logged in.", authed: false };
  try {
    return { ok: true, data: (await readStoredLineup()) ?? fallbackLineup, authed: true };
  } catch (err) {
    return { ok: false, error: String(err instanceof Error ? err.message : err), authed: true };
  }
}

export async function saveLineup(items: EventItem[]): Promise<Result<EventItem[]>> {
  if (!(await isAuthed())) return { ok: false, error: "Your session expired — log in again." };
  const clean = sanitizeLineup(items);
  if (!clean.length) return { ok: false, error: "Add at least one event with a title." };
  try {
    await writeStoredLineup(clean);
  } catch (err) {
    return { ok: false, error: String(err instanceof Error ? err.message : err) };
  }
  updateTag(LINEUP_TAG);
  return { ok: true, data: clean };
}
