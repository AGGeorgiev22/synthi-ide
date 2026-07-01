"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";

const STEPS = [
  {
    verb: "Bring",
    state: "agent attached",
    title: "Bring the agent you already trust.",
    copy: "Keep your CLI agent, MCP tools, VS Code extensions, and the workflows your team already believes in.",
    signal: "repo, tools, browser, terminal",
    accent: "#ff3dbe",
    accent2: "#ff6a3d",
    tracks: ["CLI agent", "MCP tools", "VS Code path"],
  },
  {
    verb: "License",
    state: "authority scoped",
    title: "Make its authority explicit.",
    copy: "Vectant gives the agent scoped leases, Vectant licenses, runtime context, and evidence gates.",
    signal: "leases, policy, no-fly zones",
    accent: "#ff9f43",
    accent2: "#ffd166",
    tracks: ["MutationLease", "Vectant license", "policy gate"],
  },
  {
    verb: "Ship",
    state: "proof ready",
    title: "Let serious work land.",
    copy: "Vectant lands production-bound changes with replay, line provenance, preserved state, Vectant clearance, and reviewable output.",
    signal: "replay, proof, landing",
    accent: "#22d3ee",
    accent2: "#8b7bff",
    tracks: ["line proof", "black box", "review packet"],
  },
];

function ChromaStep({ step, index, activeIndex, reduce }) {
  const isActive = index === activeIndex;
  const isPast = index < activeIndex;
  const status = isPast ? "sealed" : isActive ? "active" : "queued";

  return (
    <motion.article
      key={step.verb}
      className={`agent-onramp-chroma-step agent-onramp-chroma-step-${status}`}
      style={{ "--step-accent": step.accent, "--step-accent-2": step.accent2 }}
      initial={false}
      animate={
        reduce
          ? { opacity: 1, y: 0, scale: 1 }
          : isActive
            ? { opacity: 1, y: -8, scale: 1 }
            : {
                opacity: isPast ? 0.58 : 0.42,
                y: isPast ? -4 : 6,
                scale: 0.97,
              }
      }
      transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="agent-onramp-chroma-step-top">
        <span>{step.verb}</span>
        <strong>{isActive ? step.state : status}</strong>
      </div>
      <h3>{step.title}</h3>
      <p>{step.copy}</p>
      <div className="agent-onramp-chroma-tracks" aria-label={`${step.verb} runtime tracks`}>
        {step.tracks.map((track) => (
          <span key={track}>{track}</span>
        ))}
      </div>
      <small>{step.signal}</small>
    </motion.article>
  );
}

export function AgentOnRamp() {
  const ref = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [24, -20]);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (reduce) return;
    const phase = Math.min(2.999, Math.max(0, latest * STEPS.length));
    const nextIndex = Math.min(STEPS.length - 1, Math.floor(phase));
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  return (
    <section id="bring-agent" ref={ref} className="runtime-campaign agent-onramp surface-dark scroll-mt-32 bg-[#070708] py-24 text-white md:py-36">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="agent-onramp-grid">
          <motion.div
            className="agent-onramp-copy"
            initial={reduce ? false : { opacity: 0.72, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.34 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2>Bring your agent. Make its authority explicit.</h2>
            <p>
              Keep the agents, MCP tools, and VS Code extensions your team trusts. Vectant gives them leases, licenses, preserved state, and evidence gates before production-bound work can land.
            </p>
          </motion.div>

          <motion.div className={`agent-onramp-panel ${reduce ? "agent-onramp-reduced" : ""}`} style={reduce ? undefined : { y }}>
            <div className="agent-onramp-panel-top">
              <span>Up and running, one step at a time</span>
              <strong>live authority rail</strong>
            </div>
            <div className="agent-onramp-chroma-stage">
              {STEPS.map((step, index) => (
                <ChromaStep
                  key={step.verb}
                  step={step}
                  index={index}
                  activeIndex={reduce ? index : activeIndex}
                  reduce={reduce}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
