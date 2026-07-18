# Deploy FolioLink (GitHub → Vercel → your domain)

## 1. GitHub repository

Repo target: https://github.com/Ali-Husnain-186/portfolio-builder

If the remote is not set yet:

```bash
gh auth login
gh repo create Ali-Husnain-186/portfolio-builder --public --source=. --remote=origin --push
```

Or create the empty repo on GitHub, then:

```bash
git branch -M main
git remote add origin https://github.com/Ali-Husnain-186/portfolio-builder.git
git push -u origin main
```

## 2. Supabase (before first production deploy)

1. Create a free Supabase project
2. Run `supabase/migrations/001_portfolios.sql` in the SQL Editor
3. Auth → URL configuration:
   - Site URL: `https://YOUR_DOMAIN`
   - Redirect URLs: `https://YOUR_DOMAIN/auth/callback` and `http://localhost:3000/auth/callback`
4. Optional: enable Google provider

## 3. Vercel (auto-deploy on every push)

1. Go to https://vercel.com/new
2. Import **Ali-Husnain-186/portfolio-builder**
3. Environment variables:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | from Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase → Settings → API |
| `NEXT_PUBLIC_APP_URL` | `https://YOUR_DOMAIN` |

4. Deploy
5. Project → Settings → Domains → add **YOUR_DOMAIN**
6. Point DNS (A/CNAME) as Vercel instructs

After this, every push to `main` redeploys automatically.

User portfolio links stay on your domain: `https://YOUR_DOMAIN/username`
