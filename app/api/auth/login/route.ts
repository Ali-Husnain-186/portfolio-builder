import { createSession, verifyPassword } from "@/lib/auth";
import { err, ipOf, json, rateLimited } from "@/lib/api";
import { getUserByEmail } from "@/lib/repo";
import { ensureSeeded } from "@/lib/seed";

export async function POST(req: Request) {
  await ensureSeeded();
  if (rateLimited("login:" + ipOf(req), 20, 15 * 60e3)) return err("Too many attempts. Wait a few minutes.", 429);
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const user = await getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) return err("Wrong email or password.", 401);
  if (user.disabled) return err("This account has been disabled.", 403);
  await createSession(user.id);
  return json({ ok: true });
}
