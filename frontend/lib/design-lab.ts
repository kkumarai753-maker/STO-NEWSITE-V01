/**
 * Design options (local preview only).
 *
 * The three palettes, font pairings and background styles the client can pick
 * from. The live values are CSS custom properties in app/globals.css, keyed by
 * the `data-palette`, `data-font`, `data-bg` and `data-logo` attributes on <html>. The
 * chooser (components/dev/*, app/design) is a development tool; production
 * builds only serve /design when NEXT_PUBLIC_DESIGN_LAB=on.
 * No React in this file: the server layout imports it too.
 */

export type DesignKey = "palette" | "font" | "bg" | "logo";

export const DEFAULTS: Record<DesignKey, string> = {
  palette: "sunrise",
  font: "jakarta",
  bg: "solid",
  logo: "horizon",
};

/** Logo emblem options. Shapes live in components/brand/marks.tsx (same ids). */
export const LOGOS: { id: string; name: string; tagline: string }[] = [
  { id: "horizon", name: "1 · Horizon", tagline: "Half sun above three thinning reflection lines. (Current.)" },
  { id: "arc", name: "2 · Rising Arc", tagline: "A bold half sun resting on two solid horizon bars." },
  { id: "rings", name: "3 · Dawn Rings", tagline: "Concentric half rings, light spreading across the sky." },
  { id: "tile", name: "4 · Sun Tile", tagline: "App-style rounded square with the sun cut out. Great as an icon." },
  { id: "valley", name: "5 · Valley", tagline: "The sun rising between two hills." },
  { id: "pixel", name: "6 · Pixel Sun", tagline: "A sun built from small squares, technology meets sunrise." },
  { id: "arch", name: "7 · Dawn Arch", tagline: "A doorway to a new day: arch with sun and light slits." },
  { id: "ascent", name: "8 · Ascent", tagline: "Stacked upward chevrons for growth, with a sun above." },
  { id: "monogram", name: "9 · Flow S", tagline: "A smooth, flowing S for Sunrise." },
  { id: "hex", name: "10 · Hex Sun", tagline: "A hexagon (a technology cell) holding a rising sun." },
];

const STORAGE_KEY = "sunrise-design-lab";
const CHANGE_EVENT = "sunrise-design-lab";

type Swatch = { name: string; hex: string; role: string };

export const PALETTES: {
  id: string;
  name: string;
  tagline: string;
  swatches: Swatch[];
}[] = [
  {
    id: "night",
    name: "Brand · Blue & Orange on Black",
    tagline: "Blue for technology, orange for sunrise & growth, on a focused black background. (Current.)",
    swatches: [
      { name: "Tech Blue", hex: "#2563EB", role: "Primary: buttons, active states" },
      { name: "Sunrise Orange", hex: "#F7761E", role: "Secondary: second tone in headings, glows" },
      { name: "Signal Blue", hex: "#3B82F6", role: "Accent for icons, links, small text" },
      { name: "Black", hex: "#0A0A0C", role: "Background" },
      { name: "Graphite", hex: "#111216", role: "Cards and panels" },
    ],
  },
  {
    id: "sunrise",
    name: "A · Sunrise Warm",
    tagline: "Taken straight from the logo. Warm, friendly and confident.",
    swatches: [
      { name: "Midnight Ink", hex: "#17120E", role: "Primary: buttons, headings" },
      { name: "Ember", hex: "#D4560F", role: "Secondary: second tone in headings" },
      { name: "Sunrise Orange", hex: "#F7761E", role: "Accent: dots, glows, highlights" },
      { name: "Burnt Orange", hex: "#C2410C", role: "Accent for icons, links, small text" },
      { name: "Warm Cream", hex: "#F8F4EF", role: "Soft background panels" },
    ],
  },
  {
    id: "midnight",
    name: "B · Midnight & Sunrise",
    tagline: "Deep navy with a royal-blue support colour and an orange spark. Trustworthy, corporate.",
    swatches: [
      { name: "Midnight Navy", hex: "#0F1B3D", role: "Primary: buttons, headings" },
      { name: "Royal Blue", hex: "#4F67E0", role: "Secondary: second tone in headings" },
      { name: "Sunrise Orange", hex: "#F7761E", role: "Accent: dots, glows, highlights" },
      { name: "Deep Blue", hex: "#2D49C9", role: "Accent for icons, links, small text" },
      { name: "Cloud", hex: "#F1F3F9", role: "Soft background panels" },
    ],
  },
  {
    id: "teal",
    name: "C · Teal & Gold",
    tagline: "Deep teal with a golden accent. Fresh, modern and distinctive.",
    swatches: [
      { name: "Deep Teal", hex: "#062F2E", role: "Primary: buttons, headings" },
      { name: "Teal", hex: "#12968A", role: "Secondary: second tone in headings" },
      { name: "Sunrise Gold", hex: "#FDB813", role: "Accent: dots, glows, highlights" },
      { name: "Dark Teal", hex: "#0F766E", role: "Accent for icons, links, small text" },
      { name: "Mist", hex: "#EFF6F5", role: "Soft background panels" },
    ],
  },
  {
    id: "mono",
    name: "Previous · Black & White",
    tagline: "The monochrome look we had before, for comparison.",
    swatches: [
      { name: "Ink", hex: "#0B0D12", role: "Primary: buttons, headings" },
      { name: "Grey", hex: "#858B97", role: "Secondary: second tone in headings" },
      { name: "White", hex: "#FFFFFF", role: "Background" },
    ],
  },
];

export const FONTS: {
  id: string;
  name: string;
  heading: string;
  body: string;
  /** CSS variables (from next/font) used for the specimen text. */
  headingVar: string;
  bodyVar: string;
  tagline: string;
}[] = [
  {
    id: "geist",
    name: "1 · Modern Clean",
    heading: "Geist",
    body: "Geist",
    headingVar: "var(--font-geist-sans)",
    bodyVar: "var(--font-geist-sans)",
    tagline: "One crisp family everywhere. Neutral, technical, very readable. (Current.)",
  },
  {
    id: "jakarta",
    name: "2 · Friendly Professional",
    heading: "Plus Jakarta Sans",
    body: "Inter",
    headingVar: "var(--font-jakarta)",
    bodyVar: "var(--font-inter)",
    tagline: "Rounded, approachable headings with the most proven body font for long reading.",
  },
  {
    id: "sora",
    name: "3 · Bold Tech",
    heading: "Sora",
    body: "DM Sans",
    headingVar: "var(--font-sora)",
    bodyVar: "var(--font-dm-sans)",
    tagline: "Wide, confident, futuristic headings with a soft, friendly body.",
  },
];

export const BACKGROUNDS: { id: string; name: string; tagline: string }[] = [
  { id: "grid", name: "Clean grid", tagline: "Fine grid on white, the look we had before." },
  { id: "solid", name: "Solid colour", tagline: "One flat brand-tinted colour. Calm and minimal." },
  { id: "glow", name: "Soft glow", tagline: "Grid plus a soft sunrise light from the corners." },
  { id: "living", name: "Living glow", tagline: "The same light, drifting very slowly. Subtle and dynamic." },
];

export const INIT_SCRIPT = `try{localStorage.removeItem("${STORAGE_KEY}");document.documentElement.dataset.palette="sunrise";}catch(e){}`;

export function readOption(key: DesignKey): string {
  return document.documentElement.dataset[key] ?? DEFAULTS[key];
}

export function setOption(key: DesignKey, value: string) {
  document.documentElement.dataset[key] = value;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...saved, [key]: value }));
  } catch {
    /* storage blocked: the choice still applies for this visit */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function resetOptions() {
  for (const key of Object.keys(DEFAULTS) as DesignKey[]) {
    document.documentElement.dataset[key] = DEFAULTS[key];
  }
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeOptions(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}
