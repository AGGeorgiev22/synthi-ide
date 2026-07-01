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

function StepCard({ step, index, activeIndex, reduce }) {
  const isActive = index === activeIndex;
  const isPast = index < activeIndex;

  return (
    <motion.article
      key={step.verb}
      className={`agent-onramp-step-card ${isActive ? "agent-onramp-step-card-active" : ""}`}
      aria-hidden={!isActive}
      initial={false}
      animate={
        reduce
          ? { opacity: 1, y: 0, scale: 1, rotateX: 0 }
          : isActive
            ? { opacity: 1, y: 0, scale: 1, rotateX: 0 }
            : {
                opacity: isPast ? 0 : 0.28,
                y: isPast ? -58 : 58,
                scale: isPast ? 0.975 : 0.94,
                rotateX: isPast ? 5 : -7,
              }
      }
      transition={{ duration: reduce ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] }}
      style={{ zIndex: isActive ? 3 : isPast ? 1 : 2 }}
    >
      <span>{step.verb}</span>
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
  const scaleX = useTransform(scrollYProgress, [0, 1], [0.12, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [24, -20]);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (reduce) return;
    const nextIndex = latest < 0.44 ? 0 : latest < 0.72 ? 1 : 2;
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
            <div className="agent-onramp-line-shell" aria-hidden="true">
              <motion.div className="agent-onramp-line" style={{ scaleX: reduce ? 1 : scaleX }} />
              <div className="agent-onramp-rail-labels">
                {STEPS.map((step, index) => (
                  <span
                    key={step.verb}
                    className={index <= activeIndex ? "agent-onramp-rail-step agent-onramp-rail-step-active" : "agent-onramp-rail-step"}
                  >
                    {step.verb}
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
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
