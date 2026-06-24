---
plan: v090-content-refresh
seq: 0010
stage: done
owner: main
eval: L1
verdict: pass
---
# Curate the website for harness-mini v0.8.0 → v0.9.0

The sync detector (`node bin/sync-harness.mjs --check`) reports the documented
version **v0.8.0 → v0.9.0** (upstream 37 commits ahead, `3533ca1` → `ad35d26`).
This plan does the human prose-curation the bot flags but cannot write.

## Inventory: already in sync (don't touch)
Bot reports **drift: —** on all four lines. Upstream skills + agents match
`site.ts` name-for-name. **No skill/agent add or remove.** Homepage counts stay
correct.

## What drifted = prose only (the v0.9.0 story)
The release is dominated by one thing: **CIB — the first real test of the 40%
line ("our theory").** It is the lead the README "surfaces from the front door,"
so the site must too. The honest finding (mirrored, not spun):

- **CIB** (`bench/cib/`) is a context-intelligence benchmark: build a prompt to a
  target occupancy, run an agent probe (D1 retrieval · D2 multi-hop · real
  HotpotQA QA-F1), detect changepoints vs a linear null, render an HTML report.
  Ran live over OpenRouter on **gpt-4o-mini · haiku-4.5 · Qwen2.5-7B**.
- **Result:** under a controlled design (fixed task, only fill varied) **raw
  occupancy showed no 40–50% "intelligence cliff"** — *even on Qwen2.5-7B, the
  paper's own model* (arXiv:2601.15300). Frontier models held smart to ~78–80%.
- The QA-F1 confound test settles the mechanism: a **filler** arm (irrelevant
  text) stayed flat (60.0→61.9 F1, 10→70%); a **distractor** arm (competing,
  related content) declined (49.4→40.7). ⇒ degradation tracks **interference,
  not raw occupancy**. Gradual, not a sharp 40% step.
- **Verdict (A1, `docs/assumptions.md`):** 40% is a **conservative engineering
  default** (checkpoint early = cheap insurance), not an empirically-pinned law.
  "A paper proved 40%" is withdrawn. What fills the window matters more than how
  full it is — so the fan-out firewall + progressive disclosure earn their keep
  by holding *competing content* out.
- Honest limits to carry over: synthetic filler may be more ignorable than dense
  natural prose; one model on the confound test; wide CIs; not yet on a frontier
  model. So a pure-occupancy effect on dense natural content isn't *ruled out*.

Secondary v0.9.0 changes (Cursor skill mirror; "Claude Code-first" honesty;
`HARNESS_FABLE` → `HARNESS_TOP_MODEL` model-agnostic upgrade; `tdd` one-test-per-
criterion fix) are framework-internal and **not** load-bearing for the site's
narrative — fold the headline only; do not expand pages for them this pass.

## Acceptance criteria
- [x] `site.ts`: `HARNESS_RELEASE` bumped to v0.9.0 (tag/date/url) + headline
      re-curated to the CIB result (interference, not occupancy; 40% = default).
- [x] `docs/the-40-line`: definition reframed to "clean-context budget, occupancy
      as the cheap proxy" (mirrors upstream `smart-dumb.md`); a new **"Tested:
      the CIB benchmark"** section appends the experiment + the real result
      tables (per-model shapes + the filler-vs-distractor QA-F1 table) + honest
      limits + a link to upstream `FINDINGS.md`.
- [x] Homepage `#the-40-line`: the absolute "≥40% = dumb zone" prose softened to
      a conservative checkpoint line; interference named as the real driver.
- [x] `docs/architecture`: LAYOUT lists `bench/cib/`.
- [x] `Prose` gains reusable `table` styling (DRY, used by the results tables).
- [x] `cd site && npm run lint && npm run build` green; routes unchanged (12/12).
- [x] Independent **L1** reviewer passes — separate-context `evaluator` spawned
      (A2 anti-self-praise firewall); **7/7 PASS, no required fixes**. See the
      Evaluation section below.

## Evaluation (L1, separate-context firewall)
Independent L1 reviewer (separate context, did not build the work) graded **7/7
PASS, no required fixes**. It verified by interaction: ran `npm run lint`
(clean) + `npm run build` (green, **12/12** static routes, unchanged), and —
network permitting — **fetched upstream `bench/cib/results/FINDINGS.md` from
`harness-mini/harness-mini@main`** and reconciled every repeated number against
it: arXiv:2601.15300; filler 60.0→61.9; distractor 49.4→40.7; matched baseline
52.8 vs 53.8; n=25 / 11%→82% / ±15 CI (D2 multi-hop) vs n=20-per-bucket (QA-F1
confound); frontier ~78–80%; per-model windows 128k/200k/32k; honest-limits all
agree. It confirmed the governing **honesty** decision holds — nothing claims a
proven hard 40% law; the framing is "no measured cliff under a controlled
design; interference is the driver; 40% = conservative default; the 'a paper
proved 40%' support is withdrawn (A1)". It noted upstream's own confound table
carries a sign typo ("+8.7 drop"); the site is arithmetically right (49.4 − 8.7
= 40.7) and internally self-consistent, so this is not a site defect.

One **non-blocking** observation applied post-eval (consistency tightening, not a
required fix): the homepage `FortyMeter` chip still hard-labelled the band `dumb
zone · ≥ 40%`, contradicting the softened prose two lines above it in the same
`#the-40-line` block → relabelled `checkpoint · ≥ 40%`. Rebuilt: lint clean,
build green, 12/12 routes. **verdict: pass.**

## Out of scope (delete before you add)
- Skill/agent inventory edits (in sync).
- New routes/components beyond the Prose table styles.
- Re-running the benchmark (the real results exist upstream; surface them, don't
  regenerate — re-running needs OpenRouter keys + spend and would not be
  deterministic).
- Secondary v0.9.0 framework changes as their own page sections.

## Build order (one vertical pass — pure content)
1. `Prose` table styles (enables the results tables).
2. `site.ts` headline + version bump.
3. `docs/the-40-line/page.tsx`: reframe + append the CIB "Tested" section.
4. Homepage `#the-40-line` prose softening.
5. `docs/architecture` LAYOUT `bench/cib/`.
6. lint + build → L1 evaluate → checkpoint → archive.

## Decisions
- **Honesty over spin.** The user asked to "support our theory," but the data
  *refines* it. The site mirrors upstream's own verdict: the mechanisms are
  validated, the rationale reframes occupancy → interference. We do not assert a
  proven hard 40% law.
- **Keep the test with the theory.** The CIB results live on the existing
  `/docs/the-40-line` page (claim → experiment → result), not a new route —
  matches the no-new-routes convention and tells one cohesive story.
- **Headline tracks the lead, not every change.** v0.9.0's secondary changes are
  framework-internal; the headline summarizes the CIB result.
