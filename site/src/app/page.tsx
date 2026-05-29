import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  FileTerminal,
  Gauge,
  GitBranch,
  Layers,
  Recycle,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Eyebrow, ModelBadge } from "@/components/site/primitives";
import { GithubIcon } from "@/components/site/icons";
import { Terminal } from "@/components/site/terminal";
import {
  AGENTS,
  CHANGELOG_URL,
  HARNESS_RELEASE,
  HARNESS_VERSION,
  INSTALL_CMD,
  LIFECYCLE,
  REPO_URL,
  SKILLS,
  STAGE_LABEL,
  type StageKey,
} from "@/lib/site";

const STATS = [
  { value: String(SKILLS.length), label: "skills" },
  { value: String(AGENTS.length), label: "sub-agents" },
  { value: "0", label: "runtime deps" },
  { value: "40%", label: "the one rule" },
];

const FEATURES = [
  {
    icon: FileTerminal,
    title: "Convention, not code",
    body: "The harness is a structure of Markdown + thin shell glue. There is no program to run — the repository is the system of record, and any shell-capable agent can read it.",
  },
  {
    icon: ShieldCheck,
    title: "Context firewalls",
    body: "Heavy reads and broad searches are delegated to disposable sub-agents that burn their own window and return a small distillate. The caller never leaves the smart zone.",
  },
  {
    icon: GitBranch,
    title: "CLI-agnostic",
    body: "Skills and agents install to .claude/ for Claude Code; a neutral manifest points other CLIs — codex, cursor — at the same files. One harness, any agent.",
  },
];

const MECHANISMS = [
  {
    icon: ScanSearch,
    title: "Delegate heavy work",
    body: "Any operation that would read more than ~2k tokens goes to the explorer sub-agent — the load-bearing mechanism that doesn't depend on an agent measuring itself.",
  },
  {
    icon: Gauge,
    title: "Checkpoint at 40%",
    body: "Crossing the line means checkpoint now, while still sharp: write a handoff, update the plan, reset. Waiting until 90% is fatal — the handoff itself would be degraded.",
  },
  {
    icon: Layers,
    title: "Progressive disclosure",
    body: "AGENTS.md is a ~100-line map of pointers, never an encyclopedia. Start near-empty; pull a file only when you need it. Most headroom for the least effort.",
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/80">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-60" />
        <div aria-hidden className="absolute inset-0 hero-glow" />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background"
        />
        <Container className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>
              <span className="text-primary">❯</span>
              minimal · CLI-agnostic ·{" "}
              <a
                href={HARNESS_RELEASE.url}
                target="_blank"
                rel="noreferrer"
                className="text-foreground/90 transition-colors hover:text-primary"
              >
                {HARNESS_VERSION}
              </a>
            </Eyebrow>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
              A minimal, CLI-agnostic{" "}
              <span className="text-primary text-glow">agent harness</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Convention + skills + sub-agents + distilled best-practice docs —
              with only thin shell glue as code. Drop it into any project; any
              agent that can run a shell can use it.
            </p>
            <p className="mx-auto mt-3 max-w-xl font-mono text-sm text-muted-foreground/80">
              The harness is the environment, not a program.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="#install"
                className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 px-5 text-sm")}
              >
                Get started
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/docs"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 px-5 text-sm",
                )}
              >
                Read the docs
              </Link>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "h-11 gap-2 px-4 text-sm",
                )}
              >
                <GithubIcon className="size-4" />
                GitHub
              </a>
            </div>

            <div className="mx-auto mt-12 max-w-xl text-left">
              <Terminal command={INSTALL_CMD} label="install" />
            </div>

            <p className="mx-auto mt-4 max-w-xl text-center text-xs text-muted-foreground">
              What&apos;s new in{" "}
              <a
                href={HARNESS_RELEASE.url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-foreground/90 transition-colors hover:text-primary"
              >
                {HARNESS_VERSION}
              </a>
              : {HARNESS_RELEASE.headline}{" "}
              <a
                href={CHANGELOG_URL}
                target="_blank"
                rel="noreferrer"
                className="text-primary/90 underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                Changelog →
              </a>
            </p>

            <dl className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="bg-card px-4 py-5 text-center">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-mono text-2xl font-semibold text-primary">
                    {s.value}
                  </dd>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="border-b border-border/80 py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card/40 p-6"
              >
                <div className="flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── The 40% line ─────────────────────────────────────────────── */}
      <section id="the-40-line" className="scroll-mt-20 border-b border-border/80 py-20">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>
              <Gauge className="size-3.5 text-primary" />
              the one rule
            </Eyebrow>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              The 40% line
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Context occupancy below <strong className="text-foreground">40%</strong>{" "}
              is the <span className="text-primary">smart zone</span> — the model
              reasons sharply and holds the whole task in view. At or above 40% is
              the <span className="text-amber">dumb zone</span>: it drops
              instructions, optimizes the wrong constraint, and writes worse
              handoffs. Quality falls long before the nominal context limit, so the
              line is drawn early.
            </p>
          </div>

          <FortyMeter />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {MECHANISMS.map((m, i) => (
              <div
                key={m.title}
                className="rounded-xl border border-border bg-card/40 p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    0{i + 1}
                  </span>
                  <m.icon className="size-4 text-primary" />
                </div>
                <h3 className="mt-3 font-semibold tracking-tight">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {m.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/docs/the-40-line"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Read the smart/dumb contract
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── Lifecycle ────────────────────────────────────────────────── */}
      <section id="lifecycle" className="scroll-mt-20 border-b border-border/80 py-20">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>
              <Workflow className="size-3.5 text-primary" />
              the state machine
            </Eyebrow>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              A lifecycle you live inside
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every requirement is a file with a{" "}
              <code className="font-mono text-sm">stage:</code> field. Work flows
              through a fixed FSM — and only the main agent may advance it.
            </p>
          </div>

          <LifecycleStrip />

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card/40 p-6">
              <ShieldCheck className="size-5 text-primary" />
              <h3 className="mt-3 font-semibold tracking-tight">
                Anti-self-praise firewall
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                No worker promotes its own work to{" "}
                <code className="font-mono">done</code>. The evaluator grades from
                a separate window, and only the main agent advances the stage.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/40 p-6">
              <Recycle className="size-5 text-amber" />
              <h3 className="mt-3 font-semibold tracking-tight">
                Garden runs orthogonally
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Technical debt is paid in small, continuous installments. The
                gardener periodically demotes stale context and opens small,
                green, one-move fixes.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Skills ───────────────────────────────────────────────────── */}
      <section id="skills" className="scroll-mt-20 border-b border-border/80 py-20">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>
              <Sparkles className="size-3.5 text-primary" />
              how to do a task
            </Eyebrow>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              {SKILLS.length} skills, by stage
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Skills install to{" "}
              <code className="font-mono text-sm">.claude/skills/</code> and encode{" "}
              <em>how</em> to do a task — invoked at the right point in the
              lifecycle.
            </p>
          </div>

          <div className="mt-10 space-y-10">
            {(Object.keys(STAGE_LABEL) as StageKey[]).map((stage) => {
              const items = SKILLS.filter((s) => s.stage === stage);
              if (items.length === 0) return null;
              return (
                <div key={stage}>
                  <div className="flex items-center gap-3">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-primary">
                      {STAGE_LABEL[stage]}
                    </h3>
                    <div className="h-px flex-1 bg-border" />
                    <span className="font-mono text-xs text-muted-foreground">
                      {items.length}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((s) => (
                      <Card
                        key={s.name}
                        className="gap-0 border-border bg-card/40 py-0"
                      >
                        <CardHeader className="px-5 pt-5">
                          <CardTitle className="font-mono text-sm">
                            <span className="text-primary">/</span>
                            {s.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-5 pb-5 pt-2">
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {s.blurb}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Sub-agents ───────────────────────────────────────────────── */}
      <section id="agents" className="scroll-mt-20 border-b border-border/80 py-20">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>
              <Boxes className="size-3.5 text-primary" />
              who does the work
            </Eyebrow>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              {AGENTS.length} sub-agents
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Separate context windows are firewalls. Each agent has a role, a
              model sized to it, and a strict boundary it never crosses.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {AGENTS.map((a) => (
              <div
                key={a.name}
                className="flex flex-col rounded-xl border border-border bg-card/40 p-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-mono text-base font-semibold">{a.name}</h3>
                  <ModelBadge model={a.model} />
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {a.role}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {a.blurb}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Install ──────────────────────────────────────────────────── */}
      <section id="install" className="scroll-mt-20 py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <Eyebrow>
                <FileTerminal className="size-3.5 text-primary" />
                install
              </Eyebrow>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Installs like a skill
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Tell your agent <em>“install harness-mini here”</em>, or clone and
                run the installer. <code className="font-mono text-sm">init.sh</code>{" "}
                is <strong className="text-foreground">additive</strong> (never
                overwrites your files) and{" "}
                <strong className="text-foreground">idempotent</strong> (safe to
                re-run).
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-border bg-card/40 p-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <h3 className="font-semibold tracking-tight">
                      New / empty project
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Generative bootstrap — seeds an intake plan and runs the
                    founder funnel:{" "}
                    <code className="font-mono text-xs">
                      founder-check → five-step → to-prd → to-issues
                    </code>
                    .
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card/40 p-5">
                  <div className="flex items-center gap-2">
                    <ScanSearch className="size-4 text-amber" />
                    <h3 className="font-semibold tracking-tight">
                      Existing project
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Recon graft — installs additively and seeds a recon plan; the
                    explorer maps your codebase into{" "}
                    <code className="font-mono text-xs">ARCHITECTURE.md</code>.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <Terminal command={INSTALL_CMD} label="bash" />
              <p className="mt-4 text-sm text-muted-foreground">
                Skills install to{" "}
                <code className="font-mono text-xs">.claude/skills/</code> and
                agents to <code className="font-mono text-xs">.claude/agents/</code>{" "}
                (auto-loaded by Claude Code);{" "}
                <code className="font-mono text-xs">harness/manifest.md</code> is a
                neutral pointer list for other CLIs.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 px-5 text-sm")}
                >
                  <GithubIcon className="size-4" />
                  View on GitHub
                </a>
                <Link
                  href="/docs"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 gap-2 px-5 text-sm",
                  )}
                >
                  Read the docs
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ── Local presentational components ─────────────────────────────────── */

function FortyMeter() {
  return (
    <div className="mt-10 rounded-xl border border-border bg-card/40 p-6">
      <div className="flex items-end justify-between font-mono text-xs">
        <span className="text-primary">smart zone · &lt; 40%</span>
        <span className="text-amber">dumb zone · ≥ 40%</span>
      </div>
      <div className="relative mt-3 h-8 overflow-hidden rounded-md border border-border">
        <div className="absolute inset-y-0 left-0 w-[40%] bg-gradient-to-r from-primary/30 to-primary/15" />
        <div className="absolute inset-y-0 left-[40%] right-0 bg-gradient-to-r from-amber/20 to-destructive/20" />
        <div className="absolute inset-y-0 left-[40%] w-px bg-foreground/60" />
        <div className="absolute left-[40%] top-1/2 -translate-x-1/2 -translate-y-1/2 rounded border border-foreground/40 bg-background px-1.5 py-0.5 font-mono text-[0.7rem] font-semibold">
          40%
        </div>
      </div>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        configurable via HARNESS_CTX_THRESHOLD · estimate with{" "}
        <span className="text-foreground">bin/ctx.sh &lt;used&gt; [window]</span>
      </p>
    </div>
  );
}

function LifecycleStrip() {
  return (
    <div className="mt-10 rounded-xl border border-border bg-card/40 p-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-3 font-mono text-sm">
        {LIFECYCLE.map((s, i) => (
          <li key={s.stage} className="flex items-center gap-2">
            <span
              title={s.blurb}
              className={cn(
                "rounded-md border px-2.5 py-1",
                s.stage === "done"
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border bg-background text-foreground",
              )}
            >
              {s.stage}
            </span>
            {i < LIFECYCLE.length - 1 && (
              <span aria-hidden className="text-muted-foreground">
                {LIFECYCLE[i + 1].stage === "evaluate" ? "⇄" : "→"}
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-muted-foreground">
        <span className="font-mono text-primary">implement ⇄ evaluate</span> loops
        until acceptance criteria pass.{" "}
        <span className="font-mono text-amber">garden</span> runs orthogonally,
        periodically — across the whole lifecycle.
      </p>
    </div>
  );
}
