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
        const lineLength = path.getTotalLength();

        gsap.set(path, {
          strokeDasharray: lineLength,
          strokeDashoffset: lineLength,
          opacity: 0.92,
        });

        gsap
          .timeline()
          .to(path, {
            strokeDashoffset: 0,
            duration: 1.45,
            ease: "power3.out",
          })
          .set(path, {
            strokeDasharray: `${lineLength * 0.86} ${lineLength * 0.14}`,
            strokeDashoffset: 0,
            opacity: 0.96,
          })
          .to(path, {
            strokeDashoffset: -lineLength,
            duration: 5.8,
            ease: "none",
            repeat: -1,
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

      const runtimePathShell = document.querySelector(".runtime-path-shell");
      if (runtimePathShell && window.innerWidth >= 900) {
        const runtimePathSteps = gsap.utils.toArray("[data-runtime-step]", runtimePathShell);
        const runtimePathPanels = gsap.utils.toArray("[data-runtime-panel]", runtimePathShell);

        if (runtimePathSteps.length && runtimePathSteps.length === runtimePathPanels.length) {
          gsap.set(runtimePathSteps, { opacity: 0.46, y: 8 });
          gsap.set(runtimePathSteps[0], { opacity: 1, y: 0 });
          gsap.set(runtimePathPanels, { autoAlpha: 0, y: 22, scale: 0.982 });
          gsap.set(runtimePathPanels[0], { autoAlpha: 1, y: 0, scale: 1 });

          const runtimePathTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: runtimePathShell,
              start: "top top",
              end: () => `+=${Math.max(window.innerHeight * Math.max(runtimePathPanels.length - 1, 1) * 0.66, 1120)}`,
              pin: true,
              scrub: 0.72,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          const runtimeStepSpacing = 1.02;

          runtimePathSteps.forEach((step, index) => {
            if (index === 0) return;
            const at = index * runtimeStepSpacing;

            runtimePathTimeline
              .to(
                runtimePathPanels[index - 1],
                {
                  autoAlpha: 0,
                  y: -18,
                  scale: 0.992,
                  duration: 0.42,
                  ease: "none",
                },
                at - 0.42,
              )
              .to(
                runtimePathPanels[index],
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.58,
                  ease: "none",
                },
                at - 0.18,
              )
              .to(
                runtimePathSteps[index - 1],
                {
                  opacity: 0.48,
                  y: -4,
                  duration: 0.38,
                  ease: "none",
                },
                at - 0.34,
              )
              .to(
                step,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.42,
                  ease: "none",
                },
                at - 0.28,
              );
          });

          runtimePathTimeline.to({}, { duration: 0.35 });
        }
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
