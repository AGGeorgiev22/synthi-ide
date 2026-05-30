"use client";

import { Reveal } from "@/components/Section";

/**
 * Editorial pull-quote band — a calm, confident statement between dense
 * sections. Restrained typography, generous whitespace.
 */
export function StatementBand() {
  return (
    <section className="relative scroll-mt-24 overflow-hidden py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-72 w-[760px] -translate-x-1/2 -translate-y-1/2 accent-glow blur-[100px] opacity-40" />
      </div>
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-cyan">The difference</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mx-auto mt-6 max-w-3xl text-balance text-[30px] font-semibold leading-[1.16] tracking-[-0.02em] text-ink-dim sm:text-[46px]">
            Most agents <span className="text-ink-faint">read</span> your code.
            <br className="hidden sm:block" /> Vectant <span className="serif-accent text-ink">watches it run</span> - then
            <span className="text-gradient"> patches and verifies</span>.
          </h2>
        </Reveal>
      </div>
    </section>
  );
}
