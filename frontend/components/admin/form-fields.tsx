"use client";

/**
 * Labelled form field + password input with show/hide, styled like the
 * contact form (`field-control`). Why client: the visibility toggle.
 */
import { useState, type ComponentProps, type ReactNode } from "react";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function Field({
  id,
  label,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-[0.8125rem] text-subtle">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-[0.8125rem] text-danger">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function fieldA11y(id: string, error: string | undefined, hint?: string) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return {
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy,
    "aria-required": true as const,
  };
}

export function PasswordInput({ className, ...props }: Omit<ComponentProps<"input">, "type">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={visible ? "text" : "password"} className={cn("field-control pr-12", className)} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-subtle transition-colors hover:bg-tint/5 hover:text-text"
      >
        {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  );
}
