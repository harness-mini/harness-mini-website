---
plan: v041-content-refresh
seq: 001
stage: done
ctx_pct_at_checkpoint: 50
prev: v030-content-refresh-0001
eval: L1
---
## Done
- Refreshed the website's content to harness-mini v0.4.0 → v0.4.1. The sync bot
  had already bumped the version to v0.4.0 (PR #8, merged — first proof the
  permission fix works end-to-end), but can't author prose.
- Filed issues #9–#11 first, then one PR (#12, Closes #9–#11):
  - **#9 `parallel-slices`** — new skill added to `site.ts` (SKILLS 15→16,
    clearing the detector's inventory drift) + a clause in the architecture
    coding-contract (write fan-out, disjoint file footprints, post-evaluate).
  - **#10 Golden principle #5** — "Parse at the boundary" → "Type the boundary;
    never guess the shape" (typed SDK first; parse+validate at the seam else).
  - **#11 Routing gate** — documented in `/docs/architecture` install section
    (harness preferred by default; stage-viewer first; additive/idempotent).
  - Version v0.4.0 → **v0.4.1** + provenance; refreshed the stale v0.3.0 headline.
- Verified: lint + build green; content renders; `node bin/sync-harness.mjs
  --check` exit 0 (no drift). Independent **L1** reviewer PASSed 5/5 (accuracy
  vs CHANGELOG + live inventory). Plan archived to
  `completed/0007-v041-content-refresh.md`.

## Now
- `v041-content-refresh` DONE pending merge of PR #12. Documented = harness-mini
  v0.4.1; website last released = v0.2.3.

## Next (resume here)
- Merge PR #12 → tag the website (next patch, e.g. `v0.2.4`) to ship to prod.
- The sync bot now reliably opens version/inventory PRs (e.g. PR #8); meaning-
  level changes still get a human pass like this one.

## Decisions
- `parallel-slices` placed under stage `implement` (pairs with `slice-coding`),
  though it is a main-agent orchestration move — most intuitive for site readers.
- Headline leads with v0.4.0's marketable features (routing gate + parallel-slices)
  over v0.4.1's wording-only principle change.
- Build route count is 8 routes / 7 HTML files (Next 16.2.6); the "10/10" figure
  in earlier notes was the page-generation worker count, not routes — don't
  assert a route count in future eval briefs.

## Open questions / blockers
- none.
