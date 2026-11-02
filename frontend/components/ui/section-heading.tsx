import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Section header (Server Component): eyebrow, display title, optional intro.
 *  - layout="stacked": eyebrow, title and intro in one column (default).
 *  - layout="split":   title on the left, intro in the right column on lg ,
 *    the editorial pattern used for most day sections.
 * Wrap the accent word of a title in <em> to set it in the accent tone (same face, same weight).
 * Reveal animation is handled by the page-level observer.
 */
export function SectionHeading({
  eyebrow,
  index,
  title,
  description,
  align = "left",
  layout = "stacked",
  id,
  className,
  children,
}: {
  eyebrow: string;
  /** Optional chapter number shown before the eyebrow, e.g. "02". */
  index?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  layout?: "stacked" | "split";
  /** id for the h2 so the parent section can use aria-labelledby */
  id?: string;
  className?: string;
  /** Extra content under the intro (e.g. a link). */
  children?: ReactNode;
}) {
  const heading = (
    <>
      <Eyebrow index={index} data-reveal="">
        {eyebrow}
      </Eyebrow>
      <h2
        id={id}
        data-reveal=""
        style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
        className="mt-4 text-heading-1 text-text"
      >
        {title}
      </h2>
    </>
  );

  const intro =
    description || children ? (
      <div data-reveal="" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
        {description ? <p className="text-lead text-text-muted">{description}</p> : null}
        {children}
      </div>
    ) : null;

  if (layout === "split") {
    return (
      <div className={cn("grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12", className)}>
        <div className="lg:col-span-7">{heading}</div>
        {intro ? <div className="max-w-xl lg:col-span-5 lg:justify-self-end lg:pb-1.5">{intro}</div> : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "max-w-3xl items-start",
        className,
      )}
    >
      {heading}
      {intro ? <div className="mt-5 max-w-2xl">{intro}</div> : null}
    </div>
  );
}

/**
 * Eyebrow label above headings: 13px uppercase, 0.12em tracking, primary blue,
 * e.g. "02 · OUR EXPERTISE". Used above headings and as the admin page kicker.
 */
export function Eyebrow({
  children,
  index,
  className,
  ...props
}: {
  children: ReactNode;
  index?: string;
  className?: string;
} & React.HTMLAttributes<HTMLParagraphElement> & { "data-reveal"?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2.5 label-mono text-accent", className)} {...props}>
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_18%,transparent)]" />
      {index ? (
        <span className="numeric opacity-70">
          {index}
          <span className="sr-only">, </span>
        </span>
      ) : null}
      <span>{children}</span>
    </p>
  );
}
