"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Message } from "@/lib/types";

export function Inbox({ initial }: { initial: Message[] }) {
  const [msgs, setMsgs] = useState(initial);
  const [open, setOpen] = useState<string | null>(null);
  const router = useRouter();
  const call = async (method: string, body?: object, q = "") => {
    const r = await fetch("/api/inbox" + q, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    if (r.ok) setMsgs((await r.json()).messages);
    router.refresh();
  };
  return (
    <main className="mx-auto max-w-4xl p-5 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="font-display text-3xl font-bold">Inbox</h1><p className="text-ui-muted">Messages from your portfolio&apos;s contact form.</p></div>
        {msgs.some((m) => !m.read) && <button className="btn-ghost" onClick={() => call("PATCH", { all: true, read: true })}>Mark all read</button>}
      </div>
      {msgs.length === 0 ? (
        <div className="card mt-8 p-12 text-center text-ui-muted"><div className="text-4xl">📭</div><p className="mt-3">No messages yet. Share your link to start getting them!</p></div>
      ) : (
        <ul className="card mt-8 divide-y divide-ui-line overflow-hidden">
          {msgs.map((m) => (
            <li key={m.id} className={m.read ? "" : "bg-ui-soft/50"}>
              <button className="flex w-full items-start gap-3 p-4 text-left" onClick={() => { setOpen(open === m.id ? null : m.id); if (!m.read) call("PATCH", { id: m.id, read: true }); }}>
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.read ? "bg-transparent" : "bg-brand"}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3"><b className="truncate">{m.name}</b><span className="shrink-0 text-xs text-ui-muted">{new Date(m.createdAt).toLocaleString()}</span></div>
                  <p className="truncate text-sm text-ui-muted">{m.email} — {m.message}</p>
                </div>
              </button>
              {open === m.id && (
                <div className="space-y-4 px-9 pb-5">
                  <p className="whitespace-pre-line">{m.message}</p>
                  <div className="flex gap-2">
                    <a className="btn-primary" href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`}>Reply by email</a>
                    <button className="btn-ghost" onClick={() => call("PATCH", { id: m.id, read: false })}>Mark unread</button>
                    <button className="btn-ghost text-red-600" onClick={() => call("DELETE", undefined, `?id=${m.id}`)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
