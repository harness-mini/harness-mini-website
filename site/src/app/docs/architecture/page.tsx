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
  ctx-hook.sh          # opt-in PostToolUse sampler → checkpoint nudge + last-green test stamp
  trace.sh             # append runtime JSONL (best-effort, never blocks)
  ralph.sh             # ralph-loop driver (work → check → repeat)
  session.sh           # Outer session runner (optional P2): force the matching session-* playbook into a fresh context
  model.sh             # resolve each sub-agent's model tier (builder upgrades to the top tier)
skills/                # source skills: skills/<name>/SKILL.md → .claude/skills/
  checkpoint/scripts/   # skill-owned Footprint lint, source snapshots, and no-op guard
agents/                # source sub-agents: <name>.md → .claude/agents/
docs/
  principles.md        # golden principles + the Mini delete-first constraint
  smart-dumb.md        # the 40% occupancy contract
  assumptions.md       # load-bearing assumptions as hypotheses-with-a-test
  exec-plans/
    active/            # in-flight dual-file plans (.md + .json twin) + decision logs (committed)
    completed/         # archived plans (committed)
  references/          # *-llms.txt distillates of the source blogs
bench/cib/             # context-intelligence benchmark — the live test of the 40% line
tests/run.sh           # zero-dep TDD suite for bin/*, skill scripts, and init.sh
harness/
  manifest.md          # neutral pointer list for other CLIs
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
          <code>status</code> also prints each active plan&apos;s{" "}
          <strong>workboard line</strong> from its JSON twin (
          <code>status · n/m pass · current · next passes:false</code> slice) and
          the <strong>session path</strong> — two machine lines,{" "}
          <code>path: init|coding</code> + <code>path_reason:</code>, derived
          only from file truth (MD <code>stage:</code> + the twin). It ends with
          a single <code>ready: &lt;ready|warning|blocked&gt; — &lt;next&gt;</code>{" "}
          verdict (OpenHarness dry-run idea, Mini-shaped) so a cold session
          doesn&apos;t re-derive &quot;what next&quot; from raw facts.{" "}
          <strong>blocked</strong> only for an install-broken tree or an active{" "}
          <code>done</code> plan without <code>verdict: pass</code>;{" "}
          <strong>warnings</strong> cover no plan, garden DUE,{" "}
          <code>.new</code> conflicts, behind-latest, and partial resume. Resumable
          is <strong>plan-scoped</strong> — foreign checkpoints no longer lie.
          Assumption <strong>A6</strong> in <code>docs/assumptions.md</code>.
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
            frontmatter (<code>stage:</code>) — the lifecycle authority —
            mirrored by a same-basename <strong>JSON twin</strong> (
            <code>status</code>, <code>current_slice_id</code>,{" "}
            <code>slices[].passes</code>). <code>passes</code> flips to true only
            via the main agent <em>after an evaluator verdict</em>; the twin&apos;s{" "}
            <code>steps</code> are test conditions and are never altered.
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

        <h2>The session path (v0.12)</h2>
        <p>
          Every session starts from file truth, not memory. The{" "}
          <strong>routing gate</strong> runs <code>harness.sh status</code>{" "}
          first and branches on its <code>path:</code> line:
        </p>
      </Prose>
      <CodeBlock>{`$ bin/harness.sh status
active plans:
  demo-auth                stage: implement
     workboard: in_progress · 1/3 pass · current: slice-002 · next: slice-002
path: coding
path_reason: next slice ready
ready: ready — slice-002: write the failing 401 test, then bcrypt verification`}</CodeBlock>
      <Prose className="mt-2">
        <ul>
          <li>
            <code>path: init</code> → the <code>session-init</code> skill:
            plan-layer work only (funnel, PRD, issues, the twin) —{" "}
            <strong>no product code</strong> on this path.
          </li>
          <li>
            <code>path: coding</code> → the <code>session-coding</code> skill: a
            mandatory five-step <strong>Getting Bearings</strong> first turn,
            then exactly <strong>one slice</strong>, test-first, verified
            against the twin&apos;s <code>steps</code> and routed through{" "}
            <code>evaluate</code>.
          </li>
          <li>
            A missing/unparseable twin degrades conservatively to{" "}
            <code>init</code> — coding must be proven from files. For
            unattended runs, <code>bin/session.sh -- &lt;your-host-cli&gt; …</code>{" "}
            forces the matching playbook into a fresh context (optional P2).
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
            to-prd → to-issues).
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
          preferred by default: run <code>harness.sh status</code> first, branch
          on its <code>path:</code> line (see{" "}
          <em>The session path</em> above), route non-trivial work through{" "}
          <code>stage-viewer</code>, and when a harness skill and another tool
          both fit, the harness skill wins. Additive and idempotent — an
          existing <code>CLAUDE.md</code> is never clobbered, and older gate
          versions are upgraded in place (marker-guarded, exactly one gate).
        </p>
      </Prose>

      <DocFooterNav
        prev={{ href: "/docs/principles", label: "Principles" }}
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
