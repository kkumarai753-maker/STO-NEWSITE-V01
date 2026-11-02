"use client";

/**
 * Case-study carousel + detail dialog (Client Component).
 * Inspired by Aceternity "Apple Cards Carousel" and "Animated Modal".
 * Why client: carousel controls and dialog state. Uses native scroll-snap
 * (swipe/trackpad friendly) and Radix Dialog (focus trap, Esc, aria-modal).
 */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { CaseStudy, CaseStudyVisual } from "@/data/case-studies";
import { cn } from "@/lib/utils";

export function CaseStudyCarousel({
  studies,
  visuals,
}: {
  studies: CaseStudy[];
  visuals: Record<CaseStudyVisual, ReactNode>;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const selected = studies.find((s) => s.id === openId) ?? null;

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div>
      <div className="container-page mt-10 flex justify-end gap-2">
        <CarouselButton label="Previous case studies" disabled={!canPrev} onClick={() => scrollBy(-1)}>
          <ArrowLeft className="size-4" />
        </CarouselButton>
        <CarouselButton label="Next case studies" disabled={!canNext} onClick={() => scrollBy(1)}>
          <ArrowRight className="size-4" />
        </CarouselButton>
      </div>

      <ul
        ref={scrollerRef}
        className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scroll-padding-inline:max(1rem,calc((100vw-80rem)/2+2rem))] [padding-inline:max(1rem,calc((100vw-80rem)/2+2rem))]"
        aria-label="Case studies"
      >
        {studies.map((study, i) => (
          <li
            key={study.id}
            className="w-[85%] max-w-[26rem] shrink-0 snap-start sm:w-[24rem] lg:w-[26rem]"
            data-reveal=""
            style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
          >
            <button
              type="button"
              onClick={() => setOpenId(study.id)}
              className="group surface-card flex h-full w-full flex-col overflow-hidden rounded-3xl text-left transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-float)]"
              aria-haspopup="dialog"
            >
              <div className="relative h-52 w-full overflow-hidden border-b border-line transition-transform duration-700 ease-out sm:h-56">
                <div className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                  {visuals[study.visual]}
                </div>
                {study.isPlaceholder ? <SampleBadge className="absolute top-4 left-4" /> : null}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm font-medium text-text-muted">
                  {study.category}
                </p>
                <h3 className="mt-2.5 text-xl font-semibold tracking-[-0.02em] text-text">
                  {study.title}
                </h3>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-brand">
                  View details
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <DialogPrimitive.Root open={selected !== null} onOpenChange={(open) => !open && setOpenId(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-90 bg-scrim/40 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <DialogPrimitive.Content className="fixed inset-x-3 top-[4vh] bottom-[4vh] z-100 mx-auto flex max-w-3xl flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_40px_100px_-30px_rgb(15_23_42/0.35)] outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-[0.97] data-open:slide-in-from-bottom-4 data-open:duration-300 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-[0.98] sm:inset-x-6">
            {selected ? (
              <>
                <div className="relative h-44 shrink-0 border-b border-line sm:h-56">
                  {visuals[selected.visual]}
                  <DialogPrimitive.Close
                    className="absolute top-4 right-4 grid size-10 place-items-center rounded-full border border-line bg-surface/90 text-text shadow-[0_1px_2px_rgb(15_23_42/0.08)] backdrop-blur transition-colors hover:bg-surface"
                    aria-label="Close case study"
                  >
                    <X className="size-4" />
                  </DialogPrimitive.Close>
                  {selected.isPlaceholder ? <SampleBadge className="absolute top-4 left-4" /> : null}
                </div>
                <div className="thin-scrollbar flex-1 overflow-y-auto p-6 sm:p-8">
                  <p className="text-sm font-medium text-text-muted">
                    {selected.category}
                  </p>
                  <DialogPrimitive.Title className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-text sm:text-3xl">
                    {selected.title}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="mt-3 text-base leading-relaxed text-text-muted">
                    {selected.summary}
                  </DialogPrimitive.Description>

                  <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                    <Detail label="The problem">{selected.problem}</Detail>
                    <Detail label="What we built">{selected.solution}</Detail>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-semibold text-text">
                        Tools used
                      </dt>
                      <dd className="mt-3 flex flex-wrap gap-2">
                        {selected.technology.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-line bg-tint/3 px-3 py-1 text-xs text-text-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-brand/25 bg-brand/6 p-5 sm:col-span-2">
                      <dt className="text-sm font-medium text-text-muted">
                        The result
                      </dt>
                      <dd className="mt-2 text-[0.9375rem] leading-relaxed text-text">{selected.result}</dd>
                      {selected.metrics?.length ? (
                        <dd className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {selected.metrics.map((metric) => (
                            <div key={metric.label}>
                              <p className="text-2xl font-semibold text-text">{metric.value}</p>
                              <p className="text-xs text-text-muted">{metric.label}</p>
                            </div>
                          ))}
                        </dd>
                      ) : null}
                    </div>
                  </dl>

                  {selected.isPlaceholder ? (
                    <p className="mt-6 text-xs text-subtle">
                      Sample project: an illustrative example of a system we build, not a
                      specific client engagement.
                    </p>
                  ) : null}

                  <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-text-muted">Have a similar challenge?</p>
                    <Link
                      href="/#contact"
                      onClick={() => setOpenId(null)}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-ink/85"
                    >
                      Discuss a similar project <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </>
            ) : null}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-bg-elevated p-5">
      <dt className="text-sm font-semibold text-text">{label}</dt>
      <dd className="mt-2 text-[0.9375rem] leading-relaxed text-text-muted">{children}</dd>
    </div>
  );
}

function SampleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full border border-line bg-surface/90 px-2.5 py-1 text-xs font-medium text-text-muted shadow-[0_1px_2px_rgb(15_23_42/0.06)] backdrop-blur",
        className,
      )}
    >
      Sample project
    </span>
  );
}

function CarouselButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-line bg-surface text-text shadow-[0_1px_2px_rgb(15_23_42/0.05)] transition-all duration-200 hover:border-line-strong hover:bg-bg-elevated disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}
