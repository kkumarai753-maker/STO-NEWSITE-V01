import Link from "next/link";
import { Button, ButtonArrow } from "@/components/ui/button";
import { Horizon } from "@/components/ui/horizon";

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="theme-glow relative isolate grid min-h-svh place-items-center overflow-hidden px-(--gutter) pt-(--nav-height) pb-32"
    >
      <Horizon line="4rem" />
      <div className="relative z-1 max-w-2xl text-center">
        <p className="label-mono text-accent">Error 404</p>
        <h1 id="not-found-title" className="mt-6 text-display-2 text-text">
          This page has <em>set.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lead text-text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              Back to home
              <ButtonArrow />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/services">Explore Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
