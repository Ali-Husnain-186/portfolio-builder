import Link from "next/link";
import { signOut } from "@/app/dashboard/actions";

export function SiteHeader({
  signedIn,
  compact,
}: {
  signedIn?: boolean;
  compact?: boolean;
}) {
  return (
    <header
      className={`flex items-center justify-between gap-4 ${compact ? "py-4" : "py-6"}`}
    >
      <Link href="/" className="font-display text-xl tracking-tight text-[var(--ink)]">
        FolioLink
      </Link>
      <nav className="flex items-center gap-3 text-sm">
        {signedIn ? (
          <>
            <Link
              href="/dashboard"
              className="text-[var(--muted)] transition hover:text-[var(--ink)]"
            >
              Dashboard
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-[var(--muted)] transition hover:text-[var(--ink)]"
              >
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-[var(--muted)] transition hover:text-[var(--ink)]"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[var(--ink)] px-3.5 py-2 font-medium text-white transition hover:bg-[var(--ink-soft)]"
            >
              Get started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
