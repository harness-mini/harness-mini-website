import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gauge, Workflow, FileTerminal } from "lucide-react";
import { Prose } from "@/components/site/prose";
import { Terminal } from "@/components/site/terminal";
import { DOCS_NAV, INSTALL_CMD, REPO_URL, REFERENCES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Docs",
  alternates: { canonical: "/docs" },
  description:
    "Documentation for harness-mini — the 40% line, the lifecycle, principles, and architecture.",
};

const CARDS = [
  {
    href: "/docs/the-40-line",
    icon: Gauge,
    title: "The 40% line",
    body: "The smart/dumb contract — the intellectual core. How every agent keeps its context in the smart zone.",
  },
  {
    href: "/docs/principles",
    icon: FileTerminal,
    title: "Principles & core-mind",
    body: "Musk's Five-Step Algorithm, the golden principles, and the clean-code / refactor quality spine.",
  },
  {
    href: "/docs/architecture",
    icon: Workflow,
    title: "Architecture",
    body: "Repository layout, the lifecycle FSM, the horizontal+vertical coding contract, and new-vs-existing install.",
  },
];

export default function DocsOverview() {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-widest text-primary">
        Documentation
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Overview</h1>

      <Prose className="mt-6">
        <p>
          <strong>harness-mini</strong> is a minimal, CLI-agnostic agent harness:
          convention + skills + sub-agents + distilled best-practice docs, with
          only thin shell glue as code. It encodes the patterns from Anthropic&apos;s
          long-running-agent engineering, OpenAI&apos;s harness engineering, and
          Anthropic&apos;s Founder&apos;s Playbook into a structure you can drop into any
          project.
        </p>
        <p>
          The harness <em>is the environment</em>, not a program. Any agent that
          can run a shell — <code>claude</code>, <code>codex</code>,{" "}
          <code>cursor</code> — can use it. The repository is the system of
          record: anything not in a version-controlled file does not exist to the
          agent.
        </p>
      </Prose>

      <div className="mt-8">
        <Terminal command={INSTALL_CMD} label="install" />
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-1">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex items-start gap-4 rounded-xl border border-border bg-card/40 p-5 transition-colors hover:border-primary/40 hover:bg-card"
          >
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
              <c.icon className="size-4.5" />
            </div>
            <div className="min-w-0">
              <h2 className="flex items-center gap-1.5 font-semibold tracking-tight">
                {c.title}
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mt-14 text-xl font-semibold tracking-tight">
        References distilled in the harness
      </h2>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {REFERENCES.map((r) => (
          <li key={r} className="flex gap-2">
            <span aria-hidden className="text-primary">›</span>
            {r}
          </li>
        ))}
      </ul>

      <div className="mt-10 rounded-xl border border-border bg-card/40 p-5 text-sm text-muted-foreground">
        Looking for the source, skills, and sub-agents?{" "}
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary hover:underline"
        >
          Browse the repository on GitHub
        </a>
        , or jump to{" "}
        <Link href={DOCS_NAV[1].href} className="font-medium text-primary hover:underline">
          {DOCS_NAV[1].label}
        </Link>
        .
      </div>
    </>
  );
}
