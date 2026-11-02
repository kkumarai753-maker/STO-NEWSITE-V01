import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { servicePages, type ServicePage } from "@/data/service-pages";
import { cn } from "@/lib/utils";

/**
 * Links to the dedicated service pages (Server Component): the hub → cluster
 * links that connect /services and the division pages to each service page.
 */
export function ServiceLinks({
  id,
  eyebrow = "Services in detail",
  title,
  description,
  division,
  slugs,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  division?: ServicePage["division"];
  /** Explicit list (in order); defaults to every page in the division. */
  slugs?: string[];
  className?: string;
}) {
  const items = slugs
    ? slugs.flatMap((slug) => servicePages.filter((s) => s.slug === slug))
    : servicePages.filter((s) => !division || s.division === division);
  if (items.length === 0) return null;

  return (
    <section aria-labelledby={id} className={cn("section-y-sm", className)}>
      <div className="container-page">
        <SectionHeading id={id} layout="split" eyebrow={eyebrow} title={title} description={description} />
        {/* Cells draw their own right/bottom borders; the list clips the outer ones, so a short last row leaves no filler. */}
        <ul className="mt-12 grid overflow-hidden rounded-xl border border-line bg-bg sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service) => (
            <li key={service.slug} className="-mr-px -mb-px border-r border-b border-line">
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col gap-2 p-6 transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus sm:p-7"
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="text-heading-3 font-semibold text-text group-hover:text-brand">{service.name}</span>
                  <ArrowUpRight
                    aria-hidden
                    className="mt-1 size-4 shrink-0 text-text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
                <span className="text-[0.9375rem] leading-relaxed text-text-muted">{service.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
