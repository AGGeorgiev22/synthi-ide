"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

import styles from "./Logo.module.css";

function safeId(value) {
  return value.replaceAll(":", "");
}

function VectantSignatureStart({ className, gradientId }) {
  return (
    <svg viewBox="16 0 55 64" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF3DBE" />
          <stop offset="35%" stopColor="#FF5C2A" />
          <stop offset="70%" stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <path d="M30 12 H24 V52 H30" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
      <path d="M18 6 H24 M18 6 V12" stroke="#FF3DBE" strokeWidth="2" strokeLinecap="square" />
      <path d="M18 58 H24 M18 58 V52" stroke="#22D3EE" strokeWidth="2" strokeLinecap="square" />
      <path d="M38 18 L52 44 L66 18" stroke={`url(#${gradientId})`} strokeWidth="6" strokeLinecap="square" />
    </svg>
  );
}

function VectantSignatureEnd({ className }) {
  return (
    <svg viewBox="72 0 16 64" fill="none" className={className} aria-hidden="true">
      <path d="M74 12 H80 V52 H74" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
      <path d="M86 6 H80 M86 6 V12" stroke="#FF5C2A" strokeWidth="2" strokeLinecap="square" />
      <path d="M86 58 H80 M86 58 V52" stroke="#7C5CFF" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

function SignatureWord() {
  return (
    <span aria-hidden="true" className={styles.wordShell}>
      <span className={styles.wordTrack}>
        <span
          style={{ fontFamily: "var(--font-brand)" }}
          className={styles.word}
        >
          VECTANT
        </span>
      </span>
    </span>
  );
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
  const generatedId = useId();
  const resolvedGradientId = gradientId || `vt-signature-${safeId(generatedId)}`;

  return (
    <span
      role="img"
      aria-label="Vectant"
      className={cn(styles.logo, showWord && styles.logoExpanded, "text-ink", markClassName, className)}
    >
      <VectantSignatureStart
        gradientId={resolvedGradientId}
        className={styles.signatureStart}
      />
      {showWord && <SignatureWord />}
      <VectantSignatureEnd className={styles.signatureEnd} />
    </span>
  );
}

export function AnimatedLogo({ expanded = true, interactive = true, className, markClassName }) {
  const generatedId = useId();
  const gradientId = `vt-nav-${safeId(generatedId)}`;

  return (
    <span
      role="img"
      aria-label="Vectant"
      className={cn(
        styles.animatedLogo,
        interactive && styles.animatedLogoInteractive,
        "text-[#f1eee8]",
        expanded && styles.animatedLogoExpanded,
        markClassName,
        className
      )}
    >
      <VectantSignatureStart
        gradientId={gradientId}
        className={styles.signatureStart}
      />
      <SignatureWord />
      <VectantSignatureEnd className={styles.signatureEnd} />
    </span>
  );
}
