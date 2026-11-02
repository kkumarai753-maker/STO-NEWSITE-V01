import { connection } from "next/server";
import { isBackendConfigured } from "@/lib/server/backend";
import { CallbackPrompt } from "./callback-prompt";
import { CallbackForm } from "./callback-form";
export async function CallbackSection() {
  await connection();
  const deliveryAvailable =
    isBackendConfigured() ||
    Boolean(
      (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL) ||
        process.env.CONTACT_WEBHOOK_URL,
    );
  return (
    <CallbackPrompt>
      <CallbackForm deliveryAvailable={deliveryAvailable} />
    </CallbackPrompt>
  );
}
