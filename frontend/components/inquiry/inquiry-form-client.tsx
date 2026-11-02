"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export function InquiryFormClient() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    division: "Web & Technology Solutions",
    date: "",
    time: "",
    requirement: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const msg = [
      "New Sunrise Tech Origin Enquiry",
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      `Email: ${formData.email}`,
      `City: ${formData.city}`,
      `Division: ${formData.division}`,
      `Preferred meeting: ${formData.date || "Flexible"}, ${formData.time || "Flexible"}`,
      `Requirement: ${formData.requirement}`,
    ].join("\n");

    const waUrl = `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-line bg-surface/90 p-6 sm:p-10 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-6">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Rahul Sharma"
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text placeholder:text-text-muted/60 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            WhatsApp Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text placeholder:text-text-muted/60 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text placeholder:text-text-muted/60 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Nagpur, Mumbai, Pune"
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text placeholder:text-text-muted/60 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="division" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Interested Division <span className="text-red-500">*</span>
          </label>
          <select
            id="division"
            name="division"
            required
            value={formData.division}
            onChange={handleChange}
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="Web & Technology Solutions">Web & Technology Solutions</option>
            <option value="Digital Marketing & Growth">Digital Marketing & Growth</option>
            <option value="Combined Growth Plan">Combined Growth Plan (Tech + Marketing)</option>
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Preferred Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Tentative Time
          </label>
          <input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="requirement" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Short Requirement <span className="text-red-500">*</span>
          </label>
          <textarea
            id="requirement"
            name="requirement"
            rows={4}
            required
            value={formData.requirement}
            onChange={handleChange}
            placeholder="Tell us what your business needs, goals, or current digital challenges..."
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text placeholder:text-text-muted/60 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-tint/10 bg-tint/5 p-4 mb-6 text-xs text-text-muted leading-relaxed">
        <strong>What happens when you submit:</strong> Submitting will open a pre-formatted
        WhatsApp message with all your details. Please tap send in WhatsApp to submit it to our team.
        We will review and confirm your meeting time promptly.
      </div>

      <Button type="submit" size="lg" className="w-full bg-[#25d366] hover:bg-[#20ba5a] text-white">
        <Send className="mr-2 size-4" />
        Submit via WhatsApp →
      </Button>
    </form>
  );
}
