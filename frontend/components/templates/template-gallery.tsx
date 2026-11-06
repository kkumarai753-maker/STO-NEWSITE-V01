"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Monitor } from "lucide-react";
import { liveDemos } from "@/data/templates";

export function TemplateGallery({ standalone = false }: { standalone?: boolean }) {
  const [filter, setFilter] = useState("All");
  const [edges, setEdges] = useState({ start: true, end: false });
  const track = useRef<HTMLDivElement>(null);
  const filters = ["All", ...new Set(liveDemos.map((demo) => demo.category))];
  const visible = filter === "All" ? liveDemos : liveDemos.filter((demo) => demo.category === filter);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    element.scrollLeft = 0;
    const update = () => setEdges({
      start: element.scrollLeft <= 4,
      end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4,
    });
    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      element.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [filter]);

  function move(direction: number) {
    const element = track.current;
    if (!element) return;
    const cards = element.querySelectorAll<HTMLElement>("[data-demo-card]");
    const step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : element.clientWidth;
    element.scrollBy({ left: step * direction, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return (
    <section id="templates" aria-labelledby="templates-title" className="home-tech-demos py-12 sm:py-16">
      <div className="container-page">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="preview-kicker">Explore it. Imagine yours.</p>
            <h2 id="templates-title" className="mt-3 text-heading-2 text-text">
              Trending Website Demos on <span className="text-[#bc5714]">Sunrise Tech Origin</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">Find inspiration for your industry, then open a working demo to explore.</p>
          </div>
          <div className="flex shrink-0 gap-2 pb-1">
            <button type="button" aria-label="Previous website demos" aria-controls="website-demo-slider" disabled={edges.start} onClick={() => move(-1)} className="grid size-11 place-items-center rounded-full border border-line-strong bg-white text-text hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><ArrowLeft className="size-4" aria-hidden /></button>
            <button type="button" aria-label="Next website demos" aria-controls="website-demo-slider" disabled={edges.end} onClick={() => move(1)} className="grid size-11 place-items-center rounded-full border border-line-strong bg-white text-text hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><ArrowRight className="size-4" aria-hidden /></button>
          </div>
        </div>
        <div className="demo-category-filters mt-6" role="group" aria-label="Filter website templates">
          {filters.map((category) => (
            <button key={category} type="button" onClick={() => setFilter(category)} aria-pressed={filter === category} className={`min-h-11 shrink-0 whitespace-nowrap rounded-full border px-4 text-xs font-medium transition-colors ${filter === category ? "border-primary bg-primary text-white" : "border-line-strong bg-white text-text-muted hover:border-primary"}`}>{category}</button>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-text-subtle">
          <p role="status" aria-live="polite">{visible.length} {visible.length === 1 ? "demo" : "demos"}{filter !== "All" ? ` in ${filter}` : " to explore"}</p>
          <span className="hidden sm:inline">Swipe or use the arrows</span>
        </div>
        <div ref={track} id="website-demo-slider" role="region" aria-label="Live website demos — swipe or use the arrow buttons" tabIndex={0} className="website-demo-slider mt-4" onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); }
        }}>
          {visible.map((demo, index) => (
            <article key={demo.id} data-demo-card data-category={demo.category} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${visible.length}: ${demo.name}`} className="website-demo-card group relative isolate overflow-hidden rounded-[1.35rem] bg-[#092442]">
              {demo.image ? <Image src={demo.image} alt={demo.imageAlt} fill sizes="(min-width:1024px) 32vw,(min-width:640px) 46vw,84vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none" /> : null}
              <div className="demo-card-shade absolute inset-0" aria-hidden />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                <p className="flex items-center gap-2 text-xs text-white/90"><Monitor className="size-3.5 shrink-0" aria-hidden />{demo.category}</p>
                <h3 className="mt-2 text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl">{demo.name}</h3>
                <a href={demo.url} target="_blank" rel="noopener noreferrer" aria-label={`View ${demo.name} live demo (opens in a new tab)`} className="mt-4 flex min-h-12 items-center justify-center gap-3 rounded-xl border border-white/80 bg-black/15 px-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[#0b2445] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  View Live Demo <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-2xl text-[11px] leading-relaxed text-text-subtle">Pictures represent the industry or project; they are not website screenshots. Demos open in a new tab.</p>
          {!standalone ? <Link href="/templates" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary">All website demos <ArrowUpRight className="size-4" aria-hidden /></Link> : null}
        </div>
      </div>
    </section>
  );
}
