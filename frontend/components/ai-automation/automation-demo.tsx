"use client";

/**
 * Animated automation example (Client Component).
 * Why client: a timed sequence steps through the example. It pauses when
 * off-screen or when the tab is hidden, has Play/Pause/Replay controls
 * (WCAG 2.2.2), and shows the finished state for reduced-motion users.
 */
import { useEffect, useRef, useState } from "react";
import { Check, LoaderCircle, Pause, Play, RotateCcw } from "lucide-react";
import { automationFindings, automationRun, automationStages } from "@/data/automation";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const STEP_MS = 1500;
const HOLD_MS = 4500;
const TOTAL = automationRun.steps.length;

export function AutomationDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  /** Number of finished steps (0…TOTAL). The step at index `done` is in progress. */
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  /** Reduced-motion users see the finished example until they press Play. */
  const [userStarted, setUserStarted] = useState(false);
  const autoplay = !reducedMotion || userStarted;
  const done = autoplay ? progress : TOTAL;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!autoplay || !playing || !inView) return;
    const timer = setTimeout(
      () => setProgress((d) => (d >= TOTAL ? 0 : d + 1)),
      progress >= TOTAL ? HOLD_MS : progress === 0 ? 700 : STEP_MS,
    );
    return () => clearTimeout(timer);
  }, [autoplay, progress, playing, inView]);

  const running = done < TOTAL ? done : -1;
  const reachedStage =
    running >= 0 ? automationRun.steps[running].stage : automationStages.length - 1;
  const understood = done >= 3;
  const finished = done >= TOTAL;

  const replay = () => {
    setUserStarted(true);
    setProgress(0);
    setPlaying(true);
  };

  return (
    <div ref={rootRef} className="mt-14" data-reveal="">
      {/* The journey */}
      <ol
        className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:items-center lg:gap-0"
        aria-label="How an automation works, step by step"
      >
        {automationStages.map((stage, i) => {
          const isCurrent = i === reachedStage && !finished;
          const isReached = i <= reachedStage || finished;
          const Icon = stage.icon;
          return (
            <li key={stage.id} className="flex items-center lg:flex-1 lg:last:flex-none">
              <div
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all duration-500 lg:w-auto",
                  isCurrent
                    ? "border-ink bg-ink text-white shadow-[0_8px_20px_-10px_rgb(15_23_42/0.6)]"
                    : isReached
                      ? "border-line-strong bg-surface text-text shadow-[0_1px_2px_rgb(15_23_42/0.05)]"
                      : "border-line bg-surface/70 text-subtle",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="text-xs font-medium whitespace-nowrap sm:text-[0.8125rem]">
                  {stage.label}
                </span>
              </div>
              {i < automationStages.length - 1 ? (
                <span aria-hidden className="relative mx-1.5 hidden h-px flex-1 bg-line lg:block">
                  <span
                    className="absolute inset-y-0 left-0 bg-ink transition-[width] duration-700 ease-out"
                    style={{ width: i < reachedStage || finished ? "100%" : "0%" }}
                  />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>

      {/* Example window */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgb(15_23_42/0.05),0_40px_100px_-40px_rgb(15_23_42/0.25)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bg-elevated px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="truncate text-sm font-medium text-text">
              Example: {automationRun.name}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
                finished
                  ? "border-success/30 bg-success/8 text-success"
                  : "border-line-strong bg-surface text-text-muted",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  finished ? "bg-success" : "animate-pulse-soft bg-ink",
                )}
              />
              {finished ? "All done" : "Working…"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => (finished ? replay() : setPlaying((p) => !p))}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-xs font-medium text-text-muted transition-colors hover:border-line-strong hover:text-text"
              aria-label={playing && !finished ? "Pause the example" : "Play the example"}
            >
              {playing && !finished ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {playing && !finished ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              onClick={replay}
              className="grid size-8 place-items-center rounded-full border border-line bg-surface text-text-muted transition-colors hover:border-line-strong hover:text-text"
              aria-label="Replay the example"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12">
          {/* What happens */}
          <div className="relative border-b border-line p-4 sm:p-6 lg:col-span-7 lg:border-r lg:border-b-0">
            <p className="mb-4 text-sm font-medium text-text-muted">What happens</p>
            <ol className="relative" aria-label="Example steps">
              {automationRun.steps.map((step, i) => {
                const state = i < done ? "done" : i === running ? "running" : "queued";
                const Icon = step.icon;
                return (
                  <li key={step.id} className="relative pb-3 last:pb-0">
                    {i < TOTAL - 1 ? (
                      <span aria-hidden className="absolute top-12 bottom-0 left-[1.6rem] w-px bg-line">
                        <span
                          className="absolute inset-x-0 top-0 bg-ink transition-[height] duration-700 ease-out"
                          style={{ height: state === "done" ? "100%" : "0%" }}
                        />
                      </span>
                    ) : null}
                    <div
                      className={cn(
                        "relative flex items-start gap-3.5 rounded-xl border p-3 transition-all duration-500 sm:p-3.5",
                        state === "running" &&
                          "border-ink/40 bg-surface shadow-[0_10px_30px_-14px_rgb(15_23_42/0.45)]",
                        state === "done" && "border-line bg-surface",
                        state === "queued" && "border-line/70 bg-surface/60",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-lg border transition-colors duration-500",
                          state === "running" && "border-ink bg-ink text-white",
                          state === "done" && "border-line bg-surface-2 text-text",
                          state === "queued" && "border-line/70 bg-transparent text-subtle",
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p
                            className={cn(
                              "text-sm font-medium transition-colors duration-500",
                              state === "queued" ? "text-subtle" : "text-text",
                            )}
                          >
                            {step.title}
                          </p>
                          <StepStatus state={state} />
                        </div>
                        <p
                          className={cn(
                            "mt-1 text-xs leading-relaxed transition-colors duration-500 sm:text-[0.8125rem]",
                            state === "queued" ? "text-subtle" : "text-text-muted",
                          )}
                        >
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4 p-4 sm:p-6 lg:col-span-5">
            <Panel title="What the AI understood" ready={understood}>
              {!understood ? (
                <p className="py-2 text-sm text-subtle">
                  The key details will appear here once the AI has read the email.
                </p>
              ) : null}
              <dl className={cn("divide-y divide-line text-sm", !understood && "hidden")}>
                {automationFindings.map((item, i) => (
                  <div
                    key={item.label}
                    className="flex animate-in items-center justify-between gap-4 py-2 duration-500 fill-mode-both fade-in-0 slide-in-from-left-1"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <dt className="text-text-muted">{item.label}</dt>
                    <dd className="font-medium text-text">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </Panel>

            <Panel title="Reply sent to the customer" ready={finished}>
              <div
                className={cn(
                  "text-sm leading-relaxed transition-opacity duration-700",
                  finished ? "text-text-muted opacity-100" : "text-subtle opacity-40",
                )}
              >
                <p className="text-text">Hi Jordan,</p>
                <p className="mt-1.5">
                  Sorry your Desk Lamp Pro arrived damaged. A replacement ships today, and your
                  tracking link is below. No need to return the original.
                </p>
                <p className="mt-2 text-xs text-subtle">Written by AI · approved by your team</p>
              </div>
            </Panel>
          </div>
        </div>

        {/* Progress */}
        <div className="h-0.5 w-full bg-line">
          <div
            className="h-full bg-ink transition-[width] duration-700 ease-out"
            style={{ width: `${(Math.min(done, TOTAL) / TOTAL) * 100}%` }}
          />
        </div>
      </div>

      {reducedMotion && !userStarted ? (
        <p className="mt-5 text-center text-xs text-subtle">
          Animation paused to respect your motion settings. Press Play to watch.
        </p>
      ) : null}
    </div>
  );
}

function StepStatus({ state }: { state: "done" | "running" | "queued" }) {
  if (state === "done") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-success">
        <Check className="size-3.5" /> Done
      </span>
    );
  }
  if (state === "running") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-text">
        <LoaderCircle className="size-3.5 animate-spin" /> Working
      </span>
    );
  }
  return <span className="shrink-0 text-xs text-subtle">Waiting</span>;
}

function Panel({
  title,
  ready,
  children,
}: {
  title: string;
  ready: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line bg-bg-elevated p-4" aria-label={title}>
      <header className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-text">{title}</h3>
        {ready ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
            <Check className="size-3.5" /> Ready
          </span>
        ) : (
          <span className="text-xs text-subtle">Waiting…</span>
        )}
      </header>
      {children}
    </section>
  );
}
