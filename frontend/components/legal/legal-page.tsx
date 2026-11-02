import { TriangleAlert } from "lucide-react";
import { PageSchema } from "@/components/seo/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import { getPage } from "@/config/pages";

export type LegalSection = { heading: string; body: string[] };

/**
 * Shared layout for legal documents (Server Component): night masthead with
 * breadcrumb and "Last updated" date (both from config/pages.ts), structured
 * data, a sticky table of contents and a readable prose column.
 */
export function LegalPage({ path, intro, sections }: { path: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      <PageSchema path={path} />
      <PageHero eyebrow="Legal" size="md" path={path} title={getPage(path).label} lead={intro} showUpdated />

      <div className="section-y-sm">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
          <nav aria-label="On this page" className="lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--nav-height)+2rem)]">
              <p className="label-mono text-subtle">On this page</p>
              <ol className="mt-5 space-y-1 border-l border-line">
                {sections.map((section, i) => (
                  <li key={section.heading}>
                    <a
                      href={`#legal-${i}`}
                      className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-text-muted transition-colors hover:border-accent hover:text-text"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="lg:col-span-8 lg:col-start-5">
            {/* TODO(owner): have these policies reviewed by legal counsel, then remove this notice. */}
            <div role="note" className="alert border-warning/30 bg-warning/8 text-warning">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              <p>
                Template content. Review and adapt this document with qualified legal counsel before
                publishing. It is not legal advice.
              </p>
            </div>

            <div className="mt-14 space-y-14">
              {sections.map((section, i) => (
                <section key={section.heading} aria-labelledby={`legal-${i}`}>
                  <h2 id={`legal-${i}`} className="text-heading-2 text-text">
                    <span className="mr-3 align-middle font-mono text-sm text-accent numeric">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {section.heading}
                  </h2>
                  <div className="prose-body mt-5">
                    {section.body.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
