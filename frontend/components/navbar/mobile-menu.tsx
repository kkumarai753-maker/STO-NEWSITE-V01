"use client";

/**
 * Mobile navigation (Client Component).
 * Built on Radix Dialog for focus trapping, Escape-to-close, scroll locking
 * and correct aria-modal semantics; animated with CSS (tw-animate-css).
 * A glass panel that slides down from the top: the links, then the main
 * action and direct contact details.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Mail, Phone, X } from "lucide-react";
import { mobileNav, primaryCta } from "@/config/navigation";
import { emailHref, phoneHref, siteConfig } from "@/config/site";
import { LogoFull } from "@/components/brand/logo";
import { Button, ButtonArrow } from "@/components/ui/button";
import { SocialLinks } from "@/components/ui/social-links";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const close = () => setOpen(false);
  const phone = phoneHref();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          className="group grid size-11 place-items-center rounded-full border border-line-strong bg-white/70 text-ink backdrop-blur transition-colors hover:bg-primary-light lg:hidden"
          aria-label="Open menu"
        >
          <span className="flex w-[1.125rem] flex-col items-end gap-[5px]" aria-hidden>
            <span className="h-[1.5px] w-full rounded-full bg-current" />
            <span className="h-[1.5px] w-2/3 rounded-full bg-current transition-[width] duration-300 group-hover:w-full" />
          </span>
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-79 bg-scrim/25 backdrop-blur-[2px] data-open:animate-in data-open:fade-in-0 data-open:duration-300 data-closed:animate-out data-closed:fade-out-0 data-closed:duration-200 lg:hidden" />
        <DialogPrimitive.Content
          className="fixed inset-x-0 top-0 z-80 flex max-h-dvh flex-col overflow-y-auto overscroll-contain rounded-b-[1.75rem] border-b border-line bg-white/85 pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)] shadow-[0_24px_60px_rgb(11_21_51/0.14)] outline-none backdrop-blur-2xl backdrop-saturate-150 data-open:animate-in data-open:slide-in-from-top-6 data-open:fade-in-0 data-open:duration-300 data-closed:animate-out data-closed:slide-out-to-top-4 data-closed:fade-out-0 data-closed:duration-200 lg:hidden"
          aria-describedby={undefined}
        >
          <div className="relative isolate flex flex-col">

            <div className="container-page flex h-[var(--nav-height)] shrink-0 items-center justify-between">
              <Link href="/" onClick={close} aria-label={`${siteConfig.name}, home`} className="rounded-lg">
                <LogoFull className="h-[3.5rem] w-auto" />
              </Link>
              <DialogPrimitive.Close
                className="grid size-11 place-items-center rounded-full border border-line-strong bg-white/70 text-ink transition-colors hover:bg-primary-light"
                aria-label="Close menu"
              >
                <X className="size-[1.125rem]" />
              </DialogPrimitive.Close>
            </div>

            <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>

            <nav aria-label="Mobile" className="container-page mt-2 flex-1">
              <ul className="border-t border-line">
                {mobileNav.map((item, i) => {
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <li
                      key={item.href}
                      className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both duration-500"
                      style={{ animationDelay: `${60 + i * 35}ms` }}
                    >
                      <Link
                        href={item.href}
                        onClick={close}
                        aria-current={active ? "page" : undefined}
                        className="group flex items-baseline border-b border-line py-3"
                      >
                        <span
                          className={cn(
                            "font-display text-[1.25rem] leading-tight tracking-[-0.015em] transition-colors sm:text-2xl",
                            active ? "text-primary" : "text-ink group-hover:text-primary",
                          )}
                        >
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div
              className="container-page mt-8 flex flex-col gap-6 pb-[max(2rem,env(safe-area-inset-bottom))] animate-in fade-in-0 fill-mode-both duration-500"
              style={{ animationDelay: "360ms" }}
            >
              <Button asChild size="lg" className="w-full">
                <Link href={primaryCta.href} onClick={close}>
                  {primaryCta.label}
                  <ButtonArrow />
                </Link>
              </Button>
              <div className="grid gap-3 text-sm">
                {phone ? (
                  <a href={phone} className="inline-flex items-center gap-3 text-text-muted hover:text-text">
                    <Phone className="size-4 text-accent" aria-hidden />
                    {siteConfig.contact.phone}
                  </a>
                ) : null}
                <a href={emailHref()} className="inline-flex items-center gap-3 break-all text-text-muted hover:text-text">
                  <Mail className="size-4 shrink-0 text-accent" aria-hidden />
                  {siteConfig.contact.email}
                </a>
              </div>
              <SocialLinks size="sm" />
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
