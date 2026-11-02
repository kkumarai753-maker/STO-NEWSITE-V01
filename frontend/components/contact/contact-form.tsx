import { connection } from "next/server";
import { isBackendConfigured } from "@/lib/server/backend";
import { ContactFormClient } from "./contact-form-client";

/** Choose a delivery flow on the server without exposing provider credentials. */
export async function ContactForm() {
  // Docker and other self-hosted deployments inject delivery settings at runtime.
  await connection();
  const deliveryAvailable =
    isBackendConfigured() ||
    Boolean(
      (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL) ||
        process.env.CONTACT_WEBHOOK_URL,
    );
  return <ContactFormClient deliveryAvailable={deliveryAvailable} />;
}
