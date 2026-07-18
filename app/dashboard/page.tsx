import Link from "next/link";
import { CopyLinkButton } from "@/components/copy-link-button";
import { DeletePortfolioButton } from "@/components/delete-portfolio-button";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import type { Portfolio } from "@/lib/types";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("portfolios")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const portfolio = data as Portfolio | null;
  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  const publicUrl = portfolio ? `${appUrl}/${portfolio.username}` : null;

  return (
    <div className="landing-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SiteHeader signedIn compact />

        <main className="space-y-8 py-10">
          <div>
            <h1 className="font-display text-3xl text-[var(--ink)]">Dashboard</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Signed in as {user.email}
            </p>
          </div>

          {params.saved && (
            <p className="rounded-lg bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent)]">
              Portfolio saved successfully.
            </p>
          )}
          {params.deleted && (
            <p className="rounded-lg bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
              Portfolio deleted. You can create a new one anytime.
            </p>
          )}

          {!portfolio ? (
            <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-8 text-center backdrop-blur">
              <h2 className="font-display text-2xl text-[var(--ink)]">
                No portfolio yet
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Create your public portfolio and get a shareable link.
              </p>
              <Link
                href="/dashboard/edit"
                className="mt-6 inline-block rounded-lg bg-[var(--ink)] px-5 py-3 text-sm font-medium text-white hover:bg-[var(--ink-soft)]"
              >
                Create portfolio
              </Link>
            </div>
          ) : (
            <div className="space-y-6 rounded-2xl border border-[var(--line)] bg-white/70 p-6 backdrop-blur sm:p-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                  Your public link
                </p>
                <p className="mt-1 break-all font-medium text-[var(--ink)]">
                  {publicUrl}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <CopyLinkButton url={publicUrl!} />
                  <Link
                    href={`/${portfolio.username}`}
                    target="_blank"
                    className="rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink)] hover:border-[var(--accent)]"
                  >
                    Open portfolio
                  </Link>
                  <Link
                    href="/dashboard/edit"
                    className="rounded-lg bg-[var(--ink)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--ink-soft)]"
                  >
                    Edit
                  </Link>
                </div>
              </div>

              <div className="border-t border-[var(--line)] pt-6">
                <p className="mb-3 text-sm text-[var(--muted)]">
                  Deleting removes your public page and uploaded files. Your
                  username becomes available again.
                </p>
                <DeletePortfolioButton />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
