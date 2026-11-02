"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { LogoFull } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";
import { MobileMenu } from "./mobile-menu";

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const getScrolled = () => window.scrollY > 48;
const getServerScrolled = () => false;

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribeToScroll, getScrolled, getServerScrolled);
  const home = pathname === "/";
  const transparent = home && !scrolled;

  return (
    <header
      data-site-header
      data-transparent={transparent}
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,backdrop-filter] duration-200 motion-reduce:transition-none ${transparent ? "border-b border-transparent bg-transparent" : "border-b border-line bg-white/95 backdrop-blur-xl"}`}
    >
      <a
        href="#main"
        className="sr-only rounded-full bg-text px-4 py-2 text-sm text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-16 focus:z-60"
      >
        Skip to content
      </a>
      <div className={`container-page flex h-[var(--nav-height)] items-center justify-between gap-6 ${home ? "flex-row-reverse md:flex-row" : ""}`}>
        <MobileMenu transparent={transparent} />
        <Link
          href="/"
          aria-label={`${siteConfig.name}, home`}
          className="shrink-0 rounded-lg bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {/* The mobile hero already contains the full brand lockup at top left.
              Keep its home-link target, without drawing a second logo over it. */}
          <LogoFull className={`h-14 w-auto sm:h-16 ${transparent ? "invisible md:visible md:[&_.logo-word]:fill-white md:[&_.logo-tagline]:fill-white md:[&_.logo-rules]:fill-white" : ""}`} />
        </Link>
      </div>
    </header>
  );
}
