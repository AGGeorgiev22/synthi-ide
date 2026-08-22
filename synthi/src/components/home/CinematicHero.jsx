"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "@phosphor-icons/react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import styles from "@/components/home/CinematicHero.module.css";

const BOUNDARY_LEFT = "M 800 396 L 82 940";
const BOUNDARY_RIGHT = "M 800 396 L 1518 940";

const EXECUTION_STEPS = [
  ["AGENT_03", "requests: repo.write"],
  ["POLICY", "evaluates scope"],
  ["ALLOW", "/services/auth/*"],
  ["EXECUTION", "isolated"],
  ["PROOF", "replayable"],
];

function KineticCharacters({ children, className, delay, reduceMotion }) {
  return (
    <span className={className} aria-label={children}>
      {Array.from(children).map((character, index) => (
        <span className={styles.cinemaCharacterMask} key={`${character}-${index}`} aria-hidden="true">
          <motion.span
            className={styles.cinemaCharacter}
            initial={reduceMotion ? false : { opacity: 0, x: 18, scaleX: 0.76 }}
            animate={{ opacity: 1, x: 0, scaleX: 1 }}
            transition={{
              delay: reduceMotion ? 0 : delay + index * 0.018,
              duration: reduceMotion ? 0 : 0.34,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {character === " " ? "\u00a0" : character}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

const GuardedActionPanel = memo(function GuardedActionPanel({ onClose, reduceMotion }) {
  return (
    <motion.aside
      className={styles.cinemaExecution}
      aria-label="Guarded execution result"
      initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.cinemaExecutionCore}>
        <header className={styles.cinemaExecutionHeader}>
          <span>Controlled execution</span>
          <button type="button" onClick={onClose} aria-label="Close controlled execution">
            <X size={14} weight="bold" aria-hidden="true" />
          </button>
        </header>
        <div className={styles.cinemaExecutionSteps}>
          {EXECUTION_STEPS.map(([label, value], index) => (
            <motion.div
              key={label}
              className={styles.cinemaExecutionStep}
              initial={reduceMotion ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: reduceMotion ? 0 : 0.16 + index * 0.26,
                duration: reduceMotion ? 0 : 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <strong>{label}</strong>
              <span>{value}</span>
            </motion.div>
          ))}
        </div>
        <motion.div
          className={styles.cinemaDeniedResult}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : 1.58, duration: reduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>DELETE /production/users/*</span>
          <strong>Denied - outside scope</strong>
        </motion.div>
      </div>
    </motion.aside>
  );
});

export const CinematicHero = memo(function CinematicHero() {
  const rootRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [isLocked, setIsLocked] = useState(reduceMotion);
  const [runId, setRunId] = useState(0);
  const [isActionHovered, setIsActionHovered] = useState(false);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end end"] });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const boundaryPresenceRaw = useMotionValue(0);
  const boundaryLabelX = useMotionValue(0);
  const boundaryLabelY = useMotionValue(0);

  const atmosphereX = useSpring(useTransform(pointerX, [-0.5, 0.5], [11, -11]), { stiffness: 75, damping: 24 });
  const atmosphereY = useSpring(useTransform(pointerY, [-0.5, 0.5], [8, -8]), { stiffness: 75, damping: 24 });
  const orbitX = useSpring(useTransform(pointerX, [-0.5, 0.5], [5, -5]), { stiffness: 72, damping: 26 });
  const orbitY = useSpring(useTransform(pointerY, [-0.5, 0.5], [3, -3]), { stiffness: 72, damping: 26 });
  const copyX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-2, 2]), { stiffness: 82, damping: 28 });
  const boundaryPresence = useSpring(boundaryPresenceRaw, { stiffness: 170, damping: 26 });

  const cameraScale = useTransform(scrollYProgress, [0, 0.58, 1], [1, 1.035, 1.22]);
  const copyY = useTransform(scrollYProgress, [0, 0.56, 0.78], [0, 0, -42]);
  const copyScale = useTransform(scrollYProgress, [0, 0.56, 0.78], [1, 1, 0.92]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6, 0.79], [1, 1, 0]);
  const boundaryScale = useTransform(scrollYProgress, [0.58, 1], [1, 0.32]);
  const boundaryOpacity = useTransform(scrollYProgress, [0.58, 1], [1, 0.48]);

  useEffect(() => {
    if (reduceMotion) {
      setIsLocked(true);
      return undefined;
    }

    const lockTimer = window.setTimeout(() => setIsLocked(true), 2920);
    return () => window.clearTimeout(lockTimer);
  }, [reduceMotion]);

  const setBoundaryState = useCallback((event) => {
    if (reduceMotion || !rootRef.current || !window.matchMedia("(pointer: fine)").matches) return;

    const rect = rootRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    pointerX.set(x - 0.5);
    pointerY.set(y - 0.5);

    const nearLeft = Math.abs(x - (0.5 - (y - 0.44) * 0.88));
    const nearRight = Math.abs(x - (0.5 + (y - 0.44) * 0.88));
    const withinBoundaryHeight = y > 0.42 && y < 1;
    const isNearBoundary = withinBoundaryHeight && Math.min(nearLeft, nearRight) < 0.035;

    boundaryPresenceRaw.set(isNearBoundary ? 1 : 0);
    if (isNearBoundary) {
      boundaryLabelX.set(event.clientX - rect.left + (x > 0.72 ? -182 : 18));
      boundaryLabelY.set(event.clientY - rect.top - 20);
    }
  }, [boundaryLabelX, boundaryLabelY, boundaryPresenceRaw, pointerX, pointerY, reduceMotion]);

  const clearPointerState = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
    boundaryPresenceRaw.set(0);
  }, [boundaryPresenceRaw, pointerX, pointerY]);

  const runGuardedAction = useCallback(() => setRunId((current) => current + 1), []);

  return (
    <section id="top" ref={rootRef} className={styles.cinemaHero} data-film-act="perimeter">
      <div
        className={styles.cinemaHeroSticky}
        data-action-active={isActionHovered || runId > 0 ? "true" : undefined}
        onPointerMove={setBoundaryState}
        onPointerLeave={clearPointerState}
      >
        <motion.div
          className={styles.cinemaAtmosphere}
          aria-hidden="true"
          style={reduceMotion ? undefined : { x: atmosphereX, y: atmosphereY, scale: cameraScale }}
          initial={reduceMotion ? false : { clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          transition={{ duration: reduceMotion ? 0 : 1.05, delay: reduceMotion ? 0 : 1.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/cinema/controlled-flight-night-6k.png"
            alt=""
            fill
            priority
            quality={90}
            sizes="(max-aspect-ratio: 12/5) 260vh, 110vw"
            className={styles.cinemaAtmosphereImage}
          />
        </motion.div>

        <motion.div
          className={styles.cinemaCloudScan}
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0, y: "-8%" }}
          animate={{ opacity: [0, 1, 0], y: "108%" }}
          transition={{ duration: reduceMotion ? 0 : 1.12, delay: reduceMotion ? 0 : 1.06, ease: [0.55, 0, 0.45, 1] }}
        />

        <motion.svg
          className={styles.cinemaOrbit}
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={reduceMotion ? undefined : { x: orbitX, y: orbitY }}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={
            reduceMotion
              ? { opacity: 0.56, scale: 1, rotate: 0 }
              : isLocked
                ? { opacity: 0.56, scale: 1, rotate: 360 }
                : { opacity: 0.56, scale: 1, rotate: 0 }
          }
          transition={
            isLocked && !reduceMotion
              ? { opacity: { duration: 0.28 }, scale: { duration: 0.6 }, rotate: { duration: 150, ease: "linear", repeat: Infinity } }
              : { duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 1.48, ease: [0.16, 1, 0.3, 1] }
          }
        >
          <ellipse className={styles.cinemaOrbitLine} cx="792" cy="452" rx="500" ry="248" />
          <ellipse className={styles.cinemaOrbitInner} cx="792" cy="452" rx="488" ry="238" />
        </motion.svg>

        <motion.svg
          className={styles.cinemaBoundary}
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={reduceMotion ? undefined : { scaleX: boundaryScale, opacity: boundaryOpacity, transformOrigin: "50% 50%" }}
        >
          {[BOUNDARY_LEFT, BOUNDARY_RIGHT].map((path) => (
            <g key={path}>
              <motion.path
                className={styles.cinemaBoundaryLine}
                d={path}
                initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.86, delay: reduceMotion ? 0 : 0.68, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.path
                className={styles.cinemaBoundaryTravel}
                d={path}
                initial={reduceMotion ? false : { pathLength: 0, pathOffset: 1, opacity: 0 }}
                animate={{ pathLength: 1, pathOffset: 0, opacity: [0, 1, 0] }}
                transition={{ duration: reduceMotion ? 0 : 0.96, delay: reduceMotion ? 0 : 0.77, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.path
                className={styles.cinemaBoundaryIdlePulse}
                d={path}
                initial={false}
                animate={reduceMotion ? { opacity: 0 } : { pathOffset: [1, 0], opacity: [0, 0, 0.72, 0] }}
                transition={{ duration: 1.2, delay: 8.5, repeat: Infinity, repeatDelay: 12, ease: [0.4, 0, 0.2, 1] }}
              />
            </g>
          ))}
          <motion.circle
            className={styles.cinemaVanishingPoint}
            cx="800"
            cy="396"
            r="3"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.2 }}
            animate={{ opacity: isLocked ? [0.5, 1, 0.6] : 0.5, scale: isLocked ? [1, 2.6, 1] : 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, delay: isLocked ? 0 : 1.46, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.svg>

        <motion.div
          className={styles.cinemaBoundaryLabel}
          aria-hidden="true"
          style={{ opacity: boundaryPresence, x: boundaryLabelX, y: boundaryLabelY }}
        >
          Permission boundary <span>{"// active"}</span>
        </motion.div>

        {runId > 0 && (
          <motion.div
            key={`unauthorized-${runId}`}
            className={styles.cinemaUnauthorizedPacket}
            aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0, x: 0, y: 0, scale: 0.94 }}
            animate={
              reduceMotion
                ? { opacity: 1, x: -180, y: 120, scale: 1 }
                : { opacity: [0, 1, 1, 0], x: [0, -244, -220, -220], y: [0, 178, 142, 142], scale: [0.94, 1, 0.98, 0.98] }
            }
            transition={{ duration: reduceMotion ? 0 : 1.22, delay: reduceMotion ? 0 : 1.42, times: [0, 0.34, 0.53, 1], ease: [0.16, 1, 0.3, 1] }}
          >
            <span>DELETE /production/users/*</span>
            <strong>Denied</strong>
          </motion.div>
        )}

        <motion.div
          className={styles.cinemaBrandMark}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image src="/Vectant-logo-white.svg" alt="Vectant" width={94} height={22} priority />
        </motion.div>

        <motion.div
          className={styles.cinemaHeroCopy}
          style={reduceMotion ? undefined : { x: copyX, y: copyY, scale: copyScale, opacity: copyOpacity }}
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.14, delay: reduceMotion ? 0 : 1.68, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className={styles.cinemaEyebrow}>Runtime control plane</p>
            <h1>
              <KineticCharacters className={styles.cinemaHeadlineLine} delay={1.82} reduceMotion={reduceMotion}>
                AGENTS MOVE
              </KineticCharacters>
              <span className={styles.cinemaHeadlineLine}>
                <KineticCharacters className={styles.cinemaHeadlineLead} delay={2.22} reduceMotion={reduceMotion}>
                  {"AUTHORITY STAYS "}
                </KineticCharacters>
                <span className={`${styles.cinemaBoundWord} ${isLocked ? styles.cinemaBoundWordLocked : ""}`}>
                  <KineticCharacters className={styles.cinemaHeadlineBound} delay={2.54} reduceMotion={reduceMotion}>
                    BOUND.
                  </KineticCharacters>
                </span>
              </span>
            </h1>
            <div className={styles.cinemaHeroFooter}>
              <p>
                Vectant is the cloud runtime for parallel coding agents, with scoped permissions,
              live environment state, and replayable proof.
              </p>
              <div className={styles.cinemaActions}>
                <button
                  type="button"
                  className={styles.cinemaPrimaryAction}
                  onClick={runGuardedAction}
                  onPointerEnter={() => setIsActionHovered(true)}
                  onPointerLeave={() => setIsActionHovered(false)}
                  aria-expanded={runId > 0}
                >
                  Run a guarded action
                  <span aria-hidden="true"><ArrowUpRight size={15} weight="bold" /></span>
                </button>
                <a href="#pilot" className={styles.cinemaSecondaryAction}>
                  Book a proof pilot
                  <span aria-hidden="true"><ArrowUpRight size={15} weight="bold" /></span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {runId > 0 && <GuardedActionPanel key={runId} onClose={() => setRunId(0)} reduceMotion={reduceMotion} />}
      </div>
    </section>
  );
});
