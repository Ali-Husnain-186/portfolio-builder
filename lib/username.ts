export const RESERVED = new Set([
  "admin", "api", "app", "auth", "dashboard", "login", "logout", "signup", "register",
  "settings", "templates", "template", "preview", "about", "help", "support", "pricing",
  "terms", "privacy", "static", "_next", "public", "assets", "files", "www", "mail",
  "contact", "blog", "docs", "status", "foliolink", "root", "user", "users", "account",
]);

export function normalizeUsername(raw: string) {
  return raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .replace(/^[-_]+|[-_]+$/g, "")
    .slice(0, 30);
}

export function validateUsername(u: string): string | null {
  if (u.length < 3) return "Username must be at least 3 characters.";
  if (u.length > 30) return "Username must be at most 30 characters.";
  if (!/^[a-z0-9]([a-z0-9_-]*[a-z0-9])?$/.test(u))
    return "Use lowercase letters, numbers, - or _ (must start and end with a letter or number).";
  if (RESERVED.has(u)) return "That username is reserved.";
  return null;
}
