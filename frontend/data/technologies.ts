import type { BrandIconSlug } from "@/lib/brand-icons";

/**
 * Technologies and platforms we work with.
 * These are NOT partnerships, never imply endorsement unless a real
 * partnership exists and is documented.
 */
export type TechLogo = { name: string; slug: BrandIconSlug };

export const techStripPrimary: TechLogo[] = [
  { name: "OpenAI", slug: "openai" },
  { name: "Anthropic", slug: "anthropic" },
  { name: "AWS", slug: "amazonwebservices" },
  { name: "Microsoft Azure", slug: "microsoftazure" },
  { name: "Google Cloud", slug: "googlecloud" },
  { name: "Stripe", slug: "stripe" },
  { name: "Shopify", slug: "shopify" },
  { name: "WhatsApp", slug: "whatsapp" },
];

export const techStripSecondary: TechLogo[] = [
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Node.js", slug: "nodedotjs" },
  { name: "Python", slug: "python" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "MongoDB", slug: "mongodb" },
  { name: "GraphQL", slug: "graphql" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
];
