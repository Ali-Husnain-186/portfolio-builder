# FolioLink — Free Portfolio Builder

A complete, multi-user portfolio builder. People sign up, pick a template, customize everything with a live preview, and share a link like `yourdomain.com/username`.

## Features

- **Accounts:** email + password sign-up and login (scrypt hashing, httpOnly session cookies), change email/password, delete account
- **6 templates:** Modern, Minimal, Developer, Creative, Classic, Glass. Switching templates keeps all content.
- **Design controls:** 8 color presets plus custom primary/accent/background colors, light/dark mode, 8 fonts (heading and body), corner radius, animations
- **Editor with live preview:** desktop, tablet and mobile preview, autosave, Ctrl/Cmd+S
- **Content:** profile, photo, CV (PDF), skills with levels, projects with images, experience, education, services, testimonials, 8 social links
- **Sections:** reorder and show/hide
- **Public page `/username`:** SEO and Open Graph metadata, contact form (with honeypot and rate limits), view counter
- **Dashboard:** share link, publish/unpublish, profile strength, inbox for contact messages
- **Link & data:** change username (checks availability and suggests alternatives), export/import JSON, reset
- **Admin panel (`/admin`):** list, search, publish/unpublish, disable/enable, promote or delete users
- **Demo data:** 3 demo portfolios (`/ayesha`, `/bilal`, `/sara`) are seeded on first run

## Storage — swappable, zero config

All data goes through a small key/value interface in [`lib/db.ts`](lib/db.ts):

| Driver | When it's used | Setup |
|---|---|---|
| **Netlify Blobs** | Default on Netlify | none |
| **Postgres** (Supabase, Neon, RDS, …) | When `DATABASE_URL` is set | set `DATABASE_URL`; the table is created automatically |
| **File** (`.data/kv.json`) | Default for local dev | none |

To force a driver, set `DB_DRIVER=blobs|postgres|file`. To move to another database later, set one env var or add one more driver to `lib/db.ts`. Nothing else in the app changes.

## Environment variables (all optional)

| Var | Purpose |
|---|---|
| `ADMIN_EMAILS` | Comma-separated emails that get the Admin panel |
| `DATABASE_URL` | Use Postgres instead of Netlify Blobs |
| `DB_DRIVER` | Force a storage driver |
| `NEXT_PUBLIC_APP_URL` | Base URL shown in share links (defaults to the current domain) |
| `SEED_DEMO` | `false` to skip seeding demo portfolios |

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
```

Demo logins (seeded): `ayesha@demo.foliolink.app`, `bilal@demo.foliolink.app`, `sara@demo.foliolink.app`. The password is `demo12345`. It is public, so disable seeding (`SEED_DEMO=false`) or delete these accounts from `/admin` before you launch.

## Deploy to Netlify

1. Netlify → **Add new site → Import an existing project → GitHub** → pick this repo.
2. The build settings come from `netlify.toml`, so you don't need to change anything. Click **Deploy**.
3. (Optional) Site configuration → Environment variables → add `ADMIN_EMAILS=you@example.com`, then redeploy.
4. (Optional) Domain management → add your custom domain.

Every push to `main` redeploys automatically.

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/templates`, `/templates/:id` | Template gallery and interactive preview |
| `/signup`, `/login` | Auth |
| `/dashboard` | Overview, share link, stats |
| `/dashboard/editor` | Builder with live preview |
| `/dashboard/inbox` | Contact-form messages |
| `/dashboard/settings` | Account settings |
| `/admin` | Admin panel |
| `/:username` | Public portfolio |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Netlify Blobs / Postgres
