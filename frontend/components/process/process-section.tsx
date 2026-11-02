import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/data/process";

/**
 * From idea to production, a timeline in two rows of four (Server Component).
 * Each step is a glass card on a blue rail with a glowing node; the rail
 * draws itself as the step is revealed (CSS only).
 */
export function ProcessSection() {
  return (
    <section id="process" aria-labelledby="process-title" className="section-y section-white relative">
      <div className="container-page">
        <SectionHeading
          id="process-title"
          layout="split"
          eyebrow="Process"
          title={
            <>
              From idea to <em>production.</em>
            </>
          }
          description="A simple, step-by-step process, you see progress every week."
        />

        <ol className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <li
              key={step.number}
              data-reveal=""
              style={{ "--reveal-delay": `${(i % 4) * 110}ms` } as React.CSSProperties}
              className="group relative pt-8"
            >
              {/* Rail + node */}
              <span aria-hidden className="absolute top-0 right-0 left-0 h-px bg-line-strong">
                <span
                  className="block h-full origin-left scale-x-0 bg-sun transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-revealed:scale-x-100"
                  style={{ transitionDelay: `${(i % 4) * 110 + 300}ms` }}
                />
              </span>
              <span
                aria-hidden
                className="absolute -top-[5px] left-6 size-[11px] rounded-full border-2 border-white bg-sun shadow-[0_0_0_4px_rgb(21_101_240/0.15)]"
              />

              <div className="glass-card glass-hover h-full rounded-3xl p-6">
                <span className="icon-tile size-12 font-display text-lg numeric">{step.number}</span>
                <h3 className="mt-5 text-heading-3 text-text">{step.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-text-muted">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
