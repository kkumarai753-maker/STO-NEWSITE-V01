import Link from "next/link";
import { Check, HeartHandshake, MapPin, Rocket, ShieldCheck, Target } from "lucide-react";
import { PageSchema } from "@/components/seo/json-ld";
import { ServiceLinks } from "@/components/services/service-links";
import { Button, ButtonArrow } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { emailHref, phoneHref, siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/about");

/**
 * The company at a glance, in plain statements AI assistants and search
 * engines can quote. Facts only; TODO(owner): add "Founded" (year) and
 * "Leadership" (founder name and title) rows once confirmed, and the
 * matching founder/foundingDate in organizationJsonLd().
 */
const AT_A_GLANCE: { term: string; detail: React.ReactNode }[] = [
  { term: "Who we are", detail: `${siteConfig.name} is a technology and digital growth company based in Nagpur, Maharashtra, India.` },
  { term: "What we do", detail: siteConfig.description },
  { term: "Who we work with", detail: siteConfig.audience },
  { term: "Where", detail: `Based in ${siteConfig.contact.location}, working with businesses across ${siteConfig.areaServed}.` },
  {
    term: "How we work",
    detail: (
      <>
        A written quotation before work begins, milestone payments of 10%, 50% and 40%, and full
        handover of code, accounts and credentials. <Link href="/how-we-work" className="font-medium text-text underline decoration-line-strong underline-offset-[0.3em] hover:decoration-accent">See how we work</Link>.
      </>
    ),
  },
  {
    term: "Contact",
    detail: (
      <>
        <a href={emailHref()} className="font-medium text-text underline decoration-line-strong underline-offset-[0.3em] hover:decoration-accent">{siteConfig.contact.email}</a>
        {phoneHref() ? (
          <>
            {" · "}
            <a href={phoneHref()!} className="font-medium text-text underline decoration-line-strong underline-offset-[0.3em] hover:decoration-accent">{siteConfig.contact.phone}</a>
          </>
        ) : null}
        {" · "}
        {siteConfig.contact.hours}
      </>
    ),
  },
];

const PRINCIPLES = [
  { title: "Clear scope", desc: "Transparent deliverables, milestone schedules, and responsibilities." },
  { title: "Connected execution", desc: "Website, marketing, reels, and automation engineered to work together." },
  { title: "Founder-friendly support", desc: "Direct explanations, WhatsApp access, and no unnecessary technical complexity." },
];

const VALUES = [
  {
    icon: Target,
    title: "Clear scope & accountability",
    desc: "Every project has documented deliverables, a written quotation, and specific timelines so founders know exactly what to expect.",
  },
  {
    icon: Rocket,
    title: "Connected digital systems",
    desc: "Websites, social content, paid ads, and automation workflows don't exist in silos. They work in tandem to acquire customers.",
  },
  {
    icon: HeartHandshake,
    title: "Founder-friendly communication",
    desc: "No jargon-heavy agency presentations. We explain concepts clearly so you maintain full understanding and confidence.",
  },
  {
    icon: ShieldCheck,
    title: "100% client asset ownership",
    desc: "We ensure all core digital assets, hosting, domains, and advertising accounts remain registered under your business ownership.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageSchema path="/about" type="AboutPage" />
      <PageHero
        eyebrow="Practical technology. Connected growth."
        path="/about"
        showUpdated
        title={
          <>
            About Sunrise Tech <em>Origin.</em>
          </>
        }
        lead={siteConfig.description}
        actions={
          <Button asChild size="lg" variant="outline">
            <Link href="/why-us">
              Why choose us
              <ButtonArrow />
            </Link>
          </Button>
        }
        aside={
          <dl className="border-t border-line">
            {[
              ["Based in", siteConfig.contact.location.split(",").slice(-3).join(",").trim()],
              ["Serves", `Businesses across ${siteConfig.areaServed}`],
              ["Service categories", "Website Development · Software Development · AI Automation & AI Agents · Social Media Marketing & Branding"],
              ["Ownership", "Your domain, hosting and accounts stay yours"],
              ["Hours", siteConfig.contact.hours],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line py-4 text-[0.9375rem]">
                <dt className="label-mono pt-0.5 text-subtle">{k}</dt>
                <dd className="text-text">{v}</dd>
              </div>
            ))}
          </dl>
        }
      />

      {/* At a glance: the plain facts */}
      <section aria-labelledby="glance-title" className="section-y-sm">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              id="glance-title"
              eyebrow="At a glance"
              title={
                <>
                  Who we are, <em>in brief.</em>
                </>
              }
            />
          </div>
          <dl className="border-t border-line lg:col-span-8">
            {AT_A_GLANCE.map((row) => (
              <div key={row.term} className="grid gap-2 border-b border-line py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="label-mono pt-1 text-subtle">{row.term}</dt>
                <dd className="leading-relaxed text-text-muted">{row.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Purpose */}
      <section aria-labelledby="purpose-title" className="section-y">
        <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--nav-height)+3rem)]">
              <SectionHeading
                id="purpose-title"
                eyebrow="Our purpose"
                title={
                  <>
                    Make professional digital execution <em>accessible.</em>
                  </>
                }
              />
              <p className="mt-8 flex items-start gap-3 text-sm text-text-muted">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                Based in {siteConfig.contact.location}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="space-y-5 text-lead text-text-muted" data-reveal="">
              <p>
                {siteConfig.name} combines website and software engineering with digital marketing,
                content production, and business automation.
              </p>
              <p>
                We translate business goals into clear, scalable digital systems that owners can easily
                understand, own, and scale as revenue grows.
              </p>
            </div>

            <ul className="mt-12 border-t border-line">
              {PRINCIPLES.map((p, i) => (
                <li
                  key={p.title}
                  data-reveal=""
                  style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
                  className="flex items-start gap-5 border-b border-line py-6"
                >
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                    <Check className="size-4" strokeWidth={2.25} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-heading-3 text-text">{p.title}</h3>
                    <p className="mt-1 text-text-muted">{p.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-title" className="section-y bg-surface">
        <div className="container-page">
          <SectionHeading
            id="values-title"
            layout="split"
            eyebrow="What guides our work"
            title={
              <>
                Built on transparency and <em>ownership.</em>
              </>
            }
            description="Built on transparency, client ownership, and practical execution."
          />

          <ol className="mt-16 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2">
            {VALUES.map((val, i) => {
              const Icon = val.icon;
              return (
                <li
                  key={val.title}
                  data-reveal=""
                  style={{ "--reveal-delay": `${(i % 2) * 80}ms` } as React.CSSProperties}
                  className="bg-surface p-8 sm:p-10"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-4xl leading-none tracking-[-0.03em] text-subtle numeric">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon className="size-6 text-accent" strokeWidth={1.5} aria-hidden />
                  </div>
                  <h3 className="mt-10 text-heading-3 text-text">{val.title}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-text-muted">{val.desc}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <ServiceLinks
        id="about-services-title"
        eyebrow="What we do"
        title={
          <>
            Our services, <em>in detail.</em>
          </>
        }
      />
    </>
  );
}
