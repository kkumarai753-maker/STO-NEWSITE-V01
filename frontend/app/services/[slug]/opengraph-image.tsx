import { siteConfig } from "@/config/site";
import {
  getServiceCategory,
  serviceCategories,
} from "@/data/service-categories";
import { ogSize, renderOgImage } from "@/lib/server/og-image";

export const alt = `${siteConfig.name} service`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return serviceCategories.map((s) => ({ slug: s.id }));
}

/** Per-service social card, generated at build time. */
export default async function ServiceOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceCategory(slug);
  return renderOgImage({
    kicker: "Our services",
    headline: (
      <span style={{ maxWidth: 1040 }}>{service?.name ?? siteConfig.name}</span>
    ),
    subline: service?.description ?? siteConfig.metaDescription,
  });
}
