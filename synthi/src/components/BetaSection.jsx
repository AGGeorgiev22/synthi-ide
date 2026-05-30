"use client";

import { ArrowRight } from "lucide-react";
import { Reveal, Eyebrow } from "@/components/Section";

const AUDIENCE = [
  "Compiled apps",
  "GPU workloads",
  "Game engines",
  "Infrastructure",
  "Complex developer tools",
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

              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {AUDIENCE.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-line bg-surface-2 px-3.5 py-1.5 text-[12.5px] text-ink-dim"
                  >
                    {a}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center gap-3">
                <a
                  href="#waitlist"
                  className="group inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-[15px] font-medium text-bg transition hover:bg-white"
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
