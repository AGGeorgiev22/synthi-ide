"use client";

import { Github, MousePointerClick, Check, ArrowRight, Boxes } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/Section";
import { cn } from "@/lib/utils";

function StepCard({ n, title, desc, children, highlight }) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 sm:p-7",
        highlight ? "border-cyan/30 bg-cyan/[0.04]" : "border-line bg-surface"
      )}
    >
      <span className="pointer-events-none absolute -right-2 -top-5 select-none font-display text-[96px] font-bold leading-none tracking-tight text-ink/[0.05]">
        {n}
      </span>
      <div className="relative">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-cyan">Step {n}</span>
        <h3 className="mt-2 text-[18px] font-semibold tracking-tight text-ink">{title}</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-dim">{desc}</p>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

export function SwitchSteps() {
  return (
    <section id="switch" className="relative scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Switching is easy"
          align="center"
          maxWidth="max-w-3xl"
          title={
            <>
              Up and running in{" "}
              <span className="serif-accent text-ink-dim">three steps.</span>
            </>
          }
          subtitle="No re-learning your editor, no re-installing your setup. Bring it all with you and keep moving."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <Reveal>
            <StepCard n="01" title="Create your account" desc="Sign in with GitHub or email. Your first cloud workspace spins up in seconds.">
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-transparent px-4 py-2.5 text-[13px] font-medium text-ink">
                <Github size={15} /> Continue with GitHub
              </span>
            </StepCard>
          </Reveal>

          <Reveal delay={90}>
            <StepCard
              n="02"
              highlight
              title="Migrate in one click"
              desc="Pull your VS Code extensions, themes, settings, and keybindings across, all at once."
            >
              <div className="rounded-lg border border-cyan/30 bg-bg/60 p-3">
                <div className="relative">
                  <span className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-line bg-transparent px-4 py-2.5 text-[13px] font-medium text-ink">
                    <Boxes size={15} /> Import from VS Code
                  </span>
                  {/* click affordance */}
                  <MousePointerClick
                    size={18}
                    className="presence-pulse absolute -bottom-1.5 right-3 text-cyan"
                  />
                </div>
                <ul className="mt-3 space-y-1.5">
                  {["Extensions", "Themes & settings", "Keybindings"].map((x) => (
                    <li key={x} className="flex items-center gap-2 font-mono text-[11px] text-ink-dim">
                      <Check size={12} className="text-ok" strokeWidth={2.5} /> {x}
                    </li>
                  ))}
                </ul>
              </div>
            </StepCard>
          </Reveal>

          <Reveal delay={180}>
            <StepCard n="03" title="Start shipping" desc="Open the workspace, bring your agent, and let it run where your code actually runs.">
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-transparent px-4 py-2.5 text-[13px] font-medium text-ink">
                <span className="h-2 w-2 rounded-full bg-ok presence-pulse" style={{ boxShadow: "0 0 6px #46e0a0" }} />
                Open workspace
              </span>
            </StepCard>
          </Reveal>
        </div>

        <div className="mt-9 flex justify-center">
          <a
            href="#waitlist"
            className="sheen group inline-flex items-center gap-2 rounded-xl border border-line bg-transparent px-5 py-3 text-[15px] font-medium text-ink transition hover:border-line-2"
          >
            Get early access
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

