"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashNav({ admin, unread }: { admin: boolean; unread: number }) {
  const path = usePathname();
  const items: [string, string, string][] = [
    ["/dashboard", "Overview", "🏠"],
    ["/dashboard/editor", "Editor", "✏️"],
    ["/dashboard/inbox", "Inbox", "📬"],
    ["/dashboard/settings", "Settings", "⚙️"],
  ];
  if (admin) items.push(["/admin", "Admin", "🛡️"]);
  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col">
      {items.map(([href, label, icon]) => {
        const active = path === href;
        return (
          <Link key={href} href={href}
            className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-ui-soft text-brand" : "text-ui-muted hover:bg-ui-bg hover:text-ui-fg"}`}>
            <span>{icon}</span>{label}
            {label === "Inbox" && unread > 0 && <span className="ml-auto rounded-full bg-brand px-2 text-xs text-white">{unread}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
