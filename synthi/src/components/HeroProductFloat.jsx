"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

const SHOTS = {
  primary: {
    title: "CodeSite loaded workflow",
    detail:
      "A real agent coordination surface with no-fly zones, collision forecast, scoped leases, risk, and proof-ready handoff.",
    src: "/product-proof/senior-real-codesite-ui-desktop-loaded.png",
    width: 1440,
    height: 1100,
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
    offset: ["start 104%", "end 4%"],
  });
  const spring = { stiffness: 132, damping: 23, mass: 0.56 };

  const mainX = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [4, -10, -34]), spring);
  const mainY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [20, -2, -18]), spring);
  const mainScale = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.01, 1.035]), spring);
  const mainRotateX = useSpring(useTransform(scrollYProgress, [0, 1], [2, -0.8]), spring);
  const mainRotateZ = useSpring(useTransform(scrollYProgress, [0, 1], [0.45, -0.28]), spring);
  const observeY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [8, -28, -44]), spring);
  const observeX = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [28, 10, -2]), spring);
  const observeScale = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [0.86, 0.93, 0.96]), spring);
  const gpuY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [62, 34, 10]), spring);
  const gpuX = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [-46, -36, -24]), spring);
  const gpuScale = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [0.84, 0.91, 0.95]), spring);
  const collabY = useSpring(useTransform(scrollYProgress, [0, 0.52, 1], [36, 12, -4]), spring);
  const collabX = useSpring(useTransform(scrollYProgress, [0, 0.52, 1], [24, 8, -4]), spring);
  const collabScale = useSpring(useTransform(scrollYProgress, [0, 0.52, 1], [0.86, 0.93, 0.96]), spring);
  const collabRotateZ = useSpring(useTransform(scrollYProgress, [0, 1], [1.2, -0.25]), spring);

  const mainStyle = prefersReducedMotion ? undefined : { x: mainX, y: mainY, scale: mainScale, rotateX: mainRotateX, rotateZ: mainRotateZ };
  const observeStyle = prefersReducedMotion
    ? undefined
    : { x: observeX, y: observeY, scale: observeScale };
  const gpuStyle = prefersReducedMotion
    ? undefined
    : { x: gpuX, y: gpuY, scale: gpuScale };
  const collabStyle = prefersReducedMotion
    ? undefined
    : { x: collabX, y: collabY, scale: collabScale, rotateZ: collabRotateZ };

  return (
    <div ref={ref} className="hero-visual hero-product-float">
      <div className="hero-product-sticky">
        <div className="hero-product-depth" aria-hidden="true" />

        <motion.div className="hero-product-main" style={mainStyle}>
          <div className="hero-browser-shell hero-product-shell">
            <div className="hero-browser-bar">
              <span />
              <span />
              <span />
              <strong>codesite / autonomous runtime</strong>
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
            <strong>Sub-100ms GPU HMR path</strong>
            <span>accepted when state, ABI, oracle, and ledger gates pass</span>
          </figcaption>
        </motion.figure>
      </div>
    </div>
  );
}
