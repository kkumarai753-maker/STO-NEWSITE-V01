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

const whatsappNumber = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "918766803990"
).replace(/[^\d]/g, "");
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
    "Sunrise Tech Origin provides Website Development, Software Development, AI Automation & AI Agents, and Social Media Marketing & Branding for startups and growing businesses.",
  /** The same description cut to search-snippet length (≤160 characters). */
  metaDescription:
    "Nagpur-based Sunrise Tech Origin builds websites, apps, AI integrations, AI workflow automation and business software, plus digital marketing and SEO.",
  audience:
    "Startups, small and medium-sized businesses, local businesses and growing brands that want technology solutions, AI-powered automation and digital growth.",
  /** Confirmed public website. Explicit deployment settings can override it. */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://sunrisetechorigin.com"
  ).replace(/\/$/, ""),
  locale: "en_IN",
  language: "en-IN",
  /** Official logo (raster, for structured data and social cards). */
  logo: {
    path: "/brand/sunrise-tech-origin-logo.png",
    width: 2400,
    height: 1665,
  },

  contact: {
    // Public email and social accounts confirmed by the owner.
    email:
      process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@sunrisetechorigin.com",
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

  /** Exact owner-supplied destinations. Direct WhatsApp chat remains in the
   * floating dock and footer contact list; the social row links to the channel. */
  socials: [
    {
      label: "Instagram",
      icon: "instagram",
      href: "https://www.instagram.com/sunrisetechorigin_official/",
    },
    {
      label: "Facebook",
      icon: "facebook",
      href: "https://www.facebook.com/share/1CzwoKaUi6/",
    },
    {
      label: "LinkedIn",
      icon: "linkedin",
      href: "https://www.linkedin.com/company/sunrise-tech-origin/",
    },
    { label: "X / Twitter", icon: "x", href: "https://x.com/SunriseTechOrig" },
    {
      label: "Threads",
      icon: "threads",
      href: "https://www.threads.com/@sunrisetechorign_official",
    },
    {
      label: "WhatsApp Channel",
      icon: "whatsapp",
      href: "https://whatsapp.com/channel/0029VbDeRcpFi8xdLHUnOu02",
    },
    {
      label: "Website",
      icon: "website",
      href: "https://sunrisetechorigin.com/",
    },
    {
      label: "Email",
      icon: "email",
      href: "mailto:info@sunrisetechorigin.com",
    },
  ],

  /** Owner-confirmed social identities for Organization structured data. */
  sameAs: [
    "https://www.instagram.com/sunrisetechorigin_official/",
    "https://www.facebook.com/share/1CzwoKaUi6/",
    "https://www.linkedin.com/company/sunrise-tech-origin/",
    "https://x.com/SunriseTechOrig",
    "https://www.threads.com/@sunrisetechorign_official",
    "https://whatsapp.com/channel/0029VbDeRcpFi8xdLHUnOu02",
  ],

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
const deploymentEnv =
  process.env.VERCEL_ENV ?? process.env.SITE_ENV ?? "production";
export const isIndexable = deploymentEnv === "production";

/**
 * Vercel Web Analytics (cookieless page views and referrers, including visits
 * from AI assistants). Enable Web Analytics for the project in the Vercel
 * dashboard first, then set NEXT_PUBLIC_VERCEL_ANALYTICS=on. The cookie and
 * privacy policies switch their analytics wording on the same flag.
 */
export const analyticsEnabled =
  process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === "on";

export type SiteConfig = typeof siteConfig;
export type SocialIcon = (typeof siteConfig.socials)[number]["icon"];

export function whatsappHref(
  message: string = siteConfig.whatsapp.defaultMessage,
) {
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
