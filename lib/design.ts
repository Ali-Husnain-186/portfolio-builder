import type { Design, FontId, Portfolio, SectionKey, TemplateId } from "./types";

export const TEMPLATES: {
  id: TemplateId;
  name: string;
  description: string;
  defaults: Partial<Design>;
}[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Bold gradient hero, card grid, perfect for most professionals.",
    defaults: { mode: "light", primary: "#6d28d9", accent: "#ec4899", font: "inter", headingFont: "poppins", radius: "lg" },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, typographic and quiet. Lets your work speak.",
    defaults: { mode: "light", primary: "#111827", accent: "#2563eb", font: "inter", headingFont: "inter", radius: "sm" },
  },
  {
    id: "developer",
    name: "Developer",
    description: "Terminal-inspired, monospace accents, dark by default.",
    defaults: { mode: "dark", primary: "#22c55e", accent: "#38bdf8", font: "inter", headingFont: "jetbrains", radius: "md" },
  },
  {
    id: "creative",
    name: "Creative",
    description: "Big type, playful color blocks, made for designers.",
    defaults: { mode: "light", primary: "#f97316", accent: "#0ea5e9", font: "outfit", headingFont: "space-grotesk", radius: "xl" },
  },
  {
    id: "classic",
    name: "Classic",
    description: "Elegant serif, résumé-style sidebar layout.",
    defaults: { mode: "light", primary: "#0d7377", accent: "#b45309", font: "lora", headingFont: "playfair", radius: "sm" },
  },
  {
    id: "glass",
    name: "Glass",
    description: "Dark glassmorphism with glowing gradients.",
    defaults: { mode: "dark", primary: "#8b5cf6", accent: "#06b6d4", font: "outfit", headingFont: "outfit", radius: "xl" },
  },
];

export const FONTS: Record<FontId, { label: string; css: string; google: string }> = {
  inter: { label: "Inter", css: "'Inter', system-ui, sans-serif", google: "Inter:wght@400;500;600;700;800" },
  poppins: { label: "Poppins", css: "'Poppins', system-ui, sans-serif", google: "Poppins:wght@400;500;600;700;800" },
  "space-grotesk": { label: "Space Grotesk", css: "'Space Grotesk', system-ui, sans-serif", google: "Space+Grotesk:wght@400;500;600;700" },
  outfit: { label: "Outfit", css: "'Outfit', system-ui, sans-serif", google: "Outfit:wght@400;500;600;700;800" },
  playfair: { label: "Playfair Display", css: "'Playfair Display', Georgia, serif", google: "Playfair+Display:wght@400;600;700;800" },
  "dm-serif": { label: "DM Serif Display", css: "'DM Serif Display', Georgia, serif", google: "DM+Serif+Display" },
  lora: { label: "Lora", css: "'Lora', Georgia, serif", google: "Lora:wght@400;500;600;700" },
  jetbrains: { label: "JetBrains Mono", css: "'JetBrains Mono', ui-monospace, monospace", google: "JetBrains+Mono:wght@400;500;700" },
};

export function fontHref(ids: FontId[]) {
  const fam = Array.from(new Set(ids)).map((id) => "family=" + FONTS[id].google);
  return `https://fonts.googleapis.com/css2?${fam.join("&")}&display=swap`;
}

export const COLOR_PRESETS: { name: string; primary: string; accent: string }[] = [
  { name: "Violet", primary: "#6d28d9", accent: "#ec4899" },
  { name: "Ocean", primary: "#0369a1", accent: "#14b8a6" },
  { name: "Forest", primary: "#15803d", accent: "#ca8a04" },
  { name: "Sunset", primary: "#ea580c", accent: "#e11d48" },
  { name: "Mono", primary: "#111827", accent: "#6b7280" },
  { name: "Teal", primary: "#0d7377", accent: "#b45309" },
  { name: "Neon", primary: "#22c55e", accent: "#38bdf8" },
  { name: "Rose", primary: "#be185d", accent: "#7c3aed" },
];

export const RADIUS: Record<Design["radius"], string> = {
  none: "0px",
  sm: "4px",
  md: "10px",
  lg: "16px",
  xl: "26px",
};

export const DEFAULT_SECTIONS: { key: SectionKey; visible: boolean }[] = [
  { key: "about", visible: true },
  { key: "skills", visible: true },
  { key: "services", visible: true },
  { key: "projects", visible: true },
  { key: "experience", visible: true },
  { key: "education", visible: true },
  { key: "testimonials", visible: true },
  { key: "contact", visible: true },
];

export function themeVars(d: Design): Record<string, string> {
  const dark = d.mode === "dark";
  const defaults: Record<TemplateId, [string, string]> = {
    modern: ["#fafafa", "#0b0b14"],
    minimal: ["#ffffff", "#0a0a0a"],
    developer: ["#f6f8fa", "#0d1117"],
    creative: ["#fff8f1", "#141210"],
    classic: ["#f7f4ee", "#16181d"],
    glass: ["#eef2ff", "#070712"],
  };
  const bg = d.background || defaults[d.template][dark ? 1 : 0];
  return {
    "--p": d.primary,
    "--a": d.accent,
    "--bg": bg,
    "--fg": dark ? "#f4f4f5" : "#111318",
    "--muted": dark ? "#a1a1aa" : "#5b6170",
    "--card": dark ? "rgba(255,255,255,0.05)" : "#ffffff",
    "--border": dark ? "rgba(255,255,255,0.12)" : "rgba(17,19,24,0.10)",
    "--r": RADIUS[d.radius],
    "--font": FONTS[d.font].css,
    "--hfont": FONTS[d.headingFont].css,
  };
}

export function emptyPortfolio(userId: string, username: string, name: string, email: string): Portfolio {
  const now = new Date().toISOString();
  const t = TEMPLATES[0];
  return {
    userId,
    username,
    published: true,
    views: 0,
    createdAt: now,
    updatedAt: now,
    profile: {
      fullName: name,
      title: "",
      tagline: "",
      bio: "",
      location: "",
      email,
      phone: "",
      avatar: "",
      resumeUrl: "",
      available: true,
    },
    skills: [],
    services: [],
    projects: [],
    experience: [],
    education: [],
    testimonials: [],
    socials: { github: "", linkedin: "", twitter: "", instagram: "", youtube: "", dribbble: "", behance: "", website: "" },
    sections: DEFAULT_SECTIONS.map((s) => ({ ...s })),
    design: {
      template: t.id,
      mode: "light",
      primary: "#6d28d9",
      accent: "#ec4899",
      background: "",
      font: "inter",
      headingFont: "poppins",
      radius: "lg",
      animations: true,
      ...t.defaults,
    },
    seo: { title: "", description: "" },
  };
}

export const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
