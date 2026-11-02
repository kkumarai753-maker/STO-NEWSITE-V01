"use client";

/**
 * Site navigation (Client Component).
 * Why client: scroll-dependent styling, the current-page indicator and the
 * mobile menu's open state.
 *
 * Transparent over each page's hero, settling into a white glass bar (blur
 * plus a soft shadow) once the page scrolls.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { mainNav, primaryCta, type NavItem } from "@/config/navigation";
import { LogoFull } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";
import { Button, ButtonArrow } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./mobile-menu";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function isCurrent(item: NavItem, path: string) {
  if (item.href === "/") return path === "/";
  return [item.href, ...(item.match ?? [])].some((p) => path === p || path.startsWith(`${p}/`));
}

export function Navbar() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 16);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      data-site-header=""
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)] transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-line bg-white/75 shadow-[0_8px_30px_rgb(11_21_51/0.06)] backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only rounded-full bg-text px-4 py-2 text-sm font-medium text-bg focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-60"
      >
        Skip to content
      </a>
      <div className="container-page flex h-[var(--nav-height)] items-center justify-between gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        {/* Same stacked logo as the footer */}
        <Link href="/" aria-label={`${siteConfig.name}, home`} className="shrink-0 justify-self-start rounded-lg">
          <LogoFull className="h-[3.5rem] w-auto sm:h-[4.25rem]" />
        </Link>

        <DesktopLinks currentPath={pathname} />

        <div className="flex items-center gap-2 lg:justify-self-end">
          <Button asChild size="sm" magnetic className="hidden sm:inline-flex">
            <Link href={primaryCta.href}>
              {primaryCta.label}
              <ButtonArrow />
            </Link>
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function DesktopLinks({ currentPath }: { currentPath: string }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list || !hovered) return setIndicator(null);
    const el = list.querySelector<HTMLElement>(`[data-href="${hovered}"]`);
    if (!el) return setIndicator(null);
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [hovered]);

  useIsoLayoutEffect(measure, [measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul ref={listRef} className="relative flex items-center gap-0.5" onMouseLeave={() => setHovered(null)}>
        {/* Hover pill that glides between links */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-0 h-full rounded-full bg-primary-light transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            indicator ? "opacity-100" : "opacity-0",
          )}
          style={{ width: indicator?.width ?? 0, transform: `translateX(${indicator?.left ?? 0}px)` }}
        />
        {mainNav.map((item) => {
          const active = isCurrent(item, currentPath);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                data-href={item.href}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => setHovered(item.href)}
                onFocus={() => setHovered(item.href)}
                onBlur={() => setHovered(null)}
                className={cn(
                  "relative z-10 flex h-10 items-center rounded-full px-3 text-[0.875rem] font-medium transition-colors duration-200 xl:px-3.5 xl:text-[0.9375rem]",
                  active ? "text-primary" : "text-ink hover:text-primary",
                )}
              >
                {item.label}
                {/* Current page: a 20px blue bar under the label */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-0.5 left-1/2 h-[3px] w-5 -translate-x-1/2 rounded-full bg-primary transition-[opacity,transform] duration-300",
                    active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
