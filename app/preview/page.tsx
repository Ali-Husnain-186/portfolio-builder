import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createPortfolioFor, getPortfolio } from "@/lib/repo";
import { LivePreview } from "./live";

export const dynamic = "force-dynamic";
export const metadata = { title: "Preview", robots: { index: false } };

export default async function PreviewPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const p = (await getPortfolio(user.id)) ?? (await createPortfolioFor(user));
  return <LivePreview initial={p} />;
}
