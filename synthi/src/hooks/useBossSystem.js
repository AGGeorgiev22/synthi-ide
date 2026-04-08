"use client";
import { useCallback, useRef, useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   Boss Encounters — periodic enemies that spawn at score thresholds
   ───────────────────────────────────────────────────────────────────────────
   Boss types:
     segfault      — jitters around, collect 5 hits via collision
     deadlock      — two linked orbs, must collide them into each other
     race_condition — teleports every 2s, catch with slow-mo + collect
   ═══════════════════════════════════════════════════════════════════════════ */

const BOSS_DEFS = {
  segfault: {
    name: 'Segfault',
    icon: '⚠️',
    hp: 5,
    scoreThreshold: 1000,
    color: '#EF4444',
    size: 56,
    behavior: 'jitter',
  },
  deadlock: {
    name: 'Deadlock',
    icon: '⛓️',
    hp: 1, // defeated by colliding the two orbs
    scoreThreshold: 2500,
    color: '#8B5CF6',
    size: 44,
    behavior: 'linked',
  },
  race_condition: {
    name: 'Race Condition',
    icon: '👻',
    hp: 1, // click to catch
    scoreThreshold: 4000,
    color: '#F59E0B',
    size: 48,
    behavior: 'teleport',
  },
};

export function useBossSystem(active, currentScore, playSound) {
  const [activeBoss, setActiveBoss] = useState(null); // { id, ...def, hp, x, y, spawned }
  const [bossOrbs, setBossOrbs] = useState([]); // deadlock orbs: [{x,y,vx,vy}]
  const spawnedRef = useRef({}); // track which bosses have been spawned this session
  const bossRef = useRef(null);
  const rafRef = useRef(null);
  const teleportTimerRef = useRef(null);
  const deadlockResolvedRef = useRef(null);

  const orbsRef = useRef([]); // mutable orb data for RAF

  // Check score thresholds for spawning
  useEffect(() => {
    if (!active || activeBoss) return;
    for (const [id, def] of Object.entries(BOSS_DEFS)) {
      if (spawnedRef.current[id]) continue;
      if (currentScore >= def.scoreThreshold) {
        spawnedRef.current[id] = true;
        const boss = {
          id,
          ...def,
          currentHp: def.hp,
          x: Math.random() * (window.innerWidth - 120) + 60,
          y: Math.random() * (window.innerHeight * 0.5) + 60,
          spawnedAt: Date.now(),
          jitterX: 0,
          jitterY: 0,
        };
        bossRef.current = boss;
        setActiveBoss(boss);
        playSound?.('unlock_epic');

        if (id === 'deadlock') {
          const orbs = [
            { x: boss.x - 100, y: boss.y, vx: 0.8, vy: 0.6, dragging: false },
            { x: boss.x + 100, y: boss.y, vx: -0.8, vy: -0.6, dragging: false },
          ];
          orbsRef.current = orbs;
          setBossOrbs(orbs.map(o => ({ x: o.x, y: o.y })));
        }
        break;
      }
    }
  }, [active, currentScore, activeBoss, playSound]);

  // Boss animation RAF
  useEffect(() => {
    if (!active || !activeBoss) {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(teleportTimerRef.current);
      return;
    }

    const step = () => {
      const boss = bossRef.current;
      if (!boss) return;

      if (boss.behavior === 'jitter') {
        boss.jitterX = (Math.random() - 0.5) * 8;
        boss.jitterY = (Math.random() - 0.5) * 8;
        boss.x = Math.max(30, Math.min(window.innerWidth - 60, boss.x + boss.jitterX));
        boss.y = Math.max(30, Math.min(window.innerHeight - 60, boss.y + boss.jitterY));
        setActiveBoss(prev => prev ? { ...prev, x: boss.x, y: boss.y } : null);
      }

      // ── Deadlock orb physics ──
      if (boss.behavior === 'linked') {
        const orbs = orbsRef.current;
        if (orbs.length === 2) {
          for (const orb of orbs) {
            if (orb.dragging) continue;
            // Drift with gentle oscillation
            orb.x += orb.vx;
            orb.y += orb.vy;
            // Bounce off screen edges
            if (orb.x < 30 || orb.x > window.innerWidth - 30) { orb.vx *= -1; orb.x = Math.max(30, Math.min(window.innerWidth - 30, orb.x)); }
            if (orb.y < 30 || orb.y > window.innerHeight - 30) { orb.vy *= -1; orb.y = Math.max(30, Math.min(window.innerHeight - 30, orb.y)); }
            // Gentle wobble
            orb.vx += (Math.random() - 0.5) * 0.15;
            orb.vy += (Math.random() - 0.5) * 0.15;
            // Speed cap
            const speed = Math.hypot(orb.vx, orb.vy);
            if (speed > 2.5) { orb.vx = (orb.vx / speed) * 2.5; orb.vy = (orb.vy / speed) * 2.5; }
          }
          // Check if the two orbs collide
          const dist = Math.hypot(orbs[0].x - orbs[1].x, orbs[0].y - orbs[1].y);
          if (dist < 36) {
            // Deadlock broken!
            const id = boss.id;
            bossRef.current = null;
            orbsRef.current = [];
            setActiveBoss(null);
            setBossOrbs([]);
            playSound?.('unlock_legendary');
            deadlockResolvedRef.current = id;
          } else {
            setBossOrbs(orbs.map(o => ({ x: o.x, y: o.y })));
          }
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    // Teleport timer for race_condition
    if (activeBoss.behavior === 'teleport') {
      const doTeleport = () => {
        const boss = bossRef.current;
        if (!boss) return;
        boss.x = Math.random() * (window.innerWidth - 120) + 60;
        boss.y = Math.random() * (window.innerHeight * 0.6) + 60;
        setActiveBoss(prev => prev ? { ...prev, x: boss.x, y: boss.y } : null);
        teleportTimerRef.current = setTimeout(doTeleport, 1800 + Math.random() * 1200);
      };
      teleportTimerRef.current = setTimeout(doTeleport, 2000);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(teleportTimerRef.current);
    };
  }, [active, activeBoss?.id]);

  /** Hit boss (called from collision detection / click) */
  const hitBoss = useCallback((sourceX, sourceY) => {
    const boss = bossRef.current;
    if (!boss) return null;

    const dist = Math.hypot(sourceX - boss.x, sourceY - boss.y);
    if (dist > boss.size + 30) return null;

    boss.currentHp--;
    if (boss.currentHp <= 0) {
      const id = boss.id;
      bossRef.current = null;
      setActiveBoss(null);
      setBossOrbs([]);
      playSound?.('unlock_legendary');
      return id; // defeated
    }
    playSound?.('impact');
    setActiveBoss(prev => prev ? { ...prev, currentHp: boss.currentHp } : null);
    return 'hit';
  }, [playSound]);

  /** Click boss directly (for race_condition) */
  const clickBoss = useCallback((clickX, clickY) => {
    const boss = bossRef.current;
    if (!boss) return null;
    if (boss.behavior !== 'teleport') return null;
    const dist = Math.hypot(clickX - boss.x, clickY - boss.y);
    if (dist > boss.size + 20) return null;
    boss.currentHp = 0;
    const id = boss.id;
    bossRef.current = null;
    setActiveBoss(null);
    playSound?.('unlock_legendary');
    return id;
  }, [playSound]);

  /** Check deadlock orb collision — returns boss id if just resolved */
  const checkDeadlockOrbs = useCallback(() => {
    const result = deadlockResolvedRef.current;
    if (result) {
      deadlockResolvedRef.current = null;
      return result;
    }
    return null;
  }, []);

  /** Start dragging a deadlock orb. Returns true if an orb was grabbed. */
  const startDragOrb = useCallback((clientX, clientY) => {
    const orbs = orbsRef.current;
    for (const orb of orbs) {
      const dist = Math.hypot(clientX - orb.x, clientY - orb.y);
      if (dist < 30) {
        orb.dragging = true;
        return true;
      }
    }
    return false;
  }, []);

  /** Move dragged orb */
  const dragOrb = useCallback((clientX, clientY) => {
    const orbs = orbsRef.current;
    for (const orb of orbs) {
      if (orb.dragging) {
        orb.x = clientX;
        orb.y = clientY;
      }
    }
  }, []);

  /** Release dragged orb with fling velocity */
  const releaseDragOrb = useCallback((vx, vy) => {
    const orbs = orbsRef.current;
    for (const orb of orbs) {
      if (orb.dragging) {
        orb.dragging = false;
        orb.vx = Math.max(-4, Math.min(4, (vx || 0) * 0.3));
        orb.vy = Math.max(-4, Math.min(4, (vy || 0) * 0.3));
      }
    }
  }, []);

  /** Reset for new session */
  const resetBosses = useCallback(() => {
    spawnedRef.current = {};
    bossRef.current = null;
    setActiveBoss(null);
    setBossOrbs([]);
  }, []);

  return { activeBoss, bossOrbs, hitBoss, clickBoss, checkDeadlockOrbs, startDragOrb, dragOrb, releaseDragOrb, resetBosses, BOSS_DEFS };
}
