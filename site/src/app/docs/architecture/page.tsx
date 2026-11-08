import type { Metadata } from "next";
import { Prose } from "@/components/site/prose";
import { DocFooterNav } from "@/components/site/doc-footer-nav";

export const metadata: Metadata = {
  title: "Architecture",
  alternates: { canonical: "/docs/architecture" },
  description:
    "Repository layout, the lifecycle FSM, the horizontal+vertical coding contract, and how install behaves on new vs existing projects.",
};

const LAYOUT = `# Two file classes (zero-intrusion install)

<project>/.harness-mini/     # PROJECT PROGRESS — committed (except trace/runtime/)
  .gitignore                 #   ignores trace/runtime/ (the project's own .gitignore stays untouched)
  architecture.md            #   this project's recon output (the explorer fills it)
  docs/exec-plans/
    active/                  #   in-flight dual-file plans (.md + .json twin) + decision logs
    completed/               #   archived plans
  trace/
    checkpoints/             #   COMMITTED — decisions, milestones, handoffs
    evals/                   #   COMMITTED — <plan>-NNN.md verdicts (the done-gate)
    garden-backlog.md        #   COMMITTED — smell backlog
    runtime/                 #   GITIGNORED — ephemeral per-run JSONL (report reads these)

$HARNESS_HOME/               # HARNESS-OWNED — default ~/.harness-mini/
  bin/                       #   executables (harness.sh, ctx.sh, trace.sh, ...)
  VERSION · harness/runtime.lock   # version + checksums of bin/*
  AGENTS.md                  #   the full agent map (the project block points here)
  docs/                      #   static docs: principles, smart-dumb, templates, walkthrough
  skills/  agents/           #   sources that agent install <host> copies from
  projects/
    <project-id>/            #   per-project bookkeeping (harness.lock · manifest.md · targets)
                             #   0.13 state dirs move here automatically, never overwriting

# Besides .harness-mini/, an install writes only:
#   one <!-- harness-mini:begin/end --> block in the root AGENTS.md,
#   lines in the local .git/info/exclude, and — after agent install —
#   the host's skills/agents dirs. No docs/, bin/, ARCHITECTURE.md,
#   CLAUDE.md, or .gitignore edits in your project.`;

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

        <h2>Two file classes: layout</h2>
      </Prose>
      <CodeBlock>{LAYOUT}</CodeBlock>
      <Prose className="mt-2">
        <p>
          <code>~/.harness-mini/bin/harness.sh</code> is the front door:{" "}
          <code>version</code> (which also reports whether a newer harness-mini
          exists), <code>update</code> (checksum-guarded sync that keeps your
          edits, never downgrades the runtime unless{" "}
          <code>--force</code>, refreshes the global copies, and migrates a
          pre-0.13 layout),{" "}
          <code>agent list | install &lt;host&gt;</code> (host-aware skills +
          roles for 16 coding-agent hosts), <code>diff</code> (compare a kept
          file against its upstream <code>.new</code>), and{" "}
          <code>release</code>, plus <code>doctor</code> (an install health
          check, including installed-drift on skills), <code>status</code>{" "}
          (current work state for a cold resume), and <code>report</code> (a
          pure-shell aggregator over <code>.harness-mini/trace/</code> — stage
          advances, the context trend vs the 40% line, eval pass/fail and
          rework loops, checkpoint count — so the thresholds are tuned by
          data, not vibes).
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
            State lives in each{" "}
            <code>.harness-mini/docs/exec-plans/active/&lt;plan&gt;.md</code>{" "}
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
            <code>.harness-mini/trace/evals/&lt;plan&gt;-NNN.md</code>, and{" "}
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

        <h2>The session path (v0.13)</h2>
        <p>
          Every session starts from file truth, not memory. The{" "}
          <strong>routing gate</strong> runs <code>harness.sh status</code>{" "}
          first and branches on its <code>path:</code> line:
        </p>
      </Prose>
      <CodeBlock>{`$ "$HOME/.harness-mini/bin/harness.sh" --root "$PWD" status
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
            unattended runs,{" "}
            <code>~/.harness-mini/bin/session.sh -- &lt;your-host-cli&gt; …</code>{" "}
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
          <strong>existing</strong> → recon graft: seed{" "}
          <code>0001-recon.md</code>, the explorer maps the codebase into{" "}
          <code>.harness-mini/architecture.md</code>; skip the founder funnel;
          install additively without overwriting anything.
          </li>
        </ul>
        <p>
          Either way, install grafts a <strong>routing gate</strong> as one
          marked <code>&lt;!-- harness-mini:begin/end --&gt;</code> block in
          the project&apos;s root <code>AGENTS.md</code> (the file is created
          holding only the block if absent; text outside the block is never
          touched) so the harness is preferred by default: run{" "}
          <code>harness.sh status</code> first, branch on its{" "}
          <code>path:</code> line (see <em>The session path</em> above), route
          non-trivial work through <code>stage-viewer</code>, and when a
          harness skill and another tool both fit, the harness skill wins. The
          block tells the agent to run <code>agent list</code> then{" "}
          <code>agent install &lt;host&gt;</code> — <code>init.sh</code>{" "}
          itself is host-blind and installs no skills or agents. Additive and
          idempotent; a pre-0.13 install is migrated automatically on
          re-run, and nothing is removed unless it is safe.
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
