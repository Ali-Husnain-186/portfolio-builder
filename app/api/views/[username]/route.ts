import { ipOf, json, rateLimited } from "@/lib/api";
import { incrementViews, usernameOwner } from "@/lib/repo";

export async function POST(req: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  if (rateLimited(`view:${ipOf(req)}:${username}`, 1, 30 * 60e3)) return json({ ok: true });
  const owner = await usernameOwner(username);
  if (owner) await incrementViews(owner);
  return json({ ok: true });
}
