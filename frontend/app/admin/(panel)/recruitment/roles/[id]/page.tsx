import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/server/admin-session";
import { adminRequest } from "@/lib/server/admin-api";
import type { CareerRole } from "@/lib/careers";
import { RoleDetail } from "@/components/careers/role-detail";
import { RoleEditor } from "@/components/careers/role-editor";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { token } = await requireAdmin();
  const { id } = await params;
  const result = await adminRequest<{ roles: CareerRole[] }>("/careers", {
    token,
  });
  if (!result.ok) throw Error("Recruitment is unavailable.");
  const role = result.data.roles.find((r) => r.id === id);
  if (!role) notFound();
  return (
    <div className="space-y-10">
      <Link href="/admin/recruitment" className="text-primary underline">
        Back to Recruitment
      </Link>
      <h1 className="text-heading-1">{role.title}</h1>
      <RoleDetail role={role} preview />
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="mb-6 text-heading-2">Edit role</h2>
        <RoleEditor role={role} />
      </section>
    </div>
  );
}
