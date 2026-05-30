"use client";

import { Cloud } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Section";
import { ScanEye, ActHand } from "@/components/BrandMarks";
import { VectantMark } from "@/components/Logo";
import { cn } from "@/lib/utils";

const EYES = [
  "Build output",
  "Runtime logs",
  "Crashes & panics",
  "Test results",
  "GPU / kernel feedback",
  "Live preview & state",
];

const HANDS = [
  "Run the project",
  "Propose a patch",
  "Hot-reload changes",
  "Re-run the tests",
  "Verify the fix",
];

export function EyesAndHands() {
  return (
    <section id="product" className="relative scroll-mt-24 border-y border-line bg-bg-2/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="What agents are missing"
          align="center"
          title="Most agents code blind, and empty-handed."
          subtitle="They read files and guess. They can't watch the program run, and they can't act on what it does. Vectant gives the agent eyes and hands inside one cloud workspace."
        />

        <div className="mt-14 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
          {/* Eyes */}
          <Reveal className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-7">
            <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 accent-glow blur-2xl opacity-50" />
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/[0.06] text-cyan">
                <ScanEye size={19} />
              </span>
              <div>
                <h3 className="text-[17px] font-semibold text-ink">Eyes</h3>
                <p className="text-[12.5px] text-ink-faint">Observe the program as it runs</p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {EYES.map((e) => (
                <li
                  key={e}
                  className="flex items-center gap-3 rounded-lg border border-line bg-bg/40 px-3 py-2 font-mono text-[12.5px] text-ink-dim"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan" style={{ boxShadow: "0 0 6px #2dd4ee" }} />
                  {e}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* runtime core + connectors */}
          <div className="flex items-center justify-center">
            {/* desktop: horizontal loop */}
            <div className="hidden flex-col items-center gap-2 lg:flex">
              <svg width="120" height="150" viewBox="0 0 120 150" fill="none" aria-hidden="true">
                <path d="M2 46 H118" stroke="#2dd4ee" strokeWidth="1.5" className="flow-path" opacity="0.7" />
                <path d="M14 40 L2 46 L14 52" stroke="#2dd4ee" strokeWidth="1.5" fill="none" />
                <path d="M118 104 H2" stroke="#8b7bff" strokeWidth="1.5" className="flow-path" opacity="0.7" />
                <path d="M106 98 L118 104 L106 110" stroke="#8b7bff" strokeWidth="1.5" fill="none" />
                <text x="60" y="34" textAnchor="middle" fontSize="8" fill="#6d6963" fontFamily="monospace">observe</text>
                <text x="60" y="126" textAnchor="middle" fontSize="8" fill="#6d6963" fontFamily="monospace">act</text>
              </svg>
              <div className="flex flex-col items-center gap-1 rounded-xl border border-line-2 bg-panel px-4 py-3">
                <VectantMark className="h-6 w-auto text-ink" gradientId="vt-eh" />
                <span className="font-mono text-[9.5px] uppercase tracking-wider text-ink-faint">runtime</span>
              </div>
            </div>
            {/* mobile: vertical link */}
            <div className="flex items-center gap-3 py-1 lg:hidden">
              <span className="h-px w-10 grad-line" />
              <VectantMark className="h-5 w-auto text-ink" gradientId="vt-eh-m" />
              <span className="h-px w-10 grad-line" />
            </div>
          </div>

          {/* Hands */}
          <Reveal delay={120} className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-7">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 accent-glow blur-2xl opacity-50" />
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet/30 bg-violet/[0.06] text-violet">
                <ActHand size={19} />
              </span>
              <div>
                <h3 className="text-[17px] font-semibold text-ink">Hands</h3>
                <p className="text-[12.5px] text-ink-faint">Act on what it sees, then prove it</p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {HANDS.map((h, i) => (
                <li
                  key={h}
                  className="flex items-center justify-between rounded-lg border border-line bg-bg/40 px-3 py-2 font-mono text-[12.5px] text-ink-dim"
                >
                  <span>{h}</span>
                  <span className="font-mono text-[10px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <div className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-2 text-center text-[13px] text-ink-faint">
            <Cloud size={14} className="shrink-0 text-cyan" />
            All inside a browser-based cloud workspace - no local setup, no dependency drift.
          </div>
        </Reveal>
      </div>
    </section>
  );
}

