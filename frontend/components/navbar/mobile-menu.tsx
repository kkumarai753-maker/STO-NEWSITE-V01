"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Dialog } from "radix-ui";
import { ArrowUpRight, Mail, Menu, Phone, X } from "lucide-react";
import { LogoFull } from "@/components/brand/logo";
import { emailHref, phoneHref, siteConfig } from "@/config/site";

import { serviceCategories } from "@/data/service-categories";

const groups = [
  {
    label: "Services",
    items: [
      ...serviceCategories.map((c) => [c.name, `/services/${c.id}`]),
      ["Build Your Proposal", "/build-your-proposal"],
    ],
  },
  {
    label: "Explore Sunrise",
    items: [
      ["Home", "/"],
      ["Website Templates", "/templates"],
      ["Our Services", "/services"],
      ["About Us", "/about"],
      ["How We Work", "/how-we-work"],
    ],
  },
  {
    label: "Good to know",
    items: [
      ["Blog & Insights", "/blog"],
      ["FAQs", "/faq"],
      ["Feedback", "/feedback"],
      ["Contact", "/contact"],
    ],
  },
  {
    label: "Policies",
    items: [
      ["Terms & Conditions", "/terms"],
      ["Privacy Policy", "/privacy"],
      ["Cookie Policy", "/cookies"],
      ["Careers", "/careers"],
    ],
  },
];

export function MobileMenu({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const phone = phoneHref();
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className={`grid size-12 place-items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${transparent ? "border-transparent bg-transparent text-[#071a35] hover:bg-white/20" : "border-line-strong bg-white text-text hover:bg-primary-light"}`}
        >
          <Menu className="size-6" strokeWidth={1.75} aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-79 bg-[#071a35]/40 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 motion-reduce:animate-none" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 left-0 z-80 flex w-[min(26rem,100vw)] flex-col overflow-y-auto border-r border-line bg-white p-6 shadow-2xl outline-none data-open:animate-in data-open:slide-in-from-left-4 motion-reduce:animate-none sm:p-8"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-line pb-5">
            <Dialog.Close
              aria-label="Close menu"
              className="grid size-11 place-items-center rounded-full border border-line text-text"
            >
              <X className="size-5" aria-hidden />
            </Dialog.Close>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-label={`${siteConfig.name}, home`}
            >
              <LogoFull className="h-14 w-auto" />
            </Link>
          </div>
          <Dialog.Title className="sr-only">Sunrise navigation</Dialog.Title>
          <nav aria-label="Site menu" className="py-5">
            {groups.map((group) => (
              <div key={group.label} className="mb-6 last:mb-0">
                <p className="mb-2 text-[10px] font-semibold tracking-[0.15em] text-text-subtle uppercase">
                  {group.label}
                </p>
                <ul>
                  {group.items.map(([label, href]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        aria-current={pathname === href ? "page" : undefined}
                        className={`flex min-h-11 items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-light ${pathname === href ? "bg-primary-light text-[#0e4fcc]" : "text-text"}`}
                      >
                        {label}
                        <ArrowUpRight
                          className="size-3.5 text-text-subtle"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="mt-auto space-y-3 border-t border-line pt-5 text-sm">
            <a
              href={emailHref()}
              className="flex min-h-11 items-center gap-3 break-all text-text-muted"
            >
              <Mail className="size-4 shrink-0 text-primary" aria-hidden />
              {siteConfig.contact.email}
            </a>
            {phone ? (
              <a
                href={phone}
                className="flex min-h-11 items-center gap-3 text-text-muted"
              >
                <Phone className="size-4 text-primary" aria-hidden />
                {siteConfig.contact.phone}
              </a>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
