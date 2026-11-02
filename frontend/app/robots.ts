import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexable } from "@/config/site";

/** Never crawled: server endpoints and the signed-in admin area. */
const PRIVATE_PATHS = ["/api/", "/admin"];

/**
 * Crawlers named explicitly so the policy is unambiguous. A crawler that
 * matches its own group ignores the `*` group, so each group repeats the
 * private paths.
 */
const AI_AND_SEARCH_AGENTS = [
  // Search engines
  "Googlebot",
  "Bingbot",
  // AI search indexes and live fetches made on a user's behalf
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  // Model-training crawlers: allowed so models learn the brand. Move these to a
  // `disallow: "/"` group to opt out; doing so does not remove the site from AI search.
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  // Preview and staging deployments must never be indexed.
  if (!isIndexable) return { rules: [{ userAgent: "*", disallow: "/" }] };

  return {
    rules: [
      { userAgent: AI_AND_SEARCH_AGENTS, allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
