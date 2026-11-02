import Link from "next/link";
import { getCareers } from "@/lib/server/careers";
import { siteConfig } from "@/config/site";
export const metadata = {
  title: "Recruitment Privacy | Sunrise Tech Origin",
  robots: { index: false, follow: true },
};
export default async function Page() {
  const data = await getCareers();
  return (
    <section className="section-y pt-36">
      <article className="container-page max-w-3xl space-y-6">
        <Link href="/careers" className="text-primary underline">
          Back to Careers
        </Link>
        <h1 className="text-heading-1">Recruitment privacy notice</h1>
        <p>
          Sunrise Tech Origin uses the details and resume you choose to submit
          to review your application and contact you about the selected role.
          General-interest profiles are kept separately for future
          consideration, without a promise of an opening.
        </p>
        <h2 className="text-heading-3">
          What we collect and who can access it
        </h2>
        <p>
          The application includes your name, email, international phone number,
          city, chosen category and role, relevant experience, resume and any
          optional work links, availability or introduction. We record your
          consent, application reference, submission time, contact route and
          delivery status. Authorised hiring administrators can review these
          details, make internal recruitment notes and download your private
          resume.
        </p>
        <h2 className="text-heading-3">How contact routes work</h2>
        <p>
          WhatsApp click-to-chat opens a message for you to review and send; it
          does not attach your CV automatically. If enabled, the server-side
          email service submits your application and CV to{" "}
          {siteConfig.contact.email}. WhatsApp and email providers process
          information you choose to send through their services.
        </p>
        <h2 className="text-heading-3">Retention and deletion</h2>
        <p>
          {data.retention_days
            ? `Application details and resumes are scheduled for deletion ${data.retention_days} days after submission, or earlier when an authorised administrator processes a deletion request.`
            : "Online collection remains disabled until the recruitment retention period and deletion process are configured and reviewed."}{" "}
          You may request withdrawal, correction or deletion by emailing{" "}
          <a
            className="text-primary underline"
            href={`mailto:${siteConfig.contact.email}`}
          >
            {siteConfig.contact.email}
          </a>{" "}
          and quoting your application reference. We may verify your identity
          before changing or deleting a record.
        </p>
        <p>
          Do not upload identity documents, bank details or confidential client
          information. Share only information relevant to your application.
        </p>
        <p className="text-sm text-text-muted">Notice version: careers-v1.</p>
      </article>
    </section>
  );
}
