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
    let onClick;
    let offScrollTrigger;
    let gsapTicker;
    let gsapInstance;
    let cancelled = false;
    const stopLenis = () => lenis?.stop();
    const startLenis = () => lenis?.start();

    window.addEventListener("vectant:scroll-lock", stopLenis);
    window.addEventListener("vectant:scroll-unlock", startLenis);

    Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        gsapInstance = gsap;
        lenis = new Lenis({
          lerp: 0.09,
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.5,
          autoRaf: false,
        });
        if (document.documentElement.dataset.vectantScrollLock === "true") lenis.stop();

        offScrollTrigger = lenis.on("scroll", ScrollTrigger.update);
        gsapTicker = (time) => lenis?.raf(time * 1000);
        gsap.ticker.add(gsapTicker);
        gsap.ticker.lagSmoothing(0);

        // smooth in-page anchor navigation with sticky-nav offset
        onClick = (e) => {
          const a = e.target.closest('a[href^="#"]');
          if (!a) return;
          const id = a.getAttribute("href");
          if (!id || id === "#") return;
          const target = document.querySelector(id);
          if (!target) return;
          e.preventDefault();
          const shouldFocus = a.dataset.scrollFocus === "true";
          lenis.scrollTo(target, {
            offset: -72,
            duration: 1.1,
            force: true,
            onComplete: () => {
              if (!shouldFocus) return;
              if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
              target.focus({ preventScroll: true });
            },
          });
          history.replaceState(null, "", id);
        };
        document.addEventListener("click", onClick);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      window.removeEventListener("vectant:scroll-lock", stopLenis);
      window.removeEventListener("vectant:scroll-unlock", startLenis);
      if (onClick) document.removeEventListener("click", onClick);
      if (offScrollTrigger) offScrollTrigger();
      if (gsapTicker && gsapInstance) gsapInstance.ticker.remove(gsapTicker);
      if (gsapInstance) gsapInstance.ticker.lagSmoothing(500, 33);
      if (lenis) lenis.destroy();
    };
  }, []);

  return null;
}
