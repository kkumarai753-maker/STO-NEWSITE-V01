import { cookies } from "next/headers";
import { AdminShell } from "@/components/admin/admin-shell";
import { ADMIN_SIDEBAR_COOKIE } from "@/lib/admin";
import { requireAdmin } from "@/lib/server/admin-session";

/** Signed-in admin shell. Pages call requireAdmin() too (layouts don't re-run on every navigation). */
export default async function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  const { admin } = await requireAdmin();
  const collapsed = (await cookies()).get(ADMIN_SIDEBAR_COOKIE)?.value === "collapsed";
  return (
    <AdminShell user={{ name: admin.name, email: admin.email }} defaultCollapsed={collapsed}>
      {children}
    </AdminShell>
  );
}
