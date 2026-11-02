import Link from "next/link";
import { getCareers } from "@/lib/server/careers";
import { RoleList } from "@/components/careers/role-list";
import { HiringContact } from "@/components/careers/hiring-contact";
export const metadata = {
  title: "Open Roles | Careers",
  robots: { index: false, follow: true },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ function?: string }>;
}) {
  const data = await getCareers();
  const query = await searchParams;
  return (
    <section className="section-y pt-36">
      <div className="container-page">
        <Link href="/careers" className="text-primary underline">
          Back to Careers
        </Link>
        <h1 className="mt-6 text-heading-1">Open roles</h1>
        <p className="mt-4 mb-8 text-text-muted">
          Work from Office · Nagpur, Maharashtra, India
        </p>
        <RoleList
          roles={data.roles}
          functionFilter={query.function}
          available={data.available}
        />
        <div className="mt-12">
          <HiringContact />
        </div>
      </div>
    </section>
  );
}
