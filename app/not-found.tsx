import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="brand-text font-display text-8xl font-bold">404</p>
      <h1 className="mt-4 text-2xl font-semibold">This page doesn&apos;t exist (yet)</h1>
      <p className="mt-2 text-ui-muted">Maybe this username is still free — grab it!</p>
      <div className="mt-6 flex gap-3"><Link href="/" className="btn-ghost">Home</Link><Link href="/signup" className="btn-primary">Create a portfolio</Link></div>
    </main>
  );
}
