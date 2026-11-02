import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { AdminPageHeader, Card, CardHeader } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/admin";
import { requireAdmin } from "@/lib/server/admin-session";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const { admin } = await requireAdmin();
  const tz = admin.timezone;
  const details: [string, string][] = [
    ["Name", admin.name || "Not set"],
    ["Email", admin.email],
    ["Last sign-in", admin.last_login_at ? formatDateTime(admin.last_login_at, tz) : "Not recorded"],
    ["Password last changed", formatDateTime(admin.password_changed_at, tz)],
  ];

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader eyebrow="Settings" title="Account settings" description="Your admin account and password." />

      <div className="grid items-start gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader title="Account" />
          <dl className="mt-3 divide-y divide-line border-t border-line">
            {details.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5 px-5 py-3.5 sm:px-6">
                <dt className="text-xs text-subtle">{label}</dt>
                <dd className="text-sm break-all text-text">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader
            title="Change password"
            description="After you change it, any other devices signed in to this account are signed out."
          />
          <div className="p-5 sm:p-6">
            <ChangePasswordForm />
          </div>
        </Card>
      </div>
    </div>
  );
}
