import Link from "next/link";
import { notFound } from "next/navigation";
import { getCareers } from "@/lib/server/careers";
import { RoleDetail } from "@/components/careers/role-detail";
import { HiringContact } from "@/components/careers/hiring-contact";
import { categoryName } from "@/lib/careers";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const data = await getCareers();
  const { slug } = await params;
  const role = data.roles.find((r) => r.slug === slug);
  return {
    title: role ? `${role.title} | Careers` : "Careers",
    description: role?.summary,
    robots: { index: false, follow: true },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCareers();
  const role = data.roles.find((r) => r.slug === slug);
  if (!role) notFound();
  return (
    <section className="section-y pt-36">
      <div className="container-page">
        <Link
          href={`/careers/category/${role.category}`}
          className="text-primary underline"
        >
          Back to roles: {categoryName(role.category)}
        </Link>
        <p className="mt-8 text-sm font-semibold text-primary">
          {categoryName(role.category)}
        </p>
        <h1 className="mt-4 mb-10 text-heading-1">{role.title}</h1>
        <RoleDetail role={role} />
        <div className="mt-12">
          <HiringContact />
        </div>
      </div>
    </section>
  );
}
