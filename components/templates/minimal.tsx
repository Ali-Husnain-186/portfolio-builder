"use client";

import type { SectionKey } from "@/lib/types";
import { Avatar, ContactForm, Footer, SocialIcons, label, visibleSections, type TplProps, Typed } from "./shared";

export default function Minimal({ p, preview }: TplProps) {
  const pr = p.profile;
  const muted = { color: "var(--muted)" };
  const render = (k: SectionKey) => {
    switch (k) {
      case "about":
        return <p className="whitespace-pre-line leading-relaxed" style={muted}>{pr.bio}</p>;
      case "skills":
        return <p className="leading-loose">{p.skills.filter((s) => s.name).map((s, i) => <span key={s.id}>{i > 0 && <span style={muted}> · </span>}{s.name}</span>)}</p>;
      case "services":
        return <ul className="space-y-4">{p.services.filter((s) => s.title).map((s) => <li key={s.id}><b className="font-semibold">{s.title}</b><p className="text-sm" style={muted}>{s.description}</p></li>)}</ul>;
      case "projects":
        return <ul className="divide-y" style={{ borderColor: "var(--border)" }}>{p.projects.filter((x) => x.title).map((x) => (
          <li key={x.id} className="group py-5" style={{ borderColor: "var(--border)" }}>
            <a href={x.url || x.repo || undefined} target="_blank" rel="noopener noreferrer" className="flex items-baseline justify-between gap-4">
              <span className="font-semibold group-hover:underline" style={{ textDecorationColor: "var(--a)" }}>{x.title}</span>
              <span className="shrink-0 text-xs" style={muted}>{x.tags.join(" / ")}</span>
            </a>
            <p className="mt-1 text-sm leading-relaxed" style={muted}>{x.description}</p>
          </li>))}</ul>;
      case "experience":
        return <ul className="space-y-6">{p.experience.map((e) => (
          <li key={e.id} className="grid gap-1 sm:grid-cols-[140px_1fr]">
            <span className="text-sm" style={muted}>{e.period}</span>
            <div><b className="font-semibold">{e.role}</b>, {e.company}{e.description && <p className="mt-1 text-sm leading-relaxed" style={muted}>{e.description}</p>}</div>
          </li>))}</ul>;
      case "education":
        return <ul className="space-y-4">{p.education.map((e) => (
          <li key={e.id} className="grid gap-1 sm:grid-cols-[140px_1fr]"><span className="text-sm" style={muted}>{e.period}</span><div><b className="font-semibold">{e.degree}</b>, {e.school}</div></li>))}</ul>;
      case "testimonials":
        return <div className="space-y-6">{p.testimonials.filter((t) => t.quote).map((t) => (
          <blockquote key={t.id} className="border-l-2 pl-5" style={{ borderColor: "var(--a)" }}><p className="italic">“{t.quote}”</p><footer className="mt-2 text-sm" style={muted}>— {t.name}, {t.role}</footer></blockquote>))}</div>;
      case "contact":
        return <div><p className="mb-5" style={muted}>Reach me at {pr.email ? <a className="underline" style={{ color: "var(--fg)" }} href={`mailto:${pr.email}`}>{pr.email}</a> : "the form below"}.</p><ContactForm p={p} preview={preview} /></div>;
    }
  };
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--font)" }}>
      <main className="mx-auto max-w-2xl px-6 py-20 md:py-28">
        <header className="fl-reveal">
          <Avatar p={p} size={72} round />
          <h1 className="mt-6 text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--hfont)" }}>{pr.fullName}</h1>
          <p className="mt-1" style={muted}>{[pr.title, pr.location].filter(Boolean).join(" — ")}</p>
          {pr.tagline && <p className="mt-6 text-xl leading-snug"><Typed text={pr.tagline} /></p>}
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm">
            <SocialIcons socials={p.socials} size={18} />
            {pr.resumeUrl && <a href={pr.resumeUrl} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--a)" }}>Résumé ↗</a>}
            {pr.available && <span className="inline-flex items-center gap-1.5" style={muted}><span className="h-1.5 w-1.5 rounded-full bg-green-500" />Open to work</span>}
          </div>
        </header>
        {visibleSections(p).map((k) => (
          <section key={k} id={k} className="mt-16">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--a)" }}>{label(k)}</h2>
            {render(k)}
          </section>
        ))}
      </main>
      <Footer p={p} />
    </div>
  );
}
