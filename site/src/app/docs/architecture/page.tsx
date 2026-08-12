import type { Metadata } from "next";
import { Prose } from "@/components/site/prose";
import { DocFooterNav } from "@/components/site/doc-footer-nav";

export const metadata: Metadata = {
  title: "Architecture",
  alternates: { canonical: "/docs/architecture" },
  description:
    "Repository layout, the lifecycle FSM, the horizontal+vertical coding contract, and how install behaves on new vs existing projects.",
};

const LAYOUT = `AGENTS.md              # ~100-line map injected every run (table of contents)
ARCHITECTURE.md        # this file
VERSION                # canonical version (e.g. 0.7.1)
init.sh                # additive, idempotent installer (new vs existing)
bin/
  harness.sh           # front-door CLI: version · update · release · report · doctor · status
  _harness_lib.sh      # shared helpers (managed set, checksums, semver compare)
  ctx.sh               # context % estimate vs the 40% threshold
  ctx-hook.sh          # opt-in (Claude Code) PostToolUse ctx sampler → checkpoint nudge
  trace.sh             # append runtime JSONL (best-effort, never blocks)
  ralph.sh             # ralph-loop driver (work → check → repeat)
  model.sh             # resolve each sub-agent's model tier (builder upgrades to the top tier)
skills/                # source skills: skills/<name>/SKILL.md → .claude/skills/
agents/                # source sub-agents: <name>.md → .claude/agents/
docs/
  principles.md        # golden principles + Five-Step core-mind
  smart-dumb.md        # the 40% occupancy contract
  assumptions.md       # load-bearing assumptions as hypotheses-with-a-test
  exec-plans/
    active/            # in-flight plans + decision logs (committed)
    completed/         # archived plans (committed)
  references/          # *-llms.txt distillates of the source blogs
bench/cib/             # context-intelligence benchmark — the live test of the 40% line
tests/run.sh           # zero-dep TDD suite for bin/* and init.sh
harness/
  manifest.md          # neutral pointer list for non-Claude CLIs
  harness.lock         # version + pristine checksums of managed files
.trace/
  checkpoints/         # COMMITTED — decisions, milestones, handoffs
  evals/               # COMMITTED — eval verdicts (tier · verdict · criteria)
  garden-backlog.md    # COMMITTED — out-of-scope smells awaiting a sweep
  runtime/             # GITIGNORED — ephemeral per-run JSONL`;

const FSM = `intake → prd → issues → implement ⇄ evaluate → checkpoint → done
                           ↑___________|   (loop until criteria pass)
       garden ──── runs orthogonally, on signals (cadence + backlog) ────`;

export default function ArchitecturePage() {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-widest text-primary">
        Top-level map
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Architecture</h1>

      <Prose className="mt-6">
        <p>
          How harness-mini is laid out and how work flows through it.
        </p>

        <h2>Repository layout</h2>
      </Prose>
      <CodeBlock>{LAYOUT}</CodeBlock>
      <Prose className="mt-2">
        <p>
          <code>bin/harness.sh</code> is the front door: <code>version</code>{" "}
          (which also reports whether a newer harness-mini exists), <code>update</code>{" "}
          (checksum-guarded sync that keeps your edits) and <code>release</code>,
          plus <code>doctor</code> (an install health check), <code>status</code>{" "}
          (current work state for a cold resume), and <code>report</code> (a
          pure-shell aggregator over <code>.trace/</code> — stage advances, the
          context trend vs the 40% line, eval pass/fail and rework loops,
          checkpoint count — so the thresholds are tuned by data, not vibes).
        </p>
        <p>
          <code>status</code> ends with a single{" "}
          <code>ready: &lt;ready|warning|blocked&gt; — &lt;next&gt;</code> verdict
          (OpenHarness dry-run idea, Mini-shaped) so a cold session doesn&apos;t
          re-derive &quot;what next&quot; from raw facts.{" "}
          <strong>blocked</strong> only for an install-broken tree or an active{" "}
          <code>done</code> plan without <code>verdict: pass</code>;{" "}
          <strong>warnings</strong> cover no plan, garden DUE,{" "}
          <code>.new</code> conflicts, behind-latest, and partial resume. Resumable
          is <strong>plan-scoped</strong> — foreign checkpoints no longer lie.
          Assumption <strong>A6</strong> in <code>docs/assumptions.md</code>.
        </p>
        <p>
          On a fresh session the <strong>routing gate</strong> and{" "}
          <code>stage-viewer</code> run <code>harness.sh version</code> first, so
          the agent checks for a newer release before routing work and offers an{" "}
          <code>update</code> if one exists — surfaced as a semver verdict from{" "}
          <code>version</code>, an <code>update:</code> line in <code>status</code>,
          and a WARN (never a FAIL) from <code>doctor</code>. Best-effort: silent
          offline.
        </p>
      </Prose>

      <Prose className="mt-2">
        <h2>Lifecycle FSM</h2>
      </Prose>
      <CodeBlock>{FSM}</CodeBlock>
      <Prose className="mt-2">
        <ul>
          <li>
            State lives in each <code>docs/exec-plans/active/&lt;plan&gt;.md</code>{" "}
            frontmatter (<code>stage:</code>).
          </li>
          <li>
            <strong>Transition authority:</strong> agents work freely <em>within</em>{" "}
            a stage, but only the <strong>main agent</strong> (via{" "}
            <code>stage-viewer</code>) advances the FSM. No sub-agent may mark its
            own output “done” — the evaluator gate plus main-agent control is the
            anti-self-praise firewall, extended across the whole lifecycle.
            Evaluation is <strong>tiered by risk</strong> (L0 self-check · L1
            lightweight reviewer · L2 full Opus); the firewall is the{" "}
            <em>separate context</em>, not the model. The gate has teeth: every
            evaluation writes a committed verdict to{" "}
            <code>.trace/evals/&lt;plan&gt;-NNN.md</code>, and{" "}
            <code>stage-viewer</code> won&apos;t promote a plan to{" "}
            <code>done</code> without a <code>verdict: pass</code> —{" "}
            <code>doctor</code> <strong>fails</strong> any that slips through.
          </li>
          <li>
            <strong>Plan-stage write ban</strong> (convention only — no permission
            engine): while <code>stage</code> is <code>intake</code> /{" "}
            <code>prd</code> / <code>issues</code>, do not edit product code.
            Documented in <code>stage-viewer</code> + the planner; assumption{" "}
            <strong>A7</strong>. The walking skeleton starts at{" "}
            <code>implement</code>.
          </li>
        </ul>

        <h2>Coding contract: horizontal + vertical (slice-coding)</h2>
        <ul>
          <li>
            <strong>Vertical</strong> — build one feature as a thin walking skeleton
            end-to-end (it runs, it&apos;s tested) <em>before</em> starting the next
            feature. Depth-first, value-first.
          </li>
          <li>
            <strong>Horizontal</strong> — respect a fixed layer stack with{" "}
            <strong>forward-only</strong> dependencies. The reference stack (adapt
            per project):
          </li>
        </ul>
      </Prose>
      <CodeBlock>{`Types → Config → Repo → Service → Runtime → UI`}</CodeBlock>
      <Prose className="mt-2">
        <p>
          Cross-cutting concerns (auth, telemetry, feature flags, connectors) enter
          through a single explicit <strong>Providers</strong> seam. Nothing depends
          “backward.”
        </p>
        <p>
          The rule: <em>a vertical slice proves the path; then expand horizontally</em>{" "}
          across features within the same layered contract. Enforce mechanically
          where the project allows (lint / structure tests); the generator reads
          this before writing code. Once the skeleton passes evaluate, the{" "}
          <code>parallel-slices</code> skill fans that horizontal expansion out to
          several generators at once — gated on <strong>disjoint file footprints</strong>.
        </p>

        <h2>New vs existing project (set by init.sh)</h2>
        <ul>
          <li>
            <strong>new</strong> → generative bootstrap: seed{" "}
            <code>0001-intake.md</code>, run the founder funnel (founder-check →
            five-step → to-prd → to-issues).
          </li>
          <li>
            <strong>existing</strong> → recon graft: seed <code>0001-recon.md</code>,
            the explorer maps the codebase into <code>ARCHITECTURE.md</code>; skip
            the founder funnel; install additively without overwriting anything.
          </li>
        </ul>
        <p>
          Either way, install seeds a <strong>routing gate</strong> into each
          CLI&apos;s always-on file — <code>CLAUDE.md</code>,{" "}
          <code>.cursor/rules/</code>, <code>AGENTS.md</code> — so the harness is
          preferred by default: route non-trivial work through{" "}
          <code>stage-viewer</code> first, and when a harness skill and another
          tool both fit, the harness skill wins. Additive and idempotent — an
          existing <code>CLAUDE.md</code> is never clobbered.
        </p>
      </Prose>

      <DocFooterNav
        prev={{ href: "/docs/principles", label: "Principles & core-mind" }}
        next={{ href: "/docs", label: "Back to overview" }}
      />
    </>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.8rem] leading-relaxed text-foreground/90">
        <code>{children}</code>
      </pre>
    </div>
  );
}
