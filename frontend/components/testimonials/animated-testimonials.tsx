"use client";

/**
 * Adapted from Aceternity UI "Animated Testimonials".
 * Why client: active-slide state and stacked-card animation.
 * Changes from the original: deterministic tilts (the original used
 * Math.random during render, which breaks hydration), no autoplay, an
 * aria-live region, and an initials avatar when no photo is supplied.
 */
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { MotionProvider } from "@/components/providers/motion-provider";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import type { Testimonial } from "@/data/testimonials";
import { cn, initials } from "@/lib/utils";

const TILTS = [-6, 4, -3, 7, -5];

export function AnimatedTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const count = testimonials.length;
  const current = testimonials[active];

  const go = (dir: 1 | -1) => setActive((a) => (a + dir + count) % count);

  return (
    <MotionProvider>
      <div className="grid items-center gap-12 md:grid-cols-12 md:gap-12 lg:gap-16">
        {/* Card stack */}
        <div className="relative mx-auto h-72 w-full max-w-sm sm:h-80 md:col-span-5" aria-hidden>
          <AnimatePresence>
            {testimonials.map((t, index) => {
              const isActive = index === active;
              return (
                <m.div
                  key={t.id}
                  initial={{ opacity: 0, scale: 0.9, rotate: TILTS[index % TILTS.length] }}
                  animate={{
                    opacity: isActive ? 1 : 0.55,
                    scale: isActive ? 1 : 0.94,
                    rotate: isActive ? 0 : TILTS[index % TILTS.length],
                    zIndex: isActive ? 40 : count + 2 - index,
                    y: isActive ? [0, -40, 0] : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 origin-bottom"
                >
                  <TestimonialCard testimonial={t} />
                </m.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Copy */}
        <div className="flex flex-col justify-between md:col-span-7">
          <div aria-live="polite" aria-atomic="true">
            <m.div
              key={current.id}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {current.isPlaceholder ? (
                <span className="mb-6 inline-flex rounded-full border border-warning/30 bg-warning/8 px-2.5 py-1 text-xs font-medium text-warning">
                  Placeholder testimonial
                </span>
              ) : null}
              <blockquote>
                <p className="text-[clamp(1.25rem,1.05rem+0.9vw,1.75rem)] leading-[1.35] font-medium tracking-[-0.02em] text-text">
                  <span className="sr-only">“</span>
                  {current.quote.split(" ").map((word, i) => (
                    <m.span
                      key={`${current.id}-${i}`}
                      initial={{ filter: "blur(8px)", opacity: 0, y: 4 }}
                      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut", delay: 0.015 * i }}
                      className="inline-block"
                    >
                      {word}&nbsp;
                    </m.span>
                  ))}
                  <span className="sr-only">”</span>
                </p>
                <footer className="mt-8 border-l-2 border-sun pl-4">
                  <p className="text-base font-semibold text-text">{current.name}</p>
                  <p className="text-sm text-text-muted">
                    {current.role}, {current.company}
                  </p>
                </footer>
              </blockquote>
            </m.div>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <NavButton label="Previous testimonial" onClick={() => go(-1)}>
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            </NavButton>
            <NavButton label="Next testimonial" onClick={() => go(1)}>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </NavButton>
            <p className="ml-2 font-mono text-xs text-subtle numeric">
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>
    </MotionProvider>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  if (testimonial.photo) {
    return (
      <Image
        src={testimonial.photo}
        alt=""
        fill
        sizes="(min-width: 768px) 24rem, 90vw"
        className="rounded-xl object-cover"
        draggable={false}
      />
    );
  }
  return (
    <div className="theme-glow relative flex size-full flex-col justify-between overflow-hidden rounded-3xl border border-line p-7 shadow-(--glass-shadow)">
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 size-64 -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--sun) 30%, transparent), transparent)" }}
      />
      <Quote className="relative size-8 text-accent" strokeWidth={1.5} />
      <div className="relative flex items-center gap-4">
        <span className="grid size-16 place-items-center rounded-full border border-line-strong bg-surface-2 font-display text-2xl text-text">
          {initials(testimonial.name)}
        </span>
        <span>
          <span className="block text-sm font-medium text-text">{testimonial.name}</span>
          <span className={cn("block text-xs text-subtle")}>{testimonial.company}</span>
        </span>
      </div>
    </div>
  );
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group grid size-12 place-items-center rounded-full border border-line-strong bg-surface text-text shadow-xs transition-colors hover:border-text/35 hover:bg-bg"
    >
      {children}
    </button>
  );
}
