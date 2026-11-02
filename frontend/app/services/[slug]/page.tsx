import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CircleCheck, Clock } from "lucide-react";
import { FaqList } from "@/components/faq/faq-list";
import { PageSchema } from "@/components/seo/json-ld";
import { ServiceLinks } from "@/components/services/service-links";
import { Button, ButtonArrow } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPage } from "@/config/pages";
import { faqById } from "@/data/faq";
import { projectSteps } from "@/data/process";
import { getServicePage, servicePages } from "@/data/service-pages";
import { faqJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

/** Every service page is prerendered; unknown slugs are a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  if (!getServicePage(slug)) notFound();
  return pageMetadata(`/services/${slug}`, { ownImage: true });
}

const linkClass =
  "font-medium text-text underline decoration-line-strong underline-offset-[0.3em] transition-colors hover:decoration-accent";

/**
 * Service page template (Server Component), answer-first: the H1 and a direct
 * two-to-three sentence answer, then what the service is, what it covers,
 * examples, process, limitations, FAQs and related services. All copy
 * comes from data/service-pages.ts and data/faq.ts.
 */
export default async function ServicePageRoute({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) notFound();

  const path = `/services/${service.slug}`;
  const faqs = service.faqIds.map(faqById);
  const [before, after] = service.heading.text.split(service.heading.accent);

  return (
    <>
      <PageSchema path={path} nodes={[serviceJsonLd(service), faqJsonLd(faqs, path)]} />
      <PageHero
        eyebrow={service.eyebrow}
        path={path}
        showUpdated
        title={
          <>
            {before}
            <em>{service.heading.accent}</em>
            {after}
          </>
        }
        lead={service.answer}
        actions={
          <>
            <Button asChild size="lg">
              <Link href={`/inquiry?service=${encodeURIComponent(service.name)}`}>
                Book a free consultation
                <ButtonArrow />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#included">What&apos;s included</a>
            </Button>
          </>
        }
      />

      {/* What it is */}
      <section aria-labelledby="explainer-title" className="section-y-sm">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
          <h2 id="explainer-title" className="text-heading-1 text-text lg:col-span-5">
            {service.explainer.heading}
          </h2>
          <div className="space-y-5 text-lead text-text-muted lg:col-span-7">
            {service.explainer.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        {service.table ? (
          <div className="container-page mt-14">
            <div className="glass-card overflow-x-auto rounded-3xl">
              <table className="w-full min-w-[36rem] border-collapse text-left text-[0.9375rem]">
                <caption className="border-b border-line bg-white/60 px-5 py-3 text-left text-sm font-medium text-text">
                  {service.table.caption}
                </caption>
                <thead>
                  <tr className="border-b border-line">
                    {service.table.columns.map((c, i) => (
                      <th key={c || i} scope="col" className="px-5 py-4 label-mono text-subtle">
                        {c || <span className="sr-only">Aspect</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {service.table.rows.map(([head, ...cells]) => (
                    <tr key={head} className="border-b border-line last:border-b-0">
                      <th scope="row" className="px-5 py-4 font-medium text-text">
                        {head}
                      </th>
                      {cells.map((cell, i) => (
                        <td key={i} className="px-5 py-4 text-text-muted">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </section>

      {/* What we offer */}
      <section id="included" aria-labelledby="offerings-title" className="section-y-sm scroll-mt-[var(--nav-height)] bg-surface">
        <div className="container-page">
          <h2 id="offerings-title" className="text-heading-1 text-text">
            {service.offerings.heading}
          </h2>
          {/* Cells draw their own right/bottom borders; the list clips the outer ones, so a short last row leaves no filler. */}
          <ul className="glass-card mt-12 grid overflow-hidden rounded-3xl sm:grid-cols-2 lg:grid-cols-3">
            {service.offerings.items.map((item) => (
              <li key={item.title} className="-mr-px -mb-px border-r border-b border-line p-6 sm:p-7">
                <h3 className="text-heading-3 text-text">{item.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-text-muted">{item.desc}</p>
                {item.href ? (
                  <p className="mt-3 text-sm">
                    <Link href={item.href} className={`inline-flex items-center gap-1 ${linkClass}`}>
                      {getPage(item.href).label}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </Link>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Examples */}
      {service.examples ? (
        <section aria-labelledby="examples-title" className="section-y-sm">
          <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 id="examples-title" className="text-heading-1 text-text">
                {service.examples.heading}
              </h2>
              {service.examples.intro ? <p className="mt-4 text-text-muted">{service.examples.intro}</p> : null}
            </div>
            {(() => {
              const List = service.examples.ordered ? "ol" : "ul";
              return (
                <List className="border-t border-line lg:col-span-7">
                  {service.examples.items.map((item, i) => (
                    <li key={item} className="flex items-start gap-4 border-b border-line py-4 text-text-muted">
                      <span className="mt-0.5 w-6 shrink-0 font-mono text-xs text-accent numeric">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </List>
              );
            })()}
          </div>
        </section>
      ) : null}

      {/* Process */}
      <section aria-labelledby="process-title" className="section-y-sm">
        <div className="container-page">
          <SectionHeading
            id="process-title"
            layout="split"
            eyebrow="Process"
            title={
              <>
                How a project <em>works.</em>
              </>
            }
            description="Four steps, each ending with something you can see and approve."
          >
            <Link href="/how-we-work" className={`mt-4 inline-block text-sm ${linkClass}`}>
              Read the full process
            </Link>
          </SectionHeading>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line shadow-(--glass-shadow) md:grid-cols-2 lg:grid-cols-4">
            {projectSteps.map((step) => (
              <li key={step.num} className="flex flex-col bg-bg p-6">
                <span className="font-mono text-xs text-accent numeric">{step.num}</span>
                <h3 className="mt-3 text-heading-3 text-text">{step.title}</h3>
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-subtle">
                  <Clock className="size-3.5" aria-hidden />
                  {step.timeline}
                </p>
                <p className="mt-3 flex items-start gap-2 text-sm text-text-muted">
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  {step.deliverable}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Considerations, limitations and data handling */}
      <section aria-labelledby="considerations-title" className="section-y-sm bg-surface">
        <div className="container-page">
          <h2 id="considerations-title" className="text-heading-1 text-text">
            {service.considerations.heading}
          </h2>
          <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {service.considerations.items.map((item) => (
              <li key={item.title} className="border-t border-line-strong pt-6">
                <h3 className="text-heading-3 text-text">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-text-muted">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQs */}
      <section aria-labelledby="service-faq-title" className="section-y-sm">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 id="service-faq-title" className="text-heading-1 text-text">
              Questions about {service.name}
            </h2>
            <p className="mt-4 text-sm">
              <Link href="/faq" className={linkClass}>
                All frequently asked questions
              </Link>
            </p>
          </div>
          <div className="lg:col-span-8">
            <FaqList items={faqs} name={`faq-${service.slug}`} />
          </div>
        </div>
      </section>

      <ServiceLinks
        id="related-title"
        eyebrow="Related"
        slugs={service.related}
        title={
          <>
            Related <em>services.</em>
          </>
        }
        className="bg-surface"
      />
    </>
  );
}
