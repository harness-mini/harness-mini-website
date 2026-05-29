"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DOCS_NAV } from "@/lib/site";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Docs" className="space-y-1">
      <p className="px-3 pb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Concepts
      </p>
      {DOCS_NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "block rounded-md border-l-2 px-3 py-2 text-sm transition-colors",
              active
                ? "border-primary bg-primary/10 font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
