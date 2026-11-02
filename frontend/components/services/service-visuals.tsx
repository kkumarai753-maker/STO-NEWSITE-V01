import { Bot, Check, Database, Mail, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/** Mini flow used on the featured "AI Automation" card. CSS-animated, decorative. */
export function AutomationMiniVisual({ className }: { className?: string }) {
  const nodes = [
    { icon: Mail, label: "Email arrives", sub: "From a customer" },
    { icon: Bot, label: "AI reads it", sub: "Understands the request", accent: true },
    { icon: Database, label: "Records updated", sub: "No typing needed" },
  ];
  return (
    <div aria-hidden className={cn("relative", className)}>
      <div className="relative flex items-center justify-between gap-2">
        {/* Connector track */}
        <svg
          className="absolute inset-x-[12%] top-1/2 h-2 w-[76%] -translate-y-1/2 overflow-visible"
          viewBox="0 0 100 2"
          preserveAspectRatio="none"
        >
          <line x1="0" y1="1" x2="100" y2="1" stroke="var(--tint)" strokeOpacity="0.12" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line
            x1="0"
            y1="1"
            x2="100"
            y2="1"
            pathLength={100}
            stroke="url(#mini-beam)"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="beam-dash"
            style={{ "--beam-duration": "2.4s" } as React.CSSProperties}
          />
          <defs>
            <linearGradient id="mini-beam" x1="0" x2="1" y1="0" y2="0">
              <stop stopColor="var(--ink)" />
              <stop offset="1" stopColor="var(--ink)" />
            </linearGradient>
          </defs>
        </svg>

        {nodes.map((node) => (
          <div
            key={node.label}
            className={cn(
              "relative flex w-[30%] flex-col items-center gap-2 rounded-xl border bg-surface px-2 py-3.5 text-center",
              node.accent
                ? "border-brand/35 shadow-[0_10px_30px_-12px_rgb(15_23_42/0.5)]"
                : "border-line shadow-[0_1px_2px_rgb(15_23_42/0.05)]",
            )}
          >
            <span
              className={cn(
                "grid size-9 place-items-center rounded-lg",
                node.accent ? "bg-brand/10 text-brand" : "bg-tint/5 text-text-muted",
              )}
            >
              <node.icon className="size-4" />
            </span>
            <span className="text-xs font-medium text-text">{node.label}</span>
            <span className="text-[0.6875rem] text-subtle">{node.sub}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-bg-elevated px-3.5 py-2.5 text-xs">
        <span className="flex items-center gap-2 text-text-muted">
          <Sparkles className="size-3.5 text-brand" />
          Handled automatically
        </span>
        <span className="flex items-center gap-1.5 text-success">
          <Check className="size-3.5" />
          Done
        </span>
      </div>
    </div>
  );
}

/** Horizontal approval pipeline used on the wide "Business Process Automation" card. */
export function PipelineMiniVisual({ className }: { className?: string }) {
  const steps = [
    { label: "Received", icon: Zap, state: "done" },
    { label: "Checked", icon: ShieldCheck, state: "done" },
    { label: "Approve", icon: Check, state: "active" },
    { label: "Saved", icon: Database, state: "queued" },
  ] as const;
  return (
    <div aria-hidden className={cn("rounded-xl border border-line bg-bg-elevated p-4", className)}>
      <div className="flex items-center justify-between text-xs text-subtle">
        <span>Purchase request</span>
        <span className="flex items-center gap-1.5 text-brand">
          <span className="size-1.5 animate-pulse-soft rounded-full bg-brand" />
          In progress
        </span>
      </div>
      <ol className="mt-4 flex items-center">
        {steps.map((step, i) => (
          <li key={step.label} className="flex flex-1 items-center last:flex-none">
            <span className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full border",
                  step.state === "done" && "border-success/40 bg-success/10 text-success",
                  step.state === "active" &&
                    "border-brand/40 bg-brand/10 text-brand shadow-[0_6px_16px_-6px_rgb(15_23_42/0.6)]",
                  step.state === "queued" && "border-line bg-surface text-subtle",
                )}
              >
                <step.icon className="size-3.5" />
              </span>
              <span className="text-[0.625rem] text-text-muted">{step.label}</span>
            </span>
            {i < steps.length - 1 ? (
              <span
                className={cn(
                  "mx-1.5 mb-5 h-px flex-1",
                  step.state === "done" ? "bg-success/40" : "bg-line-strong",
                )}
              />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
