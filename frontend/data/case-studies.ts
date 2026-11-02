/**
 * Case studies.
 *
 * IMPORTANT: the entries below are ILLUSTRATIVE SAMPLES describing the kind of
 * systems we build. They are not real clients and contain no real statistics.
 * Replace each entry with a verified project (and set `isPlaceholder: false`)
 * before launch. Add `metrics` only with numbers you can substantiate.
 */
export type CaseStudyVisual =
  | "support"
  | "operations"
  | "leads"
  | "saas"
  | "enterprise"
  | "commerce";

export type CaseStudy = {
  id: string;
  title: string;
  category: string;
  /** Short one-liner shown in the detail view. */
  summary: string;
  problem: string;
  solution: string;
  /** Tools used, in plain words. */
  technology: string[];
  result: string;
  /** Optional verified metrics, e.g. { value: "38%", label: "faster replies" }. */
  metrics?: { value: string; label: string }[];
  visual: CaseStudyVisual;
  /** Shows the "Sample project" badge while true. */
  isPlaceholder: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "ai-customer-support",
    title: "AI Customer Support Assistant",
    category: "AI Automation",
    summary: "An AI assistant that answers common customer questions instantly.",
    problem:
      "The support team spends most of the day answering the same questions on email, chat and WhatsApp, so urgent issues wait too long.",
    solution:
      "An AI assistant that knows the company’s products and orders. It answers simple questions straight away and passes harder ones to a person, with a short summary.",
    technology: ["AI assistant", "Help desk", "WhatsApp", "Order system"],
    result:
      "Customers get quick answers, and the team spends its time on the conversations that really need a person.",
    visual: "support",
    isPlaceholder: true,
  },
  {
    id: "business-management-platform",
    title: "All-in-One Business Platform",
    category: "Custom Software",
    summary: "One simple system replacing spreadsheets and scattered tools.",
    problem:
      "Daily work is spread across spreadsheets, chat messages and several apps, so information is repeated and no one trusts the numbers.",
    solution:
      "A custom online platform that brings jobs, schedules, stock and invoices into one place, with the right access for each person.",
    technology: ["Web app", "Secure cloud hosting", "Accounting connection"],
    result: "One place for everything, and far less copying information between tools.",
    visual: "operations",
    isPlaceholder: true,
  },
  {
    id: "ai-lead-qualification",
    title: "Smart Lead Sorting",
    category: "AI Integration",
    summary: "New enquiries are checked by AI and sent to the right salesperson.",
    problem:
      "Salespeople waste hours sorting through enquiries, while the most promising customers wait too long for a reply.",
    solution:
      "AI reads each new enquiry, checks how good a fit it is, writes a personal first reply, and sends the best leads to the sales team.",
    technology: ["AI assistant", "CRM (customer database)", "Email"],
    result: "Every enquiry gets a fast, relevant reply, and sales focus on the best opportunities.",
    visual: "leads",
    isPlaceholder: true,
  },
  {
    id: "custom-saas",
    title: "Subscription Software Product",
    category: "SaaS Development",
    summary: "An idea turned into a ready-to-sell online product.",
    problem:
      "A founder had a proven idea but needed a secure, reliable product that customers could sign up for and pay monthly.",
    solution:
      "A complete online product with sign-up, monthly payments, team accounts and an admin area, built to grow.",
    technology: ["Web app", "Online payments", "Secure cloud hosting"],
    result: "A solid product the team can keep improving every week.",
    visual: "saas",
    isPlaceholder: true,
  },
  {
    id: "enterprise-dashboard",
    title: "Live Business Dashboard",
    category: "Reports & Insights",
    summary: "Live numbers from every department, in one clear screen.",
    problem:
      "Managers wait for weekly reports that someone builds by hand from several different systems.",
    solution:
      "A live dashboard that collects the numbers automatically and shows them as simple charts for each department.",
    technology: ["Dashboard", "Automatic data updates", "Secure cloud hosting"],
    result: "Leaders see up-to-date, consistent numbers whenever they need them.",
    visual: "enterprise",
    isPlaceholder: true,
  },
  {
    id: "ecommerce-automation",
    title: "Online Store Automation",
    category: "Business Automation",
    summary: "Orders, stock and customer updates handled automatically.",
    problem:
      "Processing orders, updating stock and messaging customers is done by hand across the store, warehouse and accounting tools.",
    solution:
      "Automations that connect the online store, warehouse, accounting and messaging, with a person approving anything unusual.",
    technology: ["Online store", "WhatsApp", "Accounting connection"],
    result: "Everyday order work runs on its own; the team only steps in when something is unusual.",
    visual: "commerce",
    isPlaceholder: true,
  },
];
