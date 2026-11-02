import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Inbox } from "lucide-react";
import { Eyebrow } from "@/components/ui/section-heading";
import { statusLabels } from "@/lib/admin";
import type { ContactStatus } from "@/lib/server/admin-api";
import { cn } from "@/lib/utils";

/** Small presentational pieces shared by the admin pages (Server Components). */

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col items-start gap-3">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-[2rem] leading-[1.1] font-semibold tracking-[-0.035em] text-text sm:text-[2.5rem]">
          {title}
        </h1>
        {description ? <p className="max-w-2xl text-[0.9375rem] text-text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

const statusStyles: Record<ContactStatus, string> = {
  new: "border-brand/25 bg-brand/8 text-brand",
  contacted: "border-success/25 bg-success/8 text-success",
  closed: "border-line-strong bg-surface-2 text-text-muted",
  spam: "border-danger/25 bg-danger/6 text-danger",
};

export function StatusBadge({ status }: { status: ContactStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        statusStyles[status],
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </span>
  );
}

export function Alert({
  tone,
  children,
  id,
  className,
}: {
  tone: "error" | "success" | "info";
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  const Icon = tone === "success" ? CircleCheck : CircleAlert;
  return (
    <div
      id={id}
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-3.5 text-sm",
        tone === "error" && "border-danger/25 bg-danger/5 text-danger",
        tone === "success" && "border-success/25 bg-success/6 text-success",
        tone === "info" && "border-line bg-surface-2 text-text-muted",
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl border border-line bg-surface-2 text-text-muted">
        <Inbox className="size-5" aria-hidden />
      </span>
      <h2 className="mt-5 text-lg font-semibold tracking-tight text-text">{title}</h2>
      {children ? <p className="mt-2 max-w-sm text-sm text-text-muted">{children}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("surface-card rounded-3xl", className)}>{children}</section>;
}

export function CardHeader({ title, description, action }: { title: string; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-text">{title}</h2>
        {description ? <p className="mt-1 text-sm text-text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

/** Pulsing placeholder block for loading states. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-xl bg-tint/6", className)} />;
}
