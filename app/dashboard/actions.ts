"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  Education,
  Experience,
  PortfolioFormData,
  Project,
  SocialLinks,
} from "@/lib/types";
import {
  normalizeUsername,
  validateUsernameFormat,
} from "@/lib/username";

function parseJsonArray<T>(raw: FormDataEntryValue | null, fallback: T[]): T[] {
  if (typeof raw !== "string" || !raw.trim()) return fallback;
  try {
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function parseSkills(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseSocials(formData: FormData): SocialLinks {
  return {
    github: String(formData.get("social_github") ?? "").trim() || undefined,
    linkedin: String(formData.get("social_linkedin") ?? "").trim() || undefined,
    twitter: String(formData.get("social_twitter") ?? "").trim() || undefined,
    website: String(formData.get("social_website") ?? "").trim() || undefined,
    youtube: String(formData.get("social_youtube") ?? "").trim() || undefined,
    dribbble: String(formData.get("social_dribbble") ?? "").trim() || undefined,
  };
}

type PayloadResult =
  | { ok: true; data: PortfolioFormData }
  | { ok: false; error: string };

function formToPayload(formData: FormData): PayloadResult {
  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const formatError = validateUsernameFormat(username);
  if (formatError) return { ok: false, error: formatError };

  const full_name = String(formData.get("full_name") ?? "").trim();
  if (!full_name) return { ok: false, error: "Full name is required" };

  return {
    ok: true,
    data: {
      username,
      full_name,
      title: String(formData.get("title") ?? "").trim(),
      bio: String(formData.get("bio") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      skills: parseSkills(formData.get("skills")),
      projects: parseJsonArray<Project>(formData.get("projects_json"), []),
      experience: parseJsonArray<Experience>(formData.get("experience_json"), []),
      education: parseJsonArray<Education>(formData.get("education_json"), []),
      social_links: parseSocials(formData),
    },
  };
}

const CV_MAX_BYTES = 5 * 1024 * 1024;
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export async function savePortfolio(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in" };

  const parsed = formToPayload(formData);
  if (!parsed.ok) return { error: parsed.error };
  const payload = parsed.data;

  // Username uniqueness (allow own)
  const { data: taken } = await supabase
    .from("portfolios")
    .select("user_id")
    .eq("username", payload.username)
    .maybeSingle();

  if (taken && taken.user_id !== user.id) {
    return { error: "Username already taken" };
  }

  const { data: existing } = await supabase
    .from("portfolios")
    .select("id, avatar_url, cv_path, cv_filename")
    .eq("user_id", user.id)
    .maybeSingle();

  let avatar_url = existing?.avatar_url ?? null;
  let cv_path = existing?.cv_path ?? null;
  let cv_filename = existing?.cv_filename ?? null;

  const removeCv = formData.get("remove_cv") === "true";
  if (removeCv && cv_path) {
    await supabase.storage.from("portfolio-files").remove([cv_path]);
    cv_path = null;
    cv_filename = null;
  }

  const avatarFile = formData.get("avatar") as File | null;
  if (avatarFile && avatarFile.size > 0) {
    if (avatarFile.size > AVATAR_MAX_BYTES) {
      return { error: "Avatar must be under 2MB" };
    }
    const ext = avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("portfolio-files")
      .upload(path, avatarFile, { upsert: true, contentType: avatarFile.type });
    if (upErr) return { error: upErr.message };
    const { data: pub } = supabase.storage.from("portfolio-files").getPublicUrl(path);
    avatar_url = `${pub.publicUrl}?t=${Date.now()}`;
  }

  const cvFile = formData.get("cv") as File | null;
  if (cvFile && cvFile.size > 0) {
    if (cvFile.type !== "application/pdf") {
      return { error: "CV must be a PDF file" };
    }
    if (cvFile.size > CV_MAX_BYTES) {
      return { error: "CV must be under 5MB" };
    }
    const path = `${user.id}/cv.pdf`;
    const { error: upErr } = await supabase.storage
      .from("portfolio-files")
      .upload(path, cvFile, { upsert: true, contentType: "application/pdf" });
    if (upErr) return { error: upErr.message };
    cv_path = path;
    cv_filename = cvFile.name;
  }

  const row = {
    user_id: user.id,
    username: payload.username,
    full_name: payload.full_name,
    title: payload.title,
    bio: payload.bio,
    email: payload.email,
    location: payload.location || null,
    skills: payload.skills,
    projects: payload.projects,
    experience: payload.experience,
    education: payload.education,
    social_links: payload.social_links,
    avatar_url,
    cv_path,
    cv_filename,
  };

  if (existing) {
    const { error } = await supabase
      .from("portfolios")
      .update(row)
      .eq("user_id", user.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("portfolios").insert(row);
    if (error) return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/${payload.username}`);
  redirect("/dashboard?saved=1");
}

export async function deletePortfolio(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in" };

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("username, cv_path, avatar_url")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!portfolio) return { error: "No portfolio to delete" };

  // Remove storage folder files
  const { data: files } = await supabase.storage
    .from("portfolio-files")
    .list(user.id);

  if (files?.length) {
    await supabase.storage
      .from("portfolio-files")
      .remove(files.map((f) => `${user.id}/${f.name}`));
  }

  const { error } = await supabase
    .from("portfolios")
    .delete()
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  if (portfolio.username) revalidatePath(`/${portfolio.username}`);
  redirect("/dashboard?deleted=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
