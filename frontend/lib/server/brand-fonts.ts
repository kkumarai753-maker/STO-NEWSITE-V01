import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Geist font files for server-generated images (Open Graph image, brand
 * exports). Vendored in /assets/fonts (SIL Open Font License) so image
 * rendering never depends on a network font request.
 */
export async function loadBrandFonts() {
  const dir = join(process.cwd(), "assets", "fonts");
  const [regular, medium, semibold] = await Promise.all([
    readFile(join(dir, "Geist-Regular.ttf")),
    readFile(join(dir, "Geist-Medium.ttf")),
    readFile(join(dir, "Geist-SemiBold.ttf")),
  ]);
  return [
    { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}
