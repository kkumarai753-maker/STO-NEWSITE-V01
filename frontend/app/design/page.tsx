import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesignBoard } from "@/components/dev/design-board";

export const metadata: Metadata = {
  title: "Design options",
  robots: { index: false, follow: false },
};

/**
 * Colour, logo, font and background options, an internal tool. Available in
 * development; production builds 404 unless NEXT_PUBLIC_DESIGN_LAB=on.
 */
export default function DesignPage() {
  const enabled = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_DESIGN_LAB === "on";
  if (!enabled || process.env.NEXT_PUBLIC_DESIGN_LAB === "off") notFound();
  return <DesignBoard />;
}
