import { Bot, CalendarDays, Check, ShoppingCart, Sparkles, TrendingUp, Truck, User } from "lucide-react";
import type { CaseStudyVisual } from "@/data/case-studies";
import { cn } from "@/lib/utils";

/** Simple cover art for case-study cards. Server-rendered, decorative. */

export function CaseVisual({ kind, className }: { kind: CaseStudyVisual; className?: string }) {
  return (
    <div aria-hidden className={cn("relative h-full w-full overflow-hidden", className)}>
      <div className="absolute inset-0 bg-surface-2" />
      <div className="absolute inset-0 bg-grid opacity-50 [--grid-size:28px] [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      <div className="absolute inset-0 grid place-items-center p-6">{SCENES[kind]}</div>
    </div>
  );
}

const glass = "rounded-xl border border-line bg-surface/95 shadow-[0_1px_2px_rgb(15_23_42/0.05),0_16px_32px_-16px_rgb(15_23_42/0.2)]";

const SCENES: Record<CaseStudyVisual, React.ReactNode> = {
  support: (
    <div className="flex w-full max-w-[16rem] flex-col gap-2">
      <div className={cn(glass, "self-start px-3 py-2 text-[0.6875rem] text-text-muted")}>
        <User className="mr-1 inline size-3" /> Where is my order #4821?
      </div>
      <div className={cn(glass, "self-end border-brand/30 px-3 py-2 text-[0.6875rem] text-text")}>
        <Bot className="mr-1 inline size-3 text-brand" /> It ships today. Here&apos;s your tracking link.
      </div>
      <div className={cn(glass, "flex items-center gap-2 self-end px-2.5 py-1.5 text-[0.625rem] font-medium text-success")}>
        <Check className="size-3" /> Answered by AI in seconds
      </div>
    </div>
  ),
  operations: (
    <div className={cn(glass, "w-full max-w-[17rem] p-3")}>
      <p className="mb-2 flex items-center gap-1.5 text-[0.6875rem] text-text">
        <CalendarDays className="size-3 text-brand" /> This week’s schedule
      </p>
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-5 rounded",
              [1, 4, 7, 8, 12].includes(i) ? "bg-brand/50" : [2, 10].includes(i) ? "bg-brand/50" : "bg-tint/5",
            )}
          />
        ))}
      </div>
    </div>
  ),
  leads: (
    <div className={cn(glass, "w-full max-w-[16rem] space-y-1.5 p-3")}>
      {[
        ["Great fit", 92, "bg-ink"],
        ["Good fit", 71, "bg-ink/60"],
        ["Not a fit", 18, "bg-ink/25"],
      ].map(([name, score, c]) => (
        <div key={name as string} className="flex items-center gap-2 text-[0.625rem]">
          <span className="w-24 truncate text-text-muted">{name}</span>
          <span className="h-1.5 flex-1 rounded-full bg-tint/6">
            <span className={cn("block h-full rounded-full", c as string)} style={{ width: `${score}%` }} />
          </span>
          <span className="w-5 text-right font-mono text-text">{score}</span>
        </div>
      ))}
      <p className="pt-1 text-[0.625rem] font-medium text-text">
        <Sparkles className="mr-1 inline size-2.5" /> Best leads sent to sales
      </p>
    </div>
  ),
  saas: (
    <div className="relative h-32 w-full max-w-[17rem]">
      <div className={cn(glass, "absolute inset-x-6 top-0 h-24 opacity-50")} />
      <div className={cn(glass, "absolute inset-x-3 top-3 h-24 opacity-75")} />
      <div className={cn(glass, "absolute inset-x-0 top-6 p-3")}>
        <div className="flex items-center justify-between">
          <span className="text-[0.6875rem] text-text">Your product</span>
          <span className="rounded bg-tint/8 px-1.5 text-[0.625rem] font-medium text-text">Live</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-tint/10">
          <div className="h-full w-3/5 rounded-full bg-brand" />
        </div>
        <p className="mt-2 text-[0.625rem] text-subtle">Customers signing up every day</p>
      </div>
    </div>
  ),
  enterprise: (
    <div className={cn(glass, "w-full max-w-[17rem] p-3")}>
      <div className="flex items-center justify-between text-[0.6875rem]">
        <span className="text-text">Business performance</span>
        <span className="flex items-center gap-1 font-medium text-success">
          <TrendingUp className="size-3" /> Live
        </span>
      </div>
      <svg viewBox="0 0 200 60" className="mt-2 h-14 w-full" aria-hidden>
        <path d="M0 50 L25 42 L50 45 L75 30 L100 34 L125 22 L150 26 L175 12 L200 8" fill="none" stroke="var(--ink)" strokeWidth="2" />
        <path d="M0 50 L25 42 L50 45 L75 30 L100 34 L125 22 L150 26 L175 12 L200 8 L200 60 L0 60Z" fill="var(--ink)" fillOpacity="0.1" />
      </svg>
    </div>
  ),
  commerce: (
    <div className="flex w-full max-w-[17rem] items-center gap-2">
      {[
        { icon: ShoppingCart, label: "Order", c: "text-brand" },
        { icon: Check, label: "Paid", c: "text-success" },
        { icon: Truck, label: "Shipped", c: "text-brand" },
      ].map(({ icon: Icon, label, c }, i) => (
        <div key={label} className="flex flex-1 items-center gap-2">
          <div className={cn(glass, "flex flex-1 flex-col items-center gap-1 py-2.5")}>
            <Icon className={cn("size-4", c)} />
            <span className="text-[0.5625rem] text-text-muted">{label}</span>
          </div>
          {i < 2 ? <span className="h-px w-2 bg-tint/20" /> : null}
        </div>
      ))}
    </div>
  ),
};
