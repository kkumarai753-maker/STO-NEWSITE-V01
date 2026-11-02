"use client";

/**
 * "Explore Our Services" popup (Client Component).
 * Opens a dialog listing every service instead of scrolling the page.
 * Built on Radix Dialog: focus trap, Escape to close, scroll lock, aria-modal.
 * Closes via the Close button, the backdrop or Escape.
 */
import { useRef, useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";

export function ExploreServicesButton({ children = "Explore Our Services" }: { children?: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  // The open dialog locks page scroll, so "go to the form" waits until the
  // dialog has fully closed (onCloseAutoFocus) before scrolling.
  const scrollToContactAfterClose = useRef(false);
  const goToContact = () => {
    scrollToContactAfterClose.current = true;
    close();
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button size="lg" variant="secondary">
          {children}
        </Button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-70 bg-scrim/35 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Content
          onCloseAutoFocus={(e) => {
            if (!scrollToContactAfterClose.current) return; // otherwise focus returns to the button
            scrollToContactAfterClose.current = false;
            e.preventDefault();
            window.setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 50);
          }}
          className="fixed top-1/2 left-1/2 z-80 flex max-h-[min(90dvh,48rem)] w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_30px_80px_-24px_rgb(15_23_42/0.35)] outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-open:duration-300 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-closed:duration-200"
        >
          <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-8 sm:py-6">
            <div>
              <DialogPrimitive.Title className="text-2xl font-semibold tracking-[-0.03em] text-text sm:text-[1.75rem]">
                Our <span className="text-heading-soft">Services</span>
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-1.5 text-[0.9375rem] text-text-muted">
                Pick what you need and we&apos;ll take it from there.
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-line-strong bg-surface pr-3.5 pl-3 text-sm font-medium text-text shadow-[0_1px_2px_rgb(15_23_42/0.05)] transition-colors hover:bg-surface-2">
              <X className="size-4" aria-hidden />
              Close
            </DialogPrimitive.Close>
          </header>

          <ul className="grid flex-1 gap-3 overflow-y-auto p-5 sm:grid-cols-2 sm:p-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <li
                  key={service.id}
                  className="group relative flex gap-4 rounded-2xl border border-line bg-surface p-4 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow-card)]"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand/15 bg-brand/6 text-brand">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold tracking-[-0.015em] text-text">
                      {/* Stretched link: the whole card is the target, one tab stop. */}
                      <a
                        href="#contact"
                        data-service-select={service.contactValue}
                        onClick={(e) => {
                          e.preventDefault();
                          goToContact();
                        }}
                        className="after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                      >
                        {service.title}
                      </a>
                    </h3>
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-text-muted">{service.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <footer className="flex flex-col gap-3 border-t border-line bg-surface-2/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="text-sm text-text-muted">Not sure which one fits? Tell us about your idea.</p>
            <Button size="md" onClick={goToContact}>
              Start a Project
              <ArrowRight />
            </Button>
          </footer>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
