import { BrandIcon } from "@/components/ui/brand-icon";
import { techStripPrimary, techStripSecondary, type TechLogo } from "@/data/technologies";
import { cn } from "@/lib/utils";

/**
 * "Technologies We Work With", adapted from Aceternity "Infinite Moving Cards",
 * rebuilt as a server-rendered CSS marquee (the list is duplicated on the
 * server, so no client JS is needed). Pauses on hover; static under reduced motion.
 */
export function TechMarquee() {
  return (
    <section
      id="technologies"
      aria-labelledby="technologies-title"
      className="relative py-12 sm:py-14"
    >
      <div className="container-page">
        <h2
          id="technologies-title"
          className="text-center text-sm font-medium text-text-muted"
        >
          Technologies We Work With
        </h2>
      </div>

      <div className="mt-9 flex flex-col gap-4 mask-fade-x">
        <MarqueeRow items={techStripPrimary} duration="46s" />
        <MarqueeRow items={techStripSecondary} duration="52s" reverse />
      </div>

      <p className="container-page mt-6 text-center text-xs text-subtle">
        Logos belong to their owners. Shown to illustrate tools we use, not partnerships.
      </p>
    </section>
  );
}

function MarqueeRow({
  items,
  duration,
  reverse = false,
}: {
  items: TechLogo[];
  duration: string;
  reverse?: boolean;
}) {
  return (
    <div className="flex overflow-hidden motion-reduce:justify-center">
      <ul
        className={cn(
          "marquee-track flex w-max shrink-0 gap-4 pr-4 motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        )}
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {[...items, ...items].map((item, i) => (
          <li
            key={`${item.slug}-${i}`}
            aria-hidden={i >= items.length ? true : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-full border border-line bg-surface py-2.5 pr-5 pl-3 text-text-muted shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-colors duration-300 hover:border-line-strong hover:text-text",
              i >= items.length && "motion-reduce:hidden",
            )}
          >
            <span className="grid size-8 place-items-center rounded-full bg-tint/4 transition-colors duration-300 group-hover:bg-tint/8">
              <BrandIcon slug={item.slug} className="size-4" />
            </span>
            <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
