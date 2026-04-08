"use client";
import { useCallback, useRef, useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   Weather System — dynamic sky conditions that affect gameplay
   ───────────────────────────────────────────────────────────────────────────
   Stages cycle every 45-90s:
     clear    → normal (default)
     rain     → particles fall, friction increases
     storm    → lightning flashes, stronger gravity pulses
     solar    → warm glow, toys drift upward occasionally
   ═══════════════════════════════════════════════════════════════════════════ */

const STAGES = ['clear', 'rain', 'storm', 'solar'];
const STAGE_DURATIONS = { clear: [40, 70], rain: [30, 55], storm: [20, 40], solar: [25, 50] };

function randomDuration(stage) {
  const [min, max] = STAGE_DURATIONS[stage];
  return (min + Math.random() * (max - min)) * 1000;
}

export function useWeatherSystem(active, onStageChange) {
  const [stage, setStage] = useState('clear');
  const [lightning, setLightning] = useState(false);
  const [raindrops, setRaindrops] = useState([]);
  const timerRef = useRef(null);
  const raindropIdRef = useRef(0);
  const rainIntervalRef = useRef(null);
  const lightningTimeoutRef = useRef(null);
  const stageRef = useRef('clear');
  const onStageChangeRef = useRef(onStageChange);
  onStageChangeRef.current = onStageChange;

  const transition = useCallback(() => {
    const current = stageRef.current;
    const pool = STAGES.filter(s => s !== current);
    const next = pool[Math.floor(Math.random() * pool.length)];
    stageRef.current = next;
    setStage(next);
    onStageChangeRef.current?.(next);

    // Schedule next transition
    timerRef.current = setTimeout(transition, randomDuration(next));
  }, []);

  useEffect(() => {
    if (!active) {
      clearTimeout(timerRef.current);
      clearInterval(rainIntervalRef.current);
      clearTimeout(lightningTimeoutRef.current);
      setStage('clear');
      setRaindrops([]);
      setLightning(false);
      stageRef.current = 'clear';
      return;
    }
    // Start first transition after 8-15s
    timerRef.current = setTimeout(transition, 8000 + Math.random() * 7000);
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(rainIntervalRef.current);
      clearTimeout(lightningTimeoutRef.current);
    };
  }, [active, transition]);

  // Rain particle spawner
  useEffect(() => {
    if (!active) return;
    clearInterval(rainIntervalRef.current);
    if (stage === 'rain' || stage === 'storm') {
      const rate = stage === 'storm' ? 40 : 80;
      rainIntervalRef.current = setInterval(() => {
        const id = ++raindropIdRef.current;
        const drop = {
          id,
          x: Math.random() * 100,
          speed: 1.5 + Math.random() * 2,
          opacity: 0.15 + Math.random() * 0.25,
          delay: Math.random() * 0.5,
        };
        setRaindrops(prev => [...prev.slice(-60), drop]);
      }, rate);
      return () => clearInterval(rainIntervalRef.current);
    }
  }, [active, stage]);

  // Lightning flash for storm
  useEffect(() => {
    if (!active || stage !== 'storm') {
      setLightning(false);
      return;
    }
    const flash = () => {
      setLightning(true);
      setTimeout(() => setLightning(false), 120);
      lightningTimeoutRef.current = setTimeout(flash, 3000 + Math.random() * 6000);
    };
    lightningTimeoutRef.current = setTimeout(flash, 1500 + Math.random() * 3000);
    return () => clearTimeout(lightningTimeoutRef.current);
  }, [active, stage]);

  /** Physics modifiers for RAF loop */
  const getPhysicsMods = useCallback(() => {
    const s = stageRef.current;
    return {
      frictionMul: s === 'rain' ? 0.88 : s === 'storm' ? 0.85 : 1,
      gravityPulse: s === 'storm' ? (Math.random() < 0.02 ? (Math.random() - 0.5) * 0.4 : 0) : 0,
      solarDrift: s === 'solar' ? -0.02 : 0,
    };
  }, []);

  return { stage, lightning, raindrops, getPhysicsMods };
}
