---
plan: oss-hygiene
seq: 0003
stage: implement
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
- [ ] Root `README.md`: what the project is, live link, repo structure
      (harness at root + `site/` app), dev/build commands, deploy (Vercel),
      pointers to CONTRIBUTING + LICENSE, and CI + license badges.
- [ ] `CONTRIBUTING.md`: local setup, dev loop, "lint + build must pass" (= CI),
      PR process, the harness-mini lifecycle note, and the license/contribution
      statement.
- [ ] `LICENSE`: MIT, year 2026, holder `harness-mini`.
- [ ] CI: `.github/workflows/ci.yml` triggers on push to `main` + PRs; uses
      `npm ci` + `npm run lint` + `npm run build` in `site/` on a pinned Node;
      the run is **green on GitHub** (verified via `gh run`).
- [ ] CD is documented as Vercel's Git integration (auto-deploy on push); no
      Actions deploy job is added.

## Out of scope (deleted via five-step)
- GitHub Actions deploy job / Vercel token in CI (Vercel deploys on push).
- Release-tag workflow, issue/PR templates, CODEOWNERS.

## Vertical slices (build order)
1. `LICENSE` (MIT) → 2. `ci.yml` → 3. root `README.md` → 4. `CONTRIBUTING.md`.

## Issues (to-issues)
- [ ] `#1` `LICENSE` (MIT, 2026, harness-mini). Done = file present, valid MIT.
- [ ] `#2` `.github/workflows/ci.yml` — npm ci + lint + build in `site/`,
      pinned Node, npm cache. Done = valid YAML; green run on GitHub.
- [ ] `#3` root `README.md` with badges + structure + commands. Done = renders
      the project entry page; links resolve.
- [ ] `#4` `CONTRIBUTING.md`. Done = setup + PR + lifecycle + license covered.

## Decisions
- CI builds in `site/` (the app is a subdir); lockfile `site/package-lock.json`
  is tracked, so `npm ci` is deterministic.
- Pin Node 22 (active LTS) in CI; local is Node 24, Vercel uses its own.
- CD = Vercel Git integration; CI never deploys (avoids double-deploy/token).
- License holder = `harness-mini` (the org); year 2026.

## Now
- Plan written; entering `implement` on slice 1 (`LICENSE`).

## Next (resume here)
1. Add LICENSE, ci.yml, README, CONTRIBUTING.
2. Local verify (lint + build still green; YAML valid).
3. Commit + push; watch the GitHub Actions run (`gh run watch`) → green.
4. Hand to the **evaluator**; on pass, advance to `done`.
