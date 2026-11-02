import { redirect } from "next/navigation";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const values = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (Array.isArray(value)) value.forEach((v) => query.append(key, v));
    else if (value) query.set(key, value);
  }
  redirect(`/build-your-proposal${query.size ? `?${query}` : ""}`);
}
