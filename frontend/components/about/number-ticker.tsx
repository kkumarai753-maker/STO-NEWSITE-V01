"use client";

/**
 * Animated counter (Client Component).
 * Why client: counts up when scrolled into view. The final value is
 * server-rendered (correct without JS and for crawlers); animation writes to
 * textContent directly, so it never triggers React re-renders. Screen readers
 * get the static value via an sr-only twin.
 */
import { useLayoutEffect, useRef } from "react";

const format = (n: number) => Math.round(n).toLocaleString("en-US");

export function NumberTicker({
  value,
  prefix = "",
  suffix = "",
  duration = 1600,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return; // already visible: don't reset

    el.textContent = format(0);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = format(value * eased);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = format(value);
    };
  }, [value, duration]);

  return (
    <span className={className}>
      <span className="sr-only">
        {prefix}
        {format(value)}
        {suffix}
      </span>
      <span aria-hidden className="tabular-nums">
        {prefix}
        <span ref={ref}>{format(value)}</span>
        {suffix}
      </span>
    </span>
  );
}
