import Link from "next/link";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/data/faq";
import { cn } from "@/lib/utils";

/**
 * FAQ list built on native disclosure widgets (Server Component, no JS).
 * Every answer is in the HTML, so search engines and AI assistants can read
 * it, find-in-page opens the matching item, and FAQPage markup always matches
 * what is on the page. Items sharing `name` open one at a time.
 */
export function FaqList({
  items,
  name,
  numbered = false,
  openFirst = true,
  className,
}: {
  items: FaqItem[];
  /** Groups the items into an exclusive accordion. */
  name: string;
  numbered?: boolean;
  openFirst?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3", className)}>
      {items.map((faq, i) => (
        <details
          key={faq.id}
          id={`faq-${faq.id}`}
          name={name}
          open={openFirst && i === 0}
          className="group glass-card scroll-mt-[calc(var(--nav-height)+1.5rem)] rounded-[1.25rem] px-5 transition-[border-color,box-shadow] duration-[250ms] hover:border-primary/25 open:border-primary/25 open:shadow-(--glass-shadow-hover) sm:px-7"
        >
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 rounded-sm py-5 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
            <h3 className="flex items-baseline gap-5 text-[1.0625rem] font-semibold tracking-[-0.01em] text-text transition-colors group-hover:text-brand sm:text-lg">
              {numbered ? (
                <span className="w-6 shrink-0 font-mono text-xs text-subtle numeric">
                  {String(i + 1).padStart(2, "0")}
                </span>
              ) : null}
              {faq.question}
            </h3>
            <span
              aria-hidden
              className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-light text-primary transition-all duration-300 group-open:rotate-45 group-open:border-primary group-open:bg-primary group-open:text-on-primary"
            >
              <Plus className="size-4" />
            </span>
          </summary>
          <div className={cn("max-w-2xl pr-4 pb-6 text-base sm:pr-12 leading-relaxed text-text-muted", numbered && "pl-11")}>
            <p>{faq.answer}</p>
            {faq.links?.length ? (
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {faq.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-medium text-text underline decoration-line-strong underline-offset-[0.3em] transition-colors hover:text-primary hover:decoration-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}
