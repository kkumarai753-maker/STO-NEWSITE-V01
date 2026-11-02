import { RoleArtwork } from "./role-artwork";
import Link from "next/link";
import { serviceCategories } from "@/data/service-categories";
import {
  categoryName,
  officeMode,
  officeLocation,
  type CareerRole,
} from "@/lib/careers";
export function RoleList({
  roles,
  category,
  functionFilter,
  available = true,
}: {
  roles: CareerRole[];
  category?: string;
  functionFilter?: string;
  available?: boolean;
}) {
  const shown = roles.filter(
    (role) =>
      (!category || role.category === category) &&
      (!functionFilter || role.function === functionFilter),
  );
  return (
    <>
      <nav aria-label="Career categories" className="flex flex-wrap gap-3">
        <Link
          href="/careers/roles"
          className={`rounded-full border px-4 py-3 text-sm ${!category ? "border-primary text-primary" : "border-line"}`}
        >
          All Roles
        </Link>
        {serviceCategories.map((c) => (
          <Link
            key={c.id}
            href={`/careers/category/${c.id}`}
            aria-current={category === c.id ? "page" : undefined}
            className={`rounded-full border px-4 py-3 text-sm ${category === c.id ? "border-primary text-primary" : "border-line"}`}
          >
            {c.name}
          </Link>
        ))}
      </nav>
      <form method="get" className="my-6 flex flex-wrap items-end gap-4">
        <label className="block text-sm">
          Role function
          <select
            name="function"
            defaultValue={functionFilter ?? ""}
            className="ml-3 rounded-xl border border-line bg-white p-3"
          >
            <option value="">All functions</option>
            {["Sales", "Operations", "Development", "Marketing"].map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </label>
        <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
          Filter roles
        </button>
        <Link href="/careers/roles" className="px-2 py-3 text-sm underline">
          Clear Filters
        </Link>
      </form>
      {shown.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {shown.map((role) => (
            <article
              key={role.id}
              className="overflow-hidden rounded-3xl border border-line bg-white"
            >
              <RoleArtwork role={role} />
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-primary">
                    {categoryName(role.category)}
                  </p>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                    Open
                  </span>
                </div>
                <h2 className="mt-4 text-heading-3">{role.title}</h2>
                <p className="mt-3 text-text-muted">{role.summary}</p>
                <p className="mt-5 text-sm font-semibold">{officeMode}</p>
                <p className="mt-1 text-sm text-text-muted">{officeLocation}</p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    className="rounded-full border border-line-strong px-5 py-3 text-sm font-semibold"
                    href={`/careers/${role.slug}`}
                  >
                    View Role<span className="sr-only">: {role.title}</span>
                  </Link>
                  <Link
                    className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
                    href={`/careers/apply?role=${role.id}`}
                  >
                    Apply Now<span className="sr-only">: {role.title}</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-line bg-white p-8">
          <h2 className="text-heading-3">
            {!available
              ? "Openings are temporarily unavailable"
              : roles.length
                ? "No roles match these filters"
                : "There are no published openings at the moment."}
          </h2>
          <p className="mt-3 text-text-muted">
            {!available
              ? "Please try again later or contact our hiring team for questions."
              : "You can share your profile for future consideration."}
          </p>
          <Link
            href={`/careers/apply?interest=general${category ? `&category=${category}` : ""}`}
            className="mt-5 inline-block rounded-full border border-line-strong px-5 py-3 font-semibold"
          >
            Share your profile
          </Link>
        </div>
      )}
    </>
  );
}
