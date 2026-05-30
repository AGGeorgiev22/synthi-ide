"use client";

import { Play } from "lucide-react";
import { Reveal } from "@/components/Section";
import { WaitlistForm } from "@/components/WaitlistForm";
import { WaitlistCount } from "@/components/WaitlistCount";
import { Squiggle } from "@/components/Squiggle";
import { VectantMark } from "@/components/Logo";

export function CTASection() {
  return (
    <section id="waitlist" className="relative scroll-mt-24 overflow-hidden py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 spotlight opacity-80" />
        <div className="absolute left-1/2 top-1/2 h-[460px] w-[820px] -translate-x-1/2 -translate-y-1/2 accent-glow blur-[100px] opacity-60" />
      </div>

      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <div className="flex justify-center">
            <VectantMark className="h-10 w-auto text-ink float-slow" gradientId="vt-cta" />
          </div>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="mx-auto mt-7 max-w-2xl text-[32px] font-semibold leading-[1.08] tracking-tight text-ink sm:text-[48px]">
            Build where your code actually runs.
          </h2>
          <div className="mt-4 flex justify-center">
            <Squiggle className="h-2.5 w-40 text-brand/70" />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-ink-dim sm:text-[18px]">
            Join the Vectant waitlist and get early access to a runtime-native development
            environment.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <div className="mx-auto mt-9 flex max-w-md flex-col items-center gap-3">
            <WaitlistForm variant="inline" className="w-full" />
            <WaitlistCount />
            <a
              href="#playground"
              className="group inline-flex items-center gap-2 text-[14px] text-ink-dim transition hover:text-ink"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line group-hover:border-line-2">
                <Play size={12} className="ml-0.5 fill-current" />
              </span>
              Try the live workspace
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
