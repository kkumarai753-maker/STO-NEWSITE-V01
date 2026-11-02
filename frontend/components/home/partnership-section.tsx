import Link from "next/link";
import {
  ArrowUpRight,
  FileCheck2,
  Handshake,
  KeyRound,
  LifeBuoy,
} from "lucide-react";
import { Button, ButtonArrow } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Tell us where you’re headed.",
    description:
      "Share your business, your idea and what you want to improve. You don’t need a technical brief.",
  },
  {
    number: "02",
    title: "Get a clear plan.",
    description:
      "We agree on the scope, quotation and milestones before production begins.",
  },
  {
    number: "03",
    title: "Build it together.",
    description:
      "Review the designs and working previews at agreed checkpoints. Your feedback shapes the result.",
  },
  {
    number: "04",
    title: "Launch with confidence.",
    description:
      "We test, launch and hand over your assets, with support options for what comes next.",
  },
];

export function PartnershipSection() {
  return (
    <section
      aria-labelledby="partnership-title"
      className="section-y relative overflow-hidden bg-[#0d2448] text-white"
    >
      <div className="container-page relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold tracking-[0.15em] text-[#ffc17a] uppercase">
              A partner, from idea to launch
            </p>
            <h2
              id="partnership-title"
              className="mt-5 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.12] font-semibold tracking-[-0.04em]"
            >
              Good work starts with
              <br />a{" "}
              <span className="text-[#ffc17a]">clear conversation.</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-[#bdcde3] lg:col-span-5 lg:justify-self-end">
            One team for your technology and digital growth. A practical plan,
            direct communication and a process you can follow.
          </p>
        </div>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-7">
          {steps.map((step) => (
            <li key={step.number} className="border-t border-white/20 pt-6">
              <span className="font-mono text-sm text-[#ffc17a]">
                {step.number}
              </span>
              <h3 className="mt-5 max-w-56 text-xl leading-snug font-semibold">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#bdcde3]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
        <ul
          aria-label="What you can expect"
          className="mt-12 grid gap-4 rounded-2xl border border-white/15 bg-white/5 p-6 text-sm text-[#dbe7f7] sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            { icon: FileCheck2, label: "Scope before production" },
            { icon: Handshake, label: "Agreed review checkpoints" },
            { icon: KeyRound, label: "Client-owned accounts & assets" },
            { icon: LifeBuoy, label: "Ongoing support options" },
          ].map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5">
              <Icon className="size-4 shrink-0 text-[#ffc17a]" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild size="lg" className="border border-white/20">
            <Link href="/inquiry">
              Let’s Plan Your Project
              <ButtonArrow />
            </Link>
          </Button>
          <Link
            href="/how-we-work"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm text-white underline decoration-white/30 underline-offset-4"
          >
            See how we work
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
