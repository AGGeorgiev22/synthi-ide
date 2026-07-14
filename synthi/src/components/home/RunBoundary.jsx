"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "@/components/home/RunBoundary.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CONDITIONS = [
  { key: "runtime", label: "Runtime", value: "Hosted browser attached" },
  { key: "observe", label: "Observe", value: "Screenshot allowed" },
  { key: "replay", label: "Replay", value: "Gated until evidence exists" },
];

export function RunBoundary() {
  const rootRef = useRef(null);
  const frameRef = useRef(null);
  const cameraRef = useRef(null);
  const copyRef = useRef(null);
  const conditionsRef = useRef(null);
  const conditionRefs = useRef([]);
  const scopeLineRef = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          if (!context.conditions.motion) return undefined;

          const { desktop } = context.conditions;
          const conditions = conditionRefs.current.filter(Boolean);
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.58,
              invalidateOnRefresh: true,
            },
          });

          gsap.set(frameRef.current, {
            clipPath: desktop ? "inset(14% 24% 14% 24%)" : "inset(10% 8% 10% 8%)",
            scale: 0.96,
          });
          gsap.set(copyRef.current, { autoAlpha: 0, y: 32 });
          gsap.set(conditionsRef.current, { autoAlpha: 0 });
          gsap.set(conditions, { autoAlpha: 0, x: desktop ? 22 : 12 });
          gsap.set(scopeLineRef.current, { scaleX: 0, transformOrigin: "left center" });

          timeline
            .addLabel("establish", 0)
            .to(
              frameRef.current,
              {
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
                duration: 0.52,
                ease: "power3.out",
              },
              "establish",
            )
            .to(copyRef.current, { autoAlpha: 1, y: 0, duration: 0.26, ease: "power3.out" }, 0.2)
            .addLabel("inspect", 0.55)
            .to(copyRef.current, { autoAlpha: 0, y: -32, duration: 0.16, ease: "power2.in" }, "inspect")
            .to(
              cameraRef.current,
              desktop
                ? {
                    scale: 1.72,
                    xPercent: 25,
                    yPercent: 8,
                    transformOrigin: "14% 26%",
                    duration: 0.62,
                    ease: "power2.inOut",
                  }
                : {
                    x: -8,
                    y: -28,
                    scale: 1.12,
                    transformOrigin: "14% 24%",
                    duration: 0.62,
                    ease: "power2.inOut",
                  },
              "inspect",
            )
            .to(scopeLineRef.current, { scaleX: 1, duration: 0.34, ease: "power2.out" }, 0.7)
            .to(conditionsRef.current, { autoAlpha: 1, duration: 0.12 }, 0.68)
            .to(conditions[0], { autoAlpha: 1, x: 0, duration: 0.18, ease: "power3.out" }, 0.72)
            .to(conditions[1], { autoAlpha: 1, x: 0, duration: 0.18, ease: "power3.out" }, 0.92)
            .to(conditions[2], { autoAlpha: 1, x: 0, duration: 0.18, ease: "power3.out" }, 1.12)
            .addLabel("release", 1.38)
            .to(conditions, { autoAlpha: 0, x: -12, duration: 0.14, stagger: 0.035 }, "release")
            .to(conditionsRef.current, { autoAlpha: 0, duration: 0.12 }, 1.51)
            .to(scopeLineRef.current, { scaleX: 0, duration: 0.18 }, "release")
            .to(
              cameraRef.current,
              desktop
                ? { scale: 1.08, xPercent: 2, yPercent: -1, duration: 0.52, ease: "power3.inOut" }
                : { scale: 1, x: -18, y: 0, duration: 0.52, ease: "power3.inOut" },
              "release",
            )
            .to({}, { duration: 0.16 });

          return () => timeline.kill();
        },
      );

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="runtime" ref={rootRef} className={styles.boundary} data-film-act="instrument-panel">
      <div className={styles.boundarySticky}>
        <figure ref={frameRef} className={styles.boundaryFrame}>
          <div ref={cameraRef} className={styles.boundaryCamera}>
            <Image
              src="/product-proof/browser-workflow-observe-ui.png"
              alt="Vectant workflow controls with hosted runtime and observation attached to a governed workspace"
              fill
              sizes="(max-width: 767px) 1040px, 100vw"
              className={styles.boundaryImage}
            />
          </div>
        </figure>

        <div ref={copyRef} className={styles.boundaryCopy}>
          <h2>The run begins with limits.</h2>
          <p>Runtime, observation, and replay policy attach before the first agent mutation.</p>
        </div>

        <aside ref={conditionsRef} className={styles.boundaryConditions} aria-label="Attached run conditions">
          <i ref={scopeLineRef} aria-hidden="true" />
          {CONDITIONS.map((condition, index) => (
            <div
              key={condition.key}
              ref={(node) => { conditionRefs.current[index] = node; }}
              className={styles.boundaryCondition}
            >
              <span>{condition.label}</span>
              <strong>{condition.value}</strong>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
