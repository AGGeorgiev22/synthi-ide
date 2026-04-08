"use client";
import { useCallback, useRef, useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   Ambient Drone — procedural background hum using Web Audio API
   ───────────────────────────────────────────────────────────────────────────
   Generates a filtered pad sound that evolves with weather/score.
   Max gain: 0.01 — barely audible, atmospheric only.
   ═══════════════════════════════════════════════════════════════════════════ */

const BASE_HZ = 55; // A1

export function useAmbientDrone(active, sfxOn, weatherStage) {
  const ctxRef = useRef(null);
  const nodesRef = useRef(null);
  const [droneActive, setDroneActive] = useState(false);

  const start = useCallback(() => {
    if (nodesRef.current || !sfxOn) return;
    try {
      const ctx = ctxRef.current || new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);

      // Two detuned oscillators for warmth
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = BASE_HZ;
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = BASE_HZ * 1.005; // slight detune

      // Low-pass filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 200;
      filter.Q.value = 1;

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);

      osc1.start();
      osc2.start();

      // Fade in
      gain.gain.linearRampToValueAtTime(0.008, ctx.currentTime + 3);

      nodesRef.current = { ctx, gain, osc1, osc2, filter };
      setDroneActive(true);
    } catch {
      // Audio not supported
    }
  }, [sfxOn]);

  const stop = useCallback(() => {
    if (!nodesRef.current) return;
    const { gain, osc1, osc2, ctx } = nodesRef.current;
    try {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(() => {
        try { osc1.stop(); } catch {}
        try { osc2.stop(); } catch {}
      }, 1200);
    } catch {}
    nodesRef.current = null;
    setDroneActive(false);
  }, []);

  // Auto start/stop with playground
  useEffect(() => {
    if (active && sfxOn) {
      start();
    } else {
      stop();
    }
    return () => stop();
  }, [active, sfxOn, start, stop]);

  // Evolve with weather
  useEffect(() => {
    if (!nodesRef.current) return;
    const { filter, gain, osc1, ctx } = nodesRef.current;
    try {
      const t = ctx.currentTime + 2;
      switch (weatherStage) {
        case 'storm':
          filter.frequency.linearRampToValueAtTime(350, t);
          gain.gain.linearRampToValueAtTime(0.01, t);
          osc1.frequency.linearRampToValueAtTime(BASE_HZ * 0.8, t);
          break;
        case 'rain':
          filter.frequency.linearRampToValueAtTime(250, t);
          gain.gain.linearRampToValueAtTime(0.009, t);
          osc1.frequency.linearRampToValueAtTime(BASE_HZ * 0.9, t);
          break;
        case 'solar':
          filter.frequency.linearRampToValueAtTime(300, t);
          gain.gain.linearRampToValueAtTime(0.007, t);
          osc1.frequency.linearRampToValueAtTime(BASE_HZ * 1.2, t);
          break;
        default:
          filter.frequency.linearRampToValueAtTime(200, t);
          gain.gain.linearRampToValueAtTime(0.006, t);
          osc1.frequency.linearRampToValueAtTime(BASE_HZ, t);
      }
    } catch {}
  }, [weatherStage]);

  return { droneActive };
}
