"use client";

import { Check, ArrowRight } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/Section";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Core",
    price: "$0",
    cadence: "free forever",
    blurb: "Everything you need to build real software in the cloud.",
    features: [
      "Cloud workspace + instant builds",
      "Runtime-native agent (any agent)",
      "Real-time analysis & suggestions",
      "Real-time collaboration",
      "Unlimited projects",
    ],
    cta: "Join free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "Early access",
    cadence: "pricing at launch",
    blurb: "For people who want more reasoning, more speed, more headroom.",
    features: [
      "Everything in Core",
      "Advanced agent reasoning",
      "Priority compilation & GPU",
      "Enhanced model access",
      "Priority support",
    ],
    cta: "Get Pro access",
    highlight: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Pricing"
          align="center"
          maxWidth="max-w-3xl"
          title={
            <>
              Start free. <span className="serif-brand text-ink-dim">Scale when you&rsquo;re ready.</span>
            </>
          }
          subtitle="No lock-in, no proprietary traps. Export or self-host your work at any time."
        />

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <div
                className={cn(
                  "relative flex h-full flex-col overflow-hidden rounded-2xl border p-7",
                  t.highlight ? "border-brand/40 bg-brand/[0.04]" : "border-line bg-surface"
                )}
              >
                {t.highlight && (
                  <span className="absolute right-5 top-5 rounded-full border border-brand/40 bg-brand/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-brand">
                    Most popular
                  </span>
                )}
                <div className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-dim">{t.name}</div>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-display text-[40px] font-semibold leading-none tracking-tight text-ink">{t.price}</span>
                  <span className="mb-1 text-[12.5px] text-ink-faint">{t.cadence}</span>
                </div>
                <p className="mt-4 text-[13.5px] leading-relaxed text-ink-dim">{t.blurb}</p>
                <ul className="mt-6 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[13.5px] text-ink-dim">
                      <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-md", t.highlight ? "bg-brand/15 text-brand" : "bg-ok/10 text-ok")}>
                        <Check size={12} strokeWidth={2.5} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#waitlist"
                  className={cn(
                    "sheen group mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[14.5px] font-medium transition",
                    t.highlight ? "bg-brand text-white hover:brightness-110" : "border border-line bg-bg/40 text-ink hover:border-line-2"
                  )}
                >
                  {t.cta}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-xl text-center text-[12.5px] text-ink-faint">
          Your work is yours, forever. Vectant strengthens your workflow without holding it hostage.
        </p>
      </div>
    </section>
  );
}

