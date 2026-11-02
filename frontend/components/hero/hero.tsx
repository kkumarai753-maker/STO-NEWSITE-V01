import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  CheckCheck,
  Globe,
  MessageSquare,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import { Button, ButtonArrow } from "@/components/ui/button";
import { whatsappHref } from "@/config/site";

/** A clear business offer alongside an explicitly illustrative workflow. */
export function Hero() {
  const whatsapp = whatsappHref();
  return (
    <section
      aria-labelledby="hero-title"
      className="sunrise-hero relative isolate overflow-hidden"
    >
      <div className="sunrise-orbit" aria-hidden />
      <div className="container-page relative z-1">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-white/80 px-3.5 py-2 text-xs font-medium text-text-muted sm:text-sm">
              <span className="size-2 rounded-full bg-[#e87822]" aria-hidden />
              Your technology & growth partner · Nagpur, India
            </p>
            <h1
              id="hero-title"
              className="mt-7 max-w-2xl font-display text-[clamp(2.7rem,5.1vw,4.65rem)] leading-[1.06] font-semibold tracking-[-0.055em] text-text"
            >
              A brighter future
              <br />
              for your <span className="text-primary">business.</span>
            </h1>
            <p className="mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-text-muted sm:text-lg">
              Websites that win trust. Marketing that connects. Automation that
              gives you time back. Bring it all together with Sunrise Tech
              Origin.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/inquiry">
                  Book a Free Consultation
                  <ButtonArrow />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#solutions">
                  Find Your Solution
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
            <ul
              className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-text-muted sm:text-sm"
              aria-label="Our approach"
            >
              {[
                "Clear project scope",
                "Client-owned accounts",
                "Support after launch",
              ].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Check className="size-3.5 text-primary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm text-text-muted underline decoration-line-strong underline-offset-4 hover:text-primary"
              >
                Prefer a quick chat? Start on WhatsApp
                <ArrowUpRight className="size-3.5" aria-hidden />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null}
          </div>
          <div className="relative lg:col-span-6">
            <div className="overflow-hidden rounded-[1.6rem] border border-white bg-white shadow-[0_28px_80px_-25px_rgb(21_65_130/0.28)]">
              <div className="flex items-center justify-between border-b border-line bg-[#f8faff] px-5 py-4">
                <div className="flex gap-1.5" aria-hidden>
                  <span className="size-2 rounded-full bg-[#f2a17e]" />
                  <span className="size-2 rounded-full bg-[#f5cd77]" />
                  <span className="size-2 rounded-full bg-[#a4caba]" />
                </div>
                <span className="text-[11px] font-medium text-text-muted">
                  Your business. Better connected.
                </span>
                <Globe className="size-3.5 text-text-subtle" aria-hidden />
              </div>
              <div className="p-5 sm:p-7">
                <div className="relative overflow-hidden rounded-2xl bg-[#0d2448] p-6 text-white sm:p-8">
                  <div
                    className="absolute -right-5 -bottom-14 size-48 rounded-full border-[20px] border-[#ffb457]/20 sm:size-56"
                    aria-hidden
                  />
                  <div
                    className="absolute -right-1 -bottom-16 size-40 rounded-full bg-linear-to-t from-[#e77727] to-[#ffc86b] sm:size-48"
                    aria-hidden
                  />
                  <p className="relative text-[10px] font-medium tracking-[0.18em] text-[#acc4eb] uppercase">
                    A new day. A new possibility.
                  </p>
                  <p className="relative mt-5 max-w-56 font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                    Your next
                    <br />
                    big thing.
                  </p>
                  <Link
                    href="/inquiry"
                    className="relative mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#0d2448]"
                  >
                    Let’s make it happen
                    <ArrowUpRight className="size-3" aria-hidden />
                  </Link>
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-text">
                    From interest to enquiry
                  </p>
                  <span className="rounded-full bg-primary-light px-2.5 py-1 text-[10px] font-medium text-primary">
                    Example workflow
                  </span>
                </div>
                <ol className="mt-4 grid gap-2.5">
                  {[
                    {
                      icon: MousePointer2,
                      title: "A customer finds your website",
                      detail: "A clear offer. An easy next step.",
                      color: "bg-primary-light text-primary",
                    },
                    {
                      icon: MessageSquare,
                      title: "Their enquiry reaches your team",
                      detail: "The right details, in the right place.",
                      color: "bg-[#fff3e6] text-[#a95615]",
                    },
                    {
                      icon: CheckCheck,
                      title: "A follow-up keeps things moving",
                      detail: "Less chasing. More time for your work.",
                      color: "bg-[#eaf5ee] text-[#28784b]",
                    },
                  ].map(({ icon: Icon, title, detail, color }, i) => (
                    <li
                      key={title}
                      className="flex items-center gap-3 rounded-xl border border-line p-3"
                    >
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-lg ${color}`}
                      >
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold text-text sm:text-sm">
                          {title}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-text-muted sm:text-xs">
                          {detail}
                        </span>
                      </span>
                      <span
                        className="ml-auto text-[10px] text-text-subtle"
                        aria-hidden
                      >
                        0{i + 1}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-text-subtle">
              <Sparkles className="size-3.5 text-[#b7661d]" aria-hidden />A
              glimpse of what we can build together.
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 pb-2 sm:flex-row sm:items-center sm:justify-between lg:mt-16">
          <p className="text-xs font-medium tracking-[0.12em] text-text-subtle uppercase">
            Built around your next step
          </p>
          <ul
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-text-muted sm:gap-x-8"
            aria-label="Who we work with"
          >
            <li>New businesses</li>
            <li>Local businesses</li>
            <li>Growing teams</li>
            <li>Ambitious brands</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
