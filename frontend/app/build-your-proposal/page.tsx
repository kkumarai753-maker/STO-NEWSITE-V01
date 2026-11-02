import { Suspense } from "react";
import { connection } from "next/server";
import { ProposalForm } from "@/components/proposal/proposal-form";
import { PageHero } from "@/components/ui/page-hero";
import { pageMetadata } from "@/lib/seo";
import { isBackendConfigured } from "@/lib/server/backend";
export const metadata = pageMetadata("/build-your-proposal");
export const maxDuration = 60;
async function Form() {
  await connection();
  const deliveryAvailable =
    isBackendConfigured() ||
    Boolean(
      (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL) ||
        process.env.CONTACT_WEBHOOK_URL,
    );
  return <ProposalForm deliveryAvailable={deliveryAvailable} />;
}
export default function Page() {
  return (
    <>
      <PageHero
        path="/build-your-proposal"
        eyebrow="Choose what your business needs"
        title="Build Your Proposal"
        lead="One request, with every selected service kept under its own category."
      />
      <section className="section-y-sm">
        <div className="container-page max-w-4xl">
          <Suspense fallback={<p>Loading service selection…</p>}>
            <Form />
          </Suspense>
        </div>
      </section>
    </>
  );
}
