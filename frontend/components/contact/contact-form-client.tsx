"use client";
import { InternationalPhoneInput } from "@/components/forms/international-phone-input";

import { serviceCategories } from "@/data/service-categories";

/**
 * Contact form (Client Component): a night card in three short chapters ,
 * who you are, what you need (topic chips), and your message. Submits through
 * a Server Action with validation and spam protection (honeypot + timing).
 * Instant inline validation, pending, success and error states, and focus
 * management. A sunrise line across the top fills as the required fields
 * become valid.
 *
 * The server contract is unchanged (name, email, phone, message): selected
 * topics are sent as the first line of the message ("Interested in: …").
 *
 * The message is pre-filled from ?service= / ?topic= / ?quote= / ?services=
 * (links from the service catalog) and from clicks on [data-service-select].
 */
import Link from "next/link";
import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ArrowUpRight,
  Check,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Mail,
  RotateCcw,
} from "lucide-react";
import { submitContact, type ContactFormState } from "@/app/actions/contact";
import {
  HONEYPOT_FIELD,
  STARTED_AT_FIELD,
  contactFields,
  contactSchema,
  validateContact,
  type ContactField,
  type ContactFieldErrors,
} from "@/lib/validation/contact";
import { Button, ButtonArrow } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { emailHref, whatsappHref } from "@/config/site";

type Values = Record<ContactField, string>;

const EMPTY: Values = { name: "", email: "", phone: "", message: "" };
const INITIAL_STATE: ContactFormState = { status: "idle" };
const REQUIRED = ["name", "email", "message"] as const;

/** Category names come from the shared service catalogue. */
const TOPICS = serviceCategories.map((c) => c.name);

/** What the server receives as `message`: the chosen topics, then the visitor's words. */
function composeMessage(topics: string[], message: string) {
  const text = message.trim();
  return topics.length
    ? `Interested in: ${topics.join(", ")}\n\n${text}`
    : text;
}

/**
 * On a client-side navigation Next updates the URL just after it renders the
 * new page, so check again on the next frame (and on back/forward).
 */
function subscribeToUrl(onChange: () => void) {
  const frame = requestAnimationFrame(onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("popstate", onChange);
  };
}
const readSearch = () => window.location.search;
const serverSearch = () => "";

function requestedService(search: string) {
  const params = new URLSearchParams(search);
  return (
    params.get("service") ||
    params.get("topic") ||
    params.get("quote") ||
    params.get("services")
  );
}

function validateField(
  field: ContactField,
  values: Values,
): string | undefined {
  const result = contactSchema.shape[field].safeParse(values[field].trim());
  return result.success ? undefined : result.error.issues[0]?.message;
}

export function ContactFormClient({
  deliveryAvailable,
}: {
  deliveryAvailable: boolean;
}) {
  const [draft, setDraft] = useState<Values | null>(null);
  const [state, formAction, pending] = useActionState(
    submitContact,
    INITIAL_STATE,
  );
  const [values, setValues] = useState<Values>(EMPTY);
  const [topics, setTopics] = useState<string[]>([]);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<ContactField, boolean>>
  >({});
  const [prevState, setPrevState] = useState(state);
  const [showSuccess, setShowSuccess] = useState(false);

  const startedAtRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  // Pre-fill from the URL once it is known. The server snapshot is empty, so
  // the first client render matches the HTML; React then re-renders with it.
  const search = useSyncExternalStore(subscribeToUrl, readSearch, serverSearch);
  const [prefilledFrom, setPrefilledFrom] = useState("");
  if (search !== prefilledFrom) {
    setPrefilledFrom(search);
    const service = requestedService(search);
    if (service && !values.message.trim()) {
      setValues((v) => ({
        ...v,
        message: `I would like to request a quotation and details for: ${service}. `,
      }));
    }
  }

  // Sync server responses into local state
  if (state !== prevState) {
    setPrevState(state);
    if (state.status === "success") {
      setValues(EMPTY);
      setTopics([]);
      setErrors({});
      setTouched({});
      setShowSuccess(true);
    } else if (state.status === "error") {
      setErrors(state.fieldErrors ?? {});
    }
  }

  // Record when the form became interactive (simple bot-timing signal)
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, [showSuccess, draft]);

  // Clicking a service card elsewhere on the page starts the message for the visitor
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-service-select]",
      );
      const service = link?.dataset.serviceSelect?.slice(0, 60);
      if (!service) return;
      setValues((v) =>
        v.message.trim()
          ? v
          : { ...v, message: `I'm interested in ${service}. ` },
      );
      setShowSuccess(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (showSuccess || draft) successRef.current?.focus();
  }, [showSuccess, draft]);

  const update = (field: ContactField, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field] || errors[field]) {
      setErrors((e) => ({ ...e, [field]: validateField(field, next) }));
    }
  };

  const blur = (field: ContactField) => {
    setTouched((t) => ({ ...t, [field]: true }));
    if (values[field] !== "" || errors[field]) {
      setErrors((e) => ({ ...e, [field]: validateField(field, values) }));
    }
  };

  const toggleTopic = (topic: string) =>
    setTopics((current) =>
      current.includes(topic)
        ? current.filter((t) => t !== topic)
        : [...current, topic],
    );

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const trimmed = Object.fromEntries(
      contactFields.map((f) => [f, values[f].trim()]),
    ) as Values;
    const result = validateContact(trimmed);
    if (!result.success) {
      event.preventDefault();
      setErrors(result.fieldErrors);
      setTouched(Object.fromEntries(contactFields.map((f) => [f, true])));
      const first = contactFields.find((f) => result.fieldErrors[f]);
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    // Without a delivery provider, prepare a draft the visitor sends themselves.
    // Never claim a message was delivered merely because a form was filled out.
    if (!deliveryAvailable) {
      event.preventDefault();
      setDraft({
        ...trimmed,
        message: composeMessage(topics, trimmed.message),
      });
    }
  };

  // Grow the message box with its content.
  const autoGrow = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  if (draft) {
    const body = `Name: ${draft.name}\nEmail: ${draft.email}\nPhone / WhatsApp: ${draft.phone || "Not provided"}\n\n${draft.message}`;
    const mailto = `${emailHref(`Project enquiry from ${draft.name}`)}&body=${encodeURIComponent(body)}`;
    const whatsapp = whatsappHref(body);
    return (
      <div
        className="glass-card rounded-3xl p-6 sm:p-10"
        role="region"
        aria-label="Your message draft"
      >
        <p className="label-mono text-primary">One more step</p>
        <h3
          className="mt-4 text-heading-2 text-text"
          tabIndex={-1}
          ref={successRef}
        >
          Ready when <em>you are.</em>
        </h3>
        <p className="mt-4 text-text-muted">
          Choose email or WhatsApp to send your details. Nothing has been sent
          yet.
        </p>
        <p className="mt-6 max-h-60 overflow-y-auto rounded-xl border border-line bg-white p-4 text-sm whitespace-pre-wrap text-text-muted">
          {body}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button asChild size="lg">
            <a href={mailto}>
              <Mail className="size-4" aria-hidden />
              Open Email Draft
            </a>
          </Button>
          {whatsapp ? (
            <Button asChild variant="secondary" size="lg">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                Continue on WhatsApp
                <ArrowUpRight className="size-4" aria-hidden />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
          ) : null}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-text-muted">
          Email opens your email app. WhatsApp opens a draft in WhatsApp. Review
          and press Send there to contact us.
        </p>
        <Button
          type="button"
          variant="link"
          className="mt-6 min-h-11"
          onClick={() => setDraft(null)}
        >
          Edit my details
        </Button>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div
        className="glass-card relative isolate flex min-h-112 flex-col items-start justify-end overflow-hidden rounded-3xl p-8 animate-in fade-in-0 zoom-in-[0.98] duration-500 sm:p-12"
        role="status"
      >
        <SunGlow
          className="-bottom-48 left-1/2 size-[34rem] -translate-x-1/2"
          strength={28}
        />
        <span className="grid size-14 place-items-center rounded-full bg-sun text-on-sun">
          <CircleCheck className="size-7" strokeWidth={1.75} aria-hidden />
        </span>
        <h3
          ref={successRef}
          tabIndex={-1}
          className="mt-8 text-heading-1 text-text outline-none"
        >
          Message <em>received.</em>
        </h3>
        <p className="mt-4 max-w-md text-text-muted">{state.message}</p>
        <Button
          type="button"
          variant="outline"
          className="mt-10"
          onClick={() => setShowSuccess(false)}
        >
          <RotateCcw className="size-3.5" aria-hidden /> Send another message
        </Button>
      </div>
    );
  }

  const showBanner = state.status === "error" && state.message && !pending;
  const requiredDone = REQUIRED.filter((f) => !validateField(f, values)).length;
  const progress = requiredDone / REQUIRED.length;

  return (
    <form
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      aria-busy={pending}
      aria-describedby={showBanner ? id("banner") : undefined}
      className="glass-card relative isolate overflow-hidden rounded-3xl p-6 sm:p-10"
    >
      <SunGlow className="-right-32 -bottom-56 size-[30rem]" strength={16} />

      {/* Sunrise progress: fills as the required fields become valid */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-line">
        <span
          className="block h-full bg-linear-to-r from-gold via-sun to-ember-deep transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2.5 text-sm text-text-muted">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-success/60 motion-reduce:hidden" />
            <span className="relative size-2 rounded-full bg-success" />
          </span>
          Usually replies within 24 hours
        </p>
        <p className="label-mono text-subtle numeric">
          {requiredDone}/{REQUIRED.length} required
        </p>
      </div>

      {showBanner ? (
        <div id={id("banner")} role="alert" className="alert alert-error mt-6">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>{state.message}</p>
        </div>
      ) : null}

      {!deliveryAvailable ? (
        <p className="mt-5 rounded-xl border border-line bg-primary-light/50 p-4 text-sm leading-relaxed text-text-muted">
          Fill in your brief, then choose email or WhatsApp to send it directly.
          No account needed.
        </p>
      ) : null}

      {/* Spam protection: honeypot + timing */}
      <div
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor={id(HONEYPOT_FIELD)}>Leave this field empty</label>
        <input
          id={id(HONEYPOT_FIELD)}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore
          defaultValue=""
        />
      </div>
      <input
        ref={startedAtRef}
        type="hidden"
        name={STARTED_AT_FIELD}
        defaultValue=""
      />
      {/* What the server reads as `message` (topics + the visitor's words) */}
      <input
        type="hidden"
        name="message"
        value={composeMessage(topics, values.message)}
      />

      <fieldset disabled={pending} className="relative z-1">
        <legend className="sr-only">Send us a message</legend>

        <Chapter index="01" title="Who should we reply to?">
          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            <LineField
              id={id("name")}
              label="Your name"
              required
              error={errors.name}
            >
              <input
                id={id("name")}
                name="name"
                type="text"
                autoComplete="name"
                placeholder=" "
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                onBlur={() => blur("name")}
                {...a11y(id("name"), errors.name, true)}
                className="peer field-line"
              />
            </LineField>

            <LineField
              id={id("email")}
              label="Email address"
              required
              error={errors.email}
            >
              <input
                id={id("email")}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder=" "
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                onBlur={() => blur("email")}
                {...a11y(id("email"), errors.email, true)}
                className="peer field-line"
              />
            </LineField>

            <div className="sm:col-span-2">
              <InternationalPhoneInput id={id("phone")} name="phone" value={values.phone} onChange={(value) => update("phone", value)} onBlur={() => blur("phone")} error={errors.phone} />
            </div>
          </div>
        </Chapter>

        <Chapter
          index="02"
          title="What can we help with?"
          note="Pick any that apply"
        >
          <div
            role="group"
            aria-label="What can we help with?"
            className="flex flex-wrap gap-2"
          >
            {TOPICS.map((topic) => {
              const on = topics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleTopic(topic)}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-full border pr-4 pl-2.5 text-sm transition-[background-color,border-color,color] duration-200",
                    on
                      ? "border-sun bg-sun/12 text-text"
                      : "border-line-strong text-text-muted hover:border-text/40 hover:text-text",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-5 place-items-center rounded-full border transition-colors duration-200",
                      on
                        ? "border-sun bg-sun text-on-sun"
                        : "border-line-input",
                    )}
                  >
                    {on ? <Check className="size-3" strokeWidth={3} /> : null}
                  </span>
                  {topic}
                </button>
              );
            })}
          </div>
        </Chapter>

        <Chapter index="03" title="Tell us about it">
          <LineField
            id={id("message")}
            label="Your idea, goal or problem"
            required
            error={errors.message}
          >
            <textarea
              id={id("message")}
              rows={3}
              placeholder=" "
              value={values.message}
              onChange={(e) => {
                update("message", e.target.value);
                autoGrow(e.target);
              }}
              onBlur={() => blur("message")}
              {...a11y(id("message"), errors.message, true)}
              className="peer field-line min-h-28 resize-none"
            />
          </LineField>
        </Chapter>
      </fieldset>

      <div className="relative z-1 mt-12 flex flex-col-reverse gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-sm leading-relaxed text-text-muted">
          We&apos;ll only use your details to reply.{" "}
          <Link
            href="/privacy"
            className="text-text underline decoration-line-strong underline-offset-[0.25em] transition-colors hover:decoration-text"
          >
            Privacy Policy
          </Link>
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="disabled:cursor-wait disabled:opacity-90"
        >
          {pending ? (
            <>
              Sending…
              <span
                data-slot="button-arrow"
                aria-hidden
                className="inline-grid shrink-0 place-items-center"
              >
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            </>
          ) : (
            <>
              Send Enquiry
              <ButtonArrow />
            </>
          )}
        </Button>
      </div>
      <p className="sr-only" aria-live="polite">
        {pending ? "Sending your message" : ""}
      </p>
    </form>
  );
}

function a11y(
  fieldId: string,
  error: string | undefined,
  required = false,
  hintId?: string,
) {
  // The hint is replaced by the error while one is shown.
  const describedBy = error ? `${fieldId}-error` : hintId;
  return {
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy,
    "aria-required": required || undefined,
  };
}

/** One chapter of the form: a numbered question with its fields. */
function Chapter({
  index,
  title,
  note,
  children,
}: {
  index: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mt-11 first-of-type:mt-9">
      <legend className="float-left mb-6 flex w-full flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-xs text-accent numeric">{index}</span>
        <span className="font-display text-[1.5rem] leading-tight tracking-[-0.02em] text-text sm:text-[1.75rem]">
          {title}
        </span>
        {note ? <span className="text-sm text-subtle">{note}</span> : null}
      </legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

/**
 * Underline field with a floating label. The control (passed as children) must
 * carry `peer field-line` and placeholder=" " so the label can float.
 */
function LineField({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <div className="relative">
        {children}
        <label htmlFor={id} className="field-float">
          {label}
          {required ? (
            <>
              <span className="ml-0.5 text-accent" aria-hidden>
                *
              </span>
              <span className="sr-only"> (required)</span>
            </>
          ) : null}
        </label>
        <span aria-hidden className="field-line-bar" />
      </div>
      {error ? (
        <p id={`${id}-error`} className="field-error mt-2.5">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2.5 text-xs text-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Soft sunrise light in a corner of the card (decorative). */
function SunGlow({
  className,
  strength,
}: {
  className?: string;
  strength: number;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute -z-1 rounded-full",
        className,
      )}
      style={{
        background: `radial-gradient(closest-side, color-mix(in oklab, var(--sun) ${strength}%, transparent), color-mix(in oklab, var(--ember-deep) ${Math.round(strength / 3)}%, transparent) 55%, transparent)`,
      }}
    />
  );
}
