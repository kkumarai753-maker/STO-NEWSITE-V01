/**
 * Renders every brand file from the vector logo (components/brand/logo-art.ts):
 * SVGs, high-resolution transparent PNGs, social images and the favicon.
 * Re-run after changing the artwork or the brand colours.
 *
 * Usage: node --experimental-strip-types scripts/generate-logo-assets.mjs
 */
import { register } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// The logo modules are TypeScript with extensionless relative imports (as the
// app bundler expects); resolve "./logo-art" to "./logo-art.ts" for Node.
register(
  "data:text/javascript," +
    encodeURIComponent(
      `export async function resolve(s, c, next) {
        if (/^\\.{1,2}\\//.test(s) && !/\\.[cm]?[jt]sx?$/.test(s)) {
          try { return await next(s + ".ts", c); } catch {}
        }
        return next(s, c);
      }`,
    ),
);

const { logoSvg, appIconSvg } = await import(
  pathToFileURL(path.join(root, "components/brand/logo-svg.ts")).href
);

const NAVY = "#0A1B38";
const out = (...p) => path.join(root, ...p);
mkdirSync(out("public/brand"), { recursive: true });

const files = [];
const svg = (file, markup) => {
  writeFileSync(out(file), markup + "\n");
  files.push(file);
};
const png = async (file, markup, width, extra = {}) => {
  let img = sharp(Buffer.from(markup), { density: 72 * 4 }).resize({ width });
  if (extra.flatten) img = img.flatten({ background: extra.flatten });
  await img.png({ compressionLevel: 9 }).toFile(out(file));
  files.push(file);
};

// ---- Logos (transparent) ---------------------------------------------------
svg("public/brand/sunrise-tech-origin-logo.svg", logoSvg("full", "color"));
svg("public/brand/sunrise-tech-origin-logo-white.svg", logoSvg("full", "white"));
svg("public/brand/sunrise-tech-origin-logo-horizontal.svg", logoSvg("horizontal", "color"));
svg("public/brand/sunrise-tech-origin-logo-horizontal-white.svg", logoSvg("horizontal", "white"));
await png("public/brand/sunrise-tech-origin-logo.png", logoSvg("full", "color", { pad: 12 }), 2400);
await png("public/brand/sunrise-tech-origin-logo-white.png", logoSvg("full", "white", { pad: 12 }), 2400);
await png("public/brand/sunrise-tech-origin-logo-horizontal.png", logoSvg("horizontal", "color", { pad: 12 }), 2400);
await png("public/brand/sunrise-tech-origin-logo-horizontal-dark.png", logoSvg("horizontal", "white", { pad: 12 }), 2400);

// ---- Sun mark ----------------------------------------------------------------
svg("public/brand/sunrise-tech-origin-mark.svg", logoSvg("mark", "color"));
svg("public/brand/sunrise-tech-origin-mark-black.svg", logoSvg("mark", "black"));
svg("public/brand/sunrise-tech-origin-mark-white.svg", logoSvg("mark", "white-mono"));

// ---- Profile pictures (1080 x 1080, circle-safe) --------------------------------
svg("public/brand/sunrise-tech-origin-profile-picture-black.svg", appIconSvg(1080, { radius: 0, background: NAVY }));
svg("public/brand/sunrise-tech-origin-profile-picture-white.svg", appIconSvg(1080, { radius: 0, background: "#FFFFFF" }));
await png("public/brand/sunrise-tech-origin-profile-picture-black.png", appIconSvg(1080, { radius: 0, background: NAVY }), 1080);
await png("public/brand/sunrise-tech-origin-profile-picture-white.png", appIconSvg(1080, { radius: 0, background: "#FFFFFF" }), 1080);

// ---- Cover (Facebook / LinkedIn, 1640 x 624) ------------------------------------
{
  const W = 1640, H = 624;
  const logo = await sharp(Buffer.from(logoSvg("full", "white")), { density: 72 * 4 }).resize({ height: 380 }).png().toBuffer();
  const meta = await sharp(logo).metadata();
  const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><radialGradient id="g" cx="50%" cy="100%" r="62%">
      <stop offset="0" stop-color="#FFD922" stop-opacity="0.32"/>
      <stop offset="0.4" stop-color="#FD8A0B" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#FD8A0B" stop-opacity="0"/>
    </radialGradient></defs>
    <rect width="100%" height="100%" fill="${NAVY}"/><rect width="100%" height="100%" fill="url(#g)"/></svg>`;
  await sharp(Buffer.from(bg))
    .composite([{ input: logo, left: Math.round((W - meta.width) / 2), top: Math.round((H - meta.height) / 2) }])
    .png({ compressionLevel: 9 })
    .toFile(out("public/brand/sunrise-tech-origin-cover.png"));
  files.push("public/brand/sunrise-tech-origin-cover.png");
}

// ---- Favicon -------------------------------------------------------------------
svg("app/icon.svg", appIconSvg(64, { radius: 0.22, background: NAVY }));

console.log(`Wrote ${files.length} files:\n  ${files.join("\n  ")}`);
