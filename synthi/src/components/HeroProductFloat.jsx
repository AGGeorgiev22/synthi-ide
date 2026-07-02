"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

const SHOTS = {
  primary: {
    title: "Vectant runtime workflow",
    detail:
      "A real runtime surface with workflows, hosted browser control, terminal context, GPU state, and proof-ready handoff.",
    src: "/product-proof/investor-demo-workflows.png",
    width: 1440,
    height: 1000,
  },
  observe: {
    title: "Hosted browser observe",
    detail: "Runtime, browser state, workflow steps, terminal context, and replay surface in one cloud environment.",
    src: "/product-proof/browser-workflow-observe-ui.png",
    width: 1500,
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
    offset: ["start 80%", "end 2%"],
  });
  const spring = { stiffness: 154, damping: 22, mass: 0.5 };

  const stageY = useSpring(useTransform(scrollYProgress, [0, 0.48, 1], [2, -10, -28]), spring);
  const mainX = useSpring(useTransform(scrollYProgress, [0, 0.48, 1], [10, -38, -92]), spring);
  const mainY = useSpring(useTransform(scrollYProgress, [0, 0.48, 1], [64, 30, 8]), spring);
  const mainZ = useSpring(useTransform(scrollYProgress, [0, 0.48, 1], [-180, 54, 210]), spring);
  const mainScale = useSpring(useTransform(scrollYProgress, [0, 0.48, 1], [0.8, 1.06, 1.22]), spring);
  const mainOpacity = useSpring(useTransform(scrollYProgress, [0, 0.2, 1], [0.86, 1, 1]), spring);
  const mainRotateX = useSpring(useTransform(scrollYProgress, [0, 0.48, 1], [8, 2.4, -1.6]), spring);
  const mainRotateY = useSpring(useTransform(scrollYProgress, [0, 0.48, 1], [-4.2, -1.2, 0.4]), spring);
  const mainRotateZ = useSpring(useTransform(scrollYProgress, [0, 1], [0.7, -0.42]), spring);
  const observeY = useSpring(useTransform(scrollYProgress, [0, 0.48, 1], [42, -12, -58]), spring);
  const observeX = useSpring(useTransform(scrollYProgress, [0, 0.48, 1], [88, -4, -58]), spring);
  const observeZ = useSpring(useTransform(scrollYProgress, [0, 0.48, 1], [-46, 66, 176]), spring);
  const observeScale = useSpring(useTransform(scrollYProgress, [0, 0.48, 1], [0.68, 0.88, 0.98]), spring);
  const observeOpacity = useSpring(useTransform(scrollYProgress, [0, 0.18, 1], [0.58, 0.86, 1]), spring);
  const gpuY = useSpring(useTransform(scrollYProgress, [0, 0.48, 1], [126, 70, 24]), spring);
  const gpuX = useSpring(useTransform(scrollYProgress, [0, 0.48, 1], [-76, -50, -38]), spring);
  const gpuZ = useSpring(useTransform(scrollYProgress, [0, 0.48, 1], [-64, 54, 148]), spring);
  const gpuScale = useSpring(useTransform(scrollYProgress, [0, 0.48, 1], [0.68, 0.86, 0.96]), spring);
  const gpuOpacity = useSpring(useTransform(scrollYProgress, [0, 0.18, 1], [0.56, 0.84, 1]), spring);
  const collabY = useSpring(useTransform(scrollYProgress, [0, 0.52, 1], [96, 44, 8]), spring);
  const collabX = useSpring(useTransform(scrollYProgress, [0, 0.52, 1], [62, -28, -92]), spring);
  const collabZ = useSpring(useTransform(scrollYProgress, [0, 0.52, 1], [-34, 84, 190]), spring);
  const collabScale = useSpring(useTransform(scrollYProgress, [0, 0.52, 1], [0.68, 0.86, 0.96]), spring);
  const collabOpacity = useSpring(useTransform(scrollYProgress, [0, 0.18, 1], [0.56, 0.86, 1]), spring);
  const collabRotateZ = useSpring(useTransform(scrollYProgress, [0, 1], [1.8, -0.18]), spring);

  const stickyStyle = prefersReducedMotion ? undefined : { y: stageY };
  const mainStyle = prefersReducedMotion
    ? undefined
    : {
        x: mainX,
        y: mainY,
        z: mainZ,
        scale: mainScale,
        opacity: mainOpacity,
        rotateX: mainRotateX,
        rotateY: mainRotateY,
        rotateZ: mainRotateZ,
      };
  const observeStyle = prefersReducedMotion
    ? undefined
    : { x: observeX, y: observeY, z: observeZ, scale: observeScale, opacity: observeOpacity };
  const gpuStyle = prefersReducedMotion
    ? undefined
    : { x: gpuX, y: gpuY, z: gpuZ, scale: gpuScale, opacity: gpuOpacity };
  const collabStyle = prefersReducedMotion
    ? undefined
    : { x: collabX, y: collabY, z: collabZ, scale: collabScale, opacity: collabOpacity, rotateZ: collabRotateZ };

  return (
    <div ref={ref} className="hero-visual hero-product-float">
      <motion.div className="hero-product-sticky" style={stickyStyle}>
        <div className="hero-product-depth" aria-hidden="true" />

        <motion.div className="hero-product-main" style={mainStyle}>
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

        <motion.figure className="hero-product-card hero-product-card-observe" style={observeStyle}>
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
            <strong>MCP eyes and hands</strong>
            <span>browser, terminal, replay, workflow state</span>
          </figcaption>
        </motion.figure>

        <motion.figure className="hero-code-collab-card" style={collabStyle} aria-label="Shared runtime collaboration">
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
        </motion.figure>

        <motion.figure className="hero-product-card hero-product-card-gpu" style={gpuStyle}>
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
        </motion.figure>
      </motion.div>
    </div>
  );
}
