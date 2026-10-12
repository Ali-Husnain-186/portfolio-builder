import { DEFAULT_SECTIONS, TEMPLATES, emptyPortfolio } from "./design";
import type { Portfolio, TemplateId } from "./types";

type DemoPerson = {
  name: string;
  username: string;
  email: string;
  template: TemplateId;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  skills: [string, number][];
  projects: [string, string, string[]][];
  experience: [string, string, string, string][];
  education: [string, string, string][];
  services: [string, string][];
  testimonials: [string, string, string][];
};

export const DEMO_PEOPLE: DemoPerson[] = [
  {
    name: "Ayesha Khan",
    username: "ayesha",
    email: "ayesha@demo.foliolink.app",
    template: "modern",
    title: "Product Designer",
    tagline: "I design calm, useful products people love to come back to.",
    bio: "Product designer with 6 years of experience across fintech and health. I turn messy problems into simple interfaces, run research that changes roadmaps, and ship design systems teams actually use.",
    location: "Lahore, Pakistan",
    skills: [["Figma", 95], ["UX Research", 88], ["Design Systems", 90], ["Prototyping", 85], ["HTML/CSS", 70]],
    projects: [
      ["Pocket Bank", "Redesigned onboarding for a mobile bank — sign-up completion up 34%.", ["Mobile", "Fintech"]],
      ["Clinic Flow", "Appointment and records app for 40+ clinics with offline mode.", ["Health", "SaaS"]],
      ["Atlas DS", "Open design system with 120 components and dark mode.", ["Design System"]],
    ],
    experience: [
      ["Senior Product Designer", "Northwind Fintech", "2022 — Present", "Lead designer for onboarding & payments. Built the company design system."],
      ["Product Designer", "CareLabs", "2019 — 2022", "Designed patient and doctor apps used by 200k people."],
    ],
    education: [["NCA Lahore", "BFA, Communication Design", "2015 — 2019"]],
    services: [["Product Design", "End-to-end product design from research to shipped UI."], ["Design Systems", "Scalable component libraries and documentation."], ["UX Audits", "Find and fix the friction in your product."]],
    testimonials: [["Omar Siddiqui", "CEO, Northwind", "Ayesha transformed how our team thinks about users. Conversion went up the month she joined."]],
  },
  {
    name: "Bilal Ahmed",
    username: "bilal",
    email: "bilal@demo.foliolink.app",
    template: "developer",
    title: "Full-Stack Engineer",
    tagline: "Building fast, reliable web apps with TypeScript, Go and Postgres.",
    bio: "Full-stack engineer who loves performance work and developer tooling. I've built payment systems, real-time dashboards and open-source CLIs used by thousands of developers.",
    location: "Karachi, Pakistan",
    skills: [["TypeScript", 95], ["React / Next.js", 92], ["Go", 80], ["PostgreSQL", 85], ["Docker / K8s", 75], ["AWS", 70]],
    projects: [
      ["rapidq", "Open-source job queue for Node.js — 2.4k GitHub stars.", ["Open Source", "Node.js"]],
      ["LiveOps", "Real-time ops dashboard streaming 50k events/sec.", ["Go", "WebSockets"]],
      ["ShopKit", "Headless e-commerce starter with Stripe and Next.js.", ["Next.js", "Stripe"]],
    ],
    experience: [
      ["Senior Engineer", "Cloudline", "2021 — Present", "Own the billing platform. Cut p95 latency by 60%."],
      ["Software Engineer", "Bytecraft", "2018 — 2021", "Built internal tools and the public API."],
    ],
    education: [["FAST NUCES", "BS Computer Science", "2014 — 2018"]],
    services: [["Web Apps", "Production-ready Next.js and Node apps."], ["APIs & Backends", "Scalable APIs in Go or TypeScript."], ["Performance", "Make slow apps fast."]],
    testimonials: [["Sara Malik", "CTO, Cloudline", "Bilal is the engineer you call when something has to work on the first try."]],
  },
  {
    name: "Sara Malik",
    username: "sara",
    email: "sara@demo.foliolink.app",
    template: "creative",
    title: "Brand & Visual Designer",
    tagline: "Brands with personality. Visuals that stick.",
    bio: "Independent brand designer working with startups and studios worldwide. Identity, packaging, illustration and motion — from first sketch to launch.",
    location: "Islamabad, Pakistan",
    skills: [["Branding", 96], ["Illustration", 90], ["Motion", 78], ["Packaging", 84]],
    projects: [
      ["Chai & Co.", "Full identity and packaging for a tea brand.", ["Branding", "Packaging"]],
      ["Pulse Festival", "Visual identity and motion kit for a music festival.", ["Motion", "Identity"]],
      ["Kitab", "Illustrated book covers series.", ["Illustration"]],
    ],
    experience: [["Founder", "Studio Malik", "2020 — Present", "Brand studio serving 30+ clients."]],
    education: [["Indus Valley School", "BDes Visual Studies", "2014 — 2018"]],
    services: [["Brand Identity", "Logo, type, color and guidelines."], ["Illustration", "Editorial and product illustration."]],
    testimonials: [["Hamza Ali", "Founder, Chai & Co.", "Our packaging sells itself now. Sara nailed it."]],
  },
];

let n = 0;
const id = () => `d${++n}`;

export function demoPortfolio(person: DemoPerson, userId = "demo-" + person.username, template?: TemplateId): Portfolio {
  const p = emptyPortfolio(userId, person.username, person.name, person.email);
  const t = TEMPLATES.find((x) => x.id === (template ?? person.template))!;
  p.design = { ...p.design, template: t.id, ...t.defaults, background: "" };
  p.profile = {
    ...p.profile,
    title: person.title,
    tagline: person.tagline,
    bio: person.bio,
    location: person.location,
    phone: "",
    available: true,
  };
  p.skills = person.skills.map(([name, level]) => ({ id: id(), name, level }));
  p.projects = person.projects.map(([title, description, tags]) => ({ id: id(), title, description, tags, url: "https://example.com", repo: "", image: "" }));
  p.experience = person.experience.map(([role, company, period, description]) => ({ id: id(), role, company, period, description }));
  p.education = person.education.map(([school, degree, period]) => ({ id: id(), school, degree, period, description: "" }));
  p.services = person.services.map(([title, description]) => ({ id: id(), title, description }));
  p.testimonials = person.testimonials.map(([name, role, quote]) => ({ id: id(), name, role, quote }));
  p.socials = { ...p.socials, github: "https://github.com", linkedin: "https://linkedin.com", website: "https://example.com" };
  p.sections = DEFAULT_SECTIONS.map((s) => ({ ...s }));
  p.views = 0;
  return p;
}
