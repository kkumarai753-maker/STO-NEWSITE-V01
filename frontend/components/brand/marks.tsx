import type { ReactNode } from "react";
import { MARK } from "./mark";

/**
 * Ten logo emblem options (local choice via the Design options tool).
 * Every emblem is drawn on the same 64 × 64 grid, inside ~6px of padding, and
 * is painted with one `paint` value, the sunrise gradient (`url(#…)`) or
 * `currentColor`, so each works in colour and in a single colour.
 * Ids and names live in LOGOS (lib/design-lab.ts).
 */
type Paint = string;

/** Rows of squares forming a half sun, for the "pixel" emblem. */
function pixelSun(paint: Paint) {
  const rows = [
    { n: 2, y: 10 },
    { n: 4, y: 18 },
    { n: 6, y: 26 },
    { n: 6, y: 34 },
  ];
  const squares: ReactNode[] = rows.flatMap(({ n, y }) =>
    Array.from({ length: n }, (_, i) => (
      <rect key={`${y}-${i}`} x={33 - 4 * n + i * 8} y={y} width={6} height={6} rx={1.4} fill={paint} />
    )),
  );
  return (
    <>
      {squares}
      {[0, 1, 2, 3].map((i) => (
        <rect key={`b${i}`} x={13 + i * 10} y={46} width={8} height={4} rx={1.4} fill={paint} />
      ))}
    </>
  );
}

export const MARK_SHAPES: Record<string, (paint: Paint) => ReactNode> = {
  /** 1, The current emblem: half sun above three thinning reflection lines. */
  horizon: (p) => <path d={MARK.path} fill={p} />,

  /** 2, Half sun resting on two solid horizon bars. */
  arc: (p) => (
    <>
      <path d="M8 36A24 24 0 0 1 56 36Z" fill={p} />
      <rect x="8" y="41" width="48" height="5.5" rx="2.75" fill={p} />
      <rect x="16" y="50.5" width="32" height="5.5" rx="2.75" fill={p} />
    </>
  ),

  /** 3, Concentric half rings, like light spreading across the sky. */
  rings: (p) => (
    <>
      <path d="M26 50A6 6 0 0 1 38 50Z" fill={p} />
      <path d="M17 50A15 15 0 0 1 47 50" fill="none" stroke={p} strokeWidth="5" />
      <path d="M9 50A23 23 0 0 1 55 50" fill="none" stroke={p} strokeWidth="5" />
      <rect x="6" y="53" width="52" height="4" rx="2" fill={p} />
    </>
  ),

  /** 4, App-style rounded tile with the sun cut out of it. */
  tile: (p) => (
    <path
      fillRule="evenodd"
      fill={p}
      d="M14 6h36a8 8 0 0 1 8 8v36a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8V14a8 8 0 0 1 8-8ZM18 38A14 14 0 0 1 46 38ZM18 41.5H46V45H18ZM22 48.5H42V51.5H22Z"
    />
  ),

  /** 5, Sun rising between two hills. */
  valley: (p) => (
    <>
      <circle cx="32" cy="23" r="10" fill={p} />
      <path d="M5 57C14 38 27 38 34 48C40 40 50 41 59 57Z" fill={p} />
    </>
  ),

  /** 6, A half sun built from pixels: technology meets sunrise. */
  pixel: (p) => pixelSun(p),

  /** 7, A doorway to a new day: arch with a sun and light slits. */
  arch: (p) => (
    <path
      fillRule="evenodd"
      fill={p}
      d="M12 57V29A20 20 0 0 1 52 29V57ZM22 44A10 10 0 0 1 42 44ZM22 47H42V50H22ZM22 52.5H42V55H22Z"
    />
  ),

  /** 8, Stacked upward chevrons: growth, with a sun above. */
  ascent: (p) => (
    <>
      <circle cx="32" cy="12" r="5" fill={p} />
      <path d="M10 36L32 22L54 36" fill="none" stroke={p} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 51L32 40L48 51" fill="none" stroke={p} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  /** 9, A flowing "S" for Sunrise. */
  monogram: (p) => (
    <path
      d="M47 21C47 11 17 11 17 24C17 36 47 28 47 41C47 54 17 53 17 43"
      fill="none"
      stroke={p}
      strokeWidth="7.5"
      strokeLinecap="round"
    />
  ),

  /** 10, Hexagon (the shape of a technology cell) holding a rising sun. */
  hex: (p) => (
    <>
      <path d="M32 6L54.5 19V45L32 58L9.5 45V19Z" fill="none" stroke={p} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M21 39A11 11 0 0 1 43 39Z" fill={p} />
      <rect x="21" y="43" width="22" height="3.5" rx="1.75" fill={p} />
    </>
  ),
};
