"use client";

import { useId } from "react";

/**
 * Custom brand marks for the "eyes and hands" metaphor - they animate the idea
 * instead of sitting still like a stock glyph. Monochrome via `currentColor`, so
 * they adopt whatever colour the parent sets. All motion pauses under reduced
 * motion (handled in globals.css). Keyframes: eye-scan / eye-line / eye-pulse /
 * hand-tap / hand-ripple.
 */

/** A watching eye: the iris sweeps as if reading the running program and a faint
 *  scan line passes across the lens. */
export function ScanEye({ size = 18, className, strokeWidth = 1.6 }) {
  const uid = useId().replace(/[:]/g, "");
  const clip = `eyeclip-${uid}`;
  const lens = "M2.5 12 C 6 6.4, 18 6.4, 21.5 12 C 18 17.6, 6 17.6, 2.5 12 Z";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <path d={lens} />
        </clipPath>
      </defs>
      <path d={lens} stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <g clipPath={`url(#${clip})`}>
        <line className="eye-line" x1="2.5" y1="12" x2="21.5" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.45" />
        <g className="eye-scan">
          <circle cx="12" cy="12" r="3.3" stroke="currentColor" strokeWidth={strokeWidth} />
          <circle className="eye-pulse" cx="12" cy="12" r="1.5" fill="currentColor" />
        </g>
      </g>
    </svg>
  );
}

/** A pointer that taps: it presses down and a ripple blooms from the hotspot -
 *  "act on what it sees". */
export function ActHand({ size = 18, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle className="hand-ripple" cx="8" cy="6.6" r="3.6" stroke="currentColor" strokeWidth="1.3" />
      <g className="hand-tap">
        <path
          d="M8 6.6 L8 18.4 L10.9 15.6 L13.1 20.4 L15.1 19.5 L12.9 14.8 L16.8 14.6 Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/** A compact verification pulse mark for proving a fix moved from signal -> state. */
export function PulseVerify({ size = 18, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3.5 12h3.5l2.7-7.2L12 18.2l2.3-5.8h6.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20.2" cy="9.3" r="1.6" fill="currentColor" opacity="0.75" />
      <circle
        cx="20.2"
        cy="9.3"
        r="4"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.5"
      />
    </svg>
  );
}
