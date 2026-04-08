"use client";
import { useCallback, useRef, useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   The Void — alternate dark dimension triggered at high score
   ───────────────────────────────────────────────────────────────────────────
   Entry condition: score >= 6000 + press V key
   Duration: 60 seconds
   Physics: reversed colors, inverted gravity, special boss (null_entity)
   Score: separate void score tracked independently
   ═══════════════════════════════════════════════════════════════════════════ */

export function useVoidDimension(active, playSound) {
  const [inVoid, setInVoid] = useState(false);
  const [voidTimer, setVoidTimer] = useState(60);
  const [voidScore, setVoidScore] = useState(0);
  const [nullEntity, setNullEntity] = useState(null); // invisible boss { x, y, radius, visible }
  const timerRef = useRef(null);
  const entityRef = useRef(null);
  const entityMoveRef = useRef(null);
  const flickerRef = useRef(null);
  const voidScoreRef = useRef(0);

  const cleanupVoid = useCallback(() => {
    setInVoid(false);
    clearInterval(timerRef.current);
    clearInterval(entityMoveRef.current);
    clearTimeout(flickerRef.current);
    entityRef.current = null;
    setNullEntity(null);
  }, []);

  const exitVoid = useCallback(() => {
    const score = voidScoreRef.current;
    cleanupVoid();
    playSound?.('unlock_rare');
    return score;
  }, [cleanupVoid, playSound]);

  const addVoidScore = useCallback((points) => {
    setVoidScore(prev => {
      const next = prev + points;
      voidScoreRef.current = next;
      return next;
    });
  }, []);

  const enterVoid = useCallback(() => {
    if (inVoid) return;
    setInVoid(true);
    setVoidScore(0);
    voidScoreRef.current = 0;
    setVoidTimer(60);
    playSound?.('unlock_mythic');

    // Spawn null entity after 5s
    setTimeout(() => {
      const e = {
        x: Math.random() * (window.innerWidth - 100) + 50,
        y: Math.random() * (window.innerHeight * 0.6) + 50,
        radius: 35,
        visible: false,
        hp: 3,
      };
      entityRef.current = e;
      setNullEntity({ ...e });

      // Slow drift
      entityMoveRef.current = setInterval(() => {
        const ent = entityRef.current;
        if (!ent) return;
        ent.x += (Math.random() - 0.5) * 4;
        ent.y += (Math.random() - 0.5) * 4;
        ent.x = Math.max(40, Math.min(window.innerWidth - 40, ent.x));
        ent.y = Math.max(40, Math.min(window.innerHeight - 40, ent.y));
        setNullEntity({ ...ent });
      }, 200);

      // Flicker visible briefly every 3-5s
      const doFlicker = () => {
        const ent = entityRef.current;
        if (!ent) return;
        ent.visible = true;
        setNullEntity(prev => prev ? { ...prev, visible: true } : null);
        setTimeout(() => {
          if (entityRef.current) {
            entityRef.current.visible = false;
            setNullEntity(prev => prev ? { ...prev, visible: false } : null);
          }
        }, 400);
        flickerRef.current = setTimeout(doFlicker, 3000 + Math.random() * 2000);
      };
      flickerRef.current = setTimeout(doFlicker, 2000);
    }, 5000);
  }, [inVoid, playSound]);

  // Countdown timer
  useEffect(() => {
    if (!inVoid) return;
    timerRef.current = setInterval(() => {
      setVoidTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [inVoid]);

  // Auto-exit when timer hits 0
  useEffect(() => {
    if (inVoid && voidTimer <= 0) {
      cleanupVoid();
      playSound?.('unlock_rare');
    }
  }, [inVoid, voidTimer, cleanupVoid, playSound]);

  /** Hit the null entity */
  const hitNullEntity = useCallback((x, y) => {
    const e = entityRef.current;
    if (!e) return null;
    const dist = Math.hypot(x - e.x, y - e.y);
    if (dist > e.radius + 20) return null;

    e.hp--;
    if (e.hp <= 0) {
      clearInterval(entityMoveRef.current);
      clearTimeout(flickerRef.current);
      entityRef.current = null;
      setNullEntity(null);
      addVoidScore(500);
      playSound?.('unlock_legendary');
      return 'null_entity'; // defeated
    }
    playSound?.('impact');
    setNullEntity({ ...e });
    return 'hit';
  }, [addVoidScore, playSound]);

  return {
    inVoid,
    voidTimer,
    voidScore,
    nullEntity,
    enterVoid,
    exitVoid,
    addVoidScore,
    hitNullEntity,
  };
}
