import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Bot,
  Check,
  Layers3,
  Megaphone,
  Monitor,
  ArrowRight,
} from "lucide-react";
import { serviceCategories } from "@/data/service-categories";
const icons = {
  megaphone: Megaphone,
  monitor: Monitor,
  bot: Bot,
  layers: Layers3,
};

export function CategorySections() {
  return (
    <section
      id="services"
      aria-labelledby="main-services-title"
      className="section-y bg-white"
    >
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="preview-kicker">Four ways to move forward</p>
            <h2
              id="main-services-title"
              className="mt-4 text-heading-1 text-text"
            >
              Your goals.
              <br />
              <em>Our expertise.</em>
            </h2>
          </div>
          <p className="max-w-md text-lead text-text-muted">
            Choose where you need support. We’ll shape the right scope,
            deliverables and quotation together.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {serviceCategories.map((category) => {
            const Icon = icons[category.icon];
            return (
              <article
                key={category.id}
                id={category.id}
                className="service-showcase group relative overflow-hidden rounded-3xl border border-line bg-[#f7faff] p-6 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-text-subtle">
                    {category.number} / EXPERTISE
                  </span>
                  <span
                    className={`grid size-12 place-items-center rounded-2xl ${category.color === "orange" ? "bg-[#fff0dd] text-[#a75011]" : "bg-primary-light text-primary"}`}
                  >
                    <Icon className="size-6" aria-hidden />
                  </span>
                </div>
                <h3 className="mt-7 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm font-medium text-primary">
                  {category.short}
                </p>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-text-muted">
                  {category.description}
                </p>
                {category.id === "social-media" ? (
                  <div className="relative mt-7 h-44 overflow-hidden rounded-2xl sm:h-48">
                    <Image
                      src="/visuals/business-growth.jpg"
                      alt="Illustrative team celebrating business growth"
                      fill
                      sizes="(min-width:768px) 50vw,100vw"
                      className="object-cover"
                    />
                    <span className="absolute right-3 bottom-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium text-[#153052]">
                      Illustrative visual
                    </span>
                  </div>
                ) : (
                  <div
                    aria-hidden
                    className={`relative mt-7 flex min-h-36 items-center justify-center overflow-hidden rounded-2xl p-5 ${category.color === "orange" ? "bg-linear-to-br from-[#fff1dd] to-[#f7d5aa]" : "bg-linear-to-br from-[#deebff] to-[#a8c8fb]"}`}
                  >
                    <div className="absolute -right-5 -bottom-14 size-40 rounded-full border-[18px] border-white/35" />
                    <div className="relative w-full max-w-xs rounded-xl border border-white/80 bg-white/85 p-4 shadow-lg">
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-primary/35" />
                        <span className="size-1.5 rounded-full bg-primary/20" />
                        <span className="size-1.5 rounded-full bg-[#ee9a49]" />
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <Icon className="size-8 text-primary" />
                        <p className="text-sm font-medium leading-snug text-[#153052]">
                          {category.example}
                        </p>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((x) => (
                          <div
                            key={x}
                            className="h-1.5 rounded-full bg-primary/15"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <ul className="mt-6 grid gap-2.5 text-sm text-text-muted sm:grid-cols-2">
                  {category.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
                  <Link
                    href={`/services#${category.id}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-primary"
                  >
                    Explore options
                    <ArrowRight className="size-4" aria-hidden />
                    <span className="sr-only"> for {category.name}</span>
                  </Link>
                  <Link
                    href={`/inquiry?service=${encodeURIComponent(category.name)}`}
                    className="inline-flex min-h-11 items-center gap-1 text-sm text-text-muted"
                  >
                    Request a quote
                    <ArrowUpRight className="size-4" aria-hidden />
                    <span className="sr-only"> for {category.name}</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
