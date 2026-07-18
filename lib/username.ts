export const RESERVED_USERNAMES = new Set([
  "login",
  "signup",
  "sign-up",
  "sign-in",
  "signin",
  "dashboard",
  "api",
  "admin",
  "settings",
  "auth",
  "callback",
  "logout",
  "account",
  "profile",
  "edit",
  "create",
  "delete",
  "about",
  "contact",
  "help",
  "support",
  "terms",
  "privacy",
  "pricing",
  "blog",
  "docs",
  "static",
  "assets",
  "public",
  "private",
  "www",
  "app",
  "home",
  "root",
  "null",
  "undefined",
  "favicon",
  "robots",
  "sitemap",
  "_next",
  "next",
]);

const USERNAME_REGEX = /^[a-z0-9]([a-z0-9_-]*[a-z0-9])?$/;

export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

export function validateUsernameFormat(username: string): string | null {
  if (username.length < 3) return "Username must be at least 3 characters";
  if (username.length > 30) return "Username must be at most 30 characters";
  if (!USERNAME_REGEX.test(username)) {
    return "Use lowercase letters, numbers, hyphens, or underscores";
  }
  if (RESERVED_USERNAMES.has(username)) {
    return "This username is reserved";
  }
  return null;
}

/** Generate candidate suggestions when a username is taken. */
export function generateSuggestions(base: string, taken: Set<string>): string[] {
  const clean = normalizeUsername(base).replace(/[^a-z0-9_-]/g, "").slice(0, 24);
  if (!clean) return [];

  const candidates: string[] = [];
  for (let i = 1; candidates.length < 5 && i <= 50; i++) {
    const next = `${clean}${i}`;
    if (
      !taken.has(next) &&
      !RESERVED_USERNAMES.has(next) &&
      !validateUsernameFormat(next)
    ) {
      candidates.push(next);
    }
  }

  const extras = [`${clean}_dev`, `${clean}dev`, `${clean}${new Date().getFullYear()}`];
  for (const extra of extras) {
    if (candidates.length >= 5) break;
    const n = normalizeUsername(extra).slice(0, 30);
    if (
      n.length >= 3 &&
      !taken.has(n) &&
      !RESERVED_USERNAMES.has(n) &&
      !validateUsernameFormat(n) &&
      !candidates.includes(n)
    ) {
      candidates.push(n);
    }
  }

  return candidates.slice(0, 5);
}
