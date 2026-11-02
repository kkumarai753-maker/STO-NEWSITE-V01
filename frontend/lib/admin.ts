/** Admin dashboard constants and formatting helpers (safe on server and client). */

export const ADMIN_COOKIE = "admin_session";

/** Remembers whether the sidebar is collapsed (read on the server: no layout jump). */
export const ADMIN_SIDEBAR_COOKIE = "admin_sidebar";

/** Sidebar links. Settings and sign-out live in the profile menu (top right). */
export const adminNav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Records", href: "/admin/records" },
] as const;

export const statusLabels = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
  spam: "Spam",
} as const;

export const periodLabels = {
  today: "Today",
  yesterday: "Yesterday",
  week: "This week",
  month: "This month",
  last_month: "Last month",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
} as const;

/** Records page: rows-per-page choices and default. */
export const RECORDS_PAGE_SIZES = [10, 20, 50] as const;
export const RECORDS_DEFAULT_PER = 20;

export type RecordsQuery = { q?: string; status?: string; period?: string; per?: number; page?: number };

/** URL for the records page with these filters (defaults are left out). Shared by server and client. */
export function recordsHref({ q, status, period, per = RECORDS_DEFAULT_PER, page = 1 }: RecordsQuery) {
  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (status) qs.set("status", status);
  if (period) qs.set("period", period);
  if (per !== RECORDS_DEFAULT_PER) qs.set("per", String(per));
  if (page > 1) qs.set("page", String(page));
  const s = qs.toString();
  return s ? `/admin/records?${s}` : "/admin/records";
}

/** Only same-app admin paths are allowed as a post-login destination. */
export function safeAdminPath(value: unknown): string {
  if (typeof value !== "string") return "/admin";
  if (!/^\/admin(\/[\w\-/?=&%.]*)?$/.test(value) || value.includes("..") || value.includes("//")) return "/admin";
  if (value.startsWith("/admin/login")) return "/admin";
  return value;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDateTime(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  }).format(new Date(iso));
}

/** `date` is a calendar day (YYYY-MM-DD), format it without shifting zones. */
export function formatDay(date: string, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }) {
  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
