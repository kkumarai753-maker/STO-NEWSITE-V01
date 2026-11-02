import { Monitor, Layers3, Bot, Megaphone } from "lucide-react";
import { serviceCategories } from "./service-categories";
export const services = serviceCategories.map((c) => ({
  id: c.id,
  title: c.name,
  description: c.description,
  icon: { monitor: Monitor, layers: Layers3, bot: Bot, megaphone: Megaphone }[
    c.icon
  ],
  contactValue: c.name,
  href: `/services/${c.id}`,
}));
