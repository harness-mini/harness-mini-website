/** Renders a schema.org JSON-LD <script> for SEO structured data. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Data is static and trusted (built from site constants), so JSON.stringify is safe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
