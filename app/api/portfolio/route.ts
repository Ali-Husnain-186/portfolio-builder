import { err, json, requireUser } from "@/lib/api";
import { createPortfolioFor, deletePortfolio, getPortfolio, savePortfolio, usernameOwner } from "@/lib/repo";
import { sanitizePortfolio } from "@/lib/sanitize";
import { normalizeUsername, validateUsername } from "@/lib/username";

export async function GET() {
  const user = await requireUser();
  if (!user) return err("Not signed in", 401);
  const p = (await getPortfolio(user.id)) ?? (await createPortfolioFor(user));
  return json({ portfolio: p });
}

export async function PUT(req: Request) {
  const user = await requireUser();
  if (!user) return err("Not signed in", 401);
  const body = await req.json().catch(() => null);
  if (!body?.portfolio) return err("Missing portfolio");
  const base = (await getPortfolio(user.id)) ?? (await createPortfolioFor(user));
  const next = sanitizePortfolio(body.portfolio, base);
  const wanted = normalizeUsername(String(body.portfolio.username ?? base.username));
  const prev = base.username;
  if (wanted !== prev) {
    const v = validateUsername(wanted);
    if (v) return err(v);
    const owner = await usernameOwner(wanted);
    if (owner && owner !== user.id) return err("That username is taken.", 409);
    next.username = wanted;
  }
  await savePortfolio(next, prev);
  return json({ portfolio: next });
}

/** Reset: delete the portfolio content and start fresh (account remains). */
export async function DELETE() {
  const user = await requireUser();
  if (!user) return err("Not signed in", 401);
  await deletePortfolio(user.id);
  const fresh = await createPortfolioFor(user);
  return json({ portfolio: fresh });
}
