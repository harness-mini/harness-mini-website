import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Typography wrapper for docs pages. Styles raw HTML children via descendant
 * selectors so page content can be written as plain JSX without per-element
 * className noise.
 */
export function Prose({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "max-w-none text-[0.95rem] leading-7 text-muted-foreground",
        // headings
        "[&_h2]:mt-12 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground",
        "[&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-foreground",
        // paragraphs & spacing
        "[&_p]:mt-4 [&_p:first-child]:mt-0",
        // links
        "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:decoration-primary/40 [&_a]:underline-offset-4 hover:[&_a]:decoration-primary",
        // lists
        "[&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul>li]:list-disc [&_ul>li]:marker:text-primary/70",
        "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol>li]:marker:text-muted-foreground",
        "[&_li]:pl-1",
        // strong
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        // inline code
        "[&_code]:rounded [&_code]:border [&_code]:border-border [&_code]:bg-muted/60 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-foreground",
        // blockquote
        "[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/50 [&_blockquote]:pl-4 [&_blockquote]:text-foreground/90 [&_blockquote]:italic",
        // tables (wrap a <table> in <div className="table-wrap"> for the scroll frame)
        "[&_.table-wrap]:mt-6 [&_.table-wrap]:overflow-x-auto [&_.table-wrap]:rounded-lg [&_.table-wrap]:border [&_.table-wrap]:border-border",
        "[&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_table]:text-[0.85rem]",
        "[&_thead]:bg-muted/40 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold [&_th]:text-foreground [&_th]:whitespace-nowrap",
        "[&_td]:border-t [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:align-top",
        "[&_td>code]:whitespace-nowrap",
        // hr
        "[&_hr]:my-10 [&_hr]:border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}
