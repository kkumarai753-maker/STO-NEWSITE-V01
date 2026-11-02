"use client";

import { useId } from "react";
import { SUNRISE_GRADIENT } from "@/components/brand/mark";
import { MARK_SHAPES } from "@/components/brand/marks";
import { cn } from "@/lib/utils";

/**
 * One of the earlier emblem explorations, for the local Design options tool
 * only. The live site uses the official logo (components/brand/logo.tsx).
 */
export function EmblemOption({
  className,
  tone = "color",
  variant = "horizon",
}: {
  className?: string;
  tone?: "color" | "mono";
  variant?: string;
}) {
  const shape = MARK_SHAPES[variant] ?? MARK_SHAPES.horizon;
  const gradientId = `emblem-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const g = SUNRISE_GRADIENT;
  const paint = tone === "color" ? `url(#${gradientId})` : "currentColor";
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className={cn("size-8 text-ink", className)} aria-hidden>
      {tone === "color" ? (
        <defs>
          <linearGradient id={gradientId} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} gradientUnits="userSpaceOnUse">
            {g.stops.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>
      ) : null}
      {shape(paint)}
    </svg>
  );
}
