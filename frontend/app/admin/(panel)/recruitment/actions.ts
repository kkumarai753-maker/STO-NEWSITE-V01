"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/server/admin-session";
import { adminRequest } from "@/lib/server/admin-api";
export async function saveRole(previous: { message: string }, data: FormData) {
  const { token } = await requireAdmin();
  let payload;
  try {
    payload = JSON.parse(String(data.get("payload")));
  } catch {
    return { message: "Please review the role fields." };
  }
  const id = String(data.get("id"));
  if (!/^(WEB|SW|AI|SM)-\d{2}$/.test(id)) return { message: "Invalid role." };
  const result = await adminRequest(`/careers/roles/${id}`, {
    token,
    method: "POST",
    body: payload,
  });
  if (!result.ok)
    return {
      message:
        result.message ?? "The role could not be saved. Please try again.",
    };
  revalidatePath("/careers", "layout");
  revalidatePath("/admin/recruitment");
  return { message: "Role saved." };
}
export async function updateApplication(data: FormData) {
  const { token } = await requireAdmin();
  const id = String(data.get("id"));
  if (!/^STO-[A-F0-9]{24}$/.test(id)) throw Error("Invalid application.");
  const result = await adminRequest(`/careers/applications/${id}`, {
    token,
    method: "POST",
    body: {
      status: String(data.get("status")),
      notes: String(data.get("notes") ?? ""),
    },
  });
  if (!result.ok)
    throw Error(result.message ?? "Could not save the application.");
  revalidatePath(`/admin/recruitment/applications/${id}`);
  redirect(`/admin/recruitment/applications/${id}?saved=1`);
}
export async function deleteApplication(data: FormData) {
  const { token } = await requireAdmin();
  if (data.get("confirm") !== "yes") throw Error("Confirm deletion first.");
  const id = String(data.get("id"));
  if (!/^STO-[A-F0-9]{24}$/.test(id)) throw Error("Invalid application.");
  const result = await adminRequest(`/careers/applications/${id}/delete`, {
    token,
    method: "POST",
  });
  if (!result.ok) throw Error("Could not delete this application.");
  revalidatePath("/admin/recruitment");
  redirect("/admin/recruitment?deleted=1");
}
export async function purgeExpired(data: FormData) {
  const { token } = await requireAdmin();
  if (data.get("confirm") !== "yes")
    throw Error("Confirm expiry cleanup first.");
  const result = await adminRequest<{ deleted: number }>("/careers/purge", {
    token,
    method: "POST",
  });
  if (!result.ok) throw Error("Could not remove expired applications.");
  revalidatePath("/admin/recruitment");
  redirect(`/admin/recruitment?purged=${result.data.deleted}`);
}
