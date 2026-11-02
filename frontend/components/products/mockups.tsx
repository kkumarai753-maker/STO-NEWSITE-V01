import {
  Bot,
  Boxes,
  ChartLine,
  CircleCheck,
  CreditCard,
  Database,
  FileText,
  Funnel,
  GitBranch,
  Globe,
  House,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  Webhook,
  Workflow,
  WifiOff,
} from "lucide-react";
import { BrandIcon } from "@/components/ui/brand-icon";
import type { ProductMockupId } from "@/data/products";
import { cn } from "@/lib/utils";
import { AppShell, AreaChart, Avatar, Bars, Card, Kpi, Pill } from "./mockup-kit";

/** All names, figures and companies below are fictional sample UI data. */

const APP_NAV = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: Bot, label: "Assistant" },
  { icon: Workflow, label: "Automations" },
  { icon: Users, label: "Sales" },
  { icon: ChartLine, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

function AiDashboard() {
  const conversations = [
    { name: "Maya Chen", channel: "whatsapp", text: "Can I change my delivery date?", status: "AI replying", tone: "brand" },
    { name: "Omar Haddad", channel: "email", text: "Invoice for March is missing VAT", status: "Sent to team", tone: "warning" },
    { name: "Lena Fischer", channel: "web", text: "How do I add a team member?", status: "Resolved", tone: "success" },
    { name: "Arjun Patel", channel: "whatsapp", text: "Order #9921 status?", status: "Resolved", tone: "success" },
  ] as const;
  return (
    <AppShell brand="Nova Ops" nav={APP_NAV} active="Assistant" title="AI Assistant" subtitle="Last 7 days · all channels">
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="grid grid-cols-2 gap-3 lg:col-span-3 lg:grid-cols-4">
          <Kpi label="Conversations" value="2,481" delta="+14% this week" spark={[12, 18, 15, 22, 20, 28, 31]} />
          <Kpi label="Solved by AI" value="71%" delta="+6% this week" spark={[50, 55, 58, 60, 64, 69, 71]} />
          <Kpi label="Average reply time" value="1.2s" delta="faster than last week" spark={[9, 7, 6, 5, 4, 3, 2]} />
          <Kpi label="Sent to a person" value="38" delta="−12% this week" spark={[40, 44, 39, 35, 37, 33, 30]} />
        </div>
        <Card title="Conversation volume" action={<Pill tone="brand"><Sparkles className="size-2.5" /> AI and team</Pill>} className="lg:col-span-2">
          <AreaChart
            id="ai-volume"
            className="h-40"
            points={[30, 42, 38, 55, 49, 66, 61, 74, 70, 86, 82, 96]}
            secondary={[22, 26, 24, 30, 28, 31, 30, 33, 31, 34, 33, 35]}
            labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          />
        </Card>
        <Card title="Live conversations" action={<span className="font-mono text-[0.625rem] text-brand">● 12 active</span>}>
          <ul className="space-y-2.5">
            {conversations.map((c) => (
              <li key={c.name} className="flex items-center gap-2.5">
                <Avatar name={c.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[0.6875rem] font-medium text-text">
                    {c.name}
                    {c.channel === "whatsapp" ? (
                      <BrandIcon slug="whatsapp" className="size-2.5 text-whatsapp" />
                    ) : c.channel === "email" ? (
                      <Mail className="size-2.5 text-subtle" />
                    ) : (
                      <Globe className="size-2.5 text-subtle" />
                    )}
                  </p>
                  <p className="truncate text-[0.625rem] text-subtle">{c.text}</p>
                </div>
                <Pill tone={c.tone}>{c.status}</Pill>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}

function WorkflowBuilder() {
  const node = (label: string, sub: string, Icon: typeof Bot, tone: string, extra?: string) => (
    <div className={cn("w-40 rounded-xl border bg-surface p-2.5 shadow-[0_10px_30px_-12px_rgb(15_23_42/0.14)]", tone, extra)}>
      <div className="flex items-center gap-2">
        <span className="grid size-6 place-items-center rounded-md bg-tint/6">
          <Icon className="size-3 text-text" />
        </span>
        <p className="text-[0.6875rem] font-medium text-text">{label}</p>
      </div>
      <p className="mt-1.5 font-mono text-[0.5625rem] text-subtle">{sub}</p>
    </div>
  );
  return (
    <AppShell
      brand="Nova Ops"
      nav={APP_NAV}
      active="Automations"
      title="New enquiry follow-up"
      subtitle="Runs automatically every time someone fills in your website form"
      actions={<Pill tone="success"><CircleCheck className="size-2.5" /> Live</Pill>}
    >
      <div className="grid h-full gap-3 lg:grid-cols-[1fr_15rem]">
        <div className="relative min-h-[22rem] overflow-hidden rounded-xl border border-line bg-bg-elevated">
          <div className="absolute inset-0 bg-dots opacity-70 [--dot-size:16px]" />
          <svg className="absolute inset-0 size-full" viewBox="0 0 600 360" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="wf-line" x1="0" x2="1">
                <stop stopColor="var(--ink)" />
                <stop offset="1" stopColor="var(--ink)" />
              </linearGradient>
            </defs>
            <path d="M160 70 C 220 70, 200 160, 250 160" stroke="url(#wf-line)" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
            <path d="M410 160 C 460 160, 440 90, 470 90" stroke="url(#wf-line)" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
            <path d="M410 160 C 460 160, 440 250, 470 250" stroke="var(--tint)" strokeOpacity="0.25" strokeDasharray="4 4" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
            <path d="M160 290 C 220 290, 200 160, 250 160" stroke="var(--tint)" strokeOpacity="0.18" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="absolute top-[12%] left-[3%]">{node("Website form filled in", "A new enquiry arrives", Webhook, "border-line")}</div>
          <div className="absolute top-[72%] left-[3%] hidden sm:block">{node("Find company details", "Looked up automatically", Database, "border-line")}</div>
          <div className="absolute top-[37%] left-[36%] sm:left-[40%]">{node("AI checks the fit", "Is this a good customer?", Sparkles, "border-brand/40 shadow-[0_12px_30px_-12px_rgb(15_23_42/0.5)]")}</div>
          <div className="absolute top-[16%] right-[3%] hidden sm:block">{node("Send to sales team", "The right person follows up", Users, "border-line")}</div>
          <div className="absolute top-[62%] right-[3%] hidden sm:block">{node("Send follow-up emails", "Friendly reminders", Mail, "border-line")}</div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg border border-line bg-surface/90 px-2.5 py-1.5 font-mono text-[0.625rem] text-text-muted backdrop-blur">
            <GitBranch className="size-3 text-brand" /> 5 nodes · 2 branches
          </div>
        </div>
        <Card title="AI checks the fit" action={<Pill tone="brand">AI</Pill>} className="hidden lg:block">
          <dl className="space-y-3 text-[0.6875rem]">
            {[
              ["What it does", "Reads each enquiry"],
              ["Looks at", "Company and message"],
              ["Decides", "Who should reply"],
              ["Result", "Good fit → sales team"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-subtle">{k}</dt>
                <dd className="mt-0.5 rounded-md border border-line bg-surface px-2 py-1 font-mono text-[0.625rem] text-text">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 rounded-lg border border-success/20 bg-success/6 p-2.5">
            <p className="font-mono text-[0.625rem] text-success">Last run · 0.9s · score 86</p>
            <p className="mt-1 text-[0.625rem] text-text-muted">Mid-market SaaS, clear budget and timeline. Route to sales.</p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function CrmPipeline() {
  const columns = [
    {
      title: "Qualified",
      total: "$84k",
      deals: [
        { company: "Northwind", value: "$24,000", owner: "Ana Silva", score: 92 },
        { company: "Globex", value: "$18,500", owner: "Ben Ortiz", score: 78 },
      ],
    },
    {
      title: "Proposal",
      total: "$126k",
      deals: [
        { company: "Initech", value: "$56,000", owner: "Chloe Kim", score: 88 },
        { company: "Umbrella Co", value: "$31,000", owner: "Ana Silva", score: 64 },
      ],
    },
    {
      title: "Negotiation",
      total: "$72k",
      deals: [{ company: "Stark Labs", value: "$72,000", owner: "Dev Mehta", score: 95 }],
    },
    {
      title: "Won",
      total: "$210k",
      deals: [{ company: "Wayne Logistics", value: "$48,000", owner: "Ben Ortiz", score: 99 }],
    },
  ];
  return (
    <AppShell
      brand="Nova CRM"
      nav={APP_NAV}
      active="Sales"
      title="Sales pipeline"
      subtitle="18 open deals this quarter"
      actions={<span className="hidden items-center gap-1 rounded-lg border border-line bg-surface px-2 py-1 text-[0.6875rem] text-text-muted sm:flex"><Funnel className="size-3" /> Filters</span>}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {columns.map((col, ci) => (
          <div key={col.title} className={cn("rounded-xl border border-line bg-bg-elevated p-2.5", ci > 1 && "hidden lg:block")}>
            <div className="mb-2.5 flex items-center justify-between px-0.5">
              <p className="text-[0.6875rem] font-medium text-text">{col.title}</p>
              <span className="font-mono text-[0.625rem] text-subtle">{col.total}</span>
            </div>
            <ul className="space-y-2">
              {col.deals.map((deal) => (
                <li key={deal.company} className={cn("rounded-lg border bg-surface p-2.5", deal.score >= 90 ? "border-brand/40" : "border-line")}>
                  <div className="flex items-center justify-between">
                    <p className="text-[0.75rem] font-medium text-text">{deal.company}</p>
                    <Pill tone={deal.score >= 85 ? "brand" : "neutral"}>
                      <Sparkles className="size-2.5" /> {deal.score}
                    </Pill>
                  </div>
                  <p className="mt-1 font-mono text-[0.6875rem] text-text-muted">{deal.value}</p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[0.625rem] text-subtle">
                      <Avatar name={deal.owner} size="sm" /> {deal.owner}
                    </span>
                  </div>
                  {deal.score >= 90 ? (
                    <p className="mt-2 rounded-md bg-brand/10 px-2 py-1 text-[0.5625rem] text-brand">
                      Suggested next step: send the updated offer
                    </p>
                  ) : null}
                </li>
              ))}
              <li className="flex items-center justify-center gap-1 rounded-lg border border-dashed border-line py-2 text-[0.625rem] text-subtle">
                <Plus className="size-3" /> Add deal
              </li>
            </ul>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function Analytics() {
  const channels = [
    ["Google search", "$48.2k", 82],
    ["Social media ads", "$31.9k", 58],
    ["Email", "$22.4k", 44],
    ["Recommendations", "$12.7k", 26],
  ] as const;
  return (
    <AppShell brand="Nova Insights" nav={APP_NAV} active="Reports" title="Sales overview" subtitle="January – June, compared with last year">
      <div className="grid gap-3 lg:grid-cols-3">
        <Card title="Revenue" action={<span className="font-mono text-xs text-text">$115,240 <span className="text-success">↑ 18.4%</span></span>} className="lg:col-span-2">
          <AreaChart
            id="analytics-rev"
            className="h-44"
            points={[40, 46, 44, 52, 58, 55, 63, 70, 68, 77, 84, 92]}
            secondary={[36, 38, 40, 41, 45, 44, 48, 50, 52, 55, 57, 60]}
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
          />
        </Card>
        <Card title="Returning customers">
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 36 36" className="size-24 -rotate-90" aria-hidden>
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--tint)" strokeOpacity="0.08" strokeWidth="3.5" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="url(#ret)" strokeWidth="3.5" strokeDasharray="76 100" pathLength={100} strokeLinecap="round" />
              <defs>
                <linearGradient id="ret">
                  <stop stopColor="var(--ink)" />
                  <stop offset="1" stopColor="var(--ink)" />
                </linearGradient>
              </defs>
            </svg>
            <div>
              <p className="text-2xl font-semibold text-text">76%</p>
              <p className="text-[0.6875rem] text-subtle">come back within 3 months</p>
              <p className="mt-1 font-mono text-[0.625rem] text-success">+4.2 pts</p>
            </div>
          </div>
          <Bars values={[42, 55, 48, 62, 70, 66, 78]} highlight={6} className="mt-4 h-14" />
        </Card>
        <Card title="Where sales come from" className="lg:col-span-3">
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {channels.map(([name, value, pct]) => (
              <li key={name} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-[0.6875rem] text-text-muted">{name}</span>
                <span className="h-1.5 flex-1 rounded-full bg-tint/6">
                  <span className="block h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                </span>
                <span className="w-14 text-right font-mono text-[0.6875rem] text-text">{value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}

function CustomerPortal() {
  const steps = ["Ordered", "Packed", "Shipped", "Delivered"];
  return (
    <div className="min-h-[30rem] bg-bg p-4 text-left sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-6 rounded-md bg-brand" />
          <span className="text-sm font-semibold text-text">Brightline</span>
          <span className="ml-2 hidden gap-4 text-xs text-subtle sm:flex">
            <span className="text-text">Home</span>
            <span>Orders</span>
            <span>Invoices</span>
            <span>Support</span>
          </span>
        </div>
        <Avatar name="Jordan Lee" size="sm" />
      </div>
      <h4 className="mt-6 text-xl font-semibold tracking-tight text-text">Welcome back, Jordan</h4>
      <p className="text-xs text-subtle">Here&apos;s what&apos;s happening with your account.</p>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <Card title="Order #8817" action={<Pill tone="info"><Truck className="size-2.5" /> In transit</Pill>} className="lg:col-span-2">
          <ol className="flex items-center">
            {steps.map((s, i) => (
              <li key={s} className="flex flex-1 items-center last:flex-none">
                <span className="flex flex-col items-center gap-1.5">
                  <span className={cn("grid size-6 place-items-center rounded-full border text-[0.625rem]", i < 3 ? "border-brand/40 bg-brand/15 text-brand" : "border-line text-subtle")}>
                    {i < 3 ? "✓" : i + 1}
                  </span>
                  <span className="text-[0.625rem] text-text-muted">{s}</span>
                </span>
                {i < steps.length - 1 ? <span className={cn("mx-1 mb-5 h-px flex-1", i < 2 ? "bg-brand/40" : "bg-line")} /> : null}
              </li>
            ))}
          </ol>
          <p className="mt-3 flex items-center gap-1.5 text-[0.6875rem] text-text-muted">
            <MapPin className="size-3 text-brand" /> Arriving Thursday, between 10:00 and 14:00
          </p>
        </Card>
        <Card title="Need help?">
          <p className="text-[0.6875rem] text-text-muted">Our assistant replies instantly, 24/7.</p>
          <div className="mt-3 rounded-lg border border-line bg-surface p-2 text-[0.6875rem] text-text-muted">
            <span className="text-brand">AI:</span> Your replacement ships today 📦
          </div>
          <span className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-text py-1.5 text-[0.6875rem] font-medium text-bg">
            <MessageSquare className="size-3" /> Start a chat
          </span>
        </Card>
        <Card title="Recent invoices" className="lg:col-span-3">
          <table className="w-full text-left text-[0.6875rem]">
            <thead className="text-subtle">
              <tr>
                <th className="pb-2 font-normal">Invoice</th>
                <th className="pb-2 font-normal">Date</th>
                <th className="hidden pb-2 font-normal sm:table-cell">Amount</th>
                <th className="pb-2 text-right font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              {[
                ["INV-1042", "Jun 02", "$1,240.00", "Paid", "success"],
                ["INV-1037", "May 03", "$980.00", "Paid", "success"],
                ["INV-1031", "Apr 04", "$1,105.00", "Due", "warning"],
              ].map(([id, date, amount, status, tone]) => (
                <tr key={id} className="border-t border-line">
                  <td className="py-2 font-mono text-text">
                    <FileText className="mr-1.5 inline size-3 text-subtle" />
                    {id}
                  </td>
                  <td className="py-2">{date}</td>
                  <td className="hidden py-2 sm:table-cell">{amount}</td>
                  <td className="py-2 text-right">
                    <Pill tone={tone as "success" | "warning"}>{status}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function Phone({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative w-[15.5rem] shrink-0 rounded-[2.2rem] border border-line-strong bg-neutral-950 p-2 shadow-[0_30px_60px_-28px_rgb(15_23_42/0.4)]", className)}>
      <div className="relative h-[28rem] overflow-hidden rounded-[1.75rem] bg-bg">
        <div className="absolute top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
        <div className="flex items-center justify-between px-5 pt-2.5 font-mono text-[0.5625rem] text-text">
          <span>9:41</span>
          <span>5G</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function MobileApp() {
  const jobs = [
    ["09:00", "HVAC inspection", "12 Elm St", "done"],
    ["11:30", "Install thermostat", "48 Oak Ave", "active"],
    ["14:00", "Repair · boiler", "7 Pine Rd", "next"],
    ["16:30", "Maintenance visit", "90 Birch Ln", "next"],
  ] as const;
  return (
    <div className="flex min-h-[30rem] items-center justify-center gap-6 overflow-hidden p-6">
      <Phone>
        <div className="px-4 pt-6">
          <p className="text-[0.625rem] text-subtle">Tuesday, 14 May</p>
          <p className="text-lg font-semibold text-text">Today&apos;s jobs</p>
          <div className="mt-3 rounded-2xl bg-brand p-3">
            <p className="text-[0.625rem] text-white/80">Progress</p>
            <p className="text-xl font-semibold text-white">1 / 4 complete</p>
            <div className="mt-2 h-1 rounded-full bg-white/30">
              <div className="h-full w-1/4 rounded-full bg-white" />
            </div>
          </div>
          <ul className="mt-3 space-y-2">
            {jobs.map(([time, title, addr, state]) => (
              <li key={time} className={cn("flex items-center gap-3 rounded-xl border p-2.5", state === "active" ? "border-brand/40 bg-brand/10" : "border-line bg-surface")}>
                <span className="font-mono text-[0.625rem] text-subtle">{time}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.6875rem] font-medium text-text">{title}</p>
                  <p className="truncate text-[0.5625rem] text-subtle">{addr}</p>
                </div>
                {state === "done" ? <CircleCheck className="size-3.5 text-success" /> : null}
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute inset-x-3 bottom-3 flex justify-around rounded-2xl border border-line bg-surface/90 py-2.5 backdrop-blur">
          {[House, Package, MessageSquare, Settings].map((Icon, i) => (
            <Icon key={i} className={cn("size-4", i === 0 ? "text-text" : "text-subtle")} />
          ))}
        </div>
      </Phone>
      <Phone className="hidden sm:block">
        <div className="relative h-40 bg-[linear-gradient(135deg,var(--surface-2),var(--bg-elevated))]">
          <svg className="absolute inset-0 size-full opacity-60" viewBox="0 0 240 160" aria-hidden>
            <path d="M0 120 C 60 100, 80 40, 140 60 S 220 20, 240 30" stroke="var(--ink)" strokeWidth="2" fill="none" strokeDasharray="5 5" />
            <path d="M20 0 V160 M80 0 V160 M140 0 V160 M200 0 V160 M0 40 H240 M0 100 H240" stroke="var(--tint)" strokeOpacity="0.05" />
            <circle cx="140" cy="60" r="6" fill="var(--ink)" />
            <circle cx="140" cy="60" r="14" fill="var(--ink)" fillOpacity="0.2" />
          </svg>
        </div>
        <div className="px-4 pt-4">
          <Pill tone="brand">In progress</Pill>
          <p className="mt-2 text-base font-semibold text-text">Install thermostat</p>
          <p className="text-[0.6875rem] text-subtle">48 Oak Ave · Customer: R. Gomez</p>
          <ul className="mt-3 space-y-2 text-[0.6875rem]">
            {["Turn off power at breaker", "Remove old unit", "Mount & wire new thermostat", "Test & capture photo"].map((t, i) => (
              <li key={t} className="flex items-center gap-2 text-text-muted">
                <span className={cn("grid size-3.5 place-items-center rounded-[4px] border", i < 2 ? "border-brand bg-brand text-white" : "border-line-strong")}>
                  {i < 2 ? <span className="text-[0.5rem]">✓</span> : null}
                </span>
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-1.5 rounded-lg border border-warning/25 bg-warning/10 px-2 py-1.5 text-[0.625rem] text-warning">
            <WifiOff className="size-3" /> Offline: changes will sync automatically
          </p>
        </div>
      </Phone>
    </div>
  );
}

function AdminDashboard() {
  const users = [
    ["Ana Silva", "ana@northwind.io", "Owner", "Active", "2m ago"],
    ["Ben Ortiz", "ben@northwind.io", "Admin", "Active", "1h ago"],
    ["Chloe Kim", "chloe@northwind.io", "Editor", "Invited", "Never"],
    ["Dev Mehta", "dev@northwind.io", "Viewer", "Active", "3d ago"],
    ["Eli Novak", "eli@northwind.io", "Editor", "Suspended", "21d ago"],
  ];
  const tone = (s: string) => (s === "Active" ? "success" : s === "Invited" ? "info" : "danger") as "success" | "info" | "danger";
  return (
    <AppShell
      brand="Nova Admin"
      nav={[
        { icon: LayoutDashboard, label: "Overview" },
        { icon: Users, label: "Users" },
        { icon: ShieldCheck, label: "Roles" },
        { icon: KeyRound, label: "Passwords" },
        { icon: CreditCard, label: "Billing" },
        { icon: Boxes, label: "Integrations" },
      ]}
      active="Users"
      title="Team members"
      subtitle="24 team members"
      actions={<span className="hidden items-center gap-1 rounded-lg bg-text px-2.5 py-1 text-[0.6875rem] font-medium text-bg sm:flex"><Plus className="size-3" /> Invite</span>}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_14rem]">
        <Card className="overflow-hidden p-0">
          <table className="w-full text-left text-[0.6875rem]">
            <thead className="border-b border-line text-subtle">
              <tr>
                <th className="px-3.5 py-2.5 font-normal">User</th>
                <th className="hidden px-3.5 py-2.5 font-normal sm:table-cell">Role</th>
                <th className="px-3.5 py-2.5 font-normal">Status</th>
                <th className="hidden px-3.5 py-2.5 text-right font-normal md:table-cell">Last active</th>
              </tr>
            </thead>
            <tbody>
              {users.map(([name, email, role, status, last]) => (
                <tr key={email} className="border-b border-line/70 last:border-0">
                  <td className="px-3.5 py-2.5">
                    <span className="flex items-center gap-2.5">
                      <Avatar name={name} size="sm" />
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-text">{name}</span>
                        <span className="block truncate text-[0.625rem] text-subtle">{email}</span>
                      </span>
                    </span>
                  </td>
                  <td className="hidden px-3.5 py-2.5 text-text-muted sm:table-cell">{role}</td>
                  <td className="px-3.5 py-2.5">
                    <Pill tone={tone(status)}>{status}</Pill>
                  </td>
                  <td className="hidden px-3.5 py-2.5 text-right font-mono text-[0.625rem] text-subtle md:table-cell">{last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Recent activity" className="hidden lg:block">
          <ol className="space-y-3">
            {[
              ["Ben Ortiz", "added a new member", "4m"],
              ["Ana Silva", "updated permissions", "1h"],
              ["Ana Silva", "changed role → Admin", "3h"],
              ["System", "backup completed", "5h"],
            ].map(([who, what, when]) => (
              <li key={what} className="flex gap-2.5 text-[0.6875rem]">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-brand" />
                <span className="text-text-muted">
                  <span className="text-text">{who}</span> {what}
                  <span className="block font-mono text-[0.5625rem] text-subtle">{when} ago</span>
                </span>
              </li>
            ))}
          </ol>
          <span className="mt-4 flex items-center gap-1.5 text-[0.625rem] text-subtle">
            <LifeBuoy className="size-3" /> Retained for 365 days
          </span>
        </Card>
      </div>
    </AppShell>
  );
}

export const productMockups: Record<ProductMockupId, () => React.JSX.Element> = {
  "ai-dashboard": AiDashboard,
  workflow: WorkflowBuilder,
  crm: CrmPipeline,
  analytics: Analytics,
  portal: CustomerPortal,
  mobile: MobileApp,
  admin: AdminDashboard,
};
