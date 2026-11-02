import { siteConfig } from "@/config/site";

/**
 * Frequently asked questions, the single source for the home FAQ, the /faq
 * hub, FAQPage structured data, service pages and the website assistant.
 *
 * Answers state only facts published elsewhere on the site; no prices are
 * published. Plain text only: the same string is used in JSON-LD.
 * TODO(owner): validate the questions against real sales conversations and
 * add answers for any common question not covered here.
 */
export type FaqTopic = "services" | "ai" | "payments" | "process" | "ownership" | "working";

export type FaqItem = {
  id: string;
  topic: FaqTopic;
  question: string;
  answer: string;
  /** Related pages, shown under the answer. */
  links?: { label: string; href: string }[];
};

export const faqTopics: { id: FaqTopic; title: string }[] = [
  { id: "services", title: "Services" },
  { id: "ai", title: "AI development and automation" },
  { id: "payments", title: "Payments" },
  { id: "process", title: "Process and timelines" },
  { id: "ownership", title: "Ownership, data and support" },
  { id: "working", title: "Working with us" },
];


export const faqs: FaqItem[] = [
  // Services
  {
    id: "what-services",
    topic: "services",
    question: `What services does ${siteConfig.name} provide?`,
    answer: `${siteConfig.description} The work is organised into two divisions: Web & Technology, and Digital Marketing & Growth.`,
    links: [
      { label: "Our services", href: "/services" },
      { label: "Web & Technology", href: "/web-technology" },
      { label: "Digital Marketing & Growth", href: "/digital-growth" },
    ],
  },
  {
    id: "website-app-development",
    topic: "services",
    question: "Do you provide website and application development services?",
    answer: `Yes. We build one-page and multi-page business websites, e-commerce websites, web applications and mobile apps for iPhone and Android. Every project is scoped in a free consultation.`,
    links: [
      { label: "Website development", href: "/services/website-development" },
      { label: "Web, mobile and custom software", href: "/services/custom-software-development" },
    ],
  },
  {
    id: "erp-crm-hrms",
    topic: "services",
    question: "Do you provide ERP, CRM and HRMS solutions?",
    answer: `Yes. We set up and customise business software, including ERP, CRM and HRMS systems, and connect it to your website, WhatsApp and other tools. Each system is scoped in a free consultation.`,
    links: [{ label: "ERP, CRM and HRMS solutions", href: "/services/erp-crm-hrms" }],
  },
  {
    id: "saas",
    topic: "services",
    question: "Can you develop or customise SaaS products?",
    answer:
      "Yes. We design and build software-as-a-service products, from a first version you can launch to features such as sign-up, subscription billing, team accounts and an admin area. SaaS projects are quoted after scoping.",
    links: [{ label: "SaaS development", href: "/services/saas-development" }],
  },
  {
    id: "digital-marketing",
    topic: "services",
    question: "Do you provide digital marketing, SEO and performance marketing?",
    answer: `Yes. The Digital Marketing & Growth division covers branding and logo design, social media management, reel and video editing, Meta and Google Ads management, local SEO and lead funnel setup.`,
    links: [
      { label: "SEO services", href: "/services/seo" },
      { label: "Digital Marketing & Growth", href: "/digital-growth" },
    ],
  },
  {
    id: "lead-generation",
    topic: "services",
    question: "Can you help generate qualified leads for our business?",
    answer: `We set up lead generation systems: landing pages, lead capture forms, WhatsApp and CRM follow-ups, and paid campaigns, and AI can be used to qualify incoming enquiries. Results depend on your offer, market and budget, so we do not promise a number of leads.`,
    links: [{ label: "AI chatbots and lead qualification", href: "/services/ai-chatbots" }],
  },

  // AI development and automation
  {
    id: "ai-development-integration",
    topic: "ai",
    question: "Do you provide AI development and integration services?",
    answer:
      "Yes. We build custom AI-powered applications and add AI features to the websites, apps and business systems you already use, for example an assistant that answers customer questions or a workflow that reads and sorts incoming enquiries.",
    links: [
      { label: "AI development", href: "/services/ai-development" },
      { label: "AI integration", href: "/services/ai-integration" },
    ],
  },
  {
    id: "ai-existing-systems",
    topic: "ai",
    question: "Can you integrate AI into my existing website, application or CRM?",
    answer:
      "Yes. We can add AI features, like a smart assistant, automatic document reading or enquiry sorting, to the software you already use, without starting over. Whether a particular tool can be connected depends on the integrations it offers, which is checked during scoping.",
    links: [{ label: "AI integration", href: "/services/ai-integration" }],
  },
  {
    id: "ai-processes",
    topic: "ai",
    question: "What business processes can you automate using AI?",
    answer:
      "Repetitive work such as data entry, replies to common email and WhatsApp questions, follow-ups, approvals, lead sorting and report preparation. Your team stays in control: unusual cases are passed to a person for review.",
    links: [{ label: "AI workflow automation", href: "/services/ai-workflow-automation" }],
  },
  {
    id: "ai-chatbots",
    topic: "ai",
    question: "Can you develop AI chatbots for customer support and lead generation?",
    answer:
      "Yes. We build AI chatbots for websites and WhatsApp that answer common questions from your own business information, collect enquiry details and hand the conversation to your team when needed.",
    links: [{ label: "AI chatbot development", href: "/services/ai-chatbots" }],
  },
  {
    id: "ai-agents",
    topic: "ai",
    question: "Do you build AI agents and intelligent business assistants?",
    answer:
      "Yes. An AI agent goes a step beyond a chatbot: it can take actions in your systems, such as updating a CRM record, creating a task or drafting a reply, within limits you set and with a person approving anything important.",
    links: [{ label: "AI agent development", href: "/services/ai-agents" }],
  },
  {
    id: "ai-lead-qualification",
    topic: "ai",
    question: "Can AI help qualify leads and automate follow-ups?",
    answer:
      "Yes. AI can read each new enquiry, check it against criteria you define, draft a personalised first reply and pass the best-fit leads to your sales team, with follow-ups scheduled in your CRM or on WhatsApp.",
    links: [{ label: "AI workflow automation", href: "/services/ai-workflow-automation" }],
  },
  {
    id: "whatsapp",
    topic: "ai",
    question: "Can you automate WhatsApp Business workflows?",
    answer: `Yes. We connect WhatsApp so customers get updates, answers and support in the app they already use, and so enquiries flow into your CRM.`,
    links: [{ label: "WhatsApp automation", href: "/services/whatsapp-automation" }],
  },
  {
    id: "connect-systems",
    topic: "ai",
    question: "Can you connect AI tools with CRM, ERP and other business software?",
    answer:
      "Yes. We connect your customer and business systems so information updates everywhere automatically, with no more copying data by hand.",
    links: [{ label: "ERP, CRM and HRMS solutions", href: "/services/erp-crm-hrms" }],
  },
  {
    id: "customise",
    topic: "ai",
    question: "Can you customise AI solutions to match our business workflows?",
    answer:
      "Yes. Each automation is scoped around how your team already works: which steps stay manual, who approves what, and which systems are involved.",
  },

  // Payments
  {
    id: "milestones",
    topic: "payments",
    question: "How does the milestone payment schedule work?",
    answer:
      "A 10% token confirms your project slot. 50% is paid to start planning and production, and the remaining 40% after your final review, before the live handover of files, code and access.",
    links: [{ label: "How we work", href: "/how-we-work" }],
  },

  // Process and timelines
  {
    id: "timeline",
    topic: "process",
    question: "How long does a project or AI automation workflow take?",
    answer:
      "A website or simple automation usually takes a few weeks. Larger custom software takes a few months, delivered step by step so you see progress along the way.",
    links: [{ label: "How we work", href: "/how-we-work" }],
  },
  {
    id: "quote-info",
    topic: "process",
    question: "What information do you need to prepare a quotation?",
    answer:
      "A short description of what you want to build or the problem to solve, the tools you use today, and your timeline. A rough idea is enough to start; the details are worked out in a free consultation.",
    links: [{ label: "Request a quote", href: "/inquiry" }],
  },
  {
    id: "book",
    topic: "process",
    question: "How can I book a meeting or consultation?",
    answer:
      "Submit the consultation form with your requirement, preferred date and time. The team reviews it and confirms availability.",
    links: [{ label: "Book a consultation", href: "/inquiry" }],
  },
  {
    id: "talk",
    topic: "process",
    question: "Can I talk directly to the team?",
    answer: `Yes. Message the team on WhatsApp or call ${siteConfig.contact.phone} (${siteConfig.contact.hours.replace(" · ", ", ")}).`,
    links: [{ label: "Contact details", href: "/contact" }],
  },

  // Ownership, data and support
  {
    id: "data-ownership",
    topic: "ownership",
    question: "How do you handle data privacy, AI security and project ownership?",
    answer:
      "Your domain, hosting, code and accounts stay registered to your business, and full access is handed over at the end of the project. AI features usually run on a third-party model provider, so the provider used, the data it receives and the points where a person reviews AI output should be agreed in writing before work starts. We do not sell personal information.",
    links: [{ label: "Privacy policy", href: "/privacy" }],
  },
  {
    id: "maintenance",
    topic: "ownership",
    question: "Do you provide ongoing maintenance and support, including for AI solutions?",
    answer:
      "Yes. We keep your software running smoothly, safe and up to date, and keep improving it. Website care and maintenance plans are quoted separately.",
  },
  {
    id: "domain-hosting",
    topic: "ownership",
    question: "Do you provide domain and hosting?",
    answer:
      "Yes. We help with domain selection, DNS configuration, SSL installation and cloud hosting setup, while all core accounts and credentials stay in your business's ownership.",
    links: [{ label: "Website development", href: "/services/website-development" }],
  },

  // Working with us
  {
    id: "startups",
    topic: "working",
    question: "Do you work with startups and small businesses?",
    answer:
      "Yes. We work with startups, small and medium-sized businesses, local businesses and growing brands, and help startups launch a first version quickly, built so it can grow.",
  },
  {
    id: "outside-nagpur",
    topic: "working",
    question: "Do you serve clients outside Nagpur?",
    answer:
      "Yes. We are based in Nagpur, Maharashtra, and work with businesses across India remotely.",
  },
];

export const faqById = (id: string) => {
  const faq = faqs.find((f) => f.id === id);
  if (!faq) throw new Error(`Unknown FAQ id: ${id}`);
  return faq;
};

/** The short list shown on the home page. */
export const homeFaqs = [
  "what-services",
  "ai-development-integration",
  "ai-processes",
  "ai-chatbots",
  "website-app-development",
  "lead-generation",
  "timeline",
  "data-ownership",
].map(faqById);
