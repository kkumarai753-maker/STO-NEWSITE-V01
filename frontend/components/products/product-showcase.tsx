"use client";

/**
 * Product mockup switcher (Client Component).
 * Why client: tab state. Implements the WAI-ARIA tabs pattern (roving
 * tabindex, arrow/Home/End keys). Mockup panels are server-rendered and
 * passed in as nodes, so they add no client JavaScript.
 */
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Lock, RotateCw } from "lucide-react";
import type { ProductMockupId, ProductTab } from "@/data/products";
import { cn } from "@/lib/utils";

export function ProductShowcase({
  tabs,
  panels,
}: {
  tabs: ProductTab[];
  panels: Record<ProductMockupId, ReactNode>;
}) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const tab = tabs[active];

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: (active + 1) % tabs.length,
      ArrowLeft: (active - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = keys[e.key];
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      {/* Browser chrome + tabs */}
      <div className="flex flex-col gap-2 border-b border-line bg-bg-elevated px-3 pt-3 sm:px-4">
        <div className="flex items-center gap-3">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-tint/15" />
            <span className="size-2.5 rounded-full bg-tint/15" />
            <span className="size-2.5 rounded-full bg-sun/70" />
          </span>
          <div className="mx-auto flex h-7 w-full max-w-md items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-3 font-mono text-[0.6875rem] text-subtle">
            <Lock className="size-3 shrink-0" aria-hidden />
            <span className="truncate">
              Concept preview · {tab.label}
            </span>
          </div>
          <RotateCw className="hidden size-3.5 text-subtle sm:block" aria-hidden />
        </div>
        <div
          role="tablist"
          aria-label="Product examples"
          className="no-scrollbar -mx-3 flex gap-1 overflow-x-auto px-3 sm:-mx-4 sm:px-4"
        >
          {tabs.map((t, i) => {
            const selected = i === active;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`${baseId}-tab-${t.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onKeyDown}
                className={cn(
                  "relative min-h-10 shrink-0 rounded-t-md px-3.5 pt-2 pb-2.5 text-[0.8125rem] font-medium whitespace-nowrap transition-colors duration-200 sm:text-sm",
                  selected ? "text-text" : "text-subtle hover:text-text",
                )}
              >
                {t.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary transition-opacity duration-300",
                    selected ? "opacity-100" : "opacity-0",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${tab.id}`}
        aria-describedby={`${baseId}-desc`}
        tabIndex={0}
        className="relative outline-offset-[-2px]"
      >
        {/* Every description is in the HTML (inactive ones hidden), so crawlers read all of them. */}
        <div
          id={`${baseId}-desc`}
          className="border-b border-line bg-surface px-4 py-2.5 text-sm text-text-muted"
          aria-live="polite"
        >
          {tabs.map((t, i) => (
            <p key={t.id} hidden={i !== active}>
              <span className="font-medium text-text">{t.label}:</span> {t.description}
            </p>
          ))}
        </div>
        <div key={tab.id} aria-hidden className="animate-in duration-500 fade-in-0">
          {panels[tab.id]}
        </div>
      </div>
    </div>
  );
}
