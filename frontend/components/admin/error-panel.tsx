"use client";

/** Admin error state, e.g. the backend is down. Used by the admin error boundaries. */
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminErrorPanel({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="surface-card grid min-h-[50svh] place-items-center rounded-3xl px-6 py-16 text-center">
      <div>
        <p className="text-sm font-medium text-text-muted">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-text">We couldn&apos;t load this page.</h1>
        <p className="mx-auto mt-3 max-w-md text-text-muted">
          The admin service may be unavailable. Check that the backend is running, then try again.
        </p>
        <Button type="button" variant="secondary" onClick={reset} className="mt-8">
          <RotateCcw aria-hidden /> Try again
        </Button>
      </div>
    </section>
  );
}
