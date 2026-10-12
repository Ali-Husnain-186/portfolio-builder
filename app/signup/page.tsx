import { redirect } from "next/navigation";
import { AuthForm } from "@/components/ui/auth-form";
import { Logo } from "@/components/ui/logo";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Sign up" };

export default async function Page({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
  if (await getCurrentUser()) redirect("/dashboard");
  const { template } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="card p-8 shadow-sm">
          <h1 className="font-display text-2xl font-bold">Create your free portfolio</h1>
          <p className="mb-6 mt-1 text-sm text-ui-muted">Takes less than a minute. No credit card.</p>
          <AuthForm mode="signup" template={template} />
        </div>
      </div>
    </main>
  );
}
