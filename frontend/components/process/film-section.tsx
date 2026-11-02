import { SectionHeading } from "@/components/ui/section-heading";
import { ProcessFilm } from "./process-film";

/**
 * "See how we build", a night band around the process film (Server
 * Component; the player is the client island). Sits between the product
 * showcase and the step-by-step process on the home page.
 */
export function FilmSection() {
  return (
    <section
      id="how-we-build"
      aria-labelledby="film-title"
      className="theme-glow section-y relative isolate overflow-hidden"
    >
      {/* Sunrise light behind the screen, matching the film's own glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 -z-1 h-[70%] w-[min(80rem,140vw)] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 100%, color-mix(in oklab, var(--sun) 16%, transparent), color-mix(in oklab, var(--ember-deep) 6%, transparent) 45%, transparent 75%)",
        }}
      />

      <div className="container-page relative z-1">
        <SectionHeading
          id="film-title"
          layout="split"
          eyebrow="Watch · 40 seconds"
          title={
            <>
              See how an idea becomes <em>a product.</em>
            </>
          }
          description="From the first conversation to launch day: the five stages every project moves through, and what you see at each one."
        />

        <div className="mx-auto mt-14 max-w-5xl lg:mt-16" data-reveal="scale">
          <ProcessFilm />
        </div>
      </div>
    </section>
  );
}
