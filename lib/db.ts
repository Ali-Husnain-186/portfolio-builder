/**
 * Storage layer — a tiny key/value interface with swappable drivers.
 *
 *   DB_DRIVER=blobs     Netlify Blobs (default when running on Netlify, zero config)
 *   DB_DRIVER=postgres  Any Postgres (Supabase, Neon, RDS…) — set DATABASE_URL
 *   DB_DRIVER=file      Local JSON file in .data/ (default for local dev)
 *
 * If DB_DRIVER is not set: DATABASE_URL → postgres, Netlify runtime → blobs, else file.
 * Every feature of the app only talks to this interface, so moving to another
 * database later means adding one driver here — nothing else changes.
 */
import "server-only";

export interface KV {
  get<T = unknown>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
  list(prefix: string): Promise<string[]>;
}

/* ---------------- File driver (local dev) ---------------- */
function fileDriver(): KV {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("fs") as typeof import("fs");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path") as typeof import("path");
  const dir = path.join(process.cwd(), ".data");
  const file = path.join(dir, "kv.json");
  const load = (): Record<string, unknown> => {
    try {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      return {};
    }
  };
  const save = (data: Record<string, unknown>) => {
    fs.mkdirSync(dir, { recursive: true });
    const tmp = file + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(data));
    fs.renameSync(tmp, file);
  };
  return {
    async get(key) {
      const v = load()[key];
      return v === undefined ? null : (structuredClone(v) as never);
    },
    async set(key, value) {
      const d = load();
      d[key] = value;
      save(d);
    },
    async del(key) {
      const d = load();
      delete d[key];
      save(d);
    },
    async list(prefix) {
      return Object.keys(load()).filter((k) => k.startsWith(prefix));
    },
  };
}

/* ---------------- Netlify Blobs driver ---------------- */
function blobsDriver(): KV {
  let storePromise: Promise<import("@netlify/blobs").Store> | null = null;
  const store = () => {
    if (!storePromise) {
      storePromise = import("@netlify/blobs").then(({ getStore }) =>
        getStore({ name: "foliolink", consistency: "strong" })
      );
    }
    return storePromise;
  };
  return {
    async get(key) {
      const s = await store();
      return ((await s.get(key, { type: "json" })) ?? null) as never;
    },
    async set(key, value) {
      const s = await store();
      await s.setJSON(key, value);
    },
    async del(key) {
      const s = await store();
      await s.delete(key);
    },
    async list(prefix) {
      const s = await store();
      const { blobs } = await s.list({ prefix });
      return blobs.map((b) => b.key);
    },
  };
}

/* ---------------- Postgres driver ---------------- */
function postgresDriver(): KV {
  let ready: Promise<import("pg").Pool> | null = null;
  const pool = () => {
    if (!ready) {
      ready = (async () => {
        const { Pool } = await import("pg");
        const p = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
          max: 3,
        });
        await p.query(
          "create table if not exists foliolink_kv (key text primary key, value jsonb not null, updated_at timestamptz not null default now())"
        );
        return p;
      })();
    }
    return ready;
  };
  return {
    async get(key) {
      const r = await (await pool()).query("select value from foliolink_kv where key = $1", [key]);
      return (r.rows[0]?.value ?? null) as never;
    },
    async set(key, value) {
      await (await pool()).query(
        "insert into foliolink_kv (key, value) values ($1, $2) on conflict (key) do update set value = excluded.value, updated_at = now()",
        [key, JSON.stringify(value)]
      );
    },
    async del(key) {
      await (await pool()).query("delete from foliolink_kv where key = $1", [key]);
    },
    async list(prefix) {
      const r = await (await pool()).query(
        "select key from foliolink_kv where key like $1 order by key",
        [prefix.replace(/[\\%_]/g, (m) => "\\" + m) + "%"]
      );
      return r.rows.map((x) => x.key as string);
    },
  };
}

function resolveDriverName() {
  const explicit = process.env.DB_DRIVER;
  const driver =
    explicit ||
    (process.env.DATABASE_URL
      ? "postgres"
      : process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT || process.env.SITE_ID
        ? "blobs"
        : "file");
  return driver;
}

export const driverName = resolveDriverName();

function pickDriver(): KV {
  const driver = driverName;
  if (driver === "postgres") return postgresDriver();
  if (driver === "blobs") return blobsDriver();
  return fileDriver();
}

const g = globalThis as unknown as { __kv?: KV };
export const kv: KV = g.__kv ?? (g.__kv = pickDriver());
