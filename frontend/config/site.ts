/**
 * Central business configuration.
 *
 * Everything a non-developer is likely to change lives here: company name,
 * contact details, social links, location. UI components read from this file
 * only, never hard-code business details in components.
 *
 * Values marked TODO are placeholders. Contact channels left empty are hidden
 * in production (and shown as "not configured" hints in development).
 */

const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "918766803990").replace(
  /[^\d]/g,
  "",
);
const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "+91 87668 03990";

export const siteConfig = {
  name: "Sunrise Tech Origin",
  /** Short form for tight spaces (app icon label, home-screen name). */
  shortName: "Sunrise",
  /** Shown in the footer copyright. TODO(owner): confirm the registered entity name and type. */
  legalName: "Sunrise Tech Origin",
  tagline: "Technology Solutions & Digital Growth",
  /**
   * The one official description of the company. Metadata, structured data,
   * llms.txt, the footer and the website assistant all read it from here, so
   * every source describes the business the same way.
   */
  description:
    "Sunrise Tech Origin helps businesses grow through website and application development, AI development and integration, AI workflow automation, business software solutions, digital marketing, lead generation, and sales and operations support.",
  /** The same description cut to search-snippet length (≤160 characters). */
  metaDescription:
    "Nagpur-based Sunrise Tech Origin builds websites, apps, AI integrations, AI workflow automation and business software, plus digital marketing and SEO.",
  audience:
    "Startups, small and medium-sized businesses, local businesses and growing brands that want technology solutions, AI-powered automation and digital growth.",
  /**
   * Canonical origin, no trailing slash. Set NEXT_PUBLIC_SITE_URL in production;
   * Vercel previews fall back to the project's production domain so their
   * canonical URLs still point at the live site.
   */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  ).replace(/\/$/, ""),
  locale: "en_IN",
  language: "en-IN",
  /** Official logo (raster, for structured data and social cards). */
  logo: { path: "/brand/sunrise-tech-origin-logo.png", width: 2400, height: 1665 },

  contact: {
    // TODO(owner): confirm these as the official public contact details, and
    // replace the Gmail address with a domain address when one exists.
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "kkumarai753@gmail.com",
    phone: phoneNumber,
    location: "Chitnis Nagar, Nagpur, Maharashtra, India",
    hours: "Mon–Sat · 9:00–19:00 IST",
  },

  /** Public city only. TODO(owner): add street address and PIN to enable LocalBusiness markup. */
  address: { locality: "Nagpur", region: "Maharashtra", country: "IN" },
  /** Where clients are served. TODO(owner): confirm before adding international coverage. */
  areaServed: "India",

  whatsapp: {
    number: whatsappNumber,
    defaultMessage: "Hi, I'd like to explore Sunrise Tech Origin's services.",
  },

  /** Contact channels shown as icon links in the footer and mobile menu. */
  socials: [
    {
      label: "WhatsApp",
      icon: "whatsapp",
      href: whatsappNumber ? `https://wa.me/${whatsappNumber}` : "",
    },
  ],

  /**
   * Official profiles owned by the company (Organization `sameAs`). Only add
   * accounts Sunrise Tech Origin controls.
   * TODO(owner): add LinkedIn, Instagram, Facebook, YouTube, X, etc. once created.
   */
  sameAs: [] as string[],

  keywords: [
    "Sunrise Tech Origin",
    "website development company Nagpur",
    "AI development services",
    "AI integration services",
    "AI workflow automation",
    "AI chatbot development",
    "CRM, ERP and HRMS solutions",
    "SEO services Nagpur",
    "digital marketing agency Nagpur",
  ],
} as const;

/**
 * Deployment stage. Vercel sets VERCEL_ENV ("production" | "preview" |
 * "development"); self-hosted builds can set SITE_ENV. Only production is
 * indexable, so previews and staging never compete with the live site.
 */
const deploymentEnv = process.env.VERCEL_ENV ?? process.env.SITE_ENV ?? "production";
export const isIndexable = deploymentEnv === "production";

/**
 * Vercel Web Analytics (cookieless page views and referrers, including visits
 * from AI assistants). Enable Web Analytics for the project in the Vercel
 * dashboard first, then set NEXT_PUBLIC_VERCEL_ANALYTICS=on. The cookie and
 * privacy policies switch their analytics wording on the same flag.
 */
export const analyticsEnabled = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === "on";

export type SiteConfig = typeof siteConfig;
export type SocialIcon = (typeof siteConfig.socials)[number]["icon"];

export function whatsappHref(message: string = siteConfig.whatsapp.defaultMessage) {
  if (!siteConfig.whatsapp.number) return null;
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export function phoneHref() {
  return siteConfig.contact.phone
    ? `tel:${siteConfig.contact.phone.replace(/[^\d+]/g, "")}`
    : null;
}

export function emailHref(subject?: string) {
  const base = `mailto:${siteConfig.contact.email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
