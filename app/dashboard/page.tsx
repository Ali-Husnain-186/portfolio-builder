import Link from "next/link";
import { CopyLink } from "@/components/ui/copy-link";
import { PublishToggle } from "@/components/ui/publish-toggle";
import { LogoutButton } from "@/components/ui/logout-button";
import { requirePageUser } from "@/lib/auth";
import { TEMPLATES } from "@/lib/design";
import { createPortfolioFor, getInbox, getPortfolio } from "@/lib/repo";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const user = await requirePageUser();
  const p = (await getPortfolio(user.id)) ?? (await createPortfolioFor(user));
  const inbox = await getInbox(user.id);
  const t = TEMPLATES.find((x) => x.id === p.design.template);
  const checks: [string, boolean][] = [
    ["Add a photo", !!p.profile.avatar],
    ["Write a title & tagline", !!p.profile.title && !!p.profile.tagline],
    ["Write your bio", p.profile.bio.length > 30],
    ["Add 3+ skills", p.skills.length >= 3],
    ["Add a project", p.projects.length > 0],
    ["Add experience", p.experience.length > 0],
    ["Add social links", Object.values(p.socials).some(Boolean)],
  ];
  const done = checks.filter((c) => c[1]).length;
  const pct = Math.round((done / checks.length) * 100);
  return (
    <main className="mx-auto max-w-5xl p-5 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Hi, {user.name.split(" ")[0]} 👋</h1>
          <p className="text-ui-muted">Here&apos;s how your portfolio is doing.</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${p.username}`} target="_blank" className="btn-ghost">View live ↗</Link>
          <Link href="/dashboard/editor" className="btn-primary">Edit portfolio</Link>
        </div>
      </div>

      <div className="card mt-8 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="label">Your public link</p>
            <CopyLink path={`/${p.username}`} />
          </div>
          <PublishToggle published={p.published} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div className="card p-6"><p className="label">Total views</p><p className="mt-1 text-4xl font-bold">{p.views}</p></div>
        <Link href="/dashboard/inbox" className="card p-6 transition hover:shadow-md"><p className="label">Messages</p><p className="mt-1 text-4xl font-bold">{inbox.length}</p><p className="text-sm text-ui-muted">{inbox.filter((m) => !m.read).length} unread</p></Link>
        <Link href="/dashboard/editor?tab=design" className="card p-6 transition hover:shadow-md"><p className="label">Template</p><p className="mt-1 text-2xl font-bold">{t?.name}</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-ui-muted"><span className="h-4 w-4 rounded-full" style={{ background: p.design.primary }} /><span className="h-4 w-4 rounded-full" style={{ background: p.design.accent }} />{p.design.mode} mode</div></Link>
      </div>

      <div className="card mt-6 p-6">
        <div className="flex items-center justify-between"><h2 className="font-semibold">Profile strength</h2><span className="text-sm font-semibold text-brand">{pct}%</span></div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-ui-bg"><div className="brand-gradient h-full" style={{ width: `${pct}%` }} /></div>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {checks.map(([label, ok]) => (
            <li key={label} className={`flex items-center gap-2 text-sm ${ok ? "text-ui-muted line-through" : ""}`}><span className={ok ? "text-green-600" : "text-ui-muted"}>{ok ? "✓" : "○"}</span>{label}</li>
          ))}
        </ul>
      </div>
      <div className="mt-8 md:hidden"><LogoutButton className="btn-ghost w-full text-red-600" /></div>
    </main>
  );
}
