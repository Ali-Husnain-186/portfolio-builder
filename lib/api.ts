import "server-only";
import { NextResponse } from "next/server";
import { getCurrentUser } from "./auth";

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
export const err = (message: string, status = 400) => NextResponse.json({ error: message }, { status });

export async function requireUser() {
  const user = await getCurrentUser();
  return user;
}

/** Very small in-memory rate limiter (per server instance). */
const hits = new Map<string, number[]>();
export function rateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  return arr.length > max;
}
export const ipOf = (req: Request) =>
  req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
