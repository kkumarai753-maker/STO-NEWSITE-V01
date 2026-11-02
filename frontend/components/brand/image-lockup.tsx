/* eslint-disable @next/next/no-img-element -- next/og (Satori) renders plain <img> with data URIs */
import { BOX } from "./logo-art";
import { HORIZONTAL, appIconSvg, logoDataUri, type LogoKind, type LogoTone } from "./logo-svg";

/**
 * The logo for server-generated images (next/og ImageResponse), which only
 * understands inline styles: the vector logo is embedded as an SVG data URI.
 */
const BOXES: Record<Exclude<LogoKind, "wordmark">, readonly number[]> = {
  full: BOX.logo,
  horizontal: HORIZONTAL.box,
  mark: BOX.sun,
};

export function ImageLogo({
  kind = "full",
  tone = "color",
  width,
}: {
  kind?: Exclude<LogoKind, "wordmark">;
  tone?: LogoTone;
  width: number;
}) {
  const [, , w, h] = BOXES[kind];
  return <img src={logoDataUri(kind, tone)} width={width} height={Math.round((width * h) / w)} alt="" />;
}

/** Square app icon (navy tile with the sun). */
export function ImageAppIcon({ size, radius = 0 }: { size: number; radius?: number }) {
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(appIconSvg(size, { radius }))}`;
  return <img src={src} width={size} height={size} alt="" />;
}
