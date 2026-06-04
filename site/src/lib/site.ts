export const REPO_URL = "https://github.com/harness-mini/harness-mini";
export const SITE_URL = "https://harness-mini-website.vercel.app";
export const INSTALL_CMD =
  "git clone https://github.com/harness-mini/harness-mini.git\nbash harness-mini/init.sh /path/to/your/project";
export const ONE_LINER_INSTALL = 'tell your agent: "install harness-mini here"';

/** Canonical one-paragraph description — single source for metadata + JSON-LD. */
export const SITE_DESCRIPTION =
  "A minimal, CLI-agnostic agent harness: convention + skills + sub-agents + distilled best-practice docs, with only thin shell glue as code. The harness is the environment, not a program.";

/**
 * The harness-mini release this site documents.
 * `tag` / `date` / `url` are auto-bumped by the sync bot
 * (`.github/workflows/sync-harness-version.yml` → `bin/sync-harness.mjs`);
 * `headline` is human-curated from the upstream CHANGELOG. The `x-release-*`
 * markers are the anchors the bot rewrites — keep them on these lines.
 */
export const HARNESS_RELEASE = {
  tag: "v0.6.0", // x-release-tag
  date: "2026-06-03", // x-release-date
  url: "https://github.com/harness-mini/harness-mini/releases/tag/v0.6.0", // x-release-url
  headline: "Routing gate makes the harness preferred by default; parallel-slices fans out the implement stage.",
} as const;

/** Short version string, derived from {@link HARNESS_RELEASE}. */
export const HARNESS_VERSION = HARNESS_RELEASE.tag;

/** Link to the upstream changelog (the "what's new" source). */
export const CHANGELOG_URL = `${REPO_URL}/blob/main/CHANGELOG.md`;

export const NAV = [
  { href: "/#the-40-line", label: "The 40% line" },
  { href: "/#lifecycle", label: "Lifecycle" },
  { href: "/#skills", label: "Skills" },
  { href: "/#agents", label: "Sub-agents" },
  { href: "/docs", label: "Docs" },
] as const;

export const DOCS_NAV = [
  { href: "/docs", label: "Overview" },
  { href: "/docs/the-40-line", label: "The 40% line" },
  { href: "/docs/principles", label: "Principles & core-mind" },
  { href: "/docs/architecture", label: "Architecture" },
] as const;

/** The lifecycle FSM stages, in order. */
export const LIFECYCLE = [
  { stage: "intake", blurb: "Question the idea; founder funnel on greenfield." },
  { stage: "prd", blurb: "Turn the idea into an executable, committed PRD." },
  { stage: "issues", blurb: "Decompose into atomic, testable work units." },
  { stage: "implement", blurb: "Build one vertical slice, test-first." },
  { stage: "evaluate", blurb: "Grade vs criteria from a separate window." },
  { stage: "checkpoint", blurb: "Write a handoff before context degrades." },
  { stage: "done", blurb: "Only the main agent may promote work here." },
] as const;

export type StageKey =
  | "orchestrate"
  | "intake"
  | "plan"
  | "implement"
  | "evaluate"
  | "maintain";

export const STAGE_LABEL: Record<StageKey, string> = {
  orchestrate: "Orchestrate",
  intake: "Intake",
  plan: "Plan",
  implement: "Implement",
  evaluate: "Evaluate",
  maintain: "Maintain",
};

export type Skill = {
  name: string;
  stage: StageKey;
  blurb: string;
};

export const SKILLS: Skill[] = [
  { name: "stage-viewer", stage: "orchestrate", blurb: "The single authority that moves a plan through the FSM. Main-agent only — no sub-agent self-promotes." },
  { name: "ralph-loop", stage: "orchestrate", blurb: "Drive a long-running work → check → repeat loop until criteria pass or a human-judgment flag is raised." },
  { name: "checkpoint", stage: "orchestrate", blurb: "Write a committed handoff so a fresh session resumes with zero loss — while the agent is still sharp." },
  { name: "five-step", stage: "orchestrate", blurb: "Apply Musk's algorithm — question, delete, simplify, accelerate, automate — in that order, before building." },
  { name: "grill-me", stage: "orchestrate", blurb: "Interview the user relentlessly about a plan until every branch of the decision tree is resolved." },
  { name: "founder-check", stage: "intake", blurb: "Greenfield-only gate: who is the user, the smallest valuable slice, the riskiest assumption, the BML loop." },
  { name: "to-prd", stage: "plan", blurb: "Turn a raw idea into an executable PRD — a versioned, agent-readable, testable source of truth." },
  { name: "to-issues", stage: "plan", blurb: "Decompose a PRD into atomic, independently verifiable issues — one vertical slice each." },
  { name: "tdd", stage: "implement", blurb: "Red → green → refactor. Never write implementation before a failing test; never refactor on red." },
  { name: "slice-coding", stage: "implement", blurb: "Vertical (one feature end-to-end first) + horizontal (forward-only layering). Read before writing code." },
  { name: "parallel-slices", stage: "implement", blurb: "The implement stage's write fan-out: once the vertical skeleton passes evaluate, build the independent issues in parallel — one generator each, gated on disjoint file footprints — then a single integration evaluate." },
  { name: "clean-code", stage: "implement", blurb: "The forward quality constraint: intention-revealing names, small functions, no duplication, why-not-what comments." },
  { name: "refactor", stage: "implement", blurb: "The recovery constraint: smell → named refactoring, always under green tests, one move at a time." },
  { name: "evaluate", stage: "evaluate", blurb: "Grade work against acceptance criteria from a separate context, tiered by risk: L0 self-check · L1 lightweight reviewer (default) · L2 full Opus. The firewall is the separate context, not the model." },
  { name: "release", stage: "maintain", blurb: "Cut a versioned release — bump VERSION, roll the CHANGELOG, tag, and publish a GitHub release. Wraps bin/harness.sh release; owns the semver + changelog judgment the script can't." },
  { name: "garden", stage: "maintain", blurb: "Entropy GC: scan for drift — stale docs, dead context, smells — and open small targeted fixes." },
];

export type Agent = {
  name: string;
  role: string;
  model: "sonnet" | "opus" | "haiku";
  blurb: string;
};

export const AGENTS: Agent[] = [
  { name: "planner", role: "goal → exec-plan + issues", model: "sonnet", blurb: "Expands a goal into a committed PRD and atomic issues. Runs the founder funnel on new projects. Writes no production code." },
  { name: "generator", role: "build one slice via TDD", model: "sonnet", blurb: "Implements one issue at a time, test-first, under the layering contract. Hands the slice to the evaluator — never grades its own work." },
  { name: "evaluator", role: "grade vs criteria", model: "opus", blurb: "Grades work from a separate context window — the firewall. Evaluation scales with risk (L0/L1/L2); the L2 Opus pass is reserved for high-stakes work. Verifies by running tests/app; returns pass/fail with evidence." },
  { name: "explorer", role: "disposable read/search → distillate", model: "haiku", blurb: "Read-only fan-out. Burns its own context on heavy searches, returns a short distillate, and dies. The context firewall." },
  { name: "gardener", role: "entropy GC / doc-gardening", model: "haiku", blurb: "Periodically scans for drift and opens small, green, one-move fixes. Keeps the repo coherent and the smart zone smart." },
];

export const REFERENCES = [
  "Anthropic — Effective harnesses for long-running agents",
  "Anthropic — Harness design for long-running apps",
  "OpenAI — Harness engineering (leveraging Codex)",
  "Anthropic — The Founder's Playbook",
];
