import type { Portfolio } from "@/lib/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";

function cvPublicUrl(cvPath: string | null) {
  if (!cvPath) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/portfolio-files/${cvPath}`;
}

export function PortfolioView({ portfolio }: { portfolio: Portfolio }) {
  const cvUrl = cvPublicUrl(portfolio.cv_path);
  const socials = portfolio.social_links ?? {};
  const socialEntries = Object.entries(socials).filter(
    ([, v]) => typeof v === "string" && v.trim(),
  ) as [string, string][];

  return (
    <div className="portfolio-bg min-h-screen">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
        <nav className="mb-12 flex flex-wrap items-center justify-between gap-4 text-sm">
          <span className="font-display text-lg text-[var(--ink)]">
            {portfolio.full_name.split(" ")[0]}
          </span>
          <div className="flex flex-wrap gap-4 text-[var(--muted)]">
            {portfolio.experience?.length > 0 && (
              <a href="#experience" className="hover:text-[var(--ink)]">
                Experience
              </a>
            )}
            {portfolio.projects?.length > 0 && (
              <a href="#projects" className="hover:text-[var(--ink)]">
                Projects
              </a>
            )}
            <a href="#about" className="hover:text-[var(--ink)]">
              About
            </a>
          </div>
        </nav>

        <header className="mb-16 space-y-5">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            {portfolio.avatar_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={portfolio.avatar_url}
                alt={portfolio.full_name}
                className="h-28 w-28 rounded-2xl object-cover shadow-sm"
              />
            )}
            <div className="space-y-2">
              <h1 className="font-display text-4xl leading-tight tracking-tight text-[var(--ink)] sm:text-5xl">
                {portfolio.full_name}
              </h1>
              {portfolio.title && (
                <p className="text-lg text-[var(--accent)]">{portfolio.title}</p>
              )}
            </div>
          </div>
          {portfolio.bio && (
            <p className="max-w-2xl text-base leading-relaxed text-[var(--muted)]">
              {portfolio.bio}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {portfolio.email && (
              <a
                href={`mailto:${portfolio.email}`}
                className="rounded-lg bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--ink-soft)]"
              >
                Get in Touch
              </a>
            )}
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-[var(--line)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--accent)]"
              >
                Download CV
              </a>
            )}
          </div>
          {portfolio.skills?.length > 0 && (
            <ul className="flex flex-wrap gap-2 pt-2">
              {portfolio.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-md bg-[var(--surface)] px-2.5 py-1 text-xs font-medium text-[var(--ink-soft)]"
                >
                  {skill}
                </li>
              ))}
            </ul>
          )}
        </header>

        {portfolio.experience?.some((e) => e.company || e.role) && (
          <section id="experience" className="mb-16 scroll-mt-8">
            <h2 className="mb-8 font-display text-2xl text-[var(--ink)]">
              Work Experience
            </h2>
            <div className="space-y-10">
              {portfolio.experience
                .filter((e) => e.company || e.role)
                .map((ex, i) => (
                  <article key={i} className="space-y-2">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-lg font-semibold text-[var(--ink)]">
                        {ex.company}
                      </h3>
                      {ex.period && (
                        <span className="text-sm text-[var(--muted)]">
                          {ex.period}
                        </span>
                      )}
                    </div>
                    {ex.role && (
                      <p className="text-sm font-medium text-[var(--accent)]">
                        {ex.role}
                      </p>
                    )}
                    {ex.bullets?.filter((b) => b.trim()).length > 0 && (
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--muted)]">
                        {ex.bullets
                          .filter((b) => b.trim())
                          .map((b, j) => (
                            <li key={j}>{b}</li>
                          ))}
                      </ul>
                    )}
                  </article>
                ))}
            </div>
          </section>
        )}

        {portfolio.projects?.some((p) => p.title) && (
          <section id="projects" className="mb-16 scroll-mt-8">
            <h2 className="mb-8 font-display text-2xl text-[var(--ink)]">
              Featured Projects
            </h2>
            <div className="space-y-8">
              {portfolio.projects
                .filter((p) => p.title)
                .map((p, i) => (
                  <article key={i} className="space-y-2">
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h3 className="text-lg font-semibold text-[var(--ink)]">
                        {p.title}
                      </h3>
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[var(--accent)] underline-offset-2 hover:underline"
                        >
                          Preview
                        </a>
                      )}
                    </div>
                    {p.description && (
                      <p className="text-sm leading-relaxed text-[var(--muted)]">
                        {p.description}
                      </p>
                    )}
                  </article>
                ))}
            </div>
          </section>
        )}

        {portfolio.education?.some((e) => e.school || e.degree) && (
          <section className="mb-16">
            <h2 className="mb-8 font-display text-2xl text-[var(--ink)]">
              Education
            </h2>
            <div className="space-y-6">
              {portfolio.education
                .filter((e) => e.school || e.degree)
                .map((ed, i) => (
                  <article key={i}>
                    <h3 className="font-semibold text-[var(--ink)]">{ed.school}</h3>
                    <p className="text-sm text-[var(--muted)]">
                      {[ed.degree, ed.period].filter(Boolean).join(" · ")}
                    </p>
                  </article>
                ))}
            </div>
          </section>
        )}

        <section id="about" className="mb-16 scroll-mt-8">
          <h2 className="mb-4 font-display text-2xl text-[var(--ink)]">About Me</h2>
          <p className="leading-relaxed text-[var(--muted)]">
            {portfolio.bio ||
              `Hi, I'm ${portfolio.full_name}${portfolio.title ? `, ${portfolio.title}` : ""}.`}
          </p>
          {portfolio.location && (
            <p className="mt-3 text-sm text-[var(--muted)]">{portfolio.location}</p>
          )}
        </section>

        {socialEntries.length > 0 && (
          <footer className="border-t border-[var(--line)] pt-8">
            <ul className="flex flex-wrap gap-4 text-sm">
              {socialEntries.map(([key, url]) => (
                <li key={key}>
                  <a
                    href={url.startsWith("http") ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="capitalize text-[var(--muted)] underline-offset-2 hover:text-[var(--ink)] hover:underline"
                  >
                    {key}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-[var(--muted)]">
              {portfolio.full_name}
              {APP_URL ? ` · ${APP_URL.replace(/^https?:\/\//, "")}` : ""}
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
