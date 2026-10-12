"use client";

import type { SectionKey } from "@/lib/types";
import { Avatar, ContactForm, Footer, Nav, ProjectImage, ProjectLinks, SkillBar, SocialIcons, label, visibleSections, type TplProps } from "./shared";

export default function Modern({ p, preview }: TplProps) {
  const pr = p.profile;
  const H = ({ k }: { k: SectionKey }) => (
    <div className="mb-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--p)" }}>{label(k)}</p>
      <div className="mt-3 h-1 w-14" style={{ background: "linear-gradient(90deg,var(--p),var(--a))", borderRadius: 9 }} />
    </div>
  );
  const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r)" };

  const render = (k: SectionKey) => {
    switch (k) {
      case "about":
        return <p className="max-w-3xl whitespace-pre-line text-lg leading-relaxed" style={{ color: "var(--muted)" }}>{pr.bio}</p>;
      case "skills":
        return <div className="grid gap-5 sm:grid-cols-2">{p.skills.filter((s) => s.name).map((s) => <SkillBar key={s.id} {...s} />)}</div>;
      case "services":
        return <div className="grid gap-5 md:grid-cols-3">{p.services.filter((s) => s.title).map((s, i) => (
          <div key={s.id} className="p-6 transition hover:-translate-y-1 hover:shadow-xl" style={card}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center font-bold text-white" style={{ background: "linear-gradient(135deg,var(--p),var(--a))", borderRadius: "var(--r)" }}>{i + 1}</div>
            <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--hfont)" }}>{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{s.description}</p>
          </div>))}</div>;
      case "projects":
        return <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{p.projects.filter((x) => x.title).map((x) => (
          <article key={x.id} className="group overflow-hidden transition hover:-translate-y-1 hover:shadow-2xl" style={card}>
            <div className="aspect-[16/10] overflow-hidden"><ProjectImage src={x.image} title={x.title} className="transition duration-500 group-hover:scale-105" /></div>
            <div className="p-6">
              <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--hfont)" }}>{x.title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{x.description}</p>
              {x.tags.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{x.tags.map((t) => <span key={t} className="px-2.5 py-1 text-xs font-medium" style={{ background: "color-mix(in srgb,var(--p) 12%,transparent)", color: "var(--p)", borderRadius: 99 }}>{t}</span>)}</div>}
              <ProjectLinks url={x.url} repo={x.repo} />
            </div>
          </article>))}</div>;
      case "experience":
        return <div className="relative space-y-8 border-l-2 pl-8" style={{ borderColor: "var(--border)" }}>{p.experience.map((e) => (
          <div key={e.id} className="relative">
            <span className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full ring-4" style={{ background: "var(--p)", boxShadow: "0 0 0 4px var(--bg)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--p)" }}>{e.period}</p>
            <h3 className="text-xl font-semibold" style={{ fontFamily: "var(--hfont)" }}>{e.role} <span style={{ color: "var(--muted)" }}>· {e.company}</span></h3>
            {e.description && <p className="mt-2 whitespace-pre-line leading-relaxed" style={{ color: "var(--muted)" }}>{e.description}</p>}
          </div>))}</div>;
      case "education":
        return <div className="grid gap-5 md:grid-cols-2">{p.education.map((e) => (
          <div key={e.id} className="p-6" style={card}>
            <p className="text-sm" style={{ color: "var(--p)" }}>{e.period}</p>
            <h3 className="mt-1 text-lg font-semibold" style={{ fontFamily: "var(--hfont)" }}>{e.degree}</h3>
            <p style={{ color: "var(--muted)" }}>{e.school}</p>
            {e.description && <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>{e.description}</p>}
          </div>))}</div>;
      case "testimonials":
        return <div className="grid gap-6 md:grid-cols-2">{p.testimonials.filter((t) => t.quote).map((t) => (
          <figure key={t.id} className="p-8" style={card}>
            <div className="text-5xl leading-none" style={{ color: "var(--a)" }}>“</div>
            <blockquote className="text-lg leading-relaxed">{t.quote}</blockquote>
            <figcaption className="mt-5 text-sm"><b>{t.name}</b> <span style={{ color: "var(--muted)" }}>— {t.role}</span></figcaption>
          </figure>))}</div>;
      case "contact":
        return <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-3xl font-bold" style={{ fontFamily: "var(--hfont)" }}>Let&apos;s work together</h3>
            <p className="mt-3" style={{ color: "var(--muted)" }}>Have a project in mind or just want to say hi? My inbox is open.</p>
            <div className="mt-6 space-y-2 text-sm">
              {pr.email && <p>✉️ <a href={`mailto:${pr.email}`} className="hover:underline">{pr.email}</a></p>}
              {pr.phone && <p>📞 {pr.phone}</p>}
              {pr.location && <p>📍 {pr.location}</p>}
            </div>
            <SocialIcons socials={p.socials} className="mt-6" />
          </div>
          <ContactForm p={p} preview={preview} />
        </div>;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--font)" }}>
      <header className="sticky top-0 z-30 backdrop-blur-md" style={{ background: "color-mix(in srgb,var(--bg) 75%,transparent)", borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="text-lg font-bold" style={{ fontFamily: "var(--hfont)" }}>{pr.fullName.split(" ")[0]}<span style={{ color: "var(--p)" }}>.</span></a>
          <Nav p={p} />
          <a href="#contact" className="px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--p)", borderRadius: "var(--r)" }}>Hire me</a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl" style={{ background: "var(--p)" }} />
        <div className="pointer-events-none absolute -right-20 top-20 h-80 w-80 rounded-full opacity-25 blur-3xl" style={{ background: "var(--a)" }} />
        <div className="fl-reveal relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-[1.4fr_1fr] md:py-32">
          <div>
            {pr.available && <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 99 }}><span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />Available for work</span>}
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl" style={{ fontFamily: "var(--hfont)" }}>
              Hi, I&apos;m <span style={{ background: "linear-gradient(90deg,var(--p),var(--a))", WebkitBackgroundClip: "text", color: "transparent" }}>{pr.fullName}</span>
            </h1>
            {pr.title && <p className="mt-4 text-xl font-medium">{pr.title}</p>}
            {pr.tagline && <p className="mt-3 max-w-xl text-lg" style={{ color: "var(--muted)" }}>{pr.tagline}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#projects" className="px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5" style={{ background: "linear-gradient(90deg,var(--p),var(--a))", borderRadius: "var(--r)" }}>View my work</a>
              {pr.resumeUrl && <a href={pr.resumeUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 font-semibold" style={{ border: "1px solid var(--border)", borderRadius: "var(--r)", background: "var(--card)" }}>Download CV</a>}
            </div>
            <SocialIcons socials={p.socials} className="mt-8" />
          </div>
          <div className="flex justify-center">
            <div className="p-2" style={{ background: "linear-gradient(135deg,var(--p),var(--a))", borderRadius: "calc(var(--r) * 2)" }}>
              <Avatar p={p} size={280} className="max-w-full" />
            </div>
          </div>
        </div>
      </section>

      {visibleSections(p).map((k, i) => (
        <section key={k} id={k} className="py-20" style={{ background: i % 2 ? "transparent" : "color-mix(in srgb,var(--p) 3%,transparent)" }}>
          <div className="mx-auto max-w-6xl px-6"><H k={k} />{render(k)}</div>
        </section>
      ))}
      <Footer p={p} />
    </div>
  );
}
