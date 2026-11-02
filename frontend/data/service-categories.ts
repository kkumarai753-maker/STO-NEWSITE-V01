export const serviceCategories = [
  {
    id: "social-media",
    image: "/services/social-media.jpg",
    imageAlt:
      "Social media marketing and management illustration with social platform icons and a mobile phone.",
    imageBackground: "#ffffff",
    number: "01",
    name: "Social Media Management",
    short: "Get seen. Stay relevant.",
    description:
      "Content, account management and paid campaigns built around your audience and business goals.",
    items: [
      "Social media management",
      "Content planning & creative",
      "Paid ads & campaigns",
      "Reporting & optimisation",
    ],
    icon: "megaphone",
    color: "orange",
    example: "From your next post to your next campaign.",
    packages: [
      "Account management",
      "Content & creative",
      "Paid campaign management",
    ],
  },
  {
    id: "website-development",
    image: "/services/website-development.jpg",
    imageAlt:
      "Web and app development: design, develop and launch responsive websites and scalable digital experiences.",
    imageBackground: "#074988",
    number: "02",
    name: "Website Development",
    short: "Your business, beautifully online.",
    description:
      "Explore industry demos and choose the pages, features and integrations that fit your business.",
    items: [
      "Business & industry websites",
      "E-commerce stores",
      "Landing pages",
      "Frontend & backend development",
    ],
    icon: "monitor",
    color: "blue",
    example: "A digital home that feels like your business.",
    packages: [
      "Landing / one-page website",
      "3–4 page business website",
      "E-commerce website",
      "Custom frontend & backend",
    ],
  },
  {
    id: "ai-automation",
    image: "/services/ai-automation.jpg",
    imageAlt: "Illustrative AI assistant connected to multiple AI tools.",
    imageBackground: "#020b21",
    number: "03",
    name: "AI Automation & Agents",
    short: "Make everyday work flow.",
    description:
      "Explore connected workflows and purpose-built AI assistants. Final agents and features are agreed during scoping.",
    items: [
      "Workflow automation",
      "Customer-support agents",
      "Lead & enquiry workflows",
      "Connected business tools",
    ],
    icon: "bot",
    color: "blue",
    example: "More time for the work that needs you.",
    packages: [
      "Workflow discovery",
      "Automation implementation",
      "Custom AI agent — scope agreed",
    ],
  },
  {
    id: "software",
    image: "/services/software-solutions.jpg",
    imageAlt:
      "Custom software development graphic showing CRM, ERP, cloud, API and mobile app connections.",
    imageBackground: "#fff8f0",
    number: "04",
    name: "Software Solutions",
    short: "Bring your business together.",
    description:
      "Four focused software options for the way your team works: SaaS, ERP, HRMS and CRM.",
    items: ["SaaS software", "ERP solutions", "HRMS", "CRM dashboards"],
    icon: "layers",
    color: "orange",
    example: "One clearer view of your everyday operations.",
    packages: ["SaaS software", "ERP solution", "HRMS", "CRM dashboard"],
  },
] as const;
