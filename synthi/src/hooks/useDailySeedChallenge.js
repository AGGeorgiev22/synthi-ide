"use client";
import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Seeded PRNG (mulberry32) — deterministic random from a seed.
 */
function mulberry32(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAILY_OBJECTIVES = [
  { id: "score_target", label: "Score {n}+", gen: (rng) => ({ target: 300 + Math.floor(rng() * 500) }) },
  { id: "collect_n", label: "Collect {n} toys", gen: (rng) => ({ target: 3 + Math.floor(rng() * 5) }) },
  { id: "combo_n", label: "Build a x{n} combo", gen: (rng) => ({ target: 3 + Math.floor(rng() * 4) }) },
  { id: "pin_n", label: "Pin {n} items", gen: (rng) => ({ target: 2 + Math.floor(rng() * 4) }) },
  { id: "fuse_n", label: "Fuse {n} toys", gen: (rng) => ({ target: 1 + Math.floor(rng() * 2) }) },
  { id: "survive_mutation", label: "Survive a mutation", gen: () => ({}) },
];

function generateDailyChallenge(seed) {
  const rng = mulberry32(seed);
  // Pick 3 objectives deterministically
  const shuffled = [...DAILY_OBJECTIVES].sort(() => rng() - 0.5);
  const objectives = shuffled.slice(0, 3).map((obj) => {
    const params = obj.gen(rng);
    const label = obj.label.replace("{n}", params.target || "");
    return { ...obj, ...params, label };
  });
  // Deterministic toy spawn sequence (first 6 kinds)
  const KINDS = ["satellite", "toast", "code", "relay"];
  const spawnSequence = Array.from({ length: 6 }, () => KINDS[Math.floor(rng() * KINDS.length)]);
  // Deterministic gravity/weather
  const gravityMode = ["zero", "down", "center"][Math.floor(rng() * 3)];
  const forceMode = ["none", "repel", "attract"][Math.floor(rng() * 3)];

  return { objectives, spawnSequence, gravityMode, forceMode, seed };
}

export default function useDailySeedChallenge(playgroundMode) {
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [dailyActive, setDailyActive] = useState(false);
  const [dailyProgress, setDailyProgress] = useState({}); // { objectiveId: current }
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [dailyBestScore, setDailyBestScore] = useState(0);
  const dailyDateRef = useRef(null);

  // Fetch daily seed on mount
  useEffect(() => {
    if (!playgroundMode) return;
    const today = new Date();
    const dateStr = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`;
    // Check if already completed today
    try {
      const stored = JSON.parse(localStorage.getItem("synthi_daily_challenge") || "{}");
      if (stored.date === dateStr && stored.completed) {
        setDailyCompleted(true);
        setDailyBestScore(stored.bestScore || 0);
      }
    } catch {}

    // Generate challenge client-side with date-based seed
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
    }
    const seed = Math.abs(hash);
    dailyDateRef.current = dateStr;
    setDailyChallenge(generateDailyChallenge(seed));
  }, [playgroundMode]);

  const startDaily = useCallback(() => {
    if (!dailyChallenge || dailyCompleted) return null;
    setDailyActive(true);
    setDailyProgress({});
    return dailyChallenge; // caller uses spawnSequence, gravityMode, forceMode
  }, [dailyChallenge, dailyCompleted]);

  const updateDailyProgress = useCallback(
    (type, value) => {
      if (!dailyActive || !dailyChallenge) return;
      setDailyProgress((prev) => {
        const next = { ...prev };
        for (const obj of dailyChallenge.objectives) {
          if (obj.id === "score_target" && type === "score") {
            next[obj.id] = Math.max(next[obj.id] || 0, value);
          } else if (obj.id === "collect_n" && type === "collect") {
            next[obj.id] = (next[obj.id] || 0) + 1;
          } else if (obj.id === "combo_n" && type === "combo") {
            next[obj.id] = Math.max(next[obj.id] || 0, value);
          } else if (obj.id === "pin_n" && type === "pin") {
            next[obj.id] = Math.max(next[obj.id] || 0, value);
          } else if (obj.id === "fuse_n" && type === "fuse") {
            next[obj.id] = (next[obj.id] || 0) + 1;
          } else if (obj.id === "survive_mutation" && type === "mutation") {
            next[obj.id] = 1;
          }
        }
        // Check completion
        const allDone = dailyChallenge.objectives.every((obj) => {
          const current = next[obj.id] || 0;
          if (obj.target) return current >= obj.target;
          return current > 0;
        });
        if (allDone && !dailyCompleted) {
          setDailyCompleted(true);
          setDailyActive(false);
          const score = next.score_target || 0;
          setDailyBestScore(score);
          try {
            localStorage.setItem(
              "synthi_daily_challenge",
              JSON.stringify({ date: dailyDateRef.current, completed: true, bestScore: score })
            );
          } catch {}
        }
        return next;
      });
    },
    [dailyActive, dailyChallenge, dailyCompleted]
  );

  const endDaily = useCallback(() => {
    setDailyActive(false);
  }, []);

  return {
    dailyChallenge,
    dailyActive,
    dailyProgress,
    dailyCompleted,
    dailyBestScore,
    startDaily,
    updateDailyProgress,
    endDaily,
  };
}
