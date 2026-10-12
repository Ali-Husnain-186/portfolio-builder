"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { COLOR_PRESETS, FONTS, TEMPLATES } from "@/lib/design";
import { DEMO_PEOPLE, demoPortfolio } from "@/lib/demo";
import type { Design, FontId, Portfolio, SectionKey } from "@/lib/types";
import { SECTION_LABELS } from "@/lib/types";
import { TemplateThumb } from "@/components/ui/template-thumb";
import { Area, Field, ListEditor, Section, Text, Upload } from "./fields";

type Tab = "profile" | "design" | "sections" | "skills" | "projects" | "experience" | "education" | "services" | "testimonials" | "socials" | "settings";
const TABS: { id: Tab; label: string; icon: string; section?: SectionKey }[] = [
  { id: "profile", label: "Profile", icon: "👤", section: "about" },
  { id: "design", label: "Design", icon: "🎨" },
  { id: "sections", label: "Sections", icon: "🧩" },
  { id: "skills", label: "Skills", icon: "⚡", section: "skills" },
  { id: "projects", label: "Projects", icon: "📁", section: "projects" },
  { id: "experience", label: "Experience", icon: "💼", section: "experience" },
  { id: "education", label: "Education", icon: "🎓", section: "education" },
  { id: "services", label: "Services", icon: "🛠️", section: "services" },
  { id: "testimonials", label: "Testimonials", icon: "💬", section: "testimonials" },
  { id: "socials", label: "Social links", icon: "🔗", section: "contact" },
  { id: "settings", label: "Link & SEO", icon: "🌐" },
];

type Status = "saved" | "dirty" | "saving" | "error";

export function Editor({ initial, initialTab, welcome }: { initial: Portfolio; initialTab?: string; welcome?: boolean }) {
  const [p, setP] = useState<Portfolio>(initial);
  const [tab, setTab] = useState<Tab>((TABS.find((t) => t.id === initialTab)?.id ?? "profile") as Tab);
  const [status, setStatus] = useState<Status>("saved");
  const [error, setError] = useState("");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [showWelcome, setShowWelcome] = useState(!!welcome);
  const frame = useRef<HTMLIFrameElement>(null);
  const latest = useRef(p);
  useEffect(() => { latest.current = p; }, [p]);
  const [savedUsername, setSavedUsername] = useState(initial.username);

  const push = useCallback(() => {
    frame.current?.contentWindow?.postMessage({ type: "fl-preview", portfolio: latest.current }, window.location.origin);
  }, []);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => { if (e.origin === window.location.origin && e.data?.type === "fl-preview-ready") push(); };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [push]);

  useEffect(() => { push(); }, [p, push]);

  const save = useCallback(async () => {
    setStatus("saving");
    const r = await fetch("/api/portfolio", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ portfolio: latest.current }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { setStatus("error"); setError(j.error || "Save failed"); return; }
    setSavedUsername(j.portfolio.username);
    setError("");
    setStatus((s) => (s === "saving" ? "saved" : s));
  }, []);

  // autosave (username changes are saved explicitly)
  useEffect(() => {
    if (status !== "dirty" || p.username !== savedUsername) return;
    const t = setTimeout(save, 1200);
    return () => clearTimeout(t);
  }, [p, status, save, savedUsername]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); save(); } };
    const onLeave = (e: BeforeUnloadEvent) => { if (status === "dirty" || status === "saving") e.preventDefault(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("beforeunload", onLeave); };
  }, [save, status]);

  const update = (patch: Partial<Portfolio>) => { setP((x) => ({ ...x, ...patch })); setStatus("dirty"); };
  const prof = (patch: Partial<Portfolio["profile"]>) => update({ profile: { ...p.profile, ...patch } });
  const des = (patch: Partial<Design>) => update({ design: { ...p.design, ...patch } });

  const goTab = (t: Tab) => {
    setTab(t);
    const sec = TABS.find((x) => x.id === t)?.section;
    if (sec) frame.current?.contentWindow?.postMessage({ type: "fl-scroll", section: sec }, window.location.origin);
  };

  const widths = { desktop: "100%", tablet: "820px", mobile: "390px" };

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col md:h-screen">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-ui-line bg-white px-4 py-2.5">
        <h1 className="font-semibold">Editor</h1>
        <StatusPill status={status} error={error} />
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden rounded-lg border border-ui-line p-0.5 lg:flex">
            {(["desktop", "tablet", "mobile"] as const).map((d) => (
              <button key={d} onClick={() => setDevice(d)} className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize ${device === d ? "bg-ui-soft text-brand" : "text-ui-muted"}`}>{d === "desktop" ? "🖥" : d === "tablet" ? "▭" : "📱"} {d}</button>
            ))}
          </div>
          <button className="btn-ghost !py-1.5 lg:hidden" onClick={() => setMobileView(mobileView === "edit" ? "preview" : "edit")}>{mobileView === "edit" ? "👁 Preview" : "✏️ Edit"}</button>
          <Link href={`/${savedUsername}`} target="_blank" className="btn-ghost !py-1.5">View live ↗</Link>
          <button onClick={save} className="btn-primary !py-1.5" disabled={status === "saving"}>Save</button>
        </div>
      </div>

      {showWelcome && (
        <div className="flex items-center gap-3 border-b border-ui-line bg-ui-soft px-4 py-2 text-sm">
          🎉 <span>Welcome! Your portfolio is live at <b>/{p.username}</b>. Fill in your details — changes save automatically.</span>
          <button className="ml-auto text-ui-muted" onClick={() => setShowWelcome(false)}>✕</button>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* tabs */}
        <nav className={`w-44 shrink-0 overflow-y-auto border-r border-ui-line bg-white p-2 ${mobileView === "preview" ? "hidden lg:block" : "hidden sm:block"}`}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => goTab(t.id)} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium ${tab === t.id ? "bg-ui-soft text-brand" : "text-ui-muted hover:bg-ui-bg hover:text-ui-fg"}`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>

        {/* panel */}
        <div className={`min-w-0 overflow-y-auto bg-ui-bg p-5 lg:w-[440px] lg:shrink-0 ${mobileView === "preview" ? "hidden lg:block" : "flex-1 lg:flex-none"}`}>
          <select className="field mb-4 sm:hidden" value={tab} onChange={(e) => goTab(e.target.value as Tab)}>
            {TABS.map((t) => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
          </select>
          {tab === "profile" && (
            <Section title="Profile" desc="The basics people see first.">
              <Upload label="Photo" value={p.profile.avatar} onChange={(v) => prof({ avatar: v })} maxSize={600} round />
              <Text label="Full name" value={p.profile.fullName} onChange={(v) => prof({ fullName: v })} />
              <Text label="Title" value={p.profile.title} onChange={(v) => prof({ title: v })} placeholder="Full-Stack Developer" />
              <Text label="Tagline" value={p.profile.tagline} onChange={(v) => prof({ tagline: v })} placeholder="One sentence about what you do" />
              <Area label="About / Bio" value={p.profile.bio} onChange={(v) => prof({ bio: v })} rows={6} placeholder="Tell your story…" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Text label="Location" value={p.profile.location} onChange={(v) => prof({ location: v })} />
                <Text label="Phone" value={p.profile.phone} onChange={(v) => prof({ phone: v })} />
              </div>
              <Text label="Public email" type="email" value={p.profile.email} onChange={(v) => prof({ email: v })} />
              <Upload label="Résumé / CV (PDF)" value={p.profile.resumeUrl} onChange={(v) => prof({ resumeUrl: v })} accept="application/pdf" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.profile.available} onChange={(e) => prof({ available: e.target.checked })} /> Show &quot;Available for work&quot; badge</label>
            </Section>
          )}

          {tab === "design" && (
            <div className="space-y-8">
              <Section title="Template" desc="Switch anytime — your content stays.">
                <div className="grid grid-cols-2 gap-3">
                  {TEMPLATES.map((t, i) => (
                    <div key={t.id} className={`relative overflow-hidden rounded-xl border-2 bg-white text-left transition hover:shadow-md ${p.design.template === t.id ? "border-brand" : "border-ui-line"}`}>
                      <TemplateThumb p={demoPortfolio(DEMO_PEOPLE[i % 3], "x", t.id)} height={90} />
                      <div className="border-t border-ui-line px-2.5 py-1.5 text-xs font-semibold">{t.name} {p.design.template === t.id && <span className="text-brand">✓</span>}</div>
                      <button type="button" data-template={t.id} aria-label={`Use ${t.name} template`} aria-pressed={p.design.template === t.id}
                        className="absolute inset-0" onClick={() => des({ template: t.id, ...t.defaults })} />
                    </div>
                  ))}
                </div>
              </Section>
              <Section title="Colors">
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PRESETS.map((c) => (
                    <button key={c.name} onClick={() => des({ primary: c.primary, accent: c.accent })}
                      className={`rounded-lg border-2 bg-white p-1.5 text-[11px] font-medium ${p.design.primary === c.primary && p.design.accent === c.accent ? "border-brand" : "border-ui-line"}`}>
                      <div className="mb-1 h-6 rounded" style={{ background: `linear-gradient(135deg,${c.primary},${c.accent})` }} />{c.name}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <ColorInput label="Primary" value={p.design.primary} onChange={(v) => des({ primary: v })} />
                  <ColorInput label="Accent" value={p.design.accent} onChange={(v) => des({ accent: v })} />
                  <ColorInput label="Background" value={p.design.background} onChange={(v) => des({ background: v })} allowEmpty />
                </div>
                <Field label="Mode">
                  <div className="flex gap-2">
                    {(["light", "dark"] as const).map((m) => (
                      <button key={m} onClick={() => des({ mode: m, background: "" })} className={`flex-1 rounded-lg border-2 py-2 text-sm font-medium capitalize ${p.design.mode === m ? "border-brand bg-ui-soft" : "border-ui-line bg-white"}`}>{m === "light" ? "☀️" : "🌙"} {m}</button>
                    ))}
                  </div>
                </Field>
              </Section>
              <Section title="Typography & shape">
                <div className="grid grid-cols-2 gap-3">
                  <FontSelect label="Heading font" value={p.design.headingFont} onChange={(v) => des({ headingFont: v })} />
                  <FontSelect label="Body font" value={p.design.font} onChange={(v) => des({ font: v })} />
                </div>
                <Field label="Corner radius">
                  <div className="flex gap-1.5">
                    {(["none", "sm", "md", "lg", "xl"] as const).map((r) => (
                      <button key={r} onClick={() => des({ radius: r })} className={`flex-1 border-2 py-1.5 text-xs font-medium uppercase ${p.design.radius === r ? "border-brand bg-ui-soft" : "border-ui-line bg-white"}`}
                        style={{ borderRadius: { none: 0, sm: 4, md: 8, lg: 12, xl: 18 }[r] }}>{r}</button>
                    ))}
                  </div>
                </Field>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.design.animations} onChange={(e) => des({ animations: e.target.checked })} /> Entrance animations</label>
              </Section>
            </div>
          )}

          {tab === "sections" && (
            <Section title="Sections" desc="Reorder and show/hide sections. Empty sections are hidden automatically.">
              <div className="space-y-2">
                {p.sections.map((s, i) => (
                  <div key={s.key} className="flex items-center gap-3 rounded-xl border border-ui-line bg-white px-4 py-2.5">
                    <input type="checkbox" checked={s.visible} aria-label={`Show ${s.key}`} onChange={(e) => update({ sections: p.sections.map((x) => (x.key === s.key ? { ...x, visible: e.target.checked } : x)) })} />
                    <span className={`flex-1 text-sm font-medium ${s.visible ? "" : "text-ui-muted line-through"}`}>{SECTION_LABELS[s.key]}</span>
                    <button className="rounded px-1.5 text-ui-muted hover:bg-ui-bg disabled:opacity-30" disabled={i === 0} onClick={() => { const n = [...p.sections]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; update({ sections: n }); }}>↑</button>
                    <button className="rounded px-1.5 text-ui-muted hover:bg-ui-bg disabled:opacity-30" disabled={i === p.sections.length - 1} onClick={() => { const n = [...p.sections]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; update({ sections: n }); }}>↓</button>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {tab === "skills" && (
            <Section title="Skills" desc="Add skills with a proficiency level.">
              <ListEditor items={p.skills} onChange={(skills) => update({ skills })} blank={() => ({ name: "", level: 80 })} title={(s) => s.name ? `${s.name} · ${s.level}%` : ""} addLabel="Add skill"
                render={(s, set) => (<>
                  <Text label="Skill" value={s.name} onChange={(v) => set({ name: v })} placeholder="React" />
                  <Field label={`Level — ${s.level}%`}><input type="range" min={0} max={100} step={5} value={s.level} onChange={(e) => set({ level: +e.target.value })} className="w-full accent-[var(--ui-brand)]" /></Field>
                </>)} />
            </Section>
          )}

          {tab === "projects" && (
            <Section title="Projects" desc="Show off your best work.">
              <ListEditor items={p.projects} onChange={(projects) => update({ projects })} blank={() => ({ title: "", description: "", url: "", repo: "", image: "", tags: [] })} title={(x) => x.title} addLabel="Add project"
                render={(x, set) => (<>
                  <Text label="Title" value={x.title} onChange={(v) => set({ title: v })} />
                  <Area label="Description" value={x.description} onChange={(v) => set({ description: v })} rows={3} />
                  <Upload label="Image" value={x.image} onChange={(v) => set({ image: v })} />
                  <Text label="Live URL" value={x.url} onChange={(v) => set({ url: v })} placeholder="https://" />
                  <Text label="Code URL" value={x.repo} onChange={(v) => set({ repo: v })} placeholder="https://github.com/…" />
                  <Text label="Tags (comma separated)" value={x.tags.join(", ")} onChange={(v) => set({ tags: v.split(",").map((t) => t.trim()).filter(Boolean) })} />
                </>)} />
            </Section>
          )}

          {tab === "experience" && (
            <Section title="Experience">
              <ListEditor items={p.experience} onChange={(experience) => update({ experience })} blank={() => ({ role: "", company: "", period: "", description: "" })} title={(e) => [e.role, e.company].filter(Boolean).join(" @ ")} addLabel="Add position"
                render={(e, set) => (<>
                  <div className="grid gap-3 sm:grid-cols-2"><Text label="Role" value={e.role} onChange={(v) => set({ role: v })} /><Text label="Company" value={e.company} onChange={(v) => set({ company: v })} /></div>
                  <Text label="Period" value={e.period} onChange={(v) => set({ period: v })} placeholder="2022 — Present" />
                  <Area label="What you did" value={e.description} onChange={(v) => set({ description: v })} rows={3} />
                </>)} />
            </Section>
          )}

          {tab === "education" && (
            <Section title="Education">
              <ListEditor items={p.education} onChange={(education) => update({ education })} blank={() => ({ school: "", degree: "", period: "", description: "" })} title={(e) => e.degree || e.school} addLabel="Add education"
                render={(e, set) => (<>
                  <Text label="School" value={e.school} onChange={(v) => set({ school: v })} />
                  <Text label="Degree" value={e.degree} onChange={(v) => set({ degree: v })} />
                  <Text label="Period" value={e.period} onChange={(v) => set({ period: v })} placeholder="2018 — 2022" />
                  <Area label="Notes" value={e.description} onChange={(v) => set({ description: v })} rows={2} />
                </>)} />
            </Section>
          )}

          {tab === "services" && (
            <Section title="Services" desc="What can people hire you for?">
              <ListEditor items={p.services} onChange={(services) => update({ services })} blank={() => ({ title: "", description: "" })} title={(s) => s.title} addLabel="Add service"
                render={(s, set) => (<>
                  <Text label="Title" value={s.title} onChange={(v) => set({ title: v })} />
                  <Area label="Description" value={s.description} onChange={(v) => set({ description: v })} rows={2} />
                </>)} />
            </Section>
          )}

          {tab === "testimonials" && (
            <Section title="Testimonials" desc="Kind words from clients or colleagues.">
              <ListEditor items={p.testimonials} onChange={(testimonials) => update({ testimonials })} blank={() => ({ name: "", role: "", quote: "" })} title={(t) => t.name} addLabel="Add testimonial"
                render={(t, set) => (<>
                  <div className="grid gap-3 sm:grid-cols-2"><Text label="Name" value={t.name} onChange={(v) => set({ name: v })} /><Text label="Role / company" value={t.role} onChange={(v) => set({ role: v })} /></div>
                  <Area label="Quote" value={t.quote} onChange={(v) => set({ quote: v })} rows={3} />
                </>)} />
            </Section>
          )}

          {tab === "socials" && (
            <Section title="Social links" desc="Paste full profile URLs. Leave empty to hide.">
              {(Object.keys(p.socials) as (keyof Portfolio["socials"])[]).map((k) => (
                <Text key={k} label={k} value={p.socials[k]} onChange={(v) => update({ socials: { ...p.socials, [k]: v } })} placeholder={`https://${k === "website" ? "yoursite.com" : k + ".com/you"}`} />
              ))}
            </Section>
          )}

          {tab === "settings" && <SettingsTab p={p} update={update} save={save} savedUsername={savedUsername} status={status} />}
        </div>

        {/* preview */}
        <div className={`min-w-0 flex-1 overflow-hidden bg-[#e9e7e2] ${mobileView === "edit" ? "hidden lg:block" : ""}`}>
          <div className="mx-auto h-full transition-all" style={{ width: widths[device], maxWidth: "100%", padding: device === "desktop" ? 0 : "16px 0" }}>
            <iframe ref={frame} src="/preview" title="Live preview" className={`h-full w-full bg-white ${device !== "desktop" ? "rounded-2xl border border-ui-line shadow-xl" : ""}`} onLoad={push} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status, error }: { status: Status; error: string }) {
  const map = { saved: ["✓ All changes saved", "text-green-700 bg-green-50"], dirty: ["● Unsaved changes", "text-amber-700 bg-amber-50"], saving: ["Saving…", "text-ui-muted bg-ui-bg"], error: ["⚠ " + error, "text-red-700 bg-red-50"] } as const;
  const [text, cls] = map[status];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`} data-testid="save-status">{text}</span>;
}

function ColorInput({ label, value, onChange, allowEmpty }: { label: string; value: string; onChange: (v: string) => void; allowEmpty?: boolean }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-1.5 rounded-lg border border-ui-line bg-white p-1">
        <input type="color" value={value || "#ffffff"} onChange={(e) => onChange(e.target.value)} className="h-7 w-8 cursor-pointer rounded border-0 bg-transparent p-0" />
        <input className="w-full min-w-0 text-xs outline-none" value={value} placeholder={allowEmpty ? "auto" : ""} onChange={(e) => { const v = e.target.value; if (/^#[0-9a-fA-F]{0,6}$/.test(v) || (allowEmpty && v === "")) onChange(v); }} />
      </div>
    </Field>
  );
}

function FontSelect({ label, value, onChange }: { label: string; value: FontId; onChange: (v: FontId) => void }) {
  return (
    <Field label={label}>
      <select className="field" value={value} onChange={(e) => onChange(e.target.value as FontId)}>
        {(Object.keys(FONTS) as FontId[]).map((f) => <option key={f} value={f}>{FONTS[f].label}</option>)}
      </select>
    </Field>
  );
}

function SettingsTab({ p, update, save, savedUsername, status }: { p: Portfolio; update: (x: Partial<Portfolio>) => void; save: () => Promise<void>; savedUsername: string; status: Status }) {
  const [check, setCheck] = useState<{ available: boolean; error?: string; suggestion?: string } | null>(null);
  const changed = p.username !== savedUsername;
  useEffect(() => {
    if (!changed) { setCheck(null); return; }
    const t = setTimeout(async () => setCheck(await (await fetch(`/api/username/check?u=${encodeURIComponent(p.username)}`)).json()), 300);
    return () => clearTimeout(t);
  }, [p.username, changed]);
  return (
    <div className="space-y-8">
      <Section title="Your link">
        <Field label="Username" hint="Changing it breaks the old link.">
          <div className="flex items-center overflow-hidden rounded-lg border border-ui-line bg-white">
            <span className="bg-ui-bg px-3 py-2 text-sm text-ui-muted">/</span>
            <input className="w-full px-2 py-2 text-sm outline-none" value={p.username} onChange={(e) => update({ username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })} />
          </div>
        </Field>
        {changed && check && (
          <p className={`text-sm ${check.available ? "text-green-700" : "text-red-600"}`}>
            {check.available ? "✓ Available" : <>{check.error || "Taken."} {check.suggestion && <button className="font-semibold underline" onClick={() => update({ username: check.suggestion! })}>Use “{check.suggestion}”</button>}</>}
          </p>
        )}
        {changed && <button className="btn-primary" disabled={!check?.available || status === "saving"} onClick={save}>Save new username</button>}
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.published} onChange={(e) => update({ published: e.target.checked })} /> Published (visible to everyone)</label>
      </Section>
      <Section title="SEO" desc="How your page appears on Google and when shared.">
        <Text label="Page title" value={p.seo.title} onChange={(v) => update({ seo: { ...p.seo, title: v } })} placeholder={`${p.profile.fullName} — ${p.profile.title || "Portfolio"}`} />
        <Area label="Description" value={p.seo.description} onChange={(v) => update({ seo: { ...p.seo, description: v } })} rows={3} placeholder={p.profile.tagline} />
      </Section>
      <Section title="Data">
        <div className="flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={() => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([JSON.stringify(p, null, 2)], { type: "application/json" }));
            a.download = `${p.username}-portfolio.json`;
            a.click();
          }}>⬇ Export JSON</button>
          <label className="btn-ghost cursor-pointer">⬆ Import JSON<input type="file" accept="application/json" className="hidden" onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            try {
              const data = JSON.parse(await f.text());
              for (const k of ["userId", "username", "views", "createdAt"]) delete data[k];
              update(data);
            } catch { alert("Invalid JSON file"); }
          }} /></label>
          <button className="btn-ghost text-red-600" onClick={async () => {
            if (!confirm("Reset your portfolio? All content will be cleared (your account stays).")) return;
            await fetch("/api/portfolio", { method: "DELETE" });
            window.location.reload();
          }}>↺ Reset portfolio</button>
        </div>
      </Section>
    </div>
  );
}
