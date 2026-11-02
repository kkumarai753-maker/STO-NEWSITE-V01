import Link from "next/link";
import { Megaphone, Palette, Search, Video } from "lucide-react";
import { DivisionHighlights, type Highlight } from "@/components/divisions/division-highlights";
import { PageSchema } from "@/components/seo/json-ld";
import { ServiceLinks } from "@/components/services/service-links";
import { ServicesCatalogClient } from "@/components/services/services-catalog-client";
import { Button, ButtonArrow } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { catalogJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/digital-growth");

const GROWTH_HIGHLIGHTS: Highlight[] = [
  {
    icon: Palette,
    title: "Brand & Logo Identity",
    desc: "Complete visual identities, professional logos, and guidelines tailored to your market.",
  },
  {
    icon: Video,
    title: "Social Media & Reel Editing",
    desc: "Hook-driven reel editing, sound design, content calendars, and multi-platform publishing.",
  },
  {
    icon: Megaphone,
    title: "Meta & Google Ads",
    desc: "Targeted paid campaigns, monitored and optimised for return on ad spend (ROAS).",
  },
  {
    icon: Search,
    title: "Local SEO & Funnels",
    desc: "Google Business optimization, local search rankings, and automated lead capture funnels.",
  },
];

export default function DigitalGrowthPage() {
  return (
    <>
      <PageSchema path="/digital-growth" type="CollectionPage" nodes={[catalogJsonLd("/digital-growth", "growth")]} />
      <PageHero
        index="02"
        eyebrow="Division · Growth"
        path="/digital-growth"
        title={
          <>
            Digital marketing, SEO <em>& growth.</em>
          </>
        }
        lead="Branding, social media, reels and video, Meta and Google Ads, local SEO and lead funnels for small businesses."
        actions={
          <>
            <Button asChild size="lg">
              <a href="#catalog">
                View solutions
                <ButtonArrow className="rotate-90 group-hover/button:translate-x-0 group-hover/button:translate-y-0.5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/inquiry">Plan my growth</Link>
            </Button>
          </>
        }
      />

      <DivisionHighlights items={GROWTH_HIGHLIGHTS} tone="accent" label="What the growth division covers" />

      <ServiceLinks
        id="growth-services-title"
        slugs={["seo", "ai-chatbots", "whatsapp-automation"]}
        title={
          <>
            Growth services, <em>in detail.</em>
          </>
        }
        description="Local SEO, plus the automation that turns new enquiries into conversations."
      />

      <section id="catalog" aria-label="Services" className="section-y-sm">
        <ServicesCatalogClient initialGroup="growth" />
      </section>
    </>
  );
}
