"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { safeAdminPath } from "@/lib/admin";
import { adminRequest, type AdminUser } from "@/lib/server/admin-api";
import {
  clearSessionCookie,
  getSessionToken,
  requireAdmin,
  setSessionCookie,
} from "@/lib/server/admin-session";
import { clientKeyFromHeaders, createRateLimiter } from "@/lib/server/rate-limit";
import {
  changePasswordFields,
  changePasswordSchema,
  fieldErrorsOf,
  loginSchema,
  readFields,
  type ChangePasswordField,
  type LoginField,
} from "@/lib/validation/admin";

export type LoginState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<LoginField, string>>;
  email?: string;
};

export type ChangePasswordState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ChangePasswordField, string>>;
};

/** 10 sign-in attempts per 15 minutes per client. */
const loginLimiter = createRateLimiter({ limit: 10, windowMs: 15 * 60 * 1000 });

const UNAVAILABLE = "The admin service is unavailable right now. Please try again in a moment.";

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const input = readFields(formData, ["email", "password"] as const, ["email"]);
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: fieldErrorsOf<LoginField>(parsed.error.issues),
      email: input.email,
    };
  }

  const rate = loginLimiter(clientKeyFromHeaders(await headers()));
  if (!rate.allowed) {
    return {
      status: "error",
      message: `Too many sign-in attempts. Please try again in ${Math.ceil(rate.retryAfterSeconds / 60)} minute(s).`,
      email: input.email,
    };
  }

  const res = await adminRequest<{ token: string; expires_at: string; admin: AdminUser }>("/auth/login", {
    method: "POST",
    body: parsed.data,
  });
  if (!res.ok) {
    return {
      status: "error",
      message: res.reason === "invalid" ? "Incorrect email or password." : UNAVAILABLE,
      email: input.email,
    };
  }

  await setSessionCookie(res.data.token, res.data.expires_at);
  redirect(safeAdminPath(formData.get("next")));
}

export async function logout() {
  const token = await getSessionToken();
  // Revoke on the backend; the cookie is cleared even if that fails.
  if (token) await adminRequest("/auth/logout", { method: "POST", token });
  await clearSessionCookie();
  redirect("/admin/login?reason=signed-out");
}

export async function changePassword(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const { token } = await requireAdmin();

  const parsed = changePasswordSchema.safeParse(readFields(formData, changePasswordFields));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: fieldErrorsOf<ChangePasswordField>(parsed.error.issues),
    };
  }

  const res = await adminRequest("/auth/change-password", {
    method: "POST",
    token,
    body: { current_password: parsed.data.currentPassword, new_password: parsed.data.newPassword },
  });
  if (res.ok) {
    return { status: "success", message: "Your password has been changed. Other devices have been signed out." };
  }
  if (res.reason === "unauthorized") redirect("/admin/login?reason=expired");
  if (res.reason === "invalid") {
    const wrongCurrent = res.status === 400;
    return {
      status: "error",
      message: res.message ?? "Please check the form and try again.",
      fieldErrors: wrongCurrent
        ? { currentPassword: res.message ?? "Your current password is incorrect." }
        : { newPassword: res.message },
    };
  }
  return { status: "error", message: UNAVAILABLE };
}
