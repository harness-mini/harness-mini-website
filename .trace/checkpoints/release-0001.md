---
plan: release
seq: 001
stage: done
ctx_pct_at_checkpoint: 45
prev: oss-hygiene-0001
---
## Done
- Release-gated production deploys shipped:
  - `site/vercel.json` → `git.deploymentEnabled.main=false` (main/PR = preview;
    production only via release). Verified: main pushes no longer auto-prod.
  - `.github/workflows/release.yml` → on tag `v*`: Vercel CLI
    `pull`→`build`→`deploy --prebuilt --prod` (run from repo root) + `gh release
    create --generate-notes`.
  - Secrets `VERCEL_TOKEN` / `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` set.
  - README + CONTRIBUTING document the model + a "Releasing" section.
- First release **v0.1.0** cut: release.yml run 26636363163 = success; GitHub
  Release published (auto notes + live link); Vercel production deploy
  `…-22g22uumg…` Ready; live `/` + `/docs` = 200.
- Independent evaluator PASSed 6/6. Stage advanced `evaluate → done`; plan
  archived to `completed/0004-release.md`.

## Two loop incidents (resolved)
1. **CWD bug:** first tagged run failed — `vercel build` used
   `working-directory: site` while Root Directory is also `site/` → `site/site`.
   Fixed by running Vercel steps from the repo root; re-tagged v0.1.0.
2. **Token leak:** the Vercel token was first set via the chat `!` prefix with
   the token as the secret *name* (stored as `VCP_***`, plaintext-exposed).
   Deleted the leaked secret; user revoked that token and set a fresh
   `VERCEL_TOKEN` from their own terminal. See memory [[handle-leaked-secret-safely]].

## Now
- All four feature plans DONE (build-harness, website, ship, oss-hygiene,
  release). No active plans. Release pipeline live.

## Next (resume here — NEW plan)
- Future releases: `git tag vX.Y.Z && git push origin vX.Y.Z`.
- Optional: auto-CHANGELOG (release-please), custom domain, PR template.

## Open questions / blockers
- none.
