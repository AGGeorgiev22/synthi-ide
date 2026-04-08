"use client";
import { useCallback, useRef, useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   Speedrun Challenges — timed mini-tasks
   ───────────────────────────────────────────────────────────────────────────
   Challenges:
     collect_5     — collect 5 toys in 10 seconds
     orbit_3       — get 3 orbiters in 15 seconds
     pin_4         — pin 4 items in 12 seconds
     score_500     — score 500 points in 20 seconds
     combo_5       — reach combo 5 in 8 seconds
   ═══════════════════════════════════════════════════════════════════════════ */

const CHALLENGES = [
  { id: 'collect_5',  name: 'Speed Collect',  desc: 'Collect 5 toys',       target: 5,   timeLimit: 10, metric: 'collects' },
  { id: 'orbit_3',    name: 'Orbit Rush',     desc: 'Get 3 orbiters',      target: 3,   timeLimit: 15, metric: 'orbiters' },
  { id: 'pin_4',      name: 'Pin Blitz',      desc: 'Pin 4 items',         target: 4,   timeLimit: 12, metric: 'pins' },
  { id: 'score_500',  name: 'Score Sprint',   desc: 'Score 500 points',    target: 500, timeLimit: 20, metric: 'score' },
  { id: 'combo_5',    name: 'Combo Chain',    desc: 'Reach combo x5',      target: 5,   timeLimit: 8,  metric: 'combo' },
];

export { CHALLENGES };

export function useSpeedrunChallenge(active, playSound) {
  const [challenge, setChallenge] = useState(null); // { ...def, startTime, progress, completed }
  const [showResult, setShowResult] = useState(null); // 'success' | 'fail' | null
  const timerRef = useRef(null);
  const progressRef = useRef({});
  const completedRef = useRef({});

  /** Start a random uncompleted challenge */
  const startChallenge = useCallback(() => {
    if (challenge) return;
    const available = CHALLENGES.filter(c => !completedRef.current[c.id]);
    if (available.length === 0) return;
    const pick = available[Math.floor(Math.random() * available.length)];
    const c = { ...pick, startTime: Date.now(), progress: 0, completed: false };
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
    }, pick.timeLimit * 1000);
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
    totalChallenges: CHALLENGES.length
  };
}
