export const templates = [
  {
    slug: "electrical-store",
    category: "E-commerce",
    name: "Current & Co.",
    subtitle: "Electrical & electronics store",
    description:
      "Product browsing, category filters and a working sample shopping cart.",
    color: "#153862",
    accent: "#f3a13b",
    kind: "store",
    image: "/templates/electrical-store.png",
  },
  {
    slug: "salon",
    category: "Beauty & Wellness",
    name: "The Studio",
    subtitle: "Salon & beauty studio",
    description:
      "Service discovery, appointment selection and a sample booking flow.",
    color: "#3b302d",
    accent: "#b88265",
    kind: "salon",
    image: "/templates/salon.png",
  },
  {
    slug: "gym",
    category: "Fitness",
    name: "Sunrise Gold Gym",
    subtitle: "Fitness & training studio",
    description:
      "Membership options, training discovery and a sample trial enquiry.",
    color: "#171e23",
    accent: "#e5ac3b",
    kind: "gym",
    image: "/templates/gym.png",
  },
] as const;

/** Public demo destinations checked 2 November 2026. Card visuals are representative
 * artwork or project images; they are not screenshots or video recordings. */
export type LiveDemo = {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  image: string | null;
  imageAlt: string;
};
export const liveDemos: LiveDemo[] = [
  {
    id: "aaranya-salon",
    name: "Aaranya Salon",
    category: "Salon & Beauty",
    description:
      "Explore a salon website presentation and find inspiration for your beauty brand.",
    url: "https://aaranya-salon-preview-github.vercel.app/",
    image: "/templates/supplied/salon.jpg",
    imageAlt:
      "Illustrative salon website design graphic; not a screenshot of the Aaranya website.",
  },
  {
    id: "bnp-wellness",
    name: "BNP Wellness",
    category: "Health & Wellness",
    description:
      "Explore a wellness-focused website demo and discuss a digital presence for your practice.",
    url: "https://bnp-wellness-new-demo.vercel.app/",
    image: "/templates/supplied/wellness.jpg",
    imageAlt:
      "Illustrative healthcare technology graphic; not a screenshot of the BNP Wellness website.",
  },
  {
    id: "sr-wonder-travels",
    name: "SR Wonder Travels",
    category: "Travel & Tourism",
    description:
      "Explore a travel business website demo for your next journey online.",
    url: "https://sr-wonder-travels.vercel.app/",
    image: "/templates/supplied/travel.jpg",
    imageAlt:
      "Illustrative travel agency scene; not a screenshot of the SR Wonder Travels website.",
  },
  {
    id: "global-life-school",
    name: "Sunrise Global Life School",
    category: "Education",
    description:
      "Explore a school website demo as a starting point for your institution’s digital presence.",
    url: "https://sunrise-global-life-school-demo.vercel.app/index.html",
    image: "/templates/supplied/school.png",
    imageAlt:
      "Generated illustrative school campus scene, not a photograph of Sunrise Global Life School.",
  },
  {
    id: "sunrise-gold-gym",
    name: "Sunrise Gold Gym",
    category: "Fitness",
    description:
      "Explore a fitness website demo and imagine a digital home for your training community.",
    url: "https://sunrise-gold-gym-preview.vercel.app/",
    image: "/templates/supplied/gym.jpg",
    imageAlt:
      "Illustrative gym training poster; not a screenshot of the Sunrise Gold Gym website.",
  },
  {
    id: "sunrise-realtors",
    name: "Sunrise Realtors",
    category: "Real Estate",
    description: "Property discovery, locality browsing and enquiries for a real estate business.",
    url: "https://suntech-realeastate.vercel.app/",
    image: "/templates/projects/sunrise-realtors.jpg",
    imageAlt: "Nagpur residential property photograph used as a representative real estate visual.",
  },
  {
    id: "shubh-fashion",
    name: "Shubh Fashion Studio",
    category: "Fashion & Retail",
    description: "A menswear storefront with product discovery, saved pieces and shopping-bag enquiries.",
    url: "https://shubh-fashion-studio.vercel.app/",
    image: "/templates/projects/shubh-fashion.png",
    imageAlt: "AI-created blue menswear campaign artwork from Shubh Fashion Studio; not a website screenshot.",
  },
  {
    id: "mate-electricals",
    name: "Mate Electricals",
    category: "Electrical & Electronics",
    description: "An electrical business website that brings products and customer enquiries together.",
    url: "https://mate-electricals.vercel.app/",
    image: "/templates/projects/mate-electricals.png",
    imageAlt: "Representative electrical products artwork from Mate Electricals; not a website screenshot.",
  },
  {
    id: "rajendra-portfolio",
    name: "Rajendra MK Portfolio",
    category: "Personal Portfolio",
    description: "A personal portfolio presenting professional experience and selected projects.",
    url: "https://v0-rajendramk.vercel.app/",
    image: "/templates/projects/rajendra-portfolio.jpg",
    imageAlt: "Rajendra MK portrait from the public portfolio website.",
  },
  {
    id: "echo-ai-voice",
    name: "Echo AI Voice Assistant",
    category: "AI Demos",
    description: "Explore an AI voice-assistant interface and discuss conversational experiences for your business.",
    url: "https://ai-app-studio-seven.vercel.app/",
    image: "/templates/projects/ai-voice.jpg",
    imageAlt: "Illustrative AI assistant artwork; not a screenshot of the Echo app.",
  },
];
