"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ImageBroken } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import styles from "@/components/home/VectantHome.module.css";

const EVIDENCE = [
  {
    key: "checkride",
    tab: "Checkride",
    title: "The workflow passed. The proof stayed.",
    copy: "Plan coverage, denied writes, provenance, black-box replay, runtime events, and exported artifacts remain reviewable after the run.",
    src: "/product-proof/senior-real-codesite-workflow-proof.png",
    position: styles.proofImageCheckride,
  },
  {
    key: "handoff",
    tab: "Handoff",
    title: "The handoff carries its assertions.",
    copy: "Clearance, transaction state, proof bundles, quarantined writes, and commit trailers travel with the change instead of disappearing into chat.",
    src: "/product-proof/codesite-full-workflow-proof.png",
    position: styles.proofImageHandoff,
  },
  {
    key: "memory",
    tab: "Memory",
    title: "Past near-misses change the next decision.",
    copy: "Counterfactual policy deltas can influence a later route while hard safety gates remain in force and visible to the reviewer.",
    src: "/product-proof/codesite-counterfactual-memory-proof.png",
    position: styles.proofImageMemory,
  },
];

function EvidenceImage({ item }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={styles.proofCinemaError} role="status">
        <ImageBroken size={28} weight="light" />
        <strong>Evidence image unavailable</strong>
        <span>The proof description remains available below this frame.</span>
      </div>
    );
  }

  return (
    <div className={styles.proofCinemaImage}>
      {!loaded && <div className={styles.proofCinemaLoading} role="status">Loading evidence</div>}
      <Image
        src={item.src}
        alt=""
        fill
        sizes="(min-width: 1500px) 1480px, 100vw"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`${styles.proofCinemaImageAsset} ${item.position} ${loaded ? styles.proofCinemaImageLoaded : ""}`}
      />
    </div>
  );
}

export function RuntimeFeedback() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const item = EVIDENCE[index];

  const move = (direction) => {
    setIndex((current) => (current + direction + EVIDENCE.length) % EVIDENCE.length);
  };

  return (
    <section id="proof" className={styles.proofCinema}>
      <div className={styles.proofCinemaShell}>
        <div className={styles.proofCinemaIntro}>
          <h2>The proof is part of the work.</h2>
          <p>Open the evidence that changed the decision. Leave the rest collapsed.</p>
        </div>

        <div className={styles.proofCinemaTabs} role="tablist" aria-label="Runtime proof views">
          {EVIDENCE.map((entry, entryIndex) => (
            <button
              key={entry.key}
              type="button"
              role="tab"
              aria-selected={entryIndex === index}
              onClick={() => setIndex(entryIndex)}
              className={entryIndex === index ? styles.proofCinemaTabActive : undefined}
            >
              {entry.tab}
            </button>
          ))}
        </div>

        <div className={styles.proofCinemaReel}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={item.key}
              role="tabpanel"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.985, x: 28 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985, x: -24 }}
              transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
              className={styles.proofCinemaSlide}
            >
              <EvidenceImage item={item} />
              <div className={styles.proofCinemaCaption}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </motion.article>
          </AnimatePresence>

          <div className={styles.proofCinemaControls}>
            <button type="button" onClick={() => move(-1)} aria-label="Previous proof view">
              <ArrowLeft size={18} weight="bold" />
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Next proof view">
              <ArrowRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
