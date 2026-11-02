import * as z from "zod/mini";

/**
 * Admin sign-in and change-password schemas, shared by the client forms and
 * the server actions. Password rules mirror backend/app/schemas/admin.py.
 */
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;

export const loginSchema = z.object({
  email: z
    .string()
    .check(
      z.minLength(1, "Please enter your email."),
      z.maxLength(254, "Email is too long."),
      z.regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Please enter a valid email address."),
    ),
  password: z
    .string()
    .check(z.minLength(1, "Please enter your password."), z.maxLength(PASSWORD_MAX, "Password is too long.")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type LoginField = keyof LoginInput;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .check(z.minLength(1, "Please enter your current password."), z.maxLength(PASSWORD_MAX, "Password is too long.")),
    newPassword: z
      .string()
      .check(
        z.minLength(PASSWORD_MIN, `Use at least ${PASSWORD_MIN} characters.`),
        z.maxLength(PASSWORD_MAX, `Use at most ${PASSWORD_MAX} characters.`),
        z.regex(/[A-Za-z]/, "Include at least one letter."),
        z.regex(/\d/, "Include at least one number."),
      ),
    confirmPassword: z.string().check(z.minLength(1, "Please confirm the new password.")),
  })
  .check(
    z.refine((v) => v.confirmPassword === "" || v.newPassword === v.confirmPassword, {
      message: "The passwords don't match.",
      path: ["confirmPassword"],
    }),
    z.refine((v) => v.currentPassword === "" || v.newPassword !== v.currentPassword, {
      message: "Choose a password different from the current one.",
      path: ["newPassword"],
    }),
  );

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ChangePasswordField = keyof ChangePasswordInput;
export const changePasswordFields = [
  "currentPassword",
  "newPassword",
  "confirmPassword",
] as const satisfies readonly ChangePasswordField[];

/** Run a schema and collect the first message per field. */
export function fieldErrorsOf<K extends string>(
  issues: readonly { path: readonly PropertyKey[]; message: string }[],
): Partial<Record<K, string>> {
  const errors: Partial<Record<K, string>> = {};
  for (const issue of issues) {
    const key = issue.path[0] as K | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/** Read string fields from FormData without trusting types. Passwords are not trimmed. */
export function readFields<K extends string>(formData: FormData, fields: readonly K[], trim: readonly K[] = []) {
  return Object.fromEntries(
    fields.map((f) => {
      const value = formData.get(f);
      const str = typeof value === "string" ? value : "";
      return [f, trim.includes(f) ? str.trim() : str];
    }),
  ) as Record<K, string>;
}
