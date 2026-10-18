import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-lg font-semibold tracking-tight">
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v17M7 20h10M4 7h16" stroke="var(--ink)" strokeWidth="1.5" />
        <path d="M4 7l-2.5 6a2.5 2.5 0 005 0L4 7z" stroke="var(--ink)" strokeWidth="1.3" />
        <path d="M20 7l-2.5 6a2.5 2.5 0 005 0L20 7z" stroke="var(--accent)" strokeWidth="1.3" />
      </svg>
      verdict
    </Link>
  );
}
