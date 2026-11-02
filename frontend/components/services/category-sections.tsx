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
                <Link
                  href={`/services/${category.id}`}
                  aria-label={`Explore ${category.name}`}
                  className="relative mt-7 block aspect-[4/5] overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  style={{ backgroundColor: category.imageBackground }}
                >
                  <Image
                    src={category.image}
                    alt={category.imageAlt}
                    fill
                    sizes="(min-width:1280px) 560px,(min-width:768px) 45vw,90vw"
                    className="object-contain"
                  />
                </Link>
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
                    href={`/services/${category.id}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-primary"
                  >
                    Explore options
                    <ArrowRight className="size-4" aria-hidden />
                    <span className="sr-only"> for {category.name}</span>
                  </Link>
                  <Link
                    href={`/build-your-proposal?category=${category.id}`}
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
