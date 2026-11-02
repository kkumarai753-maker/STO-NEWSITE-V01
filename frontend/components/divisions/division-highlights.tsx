import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type Highlight = { icon: LucideIcon; title: string; desc: string };

/**
 * What a division covers, as four ruled columns (Server Component).
 * gap-px over a line-coloured grid draws the hairlines at every breakpoint.
 */
export function DivisionHighlights({
  items,
  tone = "brand",
  label,
}: {
  items: Highlight[];
  tone?: "brand" | "accent";
  label: string;
}) {
  return (
    <section aria-labelledby="division-highlights" className="border-b border-line bg-surface">
      <h2 id="division-highlights" className="sr-only">
        {label}
      </h2>
      <div className="container-page">
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                data-reveal=""
                style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
                className="bg-surface py-10 sm:px-8 lg:px-8 lg:first:pl-0 lg:last:pr-0"
              >
                <Icon
                  className={cn("size-6", tone === "brand" ? "text-brand" : "text-accent")}
                  strokeWidth={1.5}
                  aria-hidden
                />
                <h3 className="mt-6 text-heading-3 text-text">{item.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-text-muted">{item.desc}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
