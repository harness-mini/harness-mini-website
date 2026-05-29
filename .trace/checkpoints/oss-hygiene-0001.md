---
plan: oss-hygiene
seq: 001
stage: done
ctx_pct_at_checkpoint: 40
prev: ship-0001
---
## Done
- Added repo-root `README.md` (badges + structure + dev/build + CI/CD notes),
  `CONTRIBUTING.md` (setup, PR flow, harness lifecycle, license), and MIT
  `LICENSE` (2026, harness-mini).
- Added `.github/workflows/ci.yml`: on push-to-main + PRs, `npm ci` + lint +
  build in `site/`, Node 22, npm cache, concurrency cancel. No deploy job.
- Bumped `actions/checkout` + `actions/setup-node` to `@v6` (Node 24 runtime) to
  clear the Node 20 deprecation.
- Verified end-to-end: CI green on GitHub (runs 26632159533, 26632236577 =
  success); CD confirmed — pushes auto-deployed to Vercel Production (git
  integration). Independent evaluator PASSed 5/5.
- Stage advanced `evaluate → done`; plan archived to
  `completed/0003-oss-hygiene.md`.

## Now
- `oss-hygiene` DONE. No active plans. CI gate live; Vercel CD live.

## Next (resume here — would be a NEW plan)
- Optional repo polish: PR/issue templates, CODEOWNERS, Dependabot, a custom
  domain.

## Decisions
- CI is quality-only (lint+build); CD belongs to Vercel's Git integration — no
  Actions deploy job (would double-deploy / need a token). See
  `completed/0003-oss-hygiene.md` for the full log.

## Open questions / blockers
- none.
