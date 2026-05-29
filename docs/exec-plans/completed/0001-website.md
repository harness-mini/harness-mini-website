---
plan: website
seq: 0001
stage: done
owner: main
---
# harness-mini marketing + docs website

Greenfield bootstrap (this repo was empty). The intake seed ran the founder
funnel; this plan records its output and the build that followed.

## Founder check (founder-check)
1. **Who is the user, specifically?** A developer running an agent CLI (Claude
   Code / Codex / Cursor) who is evaluating harness-mini. Job-to-be-done:
   understand what it is and get it installed in under a minute.
2. **Smallest valuable slice?** A single landing page that explains the 40%
   line + the lifecycle and shows the one install command. (Extended to
   landing + a 3-page /docs concept section per the user's scope choice.)
3. **Riskiest assumption?** That the value prop — "a context-firewall harness
   built around the 40% line" — can be communicated clearly enough on the
   landing page that a developer chooses to run the install. If the explanation
   doesn't land, nobody installs. The hero + the 40% meter exist to test this.
4. **Build-measure-learn loop?** Signal to watch: install-command copies and
   GitHub click-throughs. The copy-able terminal block is the primary CTA so
   the signal is observable.

## Five-Step pass (five-step)
1. **Less dumb** — Requirement (owner: Matt): "a site that moves a developer
   from *what is this* to *installed*, fast." Questioned: do we need a full
   multi-page docs site to do that? No — a landing page carries the value prop;
   docs are supporting depth.
2. **Delete** — Cut: light mode + theme toggle (dark-only), MDX/CMS pipeline
   (content is typed data + JSX), per-skill and per-agent dedicated pages
   (folded into landing tables), search, blog, analytics, auth, auto-generated
   OG image, CI/deploy automation. *Predicted add-back ≥10%:* an OG image and,
   later, a full per-skill reference.
3. **Simplify** — Static prerender every route (no server runtime); centralize
   all content in `src/lib/site.ts`; reuse shadcn primitives; one shared
   `Prose` / `Container` / `DocFooterNav`.
4. **Accelerate** — Scaffold via create-next-app + shadcn CLI; Turbopack build
   (~2s); component + data reuse across landing and docs.
5. **Automate** — None yet. Deliberately no CI/deploy automation until content
   stabilizes — automating a flawed structure would lock it in.

## Problem
A developer evaluating harness-mini has no single place that explains the
framework and how to adopt it. We need a fast, faithful marketing + docs site
that communicates the 40% contract, the lifecycle, the skills/agents, and the
one-line install — and reads like a serious CLI tool.

## Acceptance criteria
- [x] Landing page communicates: the 40% line, the lifecycle FSM, 14 skills
      (grouped by stage), 5 sub-agents (role + model), and install (new vs
      existing project). Counts derive from `SKILLS.length` / `AGENTS.length`
      so they cannot drift from the data.
- [x] `/docs` with an overview + 3 concept pages (the-40-line, principles,
      architecture), faithful to `docs/smart-dumb.md`, `docs/principles.md`,
      and `ARCHITECTURE.md`.
- [x] Terminal/developer aesthetic: dark, monospace accents, copy-able install
      block; responsive; accessible (skip-link, aria labels, keyboard nav).
- [x] `cd site && npm run build` passes: TypeScript + ESLint clean; all routes
      statically prerendered.
- [x] Every route returns 200 with expected content (verified via fetch) and
      renders correctly (headless-Chrome screenshots).
- [x] **Independent `evaluator` pass** against these criteria (separate window,
      opus) — the anti-self-praise gate. *Passed 5/5: a fresh evaluator
      sub-agent verified by interaction (build + lint clean, all routes 200,
      page shows 14 skills == 14 rendered cards == `.claude/skills/` count).*
- [ ] Deployed to a public URL — next slice.

## Out of scope (deleted via five-step — keep deleted)
- Light mode / theme toggle.
- MDX / CMS content pipeline (content is typed data + JSX).
- Per-skill and per-agent dedicated pages (folded into landing tables).
- Search, blog, analytics, auth.
- Auto-generated OG image (static metadata only for now).
- CI/CD + deploy automation.

## Vertical slices (build order — all green)
1. Scaffold — Next 16 + Tailwind v4 + shadcn/ui in `site/`.
2. Theme — terminal OKLCH palette, fonts, `globals.css` utilities.
3. Shell — root layout, sticky header, footer (the walking skeleton).
4. Landing page — hero/install, 40% line, lifecycle, skills, agents, install.
5. Docs — docs layout + sidebar, overview, 3 concept pages.
6. Verify — `npm run build`, fetch 200 + content checks, screenshots.
7. Tidy — remove unused default assets, write `site/README.md`.

## Issues (to-issues — atomic, each done = build green + criteria met)
- [x] `#1` Scaffold + theme tokens — *layer: Config*. Done = build runs, dark
      terminal palette applied.
- [x] `#2` App shell (layout + header + footer) — *layer: UI/Runtime*. Done =
      every page wrapped, nav + active state work.
- [x] `#3` Content model `src/lib/site.ts` — *layer: Repo/Data*. Done = skills,
      agents, lifecycle, nav exported; blurbs sourced from frontmatter.
- [x] `#4` Site components (terminal, prose, primitives, icons, docs-sidebar) —
      *layer: Service/Components*. Done = reusable, typed, no duplication.
- [x] `#5` Landing page sections — *layer: UI*. Done = all sections render from
      the content model.
- [x] `#6` Docs routes (overview + 3 concept pages) — *layer: UI*. Done = 4
      routes prerender, content faithful, prev/next nav.
- [x] `#7` Verify + tidy — *cross-cutting*. Done = build clean, 200s, README.

## Decisions
- Stack: Next.js 16 (App Router) + Tailwind v4 + shadcn/ui (Base UI
  primitives) — per the user's stack choice.
- Site lives in `site/`; harness scaffolding stays at repo root (also sidesteps
  create-next-app's non-empty-dir conflict with the harness files).
- Dark-only terminal palette via OKLCH tokens overriding shadcn defaults;
  phosphor-green `--primary`, amber for the "dumb zone".
- Content centralized in `src/lib/site.ts`; skill/agent blurbs lifted from
  source frontmatter for fidelity.
- `lucide-react` dropped its GitHub brand icon → inline SVG in
  `components/site/icons.tsx`.
- All routes static-prerender; zero runtime deps.
- Read the bundled Next 16 docs (`node_modules/next/dist/docs/`) before coding —
  the scaffold warned this version postdates training data.
- **Evaluate loop (1 iteration):** first evaluator pass FAILed — landing page
  advertised "13 skills" but rendered 14 (true count). Fix (generator step):
  derive the hero stat + section heading from `SKILLS.length` / `AGENTS.length`
  so the count can't drift; restored the `(slice-coding)` parenthetical on the
  architecture page. A fresh independent evaluator then PASSed 5/5. Corrected
  the upstream-inherited "13" in this plan + the seq-001 checkpoint to 14.

## Now
- Stage = `done`. Evaluator passed 5/5 by produced evidence. Plan archived to
  `docs/exec-plans/completed/`.

## Next (new slice, separate plan when picked up)
1. Add an OG image (criterion deliberately deferred via five-step).
2. Deploy to a public URL (Vercel) and wire the live link into the footer.
