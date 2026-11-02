import "server-only";

/**
 * Client for the FastAPI admin endpoints (../backend, /api/v1/admin). Server-only:
 * the API key and the admin's session token never reach the browser.
 * Uses the same BACKEND_API_URL / BACKEND_API_KEY as lib/server/backend.ts.
 */

export type ContactStatus = "new" | "contacted" | "closed" | "spam";
export const CONTACT_STATUSES: readonly ContactStatus[] = ["new", "contacted", "closed", "spam"];

export type Period = "today" | "yesterday" | "week" | "month" | "last_month" | "7d" | "30d";
export const PERIODS: readonly Period[] = ["today", "yesterday", "week", "month", "last_month", "7d", "30d"];

export type AdminUser = {
  id: number;
  email: string;
  name: string;
  last_login_at: string | null;
  password_changed_at: string;
  timezone: string;
};

export type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: ContactStatus;
  source: string;
  created_at: string;
  updated_at: string;
};

export type ContactList = { items: Contact[]; total: number; limit: number; offset: number };

export type DashboardStats = {
  timezone: string;
  generated_at: string;
  latest_submission_at: string | null;
  totals: {
    total: number;
    today: number;
    yesterday: number;
    this_week: number;
    this_month: number;
    last_month: number;
    last_7_days: number;
    last_30_days: number;
    unique_senders: number;
  };
  by_status: { status: ContactStatus; count: number }[];
  by_source: { source: string; count: number }[];
  daily: { date: string; count: number }[];
};

export type ApiResult<T> =
  | { ok: true; data: T }
  /** unauthorized: missing/expired session · invalid: rejected input · unavailable: backend down or misconfigured */
  | { ok: false; reason: "unauthorized" | "invalid" | "unavailable"; status?: number; message?: string };

export function isAdminConfigured() {
  return Boolean(process.env.BACKEND_API_URL);
}

/** FastAPI errors are `{detail: string}` or `{detail: [{msg}]}` (validation). */
function errorMessage(body: unknown): string | undefined {
  const detail = (body as { detail?: unknown } | null)?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const msg = (detail[0] as { msg?: unknown } | undefined)?.msg;
    if (typeof msg === "string") return msg.replace(/^Value error, /, "");
  }
  return undefined;
}

export async function adminRequest<T>(
  path: string,
  { token, method = "GET", body }: { token?: string; method?: "GET" | "POST"; body?: unknown } = {},
): Promise<ApiResult<T>> {
  const baseUrl = process.env.BACKEND_API_URL?.replace(/\/$/, "");
  if (!baseUrl) return { ok: false, reason: "unavailable", message: "BACKEND_API_URL is not set." };

  try {
    const res = await fetch(`${baseUrl}/api/v1/admin${path}`, {
      method,
      headers: {
        "X-API-Key": process.env.BACKEND_API_KEY ?? "",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
      // Long enough for a sleeping backend host (e.g. Render free tier) to wake up.
      // Must stay below maxDuration in app/admin/layout.tsx.
      signal: AbortSignal.timeout(50_000),
    });
    if (res.status === 204) return { ok: true, data: undefined as T };
    const json: unknown = await res.json().catch(() => null);
    if (res.ok) return { ok: true, data: json as T };

    const message = errorMessage(json);
    // A 401 with a token is an expired session; without one (login) it's bad credentials.
    if (res.status === 401 && token) return { ok: false, reason: "unauthorized", status: 401, message };
    if (res.status === 400 || res.status === 401 || res.status === 422) {
      return { ok: false, reason: "invalid", status: res.status, message };
    }
    console.error("[admin] Backend responded with", res.status, message ?? "");
    return { ok: false, reason: "unavailable", status: res.status, message };
  } catch (error) {
    console.error("[admin] Backend error:", error instanceof Error ? error.message : error);
    return { ok: false, reason: "unavailable" };
  }
}
