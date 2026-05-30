"use client";

import { ArrowRight, Binary, Cpu, Gamepad2, Server, Wrench } from "lucide-react";
import { Reveal, Eyebrow } from "@/components/Section";
import { cn } from "@/lib/utils";

// Each use-case gets an icon + its own accent so the row reads as five distinct
// kinds of serious work, not one repeated gray chip. Full class strings (not
// interpolated) so Tailwind keeps them.
const USE_CASES = [
  { Icon: Binary, label: "Compiled apps", chip: "border-brand/30 bg-brand/[0.08] text-brand" },
  { Icon: Cpu, label: "GPU workloads", chip: "border-cyan/30 bg-cyan/[0.07] text-cyan" },
  { Icon: Gamepad2, label: "Game engines", chip: "border-violet/30 bg-violet/[0.08] text-violet" },
  { Icon: Server, label: "Infrastructure", chip: "border-blue/30 bg-blue/[0.08] text-blue" },
  { Icon: Wrench, label: "Complex developer tools", chip: "border-ok/30 bg-ok/[0.08] text-ok" },
];

export function BetaSection() {
  return (
    <section className="relative scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-bg-2/50 px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 dot-bg opacity-[0.5]" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[640px] -translate-x-1/2 accent-glow blur-[80px] opacity-50" />
            <div className="relative">
              <div className="flex justify-center">
                <Eyebrow>Private beta</Eyebrow>
              </div>
              <h2 className="mx-auto mt-5 max-w-2xl text-[26px] font-semibold leading-tight tracking-tight text-ink sm:text-[36px]">
                Built for people who want to do serious work.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-dim sm:text-[16.5px]">
                Vectant is for teams building systems where runtime feedback matters: compiled
                apps, GPU workloads, game engines, infrastructure, and complex developer tools.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                {USE_CASES.map(({ Icon, label, chip }) => (
                  <span
                    key={label}
                    className="group inline-flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 py-2 transition-colors duration-200 hover:border-line-2"
                  >
                    <span className={cn("flex h-6 w-6 items-center justify-center rounded-md border transition-transform duration-200 group-hover:scale-110", chip)}>
                      <Icon size={13} strokeWidth={1.75} />
                    </span>
                    <span className="text-[13px] font-medium text-ink-dim transition-colors group-hover:text-ink">
                      {label}
                    </span>
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center gap-3">
              <a
                href="#waitlist"
                className="group inline-flex items-center gap-2 rounded-xl border border-line bg-transparent px-5 py-3 text-[15px] font-medium text-ink transition hover:border-line-2 hover:bg-transparent"
              >
                  Join the private beta
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </a>
                <p className="text-[12.5px] text-ink-faint">
                  Early access is opening for developers working on runtime-heavy projects.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
