"use client";

import { X, Check } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Section";
import { cn } from "@/lib/utils";

const TRADITIONAL = [
  "Read files",
  "Depend on prompts",
  "Suggest changes",
  "Miss runtime failures",
  "Push debugging back to the developer",
];

const VECTANT = [
  "Observes execution",
  "Reads logs and errors directly",
  "Understands build and runtime state",
  "Proposes patches from real failures",
  "Verifies fixes through feedback loops",
];

export function ProblemSection() {
  return (
    <section id="product" className="relative scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The problem"
          align="center"
          title="Your AI assistant is guessing."
          subtitle="Most coding agents operate outside the runtime. They read files, infer intent, and suggest code. They do not always see the compiler fail, the kernel crash, the browser throw, the test timeout, or the game viewport break."
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-2">
          {/* traditional */}
          <Reveal className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[15px] font-medium text-ink-dim">Traditional AI coding tools</h3>
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">
                outside the runtime
              </span>
            </div>
            <ul className="space-y-3.5">
              {TRADITIONAL.map((t) => (
                <li key={t} className="flex items-center gap-3 text-[14.5px] text-ink-faint">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2">
                    <X size={12} className="text-ink-faint" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* vectant */}
          <Reveal
            delay={100}
            className="relative overflow-hidden rounded-2xl border border-cyan/25 bg-cyan/[0.03] p-6 sm:p-8"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 accent-glow blur-2xl" />
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[15px] font-medium text-ink">Vectant</h3>
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-cyan">
                inside the runtime
              </span>
            </div>
            <ul className="space-y-3.5">
              {VECTANT.map((t) => (
                <li key={t} className="flex items-center gap-3 text-[14.5px] text-ink">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-ok/30 bg-ok/10">
                    <Check size={12} className="text-ok" strokeWidth={2.5} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

