import Link from "next/link";
import { FaqList } from "@/components/faq/faq-list";
import { PageSchema } from "@/components/seo/json-ld";
import { BrandIcon } from "@/components/ui/brand-icon";
import { Button, ButtonArrow } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { whatsappHref } from "@/config/site";
import { faqs, faqTopics } from "@/data/faq";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/faq");

/**
 * FAQ hub (Server Component). Every question from data/faq.ts, grouped by
 * topic; all answers are in the HTML and mirrored in the FAQPage markup.
 */
export default function FaqPage() {
  const whatsapp = whatsappHref("Hi, I have a question about Sunrise Tech Origin.");
  const groups = faqTopics
    .map((topic) => ({ ...topic, items: faqs.filter((f) => f.topic === topic.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageSchema path="/faq" nodes={[faqJsonLd(faqs, "/faq")]} />
      <PageHero
        eyebrow="Help centre"
        size="md"
        path="/faq"
        showUpdated
        title={
          <>
            Frequently asked <em>questions.</em>
          </>
        }
        lead="Straight answers about our AI, software and marketing services, payments, timelines, ownership and support."
      >
        <nav aria-label="FAQ topics" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <li key={g.id}>
                <a
                  href={`#topic-${g.id}`}
                  className="inline-flex rounded-full border border-line-strong px-3.5 py-2 text-sm text-text-muted transition-colors hover:border-text/30 hover:text-text"
                >
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <div className="section-y-sm">
        <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-16 lg:col-span-8">
            {groups.map((g) => (
              <section
                key={g.id}
                id={`topic-${g.id}`}
                aria-labelledby={`topic-${g.id}-title`}
                className="scroll-mt-[calc(var(--nav-height)+1.5rem)]"
              >
                <h2 id={`topic-${g.id}-title`} className="mb-4 text-heading-2 text-text">
                  {g.title}
                </h2>
                <FaqList items={g.items} name={`faq-${g.id}`} numbered openFirst={false} />
              </section>
            ))}
          </div>

          <aside aria-labelledby="still-title" className="lg:col-span-4">
            <div className="theme-glow relative isolate overflow-hidden rounded-3xl border border-line p-8 shadow-(--glass-shadow) lg:sticky lg:top-[calc(var(--nav-height)+2rem)]">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -bottom-28 -z-1 size-72 rounded-full"
                style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--sun) 26%, transparent), transparent)" }}
              />
              <p className="label-mono text-text-muted">Still have questions?</p>
              <h2 id="still-title" className="mt-4 text-heading-2 text-text">
                Ask the <em>team</em> directly.
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-text-muted">
                We&apos;re happy to answer specific technical requirements, quotations, or
                custom scopes.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <Button asChild size="lg">
                  <Link href="/inquiry">
                    Book a Consultation
                    <ButtonArrow />
                  </Link>
                </Button>
                {whatsapp ? (
                  <Button asChild size="lg" variant="outline">
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                      <BrandIcon slug="whatsapp" className="size-4" />
                      Ask on WhatsApp
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
