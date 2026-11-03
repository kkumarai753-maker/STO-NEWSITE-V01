"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { serviceCategories } from "@/data/service-categories";
import { SERVICES } from "@/data/services-catalog";
import { proposalMessage } from "@/lib/validation/proposal";
import { validateContact } from "@/lib/validation/contact";
import { submitProposal } from "@/app/actions/proposal";
import { siteConfig } from "@/config/site";
export function ProposalForm({
  deliveryAvailable,
}: {
  deliveryAvailable: boolean;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const categoryParam = params.get("category");
  const serviceParam = SERVICES.find((s) => s.id === params.get("service") || (params.get("services") ?? "").split(",").includes(s.id));
  const category = serviceCategories.find((c) => c.id === categoryParam)?.id ?? serviceParam?.category ?? "";
  return <CategoryProposalForm key={params.toString()} deliveryAvailable={deliveryAvailable} category={category} initialServices={[params.get("service") ?? "", ...(params.get("services") ?? "").split(",")]} onCategoryChange={(value) => router.replace(`/build-your-proposal?category=${encodeURIComponent(value)}`, { scroll: false })} />;
}

function CategoryProposalForm({deliveryAvailable, category, initialServices, onCategoryChange}: {deliveryAvailable:boolean;category:string;initialServices:string[];onCategoryChange:(value:string)=>void}) {
  const [selected, setSelected] = useState<string[]>(() =>
    SERVICES.filter(
      (s) =>
        s.category === category && initialServices.includes(s.id),
    ).map((s) => s.id),
  );
  const [state, action, pending] = useActionState(submitProposal, {
    status: "idle",
  });
  const started = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  useEffect(() => {
    if (started.current) started.current.value = String(Date.now());
  }, []);
  const field =
    "mt-2 w-full rounded-xl border border-line bg-white p-3 text-text";
  return (
    <form
      action={deliveryAvailable ? action : undefined}
      onSubmit={(event) => {
        setError("");
        setDraft("");
        const data = new FormData(event.currentTarget);
        try {
          const message = proposalMessage(
            selected,
            String(data.get("brief") ?? ""),
          );
          const result = validateContact({
            name: String(data.get("name")),
            email: String(data.get("email")),
            phone: String(data.get("phone")),
            message,
          });
          if (!result.success) {
            event.preventDefault();
            setError(
              "Please check your name, email and optional 10-digit phone number.",
            );
            return;
          }
          if (!deliveryAvailable) {
            event.preventDefault();
            setDraft(
              `Name: ${result.data.name}\nEmail: ${result.data.email}\nPhone: ${result.data.phone}\n\n${message}`,
            );
          }
        } catch (e) {
          event.preventDefault();
          setError(
            e instanceof Error ? e.message : "Please review your selection.",
          );
        }
      }}
      className="space-y-8"
    >
      <p className="text-text-muted">
        Choose services within your selected category. Scope and pricing are confirmed after review.
      </p>
      <label className="block font-semibold">
        Service category
        <select value={category} onChange={(event) => onCategoryChange(event.target.value)} className={field}>
          <option value="">Choose a category</option>
          {serviceCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <span className="mt-2 block text-sm font-normal text-text-muted">Changing category starts a new service selection.</span>
      </label>
      {!category && <p className="rounded-xl bg-primary-light p-4">Choose a category above to see its services.</p>}
      <div
        className="sticky top-24 z-10 rounded-xl border border-line bg-white p-4 font-semibold"
        aria-live="polite"
      >
        {selected.length} services selected{" "}
        <a className="ml-4 text-primary underline" href="#proposal-details">
          Continue to your details
        </a>
      </div>
      {serviceCategories.filter((c) => c.id === category).map((c) => (
        <fieldset
          id={c.id}
          key={c.id}
          className={`scroll-mt-28 rounded-2xl border p-5 sm:p-7 ${category === c.id ? "border-primary" : "border-line"}`}
        >
          <legend className="px-2 text-xl font-semibold">{c.name}</legend>
          <div className="space-y-3">
            {SERVICES.filter((s) => s.category === c.id).map((s) => (
              <label
                key={s.id}
                className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-primary-light"
              >
                <input
                  type="checkbox"
                  name="services"
                  value={s.id}
                  checked={selected.includes(s.id)}
                  onChange={(e) =>
                    setSelected((current) =>
                      e.target.checked
                        ? [...current, s.id]
                        : current.filter((id) => id !== s.id),
                    )
                  }
                  className="mt-1 size-5 shrink-0 accent-blue-700"
                />
                <span>{s.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <fieldset
        id="proposal-details"
        className="scroll-mt-28 space-y-5 rounded-2xl border border-line p-6"
      >
        <legend className="px-2 text-xl font-semibold">
          Your project details
        </legend>
        <label className="block">
          Name
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            className={field}
          />
        </label>
        <label className="block">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            className={field}
          />
        </label>
        <label className="block">
          Phone (optional, 10 digits)
          <input
            name="phone"
            type="tel"
            autoComplete="tel-national"
            pattern="[0-9]{10}"
            maxLength={10}
            className={field}
          />
        </label>
        <label className="block">
          Project brief (optional)
          <textarea
            name="brief"
            rows={5}
            maxLength={1500}
            className={field}
            placeholder="Tell us about your business, goals and timeline."
          />
        </label>
        <input name="startedAt" type="hidden" ref={started} />
        <div className="hidden" aria-hidden>
          <label>
            Leave empty
            <input name="ref_code" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <p className="text-sm text-text-muted">
          By continuing, you agree to our{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
        <button
          disabled={pending || selected.length === 0}
          className="min-h-12 rounded-full bg-primary px-7 py-3 font-semibold text-white disabled:opacity-50"
        >
          {pending
            ? "Sending…"
            : deliveryAvailable
              ? "Send proposal request"
              : "Prepare proposal request"}
        </button>
        {!deliveryAvailable && (
          <p className="text-sm text-text-muted">
            Prepare your request, then send it using email or WhatsApp.
          </p>
        )}
      </fieldset>
      <p role="status" aria-live="polite">
        {error || state.message}
      </p>
      {draft && (
        <div className="rounded-2xl border border-line p-6">
          <h2 className="text-xl font-semibold">
            Your request is ready to send
          </h2>
          <p className="mt-2">
            Choose email or WhatsApp to send your request to our team.
          </p>
          <pre className="mt-4 whitespace-pre-wrap font-sans text-sm">
            {draft}
          </pre>
          <div className="mt-5 flex flex-wrap gap-5">
            <a
              className="text-primary underline"
              href={`mailto:${siteConfig.contact.email}?subject=Build%20Your%20Proposal&body=${encodeURIComponent(draft)}`}
            >
              Send by email
            </a>
            <a
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(draft)}`}
            >
              Send by WhatsApp
            </a>
          </div>
        </div>
      )}
    </form>
  );
}
