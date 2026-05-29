"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type TerminalProps = {
  command: string;
  label?: string;
  className?: string;
};

export function Terminal({ command, label = "bash", className }: TerminalProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  const lines = command.split("\n");

  return (
    <div
      className={cn(
        "group/terminal overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/30",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/80 bg-muted/40 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-3 rounded-full bg-destructive/70" />
          <span className="size-3 rounded-full bg-amber/70" />
          <span className="size-3 rounded-full bg-primary/70" />
        </span>
        <span className="ml-1 font-mono text-xs text-muted-foreground">{label}</span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy command"
          className="ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-primary" />
              copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              copy
            </>
          )}
        </button>
      </div>

      <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-relaxed">
        <code>
          {lines.map((line, i) => {
            const isComment = line.trimStart().startsWith("#");
            return (
              <span key={i} className="block whitespace-pre">
                {isComment ? (
                  <span className="text-muted-foreground">{line}</span>
                ) : (
                  <>
                    <span className="select-none text-primary">$ </span>
                    <span className="text-foreground">{line}</span>
                  </>
                )}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
