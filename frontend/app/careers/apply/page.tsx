import Link from "next/link";
import { getCareers } from "@/lib/server/careers";
import { ApplicationForm } from "@/components/careers/application-form";
import { HiringContact } from "@/components/careers/hiring-contact";
export const metadata = {
  title: "Apply to Sunrise Tech Origin | Careers",
  robots: { index: false, follow: true },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    role?: string;
    interest?: string;
    category?: string;
  }>;
}) {
  const data = await getCareers();
  const query = await searchParams;
  const general = query.interest === "general";
  return (
    <section className="section-y pt-36">
      <div className="container-page max-w-4xl">
        <Link href="/careers/roles" className="text-primary underline">
          Back to roles
        </Link>
        <h1 className="mt-6 text-heading-1">
          {general
            ? "Share your profile for future consideration"
            : "Apply to Sunrise Tech Origin"}
        </h1>
        <p className="mt-4 text-text-muted">
          Work from Office · Nagpur, Maharashtra, India
        </p>
        {general && (
          <p className="mt-4 text-text-muted">
            General interest is recorded separately and does not promise an
            opening.
          </p>
        )}
        <div className="mt-10">
          {data.applications_enabled ? (
            <ApplicationForm
              roles={data.roles}
              roleId={query.role}
              initialCategory={query.category}
              general={general}
              emailEnabled={data.email_enabled}
            />
          ) : (
            <div className="rounded-2xl border border-line bg-white p-6">
              <h2 className="text-heading-3">
                Online applications are not active yet.
              </h2>
              <p className="mt-3 text-text-muted">
                We are not collecting details or CVs through this page at the
                moment. Contact our hiring team for questions.
              </p>
            </div>
          )}
        </div>
        <div className="mt-10">
          <HiringContact />
        </div>
      </div>
    </section>
  );
}
