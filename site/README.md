# harness-mini website

Marketing + docs site for [harness-mini](https://github.com/harness-mini/harness-mini)
— a minimal, CLI-agnostic agent harness.

Built with **Next.js 16** (App Router), **Tailwind CSS v4**, and **shadcn/ui**
(Base UI primitives). Dark, terminal/developer aesthetic.

## Develop

```bash
npm run dev     # dev server at http://localhost:3000
npm run build   # production build (static export of all routes)
npm start       # serve the production build
npm run lint    # eslint
```

## Structure

```
src/
  app/
    layout.tsx            # root layout: fonts, metadata, header/footer
    page.tsx              # landing page
    globals.css           # Tailwind v4 theme — terminal palette + utilities
    docs/
      layout.tsx          # docs shell (sticky sidebar + content)
      page.tsx            # docs overview
      the-40-line/        # the smart/dumb contract
      principles/         # Five-Step + golden principles
      architecture/       # layout, FSM, layering contract
  components/
    site/                 # header, footer, terminal, prose, primitives, icons
    ui/                   # shadcn/ui components
  lib/
    site.ts               # site content: nav, skills, agents, lifecycle
    utils.ts              # cn() helper
```

All routes are statically prerendered, so the site deploys anywhere that serves
static Next.js output (e.g. Vercel).

> The harness-mini framework itself is installed at the repository root
> (`AGENTS.md`, `ARCHITECTURE.md`, `docs/`, `bin/`, `.claude/`). This `site/`
> directory is the website it documents.
