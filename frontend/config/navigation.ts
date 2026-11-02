export type NavItem = {
  label: string;
  href: string;
  /** id of the on-page section used for the active indicator */
  section?: string;
  /** Other paths that should mark this item as current (e.g. sub-pages). */
  match?: string[];
};

/** Primary desktop navigation: six links, short enough to never wrap. */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    match: ["/web-technology", "/digital-growth"],
  },
  { label: "About", href: "/about", match: ["/why-us"] },
  { label: "How We Work", href: "/how-we-work" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/** Full navigation list for the mobile menu. */
export const mobileNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Web & Technology", href: "/web-technology" },
  { label: "Digital Marketing & Growth", href: "/digital-growth" },
  { label: "About Us", href: "/about" },
  { label: "Blog & Insights", href: "/blog" },
  { label: "Why Us", href: "/why-us" },
  { label: "How We Work", href: "/how-we-work" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

export const primaryCta: NavItem = {
  label: "Free Consultation",
  href: "/inquiry",
};

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Solutions",
    items: [
      { label: "Social Media Management", href: "/services#social-media" },
      { label: "Website Development", href: "/services#website-development" },
      { label: "AI Automation & Agents", href: "/services#ai-automation" },
      { label: "Software Solutions", href: "/services#software" },
      { label: "All Services", href: "/services" },
      { label: "Website Templates", href: "/templates" },
      { label: "Free Consultation", href: "/inquiry" },
      { label: "Customer Registration", href: "/register" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Why Choose Us", href: "/why-us" },
      { label: "How We Work", href: "/how-we-work" },
      { label: "Help & FAQs", href: "/faq" },
      { label: "Client Feedback", href: "/feedback" },
    ],
  },
  {
    title: "Contact & Policies",
    items: [
      { label: "Contact Us", href: "/contact" },
      { label: "Free Consultation", href: "/inquiry" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Feedback", href: "/feedback" },
];
