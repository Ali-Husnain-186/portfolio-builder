"use client";

import { useEffect, useState } from "react";

type Row = { id: string; name: string; email: string; role: string; disabled?: boolean; createdAt: string; username: string | null; published: boolean; views: number; template: string | null };

export function AdminTable({ meId }: { meId: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");
  const load = async () => setRows((await (await fetch("/api/admin/users")).json()).users);
  useEffect(() => { load(); }, []);
  const patch = async (id: string, body: object) => { const r = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...body }) }); if (!r.ok) alert((await r.json()).error); load(); };
  const remove = async (r: Row) => { if (!confirm(`Delete ${r.email} and all their data?`)) return; await fetch(`/api/admin/users?id=${r.id}`, { method: "DELETE" }); load(); };
  if (!rows) return <p className="mt-8 text-ui-muted">Loading…</p>;
  const filtered = rows.filter((r) => (r.name + r.email + (r.username ?? "")).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[["Users", rows.length], ["Published", rows.filter((r) => r.published).length], ["Total views", rows.reduce((a, r) => a + r.views, 0)], ["Disabled", rows.filter((r) => r.disabled).length]].map(([k, v]) => (
          <div key={k} className="card p-5"><p className="label">{k}</p><p className="text-3xl font-bold">{v}</p></div>
        ))}
      </div>
      <input className="field mt-6 max-w-sm" placeholder="Search users…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ui-line text-xs uppercase text-ui-muted"><tr>{["User", "Link", "Template", "Views", "Joined", "Status", ""].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-ui-line">
            {filtered.map((r) => (
              <tr key={r.id} className={r.disabled ? "opacity-50" : ""}>
                <td className="px-4 py-3"><b>{r.name}</b> {r.role === "admin" && <span className="rounded bg-ui-soft px-1.5 text-xs text-brand">admin</span>}<br /><span className="text-ui-muted">{r.email}</span></td>
                <td className="px-4 py-3">{r.username ? <a className="text-brand underline" href={`/${r.username}`} target="_blank">/{r.username}</a> : "—"}</td>
                <td className="px-4 py-3 capitalize">{r.template ?? "—"}</td>
                <td className="px-4 py-3">{r.views}</td>
                <td className="px-4 py-3 text-ui-muted">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">{r.disabled ? "Disabled" : r.published ? "Live" : "Hidden"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  {r.id !== meId && <>
                    <button className="mr-3 text-xs font-semibold text-ui-muted hover:text-ui-fg" onClick={() => patch(r.id, { published: !r.published })}>{r.published ? "Unpublish" : "Publish"}</button>
                    <button className="mr-3 text-xs font-semibold text-ui-muted hover:text-ui-fg" onClick={() => patch(r.id, { disabled: !r.disabled })}>{r.disabled ? "Enable" : "Disable"}</button>
                    <button className="mr-3 text-xs font-semibold text-ui-muted hover:text-ui-fg" onClick={() => patch(r.id, { role: r.role === "admin" ? "user" : "admin" })}>{r.role === "admin" ? "Demote" : "Make admin"}</button>
                    <button className="text-xs font-semibold text-red-600" onClick={() => remove(r)}>Delete</button>
                  </>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
