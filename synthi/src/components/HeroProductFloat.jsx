"use client";

import { useRef, useState } from "react";
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
  const [raisedCard, setRaisedCard] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 72%", "end 18%"],
  });
  const spring = { stiffness: 154, damping: 22, mass: 0.5 };

  const stageY = useSpring(useTransform(scrollYProgress, [0, 0.34, 0.82, 1], [34, 8, -4, -8]), spring);
  const mainX = useSpring(useTransform(scrollYProgress, [0, 0.46, 1], [0, 0, 0]), spring);
  const mainY = useSpring(useTransform(scrollYProgress, [0, 0.3, 0.78, 1], [96, 34, 16, 18]), spring);
  const mainZ = useSpring(useTransform(scrollYProgress, [0, 0.3, 0.78, 1], [-360, 72, 190, 170]), spring);
  const mainScale = useSpring(useTransform(scrollYProgress, [0, 0.3, 0.78, 1], [0.66, 1.04, 1, 0.98]), spring);
  const mainRotateX = useSpring(useTransform(scrollYProgress, [0, 0.3, 0.78, 1], [11, 0, -1, -0.4]), spring);
  const mainRotateY = useSpring(useTransform(scrollYProgress, [0, 0.3, 0.78, 1], [-9, 0, 0, 0.2]), spring);
  const mainRotateZ = useSpring(useTransform(scrollYProgress, [0, 1], [0.55, 0]), spring);
  const mainOpacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0.96]);
  const observeY = useSpring(useTransform(scrollYProgress, [0, 0.3, 0.78, 1], [34, 4, -8, -12]), spring);
  const observeX = useSpring(useTransform(scrollYProgress, [0, 0.3, 0.78, 1], [76, 44, 18, 16]), spring);
  const observeZ = useSpring(useTransform(scrollYProgress, [0, 0.3, 0.78, 1], [-150, 90, 170, 148]), spring);
  const observeScale = useSpring(useTransform(scrollYProgress, [0, 0.3, 0.78, 1], [0.52, 0.74, 0.78, 0.74]), spring);
  const observeOpacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0.92]);
  const gpuY = useSpring(useTransform(scrollYProgress, [0, 0.32, 0.78, 1], [158, 112, 78, 76]), spring);
  const gpuX = useSpring(useTransform(scrollYProgress, [0, 0.32, 0.78, 1], [-64, -42, -30, -32]), spring);
  const gpuZ = useSpring(useTransform(scrollYProgress, [0, 0.32, 0.78, 1], [-160, 72, 152, 140]), spring);
  const gpuScale = useSpring(useTransform(scrollYProgress, [0, 0.32, 0.78, 1], [0.54, 0.74, 0.78, 0.74]), spring);
  const gpuOpacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0.92]);
  const collabY = useSpring(useTransform(scrollYProgress, [0, 0.32, 0.78, 1], [78, 36, 18, 20]), spring);
  const collabX = useSpring(useTransform(scrollYProgress, [0, 0.32, 0.78, 1], [36, -88, -170, -156]), spring);
  const collabZ = useSpring(useTransform(scrollYProgress, [0, 0.32, 0.78, 1], [-170, 118, 224, 190]), spring);
  const collabScale = useSpring(useTransform(scrollYProgress, [0, 0.32, 0.78, 1], [0.54, 0.76, 0.78, 0.74]), spring);
  const collabRotateZ = useSpring(useTransform(scrollYProgress, [0, 1], [1.2, 0]), spring);
  const collabOpacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0.92]);
  const cardHover = prefersReducedMotion
    ? undefined
    : {
        y: -12,
        z: 180,
        scale: 1.055,
        rotateX: -1,
        transition: { type: "spring", stiffness: 230, damping: 20, mass: 0.42 },
      };

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
  const withRaisedLayer = (style, key) => (raisedCard === key ? { ...(style || {}), zIndex: 80 } : style);
  const raiseLayer = (key) => ({
    onHoverStart: () => setRaisedCard(key),
    onHoverEnd: () => setRaisedCard((current) => (current === key ? null : current)),
  });
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
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-product-card-anchor hero-product-card-observe"
          style={withRaisedLayer(observeStyle, "workflow")}
          {...raiseLayer("workflow")}
        >
          <motion.figure
            className="hero-product-card"
            data-hero-card="workflow"
            whileHover={cardHover}
            {...raiseLayer("workflow")}
            {...cardReveal(0.28)}
          >
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
              <figcaption>
                <strong>Workflow proof rail</strong>
                <span>browser attach, observe, trace, contract, replay</span>
              </figcaption>
            </div>
          </motion.figure>
        </motion.div>

        <motion.div
          className="hero-product-card-anchor hero-code-collab-anchor"
          style={withRaisedLayer(collabStyle, "collab")}
          {...raiseLayer("collab")}
        >
          <motion.figure
            className="hero-code-collab-card"
            data-hero-card="collab"
            aria-label="Shared runtime collaboration"
            whileHover={cardHover}
            {...raiseLayer("collab")}
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

        <motion.div
          className="hero-product-card-anchor hero-product-card-gpu"
          style={withRaisedLayer(gpuStyle, "gpu")}
          {...raiseLayer("gpu")}
        >
          <motion.figure
            className="hero-product-card"
            data-hero-card="gpu"
            whileHover={cardHover}
            {...raiseLayer("gpu")}
            {...cardReveal(0.76)}
          >
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
