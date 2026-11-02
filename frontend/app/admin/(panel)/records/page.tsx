import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RecordsFilters } from "@/components/admin/records-filters";
import { RefreshButton } from "@/components/admin/refresh-button";
import { AdminPageHeader, Card, EmptyState, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import {
  RECORDS_DEFAULT_PER,
  RECORDS_PAGE_SIZES,
  formatDateTime,
  formatNumber,
  periodLabels,
  recordsHref,
  statusLabels,
} from "@/lib/admin";
import {
  CONTACT_STATUSES,
  PERIODS,
  adminRequest,
  type Contact,
  type ContactList,
  type ContactStatus,
  type Period,
} from "@/lib/server/admin-api";
import { requireAdmin } from "@/lib/server/admin-session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Records" };

type Filters = { q: string; status?: ContactStatus; period?: Period; per: number; page: number };

function readFilters(params: Record<string, string | string[] | undefined>): Filters {
  const one = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : "");
  const per = Number(one("per"));
  const page = Number(one("page"));
  return {
    q: one("q").trim().slice(0, 200),
    status: CONTACT_STATUSES.includes(one("status") as ContactStatus) ? (one("status") as ContactStatus) : undefined,
    period: PERIODS.includes(one("period") as Period) ? (one("period") as Period) : undefined,
    per: RECORDS_PAGE_SIZES.includes(per as (typeof RECORDS_PAGE_SIZES)[number]) ? per : RECORDS_DEFAULT_PER,
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

/** URL for these filters with some values changed (defaults are left out). */
function hrefFor(filters: Filters, changes: Partial<Filters>) {
  return recordsHref({ ...filters, ...changes });
}

export default async function AdminRecordsPage({ searchParams }: PageProps<"/admin/records">) {
  const { token, admin } = await requireAdmin();
  const filters = readFilters(await searchParams);

  const query = new URLSearchParams({ limit: String(filters.per), offset: String((filters.page - 1) * filters.per) });
  if (filters.q) query.set("q", filters.q);
  if (filters.status) query.set("status", filters.status);
  if (filters.period) query.set("period", filters.period);

  const res = await adminRequest<ContactList>(`/contacts?${query}`, { token });
  if (!res.ok) {
    if (res.reason === "unauthorized") redirect("/admin/login?reason=expired");
    throw new Error("Could not load records.");
  }

  const { items, total } = res.data;
  const pages = Math.max(1, Math.ceil(total / filters.per));
  // Out-of-range page (e.g. after filtering): go to the last page that exists.
  if (filters.page > pages && total > 0) redirect(hrefFor(filters, { page: pages }));

  const filtered = Boolean(filters.q || filters.status || filters.period);
  const from = total ? (filters.page - 1) * filters.per + 1 : 0;
  const to = Math.min(filters.page * filters.per, total);
  const tz = admin.timezone;

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Records"
        title="Contact submissions"
        description="Everyone who has sent the contact form on the website, newest first."
        actions={<RefreshButton />}
      />

      <Card className="overflow-hidden">
        {/* Search as you type + instant dropdowns. Filters live in the URL, so
            views can be bookmarked and shared; this page renders the results. */}
        <RecordsFilters
          current={{ q: filters.q, status: filters.status, period: filters.period, per: filters.per }}
          statusOptions={CONTACT_STATUSES.map((s) => ({ value: s, label: statusLabels[s] }))}
          periodOptions={PERIODS.map((p) => ({ value: p, label: periodLabels[p] }))}
          pageSizes={RECORDS_PAGE_SIZES}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm text-text-muted sm:px-5" aria-live="polite">
          <p>
            {total ? (
              <>
                Showing <strong className="font-medium text-text">{formatNumber(from)}–{formatNumber(to)}</strong> of{" "}
                <strong className="font-medium text-text">{formatNumber(total)}</strong> {filtered ? "matching " : ""}
                {total === 1 ? "record" : "records"}
              </>
            ) : (
              "No records"
            )}
          </p>
          <p className="text-xs text-subtle">Times in {tz}</p>
        </div>

        {items.length === 0 ? (
          <div className="border-t border-line">
            {filtered ? (
              <EmptyState
                title="No matching records"
                action={
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/admin/records">Clear filters</Link>
                  </Button>
                }
              >
                Try a different search term, status or date range.
              </EmptyState>
            ) : (
              <EmptyState title="No submissions yet">
                Messages sent through the website&apos;s contact form will appear here.
              </EmptyState>
            )}
          </div>
        ) : (
          <>
            <RecordsTable items={items} tz={tz} />
            <RecordsCards items={items} tz={tz} />
          </>
        )}

        {pages > 1 ? <Pagination filters={filters} pages={pages} /> : null}
      </Card>
    </div>
  );
}

function Message({ text }: { text: string }) {
  if (text.length <= 140) return <p className="text-sm whitespace-pre-line text-text-muted">{text}</p>;
  return (
    <details className="group text-sm text-text-muted">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">{text.slice(0, 140).trimEnd()}… </span>
        <span className="text-brand underline-offset-2 hover:underline">
          <span className="group-open:hidden">Show more</span>
          <span className="hidden group-open:inline">Show less</span>
        </span>
      </summary>
      <p className="mt-1 whitespace-pre-line">{text}</p>
    </details>
  );
}

function Contactable({ c }: { c: Contact }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 text-sm">
      <a href={`mailto:${c.email}`} className="truncate text-text-muted hover:text-text hover:underline">
        {c.email}
      </a>
      {c.phone ? (
        <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} className="text-text-muted hover:text-text hover:underline">
          {c.phone}
        </a>
      ) : (
        <span className="text-subtle">No phone</span>
      )}
    </div>
  );
}

function RecordsTable({ items, tz }: { items: Contact[]; tz: string }) {
  return (
    <div className="hidden overflow-x-auto border-t border-line md:block">
      <table className="w-full text-left">
        <caption className="sr-only">Contact submissions</caption>
        <thead className="bg-surface-2/60 text-xs font-medium text-text-muted">
          <tr>
            <th scope="col" className="px-5 py-3 font-medium">#</th>
            <th scope="col" className="px-3 py-3 font-medium">Name</th>
            <th scope="col" className="px-3 py-3 font-medium">Contact</th>
            <th scope="col" className="px-3 py-3 font-medium">Message</th>
            <th scope="col" className="px-3 py-3 font-medium">Status</th>
            <th scope="col" className="px-5 py-3 font-medium whitespace-nowrap">Received</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {items.map((c) => (
            <tr key={c.id} className="align-top transition-colors hover:bg-tint/2">
              <td className="px-5 py-4 text-sm text-subtle tabular-nums">{c.id}</td>
              <td className="px-3 py-4">
                <p className="text-sm font-medium text-text">{c.name}</p>
                <p className="mt-0.5 text-xs text-subtle">via {c.source}</p>
              </td>
              <td className="max-w-56 px-3 py-4">
                <Contactable c={c} />
              </td>
              <td className="max-w-md min-w-64 px-3 py-4">
                <Message text={c.message} />
              </td>
              <td className="px-3 py-4">
                <StatusBadge status={c.status} />
              </td>
              <td className="px-5 py-4 text-sm whitespace-nowrap text-text-muted">
                <time dateTime={c.created_at}>{formatDateTime(c.created_at, tz)}</time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecordsCards({ items, tz }: { items: Contact[]; tz: string }) {
  return (
    <ul className="divide-y divide-line border-t border-line md:hidden">
      {items.map((c) => (
        <li key={c.id} className="flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-text">{c.name}</p>
              <p className="mt-0.5 text-xs text-subtle">
                #{c.id} · via {c.source} · <time dateTime={c.created_at}>{formatDateTime(c.created_at, tz)}</time>
              </p>
            </div>
            <StatusBadge status={c.status} />
          </div>
          <Contactable c={c} />
          <Message text={c.message} />
        </li>
      ))}
    </ul>
  );
}

function Pagination({ filters, pages }: { filters: Filters; pages: number }) {
  const current = filters.page;
  // First, last, and a window around the current page.
  const shown = [...new Set([1, current - 1, current, current + 1, pages])].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  const linkClass = "grid h-9 min-w-9 place-items-center rounded-full px-3 text-sm transition-colors";
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-2 border-t border-line px-4 py-3 sm:px-5">
      <PageLink href={current > 1 ? hrefFor(filters, { page: current - 1 }) : null} label="Previous">
        <ChevronLeft className="size-4" aria-hidden /> <span className="hidden sm:inline">Previous</span>
      </PageLink>
      <ol className="flex items-center gap-1">
        {shown.map((p, i) => (
          <li key={p} className="flex items-center gap-1">
            {i > 0 && p - shown[i - 1] > 1 ? <span aria-hidden className="px-1 text-subtle">…</span> : null}
            <Link
              href={hrefFor(filters, { page: p })}
              aria-current={p === current ? "page" : undefined}
              aria-label={`Page ${p}`}
              className={cn(linkClass, p === current ? "bg-ink text-white" : "text-text-muted hover:bg-tint/5 hover:text-text")}
            >
              {p}
            </Link>
          </li>
        ))}
      </ol>
      <PageLink href={current < pages ? hrefFor(filters, { page: current + 1 }) : null} label="Next">
        <span className="hidden sm:inline">Next</span> <ChevronRight className="size-4" aria-hidden />
      </PageLink>
    </nav>
  );
}

function PageLink({ href, label, children }: { href: string | null; label: string; children: React.ReactNode }) {
  const className = "inline-flex h-9 items-center gap-1 rounded-full border border-line px-3 text-sm";
  if (!href) {
    return (
      <span aria-disabled className={cn(className, "text-subtle opacity-50")} aria-label={label}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} aria-label={label} className={cn(className, "text-text-muted transition-colors hover:border-line-strong hover:text-text")}>
      {children}
    </Link>
  );
}
