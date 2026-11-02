import { siteConfig } from "@/config/site";
import { servicePages } from "@/data/service-pages";

/**
 * Registry of every public page: the single source for page metadata,
 * canonical URLs, the sitemap, breadcrumbs, WebPage structured data, the
 * visible "Last updated" date and llms.txt. Add a page here when you add a route.
 */
export type PageEntry = {
  path: string;
  /** Page title, rendered as "<title> | Sunrise Tech Origin" (aim for 50–60 characters in total). */
  title: string;
  /** Use the title as-is, without the brand suffix (it already names the brand). */
  absoluteTitle?: boolean;
  /** Meta description, 140–160 characters: what the page answers or offers. */
  description: string;
  /** Short name for breadcrumbs and link lists. */
  label: string;
  /** Path of the parent page in the breadcrumb trail (defaults to home). */
  parent?: string;
  /** Date the page content last changed (YYYY-MM-DD). Update it whenever you edit the copy. */
  updated: string;
  /** One line describing the page, used in llms.txt. */
  summary: string;
  group: "main" | "services" | "company" | "contact" | "legal";
  /** false = noindex, follow, and left out of the sitemap. */
  index?: boolean;
  priority?: number;
  changeFrequency?: "weekly" | "monthly" | "yearly";
};

const corePages: PageEntry[] = [
  {
    path: "/",
    title: `${siteConfig.name} | Websites, AI Automation & Marketing`,
    absoluteTitle: true,
    description: siteConfig.metaDescription,
    label: "Home",
    updated: "2026-10-18",
    summary: "Overview of the company, both service divisions, process and FAQs.",
    group: "main",
    priority: 1,
    changeFrequency: "weekly",
  },
  {
    path: "/services",
    title: "Our Services",
    description:
      "Every Sunrise Tech Origin service: websites, AI and automation, custom software, CRM, branding, social media, ads, SEO and lead funnels.",
    label: "Services",
    updated: "2026-10-18",
    summary: "Full service catalogue with links to every service page.",
    group: "main",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/web-technology",
    title: "Web Development & Technology Solutions",
    description:
      "Websites, web apps, domain and hosting, maintenance, CRM and AI workflow automation from Sunrise Tech Origin's Web & Technology division in Nagpur.",
    label: "Web & Technology",
    parent: "/services",
    updated: "2026-10-18",
    summary: "The Web & Technology division: websites, hosting, maintenance, CRM, business software and AI automation.",
    group: "services",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/digital-growth",
    title: "Digital Marketing, SEO & Branding",
    description:
      "Branding, social media, reel editing, Meta and Google Ads, local SEO and lead funnels for small businesses.",
    label: "Digital Marketing & Growth",
    parent: "/services",
    updated: "2026-10-18",
    summary: "The Digital Marketing & Growth division: branding, social media, video, paid ads, SEO and lead generation.",
    group: "services",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/about",
    title: `About ${siteConfig.name} | Nagpur Technology Company`,
    absoluteTitle: true,
    description:
      "Who Sunrise Tech Origin is: a Nagpur technology and digital growth company building websites, AI automation, business software and marketing for SMBs.",
    label: "About",
    updated: "2026-10-18",
    summary: "Who the company is, what it does, who it serves, where it is based and how it works.",
    group: "company",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/why-us",
    title: "Why Choose Us: One Accountable Partner",
    description:
      "How Sunrise Tech Origin compares with traditional agencies and freelancers on ownership, clear written quotations, support and connected tech and marketing.",
    label: "Why Choose Us",
    parent: "/about",
    updated: "2026-10-18",
    summary: "Comparison with traditional agencies and freelancers, and the principles the company works by.",
    group: "company",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/how-we-work",
    title: "How We Work: Process and Payments",
    description:
      "The four-step project process from discovery to handover, with milestone payments of 10% to book, 50% to build and 40% at final handover.",
    label: "How We Work",
    updated: "2026-10-18",
    summary: "Project steps, deliverables at each step, timelines and the 10% / 50% / 40% milestone payment schedule.",
    group: "company",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  {
    path: "/faq",
    title: "FAQs: AI, Websites, Payments & Process",
    description:
      "Answers about Sunrise Tech Origin's AI development, automation, websites, business software, payments, timelines, ownership and support.",
    label: "FAQs",
    updated: "2026-10-18",
    summary: "Answers to common buyer questions about services, AI, payments, timelines, ownership and support.",
    group: "company",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/contact",
    title: "Contact Us: Call, WhatsApp or Email",
    description:
      "Contact Sunrise Tech Origin in Nagpur by phone, WhatsApp or email, or send your requirement through the form. Open Monday to Saturday, 9:00 to 19:00 IST.",
    label: "Contact",
    updated: "2026-10-18",
    summary: "Phone, WhatsApp, email, location, business hours and a contact form.",
    group: "contact",
    priority: 0.6,
    changeFrequency: "yearly",
  },
  {
    path: "/inquiry",
    title: "Get a Quote & Book a Free Consultation",
    description:
      "Request a quotation or book a free consultation with Sunrise Tech Origin. Share your idea or requirement; a rough outline is enough to get started.",
    label: "Book Consultation",
    updated: "2026-10-18",
    summary: "Form to request a quotation or book a free consultation.",
    group: "contact",
    priority: 0.6,
    changeFrequency: "yearly",
  },
  {
    path: "/register",
    title: "Customer Registration & Quotation",
    description:
      "Register your selected Sunrise Tech Origin service to begin the quotation, agreement and onboarding process. No payment is taken at registration.",
    label: "Customer Registration",
    updated: "2026-10-18",
    summary: "Customer onboarding form.",
    group: "contact",
    index: false,
  },
  {
    path: "/feedback",
    title: "Client Feedback",
    description:
      "Share your experience, suggestion or concern about working with Sunrise Tech Origin directly with the team.",
    label: "Feedback",
    updated: "2026-10-18",
    summary: "Feedback form for clients.",
    group: "contact",
    index: false,
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description:
      "How Sunrise Tech Origin collects, uses and protects personal information from this website, the contact forms and the website assistant.",
    label: "Privacy Policy",
    updated: "2026-10-18",
    summary: "How personal information is collected, used, shared and retained.",
    group: "legal",
    priority: 0.3,
    changeFrequency: "yearly",
  },
  {
    path: "/terms",
    title: "Terms of Use",
    description:
      "The terms that govern use of the Sunrise Tech Origin website, including content, the website assistant, intellectual property and liability.",
    label: "Terms of Use",
    updated: "2026-10-14",
    summary: "Terms governing use of the website.",
    group: "legal",
    priority: 0.3,
    changeFrequency: "yearly",
  },
  {
    path: "/cookies",
    title: "Cookie Policy",
    description:
      "How the Sunrise Tech Origin website uses cookies, browser storage and privacy-friendly analytics, and how you can manage them.",
    label: "Cookie Policy",
    updated: "2026-10-18",
    summary: "Cookies, browser storage and analytics used on the website.",
    group: "legal",
    priority: 0.3,
    changeFrequency: "yearly",
  },
];

export const pages: PageEntry[] = [
  ...corePages,
  ...servicePages.map(
    (s): PageEntry => ({
      path: `/services/${s.slug}`,
      title: s.metaTitle,
      description: s.metaDescription,
      label: s.name,
      parent: s.division === "web" ? "/web-technology" : "/digital-growth",
      updated: s.updated,
      summary: s.summary,
      group: "services",
      priority: 0.8,
      changeFrequency: "monthly",
    }),
  ),
];

export function getPage(path: string): PageEntry {
  const page = pages.find((p) => p.path === path);
  if (!page) throw new Error(`No page registered for ${path} (add it to config/pages.ts)`);
  return page;
}

/** Home → … → page, following `parent` links. */
export function breadcrumbTrail(path: string): { name: string; path: string }[] {
  const trail: PageEntry[] = [];
  for (let page: PageEntry | undefined = getPage(path); page; page = page.parent ? getPage(page.parent) : undefined) {
    trail.unshift(page);
  }
  if (trail[0]?.path !== "/") trail.unshift(getPage("/"));
  return trail.map((p) => ({ name: p.label, path: p.path }));
}

export const indexablePages = pages.filter((p) => p.index !== false);
