"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";

import styles from "@/app/not-found.module.css";

export function NotFoundBackground() {
  const backgroundRef = useRef(null);
  const traceRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !traceRef.current) return undefined;

    const context = gsap.context(() => {
      gsap.to(traceRef.current, {
        x: "18vw",
        y: "-11vh",
        rotate: -26,
        duration: 12,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, backgroundRef);

    return () => context.revert();
  }, [reduceMotion]);

  const signalMotion = reduceMotion
    ? undefined
    : {
        x: [0, 28, -14, 0],
        y: [0, -18, 12, 0],
        scale: [1, 1.06, 0.96, 1],
      };

  const echoMotion = reduceMotion
    ? undefined
    : {
        x: [0, -22, 18, 0],
        y: [0, 20, -12, 0],
        scale: [1, 0.94, 1.04, 1],
      };

  return (
    <div ref={backgroundRef} className={styles.background} aria-hidden="true">
      <motion.span
        className={styles.signal}
        animate={signalMotion}
        transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.span
        className={styles.echo}
        animate={echoMotion}
        transition={{ duration: 22, ease: "easeInOut", repeat: Infinity }}
      />
      <span ref={traceRef} className={styles.backgroundTrace} />
    </div>
  );
}
