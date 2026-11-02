import Link from "next/link";
import { requireAdmin } from "@/lib/server/admin-session";
import { adminRequest } from "@/lib/server/admin-api";
import {
  categoryName,
  hiringStatuses,
  type CareerApplication,
  type CareerRole,
} from "@/lib/careers";
import { serviceCategories } from "@/data/service-categories";
import { purgeExpired } from "./actions";
type Config = {
  applications_enabled: boolean;
  email_enabled: boolean;
  retention_days: number | null;
  checks: Record<string, boolean>;
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { token } = await requireAdmin();
  const q = await searchParams;
  const query = new URLSearchParams();
  for (const key of ["role", "category", "status", "after", "before", "kind"]) {
    if (q[key]) query.set(key, q[key]!);
  }
  const offset = Math.max(0, Number(q.offset) || 0);
  query.set("offset", String(offset));
  const [roles, inbox] = await Promise.all([
    adminRequest<{ roles: CareerRole[]; configuration: Config }>("/careers", {
      token,
    }),
    adminRequest<{ items: CareerApplication[]; total: number }>(
      `/careers/applications?${query}`,
      { token },
    ),
  ]);
  if (!roles.ok || !inbox.ok)
    throw Error(
      "Recruitment is unavailable. Check backend migrations and configuration.",
    );
  const data = roles.data;
  const field =
    "mt-1 block max-w-full rounded-lg border border-line bg-white p-2 text-sm";
  const pageHref = (start: number) => {
    const values = new URLSearchParams(query);
    values.set("offset", String(start));
    return `/admin/recruitment?${values}`;
  };
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-heading-1">Recruitment</h1>
        <p className="mt-3 text-text-muted">
          Private hiring workspace · Work from Office · Nagpur, Maharashtra,
          India
        </p>
      </div>
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="text-heading-3">Configuration status</h2>
        <p className="mt-3">
          Website collection:{" "}
          {data.configuration.applications_enabled ? "Active" : "Inactive"} ·
          Email submission:{" "}
          {data.configuration.email_enabled ? "Enabled" : "Disabled"}
        </p>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          {Object.entries(data.configuration.checks).map(([key, value]) => (
            <li key={key}>
              {key.replaceAll("_", " ")}:{" "}
              {value ? "Ready" : "Not configured / approved"}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-text-muted">
          Review the recruitment privacy notice, retention schedule and
          notification templates before activation. No email is sent merely by
          opening this workspace.
        </p>
      </section>
      <section>
        <h2 className="text-heading-2">Role profiles</h2>
        <p className="mt-3 text-sm text-text-muted">
          13 stable profiles. Drafts are not vacancies. Edit a role to review
          its JD and change its publication status.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {data.roles.map((role) => (
            <Link
              key={role.id}
              href={`/admin/recruitment/roles/${role.id}`}
              className="rounded-xl border border-line bg-white p-5"
            >
              <span className="text-xs text-primary">
                {role.id} · {role.status}
              </span>
              <h3 className="mt-2 font-semibold">{role.title}</h3>
              <p className="mt-2 text-sm text-text-muted">
                {categoryName(role.category)}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-heading-2">Protected recruitment inbox</h2>
        <form className="mt-5 flex flex-wrap items-end gap-4">
          <label className="text-sm">
            Role
            <select name="role" defaultValue={q.role ?? ""} className={field}>
              <option value="">All roles</option>
              {data.roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Category
            <select
              name="category"
              defaultValue={q.category ?? ""}
              className={field}
            >
              <option value="">All categories</option>
              {serviceCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Status
            <select
              name="status"
              defaultValue={q.status ?? ""}
              className={field}
            >
              <option value="">All statuses</option>
              {hiringStatuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Profile type
            <select name="kind" defaultValue={q.kind ?? ""} className={field}>
              <option value="">All profiles</option>
              <option value="role">Role applications</option>
              <option value="general">General interest</option>
            </select>
          </label>
          <label className="text-sm">
            From
            <input
              type="date"
              name="after"
              defaultValue={q.after}
              className={field}
            />
          </label>
          <label className="text-sm">
            To
            <input
              type="date"
              name="before"
              defaultValue={q.before}
              className={field}
            />
          </label>
          <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
            Filter
          </button>
          <Link className="py-3 text-sm underline" href="/admin/recruitment">
            Clear Filters
          </Link>
        </form>
        <p className="mt-5 text-sm">{inbox.data.total} records</p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-primary-light">
              <tr>
                {[
                  "Candidate / reference",
                  "Role / category",
                  "Submitted",
                  "Hiring status",
                ].map((s) => (
                  <th className="p-4" key={s}>
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inbox.data.items.map((app) => (
                <tr key={app.id} className="border-t border-line">
                  <td className="p-4">
                    <Link
                      className="font-semibold text-primary underline"
                      href={`/admin/recruitment/applications/${app.id}`}
                    >
                      {app.candidate.name}
                    </Link>
                    <p className="mt-1 text-xs">{app.id}</p>
                  </td>
                  <td className="p-4">
                    {app.role_title}
                    <p className="mt-1 text-xs text-text-muted">
                      {categoryName(app.category)}
                    </p>
                  </td>
                  <td className="p-4">
                    {new Date(app.created_at).toISOString().slice(0, 10)}
                  </td>
                  <td className="p-4">{app.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!inbox.data.items.length && (
          <p className="mt-5 text-text-muted">
            No applications match these filters.
          </p>
        )}
        <div className="mt-5 flex gap-5">
          {offset > 0 && (
            <Link
              href={pageHref(Math.max(0, offset - 30))}
              className="underline"
            >
              Previous
            </Link>
          )}
          {offset + 30 < inbox.data.total && (
            <Link href={pageHref(offset + 30)} className="underline">
              Next
            </Link>
          )}
        </div>
      </section>
      <section className="rounded-2xl border border-line p-6">
        <h2 className="text-heading-3">Retention cleanup</h2>
        <p className="mt-3 text-sm">
          Configured retention:{" "}
          {data.configuration.retention_days
            ? `${data.configuration.retention_days} days`
            : "Not approved"}
          . Run the scheduled cleanup command on the backend host. You can also
          remove expired records and CVs here.
        </p>
        <form action={purgeExpired} className="mt-4 space-y-4">
          <label className="flex gap-3 text-sm">
            <input type="checkbox" name="confirm" value="yes" required />
            Permanently delete expired recruitment records and their CVs.
          </label>
          <button className="rounded-full border border-line-strong px-5 py-3 text-sm font-semibold">
            Delete expired applications
          </button>
        </form>
      </section>
    </div>
  );
}
