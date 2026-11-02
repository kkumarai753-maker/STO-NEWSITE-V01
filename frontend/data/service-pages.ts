import { automationRun } from "@/data/automation";
import { processSteps } from "@/data/process";

/**
 * Content for the dedicated service pages (/services/[slug]).
 *
 * Sources: the service list in the owner's brief, plus facts already published
 * on the site (process, milestone payments, timelines, asset
 * ownership). Explanations of what a service is and its limitations are
 * general knowledge; examples are illustrative and labelled as examples.
 * TODO(owner): confirm each service is currently offered, then add real
 * deliverables, timelines, tools and case studies as they become available.
 */
export type ServicePage = {
  slug: string;
  name: string;
  division: "web" | "growth";
  metaTitle: string;
  metaDescription: string;
  /** Date this page's content last changed (YYYY-MM-DD). */
  updated: string;
  /** One line for llms.txt. */
  summary: string;
  eyebrow: string;
  /** H1; the `accent` substring is set in the accent tone. */
  heading: { text: string; accent: string };
  /** Answer-first summary under the H1: 2–3 sentences that directly answer "what is this and can you do it?". */
  answer: string;
  explainer: { heading: string; body: string[] };
  /** Optional comparison table. */
  table?: { caption: string; columns: string[]; rows: string[][] };
  offerings: { heading: string; items: { title: string; desc: string; href?: string }[] };
  examples?: { heading: string; intro?: string; items: string[]; ordered?: boolean };
  considerations: { heading: string; items: { title: string; desc: string }[] };
  faqIds: string[];
  related: string[];
};

const AI_MISTAKES = {
  title: "AI can make mistakes",
  desc: "Language models can give confident but wrong answers. Anything important, such as prices, refunds or messages to customers, should have clear limits or a review step.",
};
const AI_DATA = {
  title: "Your data and third-party providers",
  desc: "Most AI features send text to a model provider for processing. Agree in writing which provider is used, which data it receives and how long that data is kept.",
};
const OWNERSHIP = {
  title: "You own the result",
  desc: "Code, accounts and credentials stay registered to your business and are handed over at the end of the project.",
};
export const servicePages: ServicePage[] = [
  {
    slug: "ai-development",
    name: "AI Development",
    division: "web",
    metaTitle: "AI Development Services for Businesses",
    metaDescription:
      "Custom AI-powered applications for businesses: assistants, document reading, enquiry sorting and generative AI features, built by Sunrise Tech Origin.",
    updated: "2026-10-18",
    summary: "Custom AI-powered applications and generative AI features built around one business task.",
    eyebrow: "AI development",
    heading: { text: "AI development services for growing businesses", accent: "growing businesses" },
    answer:
      "Sunrise Tech Origin builds custom AI-powered applications for startups and small and medium-sized businesses: tools that read, sort, answer and draft, so your team spends less time on repetitive work. Projects are scoped in a free consultation and quoted in writing before work starts.",
    explainer: {
      heading: "What is custom AI development?",
      body: [
        "Custom AI development means building software around an AI model so it does a specific job for your business, using your own information and rules. Instead of a general chat tool, you get an application that fits one workflow: answering product questions, reading invoices, summarising enquiries or drafting replies.",
        "Most business AI applications are built on language models from established providers, connected to your data and wrapped in a simple screen your team can use. The value comes from the connection to your process, not from the model alone.",
      ],
    },
    offerings: {
      heading: "What we can build",
      items: [
        { title: "Custom AI-powered applications", desc: "Web or mobile tools with AI at the core, built around one clear business task." },
        { title: "Generative AI features", desc: "Drafted replies, summaries, product descriptions or reports, written from your own information." },
        { title: "Assistants for customers and staff", desc: "Assistants that answer questions from your documents, policies and product data.", href: "/services/ai-chatbots" },
        { title: "Document and data reading", desc: "Names, amounts, dates and order numbers pulled out of emails, forms and PDFs." },
        { title: "AI inside software you already use", desc: "AI features added to your existing website, app or CRM.", href: "/services/ai-integration" },
      ],
    },
    examples: {
      heading: "Examples of AI applications for small businesses",
      intro: "Illustrative examples of the kind of tools this covers:",
      items: [
        "A support assistant that answers delivery, pricing and policy questions and hands complex cases to a person.",
        "An enquiry reader that sorts new leads by service and urgency and drafts a first reply for review.",
        "A document tool that reads purchase orders or invoices and fills in your records.",
        "A content helper that drafts product descriptions and social posts in your brand's tone, for a person to approve.",
        "An internal assistant that answers staff questions from your own procedures.",
      ],
    },
    considerations: {
      heading: "What to know before starting an AI project",
      items: [
        AI_MISTAKES,
        AI_DATA,
        { title: "Start with one workflow", desc: "A focused first version is quicker to test and easier to measure than an all-in-one system. More can be added once it works." },
        OWNERSHIP,
      ],
    },
    faqIds: ["ai-development-integration", "timeline", "data-ownership", "maintenance"],
    related: ["ai-integration", "ai-workflow-automation", "ai-agents", "ai-chatbots"],
  },
  {
    slug: "ai-integration",
    name: "AI Integration",
    division: "web",
    metaTitle: "AI Integration for Websites, Apps & CRMs",
    metaDescription:
      "Add AI to the website, app, CRM or business software you already use: smart assistants, document reading and enquiry sorting, without rebuilding.",
    updated: "2026-10-18",
    summary: "AI features added to an existing website, app, CRM or ERP without replacing it.",
    eyebrow: "AI integration",
    heading: { text: "AI integration for the tools you already use", accent: "already use" },
    answer:
      "AI integration adds AI features to software you already run, such as your website, app, CRM or ERP, so you don't have to replace it. Sunrise Tech Origin connects AI models to your existing systems for tasks like answering questions, reading documents and sorting enquiries, with your team in control.",
    explainer: {
      heading: "What is AI integration?",
      body: [
        "AI integration connects an AI model to your existing systems through their integrations or APIs (the connection points software uses to talk to other software). The AI receives information from your tools, does a task such as classifying, summarising or answering, and writes the result back where your team already works.",
        "It is usually quicker than building a new AI application, because the systems your business relies on stay in place. Whether a particular tool can be connected depends on the integrations it offers, which is checked during scoping.",
      ],
    },
    table: {
      caption: "AI integration compared with custom AI development",
      columns: ["", "AI integration", "Custom AI development"],
      rows: [
        ["Starting point", "Your existing website, app or business software", "A new application built around one task"],
        ["Best when", "Your tools work and you want them to do more", "No existing tool fits the workflow"],
        ["Typical work", "Connect, configure and test AI features", "Design, build and launch a new product"],
        ["Example", "AI summaries of new enquiries inside your CRM", "A customer support assistant app"],
      ],
    },
    offerings: {
      heading: "What we can integrate AI with",
      items: [
        { title: "Your website", desc: "An assistant that answers from your own pages, prices and policies.", href: "/services/ai-chatbots" },
        { title: "CRM and sales tools", desc: "Enquiry summaries, lead scoring and drafted follow-ups inside your CRM.", href: "/services/erp-crm-hrms" },
        { title: "ERP and operations software", desc: "Orders, invoices and stock updates read and entered for you." },
        { title: "WhatsApp Business", desc: "Answers and updates in the app your customers already use.", href: "/services/whatsapp-automation" },
        { title: "Email and documents", desc: "Incoming email sorted and key details pulled out of attachments." },
      ],
    },
    examples: {
      heading: "AI integration examples",
      intro: "Illustrative examples:",
      items: [
        "Every new website enquiry is summarised and added to the CRM with a suggested next step.",
        "Customer emails are sorted into sales, support and billing, and routine ones get a drafted reply for approval.",
        "Order confirmations that arrive as PDFs are read and entered into the order system.",
        "Staff ask questions about internal procedures and get answers sourced from your documents.",
      ],
    },
    considerations: {
      heading: "What to know before integrating AI",
      items: [
        AI_MISTAKES,
        AI_DATA,
        { title: "Integration limits", desc: "Some tools offer limited or paid integration options, which can affect what is possible and what it costs." },
        OWNERSHIP,
      ],
    },
    faqIds: ["ai-existing-systems", "connect-systems", "customise", "data-ownership"],
    related: ["ai-development", "ai-workflow-automation", "erp-crm-hrms", "whatsapp-automation"],
  },
  {
    slug: "ai-workflow-automation",
    name: "AI Workflow Automation",
    division: "web",
    metaTitle: "AI Workflow Automation Services",
    metaDescription:
      "Automate repetitive work with AI: data entry, email and WhatsApp replies, follow-ups, approvals and lead sorting, with your team approving what matters.",
    updated: "2026-10-18",
    summary: "Repetitive business processes such as data entry, follow-ups, approvals and lead sorting automated with AI.",
    eyebrow: "AI workflow automation",
    heading: { text: "AI workflow automation for repetitive work", accent: "automation" },
    answer:
      "AI workflow automation takes repetitive tasks such as data entry, follow-ups, approvals and lead sorting, and runs them automatically across your tools. Sunrise Tech Origin designs each workflow around how your team already works, and unusual cases are passed to a person.",
    explainer: {
      heading: "What is AI workflow automation?",
      body: [
        "A workflow is a chain of steps your team repeats: an enquiry arrives, someone reads it, updates a spreadsheet or CRM, creates a task and sends a reply. Traditional automation handles the fixed steps; AI handles the steps that need reading or judgement, such as understanding what a customer is asking for.",
        "Together they let a request move from arrival to reply with little manual work, while a person approves anything unusual or important.",
      ],
    },
    offerings: {
      heading: "What we can automate",
      items: [
        { title: "Data entry", desc: "Details from emails, forms and documents copied into your records automatically." },
        { title: "Customer replies", desc: "Answers to common questions on email and WhatsApp, drafted or sent within rules you set.", href: "/services/whatsapp-automation" },
        { title: "Follow-ups and reminders", desc: "Scheduled follow-ups for leads, quotations and payments." },
        { title: "Approvals", desc: "Requests sent to the right person with a summary, approved in one step." },
        { title: "Lead sorting", desc: "New enquiries checked, prioritised and assigned to the right salesperson." },
        { title: "Reports", desc: "Regular summaries prepared from your systems without manual copying." },
      ],
    },
    examples: {
      heading: "Example: a customer email, handled from start to finish",
      intro: "An illustrative workflow, step by step:",
      ordered: true,
      items: automationRun.steps.map((s) => `${s.title}: ${s.detail.replace(/[“”]/g, "")}`),
    },
    considerations: {
      heading: "What to know before automating",
      items: [
        { title: "Keep a person in the loop", desc: "Decide which steps the automation can complete alone and which need someone's approval." },
        { title: "Automate one process first", desc: "Start with the task that repeats most often; it is the easiest to measure and improve." },
        AI_MISTAKES,
        AI_DATA,
      ],
    },
    faqIds: ["ai-processes", "ai-lead-qualification", "customise", "timeline"],
    related: ["ai-agents", "ai-integration", "whatsapp-automation", "erp-crm-hrms"],
  },
  {
    slug: "ai-agents",
    name: "AI Agent Development",
    division: "web",
    metaTitle: "AI Agent Development for Businesses",
    metaDescription:
      "AI agents that take actions in your systems: update CRM records, create tasks, draft replies and follow up, within limits you set and with human approval.",
    updated: "2026-10-18",
    summary: "AI agents and business assistants that take actions in your systems within set limits and with human approval.",
    eyebrow: "AI agents",
    heading: { text: "AI agent development with human approval", accent: "human approval" },
    answer:
      "An AI agent is an assistant that can take actions in your business systems, not just answer questions: it can update a CRM record, create a task, draft a reply or schedule a follow-up. Sunrise Tech Origin builds agents that work within limits you set, with a person approving anything important.",
    explainer: {
      heading: "What is an AI agent, and how is it different from a chatbot?",
      body: [
        "A chatbot answers questions in a conversation. An agent is given a goal and access to tools, decides which steps to take, and carries them out: looking up an order, updating a record, sending a confirmation.",
        "Because agents act rather than only talk, they need clear limits on what they can change and when they must ask a person.",
      ],
    },
    table: {
      caption: "AI chatbot compared with AI agent",
      columns: ["", "AI chatbot", "AI agent"],
      rows: [
        ["Main job", "Answers questions in a conversation", "Completes tasks across your systems"],
        ["Access to your systems", "Usually reads your information", "Can read and update records"],
        ["Human oversight", "Hands the conversation to a person when needed", "Asks for approval before important actions"],
        ["Example", "Answers “Where is my order?”", "Changes the delivery date and confirms it"],
      ],
    },
    offerings: {
      heading: "What an AI agent can do for your business",
      items: [
        { title: "Sales assistant", desc: "Reads a new enquiry, updates the CRM and drafts a first reply for review." },
        { title: "Operations assistant", desc: "Checks orders or stock, creates tasks and notifies the right person." },
        { title: "Customer service agent", desc: "Handles routine requests, such as changing a delivery date, and passes the rest to your team." },
        { title: "Internal assistant", desc: "Finds information across your documents and tools for staff." },
      ],
    },
    considerations: {
      heading: "How to keep an AI agent safe",
      items: [
        { title: "Limited permissions", desc: "An agent should only reach the tools and data its job needs." },
        { title: "Approval for important actions", desc: "Payments, refunds, deletions and messages to customers can require a person's approval." },
        { title: "A record of every action", desc: "Each action should be logged, so you can see what the agent did and why." },
        AI_MISTAKES,
      ],
    },
    faqIds: ["ai-agents", "customise", "data-ownership"],
    related: ["ai-chatbots", "ai-workflow-automation", "ai-development", "ai-integration"],
  },
  {
    slug: "ai-chatbots",
    name: "AI Chatbot Development",
    division: "web",
    metaTitle: "AI Chatbot Development: Web & WhatsApp",
    metaDescription:
      "AI chatbots for your website and WhatsApp that answer customer questions from your own information, qualify leads and hand conversations to your team.",
    updated: "2026-10-18",
    summary: "AI chatbots for websites and WhatsApp for customer support and lead qualification, with hand-off to people.",
    eyebrow: "AI chatbots",
    heading: { text: "AI chatbots for your website and WhatsApp", accent: "WhatsApp" },
    answer:
      "Sunrise Tech Origin builds AI chatbots for websites and WhatsApp that answer common customer questions from your own business information, collect enquiry details to qualify leads, and hand the conversation to your team when a person is needed.",
    explainer: {
      heading: "How does an AI chatbot work?",
      body: [
        "A modern AI chatbot uses a language model to understand questions written in everyday words, and answers from information you provide, such as your services, prices, policies and FAQs. Unlike older menu-based bots, visitors don't have to pick from fixed options.",
        "A good chatbot also knows its limits: when a question is outside its information, involves money or needs judgement, it collects the details and passes the conversation to your team.",
      ],
    },
    offerings: {
      heading: "What your chatbot can do",
      items: [
        { title: "Answer customer questions", desc: "Delivery, pricing, opening hours, policies and product questions, at any time of day." },
        { title: "Qualify leads", desc: "Ask a few questions, capture contact details and send the enquiry to your CRM or sales team." },
        { title: "Work inside WhatsApp", desc: "The same assistant in WhatsApp Business, where many customers already message you.", href: "/services/whatsapp-automation" },
        { title: "Collect booking requests", desc: "Gather the details for a booking or appointment and send them to the right person." },
        { title: "Hand off to your team", desc: "Pass complex or sensitive conversations to a person with a short summary." },
      ],
    },
    examples: {
      heading: "AI chatbot examples",
      intro: "Illustrative examples:",
      items: [
        "A retail store answering product, delivery and return questions on WhatsApp.",
        "A service business asking website visitors about their requirement and timeline before a sales call.",
        "A training institute answering course, fee and schedule questions and collecting enrolment enquiries.",
      ],
    },
    considerations: {
      heading: "What to know before launching a chatbot",
      items: [
        { title: "Answer from approved information", desc: "Limit the chatbot to your own content, so it doesn't guess about prices or policies." },
        { title: "Make hand-off easy", desc: "Customers should always be able to reach a person." },
        AI_MISTAKES,
        AI_DATA,
      ],
    },
    faqIds: ["ai-chatbots", "ai-lead-qualification", "whatsapp", "data-ownership"],
    related: ["whatsapp-automation", "ai-agents", "ai-integration", "ai-workflow-automation"],
  },
  {
    slug: "whatsapp-automation",
    name: "WhatsApp Business Automation",
    division: "web",
    metaTitle: "WhatsApp Business Automation & CRM Setup",
    metaDescription:
      `WhatsApp Business integration and automation: instant replies, booking and order updates, and lead capture into your CRM.`,
    updated: "2026-10-18",
    summary: "WhatsApp Business integration: automatic replies, updates and lead capture connected to a CRM.",
    eyebrow: "WhatsApp automation",
    heading: { text: "WhatsApp Business automation and integration", accent: "automation" },
    answer:
      `Sunrise Tech Origin connects WhatsApp Business to your website, CRM and business tools, so customers get replies and updates where they already message you and every enquiry is captured.`,
    explainer: {
      heading: "What can WhatsApp Business automation do?",
      body: [
        "WhatsApp automation connects your WhatsApp Business account to your other systems. Messages can be answered automatically, enquiries saved to your CRM, and updates such as booking confirmations or order status sent without someone typing each one.",
        "Automated business messaging runs through the WhatsApp Business Platform, which has its own rules and per-message charges. These are separate from setup and are listed in your quotation.",
      ],
    },
    offerings: {
      heading: "What we set up",
      items: [
        { title: "Instant replies", desc: "Answers to common questions, with AI for questions written in free text.", href: "/services/ai-chatbots" },
        { title: "Lead capture", desc: "Every WhatsApp enquiry saved to your CRM with name, number and requirement.", href: "/services/erp-crm-hrms" },
        { title: "Updates and reminders", desc: "Booking confirmations, order updates, payment reminders and follow-ups." },
        { title: "Website to WhatsApp", desc: "Click-to-chat buttons and forms that start a WhatsApp conversation." },
        { title: "Team hand-off", desc: "Conversations routed to the right person when a human is needed." },
      ],
    },
    considerations: {
      heading: "What to know about WhatsApp automation",
      items: [
        { title: "WhatsApp's rules apply", desc: "Business messages must follow WhatsApp's policies, including customer opt-in for messages your business starts." },
        { title: "Message charges", desc: "WhatsApp charges for some business conversations; these fees are paid to WhatsApp, separately from our work." },
        { title: "Your account, your number", desc: "The WhatsApp Business account and number stay registered to your business." },
      ],
    },
    faqIds: ["whatsapp", "ai-chatbots", "ai-lead-qualification"],
    related: ["ai-chatbots", "erp-crm-hrms", "ai-workflow-automation", "website-development"],
  },
  {
    slug: "website-development",
    name: "Website Development",
    division: "web",
    metaTitle: "Website Development Company in Nagpur",
    metaDescription:
      "Website development in Nagpur: one-page and business websites, e-commerce, hosting setup and maintenance, all owned by you.",
    updated: "2026-10-18",
    summary: "Business websites, e-commerce, redesigns, domain and hosting setup and maintenance.",
    eyebrow: "Website development",
    heading: { text: "Website development in Nagpur", accent: "Nagpur" },
    answer:
      `Sunrise Tech Origin designs and builds fast, mobile-friendly websites for businesses in Nagpur and across India. Your domain, hosting and accounts stay in your name.`,
    explainer: {
      heading: "What's included in a business website?",
      body: [
        "A business website should explain what you do, who it's for and how to get in touch, load quickly on phones, and be easy for search engines to understand. That means a clear page structure, reliable hosting, an SSL certificate (the padlock in the browser), enquiry forms and the technical basics of search visibility.",
        "Each site is planned around enquiries: what a visitor needs to see before they call, message or fill in a form.",
      ],
    },
    offerings: {
      heading: "Website services",
      items: [
        { title: "Website redesign", desc: "A refreshed design and structure for an existing website." },
        { title: "Search basics built in", desc: "Page titles, descriptions, headings and speed that help search engines understand your site.", href: "/services/seo" },
        { title: "WhatsApp and enquiry forms", desc: "Click-to-chat and forms that send enquiries to you.", href: "/services/whatsapp-automation" },
        { title: "AI on your website", desc: "An assistant that answers visitors' questions from your own content.", href: "/services/ai-integration" },
      ],
    },
    considerations: {
      heading: "What you should own",
      items: [
        { title: "Domain and hosting in your name", desc: "Your domain, hosting, DNS and SSL accounts stay registered to your business." },
        { title: "Full access at handover", desc: "Files, code and logins are handed over after final approval." },
        { title: "Ongoing care", desc: "Updates, backups and security checks are available as a separate maintenance plan." },
      ],
    },
    faqIds: ["website-app-development", "domain-hosting", "timeline", "outside-nagpur"],
    related: ["seo", "custom-software-development", "ai-integration", "whatsapp-automation"],
  },
  {
    slug: "custom-software-development",
    name: "Custom Software & App Development",
    division: "web",
    metaTitle: "Custom Software & App Development",
    metaDescription:
      "Web applications, mobile apps for iPhone and Android, and custom software built around how your business works, from first version to ongoing support.",
    updated: "2026-10-18",
    summary: "Web applications, mobile apps, customer portals, dashboards and system integration.",
    eyebrow: "Web, mobile and custom software",
    heading: { text: "Custom software and app development", accent: "app development" },
    answer:
      "Sunrise Tech Origin builds web applications, mobile apps for iPhone and Android, and custom software made to fit how your business works, from planning and design to launch and ongoing support. Projects are quoted after a free consultation.",
    explainer: {
      heading: "When does a business need custom software?",
      body: [
        "Off-the-shelf tools work until your process stops fitting them: data ends up in spreadsheets, staff copy information between apps, and customers wait for manual updates. Custom software brings that work into one system designed around your steps, your roles and your customers.",
        "It can be a web application used in the browser, a mobile app, a customer portal, an internal dashboard, or a connection between the tools you already use.",
      ],
    },
    offerings: {
      heading: "What we build",
      items: [
        { title: "Web applications", desc: "Online tools and dashboards your team and customers use every day." },
        { title: "Mobile apps", desc: "Easy-to-use apps for iPhone and Android." },
        { title: "Customer portals", desc: "A place where customers check orders and invoices and get help." },
        { title: "Admin panels and dashboards", desc: "Manage your team, permissions and live reports in one place." },
        { title: "System integration", desc: "Your different tools connected so information flows between them automatically.", href: "/services/erp-crm-hrms" },
      ],
    },
    examples: {
      heading: "How custom software is built, step by step",
      ordered: true,
      items: processSteps.map((s) => `${s.title}: ${s.description}`),
    },
    considerations: {
      heading: "What to know before you start",
      items: [
        { title: "Start with a first version", desc: "Launch the most important features first, then improve based on real use." },
        OWNERSHIP,
        { title: "Support after launch", desc: "Maintenance and improvements can continue after handover." },
      ],
    },
    faqIds: ["website-app-development", "startups", "timeline", "maintenance", "milestones"],
    related: ["saas-development", "erp-crm-hrms", "ai-development", "website-development"],
  },
  {
    slug: "erp-crm-hrms",
    name: "ERP, CRM & HRMS Solutions",
    division: "web",
    metaTitle: "ERP, CRM & HRMS Software Solutions",
    metaDescription:
      `ERP, CRM and HRMS solutions for growing businesses: setup, customisation and integration with your website, WhatsApp and AI.`,
    updated: "2026-10-18",
    summary: "Setup, customisation and integration of CRM, ERP and HRMS business software.",
    eyebrow: "Business software",
    heading: { text: "ERP, CRM and HRMS solutions", accent: "solutions" },
    answer:
      `Sunrise Tech Origin sets up and customises business software, including CRM for sales, ERP for operations and HRMS for people management, and connects it to your website, WhatsApp and other tools. Each system is scoped in a free consultation.`,
    explainer: {
      heading: "What are ERP, CRM and HRMS?",
      body: [
        "They are the three core systems most growing businesses end up needing. Many start with spreadsheets for all three; moving to proper systems makes information consistent and lets you automate the steps between them.",
      ],
    },
    table: {
      caption: "What CRM, ERP and HRMS systems manage",
      columns: ["System", "What it manages", "Typical users"],
      rows: [
        ["CRM (customer relationship management)", "Leads, customers, deals and follow-ups", "Sales and support teams"],
        ["ERP (enterprise resource planning)", "Orders, inventory, purchasing, billing and operations", "Operations, accounts and management"],
        ["HRMS (human resource management system)", "Employee records, attendance, leave and payroll inputs", "HR and managers"],
      ],
    },
    offerings: {
      heading: "What we set up",
      items: [
        { title: "CRM implementation and setup", desc: "Pipelines, lead capture from your website and WhatsApp, follow-up reminders and reports." },
        { title: "ERP solutions", desc: "Orders, stock, purchasing and invoicing in one place, set up around your process." },
        { title: "HRMS solutions", desc: "Employee records, attendance and leave in a system your team can use." },
        { title: "Integration and data migration", desc: "Data moved out of spreadsheets, and systems connected so information updates everywhere." },
        { title: "AI on top of your systems", desc: "Enquiry summaries, lead scoring and drafted follow-ups inside your CRM.", href: "/services/ai-integration" },
      ],
    },
    considerations: {
      heading: "What to know before choosing a system",
      items: [
        { title: "Configure or build", desc: "Many needs are met by configuring an existing platform; custom development makes sense when your process doesn't fit. This is decided during scoping." },
        { title: "Clean data first", desc: "Duplicates and gaps are easier to fix before data is moved into a new system." },
        { title: "Handover and training", desc: "Handover includes credentials and training for your team." },
        OWNERSHIP,
      ],
    },
    faqIds: ["erp-crm-hrms", "connect-systems", "whatsapp", "maintenance"],
    related: ["ai-integration", "whatsapp-automation", "custom-software-development", "ai-workflow-automation"],
  },
  {
    slug: "saas-development",
    name: "SaaS Development",
    division: "web",
    metaTitle: "SaaS Product Development Services",
    metaDescription:
      "SaaS development for founders and businesses: plan, design and build a subscription software product with sign-up, billing, team accounts and an admin area.",
    updated: "2026-10-18",
    summary: "Software-as-a-service products from first version to subscriptions, team accounts and admin.",
    eyebrow: "SaaS development",
    heading: { text: "SaaS product development", accent: "development" },
    answer:
      "Sunrise Tech Origin designs and builds software-as-a-service (SaaS) products, from a first version you can launch to core features such as sign-up, subscription billing, team accounts and an admin area. SaaS projects are scoped in a free consultation and delivered in milestones.",
    explainer: {
      heading: "What does it take to build a SaaS product?",
      body: [
        "A SaaS product is software customers sign up for and pay for on a subscription, used in the browser or an app. Beyond the main feature, it needs accounts and sign-in, payments and plans, permissions for teams, an admin area, email notifications, security and reliable hosting.",
        "The quickest route is usually a focused first version that solves one problem well, launched to real users, then improved based on how they use it.",
      ],
    },
    offerings: {
      heading: "What we build",
      items: [
        { title: "Product planning", desc: "Agreeing what to build first and setting a clear plan." },
        { title: "Design", desc: "Screens that are clean and easy to use." },
        { title: "Accounts, subscriptions and payments", desc: "Sign-up, plans, billing and team accounts." },
        { title: "Admin area", desc: "Manage customers, plans, permissions and settings." },
        { title: "AI features", desc: "AI built into the product where it helps your users.", href: "/services/ai-development" },
        { title: "Launch and support", desc: "Safe deployment, then ongoing improvements." },
      ],
    },
    considerations: {
      heading: "What to know before building",
      items: [
        { title: "Validate the first version", desc: "Launch the smallest useful product and learn from real customers before adding more." },
        OWNERSHIP,
        { title: "Plan for maintenance", desc: "Subscription products need ongoing updates, security fixes and support." },
      ],
    },
    faqIds: ["saas", "startups", "timeline", "milestones", "maintenance"],
    related: ["custom-software-development", "ai-development", "website-development", "erp-crm-hrms"],
  },
  {
    slug: "seo",
    name: "Local SEO",
    division: "growth",
    metaTitle: "Local SEO Services in Nagpur",
    metaDescription:
      `Local SEO: Google Business Profile optimisation, local search visibility and website fixes for small businesses in Nagpur and India.`,
    updated: "2026-10-18",
    summary: "Local SEO: Google Business Profile, local search visibility and on-site search basics, as a monthly service.",
    eyebrow: "Search engine optimisation",
    heading: { text: "Local SEO services in Nagpur", accent: "Nagpur" },
    answer:
      `Sunrise Tech Origin's local SEO service helps small businesses get found on Google for searches in their area, through Google Business Profile optimisation, local search visibility and website improvements. Rankings depend on competition and can't be guaranteed.`,
    explainer: {
      heading: "What does local SEO include?",
      body: [
        "Local SEO is the work that helps your business appear when people nearby search for what you offer, in Google Search and Google Maps. It covers your Google Business Profile, consistent business details across the web, and a website that clearly states your services and location.",
        "Results build over months rather than days, and depend on your competition and how complete your information is.",
      ],
    },
    offerings: {
      heading: "What the service covers",
      items: [
        { title: "Google Business Profile", desc: "A complete, accurate profile with services, hours, photos and categories." },
        { title: "Local discovery", desc: "Consistent business name, address and phone number across directories." },
        { title: "Website search basics", desc: "Titles, descriptions, headings, speed and structured data that help search engines.", href: "/services/website-development" },
        { title: "Search visibility support", desc: "Ongoing work to improve how your business appears in local search." },
      ],
    },
    considerations: {
      heading: "What to expect from SEO",
      items: [
        { title: "No guaranteed rankings", desc: "Search engines decide rankings; honest SEO improves your chances, not a fixed position." },
        { title: "It takes time", desc: "Expect to judge results over months, not weeks." },
        { title: "Your profiles stay yours", desc: "Your Google Business Profile and other accounts stay under your business ownership." },
      ],
    },
    faqIds: ["digital-marketing", "lead-generation", "outside-nagpur"],
    related: ["website-development", "ai-chatbots", "whatsapp-automation"],
  },
];

export function getServicePage(slug: string) {
  return servicePages.find((s) => s.slug === slug);
}
