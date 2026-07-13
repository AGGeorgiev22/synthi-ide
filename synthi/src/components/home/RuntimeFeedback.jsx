"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { VectantMark } from "@/components/Logo";
import styles from "@/components/home/RuntimeFeedback.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EVIDENCE = [
  {
    key: "checkride",
    label: "Checkride",
    title: "The workflow passed. The proof stayed.",
    copy: "Plan coverage, denied writes, provenance, replay, runtime events, and exported artifacts remain reviewable after the run.",
    src: "/product-proof/senior-real-codesite-workflow-proof.png",
    alt: "Vectant checkride with a passed workflow and retained proof bundle",
    position: styles.proofImageCheckride,
  },
  {
    key: "handoff",
    label: "Handoff",
    title: "The handoff carries its assertions.",
    copy: "Clearance, transaction state, proof bundles, quarantined writes, and commit trailers travel with the change.",
    src: "/product-proof/codesite-full-workflow-proof.png",
    alt: "Vectant handoff with clearance, transaction state, and proof attached",
    position: styles.proofImageHandoff,
  },
  {
    key: "memory",
    label: "Memory",
    title: "The next run remembers the near-miss.",
    copy: "Counterfactual policy can influence a later route while hard safety gates remain visible and in force.",
    src: "/product-proof/codesite-counterfactual-memory-proof.png",
    alt: "Vectant memory proof with a prior near-miss influencing a later route",
    position: styles.proofImageMemory,
  },
];

const LEDGER = ["Plan", "Denied writes", "Provenance", "Black Box", "Runtime events", "Artifacts"];

export function RuntimeFeedback() {
  const rootRef = useRef(null);
  const headerRef = useRef(null);
  const trackRef = useRef(null);
  const panelRefs = useRef([]);
  const sealRef = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = panelRefs.current.filter(Boolean);
        const centerPanel = (index) => {
          const panel = panels[index];
          return window.innerWidth / 2 - (panel.offsetLeft + panel.offsetWidth / 2);
        };

        gsap.set(headerRef.current, { autoAlpha: 1, y: 0 });
        gsap.set(trackRef.current, { x: () => centerPanel(0) });
        gsap.set(panels, { opacity: 0.34, scale: 0.96 });
        gsap.set(panels[0], { opacity: 1, scale: 1 });
        gsap.set(sealRef.current, { autoAlpha: 0, scale: 1.08 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .addLabel("checkride", 0)
          .to(headerRef.current, { autoAlpha: 0, y: -28, duration: 0.18, ease: "power2.in" }, 0.42)
          .addLabel("handoff", 0.62)
          .to(trackRef.current, { x: () => centerPanel(1), duration: 0.46, ease: "power3.inOut" }, "handoff")
          .to(panels[0], { opacity: 0.34, scale: 0.96, duration: 0.32 }, "handoff")
          .to(panels[1], { opacity: 1, scale: 1, duration: 0.32 }, "handoff+=0.12")
          .addLabel("memory", 1.18)
          .to(trackRef.current, { x: () => centerPanel(2), duration: 0.46, ease: "power3.inOut" }, "memory")
          .to(panels[1], { opacity: 0.34, scale: 0.96, duration: 0.32 }, "memory")
          .to(panels[2], { opacity: 1, scale: 1, duration: 0.32 }, "memory+=0.12")
          .addLabel("seal", 1.76)
          .to(trackRef.current, { opacity: 0, scale: 0.965, duration: 0.24, ease: "power2.in" }, "seal")
          .to(sealRef.current, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power3.out" }, "seal+=0.12")
          .to({}, { duration: 0.28 });

        return () => timeline.kill();
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="proof" ref={rootRef} className={styles.proofCinema} data-film-act="evidence-reel">
      <div className={styles.proofStage}>
        <header ref={headerRef} className={styles.proofHeader}>
          <h2>Proof travels with the work.</h2>
          <p>Review the run, hand it off, and carry the lesson forward without reconstructing intent from chat.</p>
        </header>

        <div ref={trackRef} className={styles.proofTrack}>
          {EVIDENCE.map((item, index) => (
            <article
              key={item.key}
              ref={(node) => { panelRefs.current[index] = node; }}
              className={styles.proofPanel}
              data-proof-panel={item.key}
            >
              <div className={styles.proofPanelMedia}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 767px) 96vw, (min-width: 768px) 76vw"
                  className={`${styles.proofPanelImage} ${item.position}`}
                />
                <div className={styles.proofPanelGrade} aria-hidden="true" />
              </div>
              <div className={styles.proofPanelCaption}>
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>

        <div ref={sealRef} className={styles.proofSeal} role="status">
          <VectantMark gradientId="proof-seal-mark" className={styles.proofSealMark} />
          <strong>Replay ready.</strong>
          <p>Plan, authority, runtime, and artifacts stay in one reviewable bundle.</p>
          <div className={styles.proofLedger} aria-label="Proof bundle contents">
            <div className={styles.proofLedgerTrack}>
              {[0, 1].map((copy) => (
                <span key={copy} aria-hidden={copy === 1 ? "true" : undefined}>
                  {LEDGER.map((item) => <b key={`${copy}-${item}`}>{item}</b>)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
