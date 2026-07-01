"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

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
    offset: ["start 70%", "end 18%"],
  });

  const mainX = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const mainY = useTransform(scrollYProgress, [0, 1], [20, -24]);
  const mainScale = useTransform(scrollYProgress, [0, 1], [0.965, 1.035]);
  const observeY = useTransform(scrollYProgress, [0, 1], [8, -54]);
  const observeX = useTransform(scrollYProgress, [0, 1], [42, -8]);
  const observeScale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const observeOpacity = useTransform(scrollYProgress, [0, 0.42, 1], [0.56, 0.86, 0.98]);
  const gpuY = useTransform(scrollYProgress, [0, 1], [72, 12]);
  const gpuX = useTransform(scrollYProgress, [0, 1], [-42, -58]);
  const gpuScale = useTransform(scrollYProgress, [0, 1], [0.84, 0.98]);
  const gpuOpacity = useTransform(scrollYProgress, [0, 0.42, 1], [0.5, 0.82, 0.96]);
  const collabY = useTransform(scrollYProgress, [0, 1], [-4, -76]);
  const collabX = useTransform(scrollYProgress, [0, 1], [26, -18]);
  const collabScale = useTransform(scrollYProgress, [0, 1], [0.88, 1.02]);
  const collabOpacity = useTransform(scrollYProgress, [0, 0.36, 1], [0.48, 0.84, 1]);

  const mainStyle = prefersReducedMotion ? undefined : { x: mainX, y: mainY, scale: mainScale };
  const observeStyle = prefersReducedMotion
    ? undefined
    : { x: observeX, y: observeY, scale: observeScale, opacity: observeOpacity };
  const gpuStyle = prefersReducedMotion
    ? undefined
    : { x: gpuX, y: gpuY, scale: gpuScale, opacity: gpuOpacity };
  const collabStyle = prefersReducedMotion
    ? undefined
    : { x: collabX, y: collabY, scale: collabScale, opacity: collabOpacity };

  return (
    <div ref={ref} className="hero-visual hero-product-float">
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
  );
}
