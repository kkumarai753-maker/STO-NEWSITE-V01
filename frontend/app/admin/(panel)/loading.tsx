import { Skeleton } from "@/components/admin/ui";

/** Shown while an admin page's data loads. */
export default function AdminLoading() {
  return (
    <div role="status" aria-label="Loading" className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-3xl" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
