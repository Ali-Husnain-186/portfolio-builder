import { redirect } from "next/navigation";
import { AuthForm } from "@/components/ui/auth-form";
import { Logo } from "@/components/ui/logo";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Log in" };

export default async function Page({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  if (await getCurrentUser()) redirect("/dashboard");
  const { template } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="card p-8 shadow-sm">
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="mb-6 mt-1 text-sm text-ui-muted">Log in to edit your portfolio.</p>
          <AuthForm mode="login" template={template} />
        </div>
      </div>
    </main>
  );
}
