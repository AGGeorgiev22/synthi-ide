"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Eye, ShieldCheck, Stack, Stamp } from "@phosphor-icons/react";

import styles from "@/components/home/VectantHome.module.css";

gsap.registerPlugin(ScrollTrigger);

const AUTHORITY_STEPS = [
  {
    action: "Request",
    title: "Start with the smallest useful scope.",
    copy: "Files, routes, commands, protected paths, and required evidence become a mutation lease before the agent writes.",
    detail: "Permission boundary",
    icon: ShieldCheck,
    src: "/product-proof/senior-real-codesite-ui-desktop-loaded.png",
    width: 1440,
    height: 1100,
  },
  {
    action: "Observe",
    title: "Keep the running system attached.",
    copy: "Browser, terminal, services, screenshots, HMR, and repository state remain part of one inspectable session.",
    detail: "Runtime state",
    icon: Eye,
    src: "/product-proof/browser-workflow-observe-ui.png",
    width: 1500,
    height: 1000,
  },
  {
    action: "Constrain",
    title: "Make risk visible before it spreads.",
    copy: "Protected paths, collisions, output checks, and counterfactual branches can block or narrow a mutation before promotion.",
    detail: "Policy gate",
    icon: Stack,
    src: "/product-proof/codesite-shadow-simulator-ui-desktop.png",
    width: 1440,
    height: 1100,
  },
  {
    action: "Prove",
    title: "Land the change with its evidence.",
    copy: "Replay, line provenance, output proof, and review context travel with the change into the final handoff.",
    detail: "Proof capsule",
    icon: Stamp,
    src: "/product-proof/codesite-full-workflow-proof.png",
    width: 1280,
    height: 1567,
  },
];

const STATEMENT = "Parallel work is easy. Safe convergence is the hard part. Vectant makes every agent earn the right to land.";

export function AuthorityStory() {
  const rootRef = useRef(null);
  const scrubRef = useRef(null);
  const stackRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !rootRef.current || !scrubRef.current || !stackRef.current) return undefined;

    const context = gsap.context(() => {
      const words = gsap.utils.toArray(`.${styles.scrubWord}`);
      gsap.fromTo(
        words,
        { opacity: 0.13 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: scrubRef.current,
            start: "top 72%",
            end: "bottom 42%",
            scrub: 0.7,
          },
        }
      );

      const media = gsap.matchMedia();
      media.add("(min-width: 768px)", () => {
        const cards = gsap.utils.toArray(`.${styles.storyCard}`);
        cards.forEach((card, index) => {
          if (index === cards.length - 1) return;

          ScrollTrigger.create({
            trigger: card,
            start: "top top+=80",
            endTrigger: cards[cards.length - 1],
            end: "top top+=80",
            pin: true,
            pinSpacing: false,
          });

          gsap.to(card, {
            scale: 0.925,
            y: -28,
            opacity: 0.34,
            ease: "none",
            scrollTrigger: {
              trigger: cards[index + 1],
              start: "top bottom",
              end: "top top+=80",
              scrub: 0.8,
            },
          });
        });
      });

      return () => media.revert();
    }, rootRef);

    return () => context.revert();
  }, [reduceMotion]);

  return (
    <section id="runtime-path" ref={rootRef} className={styles.chapter}>
      <div className={styles.sectionShell}>
        <div ref={scrubRef} className={styles.scrubStatement} aria-label={STATEMENT}>
          {STATEMENT.split(" ").map((word, index) => (
            <span key={`${word}-${index}`} className={styles.scrubWord} aria-hidden="true">
              {word}{" "}
            </span>
          ))}
        </div>

        <div ref={stackRef} className={styles.storyStack}>
          {AUTHORITY_STEPS.map(({ action, title, copy, detail, icon: Icon, src, width, height }) => (
            <article key={action} className={styles.storyCard}>
              <div className={styles.storyCardInner}>
                <div className={styles.storyMedia}>
                  <Image
                    src={src}
                    alt=""
                    width={width}
                    height={height}
                    sizes="(min-width: 1280px) 62vw, (min-width: 768px) 58vw, 100vw"
                    className="h-full w-full object-contain object-top"
                  />
                </div>
                <div className={styles.storyContent}>
                  <div className={styles.storyAction}>
                    <span><Icon size={16} weight="duotone" /></span>
                    {action}
                  </div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <div className={styles.storyDetail}>
                    <span>{detail}</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

