"use client";

import { Check, X, Minus } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/Section";
import { VectantMark } from "@/components/Logo";
import { BuildCompare } from "@/components/BuildCompare";
import { cn } from "@/lib/utils";

const COLS = ["Traditional AI tools", "Local IDE + plugin", "Vectant"];

const ROWS = [
  ["Sees the program actually run", "no", "partial", "yes"],
  ["Patches in place, state preserved", "no", "no", "yes"],
  ["Predicts failures before they surface", "no", "no", "yes"],
  ["Works with any agent - Claude Code, Codex…", "no", "partial", "yes"],
  ["Real-time multiplayer workspace", "no", "no", "yes"],
  ["Zero local setup · no dependency drift", "no", "no", "yes"],
  ["Every major language & runtime", "partial", "partial", "yes"],
  ["GPU & game-engine feedback in the loop", "no", "no", "yes"],
];

function Mark({ value }) {
  if (value === "yes") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ok/12 text-ok">
        <Check size={14} strokeWidth={2.5} />
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-warn/30 bg-warn/10 text-warn">
        <Minus size={14} strokeWidth={2.5} />
      </span>
    );
  }
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line bg-surface text-ink-faint">
      <X size={13} />
    </span>
  );
}

export function Comparison() {
  return (
    <section id="compare" className="relative scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Why switch"
          align="center"
          maxWidth="max-w-3xl"
          title={
            <>
              Get more done in{" "}
              <span className="serif-accent text-gradient">far less time.</span>
            </>
          }
          subtitle="Most tools read your code and hand the debugging back to you. Vectant closes the loop itself - so you spend your time shipping, not babysitting guesses."
        />

        <Reveal>
          <div className="mx-auto mt-12 max-w-4xl">
            <BuildCompare />
          </div>
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-2xl border border-line">
            {/* header */}
            <div className="grid grid-cols-[1.5fr_repeat(3,1fr)] border-b border-line bg-surface text-center">
              <div className="px-4 py-4 text-left font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint sm:px-6">
                Capability
              </div>
              {COLS.map((c, i) => {
                const isV = i === COLS.length - 1;
                return (
                  <div
                    key={c}
                    className={cn(
                      "flex items-center justify-center gap-1.5 px-2 py-4 text-[11.5px] font-medium sm:px-3 sm:text-[13px]",
                      isV ? "bg-cyan/[0.06] text-ink" : "text-ink-dim"
                    )}
                  >
                    {isV ? (
                      <>
                        <VectantMark className="h-4 w-auto text-ink" gradientId="vt-compare" />
                        <span>Vectant</span>
                      </>
                    ) : (
                      c
                    )}
                  </div>
                );
              })}
            </div>

            {/* rows */}
            {ROWS.map(([label, a, b, v], r) => (
              <div
                key={label}
                className={cn(
                  "grid grid-cols-[1.5fr_repeat(3,1fr)] items-center border-b border-line last:border-b-0",
                  r % 2 === 1 && "bg-surface/60"
                )}
              >
                <div className="px-4 py-3.5 text-left text-[13px] text-ink-dim sm:px-6 sm:text-[14px]">{label}</div>
                <div className="flex justify-center px-2 py-3.5">
                  <Mark value={a} />
                </div>
                <div className="flex justify-center px-2 py-3.5">
                  <Mark value={b} />
                </div>
                <div className="flex justify-center bg-cyan/[0.06] px-2 py-3.5">
                  <Mark value={v} />
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <p className="mx-auto mt-6 max-w-xl text-center text-[12.5px] text-ink-faint">
          Partial = possible with manual wiring or extra tooling. Vectant does it in one workspace.
        </p>
      </div>
    </section>
  );
}

