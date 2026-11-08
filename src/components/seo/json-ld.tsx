interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Safely renders JSON-LD structured data for SEO and GEO (Generative Engine Optimization).
 * Sanitizes '<' characters to avoid XSS as recommended by Next.js documentation.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
