import { err, json, requireUser } from "@/lib/api";
import { deleteUserCompletely, getPortfolio, getUser, listUsers, saveUser, savePortfolio, toPublic } from "@/lib/repo";

async function admin() {
  const u = await requireUser();
  return u?.role === "admin" ? u : null;
}

export async function GET() {
  if (!(await admin())) return err("Forbidden", 403);
  const users = await listUsers();
  const rows = await Promise.all(
    users.map(async (u) => {
      const p = await getPortfolio(u.id);
      return { ...toPublic(u), username: p?.username ?? null, published: p?.published ?? false, views: p?.views ?? 0, template: p?.design.template ?? null };
    })
  );
  return json({ users: rows });
}

export async function PATCH(req: Request) {
  const me = await admin();
  if (!me) return err("Forbidden", 403);
  const { id, disabled, role, published } = await req.json().catch(() => ({}));
  const u = await getUser(String(id));
  if (!u) return err("Not found", 404);
  if (u.id === me.id && (disabled || role === "user")) return err("You can't disable or demote yourself.");
  if (typeof disabled === "boolean") u.disabled = disabled;
  if (role === "admin" || role === "user") u.role = role;
  await saveUser(u);
  if (typeof published === "boolean") {
    const p = await getPortfolio(u.id);
    if (p) { p.published = published; await savePortfolio(p); }
  }
  return json({ ok: true });
}

export async function DELETE(req: Request) {
  const me = await admin();
  if (!me) return err("Forbidden", 403);
  const id = new URL(req.url).searchParams.get("id") || "";
  if (id === me.id) return err("You can't delete yourself here.");
  await deleteUserCompletely(id);
  return json({ ok: true });
}
