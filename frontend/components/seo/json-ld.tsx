import type { Thing } from "schema-dts";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";

/**
 * Renders schema.org nodes as one JSON-LD `@graph` (Server Component). `<` is
 * escaped so the payload can never close the script tag (per the Next.js
 * JSON-LD guide).
 */
export function JsonLd({ graph }: { graph: Thing[] }) {
  const data = { "@context": "https://schema.org", "@graph": graph };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/**
 * Structured data for one page: its WebPage node, the breadcrumb trail (except
 * on the home page) and any page-specific nodes such as Service or FAQPage.
 * Only describe content that is visible on the page.
 */
export function PageSchema({
  path,
  type,
  nodes = [],
}: {
  path: string;
  type?: Parameters<typeof webPageJsonLd>[1];
  nodes?: Thing[];
}) {
  return (
    <JsonLd graph={[webPageJsonLd(path, type), ...(path === "/" ? [] : [breadcrumbJsonLd(path)]), ...nodes]} />
  );
}
