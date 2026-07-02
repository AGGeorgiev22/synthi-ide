"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

const SHOTS = {
  primary: {
    title: "Vectant clearance workspace",
    detail:
      "A live runtime surface with clearance, leases, collision forecast, proof rails, and landing evidence in one place.",
    src: "/product-proof/codesite-full-workflow-ui.png",
    width: 1440,
    height: 1100,
  },
  observe: {
    title: "Workflow proof packet",
    detail: "Passed checks, event stream, API calls, black-box score, and proof bundle trailers.",
    src: "/product-proof/senior-real-codesite-workflow-proof.png",
    width: 1440,
    height: 1708,
  },
  gpu: {
    title: "GPU HMR proof",
    detail: "Visual diff from a proof-gated native GPU hot swap.",
    src: "/product-proof/gpu-hmr-diff.png",
    width: 800,
    height: 600,
  },
};

export function HeroProductFloat() {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const spring = { stiffness: 154, damping: 22, mass: 0.5 };

  const stageY = useSpring(useTransform(scrollYProgress, [0, 0.52, 0.82, 1], [52, -8, -28, -96]), spring);
  const mainX = useSpring(useTransform(scrollYProgress, [0, 0.46, 1], [0, 0, 0]), spring);
  const mainY = useSpring(useTransform(scrollYProgress, [0, 0.42, 0.78, 1], [108, 0, -18, -72]), spring);
  const mainZ = useSpring(useTransform(scrollYProgress, [0, 0.42, 0.78, 1], [-520, 20, 150, -90]), spring);
  const mainScale = useSpring(useTransform(scrollYProgress, [0, 0.42, 0.78, 1], [0.5, 1.02, 1, 0.84]), spring);
  const mainRotateX = useSpring(useTransform(scrollYProgress, [0, 0.42, 0.78, 1], [17, 0, -1, 4]), spring);
  const mainRotateY = useSpring(useTransform(scrollYProgress, [0, 0.42, 0.78, 1], [-14, 0, 0, 2]), spring);
  const mainRotateZ = useSpring(useTransform(scrollYProgress, [0, 1], [0.55, 0]), spring);
  const mainOpacity = useTransform(scrollYProgress, [0, 0.78, 1], [1, 1, 0.32]);
  const observeY = useSpring(useTransform(scrollYProgress, [0, 0.42, 0.78, 1], [26, -22, -38, -118]), spring);
  const observeX = useSpring(useTransform(scrollYProgress, [0, 0.42, 0.78, 1], [154, 86, 22, 64]), spring);
  const observeZ = useSpring(useTransform(scrollYProgress, [0, 0.42, 0.78, 1], [-260, 16, 138, -60]), spring);
  const observeScale = useSpring(useTransform(scrollYProgress, [0, 0.42, 0.78, 1], [0.42, 0.62, 0.72, 0.54]), spring);
  const observeOpacity = useTransform(scrollYProgress, [0, 0.78, 1], [1, 1, 0.14]);
  const gpuY = useSpring(useTransform(scrollYProgress, [0, 0.46, 0.78, 1], [176, 110, 60, -38]), spring);
  const gpuX = useSpring(useTransform(scrollYProgress, [0, 0.46, 0.78, 1], [-142, -80, -44, -112]), spring);
  const gpuZ = useSpring(useTransform(scrollYProgress, [0, 0.46, 0.78, 1], [-280, -18, 120, -80]), spring);
  const gpuScale = useSpring(useTransform(scrollYProgress, [0, 0.46, 0.78, 1], [0.44, 0.62, 0.72, 0.52]), spring);
  const gpuOpacity = useTransform(scrollYProgress, [0, 0.78, 1], [1, 1, 0.12]);
  const collabY = useSpring(useTransform(scrollYProgress, [0, 0.48, 0.78, 1], [78, 18, -4, -92]), spring);
  const collabX = useSpring(useTransform(scrollYProgress, [0, 0.48, 0.78, 1], [72, -132, -252, -370]), spring);
  const collabZ = useSpring(useTransform(scrollYProgress, [0, 0.42, 0.78, 1], [-280, 64, 230, -120]), spring);
  const collabScale = useSpring(useTransform(scrollYProgress, [0, 0.48, 0.78, 1], [0.44, 0.64, 0.74, 0.54]), spring);
  const collabRotateZ = useSpring(useTransform(scrollYProgress, [0, 1], [1.2, 0]), spring);
  const collabOpacity = useTransform(scrollYProgress, [0, 0.78, 1], [1, 1, 0.12]);

  const stickyStyle = prefersReducedMotion ? undefined : { y: stageY };
  const mainStyle = prefersReducedMotion
    ? undefined
    : {
        x: mainX,
        y: mainY,
        z: mainZ,
        scale: mainScale,
        rotateX: mainRotateX,
        rotateY: mainRotateY,
        rotateZ: mainRotateZ,
        opacity: mainOpacity,
      };
  const observeStyle = prefersReducedMotion
    ? undefined
    : { x: observeX, y: observeY, z: observeZ, scale: observeScale, opacity: observeOpacity };
  const gpuStyle = prefersReducedMotion
    ? undefined
    : { x: gpuX, y: gpuY, z: gpuZ, scale: gpuScale, opacity: gpuOpacity };
  const collabStyle = prefersReducedMotion
    ? undefined
    : { x: collabX, y: collabY, z: collabZ, scale: collabScale, rotateZ: collabRotateZ, opacity: collabOpacity };
  const cardReveal = (delay) => ({
    initial: prefersReducedMotion ? false : "hidden",
    animate: "show",
    variants: {
      hidden: {
        opacity: 0,
        y: 42,
        z: -140,
        scale: 0.7,
        rotateX: 13,
      },
      show: {
        opacity: 1,
        y: 0,
        z: 0,
        scale: 1,
        rotateX: 0,
        transition: {
          duration: prefersReducedMotion ? 0 : 0.62,
          delay: prefersReducedMotion ? 0 : delay,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    },
  });

  return (
    <div ref={ref} className="hero-visual hero-product-float">
      <motion.div className="hero-product-sticky" style={stickyStyle}>
        <div className="hero-product-depth" aria-hidden="true" />

        <motion.div className="hero-product-main" style={mainStyle}>
          <motion.div className="hero-card-pop-inner" data-hero-card="workspace" {...cardReveal(0.04)}>
            <div className="hero-browser-shell hero-product-shell">
              <div className="hero-browser-bar">
                <span />
                <span />
                <span />
                <strong>vectant / autonomous runtime</strong>
              </div>
              <Image
                src={SHOTS.primary.src}
                alt={`${SHOTS.primary.title}: ${SHOTS.primary.detail}`}
                width={SHOTS.primary.width}
                height={SHOTS.primary.height}
                priority
                sizes="(min-width: 1280px) 78vw, (min-width: 768px) 88vw, 100vw"
                className="hero-primary-shot-image"
              />
              <div className="hero-shot-brand-mask" aria-hidden="true">
                <span>[V]</span>
                <strong>Vectant</strong>
              </div>
              <div className="hero-proof-scan" aria-hidden="true">
                <span>lease observed</span>
                <span>replay attached</span>
                <span>proof ready</span>
              </div>
              <div className="hero-proof-orbit" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="hero-product-card-anchor hero-product-card-observe" style={observeStyle}>
          <motion.figure className="hero-product-card" data-hero-card="workflow" {...cardReveal(0.28)}>
            <div className="hero-card-pop-inner">
              <Image
                src={SHOTS.observe.src}
                alt={`${SHOTS.observe.title}: ${SHOTS.observe.detail}`}
                width={SHOTS.observe.width}
                height={SHOTS.observe.height}
                priority={false}
                sizes="360px"
                className="h-auto w-full"
              />
              <div className="hero-workflow-brand-mask" aria-hidden="true">
                <span>[V]</span>
                <strong>Vectant proof</strong>
              </div>
              <figcaption>
                <strong>Workflow proof rail</strong>
                <span>browser attach, observe, trace, contract, replay</span>
              </figcaption>
            </div>
          </motion.figure>
        </motion.div>

        <motion.div className="hero-product-card-anchor hero-code-collab-anchor" style={collabStyle}>
          <motion.figure
            className="hero-code-collab-card"
            data-hero-card="collab"
            aria-label="Shared runtime collaboration"
            {...cardReveal(0.52)}
          >
            <div className="hero-card-pop-inner">
              <div className="hero-code-window-top">
                <div className="hero-code-window-title">
                  <span className="hero-code-window-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <strong>vectant / runtime/session.rs</strong>
                </div>
                <div className="hero-code-presence" aria-label="Mira and Devon are active">
                  <span>MK</span>
                  <span>DV</span>
                  <i aria-hidden="true" />
                  <em>2 here</em>
                </div>
              </div>
              <pre className="hero-code-editor">
                <code>
                  <span className="hero-code-row">
                    <em>1</em>
                    <span>
                      <b className="hero-code-purple">pub fn</b> <b className="hero-code-cyan">spawn</b>(cfg:{" "}
                      <b className="hero-code-blue">Config</b>) -&gt; <b className="hero-code-blue">Session</b> {"{"}
                    </span>
                  </span>
                  <span className="hero-code-row hero-code-row-blue">
                    <em>2</em>
                    <span className="hero-code-typing-line hero-code-typing-line-mira">
                      <span className="hero-code-typewrite hero-code-typewrite-mira">let rt = Runtime::shared(cfg);</span>
                      <strong className="hero-code-pill hero-code-pill-blue">Mira</strong>
                    </span>
                  </span>
                  <span className="hero-code-row hero-code-row-pink">
                    <em>3</em>
                    <span className="hero-code-typing-line hero-code-typing-line-devon">
                      <span className="hero-code-typewrite hero-code-typewrite-devon">rt.observe().broadcast();</span>
                      <strong className="hero-code-pill hero-code-pill-pink">Devon</strong>
                    </span>
                  </span>
                  <span className="hero-code-row">
                    <em>4</em>
                    <span>
                      <b className="hero-code-blue">Session</b>::live(rt)
                    </span>
                  </span>
                  <span className="hero-code-row">
                    <em>5</em>
                    <span>{"}"}</span>
                  </span>
                </code>
              </pre>
              <div className="hero-code-status">
                <span className="hero-code-room">2 here + agent</span>
                <strong>
                  <i aria-hidden="true" />
                  Mira + Devon <span>are typing in session.rs</span>
                </strong>
                <em>shared runtime</em>
              </div>
            </div>
          </motion.figure>
        </motion.div>

        <motion.div className="hero-product-card-anchor hero-product-card-gpu" style={gpuStyle}>
          <motion.figure className="hero-product-card" data-hero-card="gpu" {...cardReveal(0.76)}>
            <div className="hero-card-pop-inner">
              <Image
                src={SHOTS.gpu.src}
                alt={`${SHOTS.gpu.title}: ${SHOTS.gpu.detail}`}
                width={SHOTS.gpu.width}
                height={SHOTS.gpu.height}
                priority={false}
                sizes="300px"
                className="h-auto w-full"
              />
              <figcaption>
                <strong>Proof-gated GPU HMR path</strong>
                <span>accepted when state, ABI, oracle, and ledger gates pass</span>
              </figcaption>
            </div>
          </motion.figure>
        </motion.div>
      </motion.div>
    </div>
  );
}
