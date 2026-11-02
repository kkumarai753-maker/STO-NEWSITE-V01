import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarDays, CalendarRange, Clock, Database, Inbox, MailOpen, Users } from "lucide-react";
import { RefreshButton } from "@/components/admin/refresh-button";
import { BreakdownList, DailyChart, StatCard } from "@/components/admin/stats";
import { AdminPageHeader, Card, CardHeader, EmptyState, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { formatDateTime, statusLabels } from "@/lib/admin";
import { adminRequest, type ContactList, type DashboardStats } from "@/lib/server/admin-api";
import { requireAdmin } from "@/lib/server/admin-session";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const { token, admin } = await requireAdmin();
  const [statsRes, recentRes] = await Promise.all([
    adminRequest<DashboardStats>("/stats", { token }),
    adminRequest<ContactList>("/contacts?limit=5", { token }),
  ]);
  if (!statsRes.ok || !recentRes.ok) {
    const failed = !statsRes.ok ? statsRes : !recentRes.ok ? recentRes : null;
    if (failed?.reason === "unauthorized") redirect("/admin/login?reason=expired");
    throw new Error("Could not load dashboard data.");
  }

  const stats = statsRes.data;
  const recent = recentRes.data.items;
  const t = stats.totals;
  const tz = stats.timezone;
  const firstName = admin.name.trim().split(/\s+/)[0];
  const newCount = stats.by_status.find((s) => s.status === "new")?.count ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Admin dashboard"
        title={firstName ? `Welcome back, ${firstName}` : "Dashboard"}
        actions={<RefreshButton />}
        description={
          <>
            Contact form submissions from the website. Counts use the <strong className="font-medium text-text">{tz}</strong>{" "}
            time zone · updated {formatDateTime(stats.generated_at, tz)}.
          </>
        }
      />

      {t.total === 0 ? (
        <Card>
          <EmptyState title="No submissions yet">
            When someone sends the contact form on the website, it will show up here with live counts.
          </EmptyState>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total records" value={t.total} icon={Database} href="/admin/records" hint="All time" />
        <StatCard
          label="Today"
          value={t.today}
          icon={Clock}
          href="/admin/records?period=today"
          delta={{ previous: t.yesterday, label: "yesterday" }}
        />
        <StatCard
          label="This month"
          value={t.this_month}
          icon={CalendarDays}
          href="/admin/records?period=month"
          delta={{ previous: t.last_month, label: "last month" }}
        />
        <StatCard label="Awaiting reply" value={newCount} icon={MailOpen} href="/admin/records?status=new" hint="Status: New" />
        <StatCard label="This week" value={t.this_week} icon={CalendarRange} href="/admin/records?period=week" hint="Since Monday" />
        <StatCard label="Last 7 days" value={t.last_7_days} icon={Inbox} href="/admin/records?period=7d" hint="Including today" />
        <StatCard label="Last 30 days" value={t.last_30_days} icon={Inbox} href="/admin/records?period=30d" hint="Including today" />
        <StatCard label="Unique senders" value={t.unique_senders} icon={Users} hint="Distinct email addresses" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Submissions per day" description="Last 14 days" />
          <DailyChart days={stats.daily} />
        </Card>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="By status" />
            <BreakdownList
              total={t.total}
              rows={stats.by_status.map((s) => ({
                key: s.status,
                label: statusLabels[s.status],
                count: s.count,
                href: `/admin/records?status=${s.status}`,
              }))}
            />
          </Card>
          <Card>
            <CardHeader title="By source" />
            {stats.by_source.length ? (
              <BreakdownList
                total={t.total}
                rows={stats.by_source.map((s) => ({ key: s.source, label: s.source, count: s.count }))}
              />
            ) : (
              <p className="px-6 pt-2 pb-6 text-sm text-text-muted">No data yet.</p>
            )}
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Latest submissions"
          description={
            stats.latest_submission_at ? `Most recent: ${formatDateTime(stats.latest_submission_at, tz)}` : undefined
          }
          action={
            recent.length ? (
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/records">
                  View all <ArrowRight aria-hidden />
                </Link>
              </Button>
            ) : null
          }
        />
        {recent.length ? (
          <ul className="mt-3 divide-y divide-line border-t border-line">
            {recent.map((c) => (
              <li key={c.id} className="flex flex-col gap-1.5 px-5 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text">
                    {c.name} <span className="font-normal text-text-muted">· {c.email}</span>
                  </p>
                  <p className="mt-0.5 truncate text-sm text-text-muted">{c.message}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={c.status} />
                  <time dateTime={c.created_at} className="text-xs whitespace-nowrap text-subtle">
                    {formatDateTime(c.created_at, tz)}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-6 pt-2 pb-6 text-sm text-text-muted">Nothing here yet.</p>
        )}
      </Card>
    </div>
  );
}
