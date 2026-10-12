"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Design, Portfolio, SectionKey, Socials } from "@/lib/types";
import { SECTION_LABELS } from "@/lib/types";

export type TplProps = { p: Portfolio; preview?: boolean };

/** Live animation settings for the portfolio being rendered (null = static, e.g. thumbnails). */
export const AnimCtx = createContext<Design | null>(null);

/** Tagline text; types itself out when the "typing" effect is on. */
export function Typed({ text }: { text: string }) {
  const d = useContext(AnimCtx);
  const on = !!d && d.typing && d.animation !== "none";
  const [n, setN] = useState(on ? 0 : text.length);
  useEffect(() => {
    if (!on) { setN(text.length); return; }
    setN(0);
    const speed = d?.animSpeed === "fast" ? 22 : d?.animSpeed === "slow" ? 60 : 38;
    let i = 0;
    const start = setTimeout(function tick() {
      i++;
      setN(i);
      if (i < text.length) timer = setTimeout(tick, speed);
    }, 450);
    let timer: ReturnType<typeof setTimeout> = start;
    return () => clearTimeout(timer);
  }, [text, on, d?.animSpeed]);
  if (!on) return <>{text}</>;
  return (
    <span aria-label={text}>
      <span aria-hidden>{text.slice(0, n)}</span>
      <span aria-hidden className="fl-type-caret">|</span>
    </span>
  );
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

export function visibleSections(p: Portfolio): SectionKey[] {
  return p.sections
    .filter((s) => s.visible)
    .map((s) => s.key)
    .filter((k) => {
      switch (k) {
        case "about": return !!p.profile.bio;
        case "skills": return p.skills.some((s) => s.name);
        case "services": return p.services.some((s) => s.title);
        case "projects": return p.projects.some((s) => s.title);
        case "experience": return p.experience.some((s) => s.role || s.company);
        case "education": return p.education.some((s) => s.school);
        case "testimonials": return p.testimonials.some((s) => s.quote);
        case "contact": return true;
      }
    });
}

export const label = (k: SectionKey) => SECTION_LABELS[k];

const ICONS: Record<keyof Socials, ReactNode> = {
  github: <path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.6.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1.1 1.5 1.1.9 1.6 2.4 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.1 10.1 0 0 0 22 12.2C22 6.6 17.5 2 12 2Z" />,
  linkedin: <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21h-4V9Z" />,
  twitter: <path d="M17.7 3h3.1l-6.8 7.7L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L1.7 3h6.4l4.4 5.9L17.7 3Zm-1.1 16.2h1.7L7.2 4.7H5.4l11.2 14.5Z" />,
  instagram: <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21.9 8c-.1-1.6-.4-3-1.6-4.2C19.1 2.6 17.7 2.2 16 2.1c-1.6-.1-6.5-.1-8.1 0-1.6.1-3 .4-4.2 1.6S2.2 6.3 2.1 8c-.1 1.6-.1 6.5 0 8.1.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.6.1 6.5.1 8.1 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.6.1-6.5 0-8.1Z" />,
  youtube: <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2C.5 9.1.5 12 .5 12s0 2.9.5 4.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-4.8.5-4.8s0-2.9-.5-4.8ZM9.7 15V9l5.8 3-5.8 3Z" />,
  dribbble: <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.6 4.6a8.5 8.5 0 0 1 1.9 5.3c-2.8-.6-5.3-.6-7.5-.1-.2-.5-.4-1-.7-1.5 2.4-1 4.6-2.2 6.3-3.7ZM12 3.5c2 0 3.9.7 5.4 1.9-1.6 1.4-3.6 2.5-5.9 3.4a43 43 0 0 0-3.4-4.9c1.2-.3 2.5-.4 3.9-.4ZM6.6 5.4a41 41 0 0 1 3.4 4.8c-2.6.8-5.4 1.1-8.4 1.1A8.6 8.6 0 0 1 6.6 5.4ZM3.5 12.8c3.4 0 6.6-.4 9.4-1.4l.6 1.3c-3.4 1.2-6.2 3.4-8.2 6.4a8.4 8.4 0 0 1-1.8-6.3Zm8.5 7.7c-1.9 0-3.7-.6-5.1-1.7 1.8-2.8 4.4-4.8 7.5-5.9.9 2.4 1.5 4.9 1.8 7a8.4 8.4 0 0 1-4.2.6Zm5.7-1.6c-.4-2-.9-4.3-1.7-6.5 2-.4 4.2-.3 6.6.2a8.5 8.5 0 0 1-4.9 6.3Z" />,
  behance: <path d="M8.2 11.4c.9-.4 1.4-1.1 1.4-2.1 0-2-1.5-2.8-3.5-2.8H1v11h5.3c2.1 0 3.9-1 3.9-3.2 0-1.4-.7-2.4-2-2.9ZM3.4 8.4h2.2c.8 0 1.6.2 1.6 1.2 0 .9-.6 1.2-1.4 1.2H3.4V8.4Zm2.4 7.2H3.4v-3h2.5c1 0 1.7.4 1.7 1.5s-.8 1.5-1.8 1.5ZM15.5 3.6h5v1.3h-5V3.6Zm2.6 4.3c-2.8 0-4.6 2-4.6 4.6 0 2.7 1.7 4.6 4.6 4.6 2.2 0 3.6-1 4.3-3.1h-2.2c-.3.8-1.2 1.2-2 1.2-1.5 0-2.3-.9-2.3-2.4h6.6c.2-3-1.4-4.9-4.4-4.9Zm-2.2 3.7c.1-1.2.9-2 2.1-2 1.3 0 1.9.7 2 2h-4.1Z" />,
  website: <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-2.9a15.7 15.7 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8ZM12 4c.8 1.2 1.5 2.5 1.9 4h-3.8c.4-1.4 1.1-2.8 1.9-4ZM4.3 14a8.2 8.2 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4H4.3Zm.8 2h2.9c.3 1.3.8 2.5 1.4 3.6A8 8 0 0 1 5.1 16ZM8 8H5.1a8 8 0 0 1 4.3-3.6C8.8 5.5 8.3 6.7 8 8Zm4 12c-.8-1.2-1.5-2.5-1.9-4h3.8c-.4 1.4-1.1 2.8-1.9 4Zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4Zm.3 5.6c.6-1.1 1.1-2.3 1.4-3.6h2.9a8 8 0 0 1-4.3 3.6Zm1.7-5.6a16.5 16.5 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4h-3.4Z" />,
};

export function SocialIcons({ socials, className = "", size = 20 }: { socials: Socials; className?: string; size?: number }) {
  const entries = (Object.keys(ICONS) as (keyof Socials)[]).filter((k) => socials[k]);
  if (!entries.length) return null;
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {entries.map((k) => (
        <a key={k} href={socials[k]} target="_blank" rel="noopener noreferrer" aria-label={k} title={k}
          className="inline-flex items-center justify-center opacity-80 transition hover:opacity-100 hover:-translate-y-0.5">
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">{ICONS[k]}</svg>
        </a>
      ))}
    </div>
  );
}

export function Avatar({ p, size = 120, className = "", round = false }: { p: Portfolio; size?: number; className?: string; round?: boolean }) {
  const style = { width: size, height: size, borderRadius: round ? "9999px" : "calc(var(--r) * 1.6)" };
  if (p.profile.avatar)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={p.profile.avatar} alt={p.profile.fullName} style={style} className={`object-cover ${className}`} />;
  return (
    <div style={{ ...style, background: "linear-gradient(135deg,var(--p),var(--a))", fontSize: size * 0.36 }}
      className={`flex items-center justify-center font-bold text-white ${className}`}>
      {initials(p.profile.fullName)}
    </div>
  );
}

export function ProjectImage({ src, title, className = "" }: { src: string; title: string; className?: string }) {
  if (src)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={title} className={`h-full w-full object-cover ${className}`} />;
  return (
    <div className={`flex h-full w-full items-center justify-center text-3xl font-bold text-white/90 ${className}`}
      style={{ background: "linear-gradient(135deg, var(--p), var(--a))", fontFamily: "var(--hfont)" }}>
      {initials(title)}
    </div>
  );
}

export function ContactForm({ p, preview, className = "", inputClass = "", buttonClass = "" }: TplProps & { className?: string; inputClass?: string; buttonClass?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (preview) { setState("sent"); return; }
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch(`/api/contact/${p.username}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (r.ok) setState("sent");
    else { setState("error"); setError((await r.json().catch(() => ({}))).error || "Something went wrong."); }
  }
  if (state === "sent")
    return <div className={`p-6 text-center ${className}`} style={{ borderRadius: "var(--r)", border: "1px solid var(--border)" }}>
      <div className="text-2xl">✓</div><p className="mt-2 font-semibold">Message sent!</p><p className="text-sm" style={{ color: "var(--muted)" }}>{p.profile.fullName.split(" ")[0]} will get back to you soon.</p>
    </div>;
  const inp = `w-full px-4 py-3 bg-transparent outline-none transition focus:border-[color:var(--p)] ${inputClass}`;
  const st = { borderRadius: "var(--r)", border: "1px solid var(--border)", background: "var(--card)" };
  return (
    <form onSubmit={submit} className={`grid gap-3 ${className}`}>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-3 sm:grid-cols-2">
        <input required name="name" placeholder="Your name" className={inp} style={st} />
        <input required type="email" name="email" placeholder="Your email" className={inp} style={st} />
      </div>
      <textarea required name="message" rows={5} placeholder="Your message" className={inp} style={st} />
      {state === "error" && <p className="text-sm text-red-500">{error}</p>}
      <button disabled={state === "sending"} className={`px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60 ${buttonClass}`}
        style={{ background: "var(--p)", borderRadius: "var(--r)" }}>
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

export function Footer({ p }: { p: Portfolio }) {
  return (
    <footer className="py-10 text-center text-sm" style={{ color: "var(--muted)" }}>
      © {new Date().getFullYear()} {p.profile.fullName} · Built with{" "}
      <Link href="/" className="underline decoration-dotted hover:opacity-80">FolioLink</Link>
    </footer>
  );
}

export function SkillBar({ name, level }: { name: string; level: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm"><span className="font-medium">{name}</span><span style={{ color: "var(--muted)" }}>{level}%</span></div>
      <div className="h-2 overflow-hidden" style={{ background: "var(--border)", borderRadius: 99 }}>
        <div className="h-full fl-grow" style={{ width: `${level}%`, background: "linear-gradient(90deg,var(--p),var(--a))", borderRadius: 99 }} />
      </div>
    </div>
  );
}

export function ProjectLinks({ url, repo }: { url: string; repo: string }) {
  if (!url && !repo) return null;
  return (
    <div className="mt-4 flex gap-4 text-sm font-semibold">
      {url && <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--p)" }} className="hover:underline">Live ↗</a>}
      {repo && <a href={repo} target="_blank" rel="noopener noreferrer" style={{ color: "var(--p)" }} className="hover:underline">Code ↗</a>}
    </div>
  );
}

export function Nav({ p, className = "", linkClass = "" }: { p: Portfolio; className?: string; linkClass?: string }) {
  const secs = visibleSections(p).filter((k) => k !== "about").slice(0, 5);
  return (
    <nav className={`hidden gap-6 text-sm md:flex ${className}`}>
      {secs.map((k) => <a key={k} href={`#${k}`} className={`opacity-75 transition hover:opacity-100 ${linkClass}`}>{label(k)}</a>)}
    </nav>
  );
}
