"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { VectantMark } from "@/components/Logo";
import styles from "@/components/home/FinalApproach.module.css";
import { PILOT_MAILTO } from "@/lib/pilot";

export function FinalApproach() {
  const rootRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const camera = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    mass: 0.46,
  });

  const imageOpacity = useTransform(camera, [0, 0.3], [0.28, 1]);
  const imageScale = useTransform(camera, [0, 1], [1.01, 1.09]);
  const copyOpacity = useTransform(camera, [0.09, 0.35], [0, 1]);
  const copyY = useTransform(camera, [0.09, 0.7], [34, -14]);
  const markScale = useTransform(camera, [0.12, 0.72], [1.4, 0.82]);
  const railScale = useTransform(camera, [0.28, 0.82], [0, 1]);

  return (
    <section id="pricing" ref={rootRef} className={styles.finalApproach}>
      <div id="waitlist" className={styles.finalApproachSticky}>
        <motion.div
          className={styles.finalAtmosphere}
          style={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: imageOpacity, scale: imageScale }}
          aria-hidden="true"
        >
          <Image
            src="/cinema/controlled-flight-dawn.png"
            alt=""
            fill
            sizes="100vw"
            className={styles.finalAtmosphereImage}
          />
          <div className={styles.finalAtmosphereGrade} />
        </motion.div>

        <motion.div
          className={styles.finalMarkWrap}
          style={reduceMotion ? { opacity: 1, scale: 1, x: "-50%" } : { opacity: copyOpacity, scale: markScale, x: "-50%" }}
          aria-hidden="true"
        >
          <VectantMark gradientId="final-approach-mark" className={styles.finalMark} />
        </motion.div>

        <motion.div
          className={styles.finalCopy}
          style={reduceMotion ? { opacity: 1, y: 0 } : { opacity: copyOpacity, y: copyY }}
        >
          <p>LANDING CLEAR / PROOF SEALED</p>
          <h2>
            <span>Run one protected repository.</span>
            <span>Leave with replayable proof.</span>
          </h2>
          <div className={styles.finalCopyFooter}>
            <span>Bring the system you still will not hand to an agent. We will make its boundary, live state, and proof path visible.</span>
            <a href={PILOT_MAILTO} className={styles.finalAction}>
              Request a proof pilot
              <ArrowUpRight size={16} weight="bold" />
            </a>
          </div>
        </motion.div>

        <div className={styles.finalClearance} aria-hidden="true">
          <motion.i style={reduceMotion ? { scaleX: 1 } : { scaleX: railScale }} />
          <span>BOUNDARY CLOSED</span>
          <span>STATE RETAINED</span>
          <span>REPLAY READY</span>
          <strong>FLIGHT COMPLETE</strong>
        </div>
      </div>
    </section>
  );
}
