"use server";
import { submitContact, type ContactFormState } from "./contact";
import { proposalMessage } from "@/lib/validation/proposal";
export async function submitProposal(
  previous: ContactFormState,
  data: FormData,
): Promise<ContactFormState> {
  try {
    data.set(
      "message",
      proposalMessage(
        data.getAll("services").map(String),
        String(data.get("brief") ?? ""),
      ),
    );
  } catch {
    return {
      status: "error",
      message:
        "Select at least one valid service and keep your brief under 1,500 characters.",
    };
  }
  return submitContact(previous, data);
}
