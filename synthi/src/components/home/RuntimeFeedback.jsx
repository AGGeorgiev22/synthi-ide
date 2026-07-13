"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ImageBroken, SpinnerGap } from "@phosphor-icons/react";

import styles from "@/components/home/VectantHome.module.css";

const EVIDENCE = [
  {
    key: "clearance",
    tab: "Clearance",
    title: "See the authority boundary before the edit.",
    copy: "Leases, protected paths, collision forecast, proof requirements, and the landing queue share one review surface.",
    src: "/product-proof/codesite-full-workflow-ui.png",
    width: 1440,
    height: 1100,
  },
  {
    key: "provenance",
    tab: "Provenance",
    title: "Trace the decision down to the line.",
    copy: "Source changes keep their assumptions, dependencies, evidence, and reviewer context attached.",
    src: "/product-proof/codesite-line-inspector-ui-desktop.png",
    width: 1440,
    height: 1100,
  },
  {
    key: "checkride",
    tab: "Checkride",
    title: "Expand authority only after the workflow passes.",
    copy: "Plan coverage, runtime events, API calls, negative cases, and the final proof capsule decide the boundary.",
    src: "/product-proof/senior-real-codesite-workflow-proof.png",
    width: 1440,
    height: 1708,
  },
];

function EvidenceImage({ item }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={styles.evidenceError} role="status">
        <ImageBroken size={24} />
        <strong>Proof image unavailable</strong>
        <span>The evidence description remains available beside this frame.</span>
      </div>
    );
  }

  return (
    <div className={styles.evidenceImageShell}>
      {!loaded && (
        <div className={styles.evidenceLoading} role="status">
          <SpinnerGap size={20} />
          <span>Loading proof</span>
        </div>
      )}
      <Image
        src={item.src}
        alt=""
        width={item.width}
        height={item.height}
        sizes="(min-width: 1280px) 68vw, (min-width: 768px) 78vw, 100vw"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`h-full w-full object-contain object-top transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
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
    <section id="proof" className={styles.chapter}>
      <div className={styles.sectionShell}>
        <h2 className={styles.chapterTitle}>Proof should be inspectable, not impressive-looking.</h2>
        <p className={styles.chapterCopy}>Open the evidence that changed the decision. Collapse everything that did not.</p>

        <div className={styles.feedbackTabs} role="tablist" aria-label="Runtime proof views">
          {EVIDENCE.map((entry, entryIndex) => (
            <button
              key={entry.key}
              type="button"
              role="tab"
              aria-selected={entryIndex === index}
              onClick={() => setIndex(entryIndex)}
              className={`${styles.focusRing} ${entryIndex === index ? styles.feedbackTabActive : ""}`}
            >
              {entry.tab}
            </button>
          ))}
        </div>

        <div className={styles.feedbackFrame}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={item.key}
              role="tabpanel"
              initial={reduceMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
              className={styles.feedbackSlide}
            >
              <EvidenceImage item={item} />
              <div className={styles.feedbackCopy}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className={styles.feedbackControls}>
            <button type="button" onClick={() => move(-1)} aria-label="Previous proof view" className={styles.focusRing}><ArrowLeft size={16} /></button>
            <span>{index + 1} / {EVIDENCE.length}</span>
            <button type="button" onClick={() => move(1)} aria-label="Next proof view" className={styles.focusRing}><ArrowRight size={16} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
