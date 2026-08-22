"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";

import styles from "@/components/home/CinematicHero.module.css";

const intro = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.075,
    },
  },
};

const reveal = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.82, ease: [0.16, 1, 0.3, 1] },
  },
};

export function CinematicHeroIntro() {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : "hidden";

  return (
    <motion.div variants={intro} initial={initial} animate="visible">
      <motion.p variants={reveal} className={styles.cinemaEyebrow}>
        Trust is everything
      </motion.p>

      <motion.h1 variants={reveal}>
        <span>Agents move.</span>
        <span>Authority stays bound.</span>
      </motion.h1>

      <motion.p variants={reveal} className={styles.cinemaLede}>
        Vectant is the cloud runtime for parallel coding agents, with scoped permissions, live environment state, and replayable proof.
      </motion.p>

      <motion.div variants={reveal} className={styles.cinemaActions}>
        <motion.a
          href="#guarded-run"
          className={styles.cinemaPrimaryAction}
          whileHover={reduceMotion ? undefined : { y: -2, scale: 1.012 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
        >
          Watch a guarded run
          <span aria-hidden="true"><ArrowUpRight size={15} weight="bold" /></span>
        </motion.a>
        <motion.a
          href="#pilot"
          className={styles.cinemaSecondaryAction}
          whileHover={reduceMotion ? undefined : { y: -2 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
        >
          Book a proof pilot
          <span aria-hidden="true"><ArrowUpRight size={15} weight="bold" /></span>
        </motion.a>
      </motion.div>
    </motion.div>
  );
}
