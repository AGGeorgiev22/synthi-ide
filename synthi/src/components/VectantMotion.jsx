"use client";

import { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function VectantMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.08,
    });

    lenis.on("scroll", ScrollTrigger.update);

    let frame = 0;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;

    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-reveal]").forEach((node) => {
        gsap.fromTo(
          node,
          { y: 34, opacity: 0.72 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: node,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.fromTo(
        ".hero-title, .hero-copy",
        { y: 18, opacity: 0.88 },
        {
          y: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.08,
          ease: "power4.out",
          immediateRender: false,
        }
      );

      const words = gsap.utils.toArray(".scrub-word");
      if (words.length) {
        gsap.fromTo(
          words,
          { opacity: 0.18, y: 8 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.04,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: "#trust-reveal",
              start: "top 75%",
              end: "bottom 45%",
              scrub: 0.8,
            },
          }
        );
      }

      gsap.utils.toArray(".hero-floating-proof-a, .hero-floating-proof-b, .hero-shot-a, .hero-shot-b").forEach((node, index) => {
        gsap.to(node, {
          y: index % 2 === 0 ? -16 : 14,
          duration: 4.2 + index * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      gsap.utils.toArray(".proof-frame, .runtime-pillar, .deep-feature, .trust-system, .surface-list article, .faq-card, .comparison-ledger-row").forEach((node) => {
        gsap.fromTo(
          node,
          { y: 26, opacity: 0.76 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power4.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: node,
              start: "top 86%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.utils.toArray(".proof-frame").forEach((node) => {
        gsap.fromTo(
          node,
          { scale: 0.965 },
          {
            scale: 1,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: node,
              start: "top 90%",
              end: "bottom 40%",
              scrub: 0.9,
            },
          }
        );
      });

      gsap.utils.toArray(".proof-gallery-card").forEach((node, index) => {
        gsap.fromTo(
          node,
          { y: 30 + (index % 3) * 12, opacity: 0.76 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power4.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: node,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.fromTo(
        ".gpu-compare-shell, .compiled-workflow-grid article",
        { y: 36, opacity: 0.76 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.95,
          ease: "power4.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".gpu-stage",
            start: "top 78%",
          },
        }
      );

      const onramp = document.querySelector(".agent-onramp");
      const onrampGrid = document.querySelector(".agent-onramp-grid");
      if (onramp && onrampGrid) {
        ScrollTrigger.create({
          trigger: onramp,
          start: "top 92px",
          end: "+=160%",
          pin: onrampGrid,
          pinSpacing: true,
          anticipatePin: 1,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return null;
}
