import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { services } from "@/data/services";
import { AutomationMiniVisual } from "./service-visuals";

/**
 * Capabilities beyond the website (Server Component).
 * An editorial index rather than a card grid: the heading and a small live
 * automation example stay pinned on the left while the list scrolls past on
 * the right. Each row opens its dedicated service category page.
 */
export function ServicesSection() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-y section-white relative">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--nav-height)+3rem)]">
            <SectionHeading
              id="services-title"
              eyebrow="Automation & software"
              title={
                <>
                  Technology that solves <em>real</em> business problems.
                </>
              }
              description="Beyond the website: the systems that answer customers, move data and take repetitive work off your team."
            />
            <div className="glass-card mt-10 hidden rounded-3xl p-5 sm:block" data-reveal="">
              <p className="mb-4 label-mono text-accent">How an automation runs</p>
              <AutomationMiniVisual />
            </div>
          </div>
        </div>

        <ol className="grid gap-4 lg:col-span-7">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <li
                key={service.id}
                data-reveal=""
                style={{ "--reveal-delay": `${(i % 4) * 60}ms` } as React.CSSProperties}
              >
                <a
                  href={service.href}
                  className="group glass-card glass-hover grid grid-cols-[auto_1fr_auto] items-start gap-x-4 gap-y-1 rounded-[1.25rem] p-5 sm:gap-x-6 sm:p-7"
                >
                  <span aria-hidden className="icon-tile size-11">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-3">
                      <span className="label-mono text-subtle numeric">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-heading-3 font-semibold text-text transition-colors group-hover:text-brand">
                        {service.title}
                      </span>
                    </span>
                    <span className="mt-2 block max-w-lg text-[0.9375rem] leading-relaxed text-text-muted">
                      {service.description}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="grid size-10 place-items-center rounded-full border border-line-strong bg-white/70 text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary group-hover:shadow-(--shadow-primary)"
                  >
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-px group-hover:-translate-y-px" />
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
