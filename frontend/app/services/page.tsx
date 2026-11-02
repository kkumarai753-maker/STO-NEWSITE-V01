import { CategorySections } from "@/components/services/category-sections";
import { PageHero } from "@/components/ui/page-hero";
import { PageSchema } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/services");
export default function ServicesPage() {
  return (
    <>
      <PageSchema path="/services" />
      <PageHero
        path="/services"
        eyebrow="Our services"
        title="Four categories. A clear place to start."
        lead="Choose a category to explore its dedicated service page, or select services across categories in Build Your Proposal."
      />
      <CategorySections />
    </>
  );
}
