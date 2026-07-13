"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

import styles from "@/components/home/VectantHome.module.css";

gsap.registerPlugin(ScrollTrigger);

const AUTHORITY_SCENES = [
  {
    key: "radar",
    title: "See the collision before it lands.",
    copy: "Parallel agents share one map of protected paths, active leases, conflicts, and the order work is allowed to move.",
    src: "/codesite-proof/codesite-radar-desktop.png",
    width: 1440,
    height: 1973,
    position: styles.authorityImageRadar,
  },
  {
    key: "black-box",
    title: "Keep the replay, not just the result.",
    copy: "Every denied write, quarantine, instruction, and proof bundle stays in the same ordered event stream.",
    src: "/codesite-proof/codesite-black-box-desktop.png",
    width: 1440,
    height: 1313,
    position: styles.authorityImageBlackBox,
  },
  {
    key: "provenance",
    title: "Trace authority to the line.",
    copy: "The source line keeps its transaction, process ancestry, evidence, and reason for existing attached.",
    src: "/codesite-proof/codesite-line-provenance-desktop.png",
    width: 1440,
    height: 1100,
    position: styles.authorityImageProvenance,
  },
  {
    key: "landing",
    title: "Stop the landing when proof fails.",
    copy: "A failed verification is not polished away. Vectant holds the change and shows the exact condition that blocked it.",
    src: "/codesite-proof/codesite-landing-desktop.png",
    width: 1440,
    height: 1199,
    position: styles.authorityImageLanding,
  },
];

const STATEMENT = "One change. Every decision still attached.";

export function AuthorityStory() {
  const rootRef = useRef(null);
  const statementRef = useRef(null);
  const stackRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !rootRef.current || !statementRef.current || !stackRef.current) {
      return undefined;
    }

    const context = gsap.context(() => {
      const words = gsap.utils.toArray(`.${styles.authorityScrubWord}`);
      gsap.fromTo(
        words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: statementRef.current,
            start: "top 72%",
            end: "bottom 42%",
            scrub: 0.8,
          },
        }
      );

      const media = gsap.matchMedia();
      media.add("(min-width: 768px)", () => {
        const scenes = gsap.utils.toArray(`.${styles.authorityScene}`);
        gsap.set(scenes, { autoAlpha: 0, scale: 1.035 });
        gsap.set(scenes[0], { autoAlpha: 1, scale: 1 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stackRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        scenes.slice(1).forEach((scene, index) => {
          const previous = scenes[index];
          const at = index;
          timeline
            .to(previous, { autoAlpha: 0, scale: 0.955, duration: 0.58, ease: "none" }, at)
            .fromTo(
              scene,
              { autoAlpha: 0, scale: 1.035 },
              { autoAlpha: 1, scale: 1, duration: 0.72, ease: "none" },
              at + 0.22
            );
        });

        return () => timeline.kill();
      });

      return () => media.revert();
    }, rootRef);

    return () => context.revert();
  }, [reduceMotion]);

  return (
    <section id="runtime-path" ref={rootRef} className={styles.authorityFilm}>
      <div ref={statementRef} className={styles.authorityIntertitle} aria-label={STATEMENT}>
        <span className={styles.authorityScrubWord} aria-hidden="true">One</span>{" "}
        <span className={styles.authorityScrubWord} aria-hidden="true">change.</span>{" "}
        <span className={styles.authorityInlineImage} aria-hidden="true">
          <Image
            src="/codesite-proof/codesite-black-box-desktop.png"
            alt=""
            fill
            sizes="180px"
            className="object-cover object-center"
          />
        </span>{" "}
        <span className={styles.authorityScrubWord} aria-hidden="true">Every</span>{" "}
        <span className={styles.authorityScrubWord} aria-hidden="true">decision</span>{" "}
        <span className={styles.authorityScrubWord} aria-hidden="true">still</span>{" "}
        <span className={styles.authorityScrubWord} aria-hidden="true">attached.</span>
      </div>

      <div ref={stackRef} className={styles.authorityStack}>
        <div className={styles.authorityStage}>
          {AUTHORITY_SCENES.map(({ key, title, copy, src, width, height, position }) => (
            <article key={key} className={styles.authorityScene}>
              <div className={styles.authoritySceneMedia}>
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="100vw"
                  className={`${styles.authoritySceneImage} ${position}`}
                />
                <div className={styles.authoritySceneScrim} aria-hidden="true" />
              </div>
              <div className={styles.authoritySceneCopy}>
                <h2>{title}</h2>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
