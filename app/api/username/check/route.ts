import { json } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { suggestUsername, usernameOwner } from "@/lib/repo";
import { normalizeUsername, validateUsername } from "@/lib/username";

export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("u") || "";
  const u = normalizeUsername(raw);
  const me = await getCurrentUser();
  const invalid = validateUsername(u);
  if (invalid) return json({ username: u, available: false, error: invalid, suggestion: await suggestUsername(u || "user", me?.id) });
  const owner = await usernameOwner(u);
  const available = !owner || owner === me?.id;
  return json({ username: u, available, suggestion: available ? u : await suggestUsername(u, me?.id) });
}
