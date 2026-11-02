import type { ReactNode } from "react";
import { ContactForm } from "./contact-form";

/**
 * Body shared by the pages built around the contact form (contact, inquiry,
 * register, feedback): context on the left, the form on the right.
 * Server Component; the form is the client island.
 */
export function FormPageBody({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Left-column content under the intro (steps, contact details …). */
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="section-y-sm">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--nav-height)+2rem)]">
            <h2 id={id} className="text-heading-2 text-text">
              {title}
            </h2>
            {intro ? <p className="mt-4 max-w-md leading-relaxed text-text-muted">{intro}</p> : null}
            {children ? <div className="mt-10">{children}</div> : null}
          </div>
        </div>
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

/** Numbered "what happens next" list for the form pages. */
export function NextSteps({
  steps,
  current,
}: {
  steps: { title: string; desc?: string }[];
  /** Index of the step the visitor is on (highlighted). */
  current?: number;
}) {
  return (
    <ol className="border-t border-line">
      {steps.map((step, i) => {
        const active = i === current;
        return (
          <li key={step.title} className="flex gap-5 border-b border-line py-5">
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full border font-mono text-xs numeric ${
                active ? "border-sun bg-sun text-on-sun" : "border-line-strong text-text-muted"
              }`}
              aria-hidden
            >
              {i + 1}
            </span>
            <div>
              <p className="font-medium text-text">
                {step.title}
                {active ? <span className="sr-only"> (you are here)</span> : null}
              </p>
              {step.desc ? <p className="mt-1 text-sm leading-relaxed text-text-muted">{step.desc}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
