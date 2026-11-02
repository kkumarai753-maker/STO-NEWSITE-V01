import Link from "next/link";
import { LogoFull } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";
import { MobileMenu } from "./mobile-menu";

export function Navbar() {
  return (
    <header
      data-site-header
      className="fixed inset-x-0 top-0 z-50 border-b border-line bg-white/95 pt-[env(safe-area-inset-top)] backdrop-blur-xl"
    >
      <a
        href="#main"
        className="sr-only rounded-full bg-text px-4 py-2 text-sm text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-16 focus:z-60"
      >
        Skip to content
      </a>
      <div className="container-page flex h-[var(--nav-height)] items-center justify-between gap-6">
        <MobileMenu />
        <Link
          href="/"
          aria-label={`${siteConfig.name}, home`}
          className="shrink-0 rounded-lg"
        >
          <LogoFull className="h-14 w-auto sm:h-16" />
        </Link>
      </div>
    </header>
  );
}
