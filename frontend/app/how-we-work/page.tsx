import Link from "next/link";
import { CircleCheck, Clock } from "lucide-react";
import { PageSchema } from "@/components/seo/json-ld";
import { Button, ButtonArrow } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { projectSteps } from "@/data/process";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/how-we-work");

/** Milestone payments. `share` drives the width of each segment in the bar. */
const PAYMENTS = [
  {
    share: 10,
    title: "Booking token",
    desc: "Locks in your project schedule and kicks off requirement mapping.",
  },
  {
    share: 50,
    title: "Strategy & execution",
    desc: "Activates full build, asset creation, and staging development.",
  },
  {
    share: 40,
    title: "Final handover",
    desc: "Completed after final review before full ownership and access release.",
  },
];

const SEGMENT = ["bg-gold", "bg-sun", "bg-ember-deep"];

export default function HowWeWorkPage() {
  return (
    <>
      <PageSchema path="/how-we-work" />
      <PageHero
        eyebrow="Our process"
        path="/how-we-work"
        title={
          <>
            How we work: clear milestones, <em>no hidden confusion.</em>
          </>
        }
        lead="Every project moves through a documented, predictable path from discovery to complete ownership handover with transparent milestone payments."
      />

      {/* Payment model */}
      <section aria-labelledby="payments-title" className="section-y bg-surface">
        <div className="container-page">
          <SectionHeading
            id="payments-title"
            layout="split"
            eyebrow="Payment model"
            title={
              <>
                Pay as the work <em>progresses.</em>
              </>
            }
            description="Three milestone payments, each tied to a visible stage of your project."
          />

          <figure className="mt-16" data-reveal="">
            {/* Proportional bar: each segment's width is its share of the total */}
            <div
              className="flex h-3 overflow-hidden rounded-full bg-surface-2"
              role="img"
              aria-label="Payments: 10% booking token, 50% strategy and execution, 40% final handover"
            >
              {PAYMENTS.map((p, i) => (
                <span
                  key={p.title}
                  className={`${SEGMENT[i]} h-full border-r-2 border-surface last:border-r-0`}
                  style={{ width: `${p.share}%` }}
                />
              ))}
            </div>

            <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-10">
              {PAYMENTS.map((p, i) => (
                <li key={p.title} className="min-w-0">
                  <span className="flex items-baseline gap-3">
                    <span className="font-display text-[clamp(3rem,2.2rem+2.4vw,4.5rem)] leading-none tracking-[-0.04em] text-text numeric">
                      {p.share}%
                    </span>
                    <span aria-hidden className={`size-2 rounded-full ${SEGMENT[i]}`} />
                  </span>
                  <h3 className="mt-4 text-heading-3 text-text">{p.title}</h3>
                  <p className="mt-2 max-w-xs text-[0.9375rem] leading-relaxed text-text-muted">{p.desc}</p>
                </li>
              ))}
            </ol>
            <figcaption className="sr-only">Milestone payment schedule</figcaption>
          </figure>
        </div>
      </section>

      {/* Steps */}
      <section aria-labelledby="steps-title" className="section-y">
        <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--nav-height)+3rem)]">
              <SectionHeading
                id="steps-title"
                eyebrow="Four steps"
                title={
                  <>
                    From first call to <em>handover.</em>
                  </>
                }
                description="Each step ends with something you can see and approve."
              />
              <div className="mt-10 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button asChild size="lg">
                  <Link href="/inquiry">
                    Start with step 1
                    <ButtonArrow />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/services">Explore Services</Link>
                </Button>
              </div>
            </div>
          </div>

          <ol className="relative lg:col-span-8">
            {/* Timeline spine */}
            <span aria-hidden className="absolute top-3 bottom-3 left-[1.1875rem] w-px bg-line-strong" />
            {projectSteps.map((step, i) => (
              <li
                key={step.num}
                data-reveal=""
                style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
                className="relative grid grid-cols-[2.5rem_1fr] gap-x-6 pb-14 last:pb-0 sm:gap-x-8"
              >
                <span className="relative z-1 grid size-10 place-items-center rounded-full border border-line-strong bg-bg font-mono text-xs text-accent numeric">
                  {step.num}
                </span>
                <div className="surface-card rounded-xl p-6 sm:p-8">
                  <p className="inline-flex items-center gap-2 label-mono text-subtle">
                    <Clock className="size-3.5" aria-hidden />
                    {step.timeline}
                  </p>
                  <h3 className="mt-4 text-heading-3 text-text">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-text-muted">{step.desc}</p>
                  <p className="mt-6 flex items-start gap-2.5 border-t border-line pt-5 text-sm text-text">
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                    <span>
                      <span className="text-text-muted">Deliverable: </span>
                      {step.deliverable}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
