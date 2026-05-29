import * as React from "react";
import { cn } from "@/lib/utils";
import type { Agent } from "@/lib/site";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>
      {children}
    </div>
  );
}

export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-xs text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

const MODEL_STYLES: Record<Agent["model"], string> = {
  opus: "border-amber/40 bg-amber/10 text-amber",
  sonnet: "border-primary/40 bg-primary/10 text-primary",
  haiku: "border-chart-3/40 bg-chart-3/10 text-chart-3",
};

export function ModelBadge({ model }: { model: Agent["model"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[0.7rem] font-medium",
        MODEL_STYLES[model],
      )}
    >
      {model}
    </span>
  );
}
