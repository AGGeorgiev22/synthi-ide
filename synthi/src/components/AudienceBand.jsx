"use client";

import { Reveal } from "@/components/Section";
import { cn } from "@/lib/utils";

/* Custom persona marks — drawn in-house so the row reads as Vectant's own
   language instead of stock glyphs. All stroke `currentColor` so each inherits
   its persona accent; a filled detail (core / tap / window) gives each a focal
   point that lights up on hover. 24-grid, rendered ~16px. */
function GpuMark({ size = 16, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* card body */}
      <rect x="2.5" y="6.5" width="17.5" height="9" rx="2" />
      {/* fan */}
      <circle cx="8" cy="11" r="2.6" />
      <circle cx="8" cy="11" r="0.65" fill="currentColor" stroke="none" />
      <path d="M8 8.4v1.05M8 13.6v-1.05M5.4 11h1.05M10.6 11h-1.05" opacity="0.55" />
      {/* heatsink fins */}
      <path d="M13.2 9.7h3.6M13.2 12.3h3.6" />
      {/* PCIe pins / power legs */}
      <path d="M6 15.5v2.3M10 15.5v2.3M14 15.5v2.3" />
    </svg>
  );
}

function BrowserCodeMark({ size = 16, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3 9h18" />
      <path d="M6 7h0M8.2 7h0" />
      <path d="M10.4 12.4 8.6 14l1.8 1.6M13.6 12.4 15.4 14l-1.8 1.6" />
    </svg>
  );
}

function MobileTapMark({ size = 16, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="6.5" y="3" width="11" height="18" rx="3" />
      <path d="M10.5 18.4h3" />
      <circle cx="12" cy="10.6" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="10.6" r="3.4" opacity="0.45" />
    </svg>
  );
}

function RocketMark({ size = 16, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2.8c2.7 1.6 4.1 4.4 4.1 7.8 0 1.9-.5 3.5-1.4 4.7H9.3C8.4 14.1 8 12.5 8 10.6c0-3.4 1.4-6.2 4-7.8Z" />
      <circle cx="12" cy="9.6" r="1.35" fill="currentColor" stroke="none" />
      <path d="M9.4 15.3 7.6 17.9M14.6 15.3l1.8 2.6" />
      <path d="M10.8 18.7c.3 1.4.7 2.2 1.2 2.5.5-.3.9-1.1 1.2-2.5" opacity="0.85" />
    </svg>
  );
}

/* Slim "who it's for" band: Vectant suits every kind of developer, from
   low-level systems work to hobby projects. Kept compact (one row of personas)
   so it reinforces reach without adding page bulk. */
// Each persona gets its own accent so the row reads as four distinct audiences
// at a glance instead of one repeated cyan chip. Full class strings (not
// interpolated) so Tailwind keeps them.
const ACCENTS = {
  brand: { chip: "border-brand/30 bg-brand/[0.07] text-brand group-hover:border-brand/55", glow: "bg-brand/25" },
  cyan: { chip: "border-cyan/30 bg-cyan/[0.06] text-cyan group-hover:border-cyan/55", glow: "bg-cyan/20" },
  violet: { chip: "border-violet/30 bg-violet/[0.07] text-violet group-hover:border-violet/55", glow: "bg-violet/25" },
  blue: { chip: "border-blue/30 bg-blue/[0.07] text-blue group-hover:border-blue/55", glow: "bg-blue/25" },
};

const PERSONAS = [
  { Icon: GpuMark, label: "Kernel engineers", note: "CUDA, drivers, systems code", accent: "brand" },
  { Icon: BrowserCodeMark, label: "Web developers", note: "frameworks, full-stack, APIs", accent: "cyan" },
  { Icon: MobileTapMark, label: "Mobile developers", note: "iOS, Android, cross-platform", accent: "violet" },
  { Icon: RocketMark, label: "Hobbyists", note: "trading legacy tools for something faster", accent: "blue" },
];

export function AudienceBand() {
  return (
    <section className="relative scroll-mt-24 border-y border-line bg-bg-2/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-center font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-faint">
            Built for every kind of developer
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-balance text-center text-[24px] font-semibold leading-[1.15] tracking-tight text-ink sm:text-[32px]">
            From kernel to browser to pocket -{" "}
            <span className="serif-accent text-ink-dim">Vectant fits how you build.</span>
          </h2>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 lg:grid-cols-4">
          {PERSONAS.map((p, i) => {
            const Icon = p.Icon;
            const a = ACCENTS[p.accent];
            return (
              <Reveal key={p.label} delay={i * 70}>
                <div className="lift group relative flex h-full flex-col items-center gap-2 overflow-hidden rounded-2xl border border-line bg-surface px-4 py-5 text-center">
                  <span className={cn("pointer-events-none absolute -top-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100", a.glow)} />
                  <span className={cn("relative flex h-9 w-9 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-110", a.chip)}>
                    <Icon size={16} />
                  </span>
                  <div className="relative text-[14px] font-medium text-ink">{p.label}</div>
                  <div className="relative text-[12px] leading-snug text-ink-faint">{p.note}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
