import { SERVICES } from "@/data/services-catalog";
import { serviceCategories } from "@/data/service-categories";
export function proposalMessage(ids: string[], brief: string) {
  const selected = new Set(ids);
  if (!selected.size || ids.some((id) => !SERVICES.some((s) => s.id === id)))
    throw new Error("Please select valid services.");
  if (brief.length > 1500)
    throw new Error("Please keep your brief under 1,500 characters.");
  return (
    "Build Your Proposal\n\n" +
    serviceCategories
      .flatMap((c) => {
        const items = SERVICES.filter(
          (s) => s.category === c.id && selected.has(s.id),
        );
        return items.length
          ? [c.name + "\n" + items.map((s) => "- " + s.name).join("\n")]
          : [];
      })
      .join("\n\n") +
    "\n\nProject brief:\n" +
    brief
  );
}
