"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "@/components/home/AuthorityStory.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AUTHORITY_SCENES = [
  {
    key: "radar",
    state: "Forecast",
    title: "The conflict appears before impact.",
    copy: "Active agents share one map of protected paths, leases, and the order work is allowed to move.",
    src: "/codesite-proof/codesite-radar-desktop.png",
    alt: "Vectant radar forecasting a collision between active agent work",
    shot: styles.authorityShotRadar,
  },
  {
    key: "black-box",
    state: "Write held",
    title: "The denied write enters the record.",
    copy: "The boundary blocks the mutation and preserves the instruction, quarantine, and ordered event that caused it.",
    src: "/codesite-proof/codesite-black-box-desktop.png",
    alt: "Vectant Black Box preserving the denied write and ordered authority events",
    shot: styles.authorityShotBlackBox,
  },
  {
    key: "provenance",
    state: "Evidence attached",
    title: "The exact line keeps its chain of custody.",
    copy: "Source, transaction, process ancestry, evidence, and rationale remain linked where the change occurred.",
    src: "/codesite-proof/codesite-line-provenance-desktop.png",
    alt: "Vectant line provenance tracing a source line to its transaction and evidence",
    shot: styles.authorityShotProvenance,
  },
  {
    key: "landing",
    state: "Landing blocked",
    title: "Clearance waits for proof.",
    copy: "The failed condition remains visible, the change stays held, and nothing lands by inference.",
    src: "/codesite-proof/codesite-landing-desktop.png",
    alt: "Vectant landing view withholding clearance after a failed proof check",
    shot: styles.authorityShotLanding,
  },
];

const SHOT_MOTION = [
  { from: { scale: 1.02 }, to: { scale: 1.105, xPercent: -1.5 } },
  { from: { scale: 1.22, xPercent: 3 }, to: { scale: 1.06, xPercent: 0 } },
  { from: { scale: 1.08, xPercent: 5 }, to: { scale: 1.08, xPercent: -4 } },
  { from: { scale: 1.18, yPercent: 2 }, to: { scale: 1.04, yPercent: -1 } },
];

const SCENE_STARTS = [0, 0.92, 2.22, 3.06];
const SCENE_HOLDS = [0.92, 1.3, 0.84, 1.16];

export function AuthorityStory() {
  const rootRef = useRef(null);
  const preludeRef = useRef(null);
  const stackRef = useRef(null);
  const progressRef = useRef(null);
  const tokenRef = useRef(null);
  const sceneRefs = useRef([]);
  const shotRefs = useRef([]);
  const copyRefs = useRef([]);
  const stateRefs = useRef([]);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const preludeWords = gsap.utils.toArray(`.${styles.authorityPreludeWord}`);
        const preludeTween = gsap.fromTo(
          preludeWords,
          { opacity: 0.12, y: 14 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: preludeRef.current,
              start: "top 84%",
              end: "bottom 45%",
              scrub: 0.55,
            },
          },
        );

        const scenes = sceneRefs.current.filter(Boolean);
        const shots = shotRefs.current.filter(Boolean);
        const copies = copyRefs.current.filter(Boolean);
        const states = stateRefs.current.filter(Boolean);

        gsap.set(scenes, { autoAlpha: 0, zIndex: 1 });
        gsap.set(scenes[0], { autoAlpha: 1, zIndex: 2, clipPath: "inset(0 0 0 0)" });
        gsap.set(copies, { autoAlpha: 0, y: 30, clipPath: "inset(0 0 100% 0)" });
        gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(tokenRef.current, { left: "0%" });
        gsap.set(states, { color: "rgba(231, 233, 239, 0.68)" });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stackRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.62,
            invalidateOnRefresh: true,
          },
        });

        scenes.forEach((scene, index) => {
          const start = SCENE_STARTS[index];
          const hold = SCENE_HOLDS[index];
          const previous = scenes[index - 1];
          const wipe = index % 2 === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";

          if (index > 0) {
            timeline
              .set(scene, { autoAlpha: 1, zIndex: 3, clipPath: wipe }, start)
              .to(scene, { clipPath: "inset(0 0 0 0)", duration: 0.13, ease: "power4.inOut" }, start)
              .set(previous, { autoAlpha: 0, zIndex: 1 }, start + 0.13);
          }

          timeline
            .fromTo(
              shots[index],
              SHOT_MOTION[index].from,
              { ...SHOT_MOTION[index].to, duration: hold, ease: "none" },
              start,
            )
            .to(
              copies[index],
              {
                autoAlpha: 1,
                y: 0,
                clipPath: "inset(0 0 0% 0)",
                duration: 0.22,
                ease: "power3.out",
              },
              start + 0.1,
            )
            .to(
              progressRef.current,
              { scaleX: (index + 1) / scenes.length, duration: hold * 0.82, ease: "none" },
              start,
            )
            .to(
              tokenRef.current,
              {
                left: `${(index / (scenes.length - 1)) * 100}%`,
                duration: index === 0 ? 0.01 : 0.32,
                ease: "power3.inOut",
              },
              start,
            )
            .to(states[index], { color: "#928cb5", duration: 0.12 }, start + 0.08);

          if (index < scenes.length - 1) {
            timeline.to(
              copies[index],
              { autoAlpha: 0, y: -24, duration: 0.12, ease: "power2.in" },
              start + hold - 0.12,
            );
          }
        });

        timeline.to({}, { duration: 0.18 });

        return () => {
          preludeTween.kill();
          timeline.kill();
        };
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="runtime-path" ref={rootRef} className={styles.authorityFilm} data-film-act="incident">
      <div ref={preludeRef} className={styles.authorityPrelude}>
        <h2>
          <span className={styles.authorityPreludeWord}>One</span>{" "}
          <span className={styles.authorityPreludeWord}>incident.</span>{" "}
          <span className={styles.authorityPreludeWord}>Every</span>{" "}
          <span className={styles.authorityPreludeWord}>decision</span>{" "}
          <span className={styles.authorityPreludeWord}>attached.</span>
        </h2>
      </div>

      <div ref={stackRef} className={styles.authorityStack}>
        <div className={styles.authorityStage}>
          {AUTHORITY_SCENES.map(({ key, title, copy, src, alt, shot }, index) => (
            <article
              key={key}
              ref={(node) => { sceneRefs.current[index] = node; }}
              className={`${styles.authorityScene} ${shot}`}
              data-authority-scene={key}
            >
              <div
                ref={(node) => { shotRefs.current[index] = node; }}
                className={styles.authoritySceneMedia}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 767px) 980px, 100vw"
                  className={styles.authoritySceneImage}
                />
                <div className={styles.authoritySceneGrade} aria-hidden="true" />
              </div>
              <div
                ref={(node) => { copyRefs.current[index] = node; }}
                className={styles.authoritySceneCopy}
              >
                <h2>{title}</h2>
                <p>{copy}</p>
              </div>
            </article>
          ))}

          <div className={styles.authorityChain} aria-hidden="true">
            <div className={styles.authorityChainTrack}>
              <i ref={progressRef} />
              <b ref={tokenRef}>
                <em />
              </b>
            </div>
            <div className={styles.authorityChainStates}>
              {AUTHORITY_SCENES.map((scene, index) => (
                <span key={scene.key} ref={(node) => { stateRefs.current[index] = node; }}>
                  {scene.state}
                </span>
              ))}
            </div>
          </div>

          <svg className={styles.authorityCorridor} viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
            <path d="M -60 840 L 800 486 L 1660 840" />
          </svg>
        </div>
      </div>
    </section>
  );
}
