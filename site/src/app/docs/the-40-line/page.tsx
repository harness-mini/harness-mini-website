import type { Metadata } from "next";
import { Prose } from "@/components/site/prose";
import { DocFooterNav } from "@/components/site/doc-footer-nav";

export const metadata: Metadata = {
  title: "The 40% line",
  alternates: { canonical: "/docs/the-40-line" },
  description:
    "The smart/dumb contract — keep every agent's context in the smart zone. Sub-agent fan-out, checkpoint-and-reset at 40%, and progressive disclosure.",
};

export default function FortyLinePage() {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-widest text-primary">
        Requirement #1
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">
        The smart/dumb contract
      </h1>

      <Prose className="mt-6">
        <blockquote>
          This is the intellectual core of harness-mini: keep every agent&apos;s
          context in the <strong>smart zone</strong> at all times.
        </blockquote>

        <h2>Definition — occupancy, not content</h2>
        <p>
          “Smart” and “dumb” describe <strong>how full the context window is</strong>,
          not which content is in it.
        </p>
        <ul>
          <li>
            <strong>Smart zone — below 40% occupancy.</strong> The model reasons
            sharply, follows instructions, and holds the whole task in view.
          </li>
          <li>
            <strong>Dumb zone — at or above 40% occupancy.</strong> The model
            degrades: it drops instructions, optimizes the wrong constraint,
            exhibits “context anxiety,” and writes worse handoffs. Empirically,
            quality falls long before the nominal context limit — so the line is
            drawn early, at <strong>40%</strong>.
          </li>
        </ul>
        <p>
          The threshold is configurable (<code>HARNESS_CTX_THRESHOLD</code>,
          default 40) but 40 is the deliberate default. Every agent — main and sub
          — is responsible for keeping <strong>itself</strong> smart.
        </p>

        <h2>How the line is held (in priority order)</h2>

        <h3>1. Sub-agent fan-out — the load-bearing mechanism</h3>
        <p>
          The only mechanism that does not depend on an agent honestly measuring
          itself. The main agent stays smart by <em>delegating</em> every heavy or
          dirty operation — broad searches, large-file reads, log scans — to a
          disposable <strong>explorer</strong>. The explorer is allowed to fill its
          own window to ~90%, then returns a <strong>distillate</strong> (a few
          hundred tokens) and dies. The caller absorbs only the distillate.
          Structural, therefore reliable.
        </p>
        <blockquote>
          Rule of thumb: any operation that would pull in more than ~2k tokens →
          delegate it.
        </blockquote>

        <h3>2. 40% = the checkpoint-and-reset trigger (not a hard wall)</h3>
        <p>
          Crossing 40% does not mean “stop blindly.” It means:{" "}
          <strong>checkpoint now, while you are still sharp.</strong> Write{" "}
          <code>.trace/checkpoints/&lt;plan&gt;-&lt;seq&gt;.md</code>, update the
          active exec-plan, then reset to a fresh session that bootstraps from that
          artifact. Waiting until 90% is fatal — the handoff itself would be
          written by a degraded agent.
        </p>

        <h3>3. Measurement — best-effort, to see drift</h3>
        <p>
          <code>bin/ctx.sh &lt;used_tokens&gt; [window]</code> prints{" "}
          <code>N%</code> and exits 2 at/over threshold. You cannot portably read a
          model&apos;s internal token counter, so this is an estimate (Claude Code can
          do better via a PostToolUse hook). It is good enough to watch trends in{" "}
          <code>.trace/runtime/</code>, not a hard interrupt.
        </p>

        <h3>4. Progressive disclosure keeps the baseline low</h3>
        <p>
          <code>AGENTS.md</code> is a ~100-line map of pointers, never an
          encyclopedia. Start near-empty; pull a file only when you need it. This
          buys the most headroom for the least effort.
        </p>

        <h3>5. One bounded task per session</h3>
        <p>
          A session scoped to a single feature / plan-step never <em>needs</em> to
          hold everything, so it naturally stays under budget.
        </p>

        <h2>Enforcement style</h2>
        <p>
          <strong>Behavioral + structural</strong>, not a hard runtime kill: agents
          follow this protocol and the explorer firewall does the heavy lifting. On
          Claude Code a PostToolUse hook may log real usage as a bonus tripwire.
        </p>

        <h2>Entropy: smart context decays</h2>
        <p>
          Smart context is <strong>append-rarely, prune-aggressively.</strong> Over
          time, once-useful “always-loaded” facts rot. The <strong>gardener</strong>{" "}
          agent periodically demotes stale smart context back into dumb (on-demand)
          docs and flags drift — the garbage collector that keeps the smart zone
          smart.
        </p>
      </Prose>

      <DocFooterNav
        prev={{ href: "/docs", label: "Overview" }}
        next={{ href: "/docs/principles", label: "Principles & core-mind" }}
      />
    </>
  );
}
