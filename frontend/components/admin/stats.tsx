import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from "lucide-react";
import { formatDay, formatNumber } from "@/lib/admin";
import { cn } from "@/lib/utils";

/** Dashboard figures and charts, Server Components; hover tooltips are CSS-only. */

export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  delta,
  hint,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  href?: string;
  /** Compared with a named earlier period, e.g. { previous: 4, label: "yesterday" } */
  delta?: { previous: number; label: string };
  hint?: string;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-text-muted">{label}</p>
        <span className="grid size-9 place-items-center rounded-xl border border-line bg-surface-2 text-text-muted">
          <Icon className="size-4" aria-hidden />
        </span>
      </div>
      <p className="mt-3 text-[2rem] leading-none font-semibold tracking-[-0.03em] text-text">{formatNumber(value)}</p>
      <div className="mt-3 flex min-h-5 items-center justify-between gap-2 text-[0.8125rem]">
        {delta ? <Delta current={value} {...delta} /> : <span className="text-subtle">{hint}</span>}
        {href ? (
          <ArrowRight
            aria-hidden
            className="size-4 shrink-0 text-subtle transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-text"
          />
        ) : null}
      </div>
    </>
  );
  const className = "surface-card group block rounded-2xl p-5 transition-[border-color,box-shadow] duration-300";
  return href ? (
    <Link href={href} className={cn(className, "hover:border-line-strong hover:shadow-[var(--shadow-float)]")}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

function Delta({ current, previous, label }: { current: number; previous: number; label: string }) {
  const diff = current - previous;
  const Icon = diff > 0 ? ArrowUpRight : diff < 0 ? ArrowDownRight : Minus;
  return (
    <span className="inline-flex items-center gap-1 text-text-muted">
      <Icon aria-hidden className={cn("size-3.5", diff > 0 && "text-success", diff < 0 && "text-danger")} />
      <span>
        {diff === 0 ? "Same as" : `${diff > 0 ? "+" : "−"}${formatNumber(Math.abs(diff))} vs`} {label}
      </span>
    </span>
  );
}

/**
 * Submissions per day, one series, so no legend (the card title names it).
 * Columns ≤24px with a rounded top, hairline baseline, a tooltip on hover
 * and a table view for screen readers.
 */
export function DailyChart({ days }: { days: { date: string; count: number }[] }) {
  const max = Math.max(...days.map((d) => d.count), 0);
  // Round the scale up to a clean number so the top tick reads well.
  const step = max <= 4 ? 1 : max <= 10 ? 2 : Math.pow(10, Math.floor(Math.log10(max))) / 2;
  const top = Math.max(step * Math.ceil(max / step), 1);
  const peak = days.reduce((best, d) => (d.count > best.count ? d : best), days[0]);

  return (
    <figure className="px-5 pt-4 pb-5 sm:px-6">
      <div className="flex gap-3">
        {/* y-axis: just the top value and zero */}
        <div aria-hidden className="flex h-44 flex-col justify-between pb-0.5 text-right text-xs text-subtle tabular-nums">
          <span>{formatNumber(top)}</span>
          <span>0</span>
        </div>
        <div className="relative flex-1">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-2 border-t border-line" />
          <ol
            aria-hidden
            className="relative flex h-44 items-end gap-0.5 border-b border-line-strong"
          >
            {days.map((day) => {
              const height = (day.count / top) * 100;
              return (
                <li key={day.date} className="group relative flex h-full flex-1 items-end justify-center">
                  {/* Hit target is the whole column slot, not just the bar. */}
                  <span className="absolute inset-0 rounded-md group-hover:bg-tint/3" />
                  <span
                    className="pointer-events-none relative w-full max-w-6 rounded-t-[4px] bg-brand transition-opacity group-hover:opacity-85"
                    style={{ height: day.count ? `max(${height}%, 3px)` : "0px" }}
                  />
                  <span className="pointer-events-none absolute bottom-[calc(100%+0.25rem)] left-1/2 z-10 hidden -translate-x-1/2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs whitespace-nowrap text-text shadow-[var(--shadow-float)] group-hover:block">
                    <span className="font-semibold tabular-nums">{formatNumber(day.count)}</span>{" "}
                    <span className="text-text-muted">
                      {day.count === 1 ? "submission" : "submissions"} · {formatDay(day.date, { weekday: "short", day: "numeric", month: "short" })}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
          <div aria-hidden className="mt-2 flex justify-between text-xs text-subtle">
            <span>{formatDay(days[0].date)}</span>
            <span>{formatDay(days[days.length - 1].date)}</span>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-[0.8125rem] text-text-muted">
        {max === 0
          ? "No submissions in the last 14 days."
          : `Busiest day: ${formatDay(peak.date, { weekday: "long", day: "numeric", month: "short" })} (${formatNumber(peak.count)}).`}
      </figcaption>
      <table className="sr-only">
        <caption>Submissions per day, last 14 days</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Submissions</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.date}>
              <td>{formatDay(day.date, { weekday: "short", day: "numeric", month: "short" })}</td>
              <td>{day.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** Horizontal share bars with the label and value in text tokens (not data colour). */
export function BreakdownList({
  rows,
  total,
}: {
  rows: { key: string; label: string; count: number; href?: string }[];
  total: number;
}) {
  return (
    <ul className="flex flex-col gap-1 px-3 pt-3 pb-4 sm:px-4">
      {rows.map((row) => {
        const share = total ? row.count / total : 0;
        const content = (
          <>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium text-text">{row.label}</span>
              <span className="text-text-muted tabular-nums">
                {formatNumber(row.count)}
                <span className="ml-1.5 text-xs text-subtle">{Math.round(share * 100)}%</span>
              </span>
            </div>
            <div aria-hidden className="mt-2 h-1.5 overflow-hidden rounded-full bg-tint/6">
              <div className="h-full rounded-full bg-ink/70" style={{ width: `${share * 100}%` }} />
            </div>
          </>
        );
        return (
          <li key={row.key}>
            {row.href ? (
              <Link href={row.href} className="block rounded-xl px-2 py-2.5 transition-colors hover:bg-tint/3">
                {content}
              </Link>
            ) : (
              <div className="px-2 py-2.5">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
