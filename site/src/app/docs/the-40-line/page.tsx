import type { Metadata } from "next";
import { Prose } from "@/components/site/prose";
import { DocFooterNav } from "@/components/site/doc-footer-nav";

export const metadata: Metadata = {
  title: "The 40% line",
  alternates: { canonical: "/docs/the-40-line" },
  description:
    "The smart/dumb contract — keep every agent's context in the smart zone. We built the CIB benchmark to test it: raw occupancy showed no 40% cliff; interference (competing content), not how full the window is, is what degrades quality. So 40% is a conservative checkpoint default, held by sub-agent fan-out and progressive disclosure.",
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

        <h2>Definition — a clean-context budget, with occupancy as the cheap proxy</h2>
        <p>
          “Smart” and “dumb” name a <strong>budget for keeping context clean.</strong>{" "}
          40% occupancy is the <em>operating trigger</em> we measure — but, as the
          benchmark below shows, <strong>what fills the window matters more than how
          full it is.</strong> Treat 40% as a conservative checkpoint default, not a
          law.
        </p>
        <ul>
          <li>
            <strong>Smart zone — below 40% occupancy (default trigger).</strong>{" "}
            Comfortable headroom to reason, follow instructions, and write a clean
            handoff.
          </li>
          <li>
            <strong>Dumb zone — at or above 40%.</strong> Not a measured cliff — a{" "}
            <strong>checkpoint-now</strong> line drawn early so quality never gets the
            chance to slide.
          </li>
        </ul>
        <p>
          The threshold is configurable (<code>HARNESS_CTX_THRESHOLD</code>, default
          40); 40 is the deliberate default. Every agent — main and sub — is
          responsible for keeping <strong>itself</strong> smart.
        </p>

        <h2>Tested: the CIB benchmark</h2>
        <p>
          The 40% line was, for a long time, a heuristic backed by a citation. In{" "}
          <strong>v0.9.0</strong> the harness put it on trial. We built{" "}
          <strong>CIB</strong> — a context-intelligence benchmark (
          <code>bench/cib/</code>) — and ran it live over OpenRouter on three
          models: <code>gpt-4o-mini</code>, <code>claude-haiku-4.5</code>, and{" "}
          <code>qwen-2.5-7b-instruct</code> — the exact model from the paper
          (arXiv:2601.15300) that motivated the line. Occupancy is measured from the
          real <code>usage.prompt_tokens</code> each response reports.
        </p>
        <p>
          The design is the whole point. Earlier &ldquo;context cliff&rdquo; results
          confound length with difficulty — longer natural documents are also{" "}
          <em>harder</em> documents. CIB holds the probe <strong>identical</strong>{" "}
          and varies <strong>only the filler</strong>, so any decline is attributable
          to occupancy alone.
        </p>

        <h3>Result 1 — raw occupancy showed no 40% cliff</h3>
        <p>
          Under the controlled design, <strong>no model exhibited the paper&apos;s
          40–50% intelligence cliff</strong> — including the paper&apos;s own model.
          Frontier models held retrieval quality smart all the way to ~78–80%
          occupancy.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>Window</th>
                <th>Shape across occupancy</th>
                <th>40% cliff?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>gpt-4o-mini</code>
                </td>
                <td>128k</td>
                <td>flat ~90–100, smart to 77%</td>
                <td>none</td>
              </tr>
              <tr>
                <td>
                  <code>claude-haiku-4.5</code>
                </td>
                <td>200k</td>
                <td>flat ~75–78%, dips only at ~89%</td>
                <td>none below ~88%</td>
              </tr>
              <tr>
                <td>
                  <code>qwen-2.5-7b</code> <em>(paper&apos;s model)</em>
                </td>
                <td>32k</td>
                <td>flat-noisy, no 40–50% step</td>
                <td>none</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Reasoning was probed too — a controlled multi-hop replication on
          Qwen2.5-7B, calibrated to a mid-range baseline and run to{" "}
          <strong>n=25</strong> per bucket (a low-N pass produced a false cliff that
          n=25 erased). Pass-rate by occupancy from 11% → 82% stayed flat within a
          ±15 confidence interval — the most-filled bucket scored as well as the
          emptiest.
        </p>

        <h3>Result 2 — interference is the real driver, not occupancy</h3>
        <p>
          The decisive experiment used the paper&apos;s actual task (HotpotQA
          multi-hop) and metric (token-F1). The <strong>same 20 questions</strong>{" "}
          were asked at every occupancy bucket — difficulty held constant — and the
          window was padded two ways:
        </p>
        <ul>
          <li>
            <strong>filler arm</strong> — irrelevant repeated text: occupancy ↑,
            interference flat.
          </li>
          <li>
            <strong>distractor arm</strong> — competing, related Wikipedia
            paragraphs: occupancy ↑, interference ↑.
          </li>
        </ul>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Arm</th>
                <th>F1 @ low occ (≤25%)</th>
                <th>F1 @ high occ (≥55%)</th>
                <th>Across the fill</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>filler (pure occupancy)</td>
                <td>60.0</td>
                <td>61.9</td>
                <td>≈ flat</td>
              </tr>
              <tr>
                <td>distractor (interference)</td>
                <td>49.4</td>
                <td>40.7</td>
                <td>−8.7, declines</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          At the matched ~10% baseline the two arms are identical (52.8 vs 53.8). As
          the window fills, the filler arm stays flat while the distractor arm
          declines, and the gap widens to ~20 F1 points — a{" "}
          <strong>gradual</strong> decline, with no sharp 40% step in either arm.
          Filling the window with <em>irrelevant</em> text is tolerated; filling it
          with <em>competing, related</em> content is what costs quality.
        </p>

        <h3>The verdict</h3>
        <blockquote>
          Raw context occupancy alone shows no 40% intelligence cliff under a
          controlled design. What degrades quality is <strong>interference</strong> —{" "}
          <em>what</em> fills the window, not <em>how full</em> it is.
        </blockquote>
        <p>
          So the line&apos;s real job is to bound interference, and the mechanisms
          below — fan-out distillation and progressive disclosure — earn their keep
          by keeping <strong>competing content out</strong>. Occupancy is just the
          proxy we can cheaply measure. 40% stays as a{" "}
          <strong>conservative engineering default</strong> (checkpoint early — cheap
          insurance), not an empirically-pinned constant; the &ldquo;a paper proved
          40%&rdquo; support is withdrawn. This is recorded as assumption{" "}
          <strong>A1</strong> in <code>docs/assumptions.md</code>.
        </p>
        <p>
          <strong>Honest limits.</strong> CIB&apos;s filler is synthetic and may be
          more &ldquo;ignorable&rdquo; than dense natural prose; the confound test is
          one model (Qwen2.5-7B), one dataset, with wide (±~20) confidence intervals,
          and is not yet run on a frontier model. So a pure-occupancy effect on dense{" "}
          <em>natural</em> content is not <em>ruled out</em> — only that a controlled
          probe on the paper&apos;s own model does not show the advertised cliff. Full
          method, data, and the self-contained HTML reports live in{" "}
          <a
            href="https://github.com/harness-mini/harness-mini/blob/main/bench/cib/results/FINDINGS.md"
            target="_blank"
            rel="noreferrer"
          >
            <code>bench/cib/results/FINDINGS.md</code>
          </a>
          .
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
          model&apos;s internal token counter, so this is an estimate. On Claude
          Code the opt-in <code>bin/ctx-hook.sh</code> PostToolUse adapter does
          better — it records a <code>ctx_pct</code> sample after each tool call
          and nudges you to checkpoint once you cross the line.{" "}
          <code>harness.sh report</code> then aggregates those samples into a
          context trend (sample count, max %, crossings) — enough to watch drift
          in <code>.trace/</code>, not a hard interrupt.
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
          Claude Code, the opt-in <code>ctx-hook.sh</code> adds a real-usage
          tripwire on top.
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
