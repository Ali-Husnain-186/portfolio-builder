import { notFound } from "next/navigation";
import { TEMPLATES } from "@/lib/design";
import { DEMO_PEOPLE, demoPortfolio } from "@/lib/demo";
import { TemplatePreviewer } from "./previewer";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = TEMPLATES.find((x) => x.id === id);
  return { title: t ? `${t.name} template` : "Template" };
}

export default async function TemplatePreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const i = TEMPLATES.findIndex((x) => x.id === id);
  if (i < 0) notFound();
  return <TemplatePreviewer initial={demoPortfolio(DEMO_PEOPLE[i % DEMO_PEOPLE.length], "x", TEMPLATES[i].id)} />;
}
