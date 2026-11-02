import Link from "next/link";
import { ButtonArrow } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { industries } from "@/data/industries";
import { differentiators } from "@/data/why-us";
import { MetricsBand } from "./metrics-band";

/**
 * Why choose us, a light glow band (Server Component). Differentiators as
 * glass cards with icon tiles, then the metrics and the industries we serve.
 */
export function WhyUsSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="theme-glow section-y relative isolate overflow-hidden">
      {/* A soft blue glow in the corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 -z-1 size-[40rem] rounded-full"
        style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--sun) 12%, transparent), transparent)" }}
      />

      <div className="container-page relative z-1">
        <SectionHeading
          id="about-title"
          layout="split"
          eyebrow="Why choose us"
          title={
            <>
              Engineering with <em>business impact.</em>
            </>
          }
          description="Most small businesses lose time coordinating freelancers, agencies and software vendors. We bring the essential pieces together with clear scope and practical support."
        >
          <Link
            href="/why-us"
            className="group/button mt-6 inline-flex items-center gap-2 rounded-sm text-[0.9375rem] font-medium text-text underline decoration-line-strong underline-offset-[0.35em] transition-colors hover:text-primary hover:decoration-primary"
          >
            How we compare
            <ButtonArrow />
          </Link>
        </SectionHeading>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {differentiators.map((item, i) => {
            const Icon = item.icon;
            return (
              <li
                key={item.id}
                data-reveal=""
                style={{ "--reveal-delay": `${(i % 3) * 80}ms` } as React.CSSProperties}
                className="group glass-card glass-hover rounded-3xl p-7 sm:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <span aria-hidden className="icon-tile size-12">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="label-mono text-faint numeric">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-6 text-heading-3 text-text">{item.title}</h3>
                <p className="mt-2 max-w-xs text-[0.9375rem] leading-relaxed text-text-muted">{item.description}</p>
              </li>
            );
          })}
        </ul>

        <MetricsBand />

        <div id="industries" className="mt-20 grid gap-6 lg:grid-cols-12 lg:items-baseline" data-reveal="">
          <h3 className="label-mono text-subtle lg:col-span-3">Industries we work with</h3>
          <ul className="flex flex-wrap gap-2 lg:col-span-9">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <li
                  key={industry.id}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-2 text-sm text-text-muted backdrop-blur transition-colors hover:border-primary/40 hover:bg-primary-light hover:text-text"
                >
                  <Icon className="size-4 text-accent" strokeWidth={1.75} aria-hidden />
                  {industry.name}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
