"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { Play, Check } from "lucide-react";
import { HeroWorkspaceMockup, HERO_STEP_COUNT } from "@/components/HeroWorkspaceMockup";
import { WaitlistForm } from "@/components/WaitlistForm";
import { WaitlistCount } from "@/components/WaitlistCount";
import { Squiggle } from "@/components/Squiggle";
import { useReducedMotion, useActive, useTypewriterCycle, useHeadlineVariant } from "@/components/lib/useMotion";

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

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

// The last word of the headline tail, with a squiggle that sits directly under
// it (so the accent tracks whichever phrase is on screen instead of a fixed
// spot). `drawn` is controlled by the caller: true while the phrase holds, false
// the moment it starts deleting, so the underline un-draws as the word erases.
function HeadlineWord({ text, drawn, drawMs }) {
  return (
    <span className="serif-accent text-gradient relative inline-block whitespace-nowrap align-baseline">
      {/* zero-width space keeps the box (and caret height) during the pause */}
      {text || "​"}
      <Squiggle
        drawn={drawn}
        drawMs={drawMs}
        strokeWidth={2.6}
        className="pointer-events-none absolute inset-x-0 top-[0.92em] h-[0.17em] text-cyan/85 hidden"
      />
    </span>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const [holderRef, active] = useActive("0px 0px -20% 0px");
  const [step, setStep] = useState(0);
  const timer = useRef(null);
  const sceneRef = useRef(null);

  // A/B: 'typewriter' vs 'static' headline (null until mounted -> SSR-stable).
  const variant = useHeadlineVariant();
  const showTypewriter = variant === "typewriter";
  const [typed, typeMeta] = useTypewriterCycle(HEADLINE_PHRASES, {
    reduced,
    active: showTypewriter,
  });

  // Fire the A/B exposure event once the bucket is known.
  useEffect(() => {
    if (!variant) return;
    try {
      track("headline_variant", { variant });
    } catch {}
  }, [variant]);

  // Mouse-parallax tilt for the product scene. Flat (crisp) at rest; follows
  // the cursor on >=1024px pointer devices. Gated per-move on width (so it
  // keeps working across resizes) and skipped for reduced motion / touch.
  useEffect(() => {
    if (reduced) return;
    const holder = holderRef.current;
    const el = sceneRef.current;
    if (!holder || !el) return;

    const wide = () => window.matchMedia("(min-width: 1024px)").matches;
    let raf = 0;
    const onMove = (e) => {
      if (e.pointerType === "touch" || !wide()) return;
      const r = holder.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `rotateY(${clamp(-px * 11, -8, 8)}deg) rotateX(${clamp(py * 7, -5, 5)}deg)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
    holder.addEventListener("pointermove", onMove);
    holder.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      holder.removeEventListener("pointermove", onMove);
      holder.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, holderRef]);

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

  // Split the visible tail so the squiggle underlines only the last word.
  const tailText = showTypewriter ? typed : "trust your agents.";
  const tailSpace = tailText.lastIndexOf(" ");
  const tailHead = tailSpace >= 0 ? tailText.slice(0, tailSpace + 1) : "";
  const tailWord = tailSpace >= 0 ? tailText.slice(tailSpace + 1) : tailText;

  return (
    <section id="top" className="relative overflow-hidden pt-36 sm:pt-40">
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
              {/* headline tail - A/B between a cycling typewriter and a static
                  phrase. Height reserved for two lines so the scene beside it
                  never shifts. SSR/first paint renders the static phrase (also
                  the no-JS fallback); the typewriter takes over once assigned.
                  Animated text is aria-hidden; the sr-only phrase keeps the
                  H1 readable. */}
              <span className="mt-1 block min-h-[2.05em] pb-[0.14em]" aria-hidden="true">
                <span className="serif-accent text-gradient">
                  {tailHead}
                  <HeadlineWord
                    text={tailWord}
                    drawn={showTypewriter ? typeMeta.phase === "hold" : true}
                    drawMs={showTypewriter ? 640 : 950}
                  />
                  {showTypewriter && (
                    <span className="type-caret" data-typing={typeMeta.typing} />
                  )}
                </span>
              </span>
              <span className="sr-only">trust your agents.</span>
            </h1>

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

          {/* right: live workspace as a crisp product scene with mouse-parallax
              depth (flat at rest, tilts toward the cursor) */}
          <div ref={holderRef} className="reveal in-view relative scene-perspective lg:h-full">
            <div
              ref={sceneRef}
              className="scene-tilt scene-shadow relative mx-auto w-full max-w-2xl lg:mx-0 lg:w-[720px] lg:max-w-none xl:w-[800px]"
            >
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
