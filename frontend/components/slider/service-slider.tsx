"use client";

/**
 * Service banner slider (Client Component).
 * Why client: slide state, autoplay with a progress indicator, swipe and
 * keyboard navigation.
 *
 * Accessibility (WAI-ARIA carousel pattern): a labelled carousel region,
 * slides as labelled groups, hidden slides made inert, a pause/play button,
 * autoplay that stops on hover, focus, when off screen and for
 * prefers-reduced-motion, and announcements only while not autoplaying.
 * The CTAs drawn in the artwork are real links laid over the artwork.
 */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { SlideLink, SlideRect } from "@/data/home-slides";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export type SliderSlide = {
  id: string;
  label: string;
  title: string;
  links: SlideLink[];
  desktopSrcSet: string;
  mobileSrcSet: string;
  img: { src: string; srcSet?: string; sizes?: string; alt: string; width: number; height: number };
};

const INTERVAL = 6500;
const SWIPE_PX = 48;

export function ServiceSlider({
  slides,
  priority = false,
}: {
  slides: SliderSlide[];
  /** The slider is near the top of the page: fetch the first slide first. */
  priority?: boolean;
}) {
  const count = slides.length;
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  /** null: follow the motion preference; true/false: the visitor's choice. */
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  /** Slides whose images may load now: the current one and the next. */
  const [warm, setWarm] = useState<ReadonlySet<number>>(() => new Set([0, 1]));

  const rootRef = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  const autoplay = userPaused === null ? !reducedMotion : !userPaused;
  const playing = autoplay && !hovered && !focused && inView;

  const go = useCallback(
    (to: number) => {
      const next = (to + count) % count;
      elapsed.current = 0;
      rootRef.current?.style.setProperty("--slide-progress", "0");
      setIndex(next);
      setWarm((prev) => new Set(prev).add(next).add((next + 1) % count));
    },
    [count],
  );

  // Pause while the slider is off screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Autoplay clock: accumulates time only while playing, so pausing and
  // resuming continues the progress bar instead of restarting it.
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      elapsed.current += Math.min(now - last, 100); // a background tab must not skip slides
      last = now;
      const progress = Math.min(elapsed.current / INTERVAL, 1);
      rootRef.current?.style.setProperty("--slide-progress", String(progress));
      if (progress >= 1) go(index + 1);
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, index, go]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    pointer.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = pointer.current;
    pointer.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
  };

  const current = slides[index];

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Our services"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      className="relative"
      style={{ "--slide-progress": 0 } as React.CSSProperties}
    >
      {/* Glass frame */}
      <div className="glass-card relative rounded-[1.75rem] p-1.5 shadow-[0_30px_80px_-30px_rgb(21_101_240/0.35),var(--glass-shadow)] sm:rounded-[2rem] sm:p-2">
        <div
          className="relative overflow-hidden rounded-[1.375rem] bg-[#eef3fc] ring-1 ring-primary/10 sm:rounded-[1.625rem]"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (pointer.current = null)}
          style={{ touchAction: "pan-y" }}
        >
          <div
            aria-live={playing ? "off" : "polite"}
            className="flex transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
            style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
          >
            {slides.map((slide, i) => {
              const active = i === index;
              return (
                <div
                  key={slide.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}: ${slide.title}`}
                  aria-hidden={!active}
                  inert={!active}
                  className={cn(
                    "relative w-full shrink-0 transition-[opacity,scale] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                    active ? "scale-100 opacity-100" : "scale-[0.97] opacity-40",
                  )}
                >
                  <picture>
                    <source media="(max-width: 767px)" srcSet={slide.mobileSrcSet} sizes="100vw" width={1080} height={1350} />
                    <img
                      {...slide.img}
                      alt={slide.img.alt}
                      loading={warm.has(i) ? "eager" : "lazy"}
                      fetchPriority={priority && i === 0 ? "high" : undefined}
                      decoding="async"
                      draggable={false}
                      className="block h-auto w-full select-none"
                    />
                  </picture>
                  {slide.links.map((link) => (
                    <SlideCta key={link.label} link={link} />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center justify-between gap-3 sm:mt-6 sm:gap-4">
        <ul className="flex min-w-0 items-center lg:gap-1" aria-label="Choose a slide">
          {slides.map((slide, i) => {
            const active = i === index;
            return (
              <li key={slide.id}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={active ? "true" : undefined}
                  aria-label={`Slide ${i + 1}: ${slide.title}`}
                  className={cn(
                    "group relative grid h-8 place-items-center rounded-full px-1 transition-colors duration-300 sm:px-1.5 lg:h-10 lg:px-4",
                    active ? "lg:bg-primary-light lg:text-primary" : "text-text-muted hover:text-text lg:hover:bg-surface-2",
                  )}
                >
                  {/* Phones and tablets: dots, the current one a filling pill */}
                  <span
                    aria-hidden
                    className={cn(
                      "relative block h-2 overflow-hidden rounded-full transition-[width,background-color] duration-500 lg:hidden",
                      active ? "w-7 bg-primary/20 sm:w-8" : "w-2 bg-line-strong group-hover:bg-primary/40",
                    )}
                  >
                    {active ? <ProgressFill /> : null}
                  </span>
                  {/* Desktop: named pills with a progress line */}
                  <span aria-hidden className="hidden text-sm font-medium whitespace-nowrap lg:inline">
                    {slide.label}
                  </span>
                  {active ? (
                    <span aria-hidden className="absolute inset-x-4 bottom-1 hidden h-[2px] overflow-hidden rounded-full bg-primary/15 lg:block">
                      <ProgressFill />
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <p className="mr-1 hidden label-mono text-subtle numeric sm:block" aria-hidden>
            <span className="text-primary">{String(index + 1).padStart(2, "0")}</span> / {String(count).padStart(2, "0")}
          </p>
          <ControlButton
            label={autoplay ? "Pause slideshow" : "Play slideshow"}
            onClick={() => setUserPaused(autoplay)}
          >
            {autoplay ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
          </ControlButton>
          <ControlButton label="Previous slide" onClick={() => go(index - 1)}>
            <ChevronLeft className="size-[1.125rem]" />
          </ControlButton>
          <ControlButton label="Next slide" onClick={() => go(index + 1)} primary>
            <ChevronRight className="size-[1.125rem]" />
          </ControlButton>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {playing ? "" : `Slide ${index + 1} of ${count}: ${current.title}`}
      </p>
    </div>
  );
}

/** A transparent link exactly over a button drawn in the artwork. */
function SlideCta({ link }: { link: SlideLink }) {
  const place = (r: SlideRect) => ({ left: `${r[0]}%`, top: `${r[1]}%`, width: `${r[2]}%`, height: `${r[3]}%` });
  const className =
    "absolute rounded-full transition-[background-color,box-shadow] duration-300 hover:bg-white/10 hover:shadow-[0_10px_30px_rgb(21_101_240/0.35)] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-focus";
  return (
    <>
      <Link href={link.href} className={cn(className, "hidden md:block")} style={place(link.desktop)}>
        <span className="sr-only">{link.label}</span>
      </Link>
      <Link href={link.href} className={cn(className, "md:hidden")} style={place(link.mobile)}>
        <span className="sr-only">{link.label}</span>
      </Link>
    </>
  );
}

function ProgressFill() {
  return (
    <span
      className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary"
      style={{ transform: "scaleX(var(--slide-progress))" }}
    />
  );
}

function ControlButton({
  label,
  onClick,
  primary,
  children,
}: {
  label: string;
  onClick: () => void;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "grid size-10 place-items-center rounded-full transition-all duration-[250ms] hover:-translate-y-0.5 sm:size-11",
        primary
          ? "bg-primary text-on-primary shadow-(--shadow-primary) hover:bg-(--primary-fill-hover)"
          : "border-[1.5px] border-line-strong bg-white/80 text-ink hover:border-primary/35 hover:bg-primary-light",
      )}
    >
      {children}
    </button>
  );
}
