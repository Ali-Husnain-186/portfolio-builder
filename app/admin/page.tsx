import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { getCurrentUser } from "@/lib/auth";
import { AdminTable } from "./table";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-ui-line bg-white px-5 py-3"><Logo href="/dashboard" /><Link href="/dashboard" className="btn-ghost">← Dashboard</Link></header>
      <main className="mx-auto max-w-6xl p-5 md:p-10">
        <h1 className="font-display text-3xl font-bold">Admin</h1>
        <p className="text-ui-muted">Manage every user and portfolio on your platform.</p>
        <AdminTable meId={user.id} />
      </main>
    </div>
  );
}
