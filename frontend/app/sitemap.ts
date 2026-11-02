import type { MetadataRoute } from "next";
import { indexablePages } from "@/config/pages";
import { absoluteUrl, isIndexable, siteConfig } from "@/config/site";

/**
 * Every indexable page from config/pages.ts. `lastModified` is the date the
 * page's content last changed (not the build time), so search engines can
 * trust it. Non-production deployments publish an empty sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable) return [];
  return indexablePages.map((page) => ({
    url: page.path === "/" ? siteConfig.url : absoluteUrl(page.path),
    lastModified: page.updated,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
