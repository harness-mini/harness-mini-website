---
plan: v041-content-refresh
seq: 0007
stage: done
owner: main
eval: L1
---
# Refresh website content for harness-mini v0.4.0 → v0.4.1

The sync bot already bumped the site to v0.4.0 (PR #8, merged) but left the
v0.3.0 headline and can't author prose. Upstream is now v0.4.1. Meaning-level
drift to fix, filed as issues #9–#11 first, then one PR.

## Scope = three outdated areas (GitHub issues) + version/headline
- **#9 `parallel-slices` skill (v0.4.0).** New skill missing from the site
  (detector flagged inventory drift: 15 vs 16). Write fan-out for implement.
- **#10 Golden principle #5 (v0.4.1).** "Parse at the boundary" → "Type the
  boundary; never guess the shape" — site shows the stale wording.
- **#11 Routing gate (v0.4.0).** Install makes the harness preferred by default;
  undocumented on the site.
- Version v0.4.0 → **v0.4.1** + refresh the stale headline (in this PR, not a
  separate bot run).

## Acceptance criteria
- [x] **#9** `site.ts` SKILLS includes `parallel-slices` (count → 16); a clause
      in `architecture/page.tsx`'s horizontal-expansion note points at it.
- [x] **#10** `/docs/principles` principle #5 reads "Type the boundary; never
      guess the shape" (typed SDK first; parse+validate at the seam otherwise).
- [x] **#11** `architecture/page.tsx` "new vs existing install" notes the routing
      gate (stage-viewer first; harness skill wins; additive/idempotent).
- [x] `HARNESS_RELEASE` = v0.4.1 (date/url) + a current headline; provenance updated.
- [x] `npm run lint` + `npm run build` green; content renders. PR closes #9–#11;
      independent L1 reviewer passes.

## Vertical slices (build order)
1. `site.ts` — add `parallel-slices`; bump version (apply mode) + headline.
2. `principles/page.tsx` — principle #5 (#10).
3. `architecture/page.tsx` — routing gate (#11) + parallel-slices clause (#9).
4. lint+build → PR (Closes #9–#11) → L1 evaluate → done.

## Decisions
- `parallel-slices` stage = `implement` (pairs with `slice-coding`: vertical then
  horizontal fan-out), though it is a main-agent orchestration move.
- Headline leads with v0.4.0's marketable features (routing gate + parallel-slices)
  rather than v0.4.1's wording-only change.
- Out of scope: landing-page changes (keep the refresh in /docs + data).

## Now
- Stage = `done`. Independent **L1** reviewer PASSed 5/5 (accuracy checked vs
  CHANGELOG + live skills inventory; build green; `--check` drift-free). PR #12
  (Closes #9–#11) awaiting merge. Plan archived to `completed/`.

## Next (resume here)
1. Slices 1–3; lint+build. 2. PR closing #9–#11; hand to independent L1 reviewer.
3. On pass → `stage-viewer` → `done`; checkpoint; archive to `completed/`.
