import {
  BrainCircuit,
  Gauge,
  Handshake,
  Layers,
  MousePointerClick,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type Differentiator = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const differentiators: Differentiator[] = [
  { id: "ai-first", title: "AI-First Thinking", description: "We look for where AI can save you time and money.", icon: BrainCircuit },
  { id: "architecture", title: "Built to Grow", description: "Your software keeps up as your business grows.", icon: Layers },
  { id: "ux", title: "Easy to Use", description: "Designed so customers and staff get things done quickly.", icon: MousePointerClick },
  { id: "security", title: "Safe and Reliable", description: "Your data stays protected and your systems stay online.", icon: ShieldCheck },
  { id: "performance", title: "Fast Everywhere", description: "Quick-loading websites and apps on any device.", icon: Gauge },
  { id: "partnership", title: "Long-Term Partner", description: "We stay with you after launch to support and improve.", icon: Handshake },
];
