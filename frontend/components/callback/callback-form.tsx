"use client";
import { InternationalPhoneInput } from "@/components/forms/international-phone-input";
import { normalizePhone } from "@/lib/phone";
import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, LoaderCircle, Mail } from "lucide-react";
import { submitCallback } from "@/app/actions/callback";
import type { ContactFormState } from "@/app/actions/contact";
import { serviceCategories } from "@/data/service-categories";
import { emailHref, whatsappHref } from "@/config/site";
const initial: ContactFormState = { status: "idle" };
const empty = { name: "", email: "", phone: "", requirement: "", details: "" };
export function CallbackForm({
  deliveryAvailable,
}: {
  deliveryAvailable: boolean;
}) {
  const [values, setValues] = useState(empty);
  const [phoneError, setPhoneError] = useState<string>();
  const [draft, setDraft] = useState(false);
  const [state, action, pending] = useActionState(submitCallback, initial);
  const time = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (time.current) time.current.value = String(Date.now());
  }, [draft]);
  const field =
    "mt-1.5 min-h-11 w-full rounded-xl border border-line-strong bg-white px-3.5 py-2 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";
  const update = (key: keyof typeof empty, value: string) =>
    setValues((v) => ({ ...v, [key]: value }));
  if (state.status === "success")
    return (
      <div role="status" className="py-8 text-center">
        <Check className="mx-auto size-10 rounded-full bg-[#e5f5e9] p-2 text-[#28764b]" />
        <h3 className="mt-5 text-xl font-semibold text-text">
          Request received.
        </h3>
        <p className="mt-3 text-sm text-text-muted">{state.message}</p>
      </div>
    );
  if (draft) {
    const body = `Callback request\nName: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone}\nRequirement: ${values.requirement}\n\n${values.details || "Please call me to discuss my requirements."}`;
    const wa = whatsappHref(body);
    return (
      <div className="py-3">
        <h3 className="text-xl font-semibold text-text">
          Your request is ready to send.
        </h3>
        <p
          role="status"
          className="mt-3 text-sm leading-relaxed text-text-muted"
        >
          Nothing has been sent yet. Choose email or WhatsApp, then send your
          request in that app.
        </p>
        <a
          href={`${emailHref("Callback request")}&body=${encodeURIComponent(body)}`}
          className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white"
        >
          <Mail className="size-4" />
          Open Email Draft
        </a>
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full border border-line-strong px-5 text-sm font-semibold text-text"
          >
            Continue on WhatsApp
            <ArrowUpRight className="size-4" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
        <button
          type="button"
          onClick={() => setDraft(false)}
          className="mt-5 min-h-11 text-sm text-primary underline underline-offset-4"
        >
          Edit my details
        </button>
      </div>
    );
  }
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!normalizePhone(values.phone)) {
          e.preventDefault();
          setPhoneError("Please enter a valid mobile number for your country.");
          return;
        }
        setPhoneError(undefined);
        if (!deliveryAvailable) {
          e.preventDefault();
          setDraft(true);
        }
      }}
      className="mt-5 space-y-4"
      aria-busy={pending}
    >
      {state.status === "error" ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-[#b12525]"
        >
          {state.message}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-medium text-text">
          Full name *
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className={field}
          />
        </label>
        <label className="block text-xs font-medium text-text">
          Email address *
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className={field}
          />
        </label>
      </div>
      <InternationalPhoneInput name="callbackPhone" value={values.phone} onChange={(value) => { update("phone", value); setPhoneError(undefined); }} required error={phoneError} />
      <label className="block text-xs font-medium text-text">
        What do you need help with? *
        <select
          name="requirement"
          required
          value={values.requirement}
          onChange={(e) => update("requirement", e.target.value)}
          className={field}
        >
          <option value="" disabled>
            Choose your requirement
          </option>
          {serviceCategories.map((c) => (
            <option key={c.id}>{c.name}</option>
          ))}
          <option>Help me choose</option>
        </select>
      </label>
      <label className="block text-xs font-medium text-text">
        Your message{" "}
        <span className="font-normal text-text-subtle">(optional)</span>
        <textarea
          name="details"
          rows={3}
          maxLength={3000}
          value={values.details}
          onChange={(e) => update("details", e.target.value)}
          placeholder="Tell us a little about your idea or business."
          className={field}
        />
      </label>
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Leave empty
          <input name="ref_code" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input ref={time} type="hidden" name="startedAt" defaultValue="" />
      <p className="text-xs leading-relaxed text-text-muted">
        We’ll use your details to respond to this request.{" "}
        <Link
          href="/privacy"
          className="text-primary underline underline-offset-2"
        >
          Privacy Policy
        </Link>
      </p>
      {!deliveryAvailable ? (
        <p className="text-xs leading-relaxed text-text-muted">
          Choose email or WhatsApp in the next step, then send your request there.
        </p>
      ) : null}
      <button
        disabled={pending}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f28b27] px-5 text-sm font-semibold text-[#182b41] transition-colors hover:bg-[#ffab50] disabled:opacity-60"
      >
        {pending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Sending request…
          </>
        ) : (
          "Request a Callback"
        )}
      </button>
    </form>
  );
}
