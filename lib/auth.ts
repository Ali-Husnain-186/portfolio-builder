import "server-only";
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { cookies } from "next/headers";
import { kv } from "./db";
import { getUser } from "./repo";
import { ensureSeeded } from "./seed";
import type { User } from "./types";

const scrypt = promisify(_scrypt) as (pw: string, salt: string, len: number) => Promise<Buffer>;
export const SESSION_COOKIE = "fl_session";
const SESSION_DAYS = 30;

export async function hashPassword(pw: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(pw, salt, 64);
  return `scrypt$${salt}$${hash.toString("hex")}`;
}

export async function verifyPassword(pw: string, stored: string) {
  const [, salt, hex] = stored.split("$");
  if (!salt || !hex) return false;
  const hash = await scrypt(pw, salt, 64);
  const expected = Buffer.from(hex, "hex");
  return expected.length === hash.length && timingSafeEqual(expected, hash);
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expires = Date.now() + SESSION_DAYS * 864e5;
  await kv.set(`sessions/${token}`, { userId, expires });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await kv.del(`sessions/${token}`);
  jar.delete(SESSION_COOKIE);
}

export async function destroyAllSessions(userId: string, keepToken?: string) {
  for (const k of await kv.list("sessions/")) {
    if (keepToken && k === `sessions/${keepToken}`) continue;
    const s = await kv.get<{ userId: string }>(k);
    if (s?.userId === userId) await kv.del(k);
  }
}

export async function currentToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  await ensureSeeded();
  const token = await currentToken();
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const s = await kv.get<{ userId: string; expires: number }>(`sessions/${token}`);
  if (!s || s.expires < Date.now()) return null;
  const u = await getUser(s.userId);
  if (!u || u.disabled) return null;
  return isAdminEmail(u.email) && u.role !== "admin" ? { ...u, role: "admin" } : u;
}

export function isAdminEmail(email: string) {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}

export const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

/** For server pages: returns the user or redirects to /login. */
export async function requirePageUser(): Promise<User> {
  const u = await getCurrentUser();
  if (!u) {
    const { redirect } = await import("next/navigation");
    redirect("/login");
  }
  return u!;
}
