"use client";

import { Cpu, Wind, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

function RuntimeClock({ size = 15, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3.3 3.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" />
      <circle cx="15.7" cy="12.3" r="0.9" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

function HmrPulse({ size = 15, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5.2 18L12 5l3.7 7.2 3.1-.6-.8 3.2 3.2 1.2-12.7 1.7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 5L9 9.2h3l-1 6 4.7-8.8H12" stroke="currentColor" strokeWidth="1.15" opacity="0.7" />
    </svg>
  );
}

/* Side-by-side runtime comparison. The old version was a drag-to-reveal
   slider, but both panels shared the same right-aligned values, so at the
   midpoint you'd see the "Local IDE" header next to Vectant's green numbers -
   impossible to tell which value belonged to which side. This lays the two
   runtimes out as fixed columns (Local in red on the left, Vectant in green on
   the tinted right) so the difference reads at a glance. */
const METRICS = [
  { Icon: RuntimeClock, k: "Build time", local: "47.2s", vt: "0.18s" },
  { Icon: Cpu, k: "CPU usage", local: "98%", vt: "2%" },
  { Icon: Wind, k: "Cooling", local: "Jet engine", vt: "Silent" },
  { Icon: HmrPulse, k: "Hot reload", local: "Not supported", vt: "Instant" },
];

const COLS = "grid grid-cols-[1.25fr_1fr_1fr] sm:grid-cols-[1.4fr_1fr_1fr]";

export function BuildCompare() {
  return (
    <div className="surface-dark overflow-hidden rounded-2xl border border-line-2 bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
      {/* column headers */}
      <div className={cn(COLS, "border-b border-line")}>
        <div className="flex items-center px-5 py-3.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-faint sm:px-6">
          Runtime
        </div>
        <div className="flex items-center gap-2 px-3 py-3.5 sm:px-4">
          <span className="h-2 w-2 shrink-0 rounded-full bg-err" style={{ boxShadow: "0 0 8px #ff6b6b" }} />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-dim sm:text-[11px]">Local IDE</span>
        </div>
        <div className="flex items-center gap-2 border-l border-line bg-ok/[0.05] px-3 py-3.5 sm:px-4">
          <span className="h-2 w-2 shrink-0 rounded-full bg-ok pulse-ok" style={{ boxShadow: "0 0 8px #46e0a0" }} />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink sm:text-[11px]">Vectant Cloud</span>
        </div>
      </div>

      {/* metric rows */}
      {METRICS.map((m) => {
        const Icon = m.Icon;
        return (
          <div
            key={m.k}
            className={cn(COLS, "group items-center border-b border-line transition-colors last:border-b-0 hover:bg-white/[0.012]")}
          >
            <div className="flex items-center gap-2.5 px-5 py-4 sm:px-6">
              <Icon size={15} className="shrink-0 text-ink-faint transition-colors group-hover:text-ink-dim" />
              <span className="text-[13px] text-ink-dim sm:text-[14px]">{m.k}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-4 sm:px-4">
              <span className="font-mono text-[13.5px] font-medium leading-tight tabular-nums text-err/90 sm:text-[15px]">
                {m.local}
              </span>
              <ArrowRight size={12} className="ml-auto mr-1 shrink-0 text-ink-faint/60" />
            </div>
            <div className="border-l border-line bg-ok/[0.05] px-3 py-4 font-mono text-[13.5px] font-medium leading-tight tabular-nums text-ok sm:px-4 sm:text-[15px]">
              {m.vt}
            </div>
          </div>
        );
      })}

      {/* footer status — Local fault on the left, Vectant green under its column */}
      <div className={cn(COLS, "border-t border-line bg-bg-2/40 font-mono text-[11px]")}>
        <div className="col-span-2 flex items-center gap-2 px-5 py-3 text-err sm:px-6">
          <AlertTriangle size={13} className="shrink-0" />
          <span className="truncate">Out of memory - restart required</span>
        </div>
        <div className="flex items-center gap-2 border-l border-line bg-ok/[0.05] px-3 py-3 text-ok sm:px-4">
          <CheckCircle2 size={13} className="shrink-0" />
          <span className="truncate">All systems go</span>
        </div>
      </div>
    </div>
  );
}
