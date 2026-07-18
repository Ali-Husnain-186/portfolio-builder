import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioView } from "@/components/portfolio-view";
import { createClient } from "@/lib/supabase/server";
import type { Portfolio } from "@/lib/types";
import { RESERVED_USERNAMES } from "@/lib/username";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolios")
    .select("full_name, title, bio")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (!data) return { title: "Not found" };

  return {
    title: `${data.full_name}${data.title ? ` — ${data.title}` : ""}`,
    description: data.bio || `${data.full_name}'s portfolio`,
  };
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { username: raw } = await params;
  const username = raw.toLowerCase();

  if (RESERVED_USERNAMES.has(username)) {
    notFound();
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolios")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (!data) notFound();

  return <PortfolioView portfolio={data as Portfolio} />;
}
