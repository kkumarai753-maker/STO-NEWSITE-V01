"use client";

/**
 * Service catalog (Client Component).
 * Why client: the division filter. Set as an editorial list, one row per
 * service with two actions, grouped by division.
 * Page heroes live on the pages themselves (services, web-technology,
 * digital-growth), so this component never renders an h1.
 */
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SERVICES, type ServiceItem } from "@/data/services-catalog";
import { Button, ButtonArrow } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Group = "all" | "web" | "growth";

const GROUPS: { id: ServiceItem["group"]; index: string; title: string; href: string; blurb: string }[] = [
  {
    id: "web",
    index: "01",
    title: "Web & Technology",
    href: "/web-technology",
    blurb: "Websites, hosting, maintenance, CRM and automation.",
  },
  {
    id: "growth",
    index: "02",
    title: "Digital Marketing & Growth",
    href: "/digital-growth",
    blurb: "Branding, content, reels, advertising, SEO and lead funnels.",
  },
];

const FILTERS: { id: Group; label: string }[] = [
  { id: "all", label: "All services" },
  { id: "web", label: "Web & Technology" },
  { id: "growth", label: "Digital Marketing & Growth" },
];

interface ServicesCatalogClientProps {
  initialGroup?: Group;
  hideFilter?: boolean;
}

export function ServicesCatalogClient({ initialGroup = "all", hideFilter = false }: ServicesCatalogClientProps) {
  const [activeGroup, setActiveGroup] = useState<Group>(initialGroup);
  const groups = GROUPS.filter((g) => activeGroup === "all" || g.id === activeGroup);
  const visibleCount = SERVICES.filter((s) => activeGroup === "all" || s.group === activeGroup).length;

  return (
    <div className="container-page">
      {!hideFilter ? (
        <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="group"
            aria-label="Filter services by division"
            className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto rounded-full border border-line-strong bg-surface p-1 px-1"
          >
            {FILTERS.map((f) => {
              const active = activeGroup === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveGroup(f.id)}
                  className={cn(
                    "h-10 shrink-0 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors duration-200",
                    active ? "bg-text text-bg" : "text-text-muted hover:bg-tint/5 hover:text-text",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <p className="text-sm text-subtle" aria-live="polite">
            <span className="numeric">{visibleCount}</span> services
          </p>
        </div>
      ) : null}

      <div className="space-y-20 pt-12 sm:pt-16">
        {groups.map((group) => {
          const items = SERVICES.filter((s) => s.group === group.id);
          return (
            <section key={group.id} aria-labelledby={`catalog-${group.id}`} className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <header className="lg:col-span-4">
                <div className="lg:sticky lg:top-[calc(var(--nav-height)+2rem)]">
                  <p className="label-mono text-accent numeric">{group.index}</p>
                  <h2 id={`catalog-${group.id}`} className="mt-4 text-heading-2 text-text">
                    {group.title}
                  </h2>
                  <p className="mt-3 max-w-xs text-text-muted">{group.blurb}</p>
                  <Link
                    href={group.href}
                    className="group/button mt-5 inline-flex items-center gap-2 rounded-sm text-sm font-medium text-text underline decoration-line-strong underline-offset-[0.35em] transition-colors hover:decoration-accent"
                  >
                    About this division
                    <ButtonArrow />
                  </Link>
                </div>
              </header>

              <ul className="border-t border-line lg:col-span-8">
                {items.map((service) => (
                  <ServiceRow key={service.id} service={service} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <aside
        aria-labelledby="catalog-help"
        className="theme-glow relative isolate mt-24 overflow-hidden rounded-3xl border border-line shadow-(--glass-shadow) p-8 sm:p-12 lg:mt-32"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -bottom-40 -z-1 size-112 rounded-full"
          style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--sun) 22%, transparent), transparent)" }}
        />
        <div className="relative z-1 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="label-mono text-text-muted">Need guidance?</p>
            <h2 id="catalog-help" className="mt-4 text-heading-1 text-text">
              Not sure which services <em>fit?</em>
            </h2>
            <p className="mt-4 text-text-muted">
              Reach out with your goals and we&apos;ll help you choose the right starting point for your
              timeline.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">
                Start a Conversation
                <ButtonArrow />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/inquiry">Request a Quote</Link>
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function ServiceRow({ service }: { service: ServiceItem }) {
  const quote = `/contact?service=${encodeURIComponent(service.name)}`;
  const inquire = `/inquiry?service=${encodeURIComponent(service.name)}`;

  return (
    <li className="group grid gap-5 border-b border-line py-8 sm:grid-cols-[1fr_auto] sm:gap-x-10">
      <div className="min-w-0">
        <h3 className="text-heading-3 text-text">{service.name}</h3>
        <p className="mt-2 max-w-md text-[0.9375rem] leading-relaxed text-text-muted">{service.desc}</p>
      </div>

      <div className="flex flex-col gap-4 sm:items-end sm:self-center">
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href={quote}>
              Get a Quote<span className="sr-only"> for {service.name}</span>
            </Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href={inquire}>
              Inquire<span className="sr-only"> about {service.name}</span>
              <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </li>
  );
}
