"use client";

import type { SectionKey } from "@/lib/types";
import { Avatar, ContactForm, Footer, ProjectImage, ProjectLinks, SocialIcons, label, visibleSections, type TplProps } from "./shared";

export default function Creative({ p, preview }: TplProps) {
  const pr = p.profile;
  const muted = { color: "var(--muted)" };
  const H = { fontFamily: "var(--hfont)" };
  const render = (k: SectionKey) => {
    switch (k) {
      case "about":
        return <p className="max-w-4xl whitespace-pre-line text-2xl leading-snug md:text-3xl" style={H}>{pr.bio}</p>;
      case "skills":
        return (
          <div className="-mx-6 overflow-hidden py-4" style={{ background: "var(--fg)", color: "var(--bg)" }}>
            <div className="fl-marquee flex w-max gap-10 whitespace-nowrap text-3xl font-bold md:text-5xl" style={H}>
              {[...p.skills, ...p.skills].filter((s) => s.name).map((s, i) => <span key={i}>{s.name} <span style={{ color: i % 2 ? "var(--a)" : "var(--p)" }}>✺</span></span>)}
            </div>
          </div>
        );
      case "services":
        return <div className="grid gap-4 md:grid-cols-3">{p.services.filter((s) => s.title).map((s, i) => (
          <div key={s.id} className="p-8 text-white transition hover:rotate-[-1deg]" style={{ background: i % 2 ? "var(--a)" : "var(--p)", borderRadius: "var(--r)" }}>
            <p className="text-6xl font-black opacity-30" style={H}>0{i + 1}</p><h3 className="mt-2 text-2xl font-bold" style={H}>{s.title}</h3><p className="mt-2 opacity-90">{s.description}</p>
          </div>))}</div>;
      case "projects":
        return <div className="grid gap-5 md:grid-cols-6">{p.projects.filter((x) => x.title).map((x, i) => (
          <article key={x.id} className={`group relative overflow-hidden ${i % 3 === 0 ? "md:col-span-4" : "md:col-span-2"}`} style={{ borderRadius: "var(--r)", minHeight: 320 }}>
            <div className="absolute inset-0"><ProjectImage src={x.image} title={x.title} className="transition duration-700 group-hover:scale-110" /></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 p-6 text-white">
              <p className="text-xs uppercase tracking-widest opacity-80">{x.tags.join(" · ")}</p>
              <h3 className="text-2xl font-bold" style={H}>{x.title}</h3>
              <p className="mt-1 max-w-md text-sm opacity-90">{x.description}</p>
              <div className="[&_a]:!text-white"><ProjectLinks url={x.url} repo={x.repo} /></div>
            </div>
          </article>))}</div>;
      case "experience":
        return <div>{p.experience.map((e) => (
          <div key={e.id} className="grid gap-2 py-6 md:grid-cols-[1fr_2fr_1fr]" style={{ borderTop: "2px solid var(--fg)" }}>
            <h3 className="text-2xl font-bold" style={H}>{e.company}</h3><div><p className="font-semibold">{e.role}</p><p className="text-sm" style={muted}>{e.description}</p></div><p className="md:text-right" style={muted}>{e.period}</p>
          </div>))}</div>;
      case "education":
        return <div>{p.education.map((e) => (
          <div key={e.id} className="grid gap-2 py-5 md:grid-cols-[1fr_2fr_1fr]" style={{ borderTop: "2px solid var(--fg)" }}>
            <h3 className="text-xl font-bold" style={H}>{e.school}</h3><p>{e.degree}</p><p className="md:text-right" style={muted}>{e.period}</p>
          </div>))}</div>;
      case "testimonials":
        return <div className="space-y-10">{p.testimonials.filter((t) => t.quote).map((t) => (
          <figure key={t.id}><blockquote className="text-3xl font-semibold leading-tight md:text-4xl" style={H}>“{t.quote}”</blockquote><figcaption className="mt-4" style={{ color: "var(--p)" }}>{t.name} — {t.role}</figcaption></figure>))}</div>;
      case "contact":
        return <div className="grid gap-10 p-8 md:grid-cols-2 md:p-14" style={{ background: "var(--p)", color: "white", borderRadius: "var(--r)" }}>
          <div><h3 className="text-5xl font-black leading-none md:text-7xl" style={H}>Say hello!</h3>{pr.email && <a href={`mailto:${pr.email}`} className="mt-6 block text-xl underline">{pr.email}</a>}<SocialIcons socials={p.socials} className="mt-6" size={24} /></div>
          <div className="[&_input]:!bg-white/10 [&_textarea]:!bg-white/10 [&_input]:placeholder-white/70 [&_textarea]:placeholder-white/70 [&_button]:!bg-white [&_button]:!text-black"><ContactForm p={p} preview={preview} /></div>
        </div>;
    }
  };
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--font)" }}>
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <span className="text-xl font-black" style={H}>{pr.fullName.split(" ")[0].toLowerCase()}<span style={{ color: "var(--p)" }}>*</span></span>
        <a href="#contact" className="px-5 py-2 font-semibold" style={{ border: "2px solid var(--fg)", borderRadius: 99 }}>Let&apos;s talk →</a>
      </header>
      <section className="fl-reveal mx-auto max-w-7xl px-6 pb-16 pt-10 md:pt-16">
        <div className="flex flex-wrap items-end gap-6">
          <h1 className="text-[15vw] font-black uppercase leading-[0.85] tracking-tighter md:text-[9rem]" style={H}>
            {pr.fullName.split(" ")[0]}<br /><span style={{ color: "var(--p)" }}>{pr.fullName.split(" ").slice(1).join(" ") || pr.title}</span>
          </h1>
          <div className="mb-3 rotate-3"><Avatar p={p} size={150} /></div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-[2fr_1fr]">
          <p className="text-2xl md:text-3xl" style={H}>{pr.tagline || pr.title}</p>
          <div className="space-y-2 text-sm md:text-right" style={muted}>
            <p className="text-base font-semibold" style={{ color: "var(--fg)" }}>{pr.title}</p>
            {pr.location && <p>{pr.location}</p>}
            {pr.available && <p style={{ color: "var(--a)" }}>● Taking new projects</p>}
            {pr.resumeUrl && <a href={pr.resumeUrl} target="_blank" rel="noopener noreferrer" className="underline">Résumé ↗</a>}
          </div>
        </div>
      </section>
      {visibleSections(p).map((k) => (
        <section key={k} id={k} className="mx-auto max-w-7xl px-6 py-14">
          {k !== "skills" && <h2 className="mb-8 text-sm font-bold uppercase tracking-[0.3em]" style={{ color: "var(--p)" }}>✺ {label(k)}</h2>}
          {render(k)}
        </section>
      ))}
      <Footer p={p} />
    </div>
  );
}
