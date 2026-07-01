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

  const mainStyle = prefersReducedMotion ? undefined : { x: mainX, y: mainY, scale: mainScale };
  const observeStyle = prefersReducedMotion
    ? undefined
    : { x: observeX, y: observeY, scale: observeScale, opacity: observeOpacity };
  const gpuStyle = prefersReducedMotion
    ? undefined
    : { x: gpuX, y: gpuY, scale: gpuScale, opacity: gpuOpacity };

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
        <div className="hero-collab-typing" aria-hidden="true">
          <div className="hero-collab-line hero-collab-line-human">
            <span className="hero-collab-cursor" />
            <span className="hero-collab-name">Priya</span>
            <span className="hero-collab-type hero-collab-type-a">adds lease guard</span>
          </div>
          <div className="hero-collab-line hero-collab-line-agent">
            <span className="hero-collab-cursor" />
            <span className="hero-collab-name">agent</span>
            <span className="hero-collab-type hero-collab-type-b">rewrites proof hook</span>
          </div>
        </div>
        <figcaption>
          <strong>MCP eyes and hands</strong>
          <span>browser, terminal, replay, workflow state</span>
        </figcaption>
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
