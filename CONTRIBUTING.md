# Contributing

Thanks for your interest in improving the harness-mini website! This is a small
[Next.js](https://nextjs.org) app (the `site/` directory) wrapped in the
[harness-mini](https://github.com/harness-mini/harness-mini) agent harness.

## Local setup

```bash
git clone https://github.com/harness-mini/harness-mini-website.git
cd harness-mini-website/site
npm install
npm run dev          # http://localhost:3000
```

You need Node.js 20+ (CI runs on Node 22).

## Development loop

- All application code lives in `site/`. Run commands from there.
- Content (skills, sub-agents, lifecycle, nav, URLs) is centralized in
  `site/src/lib/site.ts` — prefer editing data there over hardcoding in pages,
  so counts and links can't drift.
- Reusable UI lives in `site/src/components/site/`; shadcn/ui primitives in
  `site/src/components/ui/`.
- Before pushing, make sure both pass — these are exactly what CI runs:

  ```bash
  cd site
  npm run lint
  npm run build
  ```

## Pull requests

1. Create a branch off `main`.
2. Keep the change focused; update `site/src/lib/site.ts` rather than
   duplicating content in components.
3. Ensure `npm run lint` and `npm run build` are green locally.
4. Open a PR against `main`. **CI must pass** (lint + build) before merge, and
   Vercel will attach a preview deployment to the PR.
5. On merge to `main`, nothing ships to production — `main` is preview-only.
   Production is **release-gated** (see below).

## Releasing

Production deploys are driven by semver tags, not by merges to `main`:

```bash
git checkout main && git pull
git tag v0.1.0          # bump per semver
git push origin v0.1.0
```

Pushing a `vX.Y.Z` tag runs `.github/workflows/release.yml`, which builds the
site, deploys it to **Vercel production**, and publishes a GitHub Release with
auto-generated notes. (Requires repo secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`,
`VERCEL_PROJECT_ID`.)

## How this repo is organized (harness-mini)

This project is developed through the harness-mini lifecycle, so substantial
changes are tracked as artifacts in the repo:

- **Plans / PRDs** with testable acceptance criteria live in
  `docs/exec-plans/` (`active/` while in flight, `completed/` when done).
- **Checkpoints** (handoffs / decision logs) live in `.trace/checkpoints/`.
- The anti-self-praise rule applies: a change is only "done" once it passes its
  acceptance criteria (CI green, criteria met) — the author doesn't self-certify.

You don't need to drive the full lifecycle for a typo fix; for a feature, a
short plan in `docs/exec-plans/active/` with acceptance criteria is appreciated.
See [`AGENTS.md`](AGENTS.md) for the map.

## Code style

- TypeScript, React Server Components by default; add `"use client"` only when a
  component needs interactivity.
- Tailwind v4 utility classes; theme tokens are defined in
  `site/src/app/globals.css`. Keep the dark terminal aesthetic.
- Intention-revealing names, small components, no duplication.

## License

By contributing, you agree that your contributions are licensed under the
project's [MIT License](LICENSE).
