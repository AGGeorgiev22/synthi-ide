"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import styles from "@/components/home/VectantHome.module.css";
import { PILOT_MAILTO } from "@/lib/pilot";

export function CinematicHero() {
  const rootRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const camera = useSpring(scrollYProgress, {
    stiffness: 92,
    damping: 24,
    mass: 0.42,
  });

  const copyOpacity = useTransform(camera, [0, 0.28, 0.58], [1, 1, 0]);
  const copyY = useTransform(camera, [0, 0.58], [0, -92]);
  const mediaScale = useTransform(camera, [0, 0.9], [0.82, 1.045]);
  const mediaY = useTransform(camera, [0, 0.9], [28, -18]);
  const leftBracketX = useTransform(camera, [0, 0.9], [0, -96]);
  const rightBracketX = useTransform(camera, [0, 0.9], [0, 96]);
  const frameOpacity = useTransform(camera, [0, 0.12, 1], [0.72, 1, 1]);

  return (
    <section id="top" ref={rootRef} className={styles.cinemaHero}>
      <div className={styles.cinemaHeroSticky}>
        <motion.div
          className={styles.cinemaHeroCopy}
          style={reduceMotion ? undefined : { opacity: copyOpacity, y: copyY }}
        >
          <h1>
            Agents move. <span>Authority stays bounded.</span>
          </h1>
          <p>
            Run parallel coding agents inside scoped authority, live runtime state, and proof your team can inspect.
          </p>
          <div className={styles.cinemaHeroActions}>
            <a href={PILOT_MAILTO} className={styles.cinemaPrimaryAction}>
              Request pilot
              <span aria-hidden="true"><ArrowUpRight size={15} weight="bold" /></span>
            </a>
            <a href="#runtime-path" className={styles.cinemaSecondaryAction}>
              See the runtime
              <ArrowDownRight size={15} weight="bold" />
            </a>
          </div>
        </motion.div>

        <motion.div
          className={styles.cinemaHeroMedia}
          style={reduceMotion ? undefined : { opacity: frameOpacity, scale: mediaScale, y: mediaY }}
        >
          <motion.span
            className={`${styles.cinemaBracket} ${styles.cinemaBracketLeft}`}
            style={reduceMotion ? undefined : { x: leftBracketX }}
            aria-hidden="true"
          />
          <motion.span
            className={`${styles.cinemaBracket} ${styles.cinemaBracketRight}`}
            style={reduceMotion ? undefined : { x: rightBracketX }}
            aria-hidden="true"
          />

          <div className={styles.cinemaFrameOuter}>
            <div className={styles.cinemaFrameInner}>
              <Image
                src="/product-proof/codesite-full-workflow-ui.png"
                alt="Vectant CodeSite showing a live authority map, landing queue, and collision forecast"
                fill
                priority
                sizes="(min-width: 1600px) 1500px, 100vw"
                className={styles.cinemaHeroImage}
              />
              <div className={styles.cinemaHeroScrim} aria-hidden="true" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
