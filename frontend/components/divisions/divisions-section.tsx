import Link from "next/link";
import { ArrowUpRight, Check, Code2, Megaphone, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { SERVICES, type ServiceItem } from "@/data/services-catalog";
import { cn } from "@/lib/utils";

/**
 * The two divisions (Server Component). Each panel shows what is actually
 * inside the division, the services from the catalog, so the home page
 * answers "what exactly do you do?"
 * Whole panel is one link (stretched title link, single tab stop).
 */
type Division = {
  group: ServiceItem["group"];
  index: string;
  kicker: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: LucideIcon;
  tone: "brand" | "accent";
};

const DIVISIONS: Division[] = [
  {
    group: "web",
    index: "01",
    kicker: "Technology",
    title: "Web & Technology Solutions",
    description: "Websites, domains, hosting, business email, maintenance, CRM and automation.",
    href: "/web-technology",
    cta: "Explore Web & Technology",
    icon: Code2,
    tone: "brand",
  },
  {
    group: "growth",
    index: "02",
    kicker: "Growth",
    title: "Digital Marketing & Growth",
    description: "Branding, content, social media, reels, advertising, SEO and lead generation.",
    href: "/digital-growth",
    cta: "Explore Digital Growth",
    icon: Megaphone,
    tone: "accent",
  },
];

const VISIBLE_ROWS = 6;

export function DivisionsSection() {
  return (
    <section id="expertise" aria-labelledby="divisions-title" className="section-y relative">
      <div className="container-page">
        <SectionHeading
          id="divisions-title"
          layout="split"
          eyebrow="Our expertise"
          title={
            <>
              Two focused divisions. <em>Everything</em> your digital business needs.
            </>
          }
          description="No confusing vendor chain. We connect technology and marketing so every part of your digital presence works toward growth."
        />

        <ul className="mt-16 grid gap-5 lg:mt-20 lg:grid-cols-2 lg:gap-6">
          {DIVISIONS.map((division, i) => (
            <li
              key={division.group}
              data-reveal=""
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              className="flex"
            >
              <DivisionPanel division={division} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function DivisionPanel({ division }: { division: Division }) {
  const items = SERVICES.filter((s) => s.group === division.group);
  const shown = items.slice(0, VISIBLE_ROWS);
  const more = items.length - shown.length;
  const Icon = division.icon;

  return (
    <article
      data-spotlight=""
      className="group glass-card glass-hover relative flex w-full flex-col overflow-hidden rounded-3xl p-7 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-focus sm:p-10"
    >
      {/* Division colour as a single hairline across the top */}
      <span
        aria-hidden
        className={cn("absolute inset-x-0 top-0 h-[3px] bg-linear-to-r", division.tone === "brand" ? "from-primary to-gold" : "from-gold to-primary")}
      />

      <div className="relative z-1 flex items-center justify-between gap-4">
        <p className="label-mono text-text-muted">
          <span className={division.tone === "brand" ? "text-brand" : "text-accent"}>{division.index}</span>
          <span aria-hidden> · </span>
          <span className="sr-only">, </span>
          {division.kicker}
        </p>
        <span aria-hidden className="icon-tile size-12">
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
      </div>

      <h3 className="relative z-1 mt-10 text-heading-2 text-text">
        <Link
          href={division.href}
          className="after:absolute after:inset-0 after:z-3 after:rounded-3xl after:content-[''] focus-visible:outline-none"
        >
          {division.title}
        </Link>
      </h3>
      <p className="relative z-1 mt-3 max-w-md text-text-muted">{division.description}</p>

      <ul className="relative z-1 mt-8 border-t border-line" aria-label={`${division.kicker} services`}>
        {shown.map((item) => (
          <li key={item.id} className="flex items-center gap-3 border-b border-line py-3 text-[0.9375rem]">
            <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-full bg-primary-light text-primary">
              <Check className="size-3" strokeWidth={2.5} />
            </span>
            <span className="text-text">{item.name}</span>
          </li>
        ))}
      </ul>
      {more > 0 ? <p className="relative z-1 mt-3 text-sm text-subtle">+ {more} more in this division</p> : null}

      <span
        aria-hidden
        className="relative z-1 mt-auto inline-flex items-center gap-2 pt-10 text-[0.9375rem] font-semibold text-primary"
      >
        {division.cta}
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </article>
  );
}
