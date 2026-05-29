---
plan: release
seq: 0004
stage: implement
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
- [ ] `site/vercel.json` sets `git.deploymentEnabled.main = false` so pushes to
      `main` no longer auto-deploy (PR previews unaffected; CLI deploys still
      work). Committed.
- [ ] `.github/workflows/release.yml` triggers on tag `v*`; runs
      `vercel pull/build/deploy --prod` (token + org + project from secrets) in
      `site/`, then `gh release create --generate-notes`.
- [ ] GitHub Actions secrets exist: `VERCEL_TOKEN` (user-set), `VERCEL_ORG_ID`,
      `VERCEL_PROJECT_ID`.
- [ ] README + CONTRIBUTING document the model: main/PR → preview; tag `vX.Y.Z`
      → GitHub Release + Vercel production. A "Releasing" section gives the exact
      commands.
- [ ] **End-to-end:** pushing tag `v0.1.0` runs the workflow to success, creates
      GitHub Release `v0.1.0`, and produces a Vercel **production** deployment
      from that commit (live site serves). Verified via `gh run`, `gh release`,
      and `vercel ls` / live fetch.
- [ ] Existing CI (`ci.yml`) still green; all YAML valid.

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
- [ ] `#1` `site/vercel.json` — `git.deploymentEnabled.main=false`. Done = main
      push no longer auto-deploys; PR previews + CLI deploys still work.
- [ ] `#2` `release.yml` — tag `v*` → pull/build/deploy prod + GitHub Release.
      Done = valid YAML; green run on a tag.
- [ ] `#3` Secrets set (VERCEL_TOKEN / VERCEL_ORG_ID / VERCEL_PROJECT_ID).
- [ ] `#4` README + CONTRIBUTING release docs. Done = model + commands present.
- [ ] `#5` Cut `v0.1.0`; verify Release + Vercel prod deploy.

## Decisions
- Disable main auto-deploy via committed `site/vercel.json` `git.deploymentEnabled`
  (version-controlled, not a dashboard toggle). CLI deploys are unaffected.
- Deploy with Vercel CLI in Actions (`pull`→`build`→`deploy --prebuilt --prod`),
  the canonical token-based pattern; ids/token via GH secrets.
- Token set by the user (`gh secret set VERCEL_TOKEN`) — never enters the chat.
  Org/project ids: orgId `team_EOlypk9hIS0Su7FYK4qznsTa`,
  projectId `prj_ci3afkj1i3GejABhRWGirvs2br1j`.
- First release tag = `v0.1.0`.

## Now
- Plan written; entering `implement` on slice 1 (`vercel.json`).

## Next (resume here)
1. Add `site/vercel.json` + `release.yml` + doc updates; set org/project secrets;
   commit + push.
2. User sets `VERCEL_TOKEN` secret.
3. Push tag `v0.1.0`; watch `release.yml`; verify Release + Vercel prod deploy.
4. Hand to the **evaluator**; on pass, advance to `done`.
