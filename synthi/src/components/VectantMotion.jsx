"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function VectantMotion() {
  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;

    const ctx = gsap.context(() => {
      const revealNodes = new Set([
        ...gsap.utils.toArray("[data-reveal]"),
        ...gsap.utils.toArray(
          ".proof-frame, .runtime-pillar, .deep-feature, .trust-system, .surface-list article, .faq-card, .comparison-ledger-row, .proof-gallery-card, .gpu-compare-shell, .compiled-workflow-grid article",
        ),
      ]);

      revealNodes.forEach((node) => {
        gsap.fromTo(
          node,
          { y: 22, opacity: 0.72, scale: 0.992 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.72,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: node,
              start: "top 90%",
              once: true,
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

    });

    return () => ctx.revert();
  }, []);

  return null;
}
