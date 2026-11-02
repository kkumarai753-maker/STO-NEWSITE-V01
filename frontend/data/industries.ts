import {
  Briefcase,
  Building2,
  Factory,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  Rocket,
  ShoppingBag,
  Truck,
  type LucideIcon,
} from "lucide-react";

export type Industry = {
  id: string;
  name: string;
  icon: LucideIcon;
};

export const industries: Industry[] = [
  {
    id: "healthcare",
    name: "Healthcare",
    icon: HeartPulse,
  },
  {
    id: "finance",
    name: "Finance",
    icon: Landmark,
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: House,
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    icon: ShoppingBag,
  },
  {
    id: "education",
    name: "Education",
    icon: GraduationCap,
  },
  {
    id: "logistics",
    name: "Logistics",
    icon: Truck,
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: Factory,
  },
  {
    id: "professional-services",
    name: "Professional Services",
    icon: Briefcase,
  },
  {
    id: "startups",
    name: "Startups",
    icon: Rocket,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Building2,
  },
];
