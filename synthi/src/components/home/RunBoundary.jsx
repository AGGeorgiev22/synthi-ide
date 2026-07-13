"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import styles from "@/components/home/RunBoundary.module.css";

const CLOSED_FRAME = "inset(17% 31% 17% 31%)";
const OPEN_FRAME = "inset(0% 0% 0% 0%)";

export function RunBoundary() {
  const rootRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const camera = useSpring(scrollYProgress, {
    stiffness: 92,
    damping: 25,
    mass: 0.4,
  });

  const frameClip = useTransform(camera, [0.04, 0.58], [CLOSED_FRAME, OPEN_FRAME]);
  const frameScale = useTransform(camera, [0, 1], [1.08, 1.015]);
  const frameY = useTransform(camera, [0, 1], [34, -18]);
  const copyOpacity = useTransform(camera, [0, 0.14, 0.73, 0.9], [0.25, 1, 1, 0]);
  const copyY = useTransform(camera, [0, 0.75], [34, -28]);
  const telemetryOpacity = useTransform(camera, [0.12, 0.32], [0, 1]);
  const progressX = useTransform(camera, [0.08, 0.88], [0.04, 1]);

  return (
    <section id="runtime" ref={rootRef} className={styles.boundary}>
      <div className={styles.boundarySticky}>
        <motion.figure
          className={styles.boundaryFrame}
          style={
            reduceMotion
              ? { clipPath: OPEN_FRAME, scale: 1, y: 0 }
              : { clipPath: frameClip, scale: frameScale, y: frameY }
          }
        >
          <Image
            src="/product-proof/browser-workflow-observe-ui.png"
            alt="Vectant workflow controls showing runtime, observation, trace, contract, and replay attached to one run"
            fill
            sizes="(max-width: 767px) 980px, 100vw"
            className={styles.boundaryImage}
          />
          <div className={styles.boundaryGrade} aria-hidden="true" />
        </motion.figure>

        <motion.div
          className={styles.boundaryTelemetry}
          style={reduceMotion ? { opacity: 1 } : { opacity: telemetryOpacity }}
          aria-label="Run state"
        >
          <div><span>RUN</span><strong>07 / 13</strong></div>
          <div><span>SCOPE</span><strong>ATTACHED</strong></div>
          <div><span>RUNTIME</span><strong>LIVE</strong></div>
          <div><span>REPLAY</span><strong>RECORDING</strong></div>
          <motion.i style={reduceMotion ? { scaleX: 1 } : { scaleX: progressX }} aria-hidden="true" />
        </motion.div>

        <motion.div
          className={styles.boundaryCopy}
          style={reduceMotion ? { opacity: 1, y: 0 } : { opacity: copyOpacity, y: copyY }}
        >
          <p>FLIGHT PLAN ACCEPTED</p>
          <h2>Every run gets a boundary.</h2>
          <div className={styles.boundaryCopyFooter}>
            <span>Authority, runtime state, artifacts, and review stay attached from the first write.</span>
            <strong>01 / LAUNCH</strong>
          </div>
        </motion.div>

        <motion.aside
          className={styles.boundaryRail}
          style={reduceMotion ? { opacity: 1 } : { opacity: telemetryOpacity }}
          aria-hidden="true"
        >
          <span>AGENT</span>
          <span>WORKSPACE</span>
          <span>MUTATION</span>
          <span>EVIDENCE</span>
        </motion.aside>
      </div>
    </section>
  );
}
