---
plan: harness-sync
seq: 0005
stage: done
owner: main
---
# Surface harness-mini version + auto-detect content drift

The site is a hand-curated mirror of the upstream `harness-mini` framework.
Today it shows **no version** and has already **drifted** (upstream ships 15
skills incl. `release`; the site lists 14 — `release` is missing). Naively
auto-bumping a version number would make drift *worse*. Goal: surface the tag
**and** make content drift impossible to miss via a scheduled detector that
itemizes divergence into a human-reviewed PR.

## Five-Step pass (five-step)
1. **Less dumb** — "show the latest harness-mini tag and keep the site honest as
   upstream iterates" (owner: Matt). Means: a single release constant on the
   site + a bot that detects drift, not just version bumps.
2. **Delete** — Cut: build-time API fetch, auto-writing prose, auto-regenerating
   SKILLS/AGENTS from upstream frontmatter, a `/changelog` route, a separate
   inventory baseline file. *Predicted add-back ≥10%:* frontmatter-driven
   generation, once upstream's schema is pinned.
3. **Simplify** — `site.ts` stays the single inventory SoT (diff against it
   directly; no duplicated baseline). Provenance is one machine-owned JSON
   (`tag` + `commit` + `syncedAt`) — no `harness.lock` exists upstream to hash.
4. **Accelerate** — one zero-dep Node tool does fetch + parse + diff + bump +
   report; GitHub API via `gh`/`GITHUB_TOKEN` (no clone).
5. **Automate** — daily `schedule` + `workflow_dispatch`; the bot opens the PR;
   human curates prose + merges; tag → prod (existing release.yml).

## Problem
Visitors can't tell which framework version the docs describe, and there's no
mechanism to keep the mirror current. Drift is already present and silent.

## Ground truth (verified via GitHub API, 2026-05-29)
- Latest tag/release: `v0.1.0`, published `2026-05-29T09:19:36Z`; `VERSION`=0.1.0.
- `main` HEAD: `8158601aebe62bd50cdee289e20646aaf2e1fabb`.
- Upstream `skills/` (15): checkpoint, clean-code, evaluate, five-step,
  founder-check, garden, grill-me, ralph-loop, refactor, **release**,
  slice-coding, stage-viewer, tdd, to-issues, to-prd.
- Upstream `agents/` (5): evaluator, explorer, gardener, generator, planner —
  matches site (no drift).
- `harness/` upstream holds only `manifest.md` — **no `harness.lock`** ⇒
  provenance uses the commit SHA, not a lock hash.
- `release` skill description (for the site blurb): "Cut a versioned release of
  harness-mini — bump VERSION, roll the CHANGELOG, tag, and publish a GitHub
  release. Wraps `bin/harness.sh release`."

## Acceptance criteria
- [x] `site.ts` exports `HARNESS_RELEASE` (`tag`/`date`/`url` with `x-release-*`
      markers + human `headline`) and `HARNESS_VERSION`; the missing `release`
      skill is added to `SKILLS` (count → 15).
- [x] `v0.1.0` renders in the **hero pill** (links to the release), the
      **footer** ("documenting v0.1.0"), and a **"What's new" callout** under the
      install terminal (links to the CHANGELOG). `npm run lint` + `npm run build`
      green.
- [x] `bin/sync-harness.mjs` (Node, zero-dep): resolves upstream tag + skills +
      agents + latest CHANGELOG section; parses site claims from `site.ts`;
      computes inventory drift + commits-behind; bumps the `x-release-*` lines;
      writes `harness/upstream-sync.json` + a PR-body report. `--check` reports
      only and exits non-zero on drift.
- [x] `node bin/sync-harness.mjs --check` is **idempotent** once the `release`
      skill is added (reports up-to-date, exit 0, no diff); a synthetic drift
      (remove a skill / set tag v0.0.9) is itemized and exits non-zero.
- [x] `.github/workflows/sync-harness-version.yml`: `schedule` +
      `workflow_dispatch`; runs the tool; on change/drift runs `npm ci`+lint+
      build in `site/`, then opens a PR as `github-actions[bot]` via
      `peter-evans/create-pull-request`. YAML valid.
- [x] Docs updated: README "Staying current", CONTRIBUTING triage note,
      ARCHITECTURE layout (`bin/sync-harness.mjs`, `harness/upstream-sync.json`,
      `HARNESS_RELEASE`).
- [x] Independent **evaluator** passes all criteria with evidence.

## Vertical slices (build order)
1. **Content SoT + display** — `HARNESS_RELEASE`/`HARNESS_VERSION` + add `release`
   skill in `site.ts`; hero pill, footer, "what's new" callout. (Repo → UI)
2. **Detector tool** — `bin/sync-harness.mjs` + `harness/upstream-sync.json`
   provenance. Verify `--check` idempotent + synthetic-drift paths.
3. **Workflow** — `.github/workflows/sync-harness-version.yml`.
4. **Docs** — README / CONTRIBUTING / ARCHITECTURE.
5. **Evaluate → checkpoint → done** — evaluator gate; archive to `completed/`.

## Issues (to-issues)
- [x] `#1` `site.ts`: `HARNESS_RELEASE` + `HARNESS_VERSION` + add `release` skill.
- [x] `#2` Display: hero pill + footer + "what's new" callout; lint/build green.
- [x] `#3` `bin/sync-harness.mjs` + `harness/upstream-sync.json`; `--check`.
- [x] `#4` `sync-harness-version.yml` (schedule + dispatch + create-pull-request).
- [x] `#5` README + CONTRIBUTING + ARCHITECTURE.
- [x] `#6` Evaluator pass → checkpoint → archive.

## Decisions
- **Drift handling = detect + itemize** (user's choice). Prose stays editorial;
  the bot only auto-bumps version lines and hands the human an itemized diff.
- `site.ts` is the single inventory SoT; the detector diffs upstream **against
  it** (names only — blurb wording is intentionally not flagged).
- Provenance = `{ tag, commit, syncedAt }` (no upstream `harness.lock` exists).
- Node `.mjs` over `.sh` for the tool (robust fetch/JSON/regex; repo is Node).
  Convention note vs existing `bin/*.sh`.
- PR authored by `github-actions[bot]`; default `GITHUB_TOKEN` won't trigger
  `ci.yml`, so the sync job runs lint+build itself. PAT optional upgrade.
- `--check` is for local/manual + the scheduled job, **not** a PR gate (avoid
  coupling PR CI to upstream/network).

## Now
- Stage = `done`. Independent evaluator PASSed **6/6** by interaction (lint+build
  green, version renders in hero/footer/callout, `--check` idempotent + exit 1 on
  synthetic drift then restored, workflow YAML valid w/ both triggers + gated PR,
  provenance + docs present). Plan archived to `completed/`.

## Next (resume here)
1. Slice 1 → 4 in order; lint+build after each UI change.
2. Hand to **evaluator** (separate context) to grade the criteria with evidence.
3. On pass → `stage-viewer` advances to `done`; write checkpoint; move to
   `completed/`.
