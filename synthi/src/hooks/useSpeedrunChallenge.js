"use client";
import { useCallback, useRef, useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   Speedrun Challenges — randomly generated timed mini-tasks
   ═══════════════════════════════════════════════════════════════════════════ */

const SPEEDRUN_POOL = [
  { metric: 'collects', name: 'Speed Collect', gen: () => { const t = 2 + Math.floor(Math.random() * 7); return { target: t, timeLimit: 5 + t * 2, desc: `Collect ${t} toys` }; } },
  { metric: 'orbiters', name: 'Orbit Rush',    gen: () => { const t = 2 + Math.floor(Math.random() * 4); return { target: t, timeLimit: 8 + t * 3, desc: `Get ${t} orbiters` }; } },
  { metric: 'pins',     name: 'Pin Blitz',     gen: () => { const t = 2 + Math.floor(Math.random() * 5); return { target: t, timeLimit: 6 + t * 2, desc: `Pin ${t} items` }; } },
  { metric: 'score',    name: 'Score Sprint',  gen: () => { const t = 200 + Math.floor(Math.random() * 800); return { target: t, timeLimit: 10 + Math.ceil(t / 40), desc: `Score ${t} points` }; } },
  { metric: 'combo',    name: 'Combo Chain',   gen: () => { const t = 2 + Math.floor(Math.random() * 6); return { target: t, timeLimit: 5 + t * 2, desc: `Reach combo x${t}` }; } },
];

function generateChallenge() {
  const pick = SPEEDRUN_POOL[Math.floor(Math.random() * SPEEDRUN_POOL.length)];
  const { target, timeLimit, desc } = pick.gen();
  return { id: `${pick.metric}_${target}_${Date.now()}`, name: pick.name, desc, target, timeLimit, metric: pick.metric };
}

export function useSpeedrunChallenge(active, playSound) {
  const [challenge, setChallenge] = useState(null); // { ...def, startTime, progress, completed }
  const [showResult, setShowResult] = useState(null); // 'success' | 'fail' | null
  const timerRef = useRef(null);
  const progressRef = useRef({});
  const completedRef = useRef({});

  /** Start a random challenge (always fresh) */
  const startChallenge = useCallback(() => {
    if (challenge) return;
    const c = { ...generateChallenge(), startTime: Date.now(), progress: 0, completed: false };
    progressRef.current = { collects: 0, orbiters: 0, pins: 0, score: 0, combo: 0 };
    setChallenge(c);
    playSound?.('spawn');

    timerRef.current = setTimeout(() => {
      // Time's up
      setChallenge(prev => {
        if (!prev || prev.completed) return null;
        setShowResult('fail');
        setTimeout(() => setShowResult(null), 2000);
        playSound?.('impact');
        return null;
      });
    }, c.timeLimit * 1000);
  }, [challenge, playSound]);

  /** Update progress from game events */
  const updateProgress = useCallback((metric, value) => {
    if (!challenge || challenge.completed) return;
    if (metric === 'score' || metric === 'combo' || metric === 'orbiters') {
      progressRef.current[metric] = Math.max(progressRef.current[metric], value);
    } else {
      progressRef.current[metric] = (progressRef.current[metric] || 0) + value;
    }

    const current = progressRef.current[challenge.metric];
    if (current >= challenge.target) {
      clearTimeout(timerRef.current);
      completedRef.current[challenge.id] = true;
      const elapsed = ((Date.now() - challenge.startTime) / 1000).toFixed(1);
      setChallenge(prev => prev ? { ...prev, progress: current, completed: true } : null);
      setShowResult('success');
      playSound?.('unlock_rare');
      setTimeout(() => {
        setShowResult(null);
        setChallenge(null);
      }, 2500);
      return { challengeId: challenge.id, elapsed };
    }

    setChallenge(prev => prev ? { ...prev, progress: current } : null);
    return null;
  }, [challenge, playSound]);

  /** Time remaining */
  const getTimeLeft = useCallback(() => {
    if (!challenge) return 0;
    const elapsed = (Date.now() - challenge.startTime) / 1000;
    return Math.max(0, challenge.timeLimit - elapsed);
  }, [challenge]);

  /** Reset */
  const resetSpeedrun = useCallback(() => {
    clearTimeout(timerRef.current);
    completedRef.current = {};
    progressRef.current = {};
    setChallenge(null);
    setShowResult(null);
  }, []);

  const completedCount = Object.keys(completedRef.current).length;

  // Cleanup on deactivate
  useEffect(() => {
    if (!active) {
      clearTimeout(timerRef.current);
      setChallenge(null);
    }
  }, [active]);

  return {
    challenge,
    showResult,
    startChallenge,
    updateProgress,
    getTimeLeft,
    resetSpeedrun,
    completedCount,
    totalChallenges: null
  };
}
