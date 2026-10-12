import { kv, driverName } from "@/lib/db";

export const dynamic = "force-dynamic";

const withTimeout = <T,>(p: Promise<T>, ms: number) =>
  Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error(`timeout ${ms}ms`)), ms))]);

export async function GET() {
  const out: Record<string, unknown> = {
    driver: driverName,
    env: ["NETLIFY", "NETLIFY_BLOBS_CONTEXT", "SITE_ID", "DEPLOY_ID", "CONTEXT", "DATABASE_URL", "DB_DRIVER"].filter((k) => !!process.env[k]),
  };
  const t0 = Date.now();
  try {
    await withTimeout(kv.set("meta/health", { at: new Date().toISOString() }), 8000);
    out.set = `ok ${Date.now() - t0}ms`;
    const t1 = Date.now();
    out.get = (await withTimeout(kv.get("meta/health"), 8000)) ? `ok ${Date.now() - t1}ms` : "null";
    out.seeded = !!(await withTimeout(kv.get("meta/seeded"), 8000));
  } catch (e) {
    out.error = String((e as Error).message || e);
  }
  return Response.json(out);
}
