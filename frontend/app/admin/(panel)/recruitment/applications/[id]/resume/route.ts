import { requireAdmin } from "@/lib/server/admin-session";
import { adminRequest } from "@/lib/server/admin-api";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { token } = await requireAdmin();
  const { id } = await params;
  if (!/^STO-[A-F0-9]{24}$/.test(id))
    return new Response("Not found", { status: 404 });
  const ticket = await adminRequest<{ ticket: string }>(
    `/careers/applications/${id}/download-ticket`,
    { token, method: "POST" },
  );
  if (!ticket.ok)
    return new Response("Resume unavailable", { status: ticket.status ?? 503 });
  const response = await fetch(
    `${process.env.BACKEND_API_URL?.replace(/\/$/, "")}/api/v1/admin/careers/applications/${id}/resume?ticket=${encodeURIComponent(ticket.data.ticket)}`,
    {
      headers: {
        "X-API-Key": process.env.BACKEND_API_KEY ?? "",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    },
  );
  if (!response.ok)
    return new Response("Resume unavailable", { status: response.status });
  return new Response(response.body, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition":
        response.headers.get("content-disposition") ??
        'attachment; filename="resume"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "sandbox",
    },
  });
}
