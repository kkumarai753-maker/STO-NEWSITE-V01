"use client";

/**
 * Motion setup (Client Component).
 * LazyMotion + `m` components keep the motion runtime small; animation
 * features load asynchronously. `reducedMotion="user"` makes every motion
 * animation honour prefers-reduced-motion automatically.
 * Wrap only the components that animate, not the whole app, so pages without
 * motion never download it.
 */
import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
