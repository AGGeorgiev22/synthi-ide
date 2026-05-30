"use client";

import { useEffect, useState } from "react";

/**
 * Shared waitlist-count source. The site renders the count in several places
 * (the stat band plus the hero/CTA social-proof line), and React StrictMode
 * double-invokes effects in dev - so a per-component fetch meant 3-6 identical
 * GET /api/waitlist hits on every load. This module fetches ONCE and hands the
 * same result to every consumer for the lifetime of the page.
 */
let cached = null; // resolved count (number) once fetched
let inflight = null; // shared in-flight promise

function fetchCount() {
  if (cached != null) return Promise.resolve(cached);
  if (inflight) return inflight;
  inflight = fetch("/api/waitlist")
    .then((r) => r.json())
    .then((d) => {
      cached = typeof d?.count === "number" ? d.count : 0;
      return cached;
    })
    .catch(() => {
      cached = 0;
      return 0;
    });
  return inflight;
}

/** Returns the waitlist count: `null` while loading, then a number. */
export function useWaitlistCount() {
  const [count, setCount] = useState(cached); // already resolved? skip the loading state
  useEffect(() => {
    let alive = true;
    fetchCount().then((c) => {
      if (alive) setCount(c);
    });
    return () => {
      alive = false;
    };
  }, []);
  return count;
}
