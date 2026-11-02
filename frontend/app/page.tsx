import { Hero } from "@/components/hero/hero";
import { CallbackSection } from "@/components/callback/callback-section";
import { TemplateGallery } from "@/components/templates/template-gallery";
import { CategorySections } from "@/components/services/category-sections";
import { PartnershipSection } from "@/components/home/partnership-section";
import { FaqSection } from "@/components/faq/faq-section";
import { ContactSection } from "@/components/contact/contact-section";
import { PageSchema } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/", { ownImage: true });
export const maxDuration = 60;
export default function HomePage() {
  return (
    <>
      <PageSchema path="/" />
      <Hero />
      <CategorySections />
      <TemplateGallery />
      <CallbackSection />
      <PartnershipSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
