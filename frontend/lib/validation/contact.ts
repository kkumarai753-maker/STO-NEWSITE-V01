import * as z from "zod/mini";
import { isContactPhone } from "@/lib/phone";

/**
 * Contact form schema, shared by client-side validation and the server
 * action. Uses `zod/mini` to keep the client bundle small. The server is the
 * source of truth: it always re-validates.
 */


export const contactSchema = z.object({
  name: z
    .string()
    .check(
      z.minLength(2, "Please enter your name."),
      z.maxLength(100, "Name is too long."),
    ),
  email: z
    .string()
    .check(
      z.minLength(1, "Please enter your email."),
      z.maxLength(254, "Email is too long."),
      z.regex(
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        "Please enter a valid email address.",
      ),
    ),
  phone: z
    .string()
    .check(
      z.maxLength(16, "Please enter a valid mobile number."),
      z.refine(isContactPhone, "Please enter a valid mobile number for your country."),
    ),
  message: z
    .string()
    .check(
      z.minLength(10, "Please tell us a little more."),
      z.maxLength(4000, "Please keep it under 4,000 characters."),
    ),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export const contactFields = [
  "name",
  "email",
  "phone",
  "message",
] as const satisfies readonly ContactField[];

/**
 * Honeypot field name, real users never see or fill it. Deliberately not a name
 * browsers recognise ("website", "url", "company"…): autofill fills those, which
 * made genuine submissions look like bots and get silently dropped.
 */
export const HONEYPOT_FIELD = "ref_code";
/** Hidden field holding the time the form became interactive. */
export const STARTED_AT_FIELD = "startedAt";

/** Read + trim the contact fields from FormData without trusting types. */
export function readContactForm(formData: FormData): Record<ContactField, string> {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  return Object.fromEntries(contactFields.map((f) => [f, read(f)])) as Record<
    ContactField,
    string
  >;
}

export function validateContact(input: Record<ContactField, string>) {
  const result = contactSchema.safeParse(input);
  if (result.success) return { success: true as const, data: result.data };

  const fieldErrors: ContactFieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as ContactField | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { success: false as const, fieldErrors };
}
