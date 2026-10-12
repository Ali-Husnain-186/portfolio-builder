import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PortfolioRenderer from "@/components/templates";
import { getCurrentUser } from "@/lib/auth";
import { getPortfolioByUsername, getUser } from "@/lib/repo";
import { ensureSeeded } from "@/lib/seed";
import { ViewPing } from "./view-ping";

export const dynamic = "force-dynamic";

async function load(username: string) {
  await ensureSeeded();
  const p = await getPortfolioByUsername(username.toLowerCase());
  if (!p) return null;
  const owner = await getUser(p.userId);
  if (!owner || owner.disabled) return null;
  return p;
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const p = await load(username);
  if (!p || !p.published) return { title: "Portfolio not found" };
  const title = p.seo.title || `${p.profile.fullName}${p.profile.title ? " — " + p.profile.title : ""}`;
  const description = p.seo.description || p.profile.tagline || p.profile.bio.slice(0, 160);
  return {
    title: { absolute: title },
    description,
    openGraph: { title, description, type: "profile", images: p.profile.avatar ? [p.profile.avatar] : undefined },
    twitter: { card: "summary", title, description },
  };
}

export default async function PublicPortfolio({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const p = await load(username);
  if (!p) notFound();
  const me = await getCurrentUser();
  const isOwner = me?.id === p.userId;
  if (!p.published && !isOwner) notFound();
  return (
    <>
      {isOwner && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-ui-line bg-white px-2 py-1.5 text-sm shadow-lg">
          {!p.published && <span className="px-2 text-amber-700">Hidden — only you can see this</span>}
          <Link href="/dashboard/editor" className="btn-primary !rounded-full !py-1.5">✏️ Edit</Link>
        </div>
      )}
      {!isOwner && <ViewPing username={p.username} />}
      <PortfolioRenderer p={p} />
    </>
  );
}
