import Link from "next/link";
import { PageSchema } from "@/components/seo/json-ld";
import { ServiceLinks } from "@/components/services/service-links";
import { ServicesCatalogClient } from "@/components/services/services-catalog-client";
import { Button, ButtonArrow } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { SERVICES } from "@/data/services-catalog";
import { catalogJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/services");

const FACTS = [
  { value: String(SERVICES.length), label: "services across two divisions" },
  { value: "Free", label: "first consultation" },
  { value: "10 · 50 · 40", label: "milestone payments, in %" },
];

export default function ServicesPage() {
  return (
    <>
      <PageSchema path="/services" type="CollectionPage" nodes={[catalogJsonLd("/services")]} />
      <PageHero
        eyebrow="Service catalog"
        path="/services"
        title={
          <>
            Our <em>services.</em>
          </>
        }
        lead="Every service we offer, across Web & Technology and Digital Marketing & Growth. Each project is scoped with you and confirmed in a written quotation after a free consultation."
        actions={
          <>
            <Button asChild size="lg">
              <a href="#catalog">
                View services
                <ButtonArrow className="rotate-90 group-hover/button:translate-x-0 group-hover/button:translate-y-0.5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/inquiry">Book a free consultation</Link>
            </Button>
          </>
        }
        aside={
          <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6 lg:grid-cols-1 lg:gap-0 lg:border-t-0 lg:pt-0">
            {FACTS.map((f) => (
              <div key={f.label} className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between lg:gap-6 lg:border-b lg:border-line lg:py-5 lg:first:border-t">
                <dt className="order-2 mt-2 text-xs text-text-muted sm:text-sm lg:mt-0">{f.label}</dt>
                <dd className="order-1 font-display text-xl tracking-[-0.02em] whitespace-nowrap text-text numeric sm:text-3xl">{f.value}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <ServiceLinks
        id="service-pages-title"
        title={
          <>
            AI, software and growth services, <em>explained.</em>
          </>
        }
        description="What each service covers and how projects work."
      />

      <section id="catalog" aria-label="All services" className="section-y-sm">
        <ServicesCatalogClient />
      </section>
    </>
  );
}
