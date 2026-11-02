import {
  BrainCircuit,
  CodeXml,
  Globe,
  Network,
  PanelsTopLeft,
  Smartphone,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Value pre-selected in the contact form when the card is clicked. */
  contactValue: string;
};

export const services: Service[] = [
  {
    id: "ai-automation",
    title: "AI Automation",
    description: "Let AI handle repetitive tasks like emails, data entry and follow-ups.",
    icon: Sparkles,
    contactValue: "AI Automation",
  },
  {
    id: "ai-integration",
    title: "AI Integration",
    description: "Add AI to the tools you already use, like your website or customer system.",
    icon: BrainCircuit,
    contactValue: "AI Integration",
  },
  {
    id: "website-development",
    title: "Website Development",
    description: "Fast, modern websites that look great and bring in customers.",
    icon: Globe,
    contactValue: "Website Development",
  },
  {
    id: "web-applications",
    title: "Web Applications",
    description: "Online tools and dashboards your team and customers use every day.",
    icon: PanelsTopLeft,
    contactValue: "Web Application",
  },
  {
    id: "mobile-applications",
    title: "Mobile Applications",
    description: "Easy-to-use apps for iPhone and Android.",
    icon: Smartphone,
    contactValue: "Mobile Application",
  },
  {
    id: "custom-software",
    title: "Custom Software",
    description: "Software made to fit exactly how your business works.",
    icon: CodeXml,
    contactValue: "Custom Software",
  },
  {
    id: "api-integration",
    title: "System Integration",
    description: "Connect your different tools so information flows between them automatically.",
    icon: Network,
    contactValue: "System Integration",
  },
  {
    id: "process-automation",
    title: "Business Process Automation",
    description: "Turn slow, manual processes into ones that run on their own.",
    icon: Workflow,
    contactValue: "AI Automation",
  },
];
