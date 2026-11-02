import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonArrow } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { homeFaqs } from "@/data/faq";
import { faqJsonLd } from "@/lib/seo";
import { FaqList } from "./faq-list";

/** Home FAQ (Server Component): pinned heading on the left, answers on the right. */
export function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y section-white relative">
      <JsonLd graph={[faqJsonLd(homeFaqs, "/")]} />
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--nav-height)+3rem)]">
            <SectionHeading
              id="faq-title"
              eyebrow="FAQ"
              title={
                <>
                  Questions, <em>answered.</em>
                </>
              }
              description="Straight answers about what we build and how we work."
            >
              <Link
                href="/faq"
                className="group/button mt-6 inline-flex items-center gap-2 rounded-sm text-[0.9375rem] font-medium text-text underline decoration-line-strong underline-offset-[0.35em] transition-colors hover:text-primary hover:decoration-primary"
              >
                All frequently asked questions
                <ButtonArrow />
              </Link>
            </SectionHeading>
          </div>
        </div>

        <div className="lg:col-span-8" data-reveal="">
          <FaqList items={homeFaqs} name="home-faq" />
        </div>
      </div>
    </section>
  );
}
