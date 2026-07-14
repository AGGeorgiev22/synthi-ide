"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";

import { AnimatedLogo } from "@/components/Logo";
import styles from "@/components/Navbar.module.css";

const NAV_GROUPS = [
  {
    label: "Product",
    detail: "Control path",
    links: [
      { label: "Guarded run", detail: "Constrain, execute, and replay", href: "#guarded-run" },
      { label: "GPU HMR", detail: "Patch without restart", href: "#gpu-hmr" },
      { label: "Buyer outcomes", detail: "Inspect the control-plane results", href: "#systems" },
      { label: "Who it is for", detail: "Teams with difficult systems", href: "#teams" },
    ],
  },
  {
    label: "Evidence",
    detail: "Review path",
    links: [
      { label: "Proof bundle", detail: "Replay the decision trail", href: "#proof" },
      { label: "Enterprise controls", detail: "Data, deployment, and roadmap", href: "#technical-confidence" },
      { label: "Technical questions", detail: "Pilot constraints", href: "#faq" },
      { label: "Proof pilot", detail: "Scope the defined offer", href: "#pilot" },
    ],
  },
];

const NAV_LINKS = NAV_GROUPS.flatMap((group) => group.links);

const linkMotion = {
  hidden: { opacity: 0, y: 34, clipPath: "inset(0 0 100% 0)" },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { delay: 0.08 + index * 0.055, duration: 0.62, ease: [0.16, 1, 0.3, 1] },
  }),
};

const reducedLinkMotion = {
  hidden: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" },
  visible: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", transition: { duration: 0 } },
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [proofSealed, setProofSealed] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const firstLinkRef = useRef(null);
  const dialogRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  useEffect(() => {
    setScrolled(scrollY.get() > Math.max(120, window.innerHeight * 0.72));
  }, [scrollY]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > Math.max(120, window.innerHeight * 0.72);
    setScrolled((current) => (current === next ? current : next));
  });

  useEffect(() => {
    const finalApproach = document.getElementById("pilot");
    if (!finalApproach) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProofSealed(true);
          return;
        }
        setProofSealed(entry.boundingClientRect.top < 0);
      },
      { rootMargin: "0px 0px -58% 0px" },
    );
    observer.observe(finalApproach);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const priorOverflow = document.body.style.overflow;
    const priorRootOverflow = document.documentElement.style.overflow;
    const priorRootOverscroll = document.documentElement.style.overscrollBehavior;
    const priorBodyOverscroll = document.body.style.overscrollBehavior;
    const backgroundNodes = [document.getElementById("main-content"), document.querySelector("footer")].filter(Boolean);
    const priorInert = backgroundNodes.map((node) => node.inert);
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.documentElement.dataset.vectantScrollLock = "true";
    window.dispatchEvent(new Event("vectant:scroll-lock"));
    backgroundNodes.forEach((node) => { node.inert = true; });
    const focusTimer = window.setTimeout(() => firstLinkRef.current?.focus(), 60);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        window.setTimeout(() => menuButtonRef.current?.focus(), 0);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [
        menuButtonRef.current,
        ...dialogRef.current.querySelectorAll('a[href], button:not([disabled])'),
      ].filter(Boolean);
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
      document.body.style.overscrollBehavior = priorBodyOverscroll;
      document.documentElement.style.overflow = priorRootOverflow;
      document.documentElement.style.overscrollBehavior = priorRootOverscroll;
      delete document.documentElement.dataset.vectantScrollLock;
      window.dispatchEvent(new Event("vectant:scroll-unlock"));
      backgroundNodes.forEach((node, index) => { node.inert = priorInert[index]; });
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className={styles.navHeader}>
      <nav
        aria-label="Primary navigation"
        className={`${styles.navRail} ${scrolled || open ? styles.navRailContracted : ""}`}
      >
        <a href="#top" aria-label="Vectant home" className={styles.navHome}>
          <AnimatedLogo expanded={!scrolled && !open} interactive={false} />
        </a>

        <AnimatePresence mode="wait" initial={false}>
          {!scrolled && !open ? (
            <motion.div
              key="links"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : undefined}
              className={styles.navLinks}
            >
              {NAV_LINKS.slice(0, 4).map((link) => (
                <a key={link.label} href={link.href}>{link.label}</a>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="mission"
              initial={reduceMotion ? false : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : undefined}
              className={styles.navMission}
              aria-hidden="true"
            >
              <i />
              <span>{proofSealed ? "PROOF SEALED" : "AUTHORITY IN FORCE"}</span>
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
      </nav>

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
            transition={reduceMotion ? { duration: 0 } : { duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            className={styles.navIndex}
            data-lenis-prevent
          >
            <div className={styles.navIndexCorridor} aria-hidden="true"><i /><i /></div>
            <div className={styles.navIndexShell}>
              <div className={styles.navIndexIntro}>
                <h2>Inspect the run from boundary to proof.</h2>
                <p>Open only the system surface you need. Every chapter stays attached to the same controlled flight.</p>
              </div>

              <nav aria-label="Page sections" className={styles.navIndexGroups}>
                {NAV_GROUPS.map((group, groupIndex) => {
                  const groupOffset = NAV_GROUPS
                    .slice(0, groupIndex)
                    .reduce((total, item) => total + item.links.length, 0);

                  return (
                    <details key={group.label} open>
                      <summary>
                        <span aria-hidden="true"><i /><i /></span>
                        <b>{group.label}</b>
                        <em>{group.detail}</em>
                        <small aria-hidden="true" />
                      </summary>
                      <div className={styles.navIndexLinks}>
                        {group.links.map((link, index) => {
                          const linkIndex = groupOffset + index;
                          return (
                            <motion.a
                              key={link.label}
                              ref={linkIndex === 0 ? firstLinkRef : undefined}
                              href={link.href}
                              data-scroll-focus="true"
                              custom={linkIndex}
                              variants={reduceMotion ? reducedLinkMotion : linkMotion}
                              initial="hidden"
                              animate="visible"
                              onClick={closeMenu}
                            >
                              <span>{link.label}</span>
                              <em>{link.detail}</em>
                              <ArrowUpRight size={20} weight="bold" />
                            </motion.a>
                          );
                        })}
                      </div>
                    </details>
                  );
                })}
              </nav>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduceMotion ? { duration: 0 } : { delay: 0.38, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className={styles.navIndexFooter}
              >
                <p>Bring the repository you still will not hand to an agent.</p>
                <a href="#pilot" onClick={closeMenu}>
                  Scope the proof pilot
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
