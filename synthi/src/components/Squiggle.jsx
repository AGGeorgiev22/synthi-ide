"use client";

import { useInView, useReducedMotion } from "@/components/lib/useMotion";
import { cn } from "@/lib/utils";

/**
 * Hand-drawn squiggle accent. Rather than looping, the stroke draws itself in
 * once - the line appears to be sketched in real time the moment it scrolls into
 * view (stroke-dashoffset 1 -> 0 over ~1.1s, then it rests, fully drawn).
 * Colour comes from the parent via `currentColor`. Reduced motion shows it
 * already complete. `pathLength="1"` normalises the dash math so it works at any
 * width.
 */
export function Squiggle({ className, strokeWidth = 2.4 }) {
  const [ref, inView] = useInView({ threshold: 0.6 });
  const reduced = useReducedMotion();
  const drawn = reduced || inView;

  return (
    <span ref={ref} className={cn("block", className)} aria-hidden="true">
      <svg viewBox="0 0 120 12" preserveAspectRatio="none" fill="none" className="h-full w-full">
        <path
          d="M2 7 Q 9 1 17 6 T 32 6 T 47 6 T 62 6 T 77 6 T 92 6 T 107 6 T 118 6"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          vectorEffect="non-scaling-stroke"
          style={{
            strokeDasharray: 1,
            strokeDashoffset: drawn ? 0 : 1,
            transition: reduced ? "none" : "stroke-dashoffset 1.1s var(--ease-out-soft)",
          }}
        />
      </svg>
    </span>
  );
}
