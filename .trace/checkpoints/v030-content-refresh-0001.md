---
plan: v030-content-refresh
seq: 001
stage: done
ctx_pct_at_checkpoint: 45
prev: harness-sync-0001
eval: L1
---
## Done
- Refreshed the website's prose to harness-mini v0.3.0 (the version number was
  already current; this is the meaning-level drift the sync bot can't catch).
- Filed GitHub issues first (per request), then one PR:
  - **#4 Tiered evaluation** — `site.ts` `evaluate` skill + `evaluator` agent
    blurbs and the `/docs/architecture` firewall note now convey L0/L1/L2 risk
    tiers and "the firewall is the separate context, not the model" (dropped the
    stale "always a separate Opus evaluator").
  - **#5 The Mini constraint** — new principle on `/docs/principles`
    (shell-or-doc first · no env dependence · no complex languages · delete
    before you add).
  - **#6 Architecture layout** — added `harness.sh` (version/update/release/
    doctor/status), `_harness_lib.sh`, `VERSION`, `harness/harness.lock`, and the
    `skills/<name>/SKILL.md` folder shape + a doctor/status prose line.
- Out of scope (delete-before-add): 40% page already says the threshold is
  tunable; site already markets CLI-agnostic — neither was stale.
- Verified: lint + build green (10 static routes); content renders. Independent
  **L1** reviewer PASSed 5/5 (accuracy checked vs CHANGELOG + live repo).
- PR #7 opened (Closes #4–#6); exec-plan archived to
  `completed/0006-v030-content-refresh.md`.

## Now
- `v030-content-refresh` DONE pending merge of PR #7. Documented tag = harness-mini
  v0.3.0; website at v0.2.2 (last released).

## Next (resume here)
- Merge PR #7 → tag the website (next patch, e.g. `v0.2.3`) to ship to prod.
- Future drift will keep arriving via the sync bot's PRs (version/inventory) plus
  human prose passes like this one for meaning-level changes.

## Decisions
- First use of the v0.3.0 tiered-evaluation convention on this repo: `eval: L1`
  (content/low-risk) — independent lightweight reviewer in a separate context,
  not the full Opus L2 gate used for infra plans (0004/0005).
- Kept `evaluator` `model: "opus"` (L2 is Opus); the single model badge is an
  accepted simplification, clarified in the blurb.

## Open questions / blockers
- none.
