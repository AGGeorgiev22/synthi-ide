"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";

import { AnimatedLogo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Product", href: "#runtime" },
  { label: "Authority", href: "#runtime-path" },
  { label: "GPU HMR", href: "#gpu-hmr" },
  { label: "Proof", href: "#proof" },
];

const PILOT_EMAIL = "aleksandar.kolev@vectant.dev";
const PILOT_MAILTO = `mailto:${PILOT_EMAIL}?subject=${encodeURIComponent("Vectant proof pilot")}&body=${encodeURIComponent(
  "Hi Aleksandar,\n\nWe are interested in running a Vectant proof pilot for our company.\n\nCompany:\nRepo or system to pilot:\nWhat our agents are blocked from landing safely today:\n"
)}`;

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
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <motion.nav
        layout
        aria-label="Primary navigation"
        className={cn(
          "mx-auto flex h-14 max-w-[1376px] items-center justify-between rounded-[14px] border px-3 transition-[background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-4",
          scrolled || open
            ? "border-line-2 bg-bg/88 shadow-[0_18px_58px_rgba(0,0,0,0.16)] backdrop-blur-2xl"
            : "border-line bg-bg/66 backdrop-blur-xl"
        )}
      >
        <a href="#top" aria-label="Vectant home" className="rounded-[8px] outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg">
          <AnimatedLogo expanded={!scrolled && !open} />
        </a>

        <div className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-[9px] px-3 py-2 text-[12px] font-medium text-ink-dim outline-none transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-cyan/70"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <a
            href={PILOT_MAILTO}
            className="group hidden min-h-10 items-center gap-2 rounded-full bg-[#ff7757] py-1 pl-4 pr-1 text-[12px] font-semibold text-[#16100e] outline-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.98] sm:inline-flex"
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
            className="relative grid h-10 w-10 place-items-center rounded-[10px] border border-line text-ink outline-none transition-[border-color,background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-line-2 hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-cyan/70 lg:hidden"
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
            className="fixed inset-x-3 bottom-3 top-20 z-40 flex flex-col overflow-hidden rounded-[20px] border border-line-2 bg-bg/96 px-5 pb-5 pt-10 shadow-[0_28px_80px_rgba(0,0,0,0.22)] backdrop-blur-3xl lg:hidden"
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
                  className="group flex min-h-[68px] items-center justify-between border-b border-line text-[clamp(2rem,10vw,4.2rem)] font-medium leading-none tracking-[-0.05em] text-ink outline-none transition-colors hover:text-brand focus-visible:text-brand"
                >
                  {link.label}
                  <ArrowUpRight size={22} className="text-ink-faint transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </motion.a>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-3 border-t border-line pt-5 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <p className="max-w-sm text-[12px] leading-5 text-ink-dim">A governed runtime for parallel coding agents and the teams responsible for what lands.</p>
              <a href={PILOT_MAILTO} onClick={closeMenu} className="inline-flex min-h-12 items-center justify-between rounded-full bg-[#ff7757] px-5 text-[13px] font-semibold text-[#16100e] outline-none focus-visible:ring-2 focus-visible:ring-cyan">
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
