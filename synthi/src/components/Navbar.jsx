"use client";

import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { AnimatedLogo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Product", href: "#product" },
  { label: "Agents", href: "#agents" },
  { label: "Workflows", href: "#workflows" },
  { label: "Compare", href: "#compare" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "border-b transition-colors duration-300",
          scrolled ? "border-line bg-bg/70 backdrop-blur-xl" : "border-transparent bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-cyan/50" aria-label="Vectant home">
            <AnimatedLogo expanded={!scrolled} />
          </a>

          {/* center links */}
          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-lg px-3 py-2 text-[13.5px] text-ink-dim transition-colors hover:text-ink focus-visible:text-ink focus-visible:ring-2 focus-visible:ring-cyan/40 outline-none"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* right actions */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <a
              href="#waitlist"
              className="rounded-lg px-3 py-2 text-[13.5px] text-ink-dim transition-colors hover:text-ink"
            >
              Sign in
            </a>
            <a
              href="#waitlist"
              className="sheen group inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-[13.5px] font-medium text-bg transition duration-200 hover:bg-white active:scale-[0.97]"
            >
              Join waitlist
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink-dim"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {/* mobile sheet */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 origin-top border-b border-line bg-bg/95 backdrop-blur-xl transition-all duration-300 md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-[15px] text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-line pt-4">
            <a
              href="#waitlist"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-line px-4 py-3 text-center text-[15px] text-ink"
            >
              Sign in
            </a>
            <a
              href="#waitlist"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-ink px-4 py-3 text-center text-[15px] font-medium text-bg"
            >
              Join waitlist
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
