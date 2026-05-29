---
plan: oss-hygiene
seq: 0003
stage: done
owner: main
---
# OSS hygiene: README, CONTRIBUTING, MIT License, CI

GitHub standard best-practice docs + a CI quality gate. CD is already handled by
Vercel's Git integration (the user connected the repo), so CI here is lint+build
only — no Actions deploy job.

## Five-Step pass (five-step)
1. **Less dumb** — "GitHub best practices" (owner: Matt) = root README +
   CONTRIBUTING + MIT LICENSE + CI. "new release auto-updates Vercel" is already
   true via Vercel's Git integration.
2. **Delete** — Cut: a GitHub Actions deploy job (Vercel already deploys on push;
   a second deployer would double-build and need a token), release-tag workflow,
   issue/PR templates, CODEOWNERS. *Predicted add-back ≥10%:* a PR template later.
3. **Simplify** — one CI workflow building in `site/`; docs at repo root; reuse
   the existing `REPO_URL`/`SITE_URL` facts.
4. **Accelerate** — cache npm in Actions; cancel superseded runs.
5. **Automate** — CI on push-to-main + PRs (the automation that survived).

## Problem
The public repo lacks the conventional entry docs (README/CONTRIBUTING/LICENSE)
and has no automated quality gate, so a broken change could merge and only fail
at Vercel. Add the docs and a CI build that mirrors the Vercel build.

## Acceptance criteria
- [x] Root `README.md`: project summary, live link, repo structure, dev/build
      commands, deploy (Vercel), CONTRIBUTING + LICENSE pointers, and CI + MIT +
      live badges. *Present at repo root.*
- [x] `CONTRIBUTING.md`: setup, dev loop, "lint + build must pass" (= CI), PR
      process, harness-mini lifecycle note, license statement. *Present.*
- [x] `LICENSE`: MIT, 2026, holder `harness-mini`. *Present.*
- [x] CI: `.github/workflows/ci.yml` on push-to-main + PRs; `npm ci` + lint +
      build in `site/`, Node 22, npm cache. *Green on GitHub — runs 26632159533
      and 26632236577 both `success` (verified via `gh run view`).*
- [x] CD documented as Vercel Git integration; no Actions deploy job. *Verified:
      pushes to `main` produced Production "Ready" Vercel deployments (2m & 3m
      old in `vercel ls`), matching commits fb5e4c4 and 181f09c.*

## Out of scope (deleted via five-step)
- GitHub Actions deploy job / Vercel token in CI (Vercel deploys on push).
- Release-tag workflow, issue/PR templates, CODEOWNERS.

## Vertical slices (build order)
1. `LICENSE` (MIT) → 2. `ci.yml` → 3. root `README.md` → 4. `CONTRIBUTING.md`.

## Issues (to-issues)
- [x] `#1` `LICENSE` (MIT, 2026, harness-mini). Done — valid MIT.
- [x] `#2` `.github/workflows/ci.yml` — npm ci + lint + build in `site/`,
      Node 22, npm cache. Done — green run on GitHub.
- [x] `#3` root `README.md` with badges + structure + commands. Done.
- [x] `#4` `CONTRIBUTING.md`. Done — setup + PR + lifecycle + license covered.

## Decisions
- CI builds in `site/` (the app is a subdir); lockfile `site/package-lock.json`
  is tracked, so `npm ci` is deterministic.
- Pin Node 22 (active LTS) in CI; local is Node 24, Vercel uses its own.
- CD = Vercel Git integration; CI never deploys (avoids double-deploy/token).
- License holder = `harness-mini` (the org); year 2026.
- Bumped `actions/checkout` + `actions/setup-node` to `@v6` (Node 24 runtime)
  to clear the Node 20 deprecation; re-verified CI green (run 26632236577).

## Now
- Stage = `done`. Independent evaluator PASSed 5/5 — confirmed CI run
  26632236577 `success` on GitHub (headSha == HEAD) and re-ran lint+build
  locally. Plan archived to `completed/`.

## Next (resume here — new plan if picked up)
- Optional: PR template / issue templates, CODEOWNERS, Dependabot.
