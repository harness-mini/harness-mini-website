---
plan: v071-content-refresh
seq: 001
stage: done
ctx_pct_at_checkpoint: 50
prev: seo-0001
eval: L1
verdict: pass
---
## Done
- Curated the website for the harness-mini **v0.4.1 → v0.7.1** span. The sync bot's
  PR #18 (`chore/harness-sync`) had bumped the documented version v0.6.0 → v0.7.1
  version-only; the prior sync (v0.6.0, PR #17) merged content-free too, so the
  prose gap actually spanned three releases. Filed issues **#19, #20** first, then
  patched the **PR #18 branch** (Closes #19, #20).
- **Inventory was already in sync** — 16 skills / 5 agents in `site.ts` match
  upstream name-for-name (bot reported "drift: —"). No skill/agent add/remove; the
  homepage 16/5 counts stay correct. Checklist item 1 = no-op, confirmed.
- **`site.ts` (#19):** re-curated `HARNESS_RELEASE.headline` to the v0.7.0 substance
  (`harness.sh report` + committed eval-verdict firewall teeth); `garden` blurb now
  states the v0.5.0 trigger policy (cadence ≥5 checkpoints + committed smell
  backlog); `evaluate` blurb notes the committed `.trace/evals/` verdict.
- **`docs/architecture` (#20):** LAYOUT gains `report` on the harness.sh line +
  `bin/ctx-hook.sh`, and committed `.trace/evals/` + `.trace/garden-backlog.md`;
  prose covers `report` and a new paragraph on the v0.6.0 on-entry update reminder
  (routing gate + `stage-viewer` run `version` first; `version`/`status`/`doctor`
  surfaces); FSM firewall note gains the v0.7.0 teeth (committed verdict ·
  `stage-viewer` won't promote to `done` without `verdict: pass` · `doctor` fails).
- **`docs/the-40-line` (#20):** Measurement + Enforcement now name `bin/ctx-hook.sh`
  (opt-in Claude Code PostToolUse sampler) and `report`'s context-trend aggregation.
- v0.7.1 itself (contributing-is-issue-first) is repo-process only — deliberately
  NOT surfaced on the site (it's not in the CLI-agnostic framework).
- Verified: `npm run lint` + `npm run build` green; 12/12 static pages, 10 routes
  unchanged. Independent **L1** reviewer (separate context) PASSed 5/6 first pass,
  required one narrow prose fix on the v0.6.0 update-on-entry attribution → applied
  verbatim, rebuild green → **verdict: pass**. Plan archived to
  `completed/0009-v071-content-refresh.md`.

## Now
- `v071-content-refresh` DONE, committed + pushed to `chore/harness-sync` (PR #18).
  Website last released = v0.3.0. PR #18 awaits user merge.

## Next (resume here)
- User merges PR #18 → tag the website **v0.3.1** (docs/content refresh, no code or
  new surface → PATCH bump) to ship. Mirrors the v041/v030 content-refresh cadence
  (those rode MINOR/PATCH per prior judgment; this is content-only → PATCH).
- The sync bot will go quiet (documented == upstream v0.7.1, inventory clean) until
  the next upstream release.

## Decisions
- **Patched the bot branch, didn't reopen.** PR #18 is the curation vehicle; this
  plan supplied items 1–3 of its human checklist.
- **Headline tracks substance, not the patch tag.** v0.7.1 is repo-only; the
  displayed "what's new" summarizes the meaningful v0.7.0 framework features.
- **No inventory edits** — names already matched upstream; touching them would be
  wrong. The drift was 100% prose, exactly what the detector is designed to flag.
- `eval: L1` — additive content, standard docs conventions (not
  architecture/security/data-loss), consistent with 0006/0007/0008.

## Open questions / blockers
- none.
