"use client";

import { useActionState, useState } from "react";
import { savePortfolio } from "@/app/dashboard/actions";
import { UsernameField } from "@/components/username-field";
import type {
  Education,
  Experience,
  Portfolio,
  Project,
  SocialLinks,
} from "@/lib/types";

type Props = {
  portfolio: Portfolio | null;
  userId: string;
  defaultEmail?: string;
};

const emptyProject = (): Project => ({
  title: "",
  description: "",
  url: "",
});

const emptyExperience = (): Experience => ({
  company: "",
  role: "",
  period: "",
  bullets: [""],
});

const emptyEducation = (): Education => ({
  school: "",
  degree: "",
  period: "",
});

export function PortfolioForm({ portfolio, userId, defaultEmail }: Props) {
  const [state, formAction, pending] = useActionState(savePortfolio, null);
  const [username, setUsername] = useState(portfolio?.username ?? "");
  const [skills, setSkills] = useState((portfolio?.skills ?? []).join(", "));
  const [projects, setProjects] = useState<Project[]>(
    portfolio?.projects?.length ? portfolio.projects : [emptyProject()],
  );
  const [experience, setExperience] = useState<Experience[]>(
    portfolio?.experience?.length ? portfolio.experience : [emptyExperience()],
  );
  const [education, setEducation] = useState<Education[]>(
    portfolio?.education?.length ? portfolio.education : [emptyEducation()],
  );
  const [removeCv, setRemoveCv] = useState(false);
  const socials: SocialLinks = portfolio?.social_links ?? {};

  return (
    <form action={formAction} className="mx-auto max-w-2xl space-y-10 pb-16">
      <input type="hidden" name="projects_json" value={JSON.stringify(projects)} />
      <input
        type="hidden"
        name="experience_json"
        value={JSON.stringify(experience)}
      />
      <input
        type="hidden"
        name="education_json"
        value={JSON.stringify(education)}
      />
      <input type="hidden" name="remove_cv" value={removeCv ? "true" : "false"} />

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-[var(--ink)]">Profile</h2>
        <UsernameField
          value={username}
          onChange={setUsername}
          excludeUserId={userId}
          initialUsername={portfolio?.username}
        />
        <Field
          label="Full name"
          name="full_name"
          required
          defaultValue={portfolio?.full_name ?? ""}
        />
        <Field
          label="Title"
          name="title"
          placeholder="Full Stack Developer"
          defaultValue={portfolio?.title ?? ""}
        />
        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Bio
          </span>
          <textarea
            name="bio"
            rows={4}
            defaultValue={portfolio?.bio ?? ""}
            className="w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2.5 text-sm outline-none ring-[var(--accent)] focus:ring-2"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Email"
            name="email"
            type="email"
            defaultValue={portfolio?.email || defaultEmail || ""}
          />
          <Field
            label="Location"
            name="location"
            placeholder="Lahore, Pakistan"
            defaultValue={portfolio?.location ?? ""}
          />
        </div>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Skills (comma separated)
          </span>
          <input
            name="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, Node.js, TypeScript"
            className="w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2.5 text-sm outline-none ring-[var(--accent)] focus:ring-2"
          />
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-[var(--ink)]">Media</h2>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Avatar (optional)
          </span>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="block w-full text-sm text-[var(--muted)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--surface)] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[var(--ink)]"
          />
          {portfolio?.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portfolio.avatar_url}
              alt="Current avatar"
              className="mt-2 h-16 w-16 rounded-full object-cover"
            />
          )}
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            CV / Resume PDF (optional)
          </span>
          <input
            type="file"
            name="cv"
            accept="application/pdf"
            className="block w-full text-sm text-[var(--muted)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--surface)] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[var(--ink)]"
          />
          {portfolio?.cv_filename && !removeCv && (
            <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
              <span>Current: {portfolio.cv_filename}</span>
              <button
                type="button"
                onClick={() => setRemoveCv(true)}
                className="text-red-600 underline-offset-2 hover:underline"
              >
                Remove
              </button>
            </div>
          )}
          {removeCv && (
            <p className="text-sm text-amber-700">CV will be removed on save.</p>
          )}
        </label>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-[var(--ink)]">Projects</h2>
          <button
            type="button"
            onClick={() => setProjects([...projects, emptyProject()])}
            className="text-sm font-medium text-[var(--accent)]"
          >
            + Add
          </button>
        </div>
        {projects.map((p, i) => (
          <div
            key={i}
            className="space-y-3 rounded-xl border border-[var(--line)] bg-white p-4"
          >
            <FieldInline
              label="Title"
              value={p.title}
              onChange={(v) => {
                const next = [...projects];
                next[i] = { ...next[i], title: v };
                setProjects(next);
              }}
            />
            <label className="block space-y-1">
              <span className="text-xs text-[var(--muted)]">Description</span>
              <textarea
                rows={2}
                value={p.description}
                onChange={(e) => {
                  const next = [...projects];
                  next[i] = { ...next[i], description: e.target.value };
                  setProjects(next);
                }}
                className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </label>
            <FieldInline
              label="URL"
              value={p.url ?? ""}
              onChange={(v) => {
                const next = [...projects];
                next[i] = { ...next[i], url: v };
                setProjects(next);
              }}
            />
            {projects.length > 1 && (
              <button
                type="button"
                onClick={() => setProjects(projects.filter((_, j) => j !== i))}
                className="text-xs text-red-600"
              >
                Remove project
              </button>
            )}
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-[var(--ink)]">Experience</h2>
          <button
            type="button"
            onClick={() => setExperience([...experience, emptyExperience()])}
            className="text-sm font-medium text-[var(--accent)]"
          >
            + Add
          </button>
        </div>
        {experience.map((ex, i) => (
          <div
            key={i}
            className="space-y-3 rounded-xl border border-[var(--line)] bg-white p-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <FieldInline
                label="Company"
                value={ex.company}
                onChange={(v) => {
                  const next = [...experience];
                  next[i] = { ...next[i], company: v };
                  setExperience(next);
                }}
              />
              <FieldInline
                label="Role"
                value={ex.role}
                onChange={(v) => {
                  const next = [...experience];
                  next[i] = { ...next[i], role: v };
                  setExperience(next);
                }}
              />
            </div>
            <FieldInline
              label="Period"
              value={ex.period}
              onChange={(v) => {
                const next = [...experience];
                next[i] = { ...next[i], period: v };
                setExperience(next);
              }}
            />
            <label className="block space-y-1">
              <span className="text-xs text-[var(--muted)]">
                Highlights (one per line)
              </span>
              <textarea
                rows={3}
                value={(ex.bullets ?? []).join("\n")}
                onChange={(e) => {
                  const next = [...experience];
                  next[i] = {
                    ...next[i],
                    bullets: e.target.value.split("\n"),
                  };
                  setExperience(next);
                }}
                className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </label>
            {experience.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setExperience(experience.filter((_, j) => j !== i))
                }
                className="text-xs text-red-600"
              >
                Remove experience
              </button>
            )}
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-[var(--ink)]">Education</h2>
          <button
            type="button"
            onClick={() => setEducation([...education, emptyEducation()])}
            className="text-sm font-medium text-[var(--accent)]"
          >
            + Add
          </button>
        </div>
        {education.map((ed, i) => (
          <div
            key={i}
            className="space-y-3 rounded-xl border border-[var(--line)] bg-white p-4"
          >
            <FieldInline
              label="School"
              value={ed.school}
              onChange={(v) => {
                const next = [...education];
                next[i] = { ...next[i], school: v };
                setEducation(next);
              }}
            />
            <FieldInline
              label="Degree"
              value={ed.degree}
              onChange={(v) => {
                const next = [...education];
                next[i] = { ...next[i], degree: v };
                setEducation(next);
              }}
            />
            <FieldInline
              label="Period"
              value={ed.period}
              onChange={(v) => {
                const next = [...education];
                next[i] = { ...next[i], period: v };
                setEducation(next);
              }}
            />
            {education.length > 1 && (
              <button
                type="button"
                onClick={() => setEducation(education.filter((_, j) => j !== i))}
                className="text-xs text-red-600"
              >
                Remove education
              </button>
            )}
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-[var(--ink)]">Social links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="GitHub" name="social_github" defaultValue={socials.github ?? ""} />
          <Field label="LinkedIn" name="social_linkedin" defaultValue={socials.linkedin ?? ""} />
          <Field label="Twitter / X" name="social_twitter" defaultValue={socials.twitter ?? ""} />
          <Field label="Website" name="social_website" defaultValue={socials.website ?? ""} />
          <Field label="YouTube" name="social_youtube" defaultValue={socials.youtube ?? ""} />
          <Field label="Dribbble" name="social_dribbble" defaultValue={socials.dribbble ?? ""} />
        </div>
      </section>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[var(--ink)] px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--ink-soft)] disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {pending ? "Saving…" : portfolio ? "Save changes" : "Publish portfolio"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2.5 text-sm outline-none ring-[var(--accent)] focus:ring-2"
      />
    </label>
  );
}

function FieldInline({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-[var(--muted)]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
      />
    </label>
  );
}
