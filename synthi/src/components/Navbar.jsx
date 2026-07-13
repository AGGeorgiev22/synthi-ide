"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";

import { AnimatedLogo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { PILOT_MAILTO } from "@/lib/pilot";

const LINKS = [
  { label: "Product", href: "#runtime" },
  { label: "Authority", href: "#runtime-path" },
  { label: "GPU HMR", href: "#gpu-hmr" },
  { label: "Proof", href: "#proof" },
];

const linkMotion = {
  hidden: { opacity: 0, y: 28 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const firstLinkRef = useRef(null);
  const dialogRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const target = document.getElementById("top");
    if (!target) return undefined;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      rootMargin: "-48px 0px 0px 0px",
      threshold: 0,
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => firstLinkRef.current?.focus(), 60);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        window.setTimeout(() => menuButtonRef.current?.focus(), 0);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('a[href], button:not([disabled])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = priorOverflow;
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-4 sm:pt-4">
      <motion.nav
        layout
        aria-label="Primary navigation"
        className={cn(
          "mx-auto flex h-[58px] max-w-[1420px] items-center justify-between rounded-[10px] px-3 text-[#f1eee8] ring-1 transition-[background-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-4",
          scrolled || open
            ? "bg-[#07080a]/92 shadow-[0_20px_70px_rgba(0,0,0,0.42)] ring-white/14 backdrop-blur-2xl"
            : "bg-[#07080a]/74 ring-white/10 backdrop-blur-xl"
        )}
      >
        <a href="#top" aria-label="Vectant home" className="rounded-[6px] text-[#f1eee8] outline-none focus-visible:ring-2 focus-visible:ring-[#55d8e8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080a]">
          <AnimatedLogo expanded={!scrolled && !open} />
        </a>

        <div className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-2 text-[12px] font-medium text-[#888b94] outline-none transition-[color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:text-[#f1eee8] focus-visible:text-[#f1eee8] focus-visible:ring-2 focus-visible:ring-[#55d8e8]/70"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={PILOT_MAILTO}
            className="group hidden min-h-10 items-center gap-2 rounded-full bg-[#ff7657] py-1 pl-4 pr-1 text-[12px] font-semibold text-[#16100e] outline-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#55d8e8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080a] active:scale-[0.98] sm:inline-flex"
          >
            Request pilot
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#16100e] text-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight size={14} weight="bold" />
            </span>
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="relative grid h-10 w-10 place-items-center rounded-[8px] text-[#f1eee8] ring-1 ring-white/12 outline-none transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-white/7 focus-visible:ring-2 focus-visible:ring-[#55d8e8]/70 lg:hidden"
          >
            <span className={cn("absolute h-px w-4 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]", open ? "rotate-45" : "-translate-y-[3px]")} />
            <span className={cn("absolute h-px w-4 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]", open ? "-rotate-45" : "translate-y-[3px]")} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0 round 20px)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0 round 20px)" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0 round 20px)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-2 bottom-2 top-[74px] z-40 flex flex-col overflow-hidden rounded-[10px] bg-[#07080a]/97 px-5 pb-5 pt-10 text-[#f1eee8] ring-1 ring-white/12 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-3xl sm:inset-x-4 sm:bottom-4 sm:top-[82px] lg:hidden"
          >
            <div className="flex flex-1 flex-col justify-center">
              {LINKS.map((link, index) => (
                <motion.a
                  key={link.label}
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  custom={index}
                  variants={linkMotion}
                  initial="hidden"
                  animate="visible"
                  onClick={closeMenu}
                  className="group flex min-h-[68px] items-center justify-between shadow-[inset_0_-1px_0_rgba(255,255,255,0.1)] text-[clamp(2rem,10vw,4.2rem)] font-medium leading-none tracking-[-0.05em] text-[#f1eee8] outline-none transition-colors hover:text-[#ff7657] focus-visible:text-[#ff7657]"
                >
                  {link.label}
                  <ArrowUpRight size={22} className="text-[#777a83] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </motion.a>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] pt-5 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <p className="max-w-sm text-[12px] leading-5 text-[#8e919a]">A governed runtime for parallel coding agents and the teams responsible for what lands.</p>
              <a href={PILOT_MAILTO} onClick={closeMenu} className="inline-flex min-h-12 items-center justify-between rounded-full bg-[#ff7657] px-5 text-[13px] font-semibold text-[#16100e] outline-none focus-visible:ring-2 focus-visible:ring-[#55d8e8]">
                Request pilot
                <ArrowUpRight size={16} weight="bold" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
