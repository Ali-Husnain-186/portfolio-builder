# FolioLink — Free Portfolio Builder

Multi-user portfolio product: users sign up, fill their details (optional CV), get a public link at `yourdomain.com/username`, and can edit or delete anytime. No subscriptions.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Auth, Postgres, Storage)

## Setup

### 1. Install

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Run the SQL in [`supabase/migrations/001_portfolios.sql`](supabase/migrations/001_portfolios.sql) in the SQL Editor
3. Auth → URL configuration:
   - Site URL: your domain (or `http://localhost:3000`)
   - Redirect URLs: `http://localhost:3000/auth/callback` and `https://yourdomain.com/auth/callback`
4. (Optional) Auth → Providers → enable Google and add OAuth client IDs

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Product routes

| Route | Purpose |
|-------|---------|
| `/` | Landing |
| `/signup`, `/login` | Auth (magic link + Google) |
| `/dashboard` | Copy link, edit, delete |
| `/dashboard/edit` | Create / update portfolio + optional CV |
| `/{username}` | Public portfolio (GradeNova-style path) |

If a username is taken, the form suggests `ali1`, `ali2`, etc.

## Deploy (GitHub → Vercel → your domain)

1. Push this repo to GitHub (under [Ali-Husnain-186](https://github.com/Ali-Husnain-186))
2. Import the repo in [Vercel](https://vercel.com) (Import Git Repository)
3. Add the same env vars as `.env.local`, with `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
4. Deploy, then add your **custom domain** in Vercel → Domains
5. Point DNS (A/CNAME) as Vercel shows

Every push to `main` auto-deploys. User portfolio links are always on **your domain** (`yourdomain.com/username`), not on `*.vercel.app`.

## License

Private / your product.
