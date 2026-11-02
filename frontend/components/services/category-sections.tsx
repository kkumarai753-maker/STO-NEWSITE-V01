"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { serviceCategories } from "@/data/service-categories";

const descriptions: Record<string, string> = {
  "website-development": "Professional websites and online stores that turn your business into a clear, compelling digital experience.",
  "software-development": "Custom applications and business systems that bring your team, data and day-to-day operations together.",
  "ai-automation": "AI agents and connected workflows that simplify repetitive tasks and help your team focus on meaningful work.",
  "social-media-marketing-branding": "Brand identity, content and digital campaigns that help the right audience discover and connect with your business.",
};

export function CategorySections() {
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ start: true, end: false, active: 0 });

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => {
      const cards = Array.from(element.querySelectorAll<HTMLElement>("[data-service-card]"));
      const origin = cards[0]?.offsetLeft ?? 0;
      const step = cards[1] ? cards[1].offsetLeft - origin : element.clientWidth;
      setPosition({
        start: element.scrollLeft <= 4,
        end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4,
        active: Math.min(cards.length - 1, Math.max(0, Math.round(element.scrollLeft / step))),
      });
    };
    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      element.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  function move(direction: number) {
    const element = track.current;
    if (!element) return;
    const cards = element.querySelectorAll<HTMLElement>("[data-service-card]");
    const step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : element.clientWidth;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({ left: step * direction, behavior: reduced ? "instant" : "smooth" });
  }

  return (
    <section id="services" aria-labelledby="main-services-title" className="home-tech-services py-12 sm:py-16">
      <div className="container-page">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="preview-kicker">Four ways to move forward</p>
            <h2 id="main-services-title" className="mt-3 text-heading-2 text-text">
              Your goals. <em>Our expertise.</em>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted">
              Build your online presence, streamline operations and reach more customers.
            </p>
          </div>
          <div className="flex shrink-0 gap-2 pb-1">
            <button type="button" onClick={() => move(-1)} disabled={position.start} aria-label="Previous service categories" aria-controls="service-category-slider" className="grid size-11 place-items-center rounded-full border border-line-strong bg-white text-text transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <ArrowLeft className="size-4" aria-hidden />
            </button>
            <button type="button" onClick={() => move(1)} disabled={position.end} aria-label="Next service categories" aria-controls="service-category-slider" className="grid size-11 place-items-center rounded-full border border-line-strong bg-white text-text transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
        <div ref={track} id="service-category-slider" role="region" aria-label="Service categories — swipe or use the arrow buttons" tabIndex={0} className="service-category-slider mt-7">
          {serviceCategories.map((category, index) => (
            <article key={category.id} id={category.id} data-service-card role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${serviceCategories.length}: ${category.name}`} className="service-category-card home-tech-service-card group flex flex-col overflow-hidden rounded-2xl border border-[#bdd4ff]">
              <Link href={`/services/${category.id}`} tabIndex={-1} aria-hidden="true" className="relative block aspect-[4/3] shrink-0 overflow-hidden" style={{ backgroundColor: category.imageBackground }}>
                <Image src={category.image} alt="" fill sizes="(min-width:1024px) 33vw,(min-width:640px) 48vw,85vw" className="object-contain transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none" />
              </Link>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-xl font-semibold leading-snug tracking-tight text-text">{category.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">{descriptions[category.id]}</p>
                <Link href={`/services/${category.id}`} aria-label={`Explore all ${category.name} services`} className="mt-5 inline-flex min-h-11 items-center justify-between gap-3 rounded-xl border border-primary/30 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                  Explore <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-xs text-text-subtle">Swipe to explore all four categories</p>
          <Link href="/services" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary">All services <ArrowRight className="size-4" aria-hidden /></Link>
        </div>
        <p className="sr-only" aria-live="polite">Service category {position.active + 1} of {serviceCategories.length}</p>
      </div>
    </section>
  );
}
