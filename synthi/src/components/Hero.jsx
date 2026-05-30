"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Check } from "lucide-react";
import { HeroWorkspaceMockup, HERO_STEP_COUNT } from "@/components/HeroWorkspaceMockup";
import { WaitlistForm } from "@/components/WaitlistForm";
import { WaitlistCount } from "@/components/WaitlistCount";
import { Squiggle } from "@/components/Squiggle";
import { useReducedMotion, useActive, useTypewriterCycle } from "@/components/lib/useMotion";

const DWELL = [1100, 1100, 1200, 1600, 1400, 1500, 1500, 1500, 1500, 3400];

// Cycling tail for the hero headline. Each reads naturally after "It's time to".
// Kept short enough to stay within two lines at the largest type size.
const HEADLINE_PHRASES = [
  "trust your agents.",
  "stop babysitting builds.",
  "ship while you sleep.",
  "watch it fix itself.",
];

const LEAD_WORDS = ["It’s", "time", "to"];

const LANGS = [
  "TypeScript", "Python", "Rust", "Go", "C++", "Java", "Swift", "Kotlin",
  "C#", "Ruby", "Zig", "CUDA", "Metal", "WebGPU", "Unity", "Unreal", "WASM",
];

export function Hero() {
  const reduced = useReducedMotion();
  const [holderRef, active] = useActive("0px 0px -20% 0px");
  const [step, setStep] = useState(0);
  const timer = useRef(null);
  const [typed, typeMeta] = useTypewriterCycle(HEADLINE_PHRASES, { reduced });

  useEffect(() => {
    if (reduced) {
      setStep(HERO_STEP_COUNT - 1);
      return;
    }
    if (!active) return;
    let cancelled = false;
    const tick = (i) => {
      if (cancelled) return;
      setStep(i);
      const next = (i + 1) % HERO_STEP_COUNT;
      timer.current = setTimeout(() => tick(next), DWELL[i] ?? 1300);
    };
    tick(0);
    return () => {
      cancelled = true;
      clearTimeout(timer.current);
    };
  }, [reduced, active]);

  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32">
      {/* backdrop - warm mesh + spotlight + grain, no graph-paper grid */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 spotlight" />
        <div className="absolute left-1/2 top-[-16%] h-[720px] w-[1240px] -translate-x-1/2 mesh-warm opacity-70" />
        <div className="absolute inset-0 grain-tex opacity-[0.05]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* text beside animation */}
        <div className="grid items-center gap-y-12 lg:grid-cols-[minmax(0,470px)_minmax(0,1fr)] lg:items-start lg:gap-x-12 lg:pt-6">
          {/* left: copy */}
          <div className="relative z-10">
            <a
              href="#waitlist"
              className="group inline-flex items-center gap-2 text-[12.5px] text-ink-dim transition hover:text-ink"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_var(--color-brand)]" />
              Fully Autonomous Agentic Runtime Environment
              <span className="text-ink-faint">·</span>
              <span className="text-ink">Private beta</span>
            </a>

            <h1 className="mt-6 text-[42px] font-semibold leading-[0.98] tracking-[-0.035em] text-ink sm:text-[56px] lg:text-[64px]">
              <span className="block">
                {LEAD_WORDS.map((w, i) => (
                  <span
                    key={w}
                    className="word-up"
                    style={{ animationDelay: `${0.05 + i * 0.08}s` }}
                  >
                    {w}
                    {i < LEAD_WORDS.length - 1 ? " " : ""}
                  </span>
                ))}
              </span>
              {/* typewriter tail - height reserved for up to two lines so the
                  scene next to it never shifts as phrases swap. Animated text
                  is aria-hidden; the sr-only phrase keeps the H1 readable. */}
              <span className="mt-1 block min-h-[2.05em]" aria-hidden="true">
                <span className="serif-accent text-gradient">{typed}</span>
                <span className="type-caret" data-typing={typeMeta.typing} />
              </span>
              <span className="sr-only">trust your agents.</span>
            </h1>
            <Squiggle className="-mt-1 h-2.5 w-44 text-cyan/70" />

            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink-dim sm:text-[18px]">
              A cloud workspace that gives any agent - Claude Code, Codex, or your own - real eyes
              and hands. Vectant watches your code run, patches bugs in place without losing state,
              and verifies every fix before it reaches you.
            </p>

            <div className="mt-8 flex max-w-md flex-col gap-3">
              <WaitlistForm variant="hero" className="w-full" />
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <a
                  href="#playground"
                  className="group inline-flex items-center gap-2 text-[14px] text-ink-dim transition hover:text-ink"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line group-hover:border-line-2">
                    <Play size={12} className="ml-0.5 fill-current" />
                  </span>
                  Try the live workspace
                </a>
                <WaitlistCount />
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-ink-dim">
              {["Any agent", "Every major language", "No local setup"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check size={13} className="text-cyan" strokeWidth={2.5} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* right: live workspace as a tilted, reflected product scene */}
          <div ref={holderRef} className="reveal in-view relative scene-perspective lg:h-full">
            <div className="relative mx-auto w-full max-w-2xl scene-tilt reflect-down lg:mx-0 lg:w-[720px] lg:max-w-none xl:w-[800px]">
              <HeroWorkspaceMockup step={step} />
            </div>
          </div>
        </div>

        {/* every-language marquee */}
        <div className="mt-14 flex flex-col items-center gap-4 pb-24">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-faint">
            Runs whatever you build - these are just a few
          </span>
          <div className="relative w-full max-w-4xl overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            <div className="flex w-max marquee-track gap-8 font-mono text-[13px] text-ink-dim">
              {[...LANGS, ...LANGS].map((l, i) => (
                <span key={i} className="inline-flex shrink-0 items-center gap-8">
                  {l}
                  <span className="text-ink-faint/40">·</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
