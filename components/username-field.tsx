"use client";

import { useEffect, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  excludeUserId?: string;
  initialUsername?: string;
};

type CheckResult = {
  available: boolean;
  error: string | null;
  suggestions: string[];
};

export function UsernameField({
  value,
  onChange,
  excludeUserId,
  initialUsername,
}: Props) {
  const [status, setStatus] = useState<CheckResult | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!value || value.length < 3) {
      setStatus(null);
      return;
    }

    // Own unchanged username is fine without hitting API
    if (initialUsername && value === initialUsername) {
      setStatus({ available: true, error: null, suggestions: [] });
      return;
    }

    const t = setTimeout(async () => {
      setChecking(true);
      try {
        const params = new URLSearchParams({ username: value });
        if (excludeUserId) params.set("excludeUserId", excludeUserId);
        const res = await fetch(`/api/username/check?${params}`);
        const data = (await res.json()) as CheckResult & { username: string };
        setStatus({
          available: data.available,
          error: data.error,
          suggestions: data.suggestions ?? [],
        });
      } catch {
        setStatus({
          available: false,
          error: "Could not check username",
          suggestions: [],
        });
      } finally {
        setChecking(false);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [value, excludeUserId, initialUsername]);

  return (
    <div className="space-y-2">
      <label className="block space-y-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Username (public link)
        </span>
        <div className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-[var(--accent)]">
          <span className="shrink-0 text-sm text-[var(--muted)]">/</span>
          <input
            name="username"
            required
            value={value}
            onChange={(e) =>
              onChange(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
            }
            placeholder="ali"
            className="w-full bg-transparent text-sm outline-none"
            autoComplete="off"
          />
          {checking && (
            <span className="text-xs text-[var(--muted)]">Checking…</span>
          )}
          {!checking && status?.available && (
            <span className="text-xs font-medium text-emerald-600">Available</span>
          )}
        </div>
      </label>

      {status && !status.available && status.error && (
        <p className="text-sm text-red-600">{status.error}</p>
      )}

      {status && !status.available && status.suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--muted)]">Try:</span>
          {status.suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-xs font-medium text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
