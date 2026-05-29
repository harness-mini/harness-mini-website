import Link from "next/link";

type DocLink = { href: string; label: string };

export function DocFooterNav({
  prev,
  next,
}: {
  prev?: DocLink;
  next?: DocLink;
}) {
  return (
    <nav className="mt-14 flex items-center justify-between gap-4 border-t border-border pt-6 text-sm">
      {prev ? (
        <Link
          href={prev.href}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          ← {prev.label}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="font-medium text-primary transition-colors hover:underline"
        >
          {next.label} →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
