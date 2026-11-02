import { cn } from "@/lib/utils";

const format = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * Visible "Last updated" date. Pass the page's `updated` value from
 * config/pages.ts so it matches the sitemap and the WebPage `dateModified`.
 */
export function LastUpdated({ date, className }: { date: string; className?: string }) {
  return (
    <p className={cn("text-sm text-subtle", className)}>
      Last updated: <time dateTime={date}>{format.format(new Date(`${date}T00:00:00Z`))}</time>
    </p>
  );
}
