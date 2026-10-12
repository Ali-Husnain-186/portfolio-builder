"use client";

import type { SectionKey } from "@/lib/types";
import { Avatar, ContactForm, Footer, Nav, ProjectImage, ProjectLinks, SkillBar, SocialIcons, label, visibleSections, type TplProps } from "./shared";

export default function Glass({ p, preview }: TplProps) {
  const pr = p.profile;
  const muted = { color: "var(--muted)" };
  const H = { fontFamily: "var(--hfont)" };
  const glass = {
    background: "color-mix(in srgb, var(--card) 100%, transparent)",
    border: "1px solid var(--border)",
    borderRadius: "var(--r)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
  };
  const render = (k: SectionKey) => {
    switch (k) {
      case "about": return <div className="p-8 text-lg leading-relaxed" style={glass}><p className="whitespace-pre-line" style={muted}>{pr.bio}</p></div>;
      case "skills": return <div className="grid gap-5 p-8 sm:grid-cols-2" style={glass}>{p.skills.filter((s) => s.name).map((s) => <SkillBar key={s.id} {...s} />)}</div>;
      case "services": return <div className="grid gap-5 md:grid-cols-3">{p.services.filter((s) => s.title).map((s) => (
        <div key={s.id} className="p-7 transition hover:-translate-y-1" style={glass}><div className="mb-4 h-10 w-10 rounded-full" style={{ background: "linear-gradient(135deg,var(--p),var(--a))", boxShadow: "0 0 30px var(--p)" }} /><h3 className="text-lg font-semibold" style={H}>{s.title}</h3><p className="mt-2 text-sm" style={muted}>{s.description}</p></div>))}</div>;
      case "projects": return <div className="grid gap-6 md:grid-cols-2">{p.projects.filter((x) => x.title).map((x) => (
        <article key={x.id} className="group overflow-hidden transition hover:-translate-y-1" style={glass}>
          <div className="aspect-video overflow-hidden"><ProjectImage src={x.image} title={x.title} className="transition duration-500 group-hover:scale-105" /></div>
          <div className="p-6"><h3 className="text-xl font-semibold" style={H}>{x.title}</h3><p className="mt-2 text-sm" style={muted}>{x.description}</p>
            {x.tags.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{x.tags.map((t) => <span key={t} className="px-2 py-0.5 text-xs" style={{ border: "1px solid var(--border)", borderRadius: 99 }}>{t}</span>)}</div>}
            <ProjectLinks url={x.url} repo={x.repo} /></div>
        </article>))}</div>;
      case "experience": return <div className="space-y-4">{p.experience.map((e) => (
        <div key={e.id} className="flex flex-col gap-2 p-6 md:flex-row md:items-start md:justify-between" style={glass}>
          <div><h3 className="text-lg font-semibold" style={H}>{e.role}</h3><p style={{ color: "var(--a)" }}>{e.company}</p>{e.description && <p className="mt-2 text-sm" style={muted}>{e.description}</p>}</div>
          <span className="shrink-0 px-3 py-1 text-xs" style={{ border: "1px solid var(--border)", borderRadius: 99 }}>{e.period}</span>
        </div>))}</div>;
      case "education": return <div className="grid gap-4 md:grid-cols-2">{p.education.map((e) => (
        <div key={e.id} className="p-6" style={glass}><h3 className="font-semibold" style={H}>{e.degree}</h3><p style={muted}>{e.school} · {e.period}</p></div>))}</div>;
      case "testimonials": return <div className="grid gap-5 md:grid-cols-2">{p.testimonials.filter((t) => t.quote).map((t) => (
        <figure key={t.id} className="p-7" style={glass}><blockquote className="text-lg">“{t.quote}”</blockquote><figcaption className="mt-4 text-sm" style={muted}><b style={{ color: "var(--fg)" }}>{t.name}</b> · {t.role}</figcaption></figure>))}</div>;
      case "contact": return <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12" style={glass}>
        <div><h3 className="text-4xl font-bold" style={H}>Get in touch</h3><p className="mt-3" style={muted}>I usually reply within a day.</p>{pr.email && <a href={`mailto:${pr.email}`} className="mt-5 block" style={{ color: "var(--a)" }}>{pr.email}</a>}<SocialIcons socials={p.socials} className="mt-6" /></div>
        <ContactForm p={p} preview={preview} />
      </div>;
    }
  };
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--font)" }}>
      <div className="pointer-events-none fixed -left-40 top-0 h-[500px] w-[500px] rounded-full opacity-40 blur-[120px]" style={{ background: "var(--p)" }} />
      <div className="pointer-events-none fixed -right-40 top-1/3 h-[500px] w-[500px] rounded-full opacity-30 blur-[120px]" style={{ background: "var(--a)" }} />
      <div className="relative">
        <header className="sticky top-4 z-30 mx-auto mt-4 flex max-w-5xl items-center justify-between px-6 py-3" style={{ ...glass, borderRadius: 99 }}>
          <span className="font-bold" style={H}>{pr.fullName}</span>
          <Nav p={p} />
        </header>
        <section className="fl-reveal mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
          <div className="inline-block rounded-full p-1" style={{ background: "linear-gradient(135deg,var(--p),var(--a))", boxShadow: "0 0 60px color-mix(in srgb,var(--p) 60%,transparent)" }}><Avatar p={p} size={130} round /></div>
          <h1 className="mt-8 text-5xl font-bold tracking-tight md:text-7xl" style={H}>{pr.fullName}</h1>
          <p className="mt-4 text-xl" style={{ background: "linear-gradient(90deg,var(--p),var(--a))", WebkitBackgroundClip: "text", color: "transparent" }}>{pr.title}</p>
          {pr.tagline && <p className="mx-auto mt-5 max-w-2xl text-lg" style={muted}>{pr.tagline}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#contact" className="px-6 py-3 font-semibold text-white" style={{ background: "linear-gradient(90deg,var(--p),var(--a))", borderRadius: 99 }}>Contact me</a>
            {pr.resumeUrl && <a href={pr.resumeUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 font-semibold" style={{ ...glass, borderRadius: 99 }}>Résumé</a>}
          </div>
          <SocialIcons socials={p.socials} className="mt-8 justify-center" />
        </section>
        {visibleSections(p).map((k) => (
          <section key={k} id={k} className="mx-auto max-w-5xl px-6 py-14">
            <h2 className="mb-8 text-center text-3xl font-bold" style={H}>{label(k)}</h2>
            {render(k)}
          </section>
        ))}
        <Footer p={p} />
      </div>
    </div>
  );
}
