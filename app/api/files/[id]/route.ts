import { getFile } from "@/lib/repo";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-z0-9]+$/.test(id)) return new Response("Not found", { status: 404 });
  const f = await getFile(id);
  if (!f) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(f.data, "base64"), {
    headers: {
      "Content-Type": f.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
