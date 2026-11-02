import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content Security Policy. Inline scripts are limited to Next.js bootstrap,
 * the `js` class flag and JSON-LD; no third-party script origins are allowed.
 * Add origins here when integrating analytics or embeds.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/** Mirrors `isIndexable` in config/site.ts: only production deployments may be indexed. */
const isIndexable = (process.env.VERCEL_ENV ?? process.env.SITE_ENV ?? "production") === "production";
const noindex = { key: "X-Robots-Tag", value: "noindex, nofollow" };

/**
 * User agents that get metadata in <head> instead of streamed into <body>.
 * Next.js's default list (next/dist/shared/lib/router/utils/html-bots.js) plus
 * AI search and assistant fetchers, which read raw HTML and run no JavaScript.
 * Only matters for dynamically rendered pages; static pages always have full <head> metadata.
 */
const htmlLimitedBots =
  /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|OAI-SearchBot|ChatGPT-User|GPTBot|Claude-SearchBot|Claude-User|ClaudeBot|PerplexityBot|Perplexity-User|CCBot/i;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  htmlLimitedBots,
  // Self-contained server in .next/standalone for the Docker image (frontend/Dockerfile).
  // Vercel ignores this and deploys as usual.
  output: "standalone",
  // Pin the workspace root (a stray lockfile in a parent folder can confuse detection).
  turbopack: { root: process.cwd() },
  images: {
    formats: ["image/avif", "image/webp"],
    // 90 keeps the text in the home slider artwork crisp.
    qualities: [75, 90],
  },
  async headers() {
    return [
      { source: "/:path*", headers: isIndexable ? securityHeaders : [...securityHeaders, noindex] },
      { source: "/admin/:path*", headers: [noindex] },
    ];
  },
  async redirects() {
    // The old cart page was folded into the services catalog.
    return [{ source: "/cart", destination: "/services", permanent: true }];
  },
};

export default nextConfig;
