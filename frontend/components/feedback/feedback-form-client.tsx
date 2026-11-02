"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export function FeedbackFormClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = "Sunrise Tech Origin Feedback";
    const body = `Name: ${name}\nEmail: ${email}\n\nFeedback:\n${feedback}`;
    const mailto = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-surface/90 p-8 text-center shadow-sm">
        <div className="mx-auto size-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center mb-4">
          <CheckCircle2 className="size-6" />
        </div>
        <h2 className="text-2xl font-bold text-text">Thank You!</h2>
        <p className="mt-2 text-sm text-text-muted">
          Your feedback email has been prepared. We appreciate your insights and will review them thoroughly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-line bg-surface/90 p-6 sm:p-10 shadow-sm space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Your Feedback / Suggestion <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          required
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us about your experience, what we can improve, or any suggestions..."
          className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      <Button type="submit" size="lg" className="w-full">
        <Send className="mr-2 size-4" />
        Send Feedback via Email →
      </Button>
    </form>
  );
}
