import { redirect } from "next/navigation";
import { DashNav } from "@/components/ui/dash-nav";
import { Logo } from "@/components/ui/logo";
import { LogoutButton } from "@/components/ui/logout-button";
import { getCurrentUser } from "@/lib/auth";
import { getInbox } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const unread = (await getInbox(user.id)).filter((m) => !m.read).length;
  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-ui-line bg-white p-4 md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <div className="mb-4 flex items-center justify-between md:mb-8"><Logo href="/dashboard" /></div>
        <DashNav admin={user.role === "admin"} unread={unread} />
        <div className="mt-4 hidden border-t border-ui-line pt-4 text-sm md:block">
          <p className="truncate font-medium">{user.name}</p>
          <p className="truncate text-xs text-ui-muted">{user.email}</p>
          <LogoutButton className="mt-3 text-sm font-semibold text-red-600 hover:underline" />
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
