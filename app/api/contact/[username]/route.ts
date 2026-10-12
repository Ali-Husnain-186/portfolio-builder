import { err, ipOf, json, rateLimited } from "@/lib/api";
import { isValidEmail } from "@/lib/auth";
import { addMessage, getPortfolioByUsername } from "@/lib/repo";

export async function POST(req: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  if (rateLimited("contact:" + ipOf(req), 8, 60 * 60e3)) return err("Too many messages, try later.", 429);
  const p = await getPortfolioByUsername(username);
  if (!p || !p.published) return err("Portfolio not found", 404);
  const b = await req.json().catch(() => ({}));
  if (b.company) return json({ ok: true }); // honeypot
  const name = String(b.name || "").trim().slice(0, 80);
  const email = String(b.email || "").trim().slice(0, 120);
  const message = String(b.message || "").trim().slice(0, 3000);
  if (!name || !message) return err("Please fill in your name and message.");
  if (!isValidEmail(email)) return err("Please enter a valid email.");
  await addMessage(p.userId, { name, email, message });
  return json({ ok: true });
}
