import type { Metadata } from "next";
import type {
  BreadcrumbList,
  FAQPage,
  ItemList,
  Organization,
  Service,
  WebPage,
  WebSite,
} from "schema-dts";
import { breadcrumbTrail, getPage } from "@/config/pages";
import { absoluteUrl, siteConfig } from "@/config/site";
import type { FaqItem } from "@/data/faq";
import type { ServicePage } from "@/data/service-pages";
import { SERVICES } from "@/data/services-catalog";

/**
 * SEO helpers: page metadata and schema.org structured data, built from
 * config/site.ts and config/pages.ts so every page describes itself the same way.
 */

/** The site-wide social card (app/opengraph-image.tsx). */
const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name}: websites, AI automation and digital marketing`,
};

/**
 * Page metadata (title, description, canonical, Open Graph, Twitter) from the
 * page registry. A page-level `openGraph` replaces the inherited one, so the
 * default social card is set explicitly unless the route has its own
 * opengraph-image file (`ownImage`).
 */
export function pageMetadata(path: string, { ownImage = false }: { ownImage?: boolean } = {}): Metadata {
  const page = getPage(path);
  const fullTitle = page.absoluteTitle ? page.title : `${page.title} | ${siteConfig.name}`;
  const images = ownImage ? undefined : [DEFAULT_OG_IMAGE];
  return {
    title: page.absoluteTitle ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: { canonical: path },
    ...(page.index === false ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url: path,
      title: fullTitle,
      description: page.description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: page.description,
      ...(images ? { images } : {}),
    },
  };
}

// ---------------------------------------------------------------------------
// Structured data. Stable @ids link the nodes into one entity graph:
// Organization ← WebSite ← WebPage → BreadcrumbList / Service / FAQPage.
// ---------------------------------------------------------------------------

export const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;
/** Absolute URL in the same form as the canonical tag (home without a trailing slash). */
const pageUrl = (path: string) => (path === "/" ? siteConfig.url : absoluteUrl(path));
const webPageId = (path: string) => `${pageUrl(path)}#webpage`;

export function organizationJsonLd(): Organization {
  const logo = absoluteUrl(siteConfig.logo.path);
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    url: pageUrl("/"),
    description: siteConfig.description,
    logo: { "@type": "ImageObject", url: logo, width: `${siteConfig.logo.width}`, height: `${siteConfig.logo.height}` },
    image: logo,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    areaServed: { "@type": "Country", name: siteConfig.areaServed },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      areaServed: siteConfig.address.country,
      availableLanguage: ["English"],
    },
    // TODO(owner): add `founder` (Person) and `foundingDate` once confirmed.
    ...(siteConfig.sameAs.length ? { sameAs: [...siteConfig.sameAs] } : {}),
    knowsAbout: [
      "Website development",
      "Web and mobile application development",
      "AI development",
      "AI integration",
      "AI workflow automation",
      "AI chatbots",
      "AI agents",
      "ERP, CRM and HRMS software",
      "SaaS development",
      "Search engine optimisation",
      "Digital marketing",
      "Lead generation",
    ],
  };
}

export function websiteJsonLd(): WebSite {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: pageUrl("/"),
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: siteConfig.language,
  };
}

/** FAQ content is described by a separate FAQPage node (faqJsonLd), never by the page type. */
type WebPageType = "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";

export function webPageJsonLd(path: string, type: WebPageType = "WebPage"): WebPage {
  const page = getPage(path);
  return {
    "@type": type,
    "@id": webPageId(path),
    url: pageUrl(path),
    name: page.absoluteTitle ? page.title : `${page.title} | ${siteConfig.name}`,
    description: page.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    inLanguage: siteConfig.language,
    dateModified: page.updated,
    ...(path === "/" ? {} : { breadcrumb: { "@id": `${pageUrl(path)}#breadcrumb` } }),
  } as WebPage;
}

export function breadcrumbJsonLd(path: string): BreadcrumbList {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl(path)}#breadcrumb`,
    itemListElement: breadcrumbTrail(path).map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: pageUrl(crumb.path),
    })),
  };
}

/** FAQPage for questions that are visible on the page. */
export function faqJsonLd(faqs: FaqItem[], path: string): FAQPage {
  return {
    "@type": "FAQPage",
    "@id": `${pageUrl(path)}#faq`,
    isPartOf: { "@id": webPageId(path) },
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function serviceJsonLd(service: ServicePage): Service {
  const path = `/services/${service.slug}`;
  return {
    "@type": "Service",
    "@id": `${pageUrl(path)}#service`,
    name: service.name,
    serviceType: service.name,
    description: service.answer,
    url: pageUrl(path),
    provider: { "@id": ORGANIZATION_ID },
    areaServed: { "@type": "Country", name: siteConfig.areaServed },
    mainEntityOfPage: { "@id": webPageId(path) },
  };
}

/** The service catalog on /services (and the division pages), as an ItemList. */
export function catalogJsonLd(path: string, group?: "web" | "growth"): ItemList {
  const items = SERVICES.filter((s) => !group || s.group === group);
  return {
    "@type": "ItemList",
    "@id": `${pageUrl(path)}#catalog`,
    name: `${siteConfig.name} services`,
    itemListElement: items.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.name,
        description: s.desc,
        provider: { "@id": ORGANIZATION_ID },
      },
    })),
  };
}
