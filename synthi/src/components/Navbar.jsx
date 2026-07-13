"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";

import { AnimatedLogo } from "@/components/Logo";
import styles from "@/components/Navbar.module.css";
import { PILOT_MAILTO } from "@/lib/pilot";

const LINKS = [
  { label: "Product", detail: "Run boundary", href: "#runtime" },
  { label: "Authority", detail: "Controlled flight", href: "#runtime-path" },
  { label: "GPU HMR", detail: "Live engine", href: "#gpu-hmr" },
  { label: "Proof", detail: "Incident recorder", href: "#proof" },
  { label: "Field notes", detail: "Pilot briefing", href: "#faq" },
];

const linkMotion = {
  hidden: { opacity: 0, y: 34, clipPath: "inset(0 0 100% 0)" },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { delay: 0.08 + index * 0.055, duration: 0.62, ease: [0.16, 1, 0.3, 1] },
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
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > Math.max(120, window.innerHeight * 0.72));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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
    <header className={styles.navHeader}>
      <motion.nav
        layout
        aria-label="Primary navigation"
        className={`${styles.navRail} ${scrolled || open ? styles.navRailContracted : ""}`}
      >
        <a href="#top" aria-label="Vectant home" className={styles.navHome}>
          <AnimatedLogo expanded={!scrolled && !open} />
        </a>

        <AnimatePresence mode="wait" initial={false}>
          {!scrolled && !open ? (
            <motion.div
              key="links"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.navLinks}
            >
              {LINKS.slice(0, 4).map((link) => (
                <a key={link.label} href={link.href}>{link.label}</a>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="mission"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={styles.navMission}
              aria-hidden="true"
            >
              <i />
              <span>AUTHORITY IN FORCE</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close navigation index" : "Open navigation index"}
          aria-expanded={open}
          aria-controls="navigation-index"
          className={styles.navIndexButton}
        >
          <span>{open ? "Close" : "Index"}</span>
          <i className={open ? styles.navIndexIconOpen : undefined} aria-hidden="true"><b /><b /></i>
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="navigation-index"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation index"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            className={styles.navIndex}
          >
            <div className={styles.navIndexCorridor} aria-hidden="true"><i /><i /></div>
            <div className={styles.navIndexShell}>
              <p className={styles.navIndexEyebrow}>VECTANT / FLIGHT INDEX</p>
              <nav aria-label="Page sections" className={styles.navIndexLinks}>
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
                  >
                    <b>0{index + 1}</b>
                    <span>{link.label}</span>
                    <em>{link.detail}</em>
                    <ArrowUpRight size={20} weight="bold" />
                  </motion.a>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className={styles.navIndexFooter}
              >
                <p>A governed runtime for the repositories you still will not hand to an agent.</p>
                <a href={PILOT_MAILTO} onClick={closeMenu}>
                  Request a proof pilot
                  <ArrowUpRight size={16} weight="bold" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
