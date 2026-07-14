"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

import styles from "./Logo.module.css";

function safeId(value) {
  return value.replaceAll(":", "");
}

export function VectantMark({
  className,
  gradientId,
  monochrome = false,
  decorative = false,
}) {
  const generatedId = useId();
  const resolvedGradientId = gradientId || `vt-mark-${safeId(generatedId)}`;
  const cornerA = monochrome ? "currentColor" : "#FF3DBE";
  const cornerB = monochrome ? "currentColor" : "#FF5C2A";
  const cornerC = monochrome ? "currentColor" : "#22D3EE";
  const cornerD = monochrome ? "currentColor" : "#7C5CFF";
  const veeStroke = monochrome ? "currentColor" : `url(#${resolvedGradientId})`;

  return (
    <svg
      viewBox="16 0 72 64"
      fill="none"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : "Vectant"}
    >
      <defs>
        <linearGradient id={resolvedGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF3DBE" />
          <stop offset="35%" stopColor="#FF5C2A" />
          <stop offset="70%" stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <path d="M30 12 H24 V52 H30" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
      <path d="M74 12 H80 V52 H74" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
      <path d="M18 6 H24 M18 6 V12" stroke={cornerA} strokeWidth="2" strokeLinecap="square" />
      <path d="M86 6 H80 M86 6 V12" stroke={cornerB} strokeWidth="2" strokeLinecap="square" />
      <path d="M18 58 H24 M18 58 V52" stroke={cornerC} strokeWidth="2" strokeLinecap="square" />
      <path d="M86 58 H80 M86 58 V52" stroke={cornerD} strokeWidth="2" strokeLinecap="square" />
      <path d="M38 18 L52 44 L66 18" stroke={veeStroke} strokeWidth="6" strokeLinecap="square" />
    </svg>
  );
}

export function Logo({ className, markClassName, gradientId, showWord = true }) {
  return (
    <span role="img" aria-label="Vectant" className={cn(styles.logo, "text-ink", className)}>
      <VectantMark
        decorative
        gradientId={gradientId}
        className={cn("h-6 w-auto", markClassName)}
      />
      {showWord && (
        <span aria-hidden="true" className={styles.wordShell}>
          <span className={styles.wordTrack}>
            <span
              style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), var(--font-satoshi, "Satoshi"), ui-sans-serif, sans-serif' }}
              className={styles.word}
            >
              VECTANT
            </span>
          </span>
        </span>
      )}
    </span>
  );
}

export function AnimatedLogo({ expanded = true, className }) {
  const generatedId = useId();
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const gradientId = `vt-nav-${safeId(generatedId)}`;
  const showWord = expanded || hovered;

  return (
    <motion.span
      role="img"
      aria-label="Vectant"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={cn(
        styles.animatedLogo,
        "text-[#f1eee8]",
        showWord && styles.animatedLogoExpanded,
        reduceMotion && styles.reduceMotion,
        className
      )}
    >
      <VectantMark
        decorative
        gradientId={gradientId}
        className="h-6 w-auto shrink-0"
      />
      <span
        aria-hidden="true"
        className={styles.wordShell}
      >
        <span className={styles.wordTrack}>
          <span
            style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), var(--font-satoshi, "Satoshi"), ui-sans-serif, sans-serif' }}
            className={styles.word}
          >
            VECTANT
          </span>
        </span>
      </span>
    </motion.span>
  );
}
