import Link from "next/link";
import { SiteHeader } from "@/components/ui/site-header";
import { TemplateThumb } from "@/components/ui/template-thumb";
import { TEMPLATES } from "@/lib/design";
import { DEMO_PEOPLE, demoPortfolio } from "@/lib/demo";

export const metadata = { title: "Templates" };

export default function TemplatesPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-14">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Templates</h1>
        <p className="mt-2 text-ui-muted">Every template supports custom colors, fonts, dark mode and section ordering. Switch anytime from your dashboard.</p>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {TEMPLATES.map((t, i) => (
            <div key={t.id} className="card overflow-hidden shadow-sm transition hover:shadow-xl">
              <div className="relative"><TemplateThumb p={demoPortfolio(DEMO_PEOPLE[i % DEMO_PEOPLE.length], "x", t.id)} height={300} /><Link href={`/templates/${t.id}`} className="absolute inset-0" aria-label={`Preview ${t.name}`} /></div>
              <div className="flex items-center justify-between gap-4 border-t border-ui-line p-5">
                <div><h2 className="text-lg font-semibold">{t.name}</h2><p className="text-sm text-ui-muted">{t.description}</p></div>
                <div className="flex shrink-0 gap-2">
                  <Link href={`/templates/${t.id}`} className="btn-ghost">Preview</Link>
                  <Link href={`/signup?template=${t.id}`} className="btn-primary">Use</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
