"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import styles from "@/components/home/VectantHome.module.css";

export function GpuProofChapter() {
  const rootRef = useRef(null);
  const [position, setPosition] = useState(54);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start end", "end start"],
  });
  const camera = useSpring(scrollYProgress, {
    stiffness: 88,
    damping: 26,
    mass: 0.45,
  });
  const posterY = useTransform(camera, [0, 1], [90, -72]);
  const posterScale = useTransform(camera, [0, 0.5, 1], [0.86, 1, 1.035]);
  const copyY = useTransform(camera, [0, 1], [46, -34]);

  return (
    <section id="gpu-hmr" ref={rootRef} className={styles.gpuCinema}>
      <div className={styles.gpuCinemaShell}>
        <motion.div
          className={styles.gpuCinemaCopy}
          style={reduceMotion ? undefined : { y: copyY }}
        >
          <h2>Change the kernel. Keep the moment.</h2>
          <p>
            A compiled patch moves only when state, ABI, output, and the evidence ledger agree.
          </p>
        </motion.div>

        <motion.figure
          className={styles.gpuDiffPoster}
          style={reduceMotion ? undefined : { y: posterY, scale: posterScale }}
        >
          <Image
            src="/product-proof/gpu-hmr-diff.png"
            alt="The visual output difference created by a proof-gated GPU hot reload"
            fill
            sizes="(min-width: 1100px) 62vw, 100vw"
            className="object-cover"
          />
        </motion.figure>

        <div className={styles.gpuProofSentence}>
          <span>Live state stays attached.</span>
          <span>The output still has to prove itself.</span>
        </div>

        <div className={styles.gpuCompareCinema} style={{ "--compare-position": `${position}%` }}>
          <div className={styles.gpuCompareLabels} aria-hidden="true">
            <span>Before</span>
            <span>After</span>
          </div>
          <div className={styles.gpuCompareStage}>
            <Image
              src="/product-proof/gpu-hmr-before.png"
              alt="GPU render before the compiled hot reload"
              fill
              sizes="(min-width: 1100px) 78vw, 100vw"
              className="object-cover"
            />
            <div className={styles.gpuCompareAfter}>
              <Image
                src="/product-proof/gpu-hmr-after.png"
                alt="GPU render after the compiled hot reload"
                fill
                sizes="(min-width: 1100px) 78vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className={styles.gpuCompareDivider} aria-hidden="true"><span /></div>
            <input
              type="range"
              min="0"
              max="100"
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
              aria-label="Compare GPU output before and after hot reload"
              className={styles.gpuCompareRange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
