import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} | ${siteConfig.tagline}`,
    short_name: siteConfig.shortName,
    description: siteConfig.metaDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#0A1B38",
    theme_color: "#0A1B38",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
      { src: "/brand/sunrise-tech-origin-profile-picture-white.png", type: "image/png", sizes: "1080x1080", purpose: "any" },
    ],
  };
}
