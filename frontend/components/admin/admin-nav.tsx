"use client";

/** Admin section links. Why client: highlights the current page. */
import { LayoutDashboard, Inbox, Briefcase } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "@/lib/admin";
import { cn } from "@/lib/utils";

const icons = {
  "/admin": LayoutDashboard,
  "/admin/records": Inbox,
  "/admin/recruitment": Briefcase,
} as const;

/**
 * Vertical sidebar links. Icons only on phones and whenever the sidebar is
 * collapsed (labels stay available to screen readers and as tooltips).
 */
export function AdminNav({ className, collapsed = false }: { className?: string; collapsed?: boolean }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className={className}>
      <ul className="flex flex-col gap-0.5">
        {adminNav.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = icons[item.href];
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                title={item.label}
                className={cn(
                  "relative flex items-center justify-center gap-2.5 rounded-xl px-3 py-2.5 text-sm whitespace-nowrap transition-colors duration-200",
                  !collapsed && "md:justify-start",
                  active ? "bg-tint/6 font-medium text-text" : "text-text-muted hover:bg-tint/4 hover:text-text",
                )}
              >
                <Icon aria-hidden className="size-4 shrink-0" />
                <span className={cn("sr-only", !collapsed && "md:not-sr-only")}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
