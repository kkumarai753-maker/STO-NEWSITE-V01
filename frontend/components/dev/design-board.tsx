"use client";

/**
 * /design, every colour, font and background option on one page, with exact
 * values and live examples. Click an option to apply it to the whole site.
 * Local preview only (the route 404s in production).
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Wordmark } from "@/components/brand/logo";
import { EmblemOption } from "./emblem-option";
import { Button } from "@/components/ui/button";
import { BACKGROUNDS, FONTS, LOGOS, PALETTES, resetOptions, setOption, type DesignKey } from "@/lib/design-lab";
import { cn } from "@/lib/utils";
import { useDesignOption } from "./use-design-option";

const BG_THUMBS: Record<string, string> = {
  grid: "bg-grid bg-surface [--grid-size:14px]",
  solid: "bg-[var(--bg-solid)]",
  glow: "bg-surface [background-size:100%_100%,100%_100%,14px_14px,14px_14px] [background-image:radial-gradient(circle_at_0%_0%,color-mix(in_oklab,var(--sun)_35%,transparent),transparent_55%),radial-gradient(circle_at_100%_40%,color-mix(in_oklab,var(--heading-soft)_22%,transparent),transparent_50%),linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)]",
};

export function DesignBoard() {
  const palette = useDesignOption("palette");
  const font = useDesignOption("font");
  const bg = useDesignOption("bg");
  const logo = useDesignOption("logo");

  return (
    <div className="container-page pt-[calc(var(--nav-height)+2rem)] pb-24">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-brand">Preview only changes your own view</p>
        <h1 className="mt-2 text-[2.25rem] leading-[1.05] font-semibold tracking-[-0.04em] text-text sm:text-5xl">
          Design options
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-text-muted">
          Click any option to apply it to the whole website, then scroll the homepage to see it in
          context. Your choice is remembered in this browser.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="md">
            <Link href="/">
              Open the homepage <ArrowRight />
            </Link>
          </Button>
          <Button size="md" variant="secondary" onClick={resetOptions}>
            Reset to recommended
          </Button>
        </div>
      </header>

      {/* 0, Logos -------------------------------------------------------- */}
      <Section
        number="1"
        title="Logo"
        intro="Ten emblem options in the sunrise colours. Each card shows it on white, on dark, as a round social-media profile picture and next to the company name. Applying one swaps the logo in the header and footer."
      >
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {LOGOS.map((l) => (
            <OptionCard key={l.id} optionKey="logo" id={l.id} active={logo === l.id} title={l.name} tagline={l.tagline}>
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
                  <EmblemOption variant={l.id} className="size-14 shrink-0" />
                  <Wordmark />
                </div>
                <div className="grid size-[5.25rem] place-items-center rounded-2xl bg-ink">
                  <EmblemOption variant={l.id} className="size-12" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-ink">
                  <EmblemOption variant={l.id} className="size-9" />
                </span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-surface">
                  <EmblemOption variant={l.id} className="size-6" />
                </span>
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line bg-surface">
                  <EmblemOption variant={l.id} className="size-5" />
                </span>
                <span className="ml-auto flex items-center gap-1.5 text-xs text-subtle">
                  <EmblemOption variant={l.id} tone="mono" className="size-6 text-ink" /> one colour
                </span>
              </div>
            </OptionCard>
          ))}
        </div>
      </Section>

      {/* 1, Colours ------------------------------------------------------ */}
      <Section
        number="2"
        title="Brand colours"
        intro="Primary = buttons and headings. Secondary = the softer second tone in headings. Accent = small highlights and glows. A darker 'text-safe' accent is used for icons and links so they stay readable."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {PALETTES.map((p) => (
            <OptionCard key={p.id} optionKey="palette" id={p.id} active={palette === p.id} title={p.name} tagline={p.tagline}>
              {/* Scoped preview: this card paints with its own palette. */}
              <div data-palette={p.id} className="rounded-2xl border border-line bg-surface p-4">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {p.swatches.map((s) => (
                    <li key={s.hex} className="flex items-center gap-3">
                      <span className="size-10 shrink-0 rounded-lg border border-black/10" style={{ background: s.hex }} aria-hidden />
                      <span className="min-w-0 text-xs leading-snug">
                        <span className="block font-semibold text-text">
                          {s.name} <span className="font-mono font-normal text-text-muted">{s.hex}</span>
                        </span>
                        <span className="block text-subtle">{s.role}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-t border-line pt-4">
                  <p className="text-xl font-semibold tracking-[-0.03em] text-text">
                    Technology that solves <span className="text-heading-soft">real problems.</span>
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-sm font-medium text-white">Start a Project</span>
                    <span className="inline-flex h-9 items-center rounded-full border border-line-strong bg-surface px-4 text-sm font-medium text-text">Explore</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-text-muted">
                      <span className="size-1.5 rounded-full bg-sun" /> Services
                    </span>
                    <span className="text-sm font-medium text-brand underline underline-offset-4">Learn more</span>
                  </div>
                </div>
              </div>
            </OptionCard>
          ))}
        </div>
      </Section>

      {/* 2, Fonts -------------------------------------------------------- */}
      <Section
        number="3"
        title="Fonts and text styles"
        intro="Each pairing uses one font for headings and one for body text. Same sizes, weights and spacing in every option, so only the personality changes."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {FONTS.map((f) => (
            <OptionCard key={f.id} optionKey="font" id={f.id} active={font === f.id} title={f.name} tagline={f.tagline}>
              <div data-font={f.id} className="rounded-2xl border border-line bg-surface p-5">
                <p className="text-xs text-subtle">
                  Headings: <b className="font-semibold text-text">{f.heading}</b> · Body: <b className="font-semibold text-text">{f.body}</b>
                </p>
                <h3 className="mt-4 text-[1.75rem] leading-tight font-semibold tracking-[-0.03em] text-text">
                  Build smarter software
                </h3>
                <p className="mt-2 text-lg font-medium text-text-muted">Subheading: AI that saves you time</p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-text-muted">
                  Body text. We use AI to handle everyday tasks and build the websites, apps and
                  software your business needs, in plain, easy language.
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <span className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-[0.9375rem] font-medium text-white">Start a Project</span>
                  <span className="inline-flex h-10 items-center rounded-full border border-line-strong bg-surface px-5 text-[0.9375rem] font-medium text-text">Explore Services</span>
                </div>
              </div>
            </OptionCard>
          ))}
        </div>

        <div className="surface-card mt-6 rounded-2xl p-5 sm:p-8">
          <h3 className="text-sm font-semibold text-text">Text style guide (used across the whole site, in the selected font)</h3>
          <dl className="mt-5 divide-y divide-line">
            <Row spec="Hero heading · 41–66px · semibold 600 · tight line (1.05) · −0.045em">
              <p className="text-[2.55rem] leading-[1.05] font-semibold tracking-[-0.045em] text-text sm:text-[3.4rem] lg:text-[3.75rem]">
                Build Intelligent Software
              </p>
            </Row>
            <Row spec="Section heading · 32–48px · semibold 600 · line 1.1 · −0.035em">
              <p className="text-[2rem] leading-[1.1] font-semibold tracking-[-0.035em] text-text sm:text-[2.5rem] lg:text-[3rem]">
                Technology That Solves <span className="text-heading-soft">Real Problems.</span>
              </p>
            </Row>
            <Row spec="Card title · 18–28px · semibold 600 · −0.02em">
              <p className="text-2xl font-semibold tracking-[-0.02em] text-text">AI Automation</p>
            </Row>
            <Row spec="Subheading / intro · 18px · regular 400 · line 1.6">
              <p className="max-w-xl text-lg leading-relaxed text-text-muted">
                We use AI to handle your everyday tasks, and we build the software your business needs.
              </p>
            </Row>
            <Row spec="Body text · 15–16px · regular 400 · line 1.6">
              <p className="max-w-xl text-base leading-relaxed text-text-muted">
                Fast, modern websites that look great and bring in customers. Clear steps, clear
                prices, and a team that explains everything in plain language.
              </p>
            </Row>
            <Row spec="Label / small text · 13px · medium 500">
              <p className="text-[0.8125rem] font-medium text-text-muted">AI • Automation • Software Engineering</p>
            </Row>
            <Row spec="Buttons · 15–16px · medium 500 · fully rounded · 44–52px tall">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg">Start a Project</Button>
                <Button size="lg" variant="secondary">Explore Our Services</Button>
                <Button size="md" variant="ghost">Learn more</Button>
              </div>
            </Row>
          </dl>
        </div>
      </Section>

      {/* 3, Background --------------------------------------------------- */}
      <Section
        number="4"
        title="Website background"
        intro="Applies behind every section. The animated option moves very slowly and switches itself off for visitors who have reduced-motion turned on."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BACKGROUNDS.map((b) => (
            <OptionCard key={b.id} optionKey="bg" id={b.id} active={bg === b.id} title={b.name} tagline={b.tagline}>
              <div className={cn("relative h-28 overflow-hidden rounded-2xl border border-line", BG_THUMBS[b.id] ?? BG_THUMBS.glow)} aria-hidden>
                {b.id === "living" ? (
                  <>
                    <span className="design-thumb-orb absolute -top-10 -left-8 size-32 rounded-full [background:radial-gradient(closest-side,color-mix(in_oklab,var(--sun)_40%,transparent),transparent)]" />
                    <span className="design-thumb-orb-2 absolute -right-8 top-6 size-36 rounded-full [background:radial-gradient(closest-side,color-mix(in_oklab,var(--heading-soft)_28%,transparent),transparent)]" />
                    <span className="absolute inset-0 bg-grid [--grid-size:14px]" />
                  </>
                ) : null}
              </div>
            </OptionCard>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ number, title, intro, children }: { number: string; title: string; intro: string; children: ReactNode }) {
  return (
    <section className="mt-16" aria-labelledby={`design-${number}`}>
      <div className="max-w-3xl">
        <h2 id={`design-${number}`} className="text-[1.75rem] font-semibold tracking-[-0.03em] text-text sm:text-3xl">
          <span className="text-heading-soft">{number}.</span> {title}
        </h2>
        <p className="mt-2 text-base leading-relaxed text-text-muted">{intro}</p>
      </div>
      <div className="mt-7">{children}</div>
    </section>
  );
}

function Row({ spec, children }: { spec: string; children: ReactNode }) {
  return (
    <div className="grid gap-2 py-5 first:pt-0 last:pb-0 lg:grid-cols-[16rem_1fr] lg:gap-8">
      <dt className="text-xs leading-relaxed text-subtle">{spec}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/** A selectable card: the whole thing is one button; the preview sits inside. */
function OptionCard({
  optionKey,
  id,
  active,
  title,
  tagline,
  children,
}: {
  optionKey: DesignKey;
  id: string;
  active: boolean;
  title: string;
  tagline: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl border bg-surface/70 p-4 transition-shadow",
        active ? "border-ink shadow-[var(--shadow-float)]" : "border-line hover:shadow-[var(--shadow-card)]",
      )}
    >
      <div className="flex items-start justify-between gap-3 px-1 pb-3">
        <div>
          <h3 className="text-base font-semibold tracking-[-0.015em] text-text">{title}</h3>
          <p className="mt-0.5 text-[0.8125rem] leading-snug text-text-muted">{tagline}</p>
        </div>
        <button
          type="button"
          aria-pressed={active}
          onClick={() => setOption(optionKey, id)}
          className={cn(
            "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[0.8125rem] font-medium transition-colors",
            active ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-text hover:bg-surface-2",
          )}
        >
          {active ? (
            <>
              <Check className="size-3.5" aria-hidden /> Applied
            </>
          ) : (
            "Apply"
          )}
          <span className="sr-only"> {title}</span>
        </button>
      </div>
      {children}
    </div>
  );
}
