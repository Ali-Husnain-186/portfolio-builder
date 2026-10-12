import Link from "next/link";
import { SiteHeader } from "@/components/ui/site-header";
import { TemplateThumb } from "@/components/ui/template-thumb";
import { TEMPLATES } from "@/lib/design";
import { DEMO_PEOPLE, demoPortfolio } from "@/lib/demo";

const FEATURES = [
  ["🎨", "6 pro templates", "Modern, Minimal, Developer, Creative, Classic and Glass — switch any time, your content stays."],
  ["🌈", "Full design control", "Colors, light/dark mode, fonts, corner radius, animations. Change everything with a live preview."],
  ["🧩", "Drag-free sections", "Reorder, show or hide About, Skills, Services, Projects, Experience, Education, Testimonials, Contact."],
  ["🔗", "Your own link", "Get a clean link like foliolink.app/yourname and share it anywhere."],
  ["📬", "Built-in inbox", "Visitors message you through a contact form; read them in your dashboard."],
  ["📈", "View counter", "See how many people visited your portfolio."],
  ["🖼️", "Image uploads", "Upload your photo, project screenshots and CV."],
  ["🛡️", "Full control", "Publish/unpublish, change username, reset, export your data, or delete your account anytime."],
];

export default function Home() {
  const people = DEMO_PEOPLE;
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-20 text-center md:pt-28">
            <span className="inline-block rounded-full border border-ui-line bg-white px-3 py-1 text-xs font-semibold text-ui-muted">100% free · No credit card · No code</span>
            <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Your portfolio, <span className="brand-text">beautifully</span> online in minutes.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ui-muted">
              Create an account, pick a template, make it yours with colors and fonts, and share your personal link. Edit anything, anytime.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/signup" className="btn-primary px-6 py-3 text-base">Create my portfolio →</Link>
              <Link href="/templates" className="btn-ghost px-6 py-3 text-base">Browse templates</Link>
            </div>
            <p className="mt-4 text-sm text-ui-muted">
              See live examples:{" "}
              {people.map((p, i) => (<span key={p.username}>{i > 0 && " · "}<Link className="font-medium text-brand underline" href={`/${p.username}`}>/{p.username}</Link></span>))}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20">
          <div className="grid gap-6 md:grid-cols-3">
            {TEMPLATES.slice(0, 3).map((t, i) => (
              <div key={t.id} className="card group relative overflow-hidden shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <TemplateThumb p={demoPortfolio(people[i % people.length], "x", t.id)} height={240} />
                <div className="border-t border-ui-line p-4"><b>{t.name}</b><p className="text-sm text-ui-muted">{t.description}</p></div>
                <Link href={`/templates/${t.id}`} className="absolute inset-0" aria-label={`Preview ${t.name}`} />
              </div>
            ))}
          </div>
          <div className="mt-6 text-center"><Link href="/templates" className="font-semibold text-brand">See all {TEMPLATES.length} templates →</Link></div>
        </section>

        <section id="features" className="border-y border-ui-line bg-white py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-center font-display text-4xl font-bold">Everything you need. Nothing you don&apos;t.</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(([icon, title, text]) => (
                <div key={title} className="rounded-2xl border border-ui-line p-6">
                  <div className="text-3xl">{icon}</div>
                  <h3 className="mt-3 font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-ui-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-center font-display text-4xl font-bold">Three steps. That&apos;s it.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[["1", "Sign up", "Create a free account with your email."], ["2", "Build", "Fill your details, pick a template and colors — preview updates live."], ["3", "Share", "Copy your link and put it on your CV, LinkedIn and email signature."]].map(([n, t, d]) => (
              <div key={n} className="card p-6"><span className="brand-gradient flex h-10 w-10 items-center justify-center rounded-full font-bold text-white">{n}</span><h3 className="mt-4 text-lg font-semibold">{t}</h3><p className="text-ui-muted">{d}</p></div>
            ))}
          </div>
          <div className="mt-12 text-center"><Link href="/signup" className="btn-primary px-8 py-3 text-base">Start building — it&apos;s free</Link></div>
        </section>
      </main>
      <footer className="border-t border-ui-line py-8 text-center text-sm text-ui-muted">© {new Date().getFullYear()} FolioLink · Free portfolio builder</footer>
    </>
  );
}
