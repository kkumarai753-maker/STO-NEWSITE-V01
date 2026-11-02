import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { footerNav, legalNav } from "@/config/navigation";
import { emailHref, phoneHref, siteConfig, whatsappHref } from "@/config/site";
import { LogoFull } from "@/components/brand/logo";
import { BrandIcon } from "@/components/ui/brand-icon";
import { Button, ButtonArrow } from "@/components/ui/button";
import { SocialLinks } from "@/components/ui/social-links";
import { HideOnPaths } from "./hide-on-paths";

/** Pages that already close with a form don't repeat the footer's call-to-action. */
const FORM_PAGES = ["/", "/contact", "/inquiry", "/register", "/feedback"];

/**
 * Site footer, Server Component. A deep-navy band with a soft blue glow: a
 * closing statement, then the logo and tagline, directory, contact details,
 * social icons and legal links.
 */
export function Footer() {
  const whatsapp = whatsappHref();
  const phone = phoneHref();
  const year = new Date().getFullYear();

  return (
    <footer data-site-footer="" className="theme-deep relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 -z-1 h-[28rem] w-[min(70rem,150vw)] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgb(21 101 240 / 0.28), transparent)" }}
      />

      <HideOnPaths paths={FORM_PAGES}>
        <div className="container-page pt-[clamp(5rem,3.5rem+5vw,8rem)]">
          <div className="grid gap-10 border-b border-line pb-[clamp(4rem,3rem+4vw,6.5rem)] lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="label-mono text-accent">Ready to start?</p>
              <h2 className="mt-5 text-display-2 text-text">
                Build your digital <em>growth</em> system.
              </h2>
              <p className="mt-6 max-w-xl text-lead text-text-muted">
                Explore our services, or book a free consultation.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
              <Button asChild size="lg">
                <Link href="/inquiry">
                  Book Consultation
                  <ButtonArrow />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </HideOnPaths>

      <div className="container-page relative z-1">
        <div className="grid gap-12 pt-16 pb-14 sm:pt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" aria-label={`${siteConfig.name}, home`} className="inline-block rounded-lg">
              <LogoFull className="w-52 sm:w-56" />
            </Link>
            <p className="mt-6 max-w-xs text-[0.9375rem] leading-relaxed text-text-muted">
              We help small businesses build, manage and grow their complete digital presence.
            </p>
            <SocialLinks className="mt-7" />
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-5">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="font-sans label-mono text-subtle">{group.title}</h2>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="rounded-sm text-[0.9375rem] text-text-muted transition-colors hover:text-brand"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="lg:col-span-3">
            <h2 className="font-sans label-mono text-subtle">Contact</h2>
            <ul className="mt-5 space-y-4 text-[0.9375rem]">
              <li>
                <a href={emailHref()} className="group inline-flex items-start gap-3 break-all text-text-muted transition-colors hover:text-brand">
                  <Mail className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
                  {siteConfig.contact.email}
                </a>
              </li>
              {phone ? (
                <li>
                  <a href={phone} className="inline-flex items-start gap-3 text-text-muted transition-colors hover:text-brand">
                    <Phone className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
                    <span className="numeric">{siteConfig.contact.phone}</span>
                  </a>
                </li>
              ) : null}
              {whatsapp ? (
                <li>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-3 text-text-muted transition-colors hover:text-brand"
                  >
                    <BrandIcon slug="whatsapp" className="mt-1 size-4 text-accent" />
                    Chat on WhatsApp
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ) : null}
              <li className="flex items-start gap-3 text-text-muted">
                <MapPin className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
                <span>{siteConfig.contact.location}</span>
              </li>
              <li className="flex items-start gap-3 text-text-muted">
                <Clock className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
                <span>{siteConfig.contact.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-7 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-sm transition-colors hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Signature: a readable brand wordmark, cropped by the footer’s edge. */}
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.2em] text-center font-display text-[clamp(5rem,24vw,22rem)] leading-none tracking-[-0.05em] whitespace-nowrap text-[#6d86a6] select-none"
      >
        {siteConfig.shortName}
      </p>
    </footer>
  );
}
