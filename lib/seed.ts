import "server-only";
import { kv } from "./db";
import { DEMO_PEOPLE, demoPortfolio } from "./demo";
import { getUserByEmail } from "./repo";
import type { User } from "./types";

/** Public demo password for the seeded showcase accounts (set SEED_DEMO=false to disable seeding). */
export const DEMO_PASSWORD = "demo12345";

let seeding: Promise<void> | null = null;

export function ensureSeeded() {
  if (process.env.SEED_DEMO === "false") return Promise.resolve();
  if (!seeding) {
    const timeout = new Promise<void>((_, rej) => setTimeout(() => rej(new Error("seed timed out")), 10000));
    seeding = Promise.race([run(), timeout]).catch((e) => { seeding = null; console.error("seed failed", e); });
  }
  return seeding;
}

async function run() {
  if (await kv.get("meta/seeded")) return;
  const { hashPassword } = await import("./auth");
  const hash = await hashPassword(DEMO_PASSWORD);
  for (const person of DEMO_PEOPLE) {
    if (await getUserByEmail(person.email)) continue;
    const userId = "demo-" + person.username;
    const user: User = {
      id: userId,
      email: person.email,
      name: person.name,
      passwordHash: hash,
      role: "user",
      createdAt: new Date().toISOString(),
    };
    await kv.set(`users/${userId}`, user);
    await kv.set(`emails/${user.email}`, { id: userId });
    const p = demoPortfolio(person, userId);
    await kv.set(`portfolios/${userId}`, p);
    await kv.set(`usernames/${p.username}`, { userId });
  }
  await kv.set("meta/seeded", { at: new Date().toISOString() });
}
