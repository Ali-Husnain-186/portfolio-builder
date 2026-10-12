import { err, json, rateLimited, requireUser } from "@/lib/api";
import { saveFile } from "@/lib/repo";

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"];

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return err("Not signed in", 401);
  if (rateLimited("upload:" + user.id, 60, 60 * 60e3)) return err("Upload limit reached, try later.", 429);
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return err("No file");
  if (!ALLOWED.includes(file.type)) return err("Only images (PNG, JPG, WEBP, GIF) or PDF are allowed.");
  if (file.size > 3 * 1024 * 1024) return err("File too large (max 3 MB).");
  const data = Buffer.from(await file.arrayBuffer()).toString("base64");
  const id = await saveFile(user.id, file.type, data);
  return json({ url: `/api/files/${id}` });
}
