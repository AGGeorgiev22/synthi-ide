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

import styles from "@/components/home/GpuProofChapter.module.css";

const GATES = [
  { key: "state", label: "STATE LOCKED", x: 418, y: 650, range: [0.13, 0.24] },
  { key: "abi", label: "ABI MATCHED", x: 615, y: 554, range: [0.22, 0.33] },
  { key: "output", label: "OUTPUT VERIFIED", x: 800, y: 460, range: [0.31, 0.42] },
  { key: "ledger", label: "LEDGER SEALED", x: 995, y: 558, range: [0.4, 0.51] },
];

export function GpuProofChapter() {
  const rootRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const camera = useSpring(scrollYProgress, {
    stiffness: 84,
    damping: 24,
    mass: 0.44,
  });

  const currentProgress = useTransform(camera, [0.08, 0.48], [0, 1]);
  const coilOpacity = useTransform(camera, [0, 0.5, 0.69], [1, 1, 0]);
  const coilScale = useTransform(camera, [0, 0.54], [0.92, 1.02]);
  const copyOpacity = useTransform(camera, [0, 0.36, 0.61], [1, 1, 0]);
  const copyY = useTransform(camera, [0, 0.61], [0, -56]);
  const outputOpacity = useTransform(camera, [0.5, 0.64], [0, 1]);
  const outputScale = useTransform(camera, [0.48, 1], [0.86, 1.025]);
  const outputY = useTransform(camera, [0.48, 1], [90, -12]);
  const afterClip = useTransform(camera, [0.64, 0.9], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const verdictOpacity = useTransform(camera, [0.68, 0.82], [0, 1]);
  const heatOpacity = useTransform(camera, [0.04, 0.46, 0.76], [0.18, 1, 0.32]);
  const stateGateOpacity = useTransform(camera, GATES[0].range, [0.16, 1]);
  const abiGateOpacity = useTransform(camera, GATES[1].range, [0.16, 1]);
  const outputGateOpacity = useTransform(camera, GATES[2].range, [0.16, 1]);
  const ledgerGateOpacity = useTransform(camera, GATES[3].range, [0.16, 1]);
  const gateOpacities = [stateGateOpacity, abiGateOpacity, outputGateOpacity, ledgerGateOpacity];

  return (
    <section id="gpu-hmr" ref={rootRef} className={styles.gpuCinema}>
      <div className={styles.gpuStage}>
        <motion.div
          className={styles.gpuHeat}
          style={reduceMotion ? undefined : { opacity: heatOpacity }}
          aria-hidden="true"
        />

        <motion.div
          className={styles.gpuCopy}
          style={reduceMotion ? undefined : { opacity: copyOpacity, y: copyY }}
        >
          <p>LIVE ENGINE / BLACK START</p>
          <h2>Change the kernel. Keep the moment.</h2>
          <span>A compiled patch moves only when state, ABI, output, and the evidence ledger agree.</span>
        </motion.div>

        <motion.div
          className={styles.gpuCoil}
          style={reduceMotion ? undefined : { opacity: coilOpacity, scale: coilScale }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
            <path className={styles.gpuCoilGhost} d="M 120 810 C 290 760 468 640 800 458 C 1132 640 1310 760 1480 810" />
            <motion.path
              className={styles.gpuCoilCurrent}
              d="M 120 810 C 290 760 468 640 800 458 C 1132 640 1310 760 1480 810"
              style={reduceMotion ? undefined : { pathLength: currentProgress }}
            />
            <path className={styles.gpuCoilReturn} d="M 800 458 L 800 86" />
            {GATES.map((gate, index) => (
                <motion.g key={gate.key} style={reduceMotion ? undefined : { opacity: gateOpacities[index] }}>
                  <circle className={styles.gpuGateHalo} cx={gate.x} cy={gate.y} r="18" />
                  <circle className={styles.gpuGateCore} cx={gate.x} cy={gate.y} r="4" />
                  <line className={styles.gpuGateTick} x1={gate.x} y1={gate.y - 28} x2={gate.x} y2={gate.y - 54} />
                  <text className={styles.gpuGateLabel} x={gate.x} y={gate.y - 67} textAnchor="middle">{gate.label}</text>
                </motion.g>
              ))}
          </svg>
          <div className={styles.gpuCurrentReadout}>
            <span>VERIFIED CURRENT</span>
            <strong>STATE RETAINED</strong>
          </div>
        </motion.div>

        <motion.figure
          className={styles.gpuOutput}
          style={
            reduceMotion
              ? undefined
              : { opacity: outputOpacity, scale: outputScale, y: outputY }
          }
        >
          <Image
            src="/product-proof/gpu-hmr-before.png"
            alt="GPU render immediately before the compiled hot reload"
            fill
            sizes="100vw"
            className={styles.gpuOutputImage}
          />
          <motion.div
            className={styles.gpuOutputAfter}
            style={reduceMotion ? undefined : { clipPath: afterClip }}
          >
            <Image
              src="/product-proof/gpu-hmr-after.png"
              alt="Verified GPU render after the compiled hot reload retained live state"
              fill
              sizes="100vw"
              className={styles.gpuOutputImage}
            />
          </motion.div>
          <div className={styles.gpuOutputTelemetry}>
            <span>FRAME 008219</span>
            <span>HMR APPLIED</span>
            <span>STATE DELTA 0</span>
            <strong>OUTPUT VERIFIED</strong>
          </div>
          <motion.figcaption
            className={styles.gpuVerdict}
            style={reduceMotion ? undefined : { opacity: verdictOpacity }}
          >
            <span>NO RESET</span>
            <strong>Live state stayed attached.</strong>
          </motion.figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
