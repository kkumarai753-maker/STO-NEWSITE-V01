/** The services we offer, by division. No prices are published on the site. */
export interface ServiceItem {
  id: string;
  group: "web" | "growth";
  name: string;
  desc: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: "one-page",
    group: "web",
    name: "One-Page Website",
    desc: "A conversion-focused responsive website for a clear business offer.",
  },
  {
    id: "business-site",
    group: "web",
    name: "Business Website",
    desc: "A structured multi-page website designed for credibility and enquiries.",
  },
  {
    id: "ecommerce",
    group: "web",
    name: "E-commerce Website",
    desc: "A product storefront with cart, payment and order workflow.",
  },
  {
    id: "domain-hosting",
    group: "web",
    name: "Domain & Hosting Setup",
    desc: "Client-owned domain, hosting, SSL and deployment assistance.",
  },
  {
    id: "maintenance",
    group: "web",
    name: "Website Care & Maintenance",
    desc: "Updates, backups, security checks and ongoing technical support.",
  },
  {
    id: "automation",
    group: "web",
    name: "CRM & Business Automation",
    desc: "Lead capture, WhatsApp workflows, CRM and scheduling setup.",
  },
  {
    id: "logo-basic",
    group: "growth",
    name: "Basic Logo Design",
    desc: "A clean starter identity for a new business.",
  },
  {
    id: "logo-pro",
    group: "growth",
    name: "Professional Logo Package",
    desc: "A stronger logo package with useful brand variations.",
  },
  {
    id: "brand",
    group: "growth",
    name: "Complete Brand Identity",
    desc: "Logo system, colors, typography and key brand assets.",
  },
  {
    id: "social",
    group: "growth",
    name: "Social Media Management",
    desc: "Content planning, creative design, publishing and reporting.",
  },
  {
    id: "multi-social",
    group: "growth",
    name: "Multi-Platform Management",
    desc: "Coordinated management across multiple social platforms.",
  },
  {
    id: "reel-basic",
    group: "growth",
    name: "Basic Reel Editing",
    desc: "Clean edits, captions, music and platform-ready export.",
  },
  {
    id: "reel-pro",
    group: "growth",
    name: "Premium Reel Editing",
    desc: "Advanced pacing, captions, sound design and visual polish.",
  },
  {
    id: "ad-video",
    group: "growth",
    name: "Promotional Ad Video",
    desc: "Short promotional editing built around a clear offer and CTA.",
  },
  {
    id: "ads",
    group: "growth",
    name: "Meta & Google Ads Management",
    desc: "Campaign setup, targeting, monitoring and optimisation.",
  },
  {
    id: "seo",
    group: "growth",
    name: "Local SEO",
    desc: "Local discovery, Google profile and search visibility support.",
  },
  {
    id: "funnel",
    group: "growth",
    name: "Lead Funnel Setup",
    desc: "Landing flow, lead capture, CTA structure and basic tracking.",
  },
];
