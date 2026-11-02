import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { PageSchema } from "@/components/seo/json-ld";
import { serviceCategories } from "@/data/service-categories";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/services");
export default function ServicesPage() {
  return (
    <>
      <PageSchema path="/services" />
      <PageHero
        path="/services"
        eyebrow="Made for your next chapter"
        title={
          <>
            Four services.
            <br />
            <em>Connected possibilities.</em>
          </>
        }
        lead="Explore the options below. Packages are shaped around your requirements, and prices are confirmed in a written quotation."
      />
      <section className="section-y-sm">
        <div className="container-page space-y-12">
          {serviceCategories.map((c) => (
            <article
              id={c.id}
              key={c.id}
              className="scroll-mt-28 rounded-3xl border border-line bg-white p-6 sm:p-10"
            >
              <p className="preview-kicker">
                {c.number} / {c.short}
              </p>
              <h2 className="mt-4 text-heading-2 text-text">{c.name}</h2>
              <p className="mt-4 max-w-2xl text-text-muted">{c.description}</p>
              <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                {c.items.map((item) => (
                  <li key={item} className="flex gap-2 text-text-muted">
                    <Check className="size-4 text-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 grid gap-3 md:grid-cols-2">
                {c.packages.map((p) => (
                  <div
                    key={p}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-[#f7faff] p-5"
                  >
                    <h3 className="text-sm font-semibold text-text">{p}</h3>
                    <span className="text-xs text-text-muted">
                      Quotation after scoping
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href={`/inquiry?service=${encodeURIComponent(c.name)}`}
                className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-6 text-sm font-semibold text-white"
              >
                Discuss {c.name}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
