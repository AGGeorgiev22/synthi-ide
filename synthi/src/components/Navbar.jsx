"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { AnimatedLogo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Runtime", href: "#runtime" },
  { label: "Collab", href: "#collaboration" },
  { label: "GPU HMR", href: "#gpu-hmr" },
  { label: "Proof", href: "#proof" },
  { label: "Licenses", href: "#licenses" },
  { label: "Trust", href: "#trust" },
  { label: "Pilot", href: "#pricing" },
];

const PILOT_EMAIL = "aleksandar.kolev@vectant.dev";
const PILOT_MAILTO = `mailto:${PILOT_EMAIL}?subject=${encodeURIComponent("Vectant proof pilot")}&body=${encodeURIComponent(
  "Hi Aleksandar,\n\nWe are interested in running a Vectant proof pilot for our company.\n\nCompany:\nRepo or system to pilot:\nWhat our agents are blocked from landing safely today:\n"
)}`;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const target = document.getElementById("top");
    if (!target) {
      setScrolled(window.scrollY > 12);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "-12px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:px-5">
      <div
        className={cn(
          "mx-auto max-w-[1376px] rounded-[10px] border transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "border-line-2 bg-bg/86 shadow-[0_16px_54px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            : "border-line bg-bg/58 backdrop-blur-md"
        )}
      >
        <nav className="mx-auto flex h-14 max-w-full transparent items-center justify-between px-4 sm:px-5">
          <a href="#top" className="flex items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-cyan/50" aria-label="Vectant home">
            <AnimatedLogo expanded={!scrolled} />
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-sm px-3 py-2 text-[13px] text-ink-dim transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-surface-2 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* right actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            <a
              href={PILOT_MAILTO}
              className="sheen group inline-flex items-center gap-1.5 rounded-sm border border-line bg-transparent px-4 py-2 text-[13.5px] font-medium text-ink-dim transition-[border-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-line-2 hover:text-ink active:scale-[0.97]"
            >
              Request pilot
              <ArrowUpRight size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* mobile actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-line text-ink-dim transition-[border-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-line-2 hover:text-ink active:scale-[0.97]"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
            </button>
          </div>
        </nav>
      </div>

      {/* mobile sheet */}
      <div
        className={cn(
          "fixed inset-x-3 top-20 z-40 origin-top rounded-[10px] border border-line bg-bg/95 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-sm border border-transparent px-3 py-3 text-[15px] text-ink-dim transition-[border-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-1 hover:border-line-2 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-line pt-4">
            <a
              href={PILOT_MAILTO}
              onClick={() => setOpen(false)}
              className="rounded-sm border border-line/80 bg-transparent px-4 py-3 text-center text-[15px] font-medium text-ink"
            >
              Request pilot
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
