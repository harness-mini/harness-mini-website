import type { Metadata } from "next";
import { Prose } from "@/components/site/prose";
import { DocFooterNav } from "@/components/site/doc-footer-nav";

export const metadata: Metadata = {
  title: "Principles & core-mind",
  description:
    "The Mini constraint, Musk's Five-Step Algorithm, the golden principles that keep agent-generated code coherent, and the clean-code / refactor quality spine.",
};

export default function PrinciplesPage() {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-widest text-primary">
        Taste, encoded once
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">
        Principles &amp; core-mind
      </h1>

      <Prose className="mt-6">
        <blockquote>
          The “golden principles”: opinionated, mechanical rules that keep an
          agent-generated codebase readable and coherent for the <em>next</em>{" "}
          agent run. Taste, encoded once, applied to every line.
        </blockquote>

        <h2>The Mini constraint</h2>
        <p>
          What keeps harness-mini <em>mini</em> — every addition must clear a
          high bar, or it doesn&apos;t go in:
        </p>
        <ul>
          <li>
            <strong>Shell-or-doc first.</strong> Prefer a Markdown convention or a
            few lines of POSIX shell over a program. The harness <em>is</em> the
            environment, not an app to run.
          </li>
          <li>
            <strong>No environment dependence.</strong> No build step, no runtime,
            no services to stand up — it works wherever a shell does.
          </li>
          <li>
            <strong>No complex languages.</strong> Glue stays thin and readable;
            nothing that needs a toolchain just to execute.
          </li>
          <li>
            <strong>Delete before you add.</strong> The default answer to “add
            this?” is no — subtract until what remains is load-bearing.
          </li>
        </ul>

        <h2>Core-mind: Musk&apos;s Five-Step Algorithm</h2>
        <p>
          Apply <strong>in order</strong> before building anything. The order
          matters more than any single step.
        </p>
        <ol>
          <li>
            <strong>Make the requirement less dumb.</strong> Question every
            requirement. Attach a <em>person&apos;s name</em> to it, never a department
            — requirements from “the system” are guesses in disguise. The smartest
            people&apos;s requirements are still partly wrong.
          </li>
          <li>
            <strong>Delete the part or process.</strong> If you are not later forced
            to add back at least 10% of what you deleted, you did not delete enough.
            The best part is no part; the best process is no process.
          </li>
          <li>
            <strong>Simplify or optimize — only what survived step 2.</strong> The
            most common error of a smart engineer is to optimize a thing that should
            not exist.
          </li>
          <li>
            <strong>Accelerate cycle time.</strong> Speed up — but never before
            steps 1–3. Never accelerate a process that should be deleted.
          </li>
          <li>
            <strong>Automate — last.</strong> Automating a flawed or unnecessary
            process locks the flaw in. Automate only what has survived all four
            prior steps.
          </li>
        </ol>
        <blockquote>
          The two named failure modes this prevents: <strong>optimizing</strong> and{" "}
          <strong>automating</strong> something that should have been deleted. In an
          agent harness these are the expensive mistakes — they get encoded and
          replicated across every future run.
        </blockquote>

        <h2>Golden principles (mechanical, enforce-able)</h2>
        <ol>
          <li>
            <strong>The repo is the system of record.</strong> If knowledge isn&apos;t
            in a version-controlled file, it doesn&apos;t exist to the agent. Push
            context <em>into</em> the repo (decisions, conventions, the “why”).
          </li>
          <li>
            <strong>A map, not a 1,000-page manual.</strong> <code>AGENTS.md</code>{" "}
            is a table of contents. Progressive disclosure beats a wall of
            instructions every time.
          </li>
          <li>
            <strong>Optimize for agent readability.</strong> The next reader is an
            agent with no memory. Make the repo navigable cold.
          </li>
          <li>
            <strong>Constrain boundaries, free the interior.</strong> Enforce
            invariants (layers, schemas, naming) mechanically; allow freedom in{" "}
            <em>how</em> a solution is expressed inside those boundaries.
          </li>
          <li>
            <strong>Type the boundary; never guess the shape.</strong> Depend on a
            typed SDK/client — acquire types from the source. Where no typed SDK
            exists, parse and validate at the seam; nothing downstream may build on
            a guessed or untyped structure.
          </li>
          <li>
            <strong>Prefer shared utilities over hand-rolled helpers</strong>, so
            invariants live in one place.
          </li>
          <li>
            <strong>Pay technical debt in small, continuous installments</strong> —
            the garbage collector (<code>garden</code>), not a once-a-quarter
            cleanup.
          </li>
          <li>
            <strong>
              Correct, maintainable, readable beats stylistically human.
            </strong>{" "}
            Agent-written code need not match human style; it must be right and
            clear for the next run.
          </li>
        </ol>

        <h2>Clean Code &amp; Refactoring (the quality spine)</h2>
        <ul>
          <li>
            <code>clean-code</code> is the <em>forward</em> constraint (write it
            right the first time): intention-revealing names, small
            single-responsibility functions, no duplication, comments that explain{" "}
            <em>why</em> not <em>what</em>.
          </li>
          <li>
            <code>refactor</code> is the <em>recovery</em> constraint (smell → named
            refactoring, always under green tests): never refactor on red; one named
            move at a time.
          </li>
        </ul>
        <p>
          Together they are principle #7 in action — taste applied to every line,
          every run, so entropy never compounds.
        </p>
      </Prose>

      <DocFooterNav
        prev={{ href: "/docs/the-40-line", label: "The 40% line" }}
        next={{ href: "/docs/architecture", label: "Architecture" }}
      />
    </>
  );
}
