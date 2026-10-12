"use client";

import { useRef, useState, type ReactNode } from "react";
import { uid } from "@/lib/design";

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ui-muted">{hint}</span>}
    </label>
  );
}

export function Text({ label, value, onChange, placeholder, hint, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string; type?: string }) {
  return <Field label={label} hint={hint}><input type={type} className="field" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} /></Field>;
}

export function Area({ label, value, onChange, placeholder, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <Field label={label}><textarea className="field resize-y" rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} /></Field>;
}

export function Section({ title, desc, children, action }: { title: string; desc?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div><h2 className="text-lg font-semibold">{title}</h2>{desc && <p className="text-sm text-ui-muted">{desc}</p>}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

/** Resize an image client-side then upload it. Returns the hosted URL. */
export async function uploadFile(file: File, maxSize = 1200): Promise<string> {
  let blob: Blob = file;
  if (file.type.startsWith("image/") && file.type !== "image/gif") {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    blob = await new Promise<Blob>((res) => c.toBlob((b) => res(b!), "image/webp", 0.86));
    if (blob.type !== "image/webp") blob = await new Promise<Blob>((res) => c.toBlob((b) => res(b!), "image/jpeg", 0.86));
  }
  const fd = new FormData();
  fd.append("file", new File([blob], file.name, { type: blob.type || file.type }));
  const r = await fetch("/api/upload", { method: "POST", body: fd });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Upload failed");
  return j.url;
}

export function Upload({ label, value, onChange, accept = "image/*", maxSize, round }: { label: string; value: string; onChange: (v: string) => void; accept?: string; maxSize?: number; round?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const isImg = accept.startsWith("image");
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        {isImg && (value
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={value} alt="" className={`h-16 w-16 border border-ui-line object-cover ${round ? "rounded-full" : "rounded-lg"}`} />
          : <div className={`flex h-16 w-16 items-center justify-center border border-dashed border-ui-line text-ui-muted ${round ? "rounded-full" : "rounded-lg"}`}>＋</div>)}
        {!isImg && value && <a href={value} target="_blank" className="text-sm font-medium text-brand underline">Current file ↗</a>}
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost !py-1.5 text-xs" disabled={busy} onClick={() => ref.current?.click()}>{busy ? "Uploading…" : value ? "Replace" : "Upload"}</button>
          {value && <button type="button" className="btn-ghost !py-1.5 text-xs text-red-600" onClick={() => onChange("")}>Remove</button>}
        </div>
        <input ref={ref} type="file" accept={accept} className="hidden" onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          setBusy(true); setErr("");
          try { onChange(await uploadFile(f, maxSize)); } catch (x) { setErr((x as Error).message); }
          setBusy(false);
        }} />
      </div>
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
    </Field>
  );
}

export function ListEditor<T extends { id: string }>({
  items, onChange, blank, render, title, addLabel = "Add",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  blank: () => Omit<T, "id">;
  render: (item: T, set: (patch: Partial<T>) => void) => ReactNode;
  title: (item: T) => string;
  addLabel?: string;
}) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  const move = (i: number, d: number) => {
    const n = [...items];
    const j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={it.id} className="rounded-xl border border-ui-line bg-white">
          <div className="flex items-center gap-2 px-4 py-3">
            <button type="button" className="min-w-0 flex-1 truncate text-left text-sm font-semibold" onClick={() => setOpen(open === it.id ? null : it.id)}>
              <span className="mr-2 text-ui-muted">{open === it.id ? "▾" : "▸"}</span>{title(it) || <span className="text-ui-muted">Untitled</span>}
            </button>
            <button type="button" title="Move up" className="rounded px-1.5 text-ui-muted hover:bg-ui-bg disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
            <button type="button" title="Move down" className="rounded px-1.5 text-ui-muted hover:bg-ui-bg disabled:opacity-30" disabled={i === items.length - 1} onClick={() => move(i, 1)}>↓</button>
            <button type="button" title="Delete" className="rounded px-1.5 text-red-500 hover:bg-red-50" onClick={() => onChange(items.filter((x) => x.id !== it.id))}>✕</button>
          </div>
          {open === it.id && (
            <div className="space-y-3 border-t border-ui-line p-4">
              {render(it, (patch) => onChange(items.map((x) => (x.id === it.id ? { ...x, ...patch } : x))))}
            </div>
          )}
        </div>
      ))}
      <button type="button" className="btn-ghost w-full border-dashed" onClick={() => {
        const n = { ...blank(), id: uid() } as T;
        onChange([...items, n]);
        setOpen(n.id);
      }}>＋ {addLabel}</button>
    </div>
  );
}
