"use client";

import type { SectionKey } from "@/lib/types";
import { Avatar, ContactForm, Footer, Nav, ProjectLinks, SocialIcons, visibleSections, type TplProps } from "./shared";

export default function Developer({ p, preview }: TplProps) {
  const pr = p.profile;
  const mono = { fontFamily: "var(--hfont)" };
  const muted = { color: "var(--muted)" };
  const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r)" };
  const render = (k: SectionKey) => {
    switch (k) {
      case "about":
        return <div className="p-6 leading-relaxed" style={card}><span style={{ color: "var(--a)", ...mono }}>{"/**"}</span><p className="whitespace-pre-line py-2 pl-4" style={muted}>{pr.bio}</p><span style={{ color: "var(--a)", ...mono }}>{"*/"}</span></div>;
      case "skills":
        return <div className="flex flex-wrap gap-3">{p.skills.filter((s) => s.name).map((s) => (
          <span key={s.id} className="px-3 py-1.5 text-sm transition hover:-translate-y-0.5" style={{ ...card, ...mono }}>
            <span style={{ color: "var(--p)" }}>{"<"}</span>{s.name}<span style={{ color: "var(--p)" }}>{" />"}</span>
            <span className="ml-2 text-xs" style={muted}>{s.level}%</span>
          </span>))}</div>;
      case "services":
        return <div className="grid gap-4 md:grid-cols-3">{p.services.filter((s) => s.title).map((s) => (
          <div key={s.id} className="p-5" style={card}><h3 className="font-semibold" style={{ ...mono, color: "var(--p)" }}>{s.title.toLowerCase().replace(/\s+/g, "_")}()</h3><p className="mt-2 text-sm" style={muted}>{s.description}</p></div>))}</div>;
      case "projects":
        return <div className="grid gap-5 md:grid-cols-2">{p.projects.filter((x) => x.title).map((x) => (
          <article key={x.id} className="group p-6 transition hover:-translate-y-1" style={{ ...card, boxShadow: "0 0 0 0 var(--p)" }}>
            <div className="flex items-center justify-between"><span style={{ color: "var(--p)", ...mono }}>📁</span><span className="text-xs" style={muted}>{x.tags.join(" · ")}</span></div>
            <h3 className="mt-3 text-lg font-bold transition group-hover:text-[color:var(--p)]" style={mono}>{x.title}</h3>
            <p className="mt-2 text-sm leading-relaxed" style={muted}>{x.description}</p>
            <ProjectLinks url={x.url} repo={x.repo} />
          </article>))}</div>;
      case "experience":
        return <div className="space-y-5" style={mono}>{p.experience.map((e, i) => (
          <div key={e.id} className="text-sm">
            <p><span style={{ color: "var(--a)" }}>commit</span> <span style={{ color: "var(--p)" }}>{(e.id + "a1b2c3d4").slice(0, 7)}</span>{i === 0 && <span style={{ color: "var(--a)" }}> (HEAD -&gt; main)</span>}</p>
            <p style={muted}>Date: {e.period}</p>
            <p className="mt-2 pl-6 text-base font-semibold" style={{ color: "var(--fg)" }}>{e.role} @ {e.company}</p>
            {e.description && <p className="pl-6 font-sans" style={muted}>{e.description}</p>}
          </div>))}</div>;
      case "education":
        return <div className="space-y-3">{p.education.map((e) => (
          <div key={e.id} className="flex flex-wrap justify-between gap-2 p-4" style={card}><span><b>{e.degree}</b> <span style={muted}>@ {e.school}</span></span><span className="text-sm" style={{ ...muted, ...mono }}>{e.period}</span></div>))}</div>;
      case "testimonials":
        return <div className="grid gap-4 md:grid-cols-2">{p.testimonials.filter((t) => t.quote).map((t) => (
          <div key={t.id} className="p-5" style={card}><p style={{ ...mono, color: "var(--a)" }}>{"// "}{t.name}, {t.role}</p><p className="mt-2" style={muted}>&quot;{t.quote}&quot;</p></div>))}</div>;
      case "contact":
        return <div className="grid gap-8 md:grid-cols-2"><div style={mono}><p style={muted}>$ echo $CONTACT</p><p className="mt-2">{pr.email}</p>{pr.phone && <p>{pr.phone}</p>}<SocialIcons socials={p.socials} className="mt-6" /></div><ContactForm p={p} preview={preview} /></div>;
    }
  };
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--font)" }}>
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6" style={mono}>
        <span style={{ color: "var(--p)" }}>~/{p.username}</span>
        <Nav p={p} />
      </header>
      <section className="fl-reveal mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="overflow-hidden shadow-2xl" style={card}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="h-3 w-3 rounded-full bg-red-500" /><span className="h-3 w-3 rounded-full bg-yellow-500" /><span className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-3 text-xs" style={{ ...muted, ...mono }}>bash — {p.username}@foliolink</span>
          </div>
          <div className="grid items-center gap-8 p-6 md:grid-cols-[1fr_auto] md:p-10" style={mono}>
            <div>
              <p style={muted}><span style={{ color: "var(--p)" }}>$</span> whoami</p>
              <h1 className="mt-2 text-4xl font-bold md:text-6xl">{pr.fullName}</h1>
              <p className="mt-4" style={muted}><span style={{ color: "var(--p)" }}>$</span> cat role.txt</p>
              <p className="mt-1 text-xl" style={{ color: "var(--a)" }}>{pr.title}</p>
              {pr.tagline && <><p className="mt-4" style={muted}><span style={{ color: "var(--p)" }}>$</span> cat mission.md</p><p className="mt-1 font-sans text-lg">{pr.tagline}</p></>}
              <p className="mt-4"><span style={{ color: "var(--p)" }}>$</span> <span className="fl-caret">_</span></p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <SocialIcons socials={p.socials} />
                {pr.resumeUrl && <a href={pr.resumeUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-semibold" style={{ border: "1px solid var(--p)", color: "var(--p)", borderRadius: "var(--r)" }}>./resume.pdf</a>}
                {pr.available && <span className="text-sm" style={{ color: "var(--p)" }}>● available</span>}
              </div>
            </div>
            <Avatar p={p} size={180} />
          </div>
        </div>
      </section>
      {visibleSections(p).map((k, i) => (
        <section key={k} id={k} className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="mb-8 text-2xl font-bold" style={mono}><span style={{ color: "var(--p)" }}>{String(i + 1).padStart(2, "0")}.</span> {k}<span style={{ color: "var(--p)" }}>()</span></h2>
          {render(k)}
        </section>
      ))}
      <Footer p={p} />
    </div>
  );
}
