import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="landing-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SiteHeader signedIn={!!user} />

        <main className="pb-24 pt-10 sm:pt-20">
          <section className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Free portfolio builder
            </p>
            <h1 className="font-display text-4xl leading-[1.1] tracking-tight text-[var(--ink)] sm:text-6xl">
              Build once.
              <br />
              Share your link everywhere.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              Enter your details, optionally attach a CV, and get a public
              portfolio link on this domain — like{" "}
              <span className="whitespace-nowrap font-medium text-[var(--ink)]">
                /yourname
              </span>
              . Edit or delete anytime. No subscriptions.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="rounded-lg bg-[var(--ink)] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--ink-soft)]"
              >
                {user ? "Go to dashboard" : "Create your portfolio free"}
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-[var(--line)] bg-white/80 px-6 py-3.5 text-sm font-medium text-[var(--ink)] backdrop-blur transition hover:border-[var(--accent)]"
              >
                Sign in
              </Link>
            </div>
          </section>

          <section className="mx-auto mt-24 grid max-w-4xl gap-8 sm:grid-cols-3">
            {[
              {
                title: "Fill your story",
                body: "Name, skills, projects, experience, education, and an optional CV.",
              },
              {
                title: "Get your link",
                body: "Publish and share yourdomain.com/username with recruiters.",
              },
              {
                title: "Edit or delete",
                body: "Update anytime from your dashboard. Delete when you are done.",
              },
            ].map((item) => (
              <div key={item.title} className="space-y-2 text-left">
                <h2 className="font-display text-xl text-[var(--ink)]">
                  {item.title}
                </h2>
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  {item.body}
                </p>
              </div>
            ))}
          </section>
        </main>

        <footer className="border-t border-[var(--line)] py-8 text-center text-xs text-[var(--muted)]">
          FolioLink · Free forever · No premium plans
        </footer>
      </div>
    </div>
  );
}
