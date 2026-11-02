"use client";

/**
 * Local-only "Design options" panel: switch palette, font pairing and page
 * background live while looking at the real site. Not rendered in production.
 */
import Link from "next/link";
import { useState } from "react";
import { Palette, X } from "lucide-react";
import { EmblemOption } from "./emblem-option";
import { BACKGROUNDS, FONTS, LOGOS, PALETTES, resetOptions, setOption, type DesignKey } from "@/lib/design-lab";
import { cn } from "@/lib/utils";
import { useDesignOption } from "./use-design-option";

export function DesignLab() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-16 left-3 z-55 sm:left-5">
      {open ? (
        <section
          aria-label="Design options"
          className="mb-2 max-h-[min(44rem,calc(100dvh-8rem))] w-[17.5rem] overflow-y-auto rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-float)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-text">Design options</h2>
              <p className="mt-0.5 text-xs text-subtle">Try the options. This only changes your own view.</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close design options"
              className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-text-muted hover:text-text"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <LogoGroup />
          <Group title="Colours" optionKey="palette" options={PALETTES.map((p) => ({ id: p.id, label: p.name, swatches: p.swatches.slice(0, 3).map((s) => s.hex) }))} />
          <Group title="Fonts" optionKey="font" options={FONTS.map((f) => ({ id: f.id, label: `${f.name} (${f.heading}${f.heading === f.body ? "" : " + " + f.body})` }))} />
          <Group title="Background" optionKey="bg" options={BACKGROUNDS.map((b) => ({ id: b.id, label: b.name }))} />

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3 text-xs">
            <Link href="/design" className="font-medium text-brand underline-offset-4 hover:underline">
              See all options with examples
            </Link>
            <button type="button" onClick={resetOptions} className="text-subtle underline-offset-4 hover:text-text hover:underline">
              Reset
            </button>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-sm font-medium text-text shadow-[var(--shadow-float)] hover:bg-bg-elevated"
      >
        <Palette className="size-4" aria-hidden />
        Design options
      </button>
    </div>
  );
}

/** Ten emblem thumbnails in a grid; click one to swap the site logo. */
function LogoGroup() {
  const value = useDesignOption("logo");
  return (
    <fieldset className="mt-4">
      <legend className="text-[0.6875rem] font-semibold tracking-wider text-subtle uppercase">Logo</legend>
      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {LOGOS.map((l) => (
          <button
            key={l.id}
            type="button"
            aria-pressed={value === l.id}
            aria-label={l.name}
            title={l.name}
            onClick={() => setOption("logo", l.id)}
            className={cn(
              "grid aspect-square place-items-center rounded-xl border transition-colors",
              value === l.id ? "border-ink bg-surface-2" : "border-line hover:border-line-strong",
            )}
          >
            <EmblemOption variant={l.id} className="size-7" />
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-xs text-subtle">{LOGOS.find((l) => l.id === value)?.name}</p>
    </fieldset>
  );
}

function Group({
  title,
  optionKey,
  options,
}: {
  title: string;
  optionKey: DesignKey;
  options: { id: string; label: string; swatches?: string[] }[];
}) {
  const value = useDesignOption(optionKey);
  return (
    <fieldset className="mt-4">
      <legend className="text-[0.6875rem] font-semibold tracking-wider text-subtle uppercase">{title}</legend>
      <div className="mt-2 flex flex-col gap-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={value === o.id}
            onClick={() => setOption(optionKey, o.id)}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-[0.8125rem] leading-snug transition-colors",
              value === o.id ? "border-ink bg-surface-2 font-medium text-text" : "border-line text-text-muted hover:border-line-strong",
            )}
          >
            {o.swatches ? (
              <span className="flex shrink-0 -space-x-1" aria-hidden>
                {o.swatches.map((hex) => (
                  <span key={hex} className="size-4 rounded-full border border-surface" style={{ background: hex }} />
                ))}
              </span>
            ) : null}
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
