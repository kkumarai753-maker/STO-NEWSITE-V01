/**
 * Sunrise Tech Origin, official brand mark ("Horizon Emblem").
 *
 * A circle split by the horizon: the upper half is the rising sun, the lower
 * half its reflection drawn as three lines that thin towards the bottom.
 *  - Sunrise: the sun breaking the horizon.
 *  - Tech:    the precise, digital line rhythm.
 *  - Origin:  the circle, a complete, timeless form.
 *
 * Built on a 64 × 64 grid (circle r = 23, horizon at y = 33.2; the ink is set
 * slightly above centre for optical balance). The circular silhouette is made
 * for round social-media avatars.
 *
 * Colour: the emblem is the ONLY coloured element of the brand, a vertical
 * sunrise gradient (gold → orange → red). Everything else is black and white.
 * A single-colour version (black or white) exists for one-colour uses.
 *
 * Single source of truth for the React logo, the app icon and the share image.
 * app/icon.svg and public/brand/*.svg are static copies, regenerate them if
 * the geometry or colours change.
 */
export const MARK = {
  viewBox: "0 0 64 64",
  path: "M9 33.2A23 23 0 0 1 55 33.2ZM9.15 35.8H54.85A23 23 0 0 1 53.84 40.4H10.16A23 23 0 0 1 9.15 35.8ZM11.29 43.2H52.71A23 23 0 0 1 50.84 46.4H13.16A23 23 0 0 1 11.29 43.2ZM15.67 49.4H48.33A23 23 0 0 1 46.06 51.4H17.94A23 23 0 0 1 15.67 49.4Z",
} as const;

/** Brand colours of the emblem. */
export const SUNRISE = {
  gold: "#FDB813",
  orange: "#F7761E",
  red: "#D9372A",
} as const;

/** Vertical gradient across the emblem, in the 64 × 64 grid (userSpaceOnUse). */
export const SUNRISE_GRADIENT = {
  x1: 0,
  y1: 10,
  x2: 0,
  y2: 52,
  stops: [
    { offset: 0, color: SUNRISE.gold },
    { offset: 0.6, color: SUNRISE.orange },
    { offset: 1, color: SUNRISE.red },
  ],
} as const;
