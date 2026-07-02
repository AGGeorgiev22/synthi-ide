"use client";

import { useRef, useState } from "react";
import { LayoutGroup, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

const STEPS = [
  {
    verb: "Attach",
    state: "runtime attached",
    title: "Connect the agents and tools you already use.",
    copy: "CLI agents, MCP tools, VS Code paths, repo state, browser state, and terminal context share one runtime view.",
    signal: "repo, tools, browser, terminal",
    accent: "#ff3dbe",
    accent2: "#ff6a3d",
    tracks: ["CLI agent", "MCP tools", "VS Code path"],
  },
  {
    verb: "Constrain",
    state: "write leased",
    title: "Lease every write before it starts.",
    copy: "MutationLeases define files, routes, inputs, protected paths, and required proof before an agent mutates code.",
    signal: "leases, policy, protected paths",
    accent: "#ff9f43",
    accent2: "#ffd166",
    tracks: ["MutationLease", "protected paths", "proof gate"],
  },
  {
    verb: "Land",
    state: "proof packet",
    title: "Review the landing, not the story.",
    copy: "Inspect replay, line provenance, preserved runtime state, clearance, and output proof before production-bound work merges.",
    signal: "replay, proof, landing",
    accent: "#22d3ee",
    accent2: "#8b7bff",
    tracks: ["line proof", "replay ledger", "review packet"],
  },
];

function ChromaStep({ step, index, activeIndex, reduce }) {
  const isActive = index === activeIndex;
  const isPast = index < activeIndex;
  const status = isPast ? "sealed" : isActive ? "active" : "queued";

  return (
    <motion.article
      key={step.verb}
      data-onramp-step
      className={`agent-onramp-chroma-step agent-onramp-chroma-step-${status}`}
      style={{ "--step-accent": step.accent, "--step-accent-2": step.accent2 }}
      initial={false}
      animate={
        reduce
          ? { opacity: 1, y: 0, scale: 1 }
          : isActive
            ? { opacity: 1, y: 0, scale: 1 }
            : {
                opacity: isPast ? 0.58 : 0.42,
                y: 0,
                scale: 1,
              }
      }
      transition={{ duration: reduce ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
    >
      {isActive ? (
        <motion.span
          layoutId="agent-onramp-active-brackets"
          className="agent-onramp-card-brackets"
          aria-hidden="true"
          initial={false}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{
            opacity: { duration: reduce ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: reduce ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] },
            layout: {
              type: "spring",
              stiffness: reduce ? 1000 : 430,
              damping: reduce ? 100 : 42,
              mass: 0.72,
            },
          }}
        >
          <i />
          <i />
          <i />
          <i />
        </motion.span>
      ) : null}
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
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const setStepFromProgress = (latest) => {
    if (reduce) return;
    const nextIndex = latest < 0.34 ? 0 : latest < 0.67 ? 1 : 2;
    if (nextIndex !== activeIndexRef.current) {
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }
  };

  useMotionValueEvent(scrollYProgress, "change", setStepFromProgress);

  return (
    <section id="bring-agent" ref={ref} className="runtime-campaign agent-onramp scroll-mt-32 py-24 md:py-36">
      <div className="agent-onramp-track mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="agent-onramp-grid">
          <motion.div
            className="agent-onramp-copy"
            initial={reduce ? false : { opacity: 0.72, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.34 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2>Bring your agents into a governed runtime.</h2>
            <p>
              Keep your CLI agents, MCP tools, editor paths, repo, browser, and terminal. Vectant makes authority explicit with leases before mutation, proof before landing, and revocation when evidence fails.
            </p>
          </motion.div>

          <motion.div className={`agent-onramp-panel ${reduce ? "agent-onramp-reduced" : ""}`}>
            <div className="agent-onramp-panel-top">
              <span>agent authority path</span>
              <strong>scoped / replayable / revocable</strong>
            </div>
            <LayoutGroup id="agent-onramp-bracket-group">
              <div className="agent-onramp-chroma-stage">
                {STEPS.map((step, index) => (
                  <ChromaStep
                    key={step.verb}
                    step={step}
                    index={index}
                    activeIndex={activeIndex}
                    reduce={reduce}
                  />
                ))}
              </div>
            </LayoutGroup>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
