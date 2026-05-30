#!/usr/bin/env node
// Reconcile this website with the upstream harness-mini framework.
//
// The site (site/src/lib/site.ts) is a hand-curated mirror of an evolving
// source, so the two drift. This tool makes drift impossible to miss:
//   • bumps the documented version (the `x-release-*` lines) when upstream tags;
//   • DETECTS content drift — skills/agents the site is missing or has dropped
//     vs upstream's real inventory — and itemizes it for a human;
//   • records a provenance baseline (harness/upstream-sync.json) so "how far
//     behind are we" is always measurable.
// Prose is never auto-written: the bot hands a human a copy-paste-level diff.
//
// Usage:
//   node bin/sync-harness.mjs            # apply version bump + write report/provenance on drift
//   node bin/sync-harness.mjs --check    # report only; exit 1 if version/inventory drift
//
// Zero runtime deps (Node 22 built-ins: fetch, fs). Uses GITHUB_TOKEN /
// GH_TOKEN when present for API rate limits; works unauthenticated otherwise.

import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE_TS = join(ROOT, "site/src/lib/site.ts");
const PROVENANCE = join(ROOT, "harness/upstream-sync.json");
const REPORT = join(ROOT, ".sync-report.md");
const REPO = "harness-mini/harness-mini";

const CHECK_ONLY = process.argv.includes("--check");

// ── GitHub API helpers ──────────────────────────────────────────────────────
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
async function gh(path, { raw = false } = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      "User-Agent": "harness-mini-website-sync",
      Accept: raw ? "application/vnd.github.raw" : "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub API ${path} → ${res.status} ${res.statusText}`);
  return raw ? res.text() : res.json();
}

/**
 * Skill/agent names in an upstream directory. Handles both layouts upstream has
 * used: flat `<name>.md` files and per-entry `<name>/` subdirectories.
 * An empty result means a fetch/layout problem — NOT that upstream deleted its
 * whole catalog — so we throw rather than ever propose wiping the inventory.
 */
async function inventory(dir) {
  const entries = await gh(`/repos/${REPO}/contents/${dir}`);
  const names = entries
    .filter((e) => e.type === "dir" || (e.type === "file" && e.name.endsWith(".md")))
    .map((e) => e.name.replace(/\.md$/, ""))
    .sort();
  if (names.length === 0) throw new Error(`Upstream ${dir}/ inventory came back empty — refusing to treat as drift`);
  return names;
}

/** The newest released `## [x.y.z]` section of a Keep-a-Changelog file. */
function latestChangelogSection(md) {
  const lines = md.split("\n");
  const start = lines.findIndex((l) => /^##\s*\[\d/.test(l));
  if (start < 0) return "";
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) { end = i; break; }
  }
  return lines.slice(start, end).join("\n").trim();
}

// ── Parse what the site currently claims ────────────────────────────────────
const siteText = readFileSync(SITE_TS, "utf8");

/** Extract `name: "..."` entries from an `export const NAME: ... = [ ... ];`. */
function siteInventory(constName) {
  const start = siteText.indexOf(`export const ${constName}`);
  if (start < 0) return [];
  const end = siteText.indexOf("];", start);
  const block = siteText.slice(start, end);
  return [...block.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]).sort();
}
const siteSkills = siteInventory("SKILLS");
const siteAgents = siteInventory("AGENTS");
const siteTag = siteText.match(/tag:\s*"([^"]+)",\s*\/\/ x-release-tag/)?.[1] ?? "(none)";

const diff = (upstream, site) => ({
  missing: upstream.filter((n) => !site.includes(n)), // upstream has, site lacks
  extra: site.filter((n) => !upstream.includes(n)), // site has, upstream dropped
});

// ── Gather upstream truth ───────────────────────────────────────────────────
const release = await gh(`/repos/${REPO}/releases/latest`).catch(() => null);
const tags = release ? null : await gh(`/repos/${REPO}/tags`).catch(() => []);
const upstreamTag = release?.tag_name ?? tags?.[0]?.name ?? siteTag;
const publishedAt = release?.published_at ?? new Date().toISOString();
const date = publishedAt.slice(0, 10);
const url = `https://github.com/${REPO}/releases/tag/${upstreamTag}`;

const head = await gh(`/repos/${REPO}/commits/main`);
const headSha = head.sha;
const changelogMd = await gh(`/repos/${REPO}/contents/CHANGELOG.md`, { raw: true }).catch(() => "");

const upstreamSkills = await inventory("skills");
const upstreamAgents = await inventory("agents");
const skills = diff(upstreamSkills, siteSkills);
const agents = diff(upstreamAgents, siteAgents);

const prov = existsSync(PROVENANCE) ? JSON.parse(readFileSync(PROVENANCE, "utf8")) : null;
let commitsAhead = 0;
if (prov?.commit && prov.commit !== headSha) {
  const cmp = await gh(`/repos/${REPO}/compare/${prov.commit}...${headSha}`).catch(() => null);
  commitsAhead = cmp?.ahead_by ?? 0;
}

// ── Decide drift ────────────────────────────────────────────────────────────
const versionBehind = siteTag !== upstreamTag;
const inventoryDrift =
  skills.missing.length || skills.extra.length || agents.missing.length || agents.extra.length;
const drift = Boolean(versionBehind || inventoryDrift); // what triggers a PR

// ── Report ──────────────────────────────────────────────────────────────────
const list = (arr) => (arr.length ? arr.map((n) => `\`${n}\``).join(", ") : "—");
const lines = [];
lines.push(`# harness-mini sync — ${upstreamTag}`, "");
lines.push(
  `Documented version: **${siteTag}** → **${upstreamTag}**` +
    (versionBehind ? " (bumped)" : " (current)"),
  "",
);
if (commitsAhead > 0) {
  lines.push(`Upstream is **${commitsAhead} commit(s) ahead** of the last synced point (\`${prov.commit.slice(0, 7)}\` → \`${headSha.slice(0, 7)}\`).`, "");
}
lines.push("## Inventory drift");
lines.push(`- Skills missing from the site (add): ${list(skills.missing)}`);
lines.push(`- Skills the site lists but upstream dropped (remove): ${list(skills.extra)}`);
lines.push(`- Agents missing from the site (add): ${list(agents.missing)}`);
lines.push(`- Agents the site lists but upstream dropped (remove): ${list(agents.extra)}`);
lines.push("");
if (changelogMd) {
  lines.push("## Latest upstream changelog", "", latestChangelogSection(changelogMd), "");
}
lines.push("## Human checklist");
lines.push("- [ ] Curate `HARNESS_RELEASE.headline` in `site/src/lib/site.ts` from the changelog.");
lines.push("- [ ] Add/remove skills & agents in `site.ts` to match the inventory above.");
lines.push("- [ ] Reflect any new CLI/behavior in the docs pages under `site/src/app/docs/`.");
const report = lines.join("\n");

console.log(report);

// ── Apply (skipped in --check) ──────────────────────────────────────────────
if (!CHECK_ONLY && drift) {
  let out = siteText;
  out = out.replace(/(tag:\s*")[^"]*(",\s*\/\/ x-release-tag)/, `$1${upstreamTag}$2`);
  out = out.replace(/(date:\s*")[^"]*(",\s*\/\/ x-release-date)/, `$1${date}$2`);
  out = out.replace(/(url:\s*")[^"]*(",\s*\/\/ x-release-url)/, `$1${url}$2`);
  writeFileSync(SITE_TS, out);
  writeFileSync(
    PROVENANCE,
    JSON.stringify({ tag: upstreamTag, commit: headSha, syncedAt: new Date().toISOString() }, null, 2) + "\n",
  );
  writeFileSync(REPORT, report + "\n");
  console.error(`\n✏️  Bumped version lines + provenance; wrote ${REPORT}.`);
}

// ── Exit / CI outputs ───────────────────────────────────────────────────────
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `drift=${drift}\ntag=${upstreamTag}\n`);
}
if (!drift) console.error("\n✓ Site is up to date with upstream.");
process.exit(CHECK_ONLY && drift ? 1 : 0);
