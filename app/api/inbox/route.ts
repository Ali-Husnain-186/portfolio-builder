import { err, json, requireUser } from "@/lib/api";
import { getInbox, setInbox } from "@/lib/repo";

export async function GET() {
  const user = await requireUser();
  if (!user) return err("Not signed in", 401);
  return json({ messages: await getInbox(user.id) });
}

export async function PATCH(req: Request) {
  const user = await requireUser();
  if (!user) return err("Not signed in", 401);
  const { id, read, all } = await req.json().catch(() => ({}));
  const msgs = await getInbox(user.id);
  for (const m of msgs) if (all || m.id === id) m.read = read !== false;
  await setInbox(user.id, msgs);
  return json({ messages: msgs });
}

export async function DELETE(req: Request) {
  const user = await requireUser();
  if (!user) return err("Not signed in", 401);
  const id = new URL(req.url).searchParams.get("id");
  const msgs = (await getInbox(user.id)).filter((m) => m.id !== id);
  await setInbox(user.id, msgs);
  return json({ messages: msgs });
}
