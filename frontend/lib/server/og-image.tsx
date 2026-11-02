import "server-only";
import type { ReactNode } from "react";
import { ImageResponse } from "next/og";
import { ImageLogo } from "@/components/brand/image-lockup";
import { loadBrandFonts } from "@/lib/server/brand-fonts";

export const ogSize = { width: 1200, height: 630 };

/**
 * Open Graph / social card in the brand style (DESIGN.md §2): night
 * background, the logo, a headline and a sunrise on the horizon. Geist only;
 * the vendored font files keep rendering offline-safe.
 */
export async function renderOgImage({
  kicker,
  headline,
  subline,
}: {
  kicker?: string;
  /** Large text. Wrap words in <span style={{ color: "#FF9A3D" }}> for the accent. */
  headline: ReactNode;
  subline: string;
}) {
  const fonts = await loadBrandFonts();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px 112px",
          position: "relative",
          backgroundColor: "#0A1B38",
          backgroundImage:
            "radial-gradient(ellipse 46% 70% at 50% 100%, rgba(255,217,34,0.30), rgba(253,138,11,0.18) 40%, rgba(242,106,16,0.07) 62%, transparent 78%)",
          color: "#F5F7FB",
          fontFamily: "Geist",
        }}
      >
        <ImageLogo kind="horizontal" tone="white" width={300} />

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {kicker ? (
            <div style={{ display: "flex", fontSize: 24, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", color: "#FF9A3D" }}>
              {kicker}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 500,
              lineHeight: 1.04,
              letterSpacing: -3,
            }}
          >
            {headline}
          </div>
          <div style={{ fontSize: 26, fontWeight: 400, color: "#B4C0D6" }}>{subline}</div>
        </div>

        {/* Horizon line and its reflections */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 64,
            height: 2,
            display: "flex",
            backgroundImage:
              "linear-gradient(to right, transparent, rgba(255,217,34,0.7) 22%, #FD8A0B 50%, rgba(242,106,16,0.7) 78%, transparent)",
          }}
        />
        {[
          { bottom: 50, width: 640, opacity: 0.55 },
          { bottom: 38, width: 400, opacity: 0.35 },
          { bottom: 26, width: 190, opacity: 0.25 },
        ].map((r) => (
          <div
            key={r.bottom}
            style={{
              position: "absolute",
              left: 600 - r.width / 2,
              width: r.width,
              bottom: r.bottom,
              height: 1,
              display: "flex",
              opacity: r.opacity,
              backgroundImage: "linear-gradient(to right, transparent, #FD8A0B, transparent)",
            }}
          />
        ))}
      </div>
    ),
    { ...ogSize, fonts },
  );
}
