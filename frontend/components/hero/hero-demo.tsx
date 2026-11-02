"use client";

/**
 * Hero illustration: one simple, everyday example of AI automation, shown
 * step by step so anyone can follow it.
 * Why client: a small timer reveals the steps in order and loops.
 * Reduced-motion users see the finished example.
 */
import { useEffect, useState } from "react";
import { Check, Mail, RefreshCw, Send, Sparkles, type LucideIcon } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

type Step = { icon: LucideIcon; title: string; detail: string };

const STEPS: Step[] = [
  { icon: Mail, title: "A customer sends a message", detail: "“Can I change my delivery date?”" },
  { icon: Sparkles, title: "AI understands it", detail: "They want a new delivery date" },
  { icon: RefreshCw, title: "Your system is updated", detail: "New date saved automatically" },
  { icon: Send, title: "The customer gets a reply", detail: "“Done! Your order now arrives Friday.”" },
];

const STEP_MS = 1400;
const HOLD_MS = 3200;

export function HeroDemo({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  /** How many steps are complete (0…STEPS.length). */
  const [shown, setShown] = useState(0);
  const visible = reducedMotion ? STEPS.length : shown;
  const finished = visible >= STEPS.length;

  // Browsers throttle timers in background tabs, so no extra pause logic is needed.
  useEffect(() => {
    if (reducedMotion) return;
    const timer = setTimeout(
      () => setShown((s) => (s >= STEPS.length ? 0 : s + 1)),
      shown >= STEPS.length ? HOLD_MS : shown === 0 ? 600 : STEP_MS,
    );
    return () => clearTimeout(timer);
  }, [shown, reducedMotion]);

  return (
    <figure
      className={cn(
        "glass-card relative w-full overflow-hidden rounded-3xl p-5 sm:p-7",
        className,
      )}
      aria-labelledby="hero-demo-caption"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="label-mono text-accent">Live example</p>
          <p className="mt-1.5 text-[0.9375rem] font-medium text-text">Your assistant at work</p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-500",
            finished ? "border-success/35 text-success" : "border-line-strong text-text-muted",
          )}
        >
          <span className={cn("size-1.5 rounded-full", finished ? "bg-success" : "animate-pulse-soft bg-accent")} />
          {finished ? "Done" : "Working…"}
        </span>
      </div>

      <div className="relative mt-6" aria-hidden>
        {/* Spine connecting the steps; fills as each one completes */}
        <span className="absolute top-[31px] bottom-[31px] left-[30.5px] w-px bg-line" />
        <span
          className="absolute top-[31px] left-[30.5px] w-px origin-top bg-sun transition-[height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ height: `calc((100% - 62px) * ${Math.min(visible, STEPS.length - 1) / (STEPS.length - 1)})` }}
        />
        <ol className="space-y-2.5">
        {STEPS.map((step, i) => {
          const done = i < visible;
          const active = i === visible && !finished;
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className={cn(
                "relative flex items-center gap-4 rounded-lg border p-3 transition-all duration-500",
                done && "border-transparent",
                active && "border-line bg-primary-light/70",
                !done && !active && "border-transparent opacity-45",
              )}
            >
              <span
                className={cn(
                  "relative grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-500",
                  done || active ? "border-sun bg-sun text-on-sun" : "border-line-strong bg-surface text-subtle",
                )}
              >
                <Icon className={cn("size-4", active && "animate-pulse")} strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-text">{step.title}</span>
                <span className="mt-0.5 block truncate text-[0.8125rem] text-text-muted">{step.detail}</span>
              </span>
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full transition-all duration-300",
                  done ? "scale-100 text-success" : "scale-50 opacity-0",
                )}
              >
                <Check className="size-4" strokeWidth={2.25} />
              </span>
            </li>
          );
        })}
        </ol>
      </div>

      <figcaption id="hero-demo-caption" className="mt-6 border-t border-line pt-5 text-[0.8125rem] text-text-muted">
        It all happens automatically. Your team only steps in when needed.
        <span className="sr-only">
          {" "}
          Example: a customer asks to change their delivery date, the AI understands the request,
          the system is updated, and the customer gets a reply.
        </span>
      </figcaption>
    </figure>
  );
}
