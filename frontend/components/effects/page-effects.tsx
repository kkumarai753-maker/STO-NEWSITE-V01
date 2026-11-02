"use client";

import { useEffect } from "react";

/**
 * Page-level interaction controller (Client Component, renders nothing).
 *
 * Why client: needs IntersectionObserver and pointer events. Centralising the
 * effects here means every section can stay a Server Component, they only
 * declare intent through data attributes:
 *
 *  - [data-reveal]     fade/slide in when scrolled into view
 *  - [data-spotlight]  pointer-following border glow (CSS reads --mx/--my)
 *  - [data-magnetic]   subtle magnetic pull toward the pointer
 */
export function PageEffects() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // ---- Scroll reveal --------------------------------------------------
    const revealAll = () =>
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])")
        .forEach((el) => el.setAttribute("data-revealed", ""));

    let observer: IntersectionObserver | undefined;
    let mutations: MutationObserver | undefined;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealAll();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.setAttribute("data-revealed", "");
              observer?.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
      const observe = (root: ParentNode) =>
        root
          .querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])")
          .forEach((el) => observer?.observe(el));
      observe(document);

      // Pick up content streamed or lazily mounted after hydration.
      mutations = new MutationObserver((records) => {
        for (const record of records) {
          record.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            if (node.matches("[data-reveal]:not([data-revealed])")) observer?.observe(node);
            observe(node);
          });
        }
      });
      mutations.observe(document.body, { childList: true, subtree: true });
    }

    if (!finePointer) {
      return () => {
        observer?.disconnect();
        mutations?.disconnect();
      };
    }

    // ---- Pointer effects (delegated, rAF-throttled) ---------------------
    let frame = 0;
    let lastEvent: PointerEvent | null = null;
    let magneticEl: HTMLElement | null = null;

    const resetMagnetic = () => {
      if (magneticEl) {
        magneticEl.style.transform = "";
        magneticEl = null;
      }
    };

    const update = () => {
      frame = 0;
      const e = lastEvent;
      if (!e || !(e.target instanceof Element)) return;

      const card = e.target.closest<HTMLElement>("[data-spotlight]");
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }

      if (reducedMotion) return;
      const magnetic = e.target.closest<HTMLElement>("[data-magnetic]");
      if (magnetic !== magneticEl) resetMagnetic();
      if (magnetic) {
        magneticEl = magnetic;
        const rect = magnetic.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        magnetic.style.transform = `translate3d(${dx * 0.18}px, ${dy * 0.28}px, 0)`;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      lastEvent = e;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onPointerLeaveWindow = () => resetMagnetic();

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeaveWindow);

    return () => {
      observer?.disconnect();
      mutations?.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeaveWindow);
    };
  }, []);

  return null;
}
