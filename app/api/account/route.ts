import { err, json, requireUser } from "@/lib/api";
import { currentToken, destroyAllSessions, destroySession, hashPassword, isValidEmail, verifyPassword } from "@/lib/auth";
import { deleteUserCompletely, getUser, getUserByEmail, saveUser, toPublic } from "@/lib/repo";
import { kv } from "@/lib/db";

export async function GET() {
  const user = await requireUser();
  if (!user) return err("Not signed in", 401);
  return json({ user: toPublic(user) });
}

export async function PATCH(req: Request) {
  const me = await requireUser();
  if (!me) return err("Not signed in", 401);
  const user = (await getUser(me.id))!;
  const b = await req.json().catch(() => ({}));
  if (typeof b.name === "string" && b.name.trim()) user.name = b.name.trim().slice(0, 80);
  if (typeof b.email === "string" && b.email.trim().toLowerCase() !== user.email) {
    const email = b.email.trim().toLowerCase();
    if (!isValidEmail(email)) return err("Invalid email.");
    if (await getUserByEmail(email)) return err("That email is already used.", 409);
    if (!(await verifyPassword(String(b.currentPassword || ""), user.passwordHash))) return err("Enter your current password to change email.", 401);
    await kv.del(`emails/${user.email}`);
    user.email = email;
  }
  if (b.newPassword) {
    if (!(await verifyPassword(String(b.currentPassword || ""), user.passwordHash))) return err("Current password is wrong.", 401);
    if (String(b.newPassword).length < 8) return err("New password must be at least 8 characters.");
    user.passwordHash = await hashPassword(String(b.newPassword));
    await destroyAllSessions(user.id, (await currentToken()) ?? undefined);
  }
  await saveUser(user);
  return json({ user: toPublic(user) });
}

export async function DELETE(req: Request) {
  const me = await requireUser();
  if (!me) return err("Not signed in", 401);
  const b = await req.json().catch(() => ({}));
  const user = (await getUser(me.id))!;
  if (!(await verifyPassword(String(b.password || ""), user.passwordHash))) return err("Password is wrong.", 401);
  await destroySession();
  await deleteUserCompletely(user.id);
  return json({ ok: true });
}
