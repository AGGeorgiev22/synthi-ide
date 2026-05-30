"use client";

import { useEffect } from "react";

/**
 * Buttery inertia scrolling via Lenis — desktop pointers only.
 * Skipped under reduced motion or on touch devices so we never hijack
 * mobile scrolling. Also upgrades in-page anchor jumps to smooth scrolls.
 */
export function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (prefersReduced || !finePointer) return;

    let lenis;
    let rafId = 0;
    let onClick;
    let cancelled = false;

    import("lenis")
      .then(({ default: Lenis }) => {
        if (cancelled) return;
        lenis = new Lenis({
          lerp: 0.09,
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.5,
        });

        const raf = (time) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        // smooth in-page anchor navigation with sticky-nav offset
        onClick = (e) => {
          const a = e.target.closest('a[href^="#"]');
          if (!a) return;
          const id = a.getAttribute("href");
          if (!id || id === "#") return;
          const target = document.querySelector(id);
          if (!target) return;
          e.preventDefault();
          lenis.scrollTo(target, { offset: -72, duration: 1.1 });
          history.replaceState(null, "", id);
        };
        document.addEventListener("click", onClick);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (onClick) document.removeEventListener("click", onClick);
      if (lenis) lenis.destroy();
    };
  }, []);

  return null;
}
