"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";

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

const DEFAULT_BORDER_METRICS = {
  tops: [28, 200, 372],
  height: 158,
};

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
  const stageRef = useRef(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [borderMetrics, setBorderMetrics] = useState(DEFAULT_BORDER_METRICS);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const borderTargetY = useMotionValue(DEFAULT_BORDER_METRICS.tops[0]);
  const borderY = useSpring(borderTargetY, { stiffness: 360, damping: 34, mass: 0.28 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    let frame = 0;

    const measure = () => {
      const stageRect = stage.getBoundingClientRect();
      const measured = Array.from(stage.querySelectorAll("[data-onramp-step]")).map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          top: rect.top - stageRect.top,
          height: rect.height,
        };
      });

      if (measured.length !== STEPS.length) return;

      const nextMetrics = {
        tops: measured.map((metric) => metric.top),
        height: Math.max(...measured.map((metric) => metric.height)),
      };

      setBorderMetrics((current) => {
        const unchanged =
          Math.abs(current.height - nextMetrics.height) < 0.5 &&
          nextMetrics.tops.every((top, index) => Math.abs((current.tops[index] ?? 0) - top) < 0.5);
        return unchanged ? current : nextMetrics;
      });
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    scheduleMeasure();
    window.addEventListener("resize", scheduleMeasure);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, []);

  useEffect(() => {
    borderTargetY.set(borderMetrics.tops[activeIndex] ?? DEFAULT_BORDER_METRICS.tops[0]);
  }, [activeIndex, borderMetrics, borderTargetY]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (reduce) return;
    const nextIndex = latest < 0.3 ? 0 : latest < 0.66 ? 1 : 2;
    if (nextIndex !== activeIndexRef.current) {
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }
  });

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
            <div ref={stageRef} className="agent-onramp-chroma-stage">
              <motion.div
                className="agent-onramp-scroll-border"
                aria-hidden="true"
                style={
                  reduce
                    ? {
                        y: borderMetrics.tops[0] ?? DEFAULT_BORDER_METRICS.tops[0],
                        height: borderMetrics.height ?? DEFAULT_BORDER_METRICS.height,
                      }
                    : {
                        y: borderY,
                        height: borderMetrics.height,
                      }
                }
              />
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
