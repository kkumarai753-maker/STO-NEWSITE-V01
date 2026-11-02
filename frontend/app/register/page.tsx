import { FormPageBody, NextSteps } from "@/components/contact/form-page";
import { PageHero } from "@/components/ui/page-hero";
import { pageMetadata } from "@/lib/seo";

/** A customer onboarding form: kept out of search results (noindex, follow). */
export const metadata = pageMetadata("/register");

/** The contact form's Server Action saves via the backend, which may need time to wake from sleep. */
export const maxDuration = 60;

/** The customer journey, from registration to onboarding. */
const JOURNEY = [
  { title: "Registration", desc: "Share your details and requirement. No payment is taken at this step." },
  { title: "Quotation", desc: "We review your requirement and send a clear, itemised quotation." },
  { title: "E-sign", desc: "You approve the agreement online." },
  { title: "10% token", desc: "A booking token confirms your project slot." },
  { title: "Onboarding", desc: "We start work and keep you updated at every milestone." },
];

export default function RegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="Registration & quotation"
        size="md"
        path="/register"
        title={
          <>
            Get registered & start your <em>project.</em>
          </>
        }
        lead="Provide your details below to register your requirements, receive an official quotation, and begin onboarding."
      />

      <FormPageBody
        id="register-form-title"
        title={
          <>
            A clear, guided <em>process.</em>
          </>
        }
        intro="Registration does not confirm the project or charge any payment."
      >
        <NextSteps steps={JOURNEY} current={0} />
      </FormPageBody>
    </>
  );
}
