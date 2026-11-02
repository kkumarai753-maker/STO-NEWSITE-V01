import "server-only";
import { connection } from "next/server";
import type { CareersData } from "@/lib/careers";
export async function getCareers(): Promise<CareersData> {
  await connection();
  const empty: CareersData = {
    roles: [],
    applications_enabled: false,
    email_enabled: false,
    retention_days: null,
    available: false,
  };
  if (!process.env.BACKEND_API_URL) return empty;
  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL.replace(/\/$/, "")}/api/v1/careers`,
      {
        headers: { "X-API-Key": process.env.BACKEND_API_KEY ?? "" },
        cache: "no-store",
        signal: AbortSignal.timeout(12000),
      },
    );
    if (!response.ok) return empty;
    return { ...(await response.json()), available: true };
  } catch {
    return empty;
  }
}
