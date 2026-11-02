import Link from "next/link";
import { Check } from "lucide-react";
import { PageSchema } from "@/components/seo/json-ld";
import { Button, ButtonArrow } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/why-us");

const PILLARS = [
  {
    num: "01",
    title: "Small-business focus",
    desc: "Recommendations match your current stage, budget and next business goal without inflated scopes or unnecessary bloat.",
  },
  {
    num: "02",
    title: "Connected services",
    desc: "Website, marketing, leads and automation work as one system, eliminating the friction of coordinating different providers.",
  },
  {
    num: "03",
    title: "Transparent scope",
    desc: "A written quotation, milestones, deliverables and change controls before work begins. No surprise charges or hidden clauses.",
  },
  {
    num: "04",
    title: "Client ownership",
    desc: "Core accounts, domain names, hosting profiles and digital assets remain 100% under your business ownership and control.",
  },
  {
    num: "05",
    title: "Human support",
    desc: "Direct, understandable communication and transparent progress updates instead of gatekeeping or complex technical jargon.",
  },
  {
    num: "06",
    title: "Scalable foundation",
    desc: "Start lean with what your business needs today and expand your digital setup as your revenue and client base grow.",
  },
];

const COMPARISON = [
  {
    feature: "Single accountable partner",
    agencies: "Partial / complex account managers",
    freelancers: "No (multiple different freelancers)",
  },
  {
    feature: "100% client ownership of assets",
    agencies: "Often proprietary lock-in",
    freelancers: "Accounts registered under their email",
  },
  {
    feature: "Written quotation before work begins",
    agencies: "Hidden costs & retainers",
    freelancers: "Hourly scope creep",
  },
  {
    feature: "Connected tech + marketing stack",
    agencies: "Siloed departments",
    freelancers: "No integration between parts",
  },
  {
    feature: "Direct WhatsApp & call support",
    agencies: "Slow ticketing portals",
    freelancers: "Unreliable response times",
  },
];

function Yes() {
  return (
    <span className="inline-flex items-center gap-2 font-medium text-success">
      <span className="grid size-6 place-items-center rounded-full bg-success/10">
        <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
      </span>
      Yes
    </span>
  );
}

export default function WhyUsPage() {
  return (
    <>
      <PageSchema path="/why-us" />
      <PageHero
        eyebrow="Why choose us"
        path="/why-us"
        title={
          <>
            Why choose us: one partner, <em>clear ownership.</em>
          </>
        }
        lead="Designed for small businesses that need professional execution without agency confusion, slow coordination, or fragmented freelancers."
        actions={
          <Button asChild size="lg" variant="outline">
            <a href="#compare">
              See how we compare
              <ButtonArrow className="rotate-90 group-hover/button:translate-x-0 group-hover/button:translate-y-0.5" />
            </a>
          </Button>
        }
      />

      {/* Pillars */}
      <section aria-labelledby="pillars-title" className="section-y">
        <div className="container-page">
          <h2 id="pillars-title" className="sr-only">
            Six reasons businesses choose us
          </h2>
          <ol className="grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((pillar, i) => (
              <li
                key={pillar.num}
                data-reveal=""
                style={{ "--reveal-delay": `${(i % 3) * 80}ms` } as React.CSSProperties}
                className="border-t border-line-strong pt-8"
              >
                <span className="font-display text-[3.5rem] leading-none tracking-[-0.04em] text-accent numeric">
                  {pillar.num}
                </span>
                <h3 className="mt-6 text-heading-3 text-text">{pillar.title}</h3>
                <p className="mt-3 leading-relaxed text-text-muted">{pillar.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Comparison */}
      <section id="compare" aria-labelledby="compare-title" className="section-y bg-surface">
        <div className="container-page">
          <SectionHeading
            id="compare-title"
            layout="split"
            eyebrow="Comparison"
            title={
              <>
                How Sunrise <em>compares.</em>
              </>
            }
            description="Why growing businesses choose our practical, joined-up approach over fragmented alternatives."
          />

          {/* Desktop: a real table */}
          <div className="mt-16 hidden overflow-hidden rounded-xl border border-line md:block" data-reveal="">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                {siteConfig.name} compared with traditional agencies and freelancers
              </caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-[28%] px-6 py-5 label-mono text-subtle">
                    Capability
                  </th>
                  <th scope="col" className="w-[24%] bg-bg px-6 py-5 text-sm font-semibold text-text">
                    <span className="flex items-center gap-2">
                      <span aria-hidden className="size-1.5 rounded-full bg-sun" />
                      {siteConfig.name}
                    </span>
                  </th>
                  <th scope="col" className="px-6 py-5 text-sm font-medium text-text-muted">
                    Traditional agencies
                  </th>
                  <th scope="col" className="px-6 py-5 text-sm font-medium text-text-muted">
                    Freelancers
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b border-line last:border-b-0">
                    <th scope="row" className="px-6 py-5 text-[0.9375rem] font-medium text-text">
                      {row.feature}
                    </th>
                    <td className="bg-bg px-6 py-5">
                      <Yes />
                    </td>
                    <td className="px-6 py-5 text-[0.9375rem] text-text-muted">{row.agencies}</td>
                    <td className="px-6 py-5 text-[0.9375rem] text-text-muted">{row.freelancers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phones: one card per capability */}
          <ul className="mt-12 space-y-4 md:hidden">
            {COMPARISON.map((row) => (
              <li key={row.feature} className="surface-card rounded-lg p-6">
                <h3 className="text-base font-semibold text-text">{row.feature}</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 rounded-md bg-bg px-3 py-2.5">
                    <dt className="font-medium text-text">{siteConfig.shortName}</dt>
                    <dd>
                      <Yes />
                    </dd>
                  </div>
                  <div className="px-3">
                    <dt className="text-subtle">Traditional agencies</dt>
                    <dd className="mt-0.5 text-text-muted">{row.agencies}</dd>
                  </div>
                  <div className="px-3">
                    <dt className="text-subtle">Freelancers</dt>
                    <dd className="mt-0.5 text-text-muted">{row.freelancers}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/services">
                Explore Services
                <ButtonArrow />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/how-we-work">How we work</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
