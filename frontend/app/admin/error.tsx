"use client";

/** Error boundary for the admin shell itself, e.g. the session check can't reach the backend. */
import { AdminErrorPanel } from "@/components/admin/error-panel";

export default function AdminError(props: Parameters<typeof AdminErrorPanel>[0]) {
  return (
    <div className="container-page py-10">
      <AdminErrorPanel {...props} />
    </div>
  );
}
