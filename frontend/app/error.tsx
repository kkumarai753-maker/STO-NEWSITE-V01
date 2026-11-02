"use client";

/** Route error boundary (must be a Client Component). */
import Link from "next/link";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Horizon } from "@/components/ui/horizon";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      aria-labelledby="error-title"
      className="theme-glow relative isolate grid min-h-svh place-items-center overflow-hidden px-(--gutter) pt-(--nav-height) pb-32"
    >
      <Horizon line="4rem" />
      <div className="relative z-1 max-w-2xl text-center" role="alert">
        <p className="label-mono text-accent">Something went wrong</p>
        <h1 id="error-title" className="mt-6 text-heading-1 text-text">
          We hit an <em>unexpected</em> error.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-text-muted">
          Please try again. If the problem persists, contact us and we&apos;ll look into it.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" size="lg" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden /> Try again
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
