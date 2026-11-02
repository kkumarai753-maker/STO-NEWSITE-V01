"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SERVICES } from "@/data/services-catalog";
import { Button } from "@/components/ui/button";

const STEPS = [
  { step: 1, label: "Registration", active: true },
  { step: 2, label: "Quotation", active: false },
  { step: 3, label: "E-sign", active: false },
  { step: 4, label: "10% Token", active: false },
  { step: 5, label: "Onboarding", active: false },
];

export function RegisterFormClient() {
  const searchParams = useSearchParams();
  const requestedService = searchParams.get("service") || "";
  const requestedServices = (searchParams.get("services") || "")
    .split(",")
    .filter(Boolean);

  // Pre-select the service(s) passed in the URL (?service=Name or ?services=id,id).
  const initialService =
    requestedService ||
    SERVICES.filter((s) => requestedServices.includes(s.id))
      .map((s) => s.name)
      .join(", ");

  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    mobile: "",
    email: "",
    city: "",
    service: initialService,
    budget: "",
    timeline: "",
    requirement: "",
    contactConsent: false,
    termsAccepted: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contactConsent || !formData.termsAccepted) {
      setErrorMessage("Please accept the contact consent and business terms.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Generate customer ID
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      const generatedId = `STO-2026-${randomPart}`;

      // Simulate API or call backend if configured
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSuccessId(generatedId);
    } catch {
      setErrorMessage("Registration could not be completed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successId) {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-surface/95 p-8 sm:p-12 text-center shadow-md animate-in fade-in-0 duration-300">
        <div className="mx-auto size-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center mb-5">
          <CheckCircle2 className="size-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Step 1 Complete
        </span>
        <h2 className="mt-2 text-3xl font-extrabold text-text">
          Registration Received
        </h2>
        <p className="mt-4 text-base text-text-muted max-w-lg mx-auto">
          Your customer account has been created. Keep your Customer Reference ID for future
          communication:
        </p>
        <div className="mt-4 inline-block rounded-2xl bg-bg-elevated px-6 py-3 border border-line">
          <span className="font-mono text-xl sm:text-2xl font-black text-brand tracking-wider">
            {successId}
          </span>
        </div>
        <p className="mt-5 text-xs text-text-muted max-w-md mx-auto leading-relaxed">
          Our team will review your requirement, prepare a quotation, and issue an e-signing link.
          Onboarding begins following quotation sign-off and the 10% booking token.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/services">
              Explore More Services
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">
              Contact Our Team
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-tint/10 bg-tint/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-tint">
          Customer registration
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-text sm:text-5xl">
          Start your project with a clear, guided process.
        </h1>
        <p className="mt-4 text-base text-text-muted leading-relaxed">
          Register your interest first. Our team will review your requirements, prepare a
          quotation and send the approved agreement for e-signing before payment and onboarding.
        </p>
      </div>

      {/* 5-Step Customer Journey */}
      <ol className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-12">
        {STEPS.map((s) => (
          <li
            key={s.step}
            className={`flex items-center gap-2 rounded-xl p-3 border text-xs font-medium ${
              s.active
                ? "bg-brand/10 border-brand/30 text-brand"
                : "bg-surface/60 border-line/60 text-text-muted"
            }`}
          >
            <b className={`size-5 rounded-full grid place-items-center text-[10px] ${
              s.active ? "bg-brand text-white" : "bg-bg-elevated text-text-muted"
            }`}>
              {s.step}
            </b>
            <span className="truncate">{s.label}</span>
          </li>
        ))}
      </ol>

      {/* Form Card */}
      <div className="rounded-3xl border border-line bg-surface/90 p-6 sm:p-10 shadow-sm">
        <div className="mb-8 pb-6 border-b border-line">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Step 1 of 5
          </span>
          <h2 className="mt-1 text-2xl font-bold text-text">
            Register as a customer
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            This form creates your customer record. Registration does not confirm the project or charge any payment.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-semibold text-red-600 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Business or Brand Name
              </label>
              <input
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Company / Brand name"
                className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Mobile or WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <input
                name="mobile"
                type="tel"
                required
                value={formData.mobile}
                onChange={handleChange}
                placeholder="+91 87668 03990"
                className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                City and State <span className="text-red-500">*</span>
              </label>
              <input
                name="city"
                type="text"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="Nagpur, Maharashtra"
                className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Selected Service <span className="text-red-500">*</span>
              </label>
              <select
                name="service"
                required
                value={formData.service}
                onChange={handleChange}
                className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="">Choose a service</option>
                {formData.service && !SERVICES.some((s) => s.id === formData.service) && (
                  <option value={formData.service}>{formData.service}</option>
                )}
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.group === "web" ? "Web" : "Growth"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Estimated Budget
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="">Select range</option>
                <option>Under ₹5,000</option>
                <option>₹5,000–₹15,000</option>
                <option>₹15,000–₹50,000</option>
                <option>₹50,000+</option>
                <option>Need guidance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Preferred Start Timeline
              </label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="">Select timeline</option>
                <option>Immediately</option>
                <option>Within 2 weeks</option>
                <option>Within 1 month</option>
                <option>Within 3 months</option>
                <option>Still exploring</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Tell us what you want to achieve
            </label>
            <textarea
              name="requirement"
              rows={4}
              value={formData.requirement}
              onChange={handleChange}
              placeholder="Describe your business, requirement, and expected outcome..."
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-2.5 text-xs text-text-muted cursor-pointer">
              <input
                type="checkbox"
                name="contactConsent"
                required
                checked={formData.contactConsent}
                onChange={handleChange}
                className="mt-0.5 size-4 rounded border-line text-brand focus:ring-brand"
              />
              <span>I agree to be contacted about this request through email, phone or WhatsApp.</span>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-text-muted cursor-pointer">
              <input
                type="checkbox"
                name="termsAccepted"
                required
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="mt-0.5 size-4 rounded border-line text-brand focus:ring-brand"
              />
              <span>
                I have read and accept the{" "}
                <Link href="/terms" target="_blank" className="text-brand underline">
                  business terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" className="text-brand underline">
                  privacy policy
                </Link>.
              </span>
            </label>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Registering..." : "Complete Registration →"}
          </Button>
        </form>
      </div>
    </div>
  );
}
