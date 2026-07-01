"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

const STEPS = [
  {
    verb: "Bring",
    state: "agent attached",
    title: "Bring the tools your team already trusts.",
    copy: "CLI agents, MCP tools, VS Code extensions, repo, browser, and terminal attach to one cloud runtime.",
    signal: "repo, tools, browser, terminal",
    accent: "#ff3dbe",
    accent2: "#ff6a3d",
    tracks: ["CLI agent", "MCP tools", "VS Code path"],
  },
  {
    verb: "License",
    state: "authority scoped",
    title: "Give every action a boundary.",
    copy: "MutationLeases define files, routes, inputs, no-fly zones, and proof requirements before the agent mutates code.",
    signal: "leases, policy, no-fly zones",
    accent: "#ff9f43",
    accent2: "#ffd166",
    tracks: ["MutationLease", "Vectant license", "policy gate"],
  },
  {
    verb: "Ship",
    state: "proof ready",
    title: "Land work with evidence attached.",
    copy: "Review replay, line provenance, preserved state, clearance, and output proof before production-bound changes merge.",
    signal: "replay, proof, landing",
    accent: "#22d3ee",
    accent2: "#8b7bff",
    tracks: ["line proof", "black box", "review packet"],
  },
];

const DEFAULT_BORDER_METRICS = [
  { top: 28, height: 158 },
  { top: 200, height: 158 },
  { top: 372, height: 158 },
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
  const stageRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [borderMetrics, setBorderMetrics] = useState(DEFAULT_BORDER_METRICS);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [24, -20]);
  const stepStops = STEPS.map((_, index) => index / (STEPS.length - 1));
  const borderTop = useTransform(
    scrollYProgress,
    stepStops,
    borderMetrics.map((metric) => metric.top),
  );
  const borderHeight = useTransform(
    scrollYProgress,
    stepStops,
    borderMetrics.map((metric) => metric.height),
  );
  const borderY = useSpring(borderTop, { stiffness: 210, damping: 30, mass: 0.42 });
  const borderH = useSpring(borderHeight, { stiffness: 210, damping: 30, mass: 0.42 });
  const borderAngle = useTransform(scrollYProgress, [0, 1], ["-80deg", "280deg"]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const measure = () => {
      const stageRect = stage.getBoundingClientRect();
      const nextMetrics = Array.from(stage.querySelectorAll("[data-onramp-step]")).map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          top: rect.top - stageRect.top,
          height: rect.height,
        };
      });

      if (nextMetrics.length !== STEPS.length) return;

      setBorderMetrics((current) => {
        const unchanged = nextMetrics.every((metric, index) => {
          const previous = current[index];
          return previous && Math.abs(previous.top - metric.top) < 0.5 && Math.abs(previous.height - metric.height) < 0.5;
        });
        return unchanged ? current : nextMetrics;
      });
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(stage);
    Array.from(stage.querySelectorAll("[data-onramp-step]")).forEach((node) => resizeObserver.observe(node));
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

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
            <h2>Keep your agent. Put it under runtime authority.</h2>
            <p>
              Vectant wraps CLI agents, MCP tools, and VS Code extensions with MutationLeases, proof gates, preserved state, and revocable licenses.
            </p>
          </motion.div>

          <motion.div className={`agent-onramp-panel ${reduce ? "agent-onramp-reduced" : ""}`} style={reduce ? undefined : { y }}>
            <div className="agent-onramp-panel-top">
              <span>Up and running, one step at a time</span>
              <strong>live authority rail</strong>
            </div>
            <div ref={stageRef} className="agent-onramp-chroma-stage">
              <motion.div
                className="agent-onramp-scroll-border"
                aria-hidden="true"
                style={
                  reduce
                    ? {
                        y: borderMetrics[0]?.top ?? DEFAULT_BORDER_METRICS[0].top,
                        height: borderMetrics[0]?.height ?? DEFAULT_BORDER_METRICS[0].height,
                      }
                    : {
                        y: borderY,
                        height: borderH,
                        "--onramp-border-angle": borderAngle,
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
