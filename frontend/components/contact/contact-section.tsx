import { ContactForm } from "./contact-form";
import { ContactDetails } from "./contact-details";
import { SectionHeading } from "@/components/ui/section-heading";

/** Home contact section (Server Component): the closing day chapter before the footer. */
export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y section-tint relative">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id="contact-title"
            eyebrow="Let’s start something good"
            title={
              <>
                Your next chapter<br /><em>starts here.</em>
              </>
            }
            description="Tell us a little about your business and what you have in mind. We’ll help you find a practical starting point. Prefer a call, email or WhatsApp? Reach us directly."
          />
          <ContactDetails className="mt-12" />
        </div>

        <div className="lg:col-span-7" data-reveal="scale">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
