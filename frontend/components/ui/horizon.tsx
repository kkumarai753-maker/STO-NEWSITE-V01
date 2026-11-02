import { cn } from "@/lib/utils";

/**
 * The brand motif (DESIGN.md §2), drawn from the Horizon Emblem: a hairline
 * horizon in the emblem's gold → orange → red, a soft half-sun rising behind
 * it and three reflection lines that thin out below.
 *
 *  - placement="bottom": a sunrise at the foot of a night page hero.
 *  - placement="top":    the light after sunset, at the top of the footer.
 *
 * Decorative and CSS-only (Server Component). Place inside a `relative
 * isolate overflow-hidden` night section; it sits behind the content.
 */
const REFLECTIONS = [
  { offset: "0.75rem", width: "54%", opacity: 0.7 },
  { offset: "1.5rem", width: "34%", opacity: 0.45 },
  { offset: "2.25rem", width: "16%", opacity: 0.3 },
];

export function Horizon({
  placement = "bottom",
  line = "3rem",
  className,
}: {
  placement?: "bottom" | "top";
  /** Distance of the horizon line from the section edge. */
  line?: string;
  className?: string;
}) {
  const bottom = placement === "bottom";
  return (
    <div
      aria-hidden
      className={cn("horizon", bottom ? "bottom-0 h-[38rem]" : "top-0 h-[26rem]", className)}
      style={{ zIndex: -1 }}
    >
      {bottom ? (
        <span className="horizon-sun" style={{ bottom: line }} />
      ) : (
        <span
          className="absolute left-1/2 h-[18rem] w-[min(60rem,150vw)] -translate-x-1/2 rounded-b-full"
          style={{
            top: line,
            background:
              "radial-gradient(ellipse 50% 100% at 50% 0%, color-mix(in oklab, var(--sun) 16%, transparent), color-mix(in oklab, var(--ember-deep) 6%, transparent) 45%, transparent 72%)",
          }}
        />
      )}
      <span className="horizon-line" style={bottom ? { bottom: line } : { top: line }} />
      {REFLECTIONS.map((r) => (
        <span
          key={r.offset}
          className="horizon-reflection"
          style={{
            width: r.width,
            opacity: r.opacity,
            ...(bottom ? { bottom: `calc(${line} - ${r.offset})` } : { top: `calc(${line} + ${r.offset})` }),
          }}
        />
      ))}
    </div>
  );
}
