import "server-only";
import type { ContactInput } from "@/lib/validation/contact";

/**
 * Client for the FastAPI backend (../backend). Server-only: the API key never
 * reaches the browser.
 *
 *  - BACKEND_API_URL  e.g. http://localhost:8000 (empty disables the backend)
 *  - BACKEND_API_KEY  must match API_KEY in backend/.env
 */
export type SaveResult = { ok: true; id: number } | { ok: false; reason: "not-configured" | "failed" };

export function isBackendConfigured() {
  return Boolean(process.env.BACKEND_API_URL);
}

export async function saveContactSubmission(
  data: ContactInput,
  meta: { ipAddress?: string; userAgent?: string; suspectedSpam?: boolean } = {},
): Promise<SaveResult> {
  const baseUrl = process.env.BACKEND_API_URL?.replace(/\/$/, "");
  if (!baseUrl) return { ok: false, reason: "not-configured" };

  try {
    const res = await fetch(`${baseUrl}/api/v1/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.BACKEND_API_KEY ?? "",
      },
      body: JSON.stringify({
        ...data,
        source: "website",
        ip_address: meta.ipAddress?.slice(0, 45) || null,
        user_agent: meta.userAgent?.slice(0, 512) || null,
        status: meta.suspectedSpam ? "spam" : "new",
      }),
      cache: "no-store",
      // Long enough for a sleeping backend host (e.g. Render free tier) to wake up.
      // Must stay below maxDuration in app/page.tsx.
      signal: AbortSignal.timeout(50_000),
    });
    if (!res.ok) {
      console.error("[contact] Backend responded with", res.status, await res.text().catch(() => ""));
      return { ok: false, reason: "failed" };
    }
    const saved = (await res.json()) as { id: number };
    return { ok: true, id: saved.id };
  } catch (error) {
    console.error("[contact] Backend error:", error instanceof Error ? error.message : error);
    return { ok: false, reason: "failed" };
  }
}
