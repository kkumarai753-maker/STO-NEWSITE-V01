"use client";
import { useActionState, useState } from "react";
import { saveRole } from "@/app/admin/(panel)/recruitment/actions";
import { serviceCategories } from "@/data/service-categories";
import type { CareerRole } from "@/lib/careers";
export function RoleEditor({ role }: { role: CareerRole }) {
  const [values, setValues] = useState(() => ({
    status: role.status,
    title: role.title,
    slug: role.slug,
    category: role.category,
    function: role.function,
    headline: role.headline,
    summary: role.summary,
    responsibilities: role.responsibilities,
    skills: role.skills,
    work_samples: role.work_samples,
    image: role.image,
    display_order: role.display_order,
  }));
  const [state, action, pending] = useActionState(saveRole, { message: "" });
  const field = "mt-2 w-full rounded-xl border border-line bg-white p-3";
  const text = (
    key: "title" | "slug" | "headline" | "summary" | "work_samples" | "image",
    label: string,
    multiline = false,
  ) => (
    <label className="block">
      {label}
      {multiline ? (
        <textarea
          rows={4}
          className={field}
          required={key !== "work_samples" && key !== "image"}
          value={values[key]}
          onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
        />
      ) : (
        <input
          className={field}
          required={key !== "image"}
          value={values[key]}
          onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
        />
      )}
    </label>
  );
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={role.id} />
      <input type="hidden" name="payload" value={JSON.stringify(values)} />
      <p className="rounded-xl border border-line bg-primary-light p-4">
        {role.id} · Work from Office · Nagpur, Maharashtra, India. Publishing a
        role as Open makes its card, detail page and application option public.
      </p>
      <label className="block">
        Publication status
        <select
          className={field}
          value={values.status}
          onChange={(e) =>
            setValues((v) => ({
              ...v,
              status: e.target.value as CareerRole["status"],
            }))
          }
        >
          {["Draft", "Open", "Closed"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      {text("title", "Job title")}
      {text("slug", "URL slug")}
      <label className="block">
        Service category
        <select
          className={field}
          value={values.category}
          onChange={(e) =>
            setValues((v) => ({ ...v, category: e.target.value }))
          }
        >
          {serviceCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        Role function
        <select
          className={field}
          value={values.function}
          onChange={(e) =>
            setValues((v) => ({
              ...v,
              function: e.target.value as CareerRole["function"],
            }))
          }
        >
          {["Sales", "Operations", "Development", "Marketing"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      {text("headline", "Role headline")}
      {text("summary", "Summary", true)}
      {(["responsibilities", "skills"] as const).map((key) => (
        <label key={key} className="block">
          {key === "skills" ? "Skills" : "Responsibilities"} (one per line)
          <textarea
            className={field}
            rows={6}
            value={values[key].join("\n")}
            onChange={(e) =>
              setValues((v) => ({ ...v, [key]: e.target.value.split("\n") }))
            }
          />
        </label>
      ))}
      {text("work_samples", "Optional work-sample hint", true)}
      {text("image", "Approved image path (optional)")}
      <label className="block">
        Display order
        <input
          type="number"
          min={1}
          max={100}
          className={field}
          value={values.display_order}
          onChange={(e) =>
            setValues((v) => ({ ...v, display_order: Number(e.target.value) }))
          }
        />
      </label>
      <p className="text-sm text-text-muted">
        Blank image uses original artwork for this role’s function. Custom
        assets must be approved files under /careers/.
      </p>
      <button
        disabled={pending}
        className="rounded-full bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save role"}
      </button>
      <p role="status">{state.message}</p>
    </form>
  );
}
