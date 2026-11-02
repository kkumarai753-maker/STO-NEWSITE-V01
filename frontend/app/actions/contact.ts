"use server";

import { headers } from "next/headers";
import { siteConfig } from "@/config/site";
import { isBackendConfigured, saveContactSubmission } from "@/lib/server/backend";
import { deliverContactSubmission } from "@/lib/server/contact-delivery";
import { clientKeyFromHeaders, createRateLimiter } from "@/lib/server/rate-limit";
import {
  HONEYPOT_FIELD,
  STARTED_AT_FIELD,
  readContactForm,
  validateContact,
  type ContactFieldErrors,
} from "@/lib/validation/contact";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: ContactFieldErrors;
};

/** 5 submissions per 10 minutes per client. */
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
/** Humans need more than a couple of seconds to fill in seven fields. */
const MIN_FILL_TIME_MS = 2500;
const MAX_LINKS = 4;

const received = (name: string): ContactFormState => ({
  status: "success",
  message: `Thanks, ${name.split(" ")[0]}! We've received your project details and will get back to you shortly.`,
});

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const requestHeaders = await headers();

  // 1. Spam: honeypot. Browser autofill and extensions sometimes fill it for real
  //    visitors, so it only flags the submission: it is still saved (as spam) for
  //    the admin to review, and the visitor sees the normal confirmation.
  const honeypot = formData.get(HONEYPOT_FIELD);
  const suspectedSpam = typeof honeypot === "string" && honeypot.trim() !== "";

  // 2. Spam: submitted implausibly fast after the form became interactive.
  const startedAt = Number(formData.get(STARTED_AT_FIELD));
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return {
      status: "error",
      message: "That was quick! Please review your details and submit again.",
    };
  }

  // 3. Abuse: rate limit per client.
  const rate = limiter(clientKeyFromHeaders(requestHeaders));
  if (!rate.allowed) {
    return {
      status: "error",
      message: `Too many submissions. Please try again in ${Math.ceil(rate.retryAfterSeconds / 60)} minute(s).`,
    };
  }

  // 4. Validate, never trust the client.
  const parsed = validateContact(readContactForm(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
    };
  }

  const linkCount = (parsed.data.message.match(/https?:\/\//gi) ?? []).length;
  if (linkCount > MAX_LINKS) {
    return {
      status: "error",
      message: "Please reduce the number of links in your message.",
      fieldErrors: { message: "Too many links." },
    };
  }

  // 5. Store in the database (FastAPI backend). When the backend is configured
  //    it is the source of truth: email/webhook become an optional notification.
  if (isBackendConfigured()) {
    const clientKey = clientKeyFromHeaders(requestHeaders);
    const saved = await saveContactSubmission(parsed.data, {
      ipAddress: clientKey === "anonymous" ? undefined : clientKey,
      userAgent: requestHeaders.get("user-agent") ?? undefined,
      suspectedSpam,
    });
    if (!saved.ok) {
      return {
        status: "error",
        message: `We couldn't send your message right now. Please email us at ${siteConfig.contact.email}.`,
      };
    }
    if (suspectedSpam) {
      console.warn("[contact] Saved submission", saved.id, "as spam (honeypot filled); no notification sent.");
    } else {
      const notify = await deliverContactSubmission(parsed.data);
      if (!notify.ok && notify.reason === "failed") {
        console.error("[contact] Saved submission", saved.id, "but the notification failed.");
      }
    }
    return received(parsed.data.name);
  }

  // 6. No backend: deliver by email/webhook only. Suspected spam has nowhere to be
  //    kept for review, so it is not sent on.
  if (suspectedSpam) return received(parsed.data.name);
  const delivery = await deliverContactSubmission(parsed.data);
  if (!delivery.ok) {
    return {
      status: "error",
      message: `We couldn't send your message right now. Please email us at ${siteConfig.contact.email}.`,
    };
  }

  return received(parsed.data.name);
}
