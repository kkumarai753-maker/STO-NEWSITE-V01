import { ContactDetails } from "@/components/contact/contact-details";
import { FormPageBody } from "@/components/contact/form-page";
import { PageHero } from "@/components/ui/page-hero";
import { pageMetadata } from "@/lib/seo";

/** A client feedback form: kept out of search results (noindex, follow). */
export const metadata = pageMetadata("/feedback");

/** The contact form's Server Action saves via the backend, which may need time to wake from sleep. */
export const maxDuration = 60;

export default function FeedbackPage() {
  return (
    <>
      <PageHero
        eyebrow="Client feedback"
        size="md"
        path="/feedback"
        title={
          <>
            Help us <em>improve.</em>
          </>
        }
        lead="Share your experience, suggestion or concern directly with our leadership team."
      />

      <FormPageBody
        id="feedback-form-title"
        title={
          <>
            Tell us how we&apos;re <em>doing.</em>
          </>
        }
        intro="Tell us what worked, what didn't, or what you'd like us to do differently. Prefer email? Write to us directly."
      >
        <ContactDetails only={["email"]} />
      </FormPageBody>
    </>
  );
}
