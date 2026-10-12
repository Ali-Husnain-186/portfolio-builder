import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
      <span className="brand-gradient flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-white">F</span>
      FolioLink
    </Link>
  );
}
