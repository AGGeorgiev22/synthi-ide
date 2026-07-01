"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";

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

function StepCard({ step, index, reduce }) {
  return (
    <motion.article
      key={step.verb}
      className="agent-onramp-step-card"
      initial={reduce ? false : { opacity: 0, y: 72, scale: 0.975 }}
      animate={reduce ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -72, scale: 0.985 }}
      transition={{ duration: reduce ? 0 : 0.54, ease: [0.16, 1, 0.3, 1] }}
    >
      <span>Step {index + 1} / 3</span>
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
    const nextIndex = latest < 0.24 ? 0 : latest < 0.55 ? 1 : 2;
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
            </div>
            <div className="agent-onramp-step-stage">
              <AnimatePresence mode="wait" initial={false}>
                <StepCard step={STEPS[activeIndex]} index={activeIndex} reduce={reduce} />
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
