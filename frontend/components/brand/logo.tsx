"use client";

import Link from "next/link";
import { useId } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { BOX, LOGO_COLORS, SUN_DISC, SUN_RAYS, TAGLINE, TAGLINE_RULES, WORDMARK } from "./logo-art";

/**
 * Sunrise Tech Origin logo (vector; artwork in ./logo-art.ts).
 *
 *  - <Logo />          horizontal lockup for the navigation (sun + wordmark)
 *  - <LogoFull />      the original stacked logo (sun above the wordmark)
 *  - <SunMark />       the sun on its own (icons, avatars)
 *  - <LogoWordmark />  "Sunrise / TECH ORIGIN" on its own
 *
 * Theme-aware: the wordmark is navy on day surfaces and turns white inside
 * `.theme-deep` (see .logo-word in globals.css); the sun keeps its colours.
 * Why client: useId gives every instance its own gradient ids.
 */

type Box = readonly [number, number, number, number];
const viewBox = (b: Box) => b.join(" ");

function useGradientId() {
  return `sto${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
}

function Gradients({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-rays`} gradientUnits="userSpaceOnUse" cx={SUN_DISC.cx} cy={SUN_DISC.cy} r="230">
        {LOGO_COLORS.rays.map(([o, c]) => (
          <stop key={o} offset={o} stopColor={c} />
        ))}
      </radialGradient>
      <radialGradient id={`${id}-disc`} gradientUnits="userSpaceOnUse" cx={SUN_DISC.cx} cy="192" r="120">
        {LOGO_COLORS.disc.map(([o, c]) => (
          <stop key={o} offset={o} stopColor={c} />
        ))}
      </radialGradient>
      <linearGradient id={`${id}-word`} gradientUnits="userSpaceOnUse" x1="40" y1="265" x2="330" y2="410">
        {LOGO_COLORS.word.map(([o, c]) => (
          <stop key={o} offset={o} stopColor={c} />
        ))}
      </linearGradient>
    </defs>
  );
}

function SunArt({ id }: { id: string }) {
  return (
    <>
      <g fill={`url(#${id}-rays)`}>
        {SUN_RAYS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path fill={`url(#${id}-disc)`} d={SUN_DISC.d} />
    </>
  );
}

function WordArt({ id, tagline = true }: { id: string; tagline?: boolean }) {
  return (
    <>
      <path className="logo-word" fill={`url(#${id}-word)`} fillRule="evenodd" d={WORDMARK} />
      {tagline ? (
        <>
          <path className="logo-tagline" fill={LOGO_COLORS.tagline} d={TAGLINE} />
          <path className="logo-rules" fill={LOGO_COLORS.rules} d={TAGLINE_RULES} />
        </>
      ) : null}
    </>
  );
}

/** The sun on its own. Width follows the height (about 2:1). */
export function SunMark({ className, title }: { className?: string; title?: string }) {
  const id = useGradientId();
  return (
    <svg
      viewBox={viewBox(BOX.sun)}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-auto shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <Gradients id={id} />
      <SunArt id={id} />
    </svg>
  );
}

/** "Sunrise" over ",  TECH ORIGIN , ". Width follows the height (about 3:1). */
export function LogoWordmark({ className, tagline = true }: { className?: string; tagline?: boolean }) {
  const id = useGradientId();
  const box: Box = tagline ? BOX.wordmark : [BOX.wordmark[0], BOX.wordmark[1], BOX.wordmark[2], 398.1 - BOX.wordmark[1]];
  return (
    <svg viewBox={viewBox(box)} xmlns="http://www.w3.org/2000/svg" className={cn("h-10 w-auto shrink-0", className)} aria-hidden>
      <Gradients id={id} />
      <WordArt id={id} tagline={tagline} />
    </svg>
  );
}

/** The original stacked logo: the sun rising above the wordmark. */
export function LogoFull({ className, title = siteConfig.name }: { className?: string; title?: string }) {
  const id = useGradientId();
  return (
    <svg viewBox={viewBox(BOX.logo)} xmlns="http://www.w3.org/2000/svg" className={cn("h-auto w-56", className)} role="img">
      <title>{title}</title>
      <Gradients id={id} />
      <SunArt id={id} />
      <WordArt id={id} />
    </svg>
  );
}

/**
 * Horizontal lockup used in the navigation: the sun, its base resting on the
 * wordmark's baseline. Scale it with font-size (the wordmark is 1em tall).
 * The wordmark sits in a <span> so compact layouts can hide it (admin rail).
 */
export function Logo({
  className,
  markClassName,
  href = "/",
  onClick,
}: {
  className?: string;
  markClassName?: string;
  /** Kept for call-site compatibility (no longer needed). */
  id?: string;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("group inline-flex items-end gap-[0.26em] rounded-lg text-[2.375rem] leading-none sm:text-[2.75rem]", className)}
      aria-label={`${siteConfig.name}, home`}
    >
      {/* The sun's base sits on the wordmark's baseline (22.4% up from its bottom). */}
      <SunMark
        className={cn(
          "mb-[0.224em] h-[0.7em] transition-transform duration-500 ease-out group-hover:-translate-y-[0.04em]",
          markClassName,
        )}
      />
      <span className="flex">
        <LogoWordmark className="h-[1em]" />
      </span>
    </Link>
  );
}

/** Back-compat alias: the sun mark (older call sites pass size-* classes). */
export function LogoMark({ className, title }: { className?: string; title?: string; id?: string }) {
  return <SunMark className={cn("h-auto", className)} title={title} />;
}

/** Back-compat alias for the wordmark. */
export const Wordmark = LogoWordmark;
