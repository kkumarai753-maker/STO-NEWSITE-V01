import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminRequest, type AdminUser } from "@/lib/server/admin-api";
import { ADMIN_COOKIE } from "@/lib/admin";

/**
 * Admin session (database-backed). The cookie holds an opaque token issued by
 * the backend, which stores only its hash; every protected page re-verifies it.
 */

export async function setSessionCookie(token: string, expiresAt: string) {
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    expires: new Date(expiresAt),
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
}

export async function getSessionToken() {
  return (await cookies()).get(ADMIN_COOKIE)?.value;
}

type SessionCheck =
  | { status: "ok"; admin: AdminUser; token: string }
  | { status: "unauthenticated"; hadCookie: boolean }
  | { status: "unavailable" };

/** Verifies the session with the backend. Cached for the duration of one request. */
export const getAdminSession = cache(async (): Promise<SessionCheck> => {
  const token = await getSessionToken();
  if (!token) return { status: "unauthenticated", hadCookie: false };
  const res = await adminRequest<AdminUser>("/auth/me", { token });
  if (res.ok) return { status: "ok", admin: res.data, token };
  if (res.reason === "unauthorized") return { status: "unauthenticated", hadCookie: true };
  return { status: "unavailable" };
});

/**
 * Use at the top of every protected page / action. Redirects to the login page
 * when signed out or expired; throws (→ error boundary) when the backend is down.
 */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (session.status === "ok") return session;
  if (session.status === "unauthenticated") {
    redirect(session.hadCookie ? "/admin/login?reason=expired" : "/admin/login");
  }
  throw new Error("The admin service is unavailable. Check that the backend is running.");
}
