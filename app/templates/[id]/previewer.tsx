"use client";

import Link from "next/link";
import { useState } from "react";
import PortfolioRenderer from "@/components/templates";
import { COLOR_PRESETS, TEMPLATES } from "@/lib/design";
import type { Portfolio } from "@/lib/types";

export function TemplatePreviewer({ initial }: { initial: Portfolio }) {
  const [p, setP] = useState(initial);
  const d = p.design;
  const set = (patch: Partial<Portfolio["design"]>) => setP({ ...p, design: { ...d, ...patch } });
  return (
    <div>
      <div className="sticky top-0 z-50 flex flex-wrap items-center gap-3 border-b border-ui-line bg-white/95 px-4 py-2 text-sm shadow-sm backdrop-blur">
        <Link href="/templates" className="font-semibold text-ui-muted hover:text-ui-fg">← Templates</Link>
        <select className="field !w-auto" value={d.template} onChange={(e) => { const t = TEMPLATES.find((x) => x.id === e.target.value)!; set({ template: t.id, ...t.defaults }); }}>
          {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <div className="flex items-center gap-1">
          {COLOR_PRESETS.map((c) => (
            <button key={c.name} title={c.name} onClick={() => set({ primary: c.primary, accent: c.accent })} className="h-6 w-6 rounded-full ring-2 ring-white" style={{ background: `linear-gradient(135deg,${c.primary} 50%,${c.accent} 50%)`, outline: d.primary === c.primary ? "2px solid #111" : "none" }} />
          ))}
        </div>
        <button className="btn-ghost !py-1" onClick={() => set({ mode: d.mode === "dark" ? "light" : "dark" })}>{d.mode === "dark" ? "☀️ Light" : "🌙 Dark"}</button>
        <Link href={`/signup?template=${d.template}`} className="btn-primary ml-auto !py-1.5">Use this template</Link>
      </div>
      <PortfolioRenderer p={p} preview />
    </div>
  );
}
