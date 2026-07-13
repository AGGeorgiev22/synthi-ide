"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { VectantMark } from "@/components/Logo";
import styles from "@/components/home/RuntimeFeedback.module.css";

const EVIDENCE = [
  {
    key: "checkride",
    label: "CHECKRIDE",
    title: "The workflow passed. The proof stayed.",
    copy: "Plan coverage, denied writes, provenance, black-box replay, runtime events, and exported artifacts remain reviewable after the run.",
    src: "/product-proof/senior-real-codesite-workflow-proof.png",
    alt: "Vectant checkride showing a passed workflow and its retained proof bundle",
    position: styles.proofImageCheckride,
  },
  {
    key: "handoff",
    label: "HANDOFF",
    title: "The handoff carries its assertions.",
    copy: "Clearance, transaction state, proof bundles, quarantined writes, and commit trailers travel with the change.",
    src: "/product-proof/codesite-full-workflow-proof.png",
    alt: "Vectant handoff showing clearance, transaction state, and proof attached to a change",
    position: styles.proofImageHandoff,
  },
  {
    key: "memory",
    label: "MEMORY",
    title: "The next run remembers the near-miss.",
    copy: "Counterfactual policy deltas can influence a later route while hard safety gates remain in force and visible to the reviewer.",
    src: "/product-proof/codesite-counterfactual-memory-proof.png",
    alt: "Vectant memory proof showing a prior near-miss influencing a later route",
    position: styles.proofImageMemory,
  },
];

export function RuntimeFeedback() {
  const rootRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sealActive, setSealActive] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const reelOpacity = useTransform(scrollYProgress, [0.76, 0.84], [1, 0]);
  const reelScale = useTransform(scrollYProgress, [0.76, 0.84], [1, 0.985]);
  const sealOpacity = useTransform(scrollYProgress, [0.84, 0.92], [0, 1]);
  const sealScale = useTransform(scrollYProgress, [0.84, 0.92], [1.06, 1]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reduceMotion) return;
    const nextIndex = progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2;
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    setSealActive((current) => {
      const next = progress >= 0.82;
      return current === next ? current : next;
    });
  });

  return (
    <section id="proof" ref={rootRef} className={styles.proofCinema}>
      <div className={styles.proofStage}>
        <motion.header
          className={styles.proofHeader}
          style={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: reelOpacity, scale: reelScale }}
        >
          <div>
            <p>INCIDENT RECORDER / 07 13</p>
            <h2>The proof lands with the work.</h2>
          </div>
          <span>Scroll to replay the evidence</span>
        </motion.header>

        <motion.div
          className={styles.proofAccordion}
          style={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: reelOpacity, scale: reelScale }}
          aria-hidden={!reduceMotion && sealActive}
          inert={!reduceMotion && sealActive ? true : undefined}
        >
          {EVIDENCE.map((item, index) => {
            const active = index === activeIndex;
            return (
              <article
                key={item.key}
                className={`${styles.proofPanel} ${active ? styles.proofPanelActive : ""}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes={active ? "(min-width: 768px) 78vw, 100vw" : "20vw"}
                  className={`${styles.proofPanelImage} ${item.position}`}
                />
                <div className={styles.proofPanelGrade} aria-hidden="true" />
                <button
                  type="button"
                  aria-expanded={active}
                  aria-controls={`proof-panel-${item.key}`}
                  onClick={() => setActiveIndex(index)}
                  className={styles.proofPanelButton}
                >
                  <b>0{index + 1}</b>
                  <span>{item.label}</span>
                </button>
                <div id={`proof-panel-${item.key}`} className={styles.proofPanelCaption}>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            );
          })}
        </motion.div>

        <motion.div
          className={styles.proofSeal}
          style={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: sealOpacity, scale: sealScale }}
          aria-hidden={!reduceMotion && !sealActive}
          role="status"
        >
          <VectantMark gradientId="proof-seal-mark" className={styles.proofSealMark} />
          <p>PROOF BUNDLE SEALED</p>
          <strong>Replay ready</strong>
          <span>Plan / authority / runtime / artifacts</span>
        </motion.div>
      </div>
    </section>
  );
}
