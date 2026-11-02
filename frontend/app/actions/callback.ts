"use server";
import { submitContact, type ContactFormState } from "./contact";
import { serviceCategories } from "@/data/service-categories";

export async function submitCallback(
  previous: ContactFormState,
  input: FormData,
): Promise<ContactFormState> {
  const rawPhone = String(input.get("callbackPhone") ?? "").trim();
  const digits = rawPhone.replace(/\D/g, "");
  const requirement = String(input.get("requirement") ?? "");
  const details = String(input.get("details") ?? "").trim();
  if (!/^[+\d ()-]+$/.test(rawPhone) || digits.length < 7 || digits.length > 15)
    return {
      status: "error",
      message:
        "Please enter a valid contact number, including your country code.",
    };
  if (
    ![...serviceCategories.map((c) => c.name), "Help me choose"].includes(
      requirement,
    )
  )
    return {
      status: "error",
      message: "Please choose what you need help with.",
    };
  if (details.length > 3000)
    return {
      status: "error",
      message: "Please keep your message under 3,000 characters.",
    };
  const form = new FormData();
  for (const key of ["name", "email", "ref_code", "startedAt"])
    form.set(key, String(input.get(key) ?? ""));
  // The existing backend accepts a ten-digit local phone; preserve every complete
  // international number in the message rather than truncating it.
  form.set("phone", digits.length === 10 ? digits : "");
  form.set(
    "message",
    `Callback requested\nRequirement: ${requirement}\nContact number: ${rawPhone}\n\n${details || "Please call me to discuss my requirements."}`,
  );
  return submitContact(previous, form);
}
