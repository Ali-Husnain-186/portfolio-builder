import Link from "next/link";
import { PortfolioForm } from "@/components/portfolio-form";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import type { Portfolio } from "@/lib/types";

export const metadata = { title: "Edit portfolio" };

export default async function EditPortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("portfolios")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const portfolio = data as Portfolio | null;

  return (
    <div className="landing-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SiteHeader signedIn compact />
        <div className="flex items-center justify-between gap-4 py-6">
          <h1 className="font-display text-3xl text-[var(--ink)]">
            {portfolio ? "Edit portfolio" : "Create portfolio"}
          </h1>
          <Link
            href="/dashboard"
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            Back
          </Link>
        </div>
        <PortfolioForm
          portfolio={portfolio}
          userId={user.id}
          defaultEmail={user.email ?? ""}
        />
      </div>
    </div>
  );
}
