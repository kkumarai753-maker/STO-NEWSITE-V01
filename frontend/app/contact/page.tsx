import { Mail, Phone } from "lucide-react";
import { ContactDetails } from "@/components/contact/contact-details";
import { PageSchema } from "@/components/seo/json-ld";
import { FormPageBody } from "@/components/contact/form-page";
import { BrandIcon } from "@/components/ui/brand-icon";
import { PageHero } from "@/components/ui/page-hero";
import { emailHref, phoneHref, siteConfig, whatsappHref } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/contact");

/** The contact form's Server Action saves via the backend, which may need time to wake from sleep. */
export const maxDuration = 60;

export default function ContactPage() {
  const whatsapp = whatsappHref("Hi, I'd like to discuss a project with Sunrise Tech Origin.");
  const phone = phoneHref();

  const channels = [
    whatsapp && {
      href: whatsapp,
      external: true,
      label: "WhatsApp",
      value: "Chat with the team",
      icon: <BrandIcon slug="whatsapp" className="size-5" />,
    },
    phone && {
      href: phone,
      external: false,
      label: "Call",
      value: siteConfig.contact.phone,
      icon: <Phone className="size-5" strokeWidth={1.75} aria-hidden />,
    },
    {
      href: emailHref("Sunrise Tech Origin Enquiry"),
      external: false,
      label: "Email",
      value: siteConfig.contact.email,
      icon: <Mail className="size-5" strokeWidth={1.75} aria-hidden />,
    },
  ].filter(Boolean) as { href: string; external: boolean; label: string; value: string; icon: React.ReactNode }[];

  return (
    <>
      <PageSchema path="/contact" type="ContactPage" />
      <PageHero
        eyebrow="Let's discuss your next move"
        size="md"
        path="/contact"
        title={
          <>
            Contact Sunrise Tech <em>Origin.</em>
          </>
        }
        lead="Connect directly via phone, WhatsApp, or email, or send your requirement below to start a conversation."
        aside={
          <ul className="grid gap-2">
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-lg border border-line-strong bg-surface/60 p-4 transition-colors hover:border-text/30 hover:bg-surface"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-accent">
                    {c.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block label-mono text-subtle">{c.label}</span>
                    <span className="mt-1 block truncate font-medium text-text">{c.value}</span>
                  </span>
                  {c.external ? <span className="sr-only">(opens in a new tab)</span> : null}
                  <span
                    aria-hidden
                    className="text-text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-text"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        }
      />

      <FormPageBody
        id="contact-form-title"
        title={
          <>
            Send us a <em>message.</em>
          </>
        }
        intro="Fill in your details and our team will get back to you within 24 hours."
      >
        <ContactDetails only={["location", "hours"]} />
      </FormPageBody>
    </>
  );
}
