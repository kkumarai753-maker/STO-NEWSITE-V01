"use client";

import dynamic from "next/dynamic";

// Design options tool: rendered unless NEXT_PUBLIC_DESIGN_LAB=off (see
// app/layout.tsx). Loaded lazily in its own chunk, after the page is interactive.
const DesignLab = dynamic(() => import("./design-lab").then((m) => m.DesignLab), { ssr: false });

export function DesignLabLoader() {
  return <DesignLab />;
}
