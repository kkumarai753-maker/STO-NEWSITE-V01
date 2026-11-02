import { ContactSection } from "@/components/contact/contact-section";
import { FaqSection } from "@/components/faq/faq-section";
import { Hero } from "@/components/hero/hero";
import { PartnershipSection } from "@/components/home/partnership-section";
import { SolutionsSection } from "@/components/home/solutions-section";
import { ProductsSection } from "@/components/products/products-section";
import { PageSchema } from "@/components/seo/json-ld";
import { TestimonialsSection } from "@/components/testimonials/testimonials-section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/", { ownImage: true });
export const maxDuration = 60;

export default function HomePage() {
  return (
    <>
      <PageSchema path="/" />
      <Hero />
      <SolutionsSection />
      <ProductsSection />
      <PartnershipSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
