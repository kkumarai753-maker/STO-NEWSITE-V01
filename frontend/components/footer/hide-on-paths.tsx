"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Hides server-rendered children on the given paths.
 * Why client: reads the current path. Used to drop the footer's closing
 * call-to-action on pages that already end with a form.
 */
export function HideOnPaths({ paths, children }: { paths: string[]; children: ReactNode }) {
  const pathname = usePathname();
  if (pathname && paths.includes(pathname)) return null;
  return children;
}
