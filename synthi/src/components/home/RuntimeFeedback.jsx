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
    title: "Passed, with evidence attached.",
    copy: "Plan coverage, denied writes, provenance, replay, runtime events, and exported artifacts remain reviewable after the run.",
    src: "/product-proof/senior-real-codesite-workflow-proof.png",
    alt: "Vectant checkride with a passed workflow and retained proof bundle",
    position: styles.proofImageCheckride,
  },
  {
    key: "handoff",
    label: "Handoff",
    title: "Assertions survive handoff.",
    copy: "Clearance, transaction state, proof bundles, quarantined writes, and commit trailers travel with the change.",
    src: "/product-proof/codesite-full-workflow-proof.png",
    alt: "Vectant handoff with clearance, transaction state, and proof attached",
    position: styles.proofImageHandoff,
  },
  {
    key: "memory",
    label: "Memory",
    title: "Prior near-misses inform the next route.",
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
  const captionRefs = useRef([]);
  const sealRef = useRef(null);
  const ledgerTrackRef = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = panelRefs.current.filter(Boolean);
        const captions = captionRefs.current.filter(Boolean);
        const centerPanel = (index) => {
          const panel = panels[index];
          return window.innerWidth / 2 - (panel.offsetLeft + panel.offsetWidth / 2);
        };

        gsap.set(headerRef.current, { autoAlpha: 1, y: 0 });
        gsap.set(trackRef.current, { x: () => centerPanel(0) });
        gsap.set(panels, { opacity: 0.34, scale: 0.96 });
        gsap.set(panels[0], { opacity: 1, scale: 1 });
        gsap.set(captions, { autoAlpha: 0, y: 18 });
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
          .addLabel("establish", 0)
          .to({}, { duration: 0.24 })
          .to(headerRef.current, { autoAlpha: 0, y: -28, duration: 0.16, ease: "power2.in" })
          .to(captions[0], { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" }, "<+=0.05")
          .to({}, { duration: 0.38 })
          .to(captions[0], { autoAlpha: 0, y: -16, duration: 0.12, ease: "power2.in" })
          .addLabel("handoff")
          .to(trackRef.current, { x: () => centerPanel(1), duration: 0.34, ease: "power3.inOut" }, "handoff")
          .to(panels[0], { opacity: 0.34, scale: 0.96, duration: 0.24 }, "handoff")
          .to(panels[1], { opacity: 1, scale: 1, duration: 0.24 }, "handoff+=0.08")
          .to(captions[1], { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" }, "handoff+=0.28")
          .to({}, { duration: 0.42 })
          .to(captions[1], { autoAlpha: 0, y: -16, duration: 0.12, ease: "power2.in" })
          .addLabel("memory")
          .to(trackRef.current, { x: () => centerPanel(2), duration: 0.34, ease: "power3.inOut" }, "memory")
          .to(panels[1], { opacity: 0.34, scale: 0.96, duration: 0.24 }, "memory")
          .to(panels[2], { opacity: 1, scale: 1, duration: 0.24 }, "memory+=0.08")
          .to(captions[2], { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" }, "memory+=0.28")
          .to({}, { duration: 0.44 })
          .to(captions[2], { autoAlpha: 0, y: -16, duration: 0.12, ease: "power2.in" })
          .addLabel("seal")
          .to(trackRef.current, { opacity: 0, scale: 0.965, duration: 0.22, ease: "power2.in" }, "seal")
          .to(sealRef.current, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power3.out" }, "seal+=0.1")
          .fromTo(ledgerTrackRef.current, { xPercent: 0 }, { xPercent: -18, duration: 0.62, ease: "none" }, "seal+=0.08")
          .to({}, { duration: 0.34 });

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
              <div
                ref={(node) => { captionRefs.current[index] = node; }}
                className={styles.proofPanelCaption}
              >
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>

        <div ref={sealRef} className={styles.proofSeal}>
          <VectantMark gradientId="proof-seal-mark" className={styles.proofSealMark} />
          <strong>Replay ready.</strong>
          <p>Plan, authority, runtime, and artifacts stay in one reviewable bundle.</p>
          <div className={styles.proofLedger}>
            <p className={styles.proofLedgerAccessible}>Proof bundle contents: {LEDGER.join(", ")}.</p>
            <div ref={ledgerTrackRef} className={styles.proofLedgerTrack} aria-hidden="true">
              {[0, 1].map((copy) => (
                <ul key={copy}>
                  {LEDGER.map((item) => <li key={`${copy}-${item}`}>{item}</li>)}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
