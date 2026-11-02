import { createHash } from "node:crypto";
import {
  clientKeyFromHeaders,
  createRateLimiter,
} from "@/lib/server/rate-limit";
export const maxDuration = 60;
const limiter = createRateLimiter({ limit: 8, windowMs: 10 * 60 * 1000 });
const MAX_BODY = 5 * 1024 * 1024 + 64 * 1024;
export async function POST(request: Request) {
  // Proxies can reconstruct request.url with an internal hostname. Compare the
  // browser Origin with the request Host, including the port.
  let sameOrigin = false;
  try {
    const origin = new URL(request.headers.get("origin") ?? "");
    sameOrigin =
      ["https:", "http:"].includes(origin.protocol) &&
      origin.host.toLowerCase() === request.headers.get("host")?.toLowerCase();
  } catch {
    /* Missing or malformed origins are rejected. */
  }
  if (!sameOrigin)
    return Response.json(
      { message: "Please submit from the Careers page." },
      { status: 403 },
    );
  const client = clientKeyFromHeaders(request.headers);
  if (!limiter(client).allowed)
    return Response.json(
      { message: "Too many attempts. Please try again in 10 minutes." },
      { status: 429 },
    );
  const base = process.env.BACKEND_API_URL?.replace(/\/$/, "");
  if (!base)
    return Response.json(
      {
        message:
          "Online applications are not active. Contact our hiring team for questions.",
      },
      { status: 503 },
    );
  if (Number(request.headers.get("content-length")) > MAX_BODY)
    return Response.json(
      { message: "Upload one PDF or DOCX up to 5 MB." },
      { status: 413 },
    );
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data"))
    return Response.json(
      { message: "Invalid application format." },
      { status: 415 },
    );
  try {
    const reader = request.body?.getReader();
    if (!reader) throw Error("empty");
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY) {
        await reader.cancel();
        return Response.json(
          { message: "Upload one PDF or DOCX up to 5 MB." },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    const body = Buffer.concat(chunks);
    const response = await fetch(`${base}/api/v1/careers/applications`, {
      method: "POST",
      headers: {
        "X-API-Key": process.env.BACKEND_API_KEY ?? "",
        "Content-Type": request.headers.get("content-type")!,
        "X-Recruitment-Client": createHash("sha256")
          .update(client)
          .digest("hex"),
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(50000),
    });
    const result = await response.json();
    if (!response.ok) {
      const detail = result.detail;
      return Response.json(
        {
          message:
            typeof detail === "string"
              ? detail
              : "Please correct the application details and try again.",
          fields: Array.isArray(detail)
            ? detail.filter((v: { field?: string }) => v.field)
            : [],
        },
        { status: response.status },
      );
    }
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      {
        message:
          "Your application could not be confirmed. Your form is unchanged; retry with the same details.",
      },
      { status: 503 },
    );
  }
}
