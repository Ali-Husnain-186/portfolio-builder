"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PublishToggle({ published }: { published: boolean }) {
  const [on, setOn] = useState(published);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function toggle() {
    setBusy(true);
    const cur = await (await fetch("/api/portfolio")).json();
    const r = await fetch("/api/portfolio", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ portfolio: { ...cur.portfolio, published: !on } }) });
    if (r.ok) setOn(!on);
    setBusy(false);
    router.refresh();
  }
  return (
    <button onClick={toggle} disabled={busy} className="flex items-center gap-3 text-sm font-medium">
      <span className={`relative h-6 w-11 rounded-full transition ${on ? "bg-green-500" : "bg-gray-300"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "left-[22px]" : "left-0.5"}`} />
      </span>
      {on ? "Published" : "Hidden (unpublished)"}
    </button>
  );
}
