import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { emailHref, phoneHref, siteConfig, whatsappHref } from "@/config/site";
import { BrandIcon } from "@/components/ui/brand-icon";
import { cn } from "@/lib/utils";

/**
 * Direct contact channels as a ruled list (Server Component). Every value
 * comes from config/site.ts; channels left empty there are skipped.
 */
type Channel = "email" | "phone" | "whatsapp" | "location" | "hours";

export function ContactDetails({ className, only }: { className?: string; only?: Channel[] }) {
  const show = (c: Channel) => !only || only.includes(c);
  const whatsapp = show("whatsapp") ? whatsappHref() : null;
  const phone = show("phone") ? phoneHref() : null;

  return (
    <dl className={cn("glass-card rounded-3xl px-6 py-2 sm:px-7", className)} data-reveal="">
      {show("email") ? (
        <Row icon={Mail} label="Email">
          <a href={emailHref("Project enquiry")} className="break-all text-text underline decoration-line-strong underline-offset-[0.25em] transition-colors hover:decoration-text">
            {siteConfig.contact.email}
          </a>
        </Row>
      ) : null}
      {phone ? (
        <Row icon={Phone} label="Phone">
          <a href={phone} className="text-text numeric underline decoration-line-strong underline-offset-[0.25em] transition-colors hover:decoration-text">
            {siteConfig.contact.phone}
          </a>
        </Row>
      ) : null}
      {whatsapp ? (
        <Row brand="whatsapp" label="WhatsApp">
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text underline decoration-line-strong underline-offset-[0.25em] transition-colors hover:decoration-text"
          >
            Chat with the team<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Row>
      ) : null}
      {show("location") ? (
        <Row icon={MapPin} label="Location">
          {siteConfig.contact.location}
        </Row>
      ) : null}
      {show("hours") ? (
        <Row icon={Clock} label="Hours">
          {siteConfig.contact.hours}
        </Row>
      ) : null}
    </dl>
  );
}

function Row({
  icon: Icon,
  brand,
  label,
  children,
}: {
  icon?: LucideIcon;
  brand?: "whatsapp";
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] items-baseline gap-3 border-b border-line py-4 text-[0.9375rem] last:border-b-0 sm:grid-cols-[8.5rem_1fr]">
      <dt className="flex items-center gap-3 label-mono text-subtle">
        {brand ? (
          <BrandIcon slug={brand} className="size-4 text-accent" />
        ) : Icon ? (
          <Icon className="size-4 text-accent" aria-hidden />
        ) : null}
        {label}
      </dt>
      <dd className="min-w-0 text-text-muted">{children}</dd>
    </div>
  );
}
