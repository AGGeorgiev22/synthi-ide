"use client";

import { useEffect, useState } from "react";
import { Radio, ShieldAlert, Crosshair, Wand2, CheckCheck, Repeat } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/Section";
import { useActive, useReducedMotion } from "@/components/lib/useMotion";
import { cn } from "@/lib/utils";

function MiniObserve({ active }) {
  return (
    <div className="font-mono text-[10px] leading-relaxed">
      <div className="text-ink-faint">runtime · session live</div>
      <div className={cn("text-cyan transition-opacity duration-500", active ? "opacity-100" : "opacity-40")}>
        ▸ logs · tests · preview
      </div>
    </div>
  );
}
function MiniPredict({ active }) {
  return (
    <div className="space-y-1 font-mono text-[10px] leading-relaxed">
      <div className="flex items-center gap-1.5">
        <span className="rounded border border-warn/30 bg-warn/10 px-1 text-warn">predicted</span>
        <span className="text-ink-faint">before run</span>
      </div>
      <div className={cn("text-warn transition-opacity duration-500", active ? "opacity-100" : "opacity-0")}>
        ⚠ moved value: rt
      </div>
    </div>
  );
}
function MiniDiagnose({ active }) {
  return (
    <div className="flex items-center gap-1.5 font-mono text-[10px]">
      <span className="rounded border border-warn/30 bg-warn/10 px-1.5 py-0.5 text-warn">E0382</span>
      <span className={cn("text-ink-faint transition-all duration-500", active ? "opacity-100" : "opacity-30")}>→</span>
      <span className="rounded border border-line bg-white/[0.03] px-1.5 py-0.5 text-ink-dim">session.rs:8</span>
    </div>
  );
}
function MiniPatch({ active }) {
  return (
    <div className="space-y-0.5 font-mono text-[10px] leading-tight">
      <div className="rounded-sm bg-err/[0.12] px-1 text-err">− move || rt.teardown()</div>
      <div
        className={cn("rounded-sm bg-ok/[0.12] px-1 text-ok transition-all duration-500", active ? "opacity-100" : "opacity-0")}
      >
        + rt.clone(); move || …
      </div>
      <div className={cn("pt-0.5 text-[9px] text-ink-faint transition-opacity duration-500", active ? "opacity-100" : "opacity-0")}>
        applied live · no rebuild
      </div>
    </div>
  );
}
function MiniVerify({ active }) {
  return (
    <div className="space-y-1 font-mono text-[10px]">
      <div className="flex items-center gap-2">
        <span className={cn("transition-colors duration-500", active ? "text-ok" : "text-ink-faint")}>✓ 24/24</span>
        <span className="text-ink-faint">·</span>
        <span className={cn("transition-colors duration-500", active ? "text-ok" : "text-ink-faint")}>preview live</span>
      </div>
      <div className={cn("text-[9px] text-ink-faint transition-opacity duration-500", active ? "opacity-100" : "opacity-0")}>
        state preserved · no restart
      </div>
    </div>
  );
}

const STEPS = [
  { label: "Observe", desc: "Watch the program as it actually runs.", Icon: Radio, Mini: MiniObserve },
  { label: "Predict", desc: "Catch the failure before it ever surfaces.", Icon: ShieldAlert, Mini: MiniPredict },
  { label: "Diagnose", desc: "Trace the signal to the exact line.", Icon: Crosshair, Mini: MiniDiagnose },
  { label: "Patch in place", desc: "Fix the running program, state kept.", Icon: Wand2, Mini: MiniPatch },
  { label: "Verify", desc: "Tests pass, the preview never drops.", Icon: CheckCheck, Mini: MiniVerify },
];

export function FeedbackLoop() {
  const reduced = useReducedMotion();
  const [ref, active] = useActive("0px 0px -25% 0px");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduced || !active) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % STEPS.length), 1150);
    return () => clearInterval(id);
  }, [reduced, active]);

  return (
    <section id="loop" className="relative scroll-mt-24 border-y border-line bg-bg-2/40 py-20 sm:py-24">
      <div ref={ref} className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Self-healing runtime"
          align="center"
          maxWidth="max-w-3xl"
          title={
            <>
              We don&rsquo;t rebuild. We patch the program{" "}
              <span className="serif-accent text-ink-dim">while it runs.</span>
            </>
          }
          subtitle="Vectant observes the live runtime, predicts failures before they surface, and patches in place - state preserved, no restart, no lost context. A loop that closes itself."
        />

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((s, i) => {
            const on = reduced ? true : i === idx;
            const Icon = s.Icon;
            const Mini = s.Mini;
            return (
              <Reveal key={s.label} delay={i * 60}>
                <div
                  className={cn(
                    "group relative flex h-full flex-col rounded-2xl border bg-surface p-4 transition-all duration-500",
                    on ? "border-cyan/40 bg-cyan/[0.04]" : "border-line"
                  )}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors duration-500",
                        on ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-line bg-surface-2 text-ink-dim"
                      )}
                    >
                      <Icon size={15} />
                    </span>
                    <span className="font-mono text-[10px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="text-[14px] font-medium text-ink">{s.label}</div>
                  <p className="mt-1 text-[12px] leading-snug text-ink-faint">{s.desc}</p>
                  <div className="surface-dark mt-3 min-h-[44px] rounded-lg border border-line bg-bg/80 p-2">
                    <Mini active={on} />
                  </div>
                  {/* connector */}
                  {i < STEPS.length - 1 && (
                    <span className="absolute -right-3 top-1/2 z-10 hidden h-[1px] w-3 -translate-y-1/2 bg-line lg:block">
                      <span
                        className={cn(
                          "absolute inset-0 origin-left bg-cyan transition-transform duration-500",
                          on ? "scale-x-100" : "scale-x-0"
                        )}
                      />
                    </span>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* continuous self-healing indicator */}
        <div className="mt-8 flex items-center gap-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-faint">self-healing</span>
          <div className="relative h-px flex-1 overflow-hidden bg-line">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan to-violet transition-[width] duration-500"
              style={{ width: `${((idx + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-ink-faint">
            <Repeat size={11} className="text-cyan" /> closes itself
          </span>
        </div>
      </div>
    </section>
  );
}

