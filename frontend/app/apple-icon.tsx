import { ImageResponse } from "next/og";
import { ImageAppIcon } from "@/components/brand/image-lockup";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon: the logo's sun on a navy tile (iOS applies its own rounding). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <ImageAppIcon size={180} />
      </div>
    ),
    size,
  );
}
