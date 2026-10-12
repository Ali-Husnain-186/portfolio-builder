"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthForm({ mode, template }: { mode: "login" | "signup"; template?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [touched, setTouched] = useState(false);
  const [host, setHost] = useState("");
  useEffect(() => setHost(window.location.host), []);
  const [check, setCheck] = useState<{ available: boolean; error?: string; suggestion?: string; username: string } | null>(null);

  useEffect(() => {
    if (mode !== "signup" || !username) { setCheck(null); return; }
    const t = setTimeout(async () => {
      const r = await fetch(`/api/username/check?u=${encodeURIComponent(username)}`);
      setCheck(await r.json());
    }, 350);
    return () => clearTimeout(t);
  }, [username, mode]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, template }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { setError(j.error || "Something went wrong"); setLoading(false); return; }
    router.push(mode === "signup" ? "/dashboard/editor?welcome=1" : "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === "signup" && (
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" name="name" required className="field" placeholder="Ali Husnain"
            onChange={(e) => { if (!touched) setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 30)); }} />
        </div>
      )}
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="field" placeholder="you@example.com" />
      </div>
      {mode === "signup" && (
        <div>
          <label className="label" htmlFor="username">Your link</label>
          <div className="flex items-center overflow-hidden rounded-lg border border-ui-line bg-white focus-within:border-brand">
            <span className="bg-ui-bg px-3 py-2 text-sm text-ui-muted">{host}/</span>
            <input id="username" name="username" value={username} onChange={(e) => { setTouched(true); setUsername(e.target.value.toLowerCase()); }}
              className="w-full px-2 py-2 text-sm outline-none" placeholder="yourname" />
          </div>
          {check && (
            <p className={`mt-1 text-xs ${check.available ? "text-green-600" : "text-red-600"}`}>
              {check.available ? "✓ Available" : <>{check.error || "Taken."} {check.suggestion && <button type="button" className="font-semibold underline" onClick={() => { setTouched(true); setUsername(check.suggestion!); }}>Use “{check.suggestion}”</button>}</>}
            </p>
          )}
        </div>
      )}
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required minLength={mode === "signup" ? 8 : 1} autoComplete={mode === "signup" ? "new-password" : "current-password"} className="field" placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"} />
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button disabled={loading || (mode === "signup" && check?.available === false)} className="btn-primary w-full py-2.5">
        {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
      </button>
      <p className="text-center text-sm text-ui-muted">
        {mode === "signup" ? <>Already have an account? <Link href="/login" className="font-semibold text-brand">Log in</Link></> : <>New here? <Link href="/signup" className="font-semibold text-brand">Create a free account</Link></>}
      </p>
    </form>
  );
}
