import { siteConfig } from "@/config/site";
import { getServicePage, servicePages } from "@/data/service-pages";
import { ogSize, renderOgImage } from "@/lib/server/og-image";

export const alt = `${siteConfig.name} service`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

/** Per-service social card, generated at build time. */
export default async function ServiceOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServicePage(slug);
  return renderOgImage({
    kicker: service?.eyebrow,
    headline: <span style={{ maxWidth: 1040 }}>{service?.heading.text ?? siteConfig.name}</span>,
    subline: service?.metaDescription ?? siteConfig.metaDescription,
  });
}
