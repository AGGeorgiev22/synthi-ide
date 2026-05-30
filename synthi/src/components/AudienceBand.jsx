"use client";

import { Cpu, Globe, Smartphone, Wrench } from "lucide-react";
import { Reveal } from "@/components/Section";

/* Slim "who it's for" band: Vectant suits every kind of developer, from
   low-level systems work to hobby projects. Kept compact (one row of personas)
   so it reinforces reach without adding page bulk. */
const PERSONAS = [
  { Icon: Cpu, label: "Kernel engineers", note: "CUDA, drivers, systems code" },
  { Icon: Globe, label: "Web developers", note: "frameworks, full-stack, APIs" },
  { Icon: Smartphone, label: "Mobile developers", note: "iOS, Android, cross-platform" },
  { Icon: Wrench, label: "Hobbyists", note: "trading legacy tools for something faster" },
];

export function AudienceBand() {
  return (
    <section className="relative scroll-mt-24 border-y border-line bg-bg-2/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-center font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-faint">
            Built for every kind of developer
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-balance text-center text-[24px] font-semibold leading-[1.15] tracking-tight text-ink sm:text-[32px]">
            From kernel to browser to pocket -{" "}
            <span className="serif-accent text-ink-dim">Vectant fits how you build.</span>
          </h2>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 lg:grid-cols-4">
          {PERSONAS.map((p, i) => {
            const Icon = p.Icon;
            return (
              <Reveal key={p.label} delay={i * 70}>
                <div className="lift group relative flex h-full flex-col items-center gap-2 overflow-hidden rounded-2xl border border-line bg-surface px-4 py-5 text-center">
                  <span className="pointer-events-none absolute -top-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-cyan/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/[0.06] text-cyan transition-transform duration-300 group-hover:scale-110 group-hover:border-cyan/50">
                    <Icon size={16} />
                  </span>
                  <div className="relative text-[14px] font-medium text-ink">{p.label}</div>
                  <div className="relative text-[12px] leading-snug text-ink-faint">{p.note}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
