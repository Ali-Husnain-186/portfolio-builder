export type Project = {
  title: string;
  description: string;
  url?: string;
  image_url?: string;
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  bullets: string[];
};

export type Education = {
  school: string;
  degree: string;
  period: string;
};

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  youtube?: string;
  dribbble?: string;
};

export type Portfolio = {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  title: string;
  bio: string;
  email: string;
  location: string | null;
  avatar_url: string | null;
  skills: string[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  social_links: SocialLinks;
  cv_path: string | null;
  cv_filename: string | null;
  created_at: string;
  updated_at: string;
};

export type PortfolioFormData = {
  username: string;
  full_name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  skills: string[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  social_links: SocialLinks;
};
