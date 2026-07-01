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
    offset: ["start 125%", "end -85%"],
  });
  const spring = { stiffness: 88, damping: 25, mass: 0.72 };

  const mainX = useSpring(useTransform(scrollYProgress, [0, 0.54, 1], [18, -14, -58]), spring);
  const mainY = useSpring(useTransform(scrollYProgress, [0, 0.54, 1], [48, 2, -34]), spring);
  const mainScale = useSpring(useTransform(scrollYProgress, [0, 0.54, 1], [0.92, 1, 1.04]), spring);
  const mainRotateX = useSpring(useTransform(scrollYProgress, [0, 1], [3, -1]), spring);
  const mainRotateZ = useSpring(useTransform(scrollYProgress, [0, 1], [0.8, -0.4]), spring);
  const observeY = useSpring(useTransform(scrollYProgress, [0, 0.58, 1], [-18, -42, -72]), spring);
  const observeX = useSpring(useTransform(scrollYProgress, [0, 0.58, 1], [112, 38, -8]), spring);
  const observeScale = useSpring(useTransform(scrollYProgress, [0, 0.58, 1], [0.74, 0.92, 1]), spring);
  const observeOpacity = useSpring(useTransform(scrollYProgress, [0, 0.28, 1], [0.28, 0.84, 0.98]), spring);
  const gpuY = useSpring(useTransform(scrollYProgress, [0, 0.58, 1], [134, 72, 16]), spring);
  const gpuX = useSpring(useTransform(scrollYProgress, [0, 0.58, 1], [-96, -70, -52]), spring);
  const gpuScale = useSpring(useTransform(scrollYProgress, [0, 0.58, 1], [0.72, 0.88, 0.98]), spring);
  const gpuOpacity = useSpring(useTransform(scrollYProgress, [0, 0.34, 1], [0.2, 0.78, 0.96]), spring);
  const collabY = useSpring(useTransform(scrollYProgress, [0, 0.6, 1], [86, 24, -10]), spring);
  const collabX = useSpring(useTransform(scrollYProgress, [0, 0.6, 1], [42, 10, -4]), spring);
  const collabScale = useSpring(useTransform(scrollYProgress, [0, 0.6, 1], [0.82, 0.96, 1]), spring);
  const collabOpacity = useSpring(useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [0, 0.72, 0.96, 1]), spring);
  const collabRotateZ = useSpring(useTransform(scrollYProgress, [0, 1], [1.8, -0.35]), spring);

  const mainStyle = prefersReducedMotion ? undefined : { x: mainX, y: mainY, scale: mainScale, rotateX: mainRotateX, rotateZ: mainRotateZ };
  const observeStyle = prefersReducedMotion
    ? undefined
    : { x: observeX, y: observeY, scale: observeScale, opacity: observeOpacity };
  const gpuStyle = prefersReducedMotion
    ? undefined
    : { x: gpuX, y: gpuY, scale: gpuScale, opacity: gpuOpacity };
  const collabStyle = prefersReducedMotion
    ? undefined
    : { x: collabX, y: collabY, scale: collabScale, opacity: collabOpacity, rotateZ: collabRotateZ };

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

        <motion.figure className="hero-code-collab-card" style={collabStyle} aria-label="Live collaboration code edits">
          <div className="hero-code-collab-top">
            <span>live collab</span>
            <strong>src/runtime/lease.ts</strong>
          </div>
          <pre>
            <code>
              <span className="hero-code-line">if (hotPath.accepted) {"{"}</span>
              <span className="hero-code-line hero-code-line-edit hero-code-line-human">
                <span className="hero-code-cursor" />
                <b>Priya</b>
                <span className="hero-code-type hero-code-type-a">lease.require("gpu-hmr");</span>
              </span>
              <span className="hero-code-line hero-code-line-edit hero-code-line-agent">
                <span className="hero-code-cursor" />
                <b>agent</b>
                <span className="hero-code-type hero-code-type-b">proof.attach(diff.oracle);</span>
              </span>
              <span className="hero-code-line">  return landing.allow();</span>
              <span className="hero-code-line">{"}"}</span>
            </code>
          </pre>
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
