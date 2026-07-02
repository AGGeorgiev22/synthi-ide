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

      gsap.utils.toArray(".hero-kicker-line-path").forEach((path) => {
        gsap.set(path, {
          strokeDasharray: 1.04,
          strokeDashoffset: 1.04,
          opacity: 0.24,
        });

        gsap
          .timeline({ repeat: -1, repeatDelay: 0.28 })
          .to(path, {
            strokeDashoffset: 0,
            opacity: 0.96,
            duration: 1.18,
            ease: "power3.out",
          })
          .to(path, {
            opacity: 1,
            duration: 1.55,
            ease: "sine.inOut",
          })
          .to(path, {
            strokeDashoffset: -1.04,
            opacity: 0.18,
            duration: 0.92,
            ease: "power3.in",
          });
      });

      gsap.utils.toArray(".proof-marquee-track").forEach((track) => {
        gsap.fromTo(
          track,
          { xPercent: 0 },
          {
            xPercent: -50,
            duration: 30,
            repeat: -1,
            ease: "none",
          },
        );
      });

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
