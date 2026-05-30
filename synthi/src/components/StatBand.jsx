"use client";

import { useEffect, useState } from "react";
import { useActive, useReducedMotion } from "@/components/lib/useMotion";
import { useWaitlistCount } from "@/components/lib/useWaitlistCount";
import { cn } from "@/lib/utils";

/** Count up to `target` once on screen. */
function useCountUp(target, active, reduced) {
  const [n, setN] = useState(reduced ? target : 0);
  useEffect(() => {
    if (reduced || !active || target <= 0) {
      setN(target);
      return;
    }
    let raf = 0;
    let start = 0;
    const dur = 1100;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, reduced]);
  return n;
}

export function StatBand() {
  const reduced = useReducedMotion();
  const [ref, active] = useActive("0px 0px -15% 0px");
  // shared single fetch across the page (stat band + hero/CTA counters)
  const count = useWaitlistCount() ?? 0;

  const animated = useCountUp(count, active, reduced);
  const hasCount = count > 0;
  // 0.18s tracked in hundredths so it can ease up like the waitlist figure
  const buildCs = useCountUp(18, active, reduced);

  return (
    <section className="relative bg-bg-2/40">
      <div ref={ref} className="mx-auto grid max-w-7xl grid-cols-1 px-5 sm:grid-cols-3 sm:px-8">
        <Stat
          value={hasCount ? `${animated.toLocaleString()}+` : "Private"}
          label={hasCount ? "developers on the waitlist" : "beta - early access now open"}
        />
        <Stat value={`${(buildCs / 100).toFixed(2)}s`} label="median cloud build, not minutes" />
        <Stat value="Any" label="agent, language, or runtime" />
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-10 text-center sm:py-12">
      <div className={cn("stat-num font-display text-[40px] font-semibold leading-none tracking-[-0.03em] sm:text-[52px]")}>
        {value}
      </div>
      <div className="mt-1 text-[12.5px] text-ink-faint">{label}</div>
    </div>
  );
}
