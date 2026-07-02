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
    const node = ref.current;
    const valueNode = valueRef.current;
    const setCounter = (nextValue) => {
      if (valueNode) {
        valueNode.textContent = String(nextValue);
      }
    };
    const setDone = (isDone) => {
      node?.setAttribute("data-counter-done", isDone ? "true" : "false");
    };

    if (prefersReducedMotion) {
      setCounter(TARGET_MS);
      setDone(true);
      return undefined;
    }

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
      setDone(false);

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
          setDone(true);
          if (visibleRef.current) {
            timeoutRef.current = window.setTimeout(runCounter, REPLAY_DELAY_MS);
          }
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    };

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

    observer.observe(node);

    return () => {
      observer.disconnect();
      stopCounter();
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className="gpu-latency-counter"
      data-counter-done="false"
      aria-label="Sub 90ms GPU HMR edit to visual on scoped ROCm/HIP proof runs"
    >
      <span>Sub 90ms GPU HMR edit to visual</span>
      <strong>
        <span>sub</span>
        <span className="gpu-latency-value">
          <span ref={valueRef} className="gpu-latency-number">
            0
          </span>
          <span className="gpu-latency-unit">ms</span>
        </span>
      </strong>
      <svg className="gpu-latency-underline" viewBox="0 0 420 34" aria-hidden="true" focusable="false">
        <path pathLength="1" d="M7 22 C 76 11 140 24 213 16 S 346 10 413 20" />
      </svg>
      <p>Target proof loop: edit, compile, visual, even as project size grows. Re-run it on your project as the proof gate.</p>
    </div>
  );
}
