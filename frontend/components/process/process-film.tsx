"use client";

/**
 * "How we build" film (Client Component).
 * Why client: play/pause, in-view autoplay and chapter progress.
 *
 *  - Silent (the file has no audio), so it may autoplay muted once it is
 *    mostly in view, and pauses when scrolled away. Nothing downloads until
 *    then (preload="none"; the poster is a 50 KB WebP).
 *  - Visitors who prefer reduced motion get the poster and a play button.
 *  - A visible Pause control (WCAG 2.2.2) and chapter buttons that jump to
 *    each stage; the chapters sit under the frame because the film draws its
 *    own step bar along the bottom.
 */
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const SRC = "/videos/sunrise-tech-origin-dev-process";
const POSTER = "/videos/sunrise-tech-origin-process-poster.webp";

/** Chapter start times (seconds), matched to the film's own titles. */
const CHAPTERS = [
  { label: "Discover", title: "Discover & plan", start: 4.5 },
  { label: "Design", title: "UI / UX design", start: 10 },
  { label: "Develop", title: "Development", start: 16 },
  { label: "Deploy", title: "Cloud & DevOps", start: 22 },
  { label: "Launch", title: "Launch & grow", start: 28 },
] as const;
const END = 34.5; // end card begins

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function ProcessFilm({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const userPaused = useRef(false);
  const reducedMotion = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);

  // Autoplay (muted) while mostly in view; pause when it leaves.
  useEffect(() => {
    const video = videoRef.current;
    const frame = frameRef.current;
    if (!video || !frame || reducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
          if (!userPaused.current) void video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: [0, 0.45] },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      void video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  const jump = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = seconds + 0.3; // land just after the title fades in
    setTime(video.currentTime);
    userPaused.current = false;
    void video.play().catch(() => {});
  };

  const active = CHAPTERS.reduce((current, c, i) => (time >= c.start ? i : current), -1);

  return (
    <div className={className}>
      <div
        ref={frameRef}
        className="relative overflow-hidden rounded-xl border border-line-strong bg-[#050717] shadow-lg [box-shadow:var(--shadow-lg),var(--inset-highlight)]"
      >
        <video
          ref={videoRef}
          className="block aspect-video w-full"
          poster={POSTER}
          muted
          loop
          playsInline
          preload="none"
          aria-label="How Sunrise Tech Origin builds a product: discover and plan, design, development, cloud and DevOps, launch and grow."
          onPlay={() => {
            setPlaying(true);
            setStarted(true);
          }}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        >
          <source src={`${SRC}.webm`} type="video/webm" />
          <source src={`${SRC}.mp4`} type="video/mp4" />
        </video>

        {/* Big play button until the film has started (or after a reduced-motion load) */}
        {!started ? (
          <button
            type="button"
            onClick={toggle}
            className="group absolute inset-0 grid place-items-center bg-[#050717]/35 transition-colors hover:bg-[#050717]/20"
            aria-label="Play the 40-second film"
          >
            <span className="flex items-center gap-3 rounded-full bg-text py-2 pr-6 pl-2 text-[0.9375rem] font-medium text-bg shadow-lg transition-transform duration-300 group-hover:scale-[1.03]">
              <span className="grid size-11 place-items-center rounded-full bg-sun text-on-sun">
                <Play className="size-5 translate-x-px fill-current" aria-hidden />
              </span>
              Watch how we build
            </span>
          </button>
        ) : null}
      </div>

      {/* Controls: play/pause, chapters (each fills while it plays), time */}
      <div className="mt-5 flex items-center gap-4 sm:gap-6">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause video" : "Play video"}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-text transition-colors hover:border-text/40 hover:bg-tint/6"
        >
          {playing ? <Pause className="size-4 fill-current" aria-hidden /> : <Play className="size-4 translate-x-px fill-current" aria-hidden />}
        </button>

        <ol className="grid min-w-0 flex-1 grid-cols-5 gap-1.5 sm:gap-3" aria-label="Chapters">
          {CHAPTERS.map((c, i) => {
            const end = CHAPTERS[i + 1]?.start ?? END;
            const fill = Math.min(1, Math.max(0, (time - c.start) / (end - c.start)));
            const current = i === active;
            return (
              <li key={c.label}>
                <button
                  type="button"
                  onClick={() => jump(c.start)}
                  aria-label={`Jump to ${c.title} (${clock(c.start)})`}
                  aria-current={current ? "step" : undefined}
                  className="group block w-full pt-2 text-left"
                >
                  <span className="block h-0.5 overflow-hidden rounded-full bg-line-strong">
                    <span
                      className="block h-full bg-linear-to-r from-gold to-sun transition-[width] duration-300 ease-linear"
                      style={{ width: `${fill * 100}%` }}
                    />
                  </span>
                  <span
                    className={cn(
                      "mt-2.5 flex items-baseline gap-1.5 text-[0.6875rem] transition-colors sm:text-sm",
                      current ? "text-text" : "text-subtle group-hover:text-text-muted",
                    )}
                  >
                    <span className="hidden font-mono text-[0.6875rem] text-accent numeric sm:inline">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {c.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <span className="hidden shrink-0 font-mono text-xs text-subtle numeric sm:block" aria-hidden>
          {clock(time)} / 0:40
        </span>
      </div>
    </div>
  );
}
