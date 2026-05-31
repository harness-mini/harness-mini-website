---
plan: v030-content-refresh
seq: 0006
stage: done
owner: main
eval: L1
---
# Refresh website content for harness-mini v0.3.0

The site documents harness-mini, which has moved v0.1.0 → v0.3.0. The version
number is current (plan 0005 + the sync bot), but several **prose/content**
claims are now outdated — exactly the drift the detector can't catch (it diffs
version + skill/agent *names*, not the meaning of blurbs/docs). A human pass,
filed as GitHub issues #4–#6 first (per request), then fixed in one PR.

## Five-Step pass (five-step)
1. **Less dumb** — "the site describes v0.1.0 behavior; bring the prose to v0.3.0"
   (owner: Matt). 2. **Delete** — skip the 40%-tunable edit (the page already says
   the threshold is configurable) and skip codex/cursor getting-started links
   (the site already claims CLI-agnostic). 3. **Simplify** — edit existing data
   (`site.ts`) + docs pages in place; no new routes/components. 4. **Accelerate**
   — one branch, one PR closing all three issues. 5. **Automate** — n/a (content).

## Scope = three outdated areas (GitHub issues)
- **#4 Tiered evaluation (L0/L1/L2).** Site says evaluation is "always a separate
  Opus evaluator." v0.3.0: risk-scaled; firewall = separate context, not the model.
- **#5 The Mini constraint.** v0.2.0 first-class principle, absent from /docs/principles.
- **#6 Architecture layout + CLI.** Layout omits `harness.sh` (doctor/status/
  version/update/release), `_harness_lib.sh`, `VERSION`, `harness/harness.lock`,
  and shows flat skills instead of `skills/<name>/SKILL.md` folders (v0.2.0).

## Acceptance criteria
- [x] **#4** `site.ts` `evaluate` skill + `evaluator` agent blurbs convey tiering
      (L0/L1/L2, firewall = separate context); `architecture/page.tsx` firewall
      note clarified. No claim that evaluation is "always Opus".
- [x] **#5** `/docs/principles` includes "The Mini constraint" (shell-or-doc
      first · no env dependence · no complex languages · delete before you add).
- [x] **#6** `architecture/page.tsx` `LAYOUT` shows `harness.sh` +
      `_harness_lib.sh` + `VERSION` + `harness/harness.lock` + skill-folder shape,
      with a one-line `doctor`/`status` mention.
- [x] `npm run lint` + `npm run build` green (10 static routes); content renders.
- [x] PR opened that **Closes #4, #5, #6**; independent (L1) evaluator passes.

## Vertical slices (build order)
1. `site.ts` blurbs (#4) — propagates to landing skills/agents sections.
2. `architecture/page.tsx` — firewall note (#4) + LAYOUT/CLI (#6).
3. `principles/page.tsx` — Mini constraint (#5).
4. lint+build → PR (Closes #4–#6) → L1 evaluate → done.

## Decisions
- Keep `evaluator` `model: "opus"` (L2 is Opus) but state in the blurb that
  evaluation is tiered and the firewall is the separate context — the single
  `model` badge is an accepted simplification.
- Content-only change ⇒ `eval: L1` (independent lightweight reviewer in a
  separate context), per the new tiered model this plan documents.
- Out of scope: 40%-tunable enrichment (already accurate), new CLI route/section.

## Now
- Stage = `done`. Independent **L1** reviewer PASSed 5/5 (accuracy checked vs the
  upstream CHANGELOG + live repo; build green; content renders). PR #7 (Closes
  #4–#6) awaiting merge. Plan archived to `completed/`.

## Next (resume here)
1. Implement slices 1–3; lint+build.
2. Open PR closing #4–#6; hand to an independent (L1) evaluator.
3. On pass → `stage-viewer` → `done`; checkpoint; archive to `completed/`.
