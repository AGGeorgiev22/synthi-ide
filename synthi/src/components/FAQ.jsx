"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/Section";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    q: "What is a FAARE?",
    a: "A Fully Autonomous Agentic Runtime Environment (FAARE) is a cloud workspace where your agent works inside the running program. It sees builds, logs, tests, and crashes, then patches and verifies against the real runtime - instead of guessing from static files.",
  },
  {
    q: "Which agents does Vectant work with?",
    a: "Bring your own. Claude Code, Codex, Cursor, or your own setup. Vectant is the runtime layer underneath - it auto-detects the agent you run and hands it real execution signals. No lock-in to a single model or vendor.",
  },
  {
    q: "What languages and runtimes are supported?",
    a: "Every major language, plus accelerated and interactive runtimes - CUDA, ROCm, Metal, WebGPU, and live game engines are examples, not limits. If your project has a runtime, Vectant can watch it.",
  },
  {
    q: "Do I have to give up my editor and extensions?",
    a: "No. Import your VS Code extensions, themes, settings, and keybindings in a single click. The workspace feels like home from day one.",
  },
  {
    q: "Does it really patch at runtime without losing state?",
    a: "Yes. Fixes apply in place while the program keeps running - no rebuild, no restart, no lost context. The preview never drops.",
  },
  {
    q: "Is my code locked in?",
    a: "Never. Export or self-host your work at any time. No proprietary traps - Vectant strengthens your workflow without holding it hostage.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative scroll-mt-24 border-y border-line bg-bg-2/40 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading
            eyebrow="FAQ"
            title={
              <>
                Questions, <span className="serif-accent text-ink-dim">answered.</span>
              </>
            }
            subtitle="Everything you might want to know before you join."
          />
          <a
            href="#waitlist"
            className="mt-7 inline-flex items-center gap-2 text-[14px] font-medium text-brand transition hover:brightness-110"
          >
            Still curious? Join the beta and ask us anything →
          </a>
        </div>

        <ul className="divide-y divide-line border-y border-line">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 py-5 text-left"
                >
                  <span className={cn("text-[16px] font-medium transition-colors", isOpen ? "text-ink" : "text-ink-dim")}>
                    {item.q}
                  </span>
                  <Plus
                    size={18}
                    className={cn("ml-auto shrink-0 text-ink-faint transition-transform duration-300", isOpen && "rotate-45 text-brand")}
                  />
                </button>
                <div className={cn("grid transition-all duration-300 ease-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 text-[14.5px] leading-relaxed text-ink-dim">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
