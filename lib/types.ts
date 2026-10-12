export type Role = "user" | "admin";

export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: Role;
  disabled?: boolean;
  createdAt: string;
};

export type PublicUser = Omit<User, "passwordHash">;

export type SectionKey =
  | "about"
  | "skills"
  | "services"
  | "projects"
  | "experience"
  | "education"
  | "testimonials"
  | "contact";

export const SECTION_LABELS: Record<SectionKey, string> = {
  about: "About",
  skills: "Skills",
  services: "Services",
  projects: "Projects",
  experience: "Experience",
  education: "Education",
  testimonials: "Testimonials",
  contact: "Contact",
};

export type Skill = { id: string; name: string; level: number };
export type Project = {
  id: string;
  title: string;
  description: string;
  url: string;
  repo: string;
  image: string;
  tags: string[];
};
export type Experience = { id: string; role: string; company: string; period: string; description: string };
export type Education = { id: string; school: string; degree: string; period: string; description: string };
export type Service = { id: string; title: string; description: string };
export type Testimonial = { id: string; name: string; role: string; quote: string };

export type Socials = {
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  youtube: string;
  dribbble: string;
  behance: string;
  website: string;
};

export type TemplateId = "minimal" | "modern" | "developer" | "creative" | "classic" | "glass";
export type FontId =
  | "inter"
  | "poppins"
  | "space-grotesk"
  | "outfit"
  | "playfair"
  | "dm-serif"
  | "lora"
  | "jetbrains";

export type Design = {
  template: TemplateId;
  mode: "light" | "dark";
  primary: string;
  accent: string;
  background: string; // "" = template default
  font: FontId;
  headingFont: FontId;
  radius: "none" | "sm" | "md" | "lg" | "xl";
  animations: boolean;
};

export type Portfolio = {
  userId: string;
  username: string;
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  profile: {
    fullName: string;
    title: string;
    tagline: string;
    bio: string;
    location: string;
    email: string;
    phone: string;
    avatar: string;
    resumeUrl: string;
    available: boolean;
  };
  skills: Skill[];
  services: Service[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  testimonials: Testimonial[];
  socials: Socials;
  sections: { key: SectionKey; visible: boolean }[];
  design: Design;
  seo: { title: string; description: string };
};

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
};
