import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceCategory } from "@/data/service-categories";
import { getCareers } from "@/lib/server/careers";
import { RoleList } from "@/components/careers/role-list";
import { HiringContact } from "@/components/careers/hiring-contact";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const c = getServiceCategory((await params).category);
  return {
    title: c ? `${c.name} | Careers` : "Careers",
    robots: { index: false, follow: true },
  };
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ function?: string }>;
}) {
  const c = getServiceCategory((await params).category);
  if (!c) notFound();
  const data = await getCareers();
  const query = await searchParams;
  return (
    <section className="section-y pt-36">
      <div className="container-page">
        <Link href="/careers" className="text-primary underline">
          Back to Careers
        </Link>
        <h1 className="mt-6 text-heading-1">{c.name}</h1>
        <p className="mt-4 mb-8 text-text-muted">
          Work from Office · Nagpur, Maharashtra, India
        </p>
        <RoleList
          roles={data.roles}
          category={c.id}
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
