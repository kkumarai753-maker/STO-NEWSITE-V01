"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Renders the marketing site's chrome (navbar, footer, floating dock, design
 * tool) everywhere except the admin dashboard, which has its own header.
 * Why client: reads the current path; the children stay server-rendered.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname?.startsWith("/admin/")) return null;
  return children;
}
