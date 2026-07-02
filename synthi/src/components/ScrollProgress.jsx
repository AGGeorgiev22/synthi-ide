"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Thin brand-gradient progress bar pinned to the very top of the viewport. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: reduce ? 1000 : 180,
    damping: reduce ? 100 : 28,
    mass: 0.35,
  });

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent" aria-hidden="true">
      <motion.div className="scroll-progress h-full w-full origin-left" style={{ scaleX }} />
    </div>
  );
}
