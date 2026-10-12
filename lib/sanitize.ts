import { ANIM_SPEEDS, ANIMATIONS, DEFAULT_SECTIONS, FONTS, RADIUS, TEMPLATES, templateAnimDefaults, uid } from "./design";
import type { Design, Portfolio, SectionKey } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
const str = (v: any, max = 300) => (typeof v === "string" ? v.slice(0, max) : "");
const color = (v: any, fb: string) => (typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v) ? v : fb);
const arr = (v: any, max: number) => (Array.isArray(v) ? v.slice(0, max) : []);

export function safeUrl(v: any, max = 500): string {
  const s = str(v, max).trim();
  if (!s) return "";
  if (s.startsWith("/api/files/")) return s;
  if (/^mailto:/i.test(s)) return s;
  if (/^https?:\/\//i.test(s)) return s;
  if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(s)) return "https://" + s;
  return "";
}

/** Coerce untrusted client JSON into a valid Portfolio, keeping server-owned fields from `base`. */
export function sanitizePortfolio(input: any, base: Portfolio): Portfolio {
  const i = input && typeof input === "object" ? input : {};
  const pr = i.profile || {};
  const d = i.design || {};
  const templateIds = TEMPLATES.map((t) => t.id);
  const sectionKeys = DEFAULT_SECTIONS.map((s) => s.key);

  const sections: { key: SectionKey; visible: boolean }[] = [];
  for (const s of arr(i.sections, 20)) {
    if (sectionKeys.includes(s?.key) && !sections.find((x) => x.key === s.key))
      sections.push({ key: s.key, visible: !!s.visible });
  }
  for (const s of DEFAULT_SECTIONS) if (!sections.find((x) => x.key === s.key)) sections.push({ ...s });

  const design: Design = {
    template: templateIds.includes(d.template) ? d.template : base.design.template,
    mode: d.mode === "dark" ? "dark" : "light",
    primary: color(d.primary, base.design.primary),
    accent: color(d.accent, base.design.accent),
    background: d.background ? color(d.background, "") : "",
    font: d.font in FONTS ? d.font : base.design.font,
    headingFont: d.headingFont in FONTS ? d.headingFont : base.design.headingFont,
    radius: d.radius in RADIUS ? d.radius : base.design.radius,
    animations: d.animations !== false,
    animation: "none",
    animSpeed: "normal",
    hoverEffects: true,
    typing: false,
    bgFx: false,
    progressBar: true,
    backToTop: true,
  };
  const ad = templateAnimDefaults(design.template);
  const bool = (v: any, fb: boolean | undefined) => (typeof v === "boolean" ? v : fb ?? false);
  design.animation = ANIMATIONS.some((a) => a.id === d.animation) ? d.animation : d.animations === false ? "none" : (ad.animation ?? "fade");
  design.animSpeed = d.animSpeed in ANIM_SPEEDS ? d.animSpeed : (ad.animSpeed ?? "normal");
  design.hoverEffects = bool(d.hoverEffects, ad.hoverEffects ?? true);
  design.typing = bool(d.typing, ad.typing);
  design.bgFx = bool(d.bgFx, ad.bgFx);
  design.progressBar = bool(d.progressBar, ad.progressBar ?? true);
  design.backToTop = bool(d.backToTop, ad.backToTop ?? true);
  design.animations = design.animation !== "none";

  return {
    ...base,
    published: typeof i.published === "boolean" ? i.published : base.published,
    profile: {
      fullName: str(pr.fullName, 80) || base.profile.fullName,
      title: str(pr.title, 100),
      tagline: str(pr.tagline, 200),
      bio: str(pr.bio, 3000),
      location: str(pr.location, 100),
      email: str(pr.email, 120),
      phone: str(pr.phone, 40),
      avatar: safeUrl(pr.avatar),
      resumeUrl: safeUrl(pr.resumeUrl),
      available: !!pr.available,
    },
    skills: arr(i.skills, 50).map((s: any) => ({
      id: str(s?.id, 40) || uid(),
      name: str(s?.name, 60),
      level: Math.max(0, Math.min(100, Number(s?.level) || 0)),
    })),
    services: arr(i.services, 20).map((s: any) => ({ id: str(s?.id, 40) || uid(), title: str(s?.title, 100), description: str(s?.description, 500) })),
    projects: arr(i.projects, 40).map((p: any) => ({
      id: str(p?.id, 40) || uid(),
      title: str(p?.title, 120),
      description: str(p?.description, 1500),
      url: safeUrl(p?.url),
      repo: safeUrl(p?.repo),
      image: safeUrl(p?.image),
      tags: arr(p?.tags, 10).map((t: any) => str(t, 30)).filter(Boolean),
    })),
    experience: arr(i.experience, 30).map((e: any) => ({ id: str(e?.id, 40) || uid(), role: str(e?.role, 100), company: str(e?.company, 100), period: str(e?.period, 60), description: str(e?.description, 1500) })),
    education: arr(i.education, 20).map((e: any) => ({ id: str(e?.id, 40) || uid(), school: str(e?.school, 120), degree: str(e?.degree, 120), period: str(e?.period, 60), description: str(e?.description, 800) })),
    testimonials: arr(i.testimonials, 20).map((t: any) => ({ id: str(t?.id, 40) || uid(), name: str(t?.name, 80), role: str(t?.role, 100), quote: str(t?.quote, 800) })),
    socials: {
      github: safeUrl(i.socials?.github),
      linkedin: safeUrl(i.socials?.linkedin),
      twitter: safeUrl(i.socials?.twitter),
      instagram: safeUrl(i.socials?.instagram),
      youtube: safeUrl(i.socials?.youtube),
      dribbble: safeUrl(i.socials?.dribbble),
      behance: safeUrl(i.socials?.behance),
      website: safeUrl(i.socials?.website),
    },
    sections,
    design,
    seo: { title: str(i.seo?.title, 120), description: str(i.seo?.description, 300) },
  };
}
