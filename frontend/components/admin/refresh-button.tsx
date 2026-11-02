"use client";

/** Re-fetches the current page's server data. Why client: router.refresh + pending state. */
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RefreshButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={() => startTransition(() => router.refresh())}
      disabled={pending}
      aria-busy={pending}
    >
      <RotateCw aria-hidden className={cn(pending && "animate-spin")} />
      {pending ? "Refreshing…" : "Refresh"}
    </Button>
  );
}
