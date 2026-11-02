import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/server/admin-session";
import { adminRequest } from "@/lib/server/admin-api";
import {
  categoryName,
  hiringStatuses,
  type CareerApplication,
} from "@/lib/careers";
import { updateApplication, deleteApplication } from "../../actions";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { token } = await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const result = await adminRequest<CareerApplication>(
    `/careers/applications/${encodeURIComponent(id)}`,
    { token },
  );
  if (!result.ok) {
    if (result.status === 404) notFound();
    throw Error("Application unavailable.");
  }
  const app = result.data;
  const details = {
    ...app.candidate,
    reference: app.id,
    role: app.role_title,
    category: categoryName(app.category),
    type: app.kind,
    submitted: app.created_at,
    consent_time: app.consent_at,
    retention_expiry: app.expires_at,
    selected_route: app.route,
    email_status: app.email_status,
    email_attempt: app.email_attempt_at,
    whatsapp_handoff: app.whatsapp_handoff_at,
  };
  return (
    <div className="space-y-8">
      <Link href="/admin/recruitment" className="text-primary underline">
        Back to Recruitment
      </Link>
      <h1 className="text-heading-1">{app.candidate.name}</h1>
      <p>
        {app.role_title} · {categoryName(app.category)}
      </p>
      <p className="text-sm text-text-muted">
        Work from Office · Nagpur, Maharashtra, India
      </p>
      {query.saved && <p role="status">Application updated.</p>}
      <dl className="grid gap-5 rounded-2xl border border-line bg-white p-6 sm:grid-cols-2">
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className="min-w-0">
            <dt className="text-xs font-semibold text-text-muted">
              {key.replaceAll("_", " ")}
            </dt>
            <dd className="mt-1 whitespace-pre-wrap break-words">
              {String(value ?? "—")}
            </dd>
          </div>
        ))}
      </dl>
      {app.has_resume && (
        <a
          className="inline-block rounded-full bg-primary px-6 py-3 font-semibold text-white"
          href={`/admin/recruitment/applications/${app.id}/resume`}
        >
          Download private CV
        </a>
      )}
      <p className="text-sm text-text-muted">
        A WhatsApp handoff records the chosen route, not message delivery. Email
        submitted means provider acceptance, not recipient delivery.
      </p>
      <form
        action={updateApplication}
        className="space-y-5 rounded-2xl border border-line p-6"
      >
        <input type="hidden" name="id" value={app.id} />
        <label className="block">
          Hiring status
          <select
            name="status"
            defaultValue={app.status}
            className="mt-2 block rounded-xl border border-line bg-white p-3"
          >
            {hiringStatuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block">
          Internal notes
          <textarea
            name="notes"
            defaultValue={app.notes}
            maxLength={10000}
            rows={6}
            className="mt-2 w-full rounded-xl border border-line bg-white p-3"
          />
        </label>
        <button className="rounded-full bg-primary px-6 py-3 font-semibold text-white">
          Save review
        </button>
      </form>
      <form
        action={deleteApplication}
        className="space-y-4 rounded-2xl border border-line p-6"
      >
        <input type="hidden" name="id" value={app.id} />
        <label className="flex gap-3">
          <input type="checkbox" required name="confirm" value="yes" />
          Permanently delete this application and its private CV.
        </label>
        <button className="rounded-full border border-red-300 px-5 py-3 font-semibold text-red-800">
          Delete application
        </button>
      </form>
    </div>
  );
}
