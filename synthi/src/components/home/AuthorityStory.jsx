"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

import styles from "@/components/home/AuthorityStory.module.css";

gsap.registerPlugin(ScrollTrigger);

const AUTHORITY_SCENES = [
  {
    key: "radar",
    phase: "CONFLICT FORECAST",
    event: "Route 03 crossing protected path",
    title: "See the collision before it lands.",
    copy: "Parallel agents share one map of protected paths, active leases, conflicts, and the order work is allowed to move.",
    src: "/codesite-proof/codesite-radar-desktop.png",
    alt: "Vectant radar showing active agent flights and a forecast collision",
    shot: styles.authorityShotRadar,
  },
  {
    key: "black-box",
    phase: "WRITE DENIED",
    event: "Mutation held and recorder armed",
    title: "The boundary absorbs the hit.",
    copy: "Denied writes, quarantines, instructions, and proof bundles stay in one ordered event stream instead of disappearing into chat.",
    src: "/codesite-proof/codesite-black-box-desktop.png",
    alt: "Vectant black box showing an ordered record of authority events",
    shot: styles.authorityShotBlackBox,
  },
  {
    key: "provenance",
    phase: "PROVENANCE ATTACHED",
    event: "Transaction, process, and evidence linked",
    title: "Trace authority to the line.",
    copy: "The source line keeps its transaction, process ancestry, evidence, and reason for existing attached.",
    src: "/codesite-proof/codesite-line-provenance-desktop.png",
    alt: "Vectant line inspector tracing a source line to its transaction and evidence",
    shot: styles.authorityShotProvenance,
  },
  {
    key: "landing",
    phase: "LANDING HELD",
    event: "Check failed and clearance withheld",
    title: "Nothing lands without proof.",
    copy: "A failed check holds the change and names the exact condition that blocked it.",
    src: "/codesite-proof/codesite-landing-desktop.png",
    alt: "Vectant landing view holding a change after a failed proof check",
    shot: styles.authorityShotLanding,
  },
];

export function AuthorityStory() {
  const rootRef = useRef(null);
  const preludeRef = useRef(null);
  const stackRef = useRef(null);
  const progressRef = useRef(null);
  const cursorRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !rootRef.current || !preludeRef.current || !stackRef.current) {
      return undefined;
    }

    const context = gsap.context(() => {
      const preludeWords = gsap.utils.toArray(`.${styles.authorityPreludeWord}`);
      gsap.fromTo(
        preludeWords,
        { opacity: 0.13, y: 12 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: preludeRef.current,
            start: "top 88%",
            end: "bottom 46%",
            scrub: 0.7,
          },
        }
      );

      const media = gsap.matchMedia();
      media.add("(min-width: 768px)", () => {
        const scenes = gsap.utils.toArray(`.${styles.authorityScene}`);
        const steps = gsap.utils.toArray(`.${styles.authorityProgressStep}`);

        gsap.set(scenes, { autoAlpha: 0, zIndex: 1 });
        gsap.set(scenes[0], { autoAlpha: 1, zIndex: 2, clipPath: "inset(0 0 0 0)" });
        gsap.set(progressRef.current, { scaleX: 0.03, transformOrigin: "left center" });
        gsap.set(cursorRef.current, { left: "0%" });
        gsap.set(steps, { color: "rgba(231, 233, 239, 0.52)" });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stackRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.85,
            invalidateOnRefresh: true,
          },
        });

        scenes.forEach((scene, index) => {
          const at = index;
          const shot = scene.querySelector("[data-authority-shot]");
          const copy = scene.querySelector("[data-authority-copy]");

          if (index > 0) {
            const previous = scenes[index - 1];
            const inset = index % 2 === 0 ? "inset(100% 0 0 0)" : "inset(0 100% 0 0)";
            timeline
              .set(scene, { autoAlpha: 1, zIndex: 3, clipPath: inset }, at)
              .to(scene, { clipPath: "inset(0 0 0 0)", duration: 0.16, ease: "power2.out" }, at)
              .set(previous, { autoAlpha: 0, zIndex: 1 }, at + 0.16);
          }

          timeline
            .fromTo(
              shot,
              { scale: index === 1 ? 1.065 : 1.035, xPercent: index === 2 ? 2.2 : 0 },
              { scale: 1, xPercent: 0, duration: 0.86, ease: "none" },
              at
            )
            .fromTo(
              copy,
              { y: 28, clipPath: "inset(0 0 100% 0)" },
              { y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.25, ease: "power2.out" },
              at + 0.08
            )
            .to(
              progressRef.current,
              { scaleX: (index + 1) / scenes.length, duration: 0.72, ease: "none" },
              at
            )
            .to(
              cursorRef.current,
              { left: `${(index / (scenes.length - 1)) * 100}%`, duration: 0.72, ease: "none" },
              at
            )
            .to(steps[index], { color: "#ff7657", duration: 0.14, ease: "none" }, at + 0.08);
        });

        timeline.to({}, { duration: 0.16 });
        return () => timeline.kill();
      });

      return () => media.revert();
    }, rootRef);

    return () => context.revert();
  }, [reduceMotion]);

  return (
    <section id="runtime-path" ref={rootRef} className={styles.authorityFilm}>
      <div ref={preludeRef} className={styles.authorityPrelude}>
        <p>BLACK BOX RECORDER ARMED</p>
        <h2>
          <span className={styles.authorityPreludeWord}>One</span>{" "}
          <span className={styles.authorityPreludeWord}>run.</span>{" "}
          <span className={styles.authorityPreludeWord}>Every</span>{" "}
          <span className={styles.authorityPreludeWord}>decision</span>{" "}
          <span className={styles.authorityPreludeWord}>attached.</span>
        </h2>
      </div>

      <div ref={stackRef} className={styles.authorityStack}>
        <div className={styles.authorityStage}>
          {AUTHORITY_SCENES.map(({ key, phase, event, title, copy, src, alt, shot }) => (
            <article key={key} className={`${styles.authorityScene} ${shot}`}>
              <div className={styles.authoritySceneMedia} data-authority-shot>
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="100vw"
                  className={styles.authoritySceneImage}
                />
                <div className={styles.authoritySceneGrade} aria-hidden="true" />
              </div>
              <div className={styles.authoritySceneCopy} data-authority-copy>
                <p>{phase}</p>
                <h2>{title}</h2>
                <span>{copy}</span>
              </div>
              <div className={styles.authorityEvent} aria-hidden="true">
                <span>{phase}</span>
                <strong>{event}</strong>
              </div>
            </article>
          ))}

          <div className={styles.authorityMissionHeader} aria-hidden="true">
            <span>FLIGHT 07 / 13</span>
            <strong>CONTROLLED AUTHORITY</strong>
          </div>

          <div className={styles.authorityProgress} aria-hidden="true">
            <i ref={progressRef} />
            <b ref={cursorRef} />
            {AUTHORITY_SCENES.map((scene) => (
              <span key={scene.key} className={styles.authorityProgressStep}>{scene.key}</span>
            ))}
          </div>

          <svg className={styles.authorityCorridor} viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
            <path d="M -40 820 L 800 478 L 1640 820" />
          </svg>
        </div>
      </div>
    </section>
  );
}
