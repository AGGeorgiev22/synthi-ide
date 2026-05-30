import { cn } from "@/lib/utils";

/**
 * Vectant mark — bracketed "V" with gradient corner accents.
 * Reproduces /public/Vectant-logo-white.svg as scalable JSX so we can
 * control color and size. Gradient id is unique to allow multiple instances.
 */
export function VectantMark({ className, gradientId = "vt-mark" }) {
  return (
    <svg
      viewBox="16 0 72 64"
      fill="none"
      className={className}
      role="img"
      aria-label="Vectant"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF3DBE" />
          <stop offset="35%" stopColor="#FF5C2A" />
          <stop offset="70%" stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <path d="M30 12 H24 V52 H30" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
      <path d="M74 12 H80 V52 H74" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
      <path d="M18 6 H24 M18 6 V12" stroke="#FF3DBE" strokeWidth="2" strokeLinecap="square" />
      <path d="M86 6 H80 M86 6 V12" stroke="#FF5C2A" strokeWidth="2" strokeLinecap="square" />
      <path d="M18 58 H24 M18 58 V52" stroke="#22D3EE" strokeWidth="2" strokeLinecap="square" />
      <path d="M86 58 H80 M86 58 V52" stroke="#7C5CFF" strokeWidth="2" strokeLinecap="square" />
      <path d={`M38 18 L52 44 L66 18`} stroke={`url(#${gradientId})`} strokeWidth="6" strokeLinecap="square" />
    </svg>
  );
}

/**
 * Full lockup: mark + VECTANT wordmark.
 */
export function Logo({ className, markClassName, gradientId = "vt-logo", showWord = true }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-ink", className)}>
      <VectantMark gradientId={gradientId} className={cn("h-6 w-auto", markClassName)} />
      {showWord && (
        <span
          style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), var(--font-satoshi, "Satoshi"), ui-sans-serif, sans-serif' }}
          className="text-[16px] font-semibold tracking-[0.2em] text-ink"
        >
          VECTANT
        </span>
      )}
    </span>
  );
}

/* ---- Animated logo: the right bracket opens to hold the wordmark at the top
   of the page, then compresses to the exact original [V] once you scroll.
   Both pieces are cut from the SAME coordinates as VectantMark (viewBox
   16..88), so abutting them reproduces the original logo pixel-for-pixel. ---- */
function LeftPiece({ gradientId = "vt-vnav" }) {
  // left corner ticks + left bracket + V chevron (x16..70 of the original)
  return (
    <svg viewBox="16 0 54 64" fill="none" className="h-6 w-auto shrink-0" role="img" aria-label="Vectant">
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
function RightPiece() {
  // right bracket + right corner ticks (x70..88 of the original)
  return (
    <svg viewBox="70 0 18 64" fill="none" className="h-6 w-auto shrink-0" aria-hidden="true">
      <path d="M74 12 H80 V52 H74" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
      <path d="M86 6 H80 M86 6 V12" stroke="#FF5C2A" strokeWidth="2" strokeLinecap="square" />
      <path d="M86 58 H80 M86 58 V52" stroke="#7C5CFF" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

export function AnimatedLogo({ expanded = true, className }) {
  return (
    <span className={cn("inline-flex items-center text-ink", className)}>
      <LeftPiece />
      <span
        style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk"), var(--font-satoshi, "Satoshi"), ui-sans-serif, sans-serif' }}
        className={cn(
          "overflow-hidden whitespace-nowrap text-[16px] font-semibold tracking-[0.2em] text-ink transition-[max-width,opacity,margin,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          expanded ? "mx-2 max-w-[150px] opacity-100 blur-0" : "mx-0 max-w-0 opacity-0 blur-[2px]"
        )}
      >
        VECTANT
      </span>
      <RightPiece />
    </span>
  );
}
