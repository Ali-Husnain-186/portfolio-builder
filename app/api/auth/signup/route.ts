import { createSession, hashPassword, isValidEmail, isAdminEmail } from "@/lib/auth";
import { err, ipOf, json, rateLimited } from "@/lib/api";
import { createPortfolioFor, getUserByEmail, saveUser, usernameOwner } from "@/lib/repo";
import { ensureSeeded } from "@/lib/seed";
import { normalizeUsername, validateUsername } from "@/lib/username";
import { TEMPLATES, uid } from "@/lib/design";
import { savePortfolio } from "@/lib/repo";
import type { User } from "@/lib/types";

export async function POST(req: Request) {
  await ensureSeeded();
  if (rateLimited("signup:" + ipOf(req), 10, 60 * 60e3)) return err("Too many sign-ups. Try again later.", 429);
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim().slice(0, 80);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 120);
  const password = String(body.password || "");
  const username = normalizeUsername(String(body.username || ""));
  if (!name) return err("Please enter your name.");
  if (!isValidEmail(email)) return err("Please enter a valid email.");
  if (password.length < 8) return err("Password must be at least 8 characters.");
  if (username) {
    const v = validateUsername(username);
    if (v) return err(v);
    if (await usernameOwner(username)) return err("That username is taken.");
  }
  if (await getUserByEmail(email)) return err("An account with this email already exists. Try logging in.", 409);
  const user: User = {
    id: uid() + uid(),
    email,
    name,
    passwordHash: await hashPassword(password),
    role: isAdminEmail(email) ? "admin" : "user",
    createdAt: new Date().toISOString(),
  };
  await saveUser(user);
  const p = await createPortfolioFor(user, username || undefined);
  const t = TEMPLATES.find((x) => x.id === body.template);
  if (t) {
    p.design = { ...p.design, template: t.id, ...t.defaults };
    await savePortfolio(p);
  }
  await createSession(user.id);
  return json({ ok: true, username: p.username });
}
