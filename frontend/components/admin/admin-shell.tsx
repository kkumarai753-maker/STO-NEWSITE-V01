"use client";

/**
 * Signed-in admin shell: collapsible left sidebar + top bar with the profile menu.
 *  - md and up: the round button on the sidebar's edge toggles it between full
 *    (icons + labels) and a narrow icon rail; the choice is kept in a cookie
 *    so the server renders it right.
 *  - Phones: always the icon rail (the content needs the width).
 * Why client: the collapse state.
 */
import { useState, type ReactNode } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ADMIN_SIDEBAR_COOKIE } from "@/lib/admin";
import { cn } from "@/lib/utils";
import { AdminNav } from "./admin-nav";
import { ProfileMenu, type ProfileMenuUser } from "./profile-menu";

export function AdminShell({
  user,
  defaultCollapsed,
  children,
}: {
  user: ProfileMenuUser;
  defaultCollapsed: boolean;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${ADMIN_SIDEBAR_COOKIE}=${next ? "collapsed" : "expanded"}; path=/admin; max-age=31536000; samesite=lax`;
  };

  return (
    <div className="min-h-dvh">
      <a
        href="#admin-content"
        className="sr-only rounded-full bg-text px-4 py-2 text-sm font-medium text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60"
      >
        Skip to content
      </a>

      <aside
        id="admin-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-16 flex-col overflow-hidden border-r border-line bg-surface/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          collapsed ? "md:w-16" : "md:w-60",
        )}
      >
        <div className={cn("flex h-16 shrink-0 items-center justify-center px-3", !collapsed && "md:justify-start md:px-5")}>
          <Logo
            href="/admin"
            className={cn("text-[2rem] sm:text-[2rem] [&>span]:hidden", !collapsed && "md:[&>span]:flex")}
          />
        </div>

        <AdminNav collapsed={collapsed} className="flex-1 overflow-y-auto px-2 pt-2 md:px-3" />
      </aside>

      {/* Collapse / expand (md and up; phones always use the icon rail). Centred on
          the corner where the sidebar edge meets the top bar's bottom line, and
          moves with the edge. Outside <aside> because its overflow is hidden. */}
      <button
        type="button"
        onClick={toggle}
        aria-controls="admin-sidebar"
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "fixed top-16 z-55 hidden size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-surface text-text-muted shadow-[0_1px_2px_rgb(15_23_42/0.06),0_4px_12px_-4px_rgb(15_23_42/0.18)] transition-[left,color,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-surface-2 hover:text-text md:grid",
          collapsed ? "left-16" : "left-60",
        )}
      >
        {collapsed ? <PanelLeftOpen aria-hidden className="size-4" /> : <PanelLeftClose aria-hidden className="size-4" />}
      </button>

      <div
        className={cn(
          "pl-16 transition-[padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          collapsed ? "md:pl-16" : "md:pl-60",
        )}
      >
        <header className="sticky top-0 z-40 flex h-16 items-center justify-end gap-3 border-b border-line bg-surface/80 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 sm:px-6 lg:px-8">
          <ProfileMenu user={user} />
        </header>

        <div id="admin-content" tabIndex={-1} className="container-page py-8 outline-none sm:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
