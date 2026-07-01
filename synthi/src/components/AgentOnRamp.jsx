"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";

const STEPS = [
  {
    verb: "Bring",
    title: "Bring the agent you already trust.",
    copy: "Keep your CLI agent, MCP tools, VS Code extensions, and the workflows your team already believes in.",
  },
  {
    verb: "License",
    title: "Make its authority explicit.",
    copy: "Vectant gives the agent scoped leases, Dojo Cortex licenses, runtime context, and evidence gates.",
  },
  {
    verb: "Ship",
    title: "Let serious work land.",
    copy: "Vectant lands production-bound changes with replay, line provenance, preserved state, CodeSite clearance, and reviewable output.",
  },
];

function StepCard({ step, index, activeIndex, reduce, progress }) {
  const isActive = index === activeIndex;
  const isPast = index < activeIndex;
  const state = isPast ? "sealed" : isActive ? "active" : "queued";
  const cardProgress = useTransform(progress, [index / STEPS.length, (index + 1) / STEPS.length], [0, 1], { clamp: true });
  const activeLift = useTransform(cardProgress, [0, 1], [18, -8]);
  const activeScale = useTransform(cardProgress, [0, 1], [0.965, 1]);

  return (
    <motion.article
      key={step.verb}
      className={`agent-onramp-step-card agent-onramp-step-card-${state} ${isActive ? "agent-onramp-step-card-active" : ""}`}
      aria-hidden={!isActive}
      initial={false}
      animate={
        reduce
          ? { opacity: 1, y: 0, scale: 1, rotateX: 0 }
          : isActive
            ? { opacity: 1, rotateX: 0 }
            : {
                opacity: isPast ? 0.34 : 0.22,
                y: isPast ? -36 - index * 8 : 62 + index * 12,
                scale: isPast ? 0.91 : 0.94,
                rotateX: isPast ? 4 : -6,
              }
      }
      transition={{ duration: reduce ? 0 : 0.82, ease: [0.16, 1, 0.3, 1] }}
      style={isActive && !reduce ? { y: activeLift, scale: activeScale, zIndex: 3 } : { zIndex: isPast ? 1 : 2 }}
    >
      <span>{step.verb} / {state}</span>
      <h3>{step.title}</h3>
      <p>{step.copy}</p>
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
  const spineY = useTransform(scrollYProgress, [0, 1], [0, 220]);
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
              <strong>real repo required</strong>
            </div>
            <div className="agent-onramp-authority-spine" aria-hidden="true">
              <motion.div className="agent-onramp-spine-cursor" style={reduce ? undefined : { y: spineY }} />
              <div className="agent-onramp-spine-steps">
                {STEPS.map((step, index) => (
                  <span
                    key={step.verb}
                    className={index < activeIndex ? "agent-onramp-spine-step agent-onramp-spine-step-sealed" : index === activeIndex ? "agent-onramp-spine-step agent-onramp-spine-step-active" : "agent-onramp-spine-step"}
                  >
                    <b>{step.verb}</b>
                    <em>{index < activeIndex ? "sealed" : index === activeIndex ? "active" : "queued"}</em>
                  </span>
                ))}
              </div>
            </div>
            <div className="agent-onramp-step-stage">
              {STEPS.map((step, index) => (
                <StepCard
                  key={step.verb}
                  step={step}
                  index={index}
                  activeIndex={reduce ? index : activeIndex}
                  reduce={reduce}
                  progress={scrollYProgress}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
