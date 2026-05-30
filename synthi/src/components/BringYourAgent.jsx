"use client";

import { SectionHeading, Reveal } from "@/components/Section";
import { VectantMark } from "@/components/Logo";
import { AGENTS } from "@/components/AgentMarks";
import { ScanEye, ActHand, PulseVerify } from "@/components/BrandMarks";
import { useInView } from "@/components/lib/useMotion";
import { cn } from "@/lib/utils";

const GRANTS = [
  { Icon: ScanEye, label: "Sees execution", note: "logs · tests · crashes · preview" },
  { Icon: ActHand, label: "Acts in place", note: "patches the running program" },
  { Icon: PulseVerify, label: "Proves the fix", note: "verifies against the runtime" },
];

export function BringYourAgent() {
  const [ref, inView] = useInView();
  return (
    <section id="agents" className="relative scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Agent-agnostic"
          align="center"
          maxWidth="max-w-3xl"
          title={
            <>
              Bring the agent you{" "}
              <span className="serif-accent text-gradient">already trust.</span>
            </>
          }
          subtitle="Vectant doesn't replace your agent - it's the runtime layer underneath it. Whichever agent you bring gets the senses it's missing, so you finally have the confidence it understands what your code actually does."
        />

        <div ref={ref} className="mx-auto mt-14 max-w-4xl">
          {/* agent peer row */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {AGENTS.map((a, i) => {
              const Mark = a.Mark;
              return (
                <div
                  key={a.name}
                  className={cn(
                    "inline-flex items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-2.5 transition-colors hover:border-line-2",
                    inView && "rise"
                  )}
                  style={inView ? { animationDelay: `${i * 80}ms` } : undefined}
                >
                  <Mark size={20} className="text-ink" />
                  <span className="text-[13.5px] font-medium text-ink">{a.name}</span>
                </div>
              );
            })}
          </div>

          {/* connectors into the runtime layer */}
          <div className="relative mx-auto mt-3 flex h-10 w-full max-w-lg items-center justify-center">
            <svg width="100%" height="40" viewBox="0 0 400 40" preserveAspectRatio="none" fill="none" aria-hidden="true">
              <path d="M60 0 C60 26 200 14 200 38" stroke="var(--color-line-2)" strokeWidth="1.2" />
              <path d="M200 0 L200 38" stroke="var(--color-line-2)" strokeWidth="1.2" />
              <path d="M340 0 C340 26 200 14 200 38" stroke="var(--color-line-2)" strokeWidth="1.2" />
              <path d="M60 0 C60 26 200 14 200 38" stroke="#2dd4ee" strokeWidth="1.2" className="flow-path" opacity="0.8" />
              <path d="M340 0 C340 26 200 14 200 38" stroke="#8b7bff" strokeWidth="1.2" className="flow-path" opacity="0.8" />
            </svg>
          </div>

          {/* Vectant runtime control plane */}
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-line-2 bg-surface-2 p-5 sm:p-6">
              <div className="pointer-events-none absolute -inset-x-10 -top-10 h-24 accent-glow blur-2xl opacity-40" />
              <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                <div className="flex shrink-0 items-center gap-3">
                  <VectantMark className="h-8 w-auto text-ink" gradientId="vt-bya" />
                  <div className="leading-tight">
                    <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink">Vectant runtime</div>
                    <div className="font-mono text-[10.5px] text-ink-faint">the layer under your agent</div>
                  </div>
                </div>
                <div className="hidden h-10 w-px bg-line sm:block" />
                <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                  {GRANTS.map((g) => {
                    const Icon = g.Icon;
                    return (
                      <div key={g.label} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/[0.07] text-cyan">
                          <Icon size={14} />
                        </span>
                        <div className="min-w-0">
                          <div className="text-[13px] font-medium text-ink">{g.label}</div>
                          <div className="font-mono text-[10.5px] text-ink-faint">{g.note}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          <p className="mx-auto mt-6 max-w-xl text-center text-[13px] text-ink-faint">
            Vectant auto-detects the agent you run and hands it real runtime signals - no lock-in to a
            single model or vendor.
          </p>
        </div>
      </div>
    </section>
  );
}
