---
plan: release
seq: 0004
stage: done
owner: main
---
# Release-driven deploys: tag → GitHub Release → Vercel production

Move production deploys behind versioned releases. Vercel doesn't deploy on
tags natively, so a GitHub Actions workflow runs the Vercel CLI on a `v*` tag.

## Five-Step pass (five-step)
1. **Less dumb** — "use release + tag to release, auto-build to Vercel"
   (owner: Matt). Means: tagging `vX.Y.Z` is the production trigger; main is no
   longer auto-promoted to prod.
2. **Delete** — Cut: release-please/semantic-release automation, changelog
   tooling, multiple environments, a Vercel deploy in the CI workflow.
   *Predicted add-back ≥10%:* auto-changelog later.
3. **Simplify** — disable main's Vercel auto-deploy via committed
   `site/vercel.json` (not a dashboard click); one `release.yml` workflow does
   pull→build→deploy + `gh release create --generate-notes`.
4. **Accelerate** — `vercel build --prebuilt` deploy; npm cache; reuse the
   `site/` Root Directory the project already has.
5. **Automate** — tag push is the trigger (the automation that survived).

## Problem
Production currently ships on every push to `main` (Vercel Git integration),
with no versioning. We want releases to gate production: PRs/main get previews,
and a `vX.Y.Z` tag cuts a GitHub Release and deploys that exact commit to
Vercel production.

## Acceptance criteria
- [x] `site/vercel.json` sets `git.deploymentEnabled.main = false`. *Committed;
      evidence: the fix-commit push to `main` produced no new production
      deployment in `vercel ls` — only the release did.*
- [x] `.github/workflows/release.yml` triggers on tag `v*`; runs
      `vercel pull/build/deploy --prod` (secrets) **from the repo root**, then
      `gh release create --generate-notes`. *All steps green on run 26636363163.*
- [x] GitHub Actions secrets exist: `VERCEL_TOKEN`, `VERCEL_ORG_ID`,
      `VERCEL_PROJECT_ID`. *Confirmed via `gh secret list`.*
- [x] README + CONTRIBUTING document the model (main/PR → preview; tag → Release
      + production) with a "Releasing" section. *Present.*
- [x] **End-to-end:** tag `v0.1.0` ran the workflow to **success**, published
      GitHub Release `v0.1.0` (auto notes + live link), and created Vercel
      **production** deployment `…-22g22uumg…` (Ready); live `/` + `/docs` = 200.
- [x] Existing CI (`ci.yml`) still green; YAML valid.

## Out of scope (deleted via five-step)
- release-please / semantic-release, automated CHANGELOG, signed tags.
- A Vercel deploy step inside `ci.yml` (release.yml owns production).
- Multiple deploy environments beyond preview/production.

## Vertical slices (build order)
1. `site/vercel.json` (disable main auto-deploy).
2. `.github/workflows/release.yml`.
3. Secrets (org/project by main; token by user).
4. Docs (README CI/CD + CONTRIBUTING "Releasing").
5. Cut `v0.1.0` → verify end-to-end.

## Issues (to-issues)
- [x] `#1` `site/vercel.json` — `git.deploymentEnabled.main=false`. Done.
- [x] `#2` `release.yml` — tag `v*` → pull/build/deploy prod + GitHub Release.
      Done — green run 26636363163 (after fixing CWD: run from repo root).
- [x] `#3` Secrets set (VERCEL_TOKEN / VERCEL_ORG_ID / VERCEL_PROJECT_ID).
- [x] `#4` README + CONTRIBUTING release docs. Done.
- [x] `#5` Cut `v0.1.0`; verified Release + Vercel prod deploy.

## Decisions
- Disable main auto-deploy via committed `site/vercel.json` `git.deploymentEnabled`
  (version-controlled, not a dashboard toggle). CLI deploys are unaffected.
- Deploy with Vercel CLI in Actions (`pull`→`build`→`deploy --prebuilt --prod`),
  the canonical token-based pattern; ids/token via GH secrets.
- Token set by the user (`gh secret set VERCEL_TOKEN`) — never enters the chat.
  Org/project ids: orgId `team_EOlypk9hIS0Su7FYK4qznsTa`,
  projectId `prj_ci3afkj1i3GejABhRWGirvs2br1j`.
- First release tag = `v0.1.0`.
- **CWD fix (evaluate loop):** first tagged run FAILED — `vercel build` ran with
  `working-directory: site` while the project's Root Directory is also `site/`,
  so it looked for `site/site`. Fixed by running the Vercel steps from the repo
  root; re-tagged `v0.1.0` at the fixed commit → green.
- **Security incident:** the Vercel token was first set via the chat `!` prefix
  with the token as the secret *name* (GitHub stored it as `VCP_***`), exposing
  it in plaintext. Resolved: deleted the leaked secret, user revoked that token
  and set a fresh `VERCEL_TOKEN` from their own terminal. (See [[handle-leaked-secret-safely]].)

## Now
- Stage = `done`. Independent evaluator PASSed 6/6. `v0.1.0` released to Vercel
  production via Actions; GitHub Release published; main is preview-gated. Plan
  archived to `completed/`.

## Next (resume here)
1. Hand to the **evaluator** (opus); grade vs criteria by interaction (gh run /
   gh release / vercel ls / live fetch; confirm vercel.json gates main).
2. On pass → `stage-viewer` advances to `done`; move plan to `completed/`.
