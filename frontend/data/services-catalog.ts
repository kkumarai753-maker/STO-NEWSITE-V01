import { serviceCategories, serviceId } from "./service-categories";
export interface ServiceItem {
  id: string;
  category: string;
  group: "web" | "growth";
  name: string;
  desc: string;
}
export const SERVICES: ServiceItem[] = serviceCategories.flatMap((c) =>
  c.items.map((name, i) => ({
    id: serviceId(c.id, i),
    category: c.id,
    group: c.id === "social-media-marketing-branding" ? "growth" : "web",
    name,
    desc: c.description,
  })),
);
