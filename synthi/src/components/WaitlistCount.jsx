"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/lib/useMotion";
import { useWaitlistCount } from "@/components/lib/useWaitlistCount";
import { cn } from "@/lib/utils";

/**
 * Live social-proof counter. Reads the real signup count from GET /api/waitlist
 * and counts up to it. Degrades gracefully: while loading it reserves space, and
 * if the DB is unreachable (count 0 / error) it shows honest "be among the first"
 * copy instead of a bare "0".
 */
export function WaitlistCount({ className, label = "on the waitlist" }) {
  const reduced = useReducedMotion();
  const count = useWaitlistCount(); // shared single fetch; null = loading
  const [display, setDisplay] = useState(0);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // ease-out count-up once the real number lands
  useEffect(() => {
    if (count == null || count <= 0) return;
    if (reduced) {
      setDisplay(count);
      return;
    }
    let start = null;
    const dur = Math.min(1400, 450 + count * 5);
    const tick = (t) => {
      if (start == null) start = t;
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setDisplay(Math.round(count * eased));
      if (k < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [count, reduced]);

  // hold layout height steady while the count loads
  if (count == null) {
    return <div className={cn("h-[18px]", className)} aria-hidden="true" />;
  }

  return (
    <div className={cn("inline-flex items-center gap-2 text-[13px] text-ink-dim", className)}>
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full rounded-full bg-ok/50 presence-pulse" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-ok shadow-[0_0_6px_var(--color-ok)]" />
      </span>
      {count > 0 ? (
        <span>
          <span className="font-semibold text-ink tabular-nums">{display.toLocaleString()}</span>{" "}
          {count === 1 ? "developer" : "developers"} {label}
        </span>
      ) : (
        <span>Be among the first on the private beta</span>
      )}
    </div>
  );
}
