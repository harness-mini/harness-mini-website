import Link from "next/link";
import { GithubIcon } from "@/components/site/icons";
import {
  REPO_URL,
  SITE_URL,
  DOCS_NAV,
  HARNESS_RELEASE,
  HARNESS_VERSION,
} from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-mono text-sm font-semibold">
            <span aria-hidden className="text-primary">❯</span>
            harness-mini
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            A minimal, CLI-agnostic agent harness. The harness is the
            environment, not a program.
          </p>
          <p className="font-mono text-xs text-muted-foreground/80">
            documenting{" "}
            <a
              href={HARNESS_RELEASE.url}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {HARNESS_VERSION}
            </a>
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Docs
          </h2>
          <ul className="space-y-2 text-sm">
            {DOCS_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Project
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <GithubIcon className="size-4" />
                GitHub repository
              </a>
            </li>
            <li>
              <a
                href={`${REPO_URL}#install`}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Install guide
              </a>
            </li>
            <li>
              <a
                href={SITE_URL}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Live site
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-mono">
            convention + skills + sub-agents + thin shell glue
          </p>
          <p>Distilled from Anthropic & OpenAI harness engineering.</p>
        </div>
      </div>
    </footer>
  );
}
