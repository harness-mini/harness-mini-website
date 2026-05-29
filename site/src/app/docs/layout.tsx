import { Container } from "@/components/site/primitives";
import { DocsSidebar } from "@/components/site/docs-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container className="py-12 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <DocsSidebar />
        </aside>
        <article className="min-w-0 max-w-3xl">{children}</article>
      </div>
    </Container>
  );
}
