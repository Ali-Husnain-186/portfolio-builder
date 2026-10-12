"use client";

import { useEffect, useState } from "react";

export function CopyLink({ path }: { path: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => setOrigin(process.env.NEXT_PUBLIC_APP_URL || window.location.origin), []);
  const url = origin + path;
  return (
    <div className="mt-1 flex flex-wrap items-center gap-2">
      <a href={path} target="_blank" className="truncate font-mono text-lg font-semibold text-brand hover:underline">{url.replace(/^https?:\/\//, "")}</a>
      <button className="btn-ghost !py-1 text-xs" onClick={async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}
