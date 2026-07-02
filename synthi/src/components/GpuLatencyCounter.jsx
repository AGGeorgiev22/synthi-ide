"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const TARGET_MS = 90;
const DURATION_MS = 1050;

function easeOutCubic(progress) {
  return 1 - Math.pow(1 - progress, 3);
}

export function GpuLatencyCounter() {
  const ref = useRef(null);
  const frameRef = useRef(0);
  const hasRunRef = useRef(false);
  const [value, setValue] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setValue(TARGET_MS);
      return undefined;
    }

    const node = ref.current;
    if (!node) {
      return undefined;
    }

    const runCounter = () => {
      if (hasRunRef.current) {
        return;
      }

      hasRunRef.current = true;
      const start = performance.now();
      let lastValue = -1;

      const tick = (now) => {
        const elapsed = Math.min(1, (now - start) / DURATION_MS);
        const nextValue = Math.round(TARGET_MS * easeOutCubic(elapsed));

        if (nextValue !== lastValue) {
          lastValue = nextValue;
          setValue(nextValue);
        }

        if (elapsed < 1) {
          frameRef.current = requestAnimationFrame(tick);
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runCounter();
          observer.disconnect();
        }
      },
      { rootMargin: "-12% 0px -18%", threshold: 0.28 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={ref} className="gpu-latency-counter" aria-label="Sub 90ms GPU HMR edit to visual, no matter the size of your project">
      <span>GPU HMR edit to visual</span>
      <strong>
        <span>sub</span>
        <span className="gpu-latency-value">
          {value}
          <span className="gpu-latency-unit">ms</span>
        </span>
      </strong>
      <p>No matter the size of your project.</p>
    </div>
  );
}
