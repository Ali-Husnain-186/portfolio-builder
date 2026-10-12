"use client";

import type { SectionKey } from "@/lib/types";
import { Avatar, ContactForm, Footer, ProjectLinks, SkillBar, SocialIcons, label, visibleSections, type TplProps, Typed } from "./shared";

const SIDEBAR: SectionKey[] = ["skills", "education"];

export default function Classic({ p, preview }: TplProps) {
  const pr = p.profile;
  const muted = { color: "var(--muted)" };
  const H = { fontFamily: "var(--hfont)" };
  const secs = visibleSections(p);
  const Title = ({ k }: { k: SectionKey }) => (
    <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold" style={H}>{label(k)}<span className="h-px flex-1" style={{ background: "var(--border)" }} /></h2>
  );
  const render = (k: SectionKey) => {
    switch (k) {
      case "about": return <p className="whitespace-pre-line text-lg leading-relaxed" style={muted}>{pr.bio}</p>;
      case "skills": return <div className="space-y-4">{p.skills.filter((s) => s.name).map((s) => <SkillBar key={s.id} {...s} />)}</div>;
      case "education": return <div className="space-y-4">{p.education.map((e) => <div key={e.id}><p className="font-semibold">{e.degree}</p><p className="text-sm">{e.school}</p><p className="text-xs" style={muted}>{e.period}</p></div>)}</div>;
      case "services": return <div className="grid gap-4 sm:grid-cols-2">{p.services.filter((s) => s.title).map((s) => <div key={s.id} className="p-5" style={{ border: "1px solid var(--border)", borderRadius: "var(--r)", background: "var(--card)" }}><h3 className="font-semibold" style={{ ...H, color: "var(--p)" }}>{s.title}</h3><p className="mt-1 text-sm" style={muted}>{s.description}</p></div>)}</div>;
      case "projects": return <div className="space-y-6">{p.projects.filter((x) => x.title).map((x) => (
        <article key={x.id} className="pl-5" style={{ borderLeft: "3px solid var(--p)" }}>
          <h3 className="text-xl font-semibold" style={H}>{x.title}</h3>
          {x.tags.length > 0 && <p className="text-xs italic" style={{ color: "var(--a)" }}>{x.tags.join(", ")}</p>}
          <p className="mt-1 leading-relaxed" style={muted}>{x.description}</p>
          <ProjectLinks url={x.url} repo={x.repo} />
        </article>))}</div>;
      case "experience": return <div className="space-y-7">{p.experience.map((e) => (
        <div key={e.id}><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-xl font-semibold" style={H}>{e.role}</h3><span className="text-sm italic" style={muted}>{e.period}</span></div>
          <p className="font-medium" style={{ color: "var(--p)" }}>{e.company}</p>{e.description && <p className="mt-1 whitespace-pre-line leading-relaxed" style={muted}>{e.description}</p>}</div>))}</div>;
      case "testimonials": return <div className="space-y-5">{p.testimonials.filter((t) => t.quote).map((t) => (
        <blockquote key={t.id} className="p-6 italic" style={{ background: "var(--card)", borderRadius: "var(--r)", border: "1px solid var(--border)" }}>“{t.quote}”<footer className="mt-3 text-sm not-italic" style={muted}>— <b>{t.name}</b>, {t.role}</footer></blockquote>))}</div>;
      case "contact": return <ContactForm p={p} preview={preview} />;
    }
  };
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--font)" }}>
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="grid overflow-hidden shadow-xl md:grid-cols-[300px_1fr]" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r)" }}>
          <aside className="fl-reveal p-8 text-white" style={{ background: "var(--p)" }}>
            <Avatar p={p} size={140} round className="mx-auto ring-4 ring-white/30" />
            <h1 className="mt-5 text-center text-3xl font-bold leading-tight" style={H}>{pr.fullName}</h1>
            <p className="mt-1 text-center text-white/80">{pr.title}</p>
            <div className="mt-8 space-y-2 text-sm text-white/90">
              {pr.email && <p className="break-all">✉ {pr.email}</p>}
              {pr.phone && <p>☏ {pr.phone}</p>}
              {pr.location && <p>⌖ {pr.location}</p>}
            </div>
            <SocialIcons socials={p.socials} className="mt-6 justify-center" />
            {pr.resumeUrl && <a href={pr.resumeUrl} target="_blank" rel="noopener noreferrer" className="mt-6 block border border-white/50 py-2 text-center text-sm font-semibold hover:bg-white/10" style={{ borderRadius: "var(--r)" }}>Download CV</a>}
            {SIDEBAR.filter((k) => secs.includes(k)).map((k) => (
              <div key={k} id={k} className="mt-10 [&_*]:!text-white/90 [&_.fl-grow]:![background:#fff]">
                <h2 className="mb-4 border-b border-white/30 pb-2 text-sm font-bold uppercase tracking-widest">{label(k)}</h2>
                {render(k)}
              </div>
            ))}
          </aside>
          <main className="space-y-12 p-8 md:p-12">
            {pr.tagline && <p className="text-2xl italic leading-snug" style={{ ...H, color: "var(--a)" }}><Typed text={pr.tagline} /></p>}
            {secs.filter((k) => !SIDEBAR.includes(k)).map((k) => (
              <section key={k} id={k}><Title k={k} />{render(k)}</section>
            ))}
          </main>
        </div>
      </div>
      <Footer p={p} />
    </div>
  );
}
