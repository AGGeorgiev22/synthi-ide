"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/** True once mounted if the user prefers reduced motion. SSR-safe (false first). */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

/** Generic media-query hook. Returns false during SSR / first paint. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, [query]);
  return matches;
}

/**
 * Reveal-on-scroll. Returns [ref, inView]. Fires once.
 */
export function useInView({ threshold = 0.18, rootMargin = "0px 0px -8% 0px", once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, once]);
  return [ref, inView];
}

/**
 * Whether an element is currently intersecting the viewport (activation gate
 * for expensive timelines — pause work off-screen).
 */
export function useActive(rootMargin = "0px 0px 0px 0px") {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin, threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);
  return [ref, active];
}

/**
 * Ramp a counter 0 -> total once `active`, one tick every `interval` ms.
 * Reduced motion jumps straight to total. Used to stagger log lines,
 * agent messages, and timeline events.
 */
export function useStagger(total, { active = true, interval = 420, startDelay = 200, reduced = false } = {}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setCount(total);
      return;
    }
    let i = 0;
    let timer;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        i += 1;
        setCount((c) => Math.min(total, c + 1));
        if (i >= total) clearInterval(timer);
      }, interval);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [total, active, interval, startDelay, reduced]);
  return count;
}

/**
 * Typewriter: reveals `text` char-by-char once `active`. Reduced motion shows
 * the full string immediately.
 */
export function useTypewriter(text, { active = true, speed = 28, startDelay = 120, reduced = false } = {}) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setOut(text);
      return;
    }
    setOut("");
    let i = 0;
    let timer;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        i += 1;
        setOut(text.slice(0, i));
        if (i >= text.length) clearInterval(timer);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [text, active, speed, startDelay, reduced]);
  const done = out.length >= text.length;
  return [out, done];
}

/**
 * Cycling typewriter. Types each phrase, holds, deletes, advances, loops -
 * forever, with a little human jitter on the keystroke timing so it never
 * reads like a constant-speed ticker. Reduced motion / inactive shows the
 * first phrase in full and stops.
 *
 * Returns [text, { index, typing }] where `typing` is true while characters
 * are being added (lets the caller hide the caret-as-bar during the hold).
 */
export function useTypewriterCycle(
  phrases,
  {
    active = true,
    reduced = false,
    typeSpeed = 56,
    deleteSpeed = 30,
    holdTime = 1900,
    pauseTime = 480,
    startDelay = 550,
  } = {}
) {
  const [text, setText] = useState("");
  const [meta, setMeta] = useState({ index: 0, typing: true });

  useEffect(() => {
    if (!active) return;
    if (reduced || !phrases.length) {
      setText(phrases[0] ?? "");
      setMeta({ index: 0, typing: false });
      return;
    }
    let cancelled = false;
    let timer;
    let i = 0; // phrase index
    let pos = 0; // chars revealed
    let phase = "type"; // type | hold | delete | pause

    const tick = () => {
      if (cancelled) return;
      const phrase = phrases[i];
      if (phase === "type") {
        pos += 1;
        setText(phrase.slice(0, pos));
        if (pos >= phrase.length) {
          phase = "hold";
          setMeta({ index: i, typing: false });
          timer = setTimeout(tick, holdTime);
        } else {
          timer = setTimeout(tick, typeSpeed + Math.random() * 60);
        }
      } else if (phase === "hold") {
        phase = "delete";
        timer = setTimeout(tick, deleteSpeed);
      } else if (phase === "delete") {
        pos -= 1;
        setText(phrase.slice(0, Math.max(0, pos)));
        if (pos <= 0) {
          phase = "pause";
          i = (i + 1) % phrases.length;
          timer = setTimeout(tick, pauseTime);
        } else {
          timer = setTimeout(tick, deleteSpeed + Math.random() * 24);
        }
      } else {
        phase = "type";
        setMeta({ index: i, typing: true });
        timer = setTimeout(tick, typeSpeed);
      }
    };

    timer = setTimeout(tick, startDelay);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [active, reduced, phrases, typeSpeed, deleteSpeed, holdTime, pauseTime, startDelay]);

  return [text, meta];
}

/**
 * Scroll progress (0..1) of a tall section relative to the viewport.
 * Drives pinned / scroll-driven storytelling. rAF-throttled.
 */
export function useScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when the section top hits the viewport top, 1 when its bottom reaches it.
    const scrollable = rect.height - vh;
    if (scrollable <= 0) {
      setProgress(rect.top <= 0 ? 1 : 0);
      return;
    }
    const p = Math.min(1, Math.max(0, -rect.top / scrollable));
    setProgress(p);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure]);

  return [ref, progress];
}
