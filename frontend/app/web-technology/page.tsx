import Link from "next/link";
import { Database, Globe, Server, ShieldCheck } from "lucide-react";
import { DivisionHighlights, type Highlight } from "@/components/divisions/division-highlights";
import { PageSchema } from "@/components/seo/json-ld";
import { ServiceLinks } from "@/components/services/service-links";
import { ServicesCatalogClient } from "@/components/services/services-catalog-client";
import { Button, ButtonArrow } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { catalogJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/web-technology");

const TECH_HIGHLIGHTS: Highlight[] = [
  {
    icon: Globe,
    title: "Websites & Web Apps",
    desc: "Fast, responsive and conversion-focused websites custom-crafted for high performance.",
  },
  {
    icon: Server,
    title: "Domain, SSL & Cloud Hosting",
    desc: "Complete setup and deployment, with every account registered to your business.",
  },
  {
    icon: Database,
    title: "CRM & Workflow Automation",
    desc: "Lead capture pipelines, WhatsApp notifications, calendar booking and integrations.",
  },
  {
    icon: ShieldCheck,
    title: "Continuous Maintenance & Care",
    desc: "Backups, security updates, content changes and technical monitoring.",
  },
];

export default function WebTechnologyPage() {
  return (
    <>
      <PageSchema path="/web-technology" type="CollectionPage" nodes={[catalogJsonLd("/web-technology", "web")]} />
      <PageHero
        index="01"
        eyebrow="Division · Technology"
        path="/web-technology"
        title={
          <>
            Web development & <em>technology</em> solutions.
          </>
        }
        lead="Websites, web and mobile apps, AI integration and automation, and business software such as CRM, ERP and HRMS, from your first website and domain to systems that grow with your business."
        actions={
          <>
            <Button asChild size="lg">
              <a href="#catalog">
                View solutions
                <ButtonArrow className="rotate-90 group-hover/button:translate-x-0 group-hover/button:translate-y-0.5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/inquiry">Discuss a project</Link>
            </Button>
          </>
        }
      />

      <DivisionHighlights items={TECH_HIGHLIGHTS} label="What the technology division covers" />

      <ServiceLinks
        id="web-services-title"
        division="web"
        title={
          <>
            Technology services, <em>in detail.</em>
          </>
        }
        description="AI development and automation, websites, custom software and business systems: what each covers."
      />

      <section id="catalog" aria-label="Services" className="section-y-sm">
        <ServicesCatalogClient initialGroup="web" />
      </section>
    </>
  );
}
