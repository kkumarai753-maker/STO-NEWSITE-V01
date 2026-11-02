/**
 * Sunrise Tech Origin logo as standalone SVG markup (no React).
 * One source for everything that needs the logo as a file or data URI:
 * the generated brand exports (scripts/generate-logo-assets.mjs), the app
 * icon and the Open Graph image. The site itself uses ./logo.tsx.
 */
import { BOX, LOGO_COLORS, SUN_DISC, SUN_RAYS, TAGLINE, TAGLINE_RULES, WORDMARK } from "./logo-art";

export type LogoKind = "full" | "horizontal" | "mark" | "wordmark";
/** color = original colours · white = for dark backgrounds · black/white-mono = one ink */
export type LogoTone = "color" | "white" | "black" | "white-mono";

type Box = readonly [number, number, number, number];

const r = (v: number) => Number(v.toFixed(2));

/** Horizontal lockup: the sun to the left, its base on the wordmark's baseline. */
export const HORIZONTAL = (() => {
  const [wx, wy, , wh] = BOX.wordmark;
  const baseline = 398.1; // "Sunrise" baseline in artboard units
  const k = (wh * 0.7) / BOX.sun[3]; // keep in step with <Logo /> in ./logo.tsx
  const gap = wh * 0.26;
  const sunW = BOX.sun[2] * k;
  const tx = wx - gap - sunW - BOX.sun[0] * k;
  const ty = baseline - SUN_DISC.base * k;
  const box: Box = [r(wx - gap - sunW), wy, r(BOX.wordmark[0] + BOX.wordmark[2] - (wx - gap - sunW)), wh];
  return { k: r(k), tx: r(tx), ty: r(ty), box };
})();

function stops(list: readonly (readonly [number, string])[]) {
  return list.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("");
}

function defs(id: string) {
  return (
    `<defs>` +
    `<radialGradient id="${id}-rays" gradientUnits="userSpaceOnUse" cx="${SUN_DISC.cx}" cy="${SUN_DISC.cy}" r="230">${stops(LOGO_COLORS.rays)}</radialGradient>` +
    `<radialGradient id="${id}-disc" gradientUnits="userSpaceOnUse" cx="${SUN_DISC.cx}" cy="192" r="120">${stops(LOGO_COLORS.disc)}</radialGradient>` +
    `<linearGradient id="${id}-word" gradientUnits="userSpaceOnUse" x1="40" y1="265" x2="330" y2="410">${stops(LOGO_COLORS.word)}</linearGradient>` +
    `</defs>`
  );
}

function paints(tone: LogoTone, id: string) {
  switch (tone) {
    case "white":
      return { rays: `url(#${id}-rays)`, disc: `url(#${id}-disc)`, word: "#FFFFFF", tagline: "#D6DEEC", rules: "#8FA3C4" };
    case "black":
      return { rays: "#0A1B33", disc: "#0A1B33", word: "#0A1B33", tagline: "#0A1B33", rules: "#0A1B33" };
    case "white-mono":
      return { rays: "#FFFFFF", disc: "#FFFFFF", word: "#FFFFFF", tagline: "#FFFFFF", rules: "#FFFFFF" };
    default:
      return {
        rays: `url(#${id}-rays)`,
        disc: `url(#${id}-disc)`,
        word: `url(#${id}-word)`,
        tagline: LOGO_COLORS.tagline,
        rules: LOGO_COLORS.rules,
      };
  }
}

function sun(p: ReturnType<typeof paints>) {
  return `<g fill="${p.rays}">${SUN_RAYS.map((d) => `<path d="${d}"/>`).join("")}</g><path fill="${p.disc}" d="${SUN_DISC.d}"/>`;
}

function words(p: ReturnType<typeof paints>) {
  return (
    `<path fill="${p.word}" fill-rule="evenodd" d="${WORDMARK}"/>` +
    `<path fill="${p.tagline}" d="${TAGLINE}"/>` +
    `<path fill="${p.rules}" d="${TAGLINE_RULES}"/>`
  );
}

/**
 * SVG markup for a logo variant. `pad` adds breathing room (artboard units)
 * and `background` paints a rectangle behind it (transparent by default).
 */
export function logoSvg(
  kind: LogoKind,
  tone: LogoTone = "color",
  { width, pad = 0, background, title = "Sunrise Tech Origin" }: { width?: number; pad?: number; background?: string; title?: string } = {},
) {
  const id = `sto-${kind}-${tone}`;
  const p = paints(tone, id);
  const box: Box = kind === "full" ? BOX.logo : kind === "mark" ? BOX.sun : kind === "wordmark" ? BOX.wordmark : HORIZONTAL.box;
  const [x, y, w, h] = [box[0] - pad, box[1] - pad, box[2] + pad * 2, box[3] + pad * 2];
  const body =
    kind === "mark"
      ? sun(p)
      : kind === "wordmark"
        ? words(p)
        : kind === "full"
          ? sun(p) + words(p)
          : `<g transform="matrix(${HORIZONTAL.k} 0 0 ${HORIZONTAL.k} ${HORIZONTAL.tx} ${HORIZONTAL.ty})">${sun(p)}</g>${words(p)}`;
  const size = width ? ` width="${width}" height="${r((width * h) / w)}"` : "";
  const bg = background ? `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${background}"/>` : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(x)} ${r(y)} ${r(w)} ${r(h)}"${size} role="img" aria-label="${title}">` +
    `<title>${title}</title>${defs(id)}${bg}${body}</svg>`
  );
}

/** The logo as a data URI, for <img> in generated images (Open Graph, icons). */
export function logoDataUri(...args: Parameters<typeof logoSvg>) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(logoSvg(...args))}`;
}

/**
 * Square app icon: the sun on a navy tile. `radius` rounds the tile
 * (0 for platforms that apply their own mask, e.g. iOS).
 */
export function appIconSvg(size = 512, { radius = 0.22, background = "#0A1B38" } = {}) {
  const [sx, sy, sw, sh] = BOX.sun;
  const inner = 0.74; // sun width as a share of the tile
  const s = (size * inner) / sw;
  const tx = (size - sw * s) / 2 - sx * s;
  const ty = (size - sh * s) / 2 - sy * s + size * 0.04; // optically centred (rays are light)
  const id = "sto-icon";
  const p = paints("color", id);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
    `${defs(id)}<rect width="${size}" height="${size}" rx="${r(size * radius)}" fill="${background}"/>` +
    `<g transform="matrix(${r(s)} 0 0 ${r(s)} ${r(tx)} ${r(ty)})">${sun(p)}</g></svg>`
  );
}
