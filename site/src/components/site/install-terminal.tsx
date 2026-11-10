"use client";

import { useId, useRef, useState } from "react";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Terminal } from "@/components/site/terminal";
import { AGENT_INSTALL, INSTALL_CMD } from "@/lib/site";

type Audience = "human" | "agents";

const TABS: { key: Audience; label: string; icon: typeof User }[] = [
  { key: "human", label: "For human", icon: User },
  { key: "agents", label: "For agents", icon: Bot },
];

const PANELS: Record<
  Audience,
  { label: string; command: string; copyText?: string }
> = {
  human: { label: "bash", command: INSTALL_CMD },
  agents: {
    label: "agent prompt",
    command: AGENT_INSTALL.command,
    copyText: AGENT_INSTALL.copyText,
  },
};

/** Install command with an audience switch — "For human" shell steps vs.
    "For agents" the one-line instruction to paste into a coding agent. */
export function InstallTerminal({ className }: { className?: string }) {
  const [active, setActive] = useState<Audience>("human");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Unique per instance — the page renders this component twice.
  const idBase = useId();

  function onKeyDown(e: React.KeyboardEvent) {
    const idx = TABS.findIndex((t) => t.key === active);
    const next =
      e.key === "ArrowRight"
        ? TABS[(idx + 1) % TABS.length].key
        : e.key === "ArrowLeft"
          ? TABS[(idx - 1 + TABS.length) % TABS.length].key
          : null;
    if (!next) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[TABS.findIndex((t) => t.key === next)]?.focus();
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Install method"
        onKeyDown={onKeyDown}
        className="flex gap-2"
      >
        {TABS.map((t, i) => {
          const selected = active === t.key;
          return (
            <button
              key={t.key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${idBase}-tab-${t.key}`}
              aria-selected={selected}
              aria-controls={`${idBase}-panel-${t.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.key)}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-lg border px-3.5 font-mono text-xs transition-colors",
                selected
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border bg-card/60 text-muted-foreground hover:text-foreground",
              )}
            >
              <t.icon className="size-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>
      {/* Both panels stay mounted (hidden when inactive) so every tab's
          aria-controls resolves; content differs per audience. */}
      {TABS.map((t) => {
        const p = PANELS[t.key];
        return (
          <div
            key={t.key}
            role="tabpanel"
            id={`${idBase}-panel-${t.key}`}
            aria-labelledby={`${idBase}-tab-${t.key}`}
            hidden={active !== t.key}
            className="mt-3"
          >
            <Terminal
              command={p.command}
              label={p.label}
              copyText={p.copyText}
              prompt={t.key === "human"}
            />
          </div>
        );
      })}
    </div>
  );
}
