import Link from "next/link";
import type { ReactNode } from "react";
import { LastUpdated } from "@/components/seo/last-updated";
import { breadcrumbTrail, getPage } from "@/config/pages";
import { cn } from "@/lib/utils";
import { Horizon } from "./horizon";
import { Eyebrow } from "./section-heading";

/**
 * Light glow masthead that opens every interior page (Server Component).
 * Breadcrumb (from the page registry, matching the page's BreadcrumbList
 * JSON-LD), eyebrow, display h1, lead, actions and an optional aside, over a
 * soft blue glow and orbit ring. The h1 is not animated so it paints
 * immediately (LCP).
 */
export function PageHero({
  eyebrow,
  index,
  title,
  lead,
  actions,
  aside,
  path,
  showUpdated = false,
  size = "lg",
  id = "page-title",
  className,
  children,
}: {
  eyebrow: string;
  index?: string;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  /** Right-hand column on lg screens (facts, highlights, contact options). */
  aside?: ReactNode;
  /** The page's path in config/pages.ts; drives the breadcrumb trail. */
  path: string;
  /** Show the page's "Last updated" date under the hero copy. */
  showUpdated?: boolean;
  /** "md" for utility pages (forms, legal) with a smaller title. */
  size?: "lg" | "md";
  id?: string;
  className?: string;
  /** Full-width content under the hero copy, above the horizon. */
  children?: ReactNode;
}) {
  const trail = breadcrumbTrail(path);

  return (
    <section
      aria-labelledby={id}
      className={cn(
        "theme-glow relative isolate overflow-hidden pt-[calc(var(--nav-height)+clamp(2rem,1.2rem+3.5vw,4.5rem))]",
        size === "lg" ? "pb-[clamp(4rem,2.8rem+4vw,6.25rem)]" : "pb-[clamp(3.5rem,2.6rem+3vw,5rem)]",
        className,
      )}
    >
      <Horizon />
      {/* Decorative orbit ring in the top-right corner */}
      <div aria-hidden className="pointer-events-none absolute top-[12%] -right-[12rem] -z-1 hidden size-[34rem] [perspective:1000px] md:block">
        <div
          className="size-full rounded-full border-[1.5px] border-primary/20 shadow-[0_0_40px_rgb(91_155_255/0.25),inset_0_0_40px_rgb(91_155_255/0.15)]"
          style={{ transform: "rotateX(68deg) rotateZ(-18deg)" }}
        />
      </div>

      <div className="container-page relative z-1">
        {trail.length > 1 ? (
          <nav aria-label="Breadcrumb" className="mb-10 sm:mb-14">
            <ol className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-line bg-white/60 px-4 py-1.5 text-sm text-subtle backdrop-blur">
              {trail.map((crumb, i) => {
                const last = i === trail.length - 1;
                return (
                  <li key={crumb.path} className="flex items-center gap-2">
                    {last ? (
                      <span aria-current="page" className="font-medium text-primary">
                        {crumb.name}
                      </span>
                    ) : (
                      <>
                        <Link href={crumb.path} className="rounded-sm transition-colors hover:text-primary">
                          {crumb.name}
                        </Link>
                        <span aria-hidden className="text-line-strong">
                          /
                        </span>
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}

        <div className={cn(aside ? "grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16" : "max-w-4xl")}>
          <div className={cn(aside && "lg:col-span-7")}>
            <Eyebrow index={index} className="hero-enter">
              {eyebrow}
            </Eyebrow>
            <h1
              id={id}
              className={cn("mt-6 text-text", size === "lg" ? "text-display-2" : "text-heading-1 sm:text-[clamp(2.5rem,1.8rem+2.6vw,3.75rem)] sm:leading-[1.04]")}
            >
              {title}
            </h1>
            {lead ? (
              <p
                className="hero-enter mt-6 max-w-2xl text-lead text-text-muted"
                style={{ "--enter-delay": "120ms" } as React.CSSProperties}
              >
                {lead}
              </p>
            ) : null}
            {actions ? (
              <div
                className="hero-enter mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
                style={{ "--enter-delay": "200ms" } as React.CSSProperties}
              >
                {actions}
              </div>
            ) : null}
          </div>
          {aside ? (
            <div className="hero-enter lg:col-span-5" style={{ "--enter-delay": "240ms" } as React.CSSProperties}>
              {aside}
            </div>
          ) : null}
        </div>

        {showUpdated ? <LastUpdated date={getPage(path).updated} className="mt-8" /> : null}
        {children}
      </div>
    </section>
  );
}
