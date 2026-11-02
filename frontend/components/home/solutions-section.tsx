import Link from "next/link";
import {
  ArrowRight,
  Check,
  Code2,
  Megaphone,
  Palette,
  Workflow,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const solutions = [
  {
    icon: Code2,
    label: "01 / Build your presence",
    title: "A website that means business.",
    description:
      "Give customers a clear reason to choose you, with a fast website that makes it easy to take the next step.",
    features: [
      "Business websites & landing pages",
      "E-commerce & custom applications",
      "Domain, hosting & business email",
    ],
    service: "Website & application development",
    href: "/web-technology",
    tone: "blue",
  },
  {
    icon: Megaphone,
    label: "02 / Reach the right people",
    title: "Turn attention into opportunity.",
    description:
      "Connect your offer with the people looking for it, through focused content, local search and paid campaigns.",
    features: [
      "Social media & short-form video",
      "Local SEO & Google Business Profile",
      "Meta & Google Ads campaigns",
    ],
    service: "Digital marketing & lead generation",
    href: "/digital-growth",
    tone: "orange",
  },
  {
    icon: Workflow,
    label: "03 / Make work flow",
    title: "Less repetitive work. More possibility.",
    description:
      "Connect your enquiries, customer conversations and everyday tools so your team can focus on what matters.",
    features: [
      "CRM & lead follow-up workflows",
      "WhatsApp & email automation",
      "AI assistants & software integrations",
    ],
    service: "CRM & business automation",
    href: "/web-technology",
    tone: "blue",
  },
  {
    icon: Palette,
    label: "04 / Look the part",
    title: "A brand people recognise.",
    description:
      "Bring consistency to the way your business looks and speaks, from your first logo to your next campaign.",
    features: [
      "Logo & visual identity",
      "Brand colours & typography",
      "Social & campaign creative",
    ],
    service: "Brand identity & design",
    href: "/digital-growth",
    tone: "orange",
  },
];

export function SolutionsSection() {
  return (
    <section
      id="solutions"
      aria-labelledby="solutions-title"
      className="section-y section-white"
    >
      <div className="container-page">
        <SectionHeading
          id="solutions-title"
          eyebrow="What can we help you with?"
          layout="split"
          title={
            <>
              Your next chapter.
              <br />
              <em>The right solution.</em>
            </>
          }
          description="Start with what your business needs today. We’ll help you connect the rest as you grow."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-14 lg:gap-6">
          {solutions.map(({ icon: Icon, ...solution }) => (
            <article
              key={solution.title}
              className="solution-card flex flex-col rounded-3xl border border-line bg-[#f8faff] p-6 sm:p-8 lg:p-9"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] font-semibold tracking-[0.1em] text-text-subtle uppercase">
                  {solution.label}
                </p>
                <span
                  className={`grid size-11 place-items-center rounded-xl ${solution.tone === "orange" ? "bg-[#fff0df] text-[#a95615]" : "bg-primary-light text-primary"}`}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
              </div>
              <h3 className="mt-6 max-w-sm font-display text-[1.65rem] leading-tight font-semibold tracking-tight text-text sm:text-3xl">
                {solution.title}
              </h3>
              <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-text-muted">
                {solution.description}
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-text-muted">
                {solution.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-line pt-5">
                <Link
                  href={`/inquiry?service=${encodeURIComponent(solution.service)}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-primary"
                >
                  Let’s talk about it
                  <ArrowRight className="size-4" aria-hidden />
                  <span className="sr-only">: {solution.service}</span>
                </Link>
                <Link
                  href={solution.href}
                  className="inline-flex min-h-11 items-center rounded-sm text-sm text-text-muted underline decoration-line-strong underline-offset-4"
                >
                  Explore services
                  <span className="sr-only">: {solution.service}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
