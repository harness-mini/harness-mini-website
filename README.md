# harness-mini-website

[![CI](https://github.com/harness-mini/harness-mini-website/actions/workflows/ci.yml/badge.svg)](https://github.com/harness-mini/harness-mini-website/actions/workflows/ci.yml)
[![Release](https://github.com/harness-mini/harness-mini-website/actions/workflows/release.yml/badge.svg)](https://github.com/harness-mini/harness-mini-website/actions/workflows/release.yml)
[![Latest release](https://img.shields.io/github/v/release/harness-mini/harness-mini-website?sort=semver)](https://github.com/harness-mini/harness-mini-website/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Live](https://img.shields.io/badge/live-harness--mini--website.vercel.app-000?logo=vercel)](https://harness-mini-website.vercel.app)

The marketing + docs website for **[harness-mini](https://github.com/harness-mini/harness-mini)** — a minimal, CLI-agnostic agent harness.

**Live:** https://harness-mini-website.vercel.app

The site is a [Next.js](https://nextjs.org) 16 app (App Router) styled with
Tailwind CSS v4 and shadcn/ui, in a dark terminal/developer aesthetic. Every
route is statically prerendered.

> This repository was itself built **through the harness-mini lifecycle** —
> see [`AGENTS.md`](AGENTS.md), [`ARCHITECTURE.md`](ARCHITECTURE.md), the
> committed plans in [`docs/exec-plans/`](docs/exec-plans), and the handoff
> checkpoints in `.trace/checkpoints/`.

## Repository layout

```
.                      # the harness-mini framework (installed at the root)
├─ AGENTS.md           # ~100-line agent map
├─ ARCHITECTURE.md     # layer stack + lifecycle FSM + codebase recon
├─ docs/exec-plans/    # committed PRDs / decision logs (active + completed)
├─ .trace/checkpoints/ # committed handoffs (institutional memory)
├─ bin/                # ctx · trace · ralph shell tools
├─ .claude/            # skills + sub-agents (auto-loaded by Claude Code)
└─ site/               # ← the website (the deployed product)
   └─ src/
      ├─ app/          # routes: landing + /docs + opengraph-image
      ├─ components/   # site/* + shadcn ui/*
      └─ lib/site.ts   # single source of content (skills, agents, lifecycle)
```

## Develop

All app commands run from `site/`:

```bash
cd site
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also type-checks)
npm run lint     # eslint
npm start        # serve the production build
```

## CI / CD

- **CI** — [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs `npm ci`,
  `npm run lint`, and `npm run build` (in `site/`) on every push to `main` and
  on pull requests. It mirrors the production build, so breakage is caught
  before merge.
- **Previews** — Vercel's Git integration builds a preview deployment for every
  pull request. Pushes to `main` do **not** auto-deploy to production
  (disabled in [`site/vercel.json`](site/vercel.json)).
- **Production is release-gated** — [`.github/workflows/release.yml`](.github/workflows/release.yml)
  deploys to Vercel **production** on a semver tag (`vX.Y.Z`) via the Vercel CLI,
  then publishes a GitHub Release with generated notes. The Vercel project's
  **Root Directory** is `site/`.

## Releasing

```bash
git checkout main && git pull
git tag v0.1.0          # bump per semver
git push origin v0.1.0
```

Pushing the tag runs the **Release** workflow: it builds the site, deploys it to
production (https://harness-mini-website.vercel.app), and creates a GitHub
Release with auto-generated notes. Requires repo secrets `VERCEL_TOKEN`,
`VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). In short: branch, make `npm run lint`
and `npm run build` pass, open a PR — CI must be green to merge.

## License

[MIT](LICENSE) © harness-mini
