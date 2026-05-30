"use client";

import { Cpu, Globe, Smartphone, Wrench } from "lucide-react";
import { Reveal } from "@/components/Section";
import { cn } from "@/lib/utils";

/* Slim "who it's for" band: Vectant suits every kind of developer, from
   low-level systems work to hobby projects. Kept compact (one row of personas)
   so it reinforces reach without adding page bulk. */
// Each persona gets its own accent so the row reads as four distinct audiences
// at a glance instead of one repeated cyan chip. Full class strings (not
// interpolated) so Tailwind keeps them.
const ACCENTS = {
  brand: { chip: "border-brand/30 bg-brand/[0.07] text-brand group-hover:border-brand/55", glow: "bg-brand/25" },
  cyan: { chip: "border-cyan/30 bg-cyan/[0.06] text-cyan group-hover:border-cyan/55", glow: "bg-cyan/20" },
  violet: { chip: "border-violet/30 bg-violet/[0.07] text-violet group-hover:border-violet/55", glow: "bg-violet/25" },
  blue: { chip: "border-blue/30 bg-blue/[0.07] text-blue group-hover:border-blue/55", glow: "bg-blue/25" },
};

const PERSONAS = [
  { Icon: Cpu, label: "Kernel engineers", note: "CUDA, drivers, systems code", accent: "brand" },
  { Icon: Globe, label: "Web developers", note: "frameworks, full-stack, APIs", accent: "cyan" },
  { Icon: Smartphone, label: "Mobile developers", note: "iOS, Android, cross-platform", accent: "violet" },
  { Icon: Wrench, label: "Hobbyists", note: "trading legacy tools for something faster", accent: "blue" },
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
            const a = ACCENTS[p.accent];
            return (
              <Reveal key={p.label} delay={i * 70}>
                <div className="lift group relative flex h-full flex-col items-center gap-2 overflow-hidden rounded-2xl border border-line bg-surface px-4 py-5 text-center">
                  <span className={cn("pointer-events-none absolute -top-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100", a.glow)} />
                  <span className={cn("relative flex h-9 w-9 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-110", a.chip)}>
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
