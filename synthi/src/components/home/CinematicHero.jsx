"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import styles from "@/components/home/CinematicHero.module.css";
import { PILOT_MAILTO } from "@/lib/pilot";

const CLOSED_APERTURE = "polygon(49.2% 48%, 50.8% 48%, 53.2% 94%, 46.8% 94%)";
const OPEN_APERTURE = "polygon(1.4% 1.5%, 98.6% 1.5%, 98.6% 98.5%, 1.4% 98.5%)";

export function CinematicHero() {
  const rootRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const camera = useSpring(scrollYProgress, {
    stiffness: 86,
    damping: 24,
    mass: 0.42,
  });

  const atmosphereScale = useTransform(camera, [0, 1], [1.015, 1.16]);
  const atmosphereOpacity = useTransform(camera, [0, 0.58, 0.9], [1, 0.88, 0.18]);
  const railProgress = useTransform(camera, [0, 0.24], [0, 1]);
  const interceptProgress = useTransform(camera, [0.08, 0.34], [0, 1]);
  const copyOpacity = useTransform(camera, [0, 0.28, 0.43], [1, 1, 0]);
  const copyY = useTransform(camera, [0, 0.43], [0, -76]);
  const incidentOpacity = useTransform(camera, [0.16, 0.25, 0.42, 0.5], [0, 1, 1, 0]);
  const incidentY = useTransform(camera, [0.16, 0.42], [18, -10]);
  const productOpacity = useTransform(camera, [0.38, 0.48, 1], [0, 1, 1]);
  const productClip = useTransform(camera, [0.38, 0.79], [CLOSED_APERTURE, OPEN_APERTURE]);
  const productScale = useTransform(camera, [0.38, 1], [0.9, 1.035]);
  const productY = useTransform(camera, [0.38, 1], [120, -18]);
  const productTelemetryOpacity = useTransform(camera, [0.7, 0.86], [0, 1]);
  const scrollCueOpacity = useTransform(camera, [0, 0.12, 0.24], [1, 1, 0]);

  return (
    <section id="top" ref={rootRef} className={styles.cinemaHero}>
      <div className={styles.cinemaHeroSticky}>
        <motion.div
          className={styles.cinemaAtmosphere}
          style={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: atmosphereOpacity, scale: atmosphereScale }}
          aria-hidden="true"
        >
          <Image
            src="/cinema/controlled-flight-night.png"
            alt=""
            fill
            priority
            sizes="(max-width: 767px) 1935px, 100vw"
            className={styles.cinemaAtmosphereImage}
          />
          <div className={styles.cinemaAtmosphereGrade} />
        </motion.div>

        <svg
          className={styles.cinemaFlightPaths}
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            className={styles.cinemaRailPath}
            d="M -40 665 L 800 452"
            style={reduceMotion ? { pathLength: 1 } : { pathLength: railProgress }}
          />
          <motion.path
            className={styles.cinemaRailPath}
            d="M 1640 665 L 800 452"
            style={reduceMotion ? { pathLength: 1 } : { pathLength: railProgress }}
          />
          <motion.path
            className={styles.cinemaInterceptPath}
            d="M 690 -40 C 720 130 906 220 822 398"
            style={reduceMotion ? { pathLength: 1 } : { pathLength: interceptProgress }}
          />
          <motion.circle
            className={styles.cinemaConflictPoint}
            cx="818"
            cy="406"
            r="5"
            style={reduceMotion ? { opacity: 1 } : { opacity: incidentOpacity }}
          />
        </svg>

        <motion.div
          className={styles.cinemaIncident}
          style={reduceMotion ? { opacity: 1, y: 0 } : { opacity: incidentOpacity, y: incidentY }}
        >
          <span>PATH CONFLICT</span>
          <strong>Route 03 moved to holding</strong>
        </motion.div>

        <motion.div
          className={styles.cinemaHeroCopy}
          style={reduceMotion ? { opacity: 1, y: 0 } : { opacity: copyOpacity, y: copyY }}
        >
          <p className={styles.cinemaEyebrow}>VECTANT CONTROL PLANE</p>
          <h1>
            <span>Agents move.</span>
            <span>Authority stays bounded.</span>
          </h1>
          <p className={styles.cinemaHeroDek}>
            Parallel coding agents get live runtime state, scoped authority, and proof your team can replay.
          </p>
          <a href={PILOT_MAILTO} className={styles.cinemaPrimaryAction}>
            Request a proof pilot
            <ArrowUpRight size={16} weight="bold" />
          </a>
        </motion.div>

        <motion.figure
          className={styles.cinemaProductReveal}
          style={
            reduceMotion
              ? { clipPath: OPEN_APERTURE, opacity: 1, scale: 1, y: 0 }
              : {
                  clipPath: productClip,
                  opacity: productOpacity,
                  scale: productScale,
                  y: productY,
                }
          }
        >
          <div className={styles.cinemaProductWindow}>
            <Image
              src="/product-proof/codesite-full-workflow-ui.png"
              alt="Vectant CodeSite showing a live authority map, landing queue, and collision forecast"
              fill
              sizes="(max-width: 767px) 980px, (min-width: 1600px) 1600px, 100vw"
              className={styles.cinemaProductImage}
            />
            <div className={styles.cinemaProductGrade} aria-hidden="true" />
          </div>
          <motion.figcaption
            className={styles.cinemaProductTelemetry}
            style={reduceMotion ? { opacity: 1 } : { opacity: productTelemetryOpacity }}
          >
            <span>RUN 0713</span>
            <span>SCOPE ATTACHED</span>
            <span>3 AGENTS ACTIVE</span>
            <strong>AUTHORITY IN FORCE</strong>
          </motion.figcaption>
        </motion.figure>

        <motion.div
          className={styles.cinemaScrollCue}
          style={reduceMotion ? { opacity: 1 } : { opacity: scrollCueOpacity }}
          aria-hidden="true"
        >
          <span>Follow the run</span>
          <ArrowDown size={14} />
        </motion.div>
      </div>
    </section>
  );
}
