"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const TARGET_MS = 90;
const DURATION_MS = 1280;
const REPLAY_DELAY_MS = 1800;

function easeOutCubic(progress) {
  return 1 - Math.pow(1 - progress, 3);
}

export function GpuLatencyCounter() {
  const ref = useRef(null);
  const valueRef = useRef(null);
  const frameRef = useRef(0);
  const timeoutRef = useRef(0);
  const visibleRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const valueNode = valueRef.current;
    const setCounter = (nextValue) => {
      if (valueNode) {
        valueNode.textContent = String(nextValue);
      }
    };

    if (prefersReducedMotion) {
      setCounter(TARGET_MS);
      return undefined;
    }

    const node = ref.current;
    if (!node) {
      return undefined;
    }

    const stopCounter = () => {
      cancelAnimationFrame(frameRef.current);
      clearTimeout(timeoutRef.current);
    };

    const runCounter = () => {
      stopCounter();
      const start = performance.now();
      let lastValue = -1;
      setCounter(0);

      const tick = (now) => {
        const elapsed = Math.max(0, Math.min(1, (now - start) / DURATION_MS));
        const nextValue = Math.round(TARGET_MS * easeOutCubic(elapsed));

        if (nextValue !== lastValue) {
          lastValue = nextValue;
          setCounter(nextValue);
        }

        if (elapsed < 1) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          setCounter(TARGET_MS);
          if (visibleRef.current) {
            timeoutRef.current = window.setTimeout(runCounter, REPLAY_DELAY_MS);
          }
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    };

    const observedNodes = [
      node,
      node.closest("#gpu-hmr") || document.querySelector("#gpu-hmr"),
    ].filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          visibleRef.current = true;
          runCounter();
        } else {
          visibleRef.current = false;
          stopCounter();
        }
      },
      { rootMargin: "20% 0px 20%", threshold: 0.01 },
    );

    observedNodes.forEach((observedNode) => observer.observe(observedNode));

    return () => {
      observer.disconnect();
      stopCounter();
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={ref} className="gpu-latency-counter" aria-label="Sub 90ms GPU HMR edit to visual, no matter the size of your project">
      <span>GPU HMR edit to visual</span>
      <strong>
        <span>sub</span>
        <span className="gpu-latency-value">
          <span ref={valueRef} className="gpu-latency-number">
            0
          </span>
          <span className="gpu-latency-unit">ms</span>
        </span>
      </strong>
      <p>No matter the size of your project.</p>
    </div>
  );
}
