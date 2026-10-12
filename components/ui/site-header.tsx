import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "./logo";

export async function SiteHeader() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-40 border-b border-ui-line/70 bg-ui-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Logo />
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/templates" className="hidden rounded-lg px-3 py-2 font-medium text-ui-muted hover:text-ui-fg sm:block">Templates</Link>
          <Link href="/#features" className="hidden rounded-lg px-3 py-2 font-medium text-ui-muted hover:text-ui-fg sm:block">Features</Link>
          {user ? (
            <Link href="/dashboard" className="btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 font-medium hover:bg-white">Log in</Link>
              <Link href="/signup" className="btn-primary">Get started free</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
