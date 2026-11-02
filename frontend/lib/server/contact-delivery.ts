import "server-only";
import { siteConfig } from "@/config/site";
import type { ContactInput } from "@/lib/validation/contact";

/**
 * Delivers a validated contact submission.
 *
 * Configure ONE of the following server-side environment variables:
 *  - RESEND_API_KEY + CONTACT_TO_EMAIL (+ optional CONTACT_FROM_EMAIL)
 *  - CONTACT_WEBHOOK_URL  (receives a JSON POST, Slack, Zapier, n8n, CRM…)
 *
 * With nothing configured, the UI offers visitor-sent email/WhatsApp drafts.
 * The server never reports successful delivery without a working provider.
 */
export type DeliveryResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function renderEmail(data: ContactInput) {
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone / WhatsApp", data.phone || "Not provided"],
  ];
  const html = `
    <h2 style="font-family:system-ui,sans-serif">New project enquiry</h2>
    <table style="font-family:system-ui,sans-serif;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#555">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
        )
        .join("")}
    </table>
    <p style="font-family:system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(data.message)}</p>`;
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${data.message}`;
  return { html, text };
}

export async function deliverContactSubmission(data: ContactInput): Promise<DeliveryResult> {
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  const subject = `New enquiry from ${data.name}`;

  try {
    if (resendKey && toEmail) {
      const { html, text } = renderEmail(data);
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:
            process.env.CONTACT_FROM_EMAIL ??
            `${siteConfig.name} Website <onboarding@resend.dev>`,
          to: [toEmail],
          reply_to: data.email,
          subject,
          html,
          text,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        console.error("[contact] Resend responded with", res.status);
        return { ok: false, reason: "failed" };
      }
      return { ok: true };
    }

    if (webhookUrl) {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact_submission",
          subject,
          submittedAt: new Date().toISOString(),
          ...data,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        console.error("[contact] Webhook responded with", res.status);
        return { ok: false, reason: "failed" };
      }
      return { ok: true };
    }

    console.error(
      "[contact] No delivery channel configured. Set RESEND_API_KEY + CONTACT_TO_EMAIL or CONTACT_WEBHOOK_URL.",
    );
    return { ok: false, reason: "not-configured" };
  } catch (error) {
    console.error("[contact] Delivery error:", error instanceof Error ? error.message : error);
    return { ok: false, reason: "failed" };
  }
}
