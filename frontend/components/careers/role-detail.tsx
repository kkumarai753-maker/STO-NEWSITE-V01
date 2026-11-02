import { RoleArtwork } from "./role-artwork";
import Link from "next/link";
import {
  categoryName,
  officeMode,
  officeLocation,
  type CareerRole,
} from "@/lib/careers";
export function RoleDetail({
  role,
  preview = false,
}: {
  role: CareerRole;
  preview?: boolean;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <RoleArtwork role={role} />
        <p className="mt-3 text-xs text-text-muted">
          Illustration of the role’s work.
        </p>
        <p className="mt-6 font-semibold">{officeMode}</p>
        <p className="mt-2 text-text-muted">{officeLocation}</p>
        <p className="mt-4 text-sm text-text-muted">
          {categoryName(role.category)} · {role.id}
        </p>
      </div>
      <div>
        <h2 className="text-heading-2">{role.headline}</h2>
        <p className="mt-5 text-lead text-text-muted">{role.summary}</p>
        <h3 className="mt-8 text-heading-3">What you will do</h3>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-text-muted">
          {role.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3 className="mt-8 text-heading-3">Skills you bring</h3>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-text-muted">
          {role.skills.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3 className="mt-8 text-heading-3">Work samples (optional)</h3>
        <p className="mt-4 text-text-muted">{role.work_samples}</p>
        {!preview && role.status === "Open" && (
          <Link
            className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-white"
            href={`/careers/apply?role=${role.id}`}
          >
            Apply Now
          </Link>
        )}
        {preview && (
          <p className="mt-8 rounded-xl border border-line p-4">
            Private preview · {role.status}. Draft and Closed roles are not
            published.
          </p>
        )}
      </div>
    </div>
  );
}
