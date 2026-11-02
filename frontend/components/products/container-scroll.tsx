"use client";

/**
 * Adapted from Aceternity UI "Container Scroll Animation".
 * Why client: reads scroll progress to tilt the device frame from a 3D
 * perspective to flat as it enters the viewport. Uses motion values only
 * (no React re-renders while scrolling).
 */
import { useRef, type ReactNode } from "react";
import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { MotionProvider } from "@/components/providers/motion-provider";

export function ContainerScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <MotionProvider>
      <div ref={ref} className="relative [perspective:1400px]">
        <m.div
          style={{ rotateX, scale, y, transformOrigin: "50% 0%" }}
          className="relative mx-auto w-full rounded-[1.75rem] bg-ink p-1.5 shadow-lg ring-1 ring-black/40 will-change-transform sm:p-2.5"
        >
          {/* Device bezel highlight */}
          <span aria-hidden className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />
          <div className="overflow-hidden rounded-[1.3rem] bg-bg">{children}</div>
        </m.div>
      </div>
    </MotionProvider>
  );
}
