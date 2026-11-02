"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, BookOpen, GraduationCap, Monitor } from "lucide-react";
import { liveDemos } from "@/data/templates";

export function TemplateGallery({
  standalone = false,
}: {
  standalone?: boolean;
}) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", ...new Set(liveDemos.map((d) => d.category))];
  const visible =
    filter === "All"
      ? liveDemos
      : liveDemos.filter((d) => d.category === filter);
  return (
    <section
      id="templates"
      aria-labelledby="templates-title"
      className="section-y bg-[#f4f8ff]"
    >
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="preview-kicker">See it. Explore it. Make it yours.</p>
            <h2 id="templates-title" className="mt-4 text-heading-1 text-text">
              Trending website
              <br />
              <em>templates on Sunrise.</em>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-lead text-text-muted">
              Find inspiration in a website demo for your industry, then tell us
              what you’d like for your own business.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-text-subtle">
              Illustrative visuals. Open each demo to explore the actual website
              in a new tab.
            </p>
          </div>
        </div>
        <div
          className="mt-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter website templates"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`min-h-11 rounded-full border px-5 text-sm font-medium transition-colors ${filter === f ? "border-primary bg-primary text-white" : "border-line-strong bg-white text-text-muted hover:border-primary"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <p role="status" className="sr-only">
          {visible.length} {visible.length === 1 ? "demo" : "demos"} shown
        </p>
        <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((d) => (
            <article
              key={d.id}
              className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
            >
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${d.name} website demo (opens in a new tab)`}
                className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-primary"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#deebfb]">
                  {d.image ? (
                    <Image
                      src={d.image}
                      alt={d.imageAlt}
                      fill
                      sizes="(min-width:1024px) 33vw,(min-width:768px) 50vw,100vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  ) : (
                    <div
                      aria-hidden
                      className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-linear-to-br from-[#0e294b] via-[#174b82] to-[#3983b0] p-6 text-white"
                    >
                      <div className="absolute -right-10 -bottom-16 size-56 rounded-full border-[20px] border-white/10" />
                      <GraduationCap
                        className="relative size-16 text-[#ffc17a]"
                        strokeWidth={1.25}
                      />
                      <p className="relative mt-5 text-center font-display text-2xl font-semibold">
                        Learning today.
                        <br />
                        Leading tomorrow.
                      </p>
                      <div className="relative mt-5 flex items-center gap-2 text-xs text-white/85">
                        <BookOpen className="size-4" />
                        Education website demo
                      </div>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold tracking-wide text-[#153052]">
                    ILLUSTRATIVE VISUAL
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-semibold tracking-widest text-primary uppercase">
                    {d.category}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold tracking-tight text-text">
                      {d.name}
                    </h3>
                    <ArrowUpRight
                      className="size-5 shrink-0 text-primary"
                      aria-hidden
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {d.description}
                  </p>
                  <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary">
                    <Monitor className="size-4" aria-hidden />
                    Open website demo
                    <span className="sr-only"> in a new tab</span>
                  </span>
                </div>
              </a>
              <div className="border-t border-line px-5 py-2">
                <Link
                  href={`/build-your-proposal?service=website-development-4`}
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-text-muted"
                >
                  I’d like a website like this
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
        {!standalone ? (
          <div className="mt-8 text-center">
            <Link
              href="/templates"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong bg-white px-6 text-sm font-semibold text-text"
            >
              Browse all website demos
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
