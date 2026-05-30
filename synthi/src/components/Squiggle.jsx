"use client";

import { useInView, useReducedMotion } from "@/components/lib/useMotion";
import { cn } from "@/lib/utils";

/**
 * Hand-drawn squiggle accent. The stroke draws itself in once - the line appears
 * sketched in real time (stroke-dashoffset 1 -> 0), then rests, fully drawn.
 * Colour comes from the parent via `currentColor`. Reduced motion shows it
 * already complete. `pathLength="1"` normalises the dash math so it works at any
 * width.
 *
 * Two modes:
 *  - uncontrolled (default): draws once when it scrolls into view.
 *  - controlled: pass `drawn` and it follows that flag, drawing left-to-right
 *    when true and un-drawing (retracting right-to-left) when false. Used under
 *    the hero's cycling headline so the underline erases as the phrase deletes.
 *    The erase runs quicker than the draw so it keeps pace with the deletion.
 */
export function Squiggle({ className, strokeWidth = 2.4, drawn, drawMs = 1100 }) {
  const [ref, inView] = useInView({ threshold: 0.6 });
  const reduced = useReducedMotion();
  const controlled = drawn !== undefined;
  const isDrawn = reduced ? true : controlled ? drawn : inView;
  // erase faster than we draw, so it stays in step with the deleting text
  const ms = controlled && !drawn ? Math.round(drawMs * 0.46) : drawMs;

  return (
    <span
      ref={controlled ? undefined : ref}
      className={cn("block", className)}
      aria-hidden="true"
    >
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
            strokeDashoffset: isDrawn ? 0 : 1,
            transition: reduced ? "none" : `stroke-dashoffset ${ms}ms var(--ease-out-soft)`,
          }}
        />
      </svg>
    </span>
  );
}
