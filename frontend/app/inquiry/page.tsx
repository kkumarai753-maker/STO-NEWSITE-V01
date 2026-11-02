import { ContactDetails } from "@/components/contact/contact-details";
import { FormPageBody, NextSteps } from "@/components/contact/form-page";
import { PageSchema } from "@/components/seo/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/inquiry");

/** The contact form's Server Action saves via the backend, which may need time to wake from sleep. */
export const maxDuration = 60;

const STEPS = [
  { title: "Share your idea", desc: "Tell us what you want to build or the problem to solve. A rough idea is enough." },
  { title: "We review your scope", desc: "Our team reads every request and prepares the right questions." },
  { title: "Reply within 24 hours", desc: "With a quotation, next steps or a time for your free consultation." },
];

export default function InquiryPage() {
  return (
    <>
      <PageSchema path="/inquiry" />
      <PageHero
        eyebrow="Tell us what you want to build"
        size="md"
        path="/inquiry"
        title={
          <>
            Get a quote or book a free <em>consultation.</em>
          </>
        }
        lead="Share your project idea, requirement, or request a quote. Our team will review your scope and reply within 24 hours."
      />

      <FormPageBody
        id="inquiry-form-title"
        title={
          <>
            What happens <em>next.</em>
          </>
        }
      >
        <NextSteps steps={STEPS} current={0} />
        <ContactDetails only={["phone", "whatsapp"]} className="mt-10" />
      </FormPageBody>
    </>
  );
}
