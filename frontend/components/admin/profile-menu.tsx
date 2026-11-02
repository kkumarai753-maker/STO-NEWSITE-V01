"use client";

/**
 * Profile button (top right) that opens the account menu: who is signed in,
 * Settings, and Sign out. Built on Radix DropdownMenu: keyboard navigation,
 * focus management, Escape / click-outside to close.
 */
import Link from "next/link";
import { useRef } from "react";
import { DropdownMenu } from "radix-ui";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { logout } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

export type ProfileMenuUser = { name: string; email: string };

function initials({ name, email }: ProfileMenuUser) {
  const source = name.trim() || email;
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (name.trim() ? (parts[1]?.[0] ?? "") : "")).toUpperCase() || "A";
}

const itemClass =
  "flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text outline-none transition-colors data-highlighted:bg-tint/5";

export function ProfileMenu({ user }: { user: ProfileMenuUser }) {
  const logoutForm = useRef<HTMLFormElement>(null);
  const displayName = user.name.trim() || user.email;

  return (
    <>
      {/* Sign out is a Server Action; the menu item submits this form. */}
      <form ref={logoutForm} action={logout} hidden />

      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1 pr-1 pl-1 shadow-[0_1px_2px_rgb(15_23_42/0.05)] transition-colors hover:bg-surface-2 data-open:bg-surface-2 md:pr-3">
          <span
            aria-hidden
            className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-[0.8125rem] font-semibold text-white"
          >
            {initials(user)}
          </span>
          <span className="sr-only md:not-sr-only md:max-w-40 md:truncate md:text-sm md:font-medium md:text-text">
            {displayName}
          </span>
          <ChevronDown
            aria-hidden
            className="hidden size-4 text-subtle transition-transform duration-200 group-data-[state=open]:rotate-180 md:block"
          />
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={8}
            collisionPadding={12}
            className={cn(
              "z-70 w-64 rounded-2xl border border-line bg-surface p-1.5 shadow-[0_2px_6px_rgb(15_23_42/0.06),0_24px_60px_-20px_rgb(15_23_42/0.3)] outline-none",
              "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            )}
          >
            <DropdownMenu.Label className="flex items-center gap-3 px-3 py-2.5">
              <span
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-white"
              >
                {initials(user)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-text">{displayName}</span>
                {user.name.trim() ? <span className="block truncate text-xs text-subtle">{user.email}</span> : null}
              </span>
            </DropdownMenu.Label>

            <DropdownMenu.Separator className="my-1 h-px bg-line" />

            <DropdownMenu.Item asChild className={itemClass}>
              <Link href="/admin/settings">
                <Settings aria-hidden className="size-4 text-text-muted" />
                Settings
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="my-1 h-px bg-line" />

            <DropdownMenu.Item className={itemClass} onSelect={() => logoutForm.current?.requestSubmit()}>
              <LogOut aria-hidden className="size-4 text-text-muted" />
              Sign out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
}
