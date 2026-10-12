"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function useForm() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const run = async (method: string, body: object, okText: string) => {
    setBusy(true); setMsg(null);
    const r = await fetch("/api/account", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    setMsg(r.ok ? { ok: true, text: okText } : { ok: false, text: j.error || "Failed" });
    return r.ok;
  };
  return { msg, busy, run };
}

const Note = ({ m }: { m: { ok: boolean; text: string } | null }) => m && <p className={`text-sm ${m.ok ? "text-green-700" : "text-red-600"}`}>{m.text}</p>;

export function AccountSettings({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const profile = useForm();
  const pw = useForm();
  const del = useForm();
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-5 md:p-10">
      <h1 className="font-display text-3xl font-bold">Account settings</h1>

      <form className="card space-y-4 p-6" onSubmit={async (e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.currentTarget)); if (await profile.run("PATCH", d, "Saved.")) router.refresh(); }}>
        <h2 className="font-semibold">Profile</h2>
        <label className="block"><span className="label">Name</span><input name="name" defaultValue={name} className="field" /></label>
        <label className="block"><span className="label">Login email</span><input name="email" type="email" defaultValue={email} className="field" /></label>
        <label className="block"><span className="label">Current password (only needed to change email)</span><input name="currentPassword" type="password" className="field" autoComplete="current-password" /></label>
        <Note m={profile.msg} />
        <button className="btn-primary" disabled={profile.busy}>Save</button>
      </form>

      <form className="card space-y-4 p-6" onSubmit={async (e) => { e.preventDefault(); const f = e.currentTarget; const d = Object.fromEntries(new FormData(f)); if (d.newPassword !== d.confirm) { return alert("Passwords don't match"); } if (await pw.run("PATCH", d, "Password changed. Other devices were logged out.")) f.reset(); }}>
        <h2 className="font-semibold">Change password</h2>
        <label className="block"><span className="label">Current password</span><input name="currentPassword" type="password" required className="field" autoComplete="current-password" /></label>
        <label className="block"><span className="label">New password</span><input name="newPassword" type="password" minLength={8} required className="field" autoComplete="new-password" /></label>
        <label className="block"><span className="label">Confirm new password</span><input name="confirm" type="password" minLength={8} required className="field" autoComplete="new-password" /></label>
        <Note m={pw.msg} />
        <button className="btn-primary" disabled={pw.busy}>Update password</button>
      </form>

      <form className="card space-y-4 border-red-200 p-6" onSubmit={async (e) => { e.preventDefault(); if (!confirm("Delete your account and portfolio forever? This cannot be undone.")) return; const d = Object.fromEntries(new FormData(e.currentTarget)); if (await del.run("DELETE", d, "Deleted.")) { router.push("/"); router.refresh(); } }}>
        <h2 className="font-semibold text-red-700">Danger zone</h2>
        <p className="text-sm text-ui-muted">Permanently delete your account, portfolio, uploads and messages.</p>
        <label className="block"><span className="label">Confirm with your password</span><input name="password" type="password" required className="field" autoComplete="current-password" /></label>
        <Note m={del.msg} />
        <button className="btn-danger" disabled={del.busy}>Delete my account</button>
      </form>
    </main>
  );
}
