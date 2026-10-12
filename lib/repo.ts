import "server-only";
import { kv } from "./db";
import { emptyPortfolio, uid } from "./design";
import type { Message, Portfolio, PublicUser, User } from "./types";
import { normalizeUsername, validateUsername } from "./username";

/*
 * Key layout
 *   users/<id>              User
 *   emails/<email>          { id }
 *   portfolios/<userId>     Portfolio
 *   usernames/<username>    { userId }
 *   inbox/<userId>          Message[]
 *   files/<fileId>          { mime, data(base64), userId }
 *   sessions/<token>        { userId, expires }
 *   meta/seeded             { at }
 */

export const toPublic = (u: User): PublicUser => {
  const { passwordHash, ...rest } = u;
  void passwordHash;
  return rest;
};

/* ---------- users ---------- */
export async function getUser(id: string) {
  return kv.get<User>(`users/${id}`);
}
export async function getUserByEmail(email: string) {
  const ref = await kv.get<{ id: string }>(`emails/${email.toLowerCase().trim()}`);
  return ref ? getUser(ref.id) : null;
}
export async function saveUser(u: User) {
  await kv.set(`users/${u.id}`, u);
  await kv.set(`emails/${u.email}`, { id: u.id });
}
export async function listUsers(): Promise<User[]> {
  const keys = await kv.list("users/");
  const all = await Promise.all(keys.map((k) => kv.get<User>(k)));
  return (all.filter(Boolean) as User[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function deleteUserCompletely(id: string) {
  const u = await getUser(id);
  if (!u) return;
  await deletePortfolio(id);
  await kv.del(`inbox/${id}`);
  for (const k of await kv.list("files/")) {
    const f = await kv.get<{ userId: string }>(k);
    if (f?.userId === id) await kv.del(k);
  }
  for (const k of await kv.list("sessions/")) {
    const s = await kv.get<{ userId: string }>(k);
    if (s?.userId === id) await kv.del(k);
  }
  await kv.del(`emails/${u.email}`);
  await kv.del(`users/${id}`);
}

/* ---------- usernames ---------- */
export async function usernameOwner(username: string) {
  const r = await kv.get<{ userId: string }>(`usernames/${username}`);
  return r?.userId ?? null;
}
export async function suggestUsername(base: string, forUser?: string) {
  let b = normalizeUsername(base) || "user";
  if (b.length < 3) b = (b + "folio").slice(0, 30);
  const candidates = [b, ...Array.from({ length: 50 }, (_, i) => `${b.slice(0, 27)}${i + 1}`)];
  for (const c of candidates) {
    if (validateUsername(c)) continue;
    const owner = await usernameOwner(c);
    if (!owner || owner === forUser) return c;
  }
  return `${b.slice(0, 20)}${Date.now().toString(36)}`;
}

/* ---------- portfolios ---------- */
export async function getPortfolio(userId: string) {
  return kv.get<Portfolio>(`portfolios/${userId}`);
}
export async function getPortfolioByUsername(username: string) {
  const owner = await usernameOwner(username);
  return owner ? getPortfolio(owner) : null;
}
export async function createPortfolioFor(user: User, username?: string) {
  const existing = await getPortfolio(user.id);
  if (existing) return existing;
  const un = await suggestUsername(username || user.name || user.email.split("@")[0], user.id);
  const p = emptyPortfolio(user.id, un, user.name, user.email);
  await kv.set(`usernames/${un}`, { userId: user.id });
  await kv.set(`portfolios/${user.id}`, p);
  return p;
}
export async function savePortfolio(p: Portfolio, previousUsername?: string) {
  if (previousUsername && previousUsername !== p.username) {
    await kv.set(`usernames/${p.username}`, { userId: p.userId });
    await kv.del(`usernames/${previousUsername}`);
  }
  p.updatedAt = new Date().toISOString();
  await kv.set(`portfolios/${p.userId}`, p);
}
export async function deletePortfolio(userId: string) {
  const p = await getPortfolio(userId);
  if (p) await kv.del(`usernames/${p.username}`);
  await kv.del(`portfolios/${userId}`);
}
export async function listPortfolios(): Promise<Portfolio[]> {
  const keys = await kv.list("portfolios/");
  const all = await Promise.all(keys.map((k) => kv.get<Portfolio>(k)));
  return all.filter(Boolean) as Portfolio[];
}
export async function incrementViews(userId: string) {
  const p = await getPortfolio(userId);
  if (!p) return;
  p.views = (p.views || 0) + 1;
  await kv.set(`portfolios/${userId}`, p);
}

/* ---------- inbox ---------- */
export async function getInbox(userId: string) {
  return (await kv.get<Message[]>(`inbox/${userId}`)) ?? [];
}
export async function setInbox(userId: string, msgs: Message[]) {
  await kv.set(`inbox/${userId}`, msgs);
}
export async function addMessage(userId: string, m: Omit<Message, "id" | "createdAt" | "read">) {
  const msgs = await getInbox(userId);
  msgs.unshift({ ...m, id: uid(), createdAt: new Date().toISOString(), read: false });
  await setInbox(userId, msgs.slice(0, 500));
}

/* ---------- files ---------- */
export async function saveFile(userId: string, mime: string, data: string) {
  const id = uid() + uid();
  await kv.set(`files/${id}`, { mime, data, userId });
  return id;
}
export async function getFile(id: string) {
  return kv.get<{ mime: string; data: string; userId: string }>(`files/${id}`);
}
