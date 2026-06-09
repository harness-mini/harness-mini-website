---
plan: v071-content-refresh
seq: 0009
stage: done
owner: main
eval: L1
verdict: pass
---
# Curate the website for harness-mini v0.4.1 → v0.7.1

The sync bot opened **PR #18** (`chore/harness-sync`), bumping the documented
version v0.6.0 → **v0.7.1** — version-only. The two intervening syncs (v0.5.0,
v0.6.0 via PR #17) were also merged content-free, so the prose-curation gap
actually spans **v0.4.1 → v0.7.1**. This plan does the human curation the bot
flags but can't write, and patches PR #18's branch.

## Inventory: already in sync (don't touch)
Upstream skills (16) and agents (5) match `site.ts` name-for-name — the bot
reported "drift: —" on all four lines. **No skill/agent add or remove.** Counts
on the homepage (16 skills / 5 sub-agents) stay correct.

## What drifted = prose only (issues #19, #20)
Changelog span to reflect (framework-level only):
- **v0.5.0** — gardening fires on concrete signals: cadence (≥5 checkpoints /
  `HARNESS_GARDEN_EVERY`) + a committed `.trace/garden-backlog.md`; `status`
  gains a `garden: DUE|ok` line.
- **v0.6.0** — update reminder on entry: routing gate + `stage-viewer` run
  `harness.sh version` first; surfaced by `version` / `status` (`update:` line) /
  `doctor` (a WARN).
- **v0.7.0** — `harness.sh report [run]` (aggregates `.trace/`); committed eval
  verdicts in `.trace/evals/<plan>-NNN.md` (`doctor` FAILs `done` without
  `verdict: pass`; `stage-viewer` won't promote without it); `bin/ctx-hook.sh`
  (opt-in Claude Code PostToolUse adapter — records `ctx_pct`, nudges to
  checkpoint).
- **v0.7.1** — contributing-is-issue-first: repo-process only, *deliberately not
  in the CLI-agnostic framework* → **not** surfaced on the site.

## Acceptance criteria
- [x] **#19** `site.ts`: `HARNESS_RELEASE.headline` re-curated to the v0.7.0
      substance (report + firewall teeth); `garden` blurb reflects the trigger
      policy; `evaluate` blurb notes the committed `.trace/evals/` verdict.
- [x] **#20** `docs/architecture`: LAYOUT lists `report` + `bin/ctx-hook.sh` and
      committed `.trace/evals/` + `.trace/garden-backlog.md`; prose covers
      `report` and the update reminder; the firewall note gains its v0.7.0 teeth.
- [x] **#20** `docs/the-40-line`: measurement/enforcement reflects `ctx-hook.sh`
      and `report`'s context-trend aggregation.
- [x] `cd site && npm run lint && npm run build` green; routes unchanged.
- [x] Independent **L1** reviewer passes; PR #18 updated to `Closes #19, #20`.

## Evaluation (L1, separate-context firewall)
Independent L1 reviewer (separate context) graded 5/6 PASS on the first pass and
returned one narrow required fix on criterion 2: the architecture prose attributed
the on-entry update check to the `version` subcommand alone, missing that the
routing gate + `stage-viewer` run `harness.sh version` first (v0.6.0). Applied
verbatim — added a dedicated paragraph covering the on-entry trigger and the full
surface (`version` semver verdict · `status` `update:` line · `doctor` WARN, never
FAIL · silent offline). Rebuild green; **verdict: pass**.

## Out of scope (delete before you add)
- Skill/agent inventory edits (already in sync).
- v0.7.1 contributing workflow (repo-only, not framework).
- New routes/components; homepage copy beyond what `site.ts` propagates.

## Build order (one vertical pass — pure content, no new layers)
1. `site.ts` headline + two blurbs (#19).
2. `docs/architecture/page.tsx` LAYOUT + prose + firewall note (#20).
3. `docs/the-40-line/page.tsx` measurement/enforcement (#20).
4. lint + build → L1 evaluate → checkpoint → archive → push to PR #18.

## Decisions
- **Patch the bot branch, don't reopen.** PR #18 is the curation vehicle; this
  plan supplies items 1–3 of its human checklist.
- **Headline tracks substance, not the patch tag.** v0.7.1 itself is repo-only;
  the displayed "what's new" summarizes the v0.7.0 framework features.
