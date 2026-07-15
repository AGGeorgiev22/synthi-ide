"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "@/components/home/MissionProfiles.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PROFILES = [
  {
    audience: "Agent platform teams",
    title: "Run the fleet under one contract.",
    body: "Operate Claude, Codex, Cursor, and internal runners with shared runtime state, explicit budgets, bounded authority, and a visible kill path.",
    proof: "Many runners. One control plane.",
    image: "/product-proof/browser-workflow-observe-ui.png",
    alt: "Vectant workspace with an attached runtime and observable agent workflow controls",
  },
  {
    audience: "Engineering organizations",
    title: "Parallel work without parallel damage.",
    body: "Keep shared schemas, APIs, auth, and migrations out of the collision zone. Every landing arrives with its chain of custody.",
    proof: "Shared repository. Ordered mutations.",
    image: "/product-proof/codesite-full-workflow-ui.png",
    alt: "CodeSite airspace map showing concurrent flights, mutation boundaries, collision forecasts, and a landing queue",
  },
  {
    audience: "Security + reliability",
    title: "Make autonomy earn clearance.",
    body: "Hold unsafe writes, replay near-misses, and inspect the evidence before agent work reaches a guarded system or production path.",
    proof: "Proof attached. Shutdown authority visible.",
    image: "/codesite-proof/codesite-black-box-desktop.png",
    alt: "CodeSite black box showing a denied write, quarantine action, ordered replay, and attached proof bundle",
  },
];

export function MissionProfiles() {
  const rootRef = useRef(null);
  const introRef = useRef(null);
  const indexRef = useRef(null);
  const progressRef = useRef(null);
  const profileRefs = useRef([]);
  const mediaRefs = useRef([]);
  const copyRefs = useRef([]);
  const indexItemRefs = useRef([]);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const profiles = profileRefs.current.filter(Boolean);
        const profileMedia = mediaRefs.current.filter(Boolean);
        const profileCopy = copyRefs.current.filter(Boolean);
        const indexItems = indexItemRefs.current.filter(Boolean);
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.62,
            invalidateOnRefresh: true,
          },
        });

        gsap.set(profiles, { autoAlpha: 0 });
        gsap.set(profileMedia, { clipPath: "inset(100% 0 0 0)" });
        gsap.set(profileCopy, { autoAlpha: 0, x: 42 });
        gsap.set(indexRef.current, { autoAlpha: 0, y: -10 });
        gsap.set(indexItems, { color: "rgba(228, 230, 236, 0.34)" });
        gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });

        timeline
          .to({}, { duration: 0.42 })
          .to(introRef.current, { autoAlpha: 0, y: -42, duration: 0.3, ease: "power2.in" })
          .to(indexRef.current, { autoAlpha: 1, y: 0, duration: 0.22, ease: "power3.out" }, "<0.08");

        profiles.forEach((profile, index) => {
          const previous = profiles[index - 1];
          const at = 0.82 + index * 0.92;

          if (previous) {
            timeline
              .to(copyRefs.current[index - 1], { autoAlpha: 0, x: -24, duration: 0.18, ease: "power2.in" }, at)
              .to(previous, { autoAlpha: 0, duration: 0.18 }, at + 0.12)
              .to(indexItems[index - 1], { color: "rgba(228, 230, 236, 0.34)", duration: 0.16 }, at);
          }

          timeline
            .set(profile, { autoAlpha: 1 }, at)
            .to(profileMedia[index], { clipPath: "inset(0% 0 0 0)", duration: 0.44, ease: "power3.inOut" }, at)
            .to(profileCopy[index], { autoAlpha: 1, x: 0, duration: 0.34, ease: "power3.out" }, at + 0.1)
            .to(indexItems[index], { color: "var(--vectant-ui-text)", duration: 0.18 }, at)
            .to(
              progressRef.current,
              { scaleX: (index + 1) / profiles.length, duration: 0.44, ease: "power2.inOut" },
              at,
            );
        });

        timeline.to({}, { duration: 0.72 });

        return () => timeline.kill();
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="teams" ref={rootRef} className={styles.missionProfiles} aria-label="Who Vectant is for">
      <div className={styles.missionStage}>
        <div className={styles.missionCorridor} aria-hidden="true" />

        <header ref={introRef} className={styles.missionIntro}>
          <h2>When agents stop being experiments, Vectant becomes the tower.</h2>
          <p>For teams that want more agent throughput without giving away authority.</p>
        </header>

        <div ref={indexRef} className={styles.missionIndex} aria-hidden="true">
          {PROFILES.map((profile, index) => (
            <span key={profile.audience} ref={(node) => { indexItemRefs.current[index] = node; }}>
              {profile.audience}
            </span>
          ))}
          <i><b ref={progressRef} /></i>
        </div>

        <div className={styles.missionSequence}>
          {PROFILES.map((profile, index) => (
            <article
              key={profile.audience}
              ref={(node) => { profileRefs.current[index] = node; }}
              className={styles.missionProfile}
            >
              <figure ref={(node) => { mediaRefs.current[index] = node; }} className={styles.missionMedia}>
                <Image
                  src={profile.image}
                  alt={profile.alt}
                  fill
                  quality={95}
                  sizes="(max-width: 767px) 100vw, 62vw"
                  className={styles.missionImage}
                />
              </figure>

              <div ref={(node) => { copyRefs.current[index] = node; }} className={styles.missionCopy}>
                <p>{profile.audience}</p>
                <h3>{profile.title}</h3>
                <span>{profile.body}</span>
                <strong>{profile.proof}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
