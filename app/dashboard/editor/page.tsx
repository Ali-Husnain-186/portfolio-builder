import { Editor } from "@/components/editor/editor";
import { requirePageUser } from "@/lib/auth";
import { createPortfolioFor, getPortfolio } from "@/lib/repo";

export const metadata = { title: "Editor" };

export default async function EditorPage({ searchParams }: { searchParams: Promise<{ tab?: string; welcome?: string }> }) {
  const user = await requirePageUser();
  const p = (await getPortfolio(user.id)) ?? (await createPortfolioFor(user));
  const sp = await searchParams;
  return <Editor initial={p} initialTab={sp.tab} welcome={sp.welcome === "1"} />;
}
