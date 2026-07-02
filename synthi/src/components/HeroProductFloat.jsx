"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

const SHOTS = {
  primary: {
    title: "Vectant governed workspace",
    detail:
      "A live cloud runtime with workflow authority, terminal context, GPU state, and proof-ready session state.",
    src: "/product-proof/browser-workflow-observe-ui.png",
    width: 1500,
    height: 1000,
  },
  observe: {
    title: "Runtime workflow proof",
    detail: "A real Vectant workflow with hosted browser attachment, observed screenshots, trace, contract, and replay steps.",
    src: "/product-proof/investor-demo-workflows.png",
    width: 1440,
    height: 1000,
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
    offset: ["start 86%", "end 18%"],
  });
  const spring = { stiffness: 154, damping: 22, mass: 0.5 };

  const stageY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [10, -2, -12]), spring);
  const mainX = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [22, 4, -10]), spring);
  const mainY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [58, 22, 8]), spring);
  const mainZ = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [-220, -68, 0]), spring);
  const mainScale = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [0.74, 0.9, 0.98]), spring);
  const mainRotateX = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [10, 4, 0]), spring);
  const mainRotateY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [-6, -1.4, 0]), spring);
  const mainRotateZ = useSpring(useTransform(scrollYProgress, [0, 1], [0.55, 0]), spring);
  const observeY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [54, 18, 4]), spring);
  const observeX = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [74, 32, 18]), spring);
  const observeZ = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [-80, -18, 24]), spring);
  const observeScale = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [0.58, 0.72, 0.82]), spring);
  const gpuY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [118, 88, 60]), spring);
  const gpuX = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [-54, -36, -24]), spring);
  const gpuZ = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [-92, -28, 12]), spring);
  const gpuScale = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [0.58, 0.72, 0.82]), spring);
  const collabY = useSpring(useTransform(scrollYProgress, [0, 0.52, 1], [108, 76, 52]), spring);
  const collabX = useSpring(useTransform(scrollYProgress, [0, 0.52, 1], [54, 24, 8]), spring);
  const collabZ = useSpring(useTransform(scrollYProgress, [0, 0.52, 1], [-74, -14, 18]), spring);
  const collabScale = useSpring(useTransform(scrollYProgress, [0, 0.52, 1], [0.58, 0.72, 0.82]), spring);
  const collabRotateZ = useSpring(useTransform(scrollYProgress, [0, 1], [1.2, 0]), spring);

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
      };
  const observeStyle = prefersReducedMotion
    ? undefined
    : { x: observeX, y: observeY, z: observeZ, scale: observeScale };
  const gpuStyle = prefersReducedMotion
    ? undefined
    : { x: gpuX, y: gpuY, z: gpuZ, scale: gpuScale };
  const collabStyle = prefersReducedMotion
    ? undefined
    : { x: collabX, y: collabY, z: collabZ, scale: collabScale, rotateZ: collabRotateZ };
  const cardReveal = (delay) => ({
    initial: prefersReducedMotion ? false : "hidden",
    animate: "show",
    variants: {
      hidden: {
        opacity: 0,
        y: 34,
        z: -90,
        scale: 0.78,
        rotateX: 10,
      },
      show: {
        opacity: 1,
        y: 0,
        z: 0,
        scale: 1,
        rotateX: 0,
        transition: {
          duration: prefersReducedMotion ? 0 : 0.42,
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
          <motion.div className="hero-card-pop-inner" {...cardReveal(0.02)}>
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
                sizes="(min-width: 1280px) 48vw, (min-width: 768px) 82vw, 100vw"
                className="h-auto w-full"
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="hero-product-card-anchor hero-product-card-observe" style={observeStyle}>
          <motion.figure className="hero-product-card" {...cardReveal(0.16)}>
            <div className="hero-card-pop-inner">
              <Image
                src={SHOTS.observe.src}
                alt={`${SHOTS.observe.title}: ${SHOTS.observe.detail}`}
                width={SHOTS.observe.width}
                height={SHOTS.observe.height}
                priority
                sizes="360px"
                className="h-auto w-full"
              />
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
            aria-label="Shared runtime collaboration"
            {...cardReveal(0.3)}
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
                    <span>
                      let rt = Runtime::shared(cfg); <strong className="hero-code-pill hero-code-pill-blue">Mira</strong>
                    </span>
                  </span>
                  <span className="hero-code-row hero-code-row-pink">
                    <em>3</em>
                    <span className="hero-code-typing-line">
                      <span className="hero-code-typewrite">rt.observe().broadcast();</span>
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
                  Devon <span>is typing in session.rs</span>
                </strong>
                <em>shared runtime</em>
              </div>
            </div>
          </motion.figure>
        </motion.div>

        <motion.div className="hero-product-card-anchor hero-product-card-gpu" style={gpuStyle}>
          <motion.figure className="hero-product-card" {...cardReveal(0.44)}>
            <div className="hero-card-pop-inner">
              <Image
                src={SHOTS.gpu.src}
                alt={`${SHOTS.gpu.title}: ${SHOTS.gpu.detail}`}
                width={SHOTS.gpu.width}
                height={SHOTS.gpu.height}
                priority
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
