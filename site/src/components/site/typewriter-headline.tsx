"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const PLAIN = "A minimal outer harness";
const ACCENT = " for long coding tasks";
const FULL = `${PLAIN}${ACCENT}.`;

/** ms per character — moderate pace (45 chars ≈ 1.5s of typing). */
const TYPE_INTERVAL_MS = 34;
/** Pause before the first character, so the page can settle. */
const START_DELAY_MS = 350;
/** How long the caret keeps blinking after the line completes. */
const CARET_LINGER_MS = 1800;

export function TypewriterHeadline({ className }: { className?: string }) {
  const [count, setCount] = useState(0);
  const [showCaret, setShowCaret] = useState(true);
  const startedRef = useRef(false);
  const anchorRef = useRef<HTMLSpanElement>(null);

  // Start typing once the headline is actually on screen.
  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (startedRef.current || !entries.some((e) => e.isIntersecting)) return;
        startedRef.current = true;
        io.disconnect();
        // Motion off: render the whole line at once instead of typing.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setCount(FULL.length);
          setShowCaret(false);
          return;
        }
        setTimeout(() => setCount(1), START_DELAY_MS);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Advance one character per tick while there is text left to type.
  useEffect(() => {
    if (count === 0 || count >= FULL.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), TYPE_INTERVAL_MS);
    return () => clearTimeout(t);
  }, [count]);

  // Let the caret blink a moment after finishing, then fade it out.
  useEffect(() => {
    if (count < FULL.length) return;
    const t = setTimeout(() => setShowCaret(false), CARET_LINGER_MS);
    return () => clearTimeout(t);
  }, [count]);

  const typed = FULL.slice(0, count);
  const plain = typed.slice(0, PLAIN.length);
  const accent = typed.slice(PLAIN.length).replace(/\.$/, "");

  return (
    <h1 className={className}>
      <span className="sr-only">{FULL}</span>
      <span ref={anchorRef} aria-hidden className="relative inline-block">
        {/* Invisible full line reserves the final layout, so nothing
            reflows while characters land. Shown verbatim under noscript. */}
        <span className="tw-reserved invisible" aria-hidden>
          {PLAIN}
          <span className="text-primary text-glow">{ACCENT}</span>.
        </span>
        <span className="tw-overlay absolute left-0 top-0 w-full">
          {plain}
          <span className="text-primary text-glow">{accent}</span>
          {count === FULL.length ? "." : ""}
          <span
            aria-hidden
            className={cn(
              "tw-caret ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-[0.1em] bg-primary transition-opacity duration-500",
              !showCaret && "opacity-0",
            )}
          />
        </span>
      </span>
    </h1>
  );
}
