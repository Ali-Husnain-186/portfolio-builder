import Link from "next/link";

export default function NotFound() {
  return (
    <div className="landing-bg flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <h1 className="font-display text-4xl text-[var(--ink)]">Portfolio not found</h1>
      <p className="mt-3 max-w-md text-sm text-[var(--muted)]">
        This username does not exist or was deleted.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-[var(--ink)] px-5 py-3 text-sm font-medium text-white"
      >
        Go home
      </Link>
    </div>
  );
}
