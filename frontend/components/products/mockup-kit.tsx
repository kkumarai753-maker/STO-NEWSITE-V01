import type { LucideIcon } from "lucide-react";
import { Bell, Search } from "lucide-react";
import { cn, initials } from "@/lib/utils";

/**
 * Primitive building blocks for product mockups. Server Components only ,
 * mockups are static, realistic UI rendered as HTML/SVG (no images, no JS).
 */

export function AppShell({
  brand,
  nav,
  active,
  title,
  subtitle,
  actions,
  children,
}: {
  brand: string;
  nav: { icon: LucideIcon; label: string }[];
  active: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-[30rem] bg-bg text-left">
      <aside className="hidden w-48 shrink-0 flex-col border-r border-line bg-bg-elevated p-3 md:flex">
        <div className="mb-5 flex items-center gap-2 px-2 pt-1">
          <span className="size-5 rounded-md bg-brand" />
          <span className="text-[0.8125rem] font-semibold text-text">{brand}</span>
        </div>
        <ul className="space-y-0.5">
          {nav.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs",
                label === active
                  ? "bg-surface text-text shadow-[0_1px_2px_rgb(15_23_42/0.06),inset_0_0_0_1px_rgb(15_23_42/0.06)]"
                  : "text-subtle",
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </li>
          ))}
        </ul>
        <div className="mt-auto rounded-lg border border-line bg-surface p-2.5">
          <p className="text-[0.625rem] text-subtle">Monthly usage</p>
          <div className="mt-1.5 h-1 rounded-full bg-tint/10">
            <div className="h-full w-2/3 rounded-full bg-brand" />
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text">{title}</p>
            {subtitle ? <p className="truncate text-[0.6875rem] text-subtle">{subtitle}</p> : null}
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <span className="hidden h-7 w-40 items-center gap-2 rounded-lg border border-line bg-surface px-2 text-[0.6875rem] text-subtle lg:flex">
              <Search className="size-3" /> Search… <kbd className="ml-auto font-mono text-[0.5625rem]">⌘K</kbd>
            </span>
            <span className="grid size-7 place-items-center rounded-lg border border-line bg-surface text-subtle">
              <Bell className="size-3.5" />
            </span>
            <Avatar name="Sam Rivera" size="sm" />
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden p-4">{children}</div>
      </div>
    </div>
  );
}

export function Card({
  title,
  action,
  className,
  children,
}: {
  title?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-line bg-surface p-3.5", className)}>
      {title ? (
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-text">{title}</p>
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function Kpi({
  label,
  value,
  delta,
  positive = true,
  spark,
}: {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
  spark?: number[];
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      <p className="text-[0.6875rem] text-subtle">{label}</p>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <p className="text-lg leading-none font-semibold tracking-tight text-text">{value}</p>
        {spark ? <Sparkline points={spark} positive={positive} /> : null}
      </div>
      <p className={cn("mt-1.5 font-mono text-[0.625rem]", positive ? "text-success" : "text-danger")}>
        {delta}
      </p>
    </div>
  );
}

function toPath(points: number[], w: number, h: number) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  return points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / span) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function Sparkline({ points, positive = true }: { points: number[]; positive?: boolean }) {
  return (
    <svg viewBox="0 0 60 22" className="h-5 w-14" aria-hidden>
      <path
        d={toPath(points, 60, 22)}
        fill="none"
        stroke={positive ? "var(--success)" : "var(--danger)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AreaChart({
  points,
  secondary,
  id,
  className,
  labels,
}: {
  points: number[];
  secondary?: number[];
  id: string;
  className?: string;
  labels?: string[];
}) {
  const w = 400;
  const h = 120;
  const line = toPath(points, w, h);
  return (
    <div className={className}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ink)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--ink)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--ink)" />
            <stop offset="100%" stopColor="var(--ink)" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="var(--tint)" strokeOpacity="0.05" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={`${line} L${w} ${h} L0 ${h} Z`} fill={`url(#${id}-fill)`} />
        {secondary ? (
          <path
            d={toPath(secondary, w, h)}
            fill="none"
            stroke="var(--ink)"
            strokeOpacity="0.22"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
        <path d={line} fill="none" stroke={`url(#${id}-stroke)`} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      {labels ? (
        <div className="mt-1.5 flex justify-between font-mono text-[0.5625rem] text-subtle">
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Bars({ values, highlight, className }: { values: number[]; highlight?: number; className?: string }) {
  const max = Math.max(...values);
  return (
    <div className={cn("flex items-end gap-1.5", className)} aria-hidden>
      {values.map((v, i) => (
        <span
          key={i}
          className={cn(
            "flex-1 rounded-t-[3px]",
            i === highlight ? "bg-brand" : "bg-tint/9",
          )}
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

/** Neutral greys, avatars stay monochrome like the rest of the site. */
const SHADES = ["var(--ink)", "#2b303b", "#4a5161", "#646b79"];

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-medium text-white",
        size === "sm" ? "size-7 text-[0.625rem]" : "size-8 text-[0.6875rem]",
      )}
      style={{ background: SHADES[name.length % SHADES.length] }}
    >
      {initials(name)}
    </span>
  );
}

const TONES = {
  success: "border-success/30 bg-surface text-success",
  warning: "border-warning/30 bg-surface text-warning",
  danger: "border-danger/30 bg-surface text-danger",
  info: "border-line-strong bg-surface text-text",
  brand: "border-ink bg-ink text-white",
  neutral: "border-line bg-tint/3 text-text-muted",
} as const;

export function Pill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: keyof typeof TONES;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[0.625rem] font-medium whitespace-nowrap",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
