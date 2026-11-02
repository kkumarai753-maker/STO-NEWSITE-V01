"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { serviceCategories } from "@/data/service-categories";
import {
  categoryName,
  officeLocation,
  officeMode,
  type CareerRole,
} from "@/lib/careers";
import { siteConfig } from "@/config/site";
type Saved = {
  id: string;
  saved: boolean;
  has_resume: boolean;
  email_status: string;
  message: string;
  whatsapp_handoff: boolean;
};
export function ApplicationForm({
  roles,
  roleId,
  initialCategory,
  general,
  emailEnabled,
}: {
  roles: CareerRole[];
  roleId?: string;
  initialCategory?: string;
  general: boolean;
  emailEnabled: boolean;
}) {
  const initial = roles.find((r) => r.id === roleId);
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    category: initial?.category ?? initialCategory ?? "",
    role_id: initial?.id ?? "",
    experience: "0",
    portfolio: "",
    availability: "",
    introduction: "",
    office_acknowledged: false,
    consent: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const start = useRef(0);
  const token = useRef("");
  const busyRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<Saved | null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    start.current = Date.now();
    token.current = crypto.randomUUID();
  }, []);
  const update = (name: string, value: string | boolean) => {
    setValues((current) => ({ ...current, [name]: value }));
  };
  const field =
    "mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-text";
  const submit = async (route: "email" | "whatsapp", form: HTMLFormElement) => {
    if (busyRef.current) return;
    setError("");
    if (!form.reportValidity()) return;
    if (!general && !file) {
      setError("Please upload your resume.");
      return;
    }
    if (
      file &&
      (file.size > 5 * 1024 * 1024 || !/\.(pdf|docx)$/i.test(file.name))
    ) {
      setError("Upload one PDF or DOCX up to 5 MB.");
      return;
    }
    if (!token.current) {
      setError("The form is still loading. Please try again.");
      return;
    }
    const data = new FormData();
    data.set(
      "candidate",
      JSON.stringify({
        ...values,
        experience: Number(values.experience),
        role_id: general ? null : values.role_id,
        kind: general ? "general" : "role",
        privacy_version: "careers-v1",
      }),
    );
    data.set("route", route);
    data.set("submission_token", token.current);
    data.set("started_at", String(start.current));
    data.set("website", String(new FormData(form).get("website") ?? ""));
    if (file) data.set("resume", file);
    busyRef.current = true;
    setBusy(true);
    setProgress(0);
    try {
      const result = await new Promise<Saved>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/careers/applications");
        xhr.timeout = 60000;
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable)
            setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onerror = () =>
          reject(
            Error("Connection failed. Your form is unchanged; please retry."),
          );
        xhr.ontimeout = () =>
          reject(
            Error(
              "The save could not be confirmed. Retry with the same details to avoid a duplicate.",
            ),
          );
        xhr.onload = () => {
          let body;
          try {
            body = JSON.parse(xhr.responseText);
          } catch {
            reject(Error("We could not confirm the save. Please retry."));
            return;
          }
          if (xhr.status >= 200 && xhr.status < 300 && body.saved)
            resolve(body);
          else reject(Error(body.message ?? "Please review your application."));
        };
        xhr.send(data);
      });
      setSaved(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <p className="text-text-muted">
        Tell us about your skills, upload your resume and choose how you would
        like to contact our hiring team. All roles listed here are based at our
        Nagpur office.
      </p>
      {roleId && !initial && !general && (
        <p
          role="alert"
          className="rounded-xl border border-line bg-primary-light p-4"
        >
          The selected role is no longer available. Return to{" "}
          <Link href="/careers/roles" className="underline">
            open roles
          </Link>{" "}
          to choose a current opening.
        </p>
      )}
      {saved && (
        <section
          aria-live="polite"
          className="rounded-2xl border border-line bg-primary-light p-6"
        >
          <h2 className="text-xl font-semibold">
            Application reference: {saved.id}
          </h2>
          <p className="mt-3">
            {saved.email_status === "submitted"
              ? "Your application was saved and the email was submitted for delivery."
              : saved.whatsapp_handoff
                ? saved.has_resume
                  ? "Your application and resume have been saved. Continue in WhatsApp and tap Send to contact our hiring team."
                  : "Your profile details have been saved. Continue in WhatsApp and tap Send to contact our hiring team."
                : saved.email_status === "pending"
                  ? "Your application is saved. Email submission is still being processed. You can retry to check its status."
                  : "Your application is saved. The email could not be submitted; retry email or continue in WhatsApp using the same reference."}
          </p>
          <p className="mt-3 text-sm">
            WhatsApp requires you to tap Send. Your uploaded CV stays in our
            protected hiring inbox and is not attached to the chat.
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(saved.message)}`}
              className="rounded-full bg-primary px-5 py-3 font-semibold text-white"
            >
              Continue in WhatsApp
            </a>
            <button
              type="button"
              className="underline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(saved.message);
                  setCopied(true);
                } catch {
                  setError("Copy the message shown below.");
                }
              }}
            >
              {copied ? "Copied" : "Copy Message"}
            </button>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-sm">{saved.message}</p>
          <p className="mt-3 text-sm">
            To change a saved application, contact our hiring team and quote
            this reference.
          </p>
        </section>
      )}
      <fieldset
        disabled={busy || Boolean(saved)}
        className="space-y-6 disabled:opacity-75"
      >
        <legend className="sr-only">Candidate details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label>
            Full name
            <input
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              className={field}
            />
          </label>
          <label>
            Email address
            <input
              type="email"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              required
              maxLength={254}
              autoComplete="email"
              className={field}
            />
          </label>
          <label>
            Mobile / WhatsApp number
            <input
              type="tel"
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              required
              pattern="\+[0-9 \(\)\-]{6,29}"
              maxLength={30}
              autoComplete="tel"
              placeholder="Include country code, e.g. +91"
              className={field}
            />
          </label>
          <label>
            Current city
            <input
              value={values.city}
              onChange={(e) => update("city", e.target.value)}
              required
              minLength={2}
              maxLength={120}
              autoComplete="address-level2"
              className={field}
            />
          </label>
          <label>
            Service category
            <select
              required
              value={values.category}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  category: e.target.value,
                  role_id: "",
                }))
              }
              className={field}
            >
              <option value="">Choose a category</option>
              {serviceCategories.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          {!general && (
            <label>
              Position applying for
              <select
                value={values.role_id}
                onChange={(e) => update("role_id", e.target.value)}
                required
                className={field}
              >
                <option value="">Choose an open role</option>
                {roles
                  .filter((r) => r.category === values.category)
                  .map((role) => (
                    <option value={role.id} key={role.id}>
                      {role.title}
                    </option>
                  ))}
              </select>
            </label>
          )}
          <label>
            Relevant experience (years)
            <input
              type="number"
              min={0}
              max={80}
              step="0.1"
              required
              value={values.experience}
              onChange={(e) => update("experience", e.target.value)}
              className={field}
            />
            <span className="mt-1 block text-xs text-text-muted">
              Fresher? Enter 0.
            </span>
          </label>
          <label>
            Availability / notice period (optional)
            <input
              value={values.availability}
              onChange={(e) => update("availability", e.target.value)}
              maxLength={200}
              className={field}
            />
          </label>
        </div>
        <div className="rounded-xl border border-dashed border-line-strong p-5">
          <label className="block font-semibold" htmlFor="career-cv">
            Resume / CV {general ? "(optional)" : "(required)"}
          </label>
          <p id="cv-help" className="mt-2 text-sm text-text-muted">
            One PDF or DOCX, maximum 5 MB. Private to the hiring team.
          </p>
          <input
            id="career-cv"
            type="file"
            ref={fileInput}
            accept=".pdf,.docx"
            aria-describedby="cv-help"
            required={!general && !file}
            onChange={(e) => {
              const selected = e.target.files?.[0] ?? null;
              setError("");
              if (
                selected &&
                (selected.size > 5 * 1024 * 1024 ||
                  !/\.(pdf|docx)$/i.test(selected.name))
              ) {
                setError("Upload one PDF or DOCX up to 5 MB.");
                e.target.value = "";
                setFile(null);
                return;
              }
              setFile(selected);
            }}
            className="mt-4 max-w-full text-sm"
          />
          {file && (
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <span>
                {file.name} · {(file.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="text-primary underline"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  if (fileInput.current) fileInput.current.value = "";
                }}
                className="underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        <label className="block">
          Portfolio / LinkedIn / work samples (optional)
          <input
            type="url"
            value={values.portfolio}
            onChange={(e) => update("portfolio", e.target.value)}
            maxLength={1000}
            className={field}
          />
          <span className="mt-1 block text-xs text-text-muted">
            Share relevant work; do not include confidential client material.
          </span>
        </label>
        <label className="block">
          Short introduction (optional)
          <textarea
            value={values.introduction}
            onChange={(e) => update("introduction", e.target.value)}
            rows={4}
            maxLength={2000}
            className={field}
          />
        </label>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            required
            checked={values.office_acknowledged}
            onChange={(e) => update("office_acknowledged", e.target.checked)}
            className="mt-1 size-5 shrink-0"
          />
          <span>
            I understand this is a Work from Office role in Nagpur, Maharashtra.
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            required
            checked={values.consent}
            onChange={(e) => update("consent", e.target.checked)}
            className="mt-1 size-5 shrink-0"
          />
          <span>
            I agree to Sunrise Tech Origin using my details and resume to review
            my application and contact me about this role.{" "}
            <Link href="/careers/privacy" className="text-primary underline">
              Recruitment privacy notice
            </Link>
          </span>
        </label>
        <div className="hidden" aria-hidden>
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </fieldset>
      <p className="text-sm text-text-muted">
        {officeMode} · {officeLocation}
        {values.category ? ` · ${categoryName(values.category)}` : ""}
      </p>
      {busy && (
        <div role="status">
          <label htmlFor="upload-progress" className="text-sm">
            {progress === 100
              ? "Upload complete. Saving your application…"
              : `Uploading: ${progress}%`}
          </label>
          <progress
            id="upload-progress"
            value={progress}
            max={100}
            className="mt-2 w-full"
          />
        </div>
      )}
      <p role="alert" className="text-sm text-red-700">
        {error}
      </p>
      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          disabled={busy || (!general && Boolean(roleId) && !initial)}
          onClick={(e) => void submit("whatsapp", e.currentTarget.form!)}
          className="rounded-full bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50"
        >
          {saved ? "Use WhatsApp with this reference" : "Apply via WhatsApp"}
        </button>
        <button
          type="button"
          disabled={
            busy || !emailEnabled || (!general && Boolean(roleId) && !initial)
          }
          onClick={(e) => void submit("email", e.currentTarget.form!)}
          className="rounded-full border border-line-strong bg-white px-6 py-3 font-semibold disabled:opacity-50"
        >
          {saved ? "Retry / check email" : "Apply via Email"}
        </button>
      </div>
      {!emailEnabled && (
        <p className="text-sm text-text-muted">
          Email submission is not enabled. You can save through the WhatsApp
          route or contact the hiring team with questions.
        </p>
      )}
    </form>
  );
}
