import { SectionHeading } from "@/components/ui/section-heading";
import { productTabs, type ProductMockupId } from "@/data/products";
import { ContainerScroll } from "./container-scroll";
import { productMockups } from "./mockups";
import { ProductShowcase } from "./product-showcase";

/** Product mockups, realistic interfaces we design and engineer. */
export function ProductsSection() {
  const panels = Object.fromEntries(
    productTabs.map((tab) => {
      const Mockup = productMockups[tab.id];
      return [tab.id, <Mockup key={tab.id} />];
    }),
  ) as Record<ProductMockupId, React.ReactNode>;

  return (
    <section id="products" aria-labelledby="products-title" className="section-y relative overflow-hidden">
      <div className="container-page">
        <SectionHeading
          id="products-title"
          layout="split"
          eyebrow="Explore the possibilities"
          title={
            <>
              A little less admin.<br /><em>A lot more clarity.</em>
            </>
          }
          description="Explore illustrative interfaces for the tools we can build around your business. These are concepts, not client projects or live products."
        />
        <div className="mt-14 sm:mt-20">
          <ContainerScroll>
            <ProductShowcase tabs={productTabs} panels={panels} />
          </ContainerScroll>
        </div>
      </div>
    </section>
  );
}
