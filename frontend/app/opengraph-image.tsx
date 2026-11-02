import { siteConfig } from "@/config/site";
import { ogSize, renderOgImage } from "@/lib/server/og-image";

export const alt = `${siteConfig.name}: websites, AI automation and digital marketing`;
export const size = ogSize;
export const contentType = "image/png";

/** Default social card, generated at build time. Mirrors the home hero. */
export default function OpenGraphImage() {
  return renderOgImage({
    headline: (
      <>
        <span>Build smarter.</span>
        <span style={{ color: "#FF9A3D", paddingLeft: 90 }}>Grow digitally.</span>
        <span>Operate better.</span>
      </>
    ),
    subline: siteConfig.metaDescription,
  });
}
