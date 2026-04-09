"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const BOSS_DEFS = {
  segfault: {
    name: "Segfault",
    icon: "⚠️",
    hp: 6,
    scoreThreshold: 1000,
    color: "#EF4444",
    size: 56,
    behavior: "jitter",
  },
  deadlock: {
    name: "Deadlock",
    icon: "⛓️",
    hp: 1,
    scoreThreshold: 2500,
    color: "#8B5CF6",
    size: 44,
    behavior: "linked",
  },
  race_condition: {
    name: "Race Condition",
    icon: "👻",
    hp: 2,
    scoreThreshold: 4000,
    color: "#F59E0B",
    size: 48,
    behavior: "teleport",
  },
};

const BOSS_REWARDS = {
  segfault: {
    id: "hot_patch",
    label: "HOT PATCH",
    desc: "Injects SCORE SURGE into the current run.",
    kind: "modifier",
    modifierId: "score_surge",
  },
  deadlock: {
    id: "breach_key",
    label: "BREACH KEY",
    desc: "Deploys a fresh portal pair into the arena.",
    kind: "portals",
  },
  race_condition: {
    id: "cache_overclock",
    label: "CACHE OVERCLOCK",
    desc: "Injects TIME WARP into the current run.",
    kind: "modifier",
    modifierId: "time_warp",
  },
};

function buildArenaEffect(boss) {
  if (!boss || boss.phase < 2) return null;

  switch (boss.id) {
    case "segfault":
      return { type: "segfault_field", label: "PANIC LOOP", intensity: 1.2, bossId: boss.id };
    case "deadlock":
      return { type: "lockfield", label: "CHAIN REACTION", intensity: 1.1, bossId: boss.id };
    case "race_condition":
      return { type: "time_skew", label: "RACE WINDOW", intensity: 1.25, bossId: boss.id };
    default:
      return null;
  }
}

export function useBossSystem(active, currentScore, playSound) {
  const [activeBoss, setActiveBoss] = useState(null);
  const [bossOrbs, setBossOrbs] = useState([]);
  const [arenaEffect, setArenaEffect] = useState(null);
  const [rewardDrop, setRewardDrop] = useState(null);

  const spawnedRef = useRef({});
  const bossRef = useRef(null);
  const rafRef = useRef(null);
  const teleportTimerRef = useRef(null);
  const deadlockResolvedRef = useRef(null);
  const orbsRef = useRef([]);
  const arenaEffectRef = useRef(null);

  const applyPhase = useCallback((boss, reason = "hp") => {
    if (!boss || boss.phase >= 2) return;

    boss.phase = 2;
    boss.phaseReason = reason;

    if (boss.id === "segfault") {
      boss.size += 12;
    }

    if (boss.id === "deadlock") {
      orbsRef.current = orbsRef.current.map((orb, index) => ({
        ...orb,
        vx: (index === 0 ? 1 : -1) * 2.6,
        vy: index === 0 ? -1.4 : 1.4,
      }));
    }

    const nextEffect = buildArenaEffect(boss);
    arenaEffectRef.current = nextEffect;
    setArenaEffect(nextEffect);
    setActiveBoss({ ...boss });
    playSound?.("impact");
  }, [playSound]);

  const resolveDefeat = useCallback((bossId) => {
    bossRef.current = null;
    orbsRef.current = [];
    setActiveBoss(null);
    setBossOrbs([]);
    arenaEffectRef.current = null;
    setArenaEffect(null);

    const reward = BOSS_REWARDS[bossId];
    if (reward) {
      setRewardDrop({ ...reward, bossId, grantedAt: Date.now() });
    }

    playSound?.("unlock_legendary");
    return bossId;
  }, [playSound]);

  useEffect(() => {
    if (!active || activeBoss) return;

    for (const [id, def] of Object.entries(BOSS_DEFS)) {
      if (spawnedRef.current[id]) continue;
      if (currentScore < def.scoreThreshold) continue;

      spawnedRef.current[id] = true;
      const boss = {
        id,
        ...def,
        currentHp: def.hp,
        x: Math.random() * (window.innerWidth - 120) + 60,
        y: Math.random() * (window.innerHeight * 0.5) + 60,
        spawnedAt: Date.now(),
        phase: 1,
        jitterX: 0,
        jitterY: 0,
      };
      bossRef.current = boss;
      setActiveBoss(boss);
      setArenaEffect(null);
      playSound?.("unlock_epic");

      if (id === "deadlock") {
        const orbs = [
          { x: boss.x - 100, y: boss.y, vx: 0.8, vy: 0.6, dragging: false },
          { x: boss.x + 100, y: boss.y, vx: -0.8, vy: -0.6, dragging: false },
        ];
        orbsRef.current = orbs;
        setBossOrbs(orbs.map((orb) => ({ x: orb.x, y: orb.y })));
      }
      break;
    }
  }, [active, activeBoss, currentScore, playSound]);

  useEffect(() => {
    if (!active || !activeBoss) {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(teleportTimerRef.current);
      return;
    }

    const step = () => {
      const boss = bossRef.current;
      if (!boss) return;

      if (boss.behavior === "jitter") {
        const jitterAmplitude = boss.phase >= 2 ? 15 : 8;
        boss.jitterX = (Math.random() - 0.5) * jitterAmplitude;
        boss.jitterY = (Math.random() - 0.5) * jitterAmplitude;
        boss.x = Math.max(30, Math.min(window.innerWidth - 60, boss.x + boss.jitterX));
        boss.y = Math.max(30, Math.min(window.innerHeight - 60, boss.y + boss.jitterY));

        if (boss.phase < 2 && boss.currentHp <= Math.ceil(boss.hp * 0.5)) {
          applyPhase(boss, "hp");
        } else {
          setActiveBoss((prev) => (prev ? { ...prev, x: boss.x, y: boss.y } : null));
        }
      }

      if (boss.behavior === "linked") {
        const elapsed = Date.now() - boss.spawnedAt;
        if (boss.phase < 2 && elapsed > 7000) {
          applyPhase(boss, "time");
        }

        const orbs = orbsRef.current;
        if (orbs.length === 2) {
          const midX = (orbs[0].x + orbs[1].x) / 2;
          const midY = (orbs[0].y + orbs[1].y) / 2;

          for (const orb of orbs) {
            if (orb.dragging) continue;

            orb.x += orb.vx;
            orb.y += orb.vy;

            if (orb.x < 30 || orb.x > window.innerWidth - 30) {
              orb.vx *= -1;
              orb.x = Math.max(30, Math.min(window.innerWidth - 30, orb.x));
            }
            if (orb.y < 30 || orb.y > window.innerHeight - 30) {
              orb.vy *= -1;
              orb.y = Math.max(30, Math.min(window.innerHeight - 30, orb.y));
            }

            orb.vx += (Math.random() - 0.5) * 0.15;
            orb.vy += (Math.random() - 0.5) * 0.15;

            if (boss.phase >= 2) {
              const pullX = midX - orb.x;
              const pullY = midY - orb.y;
              const pullDist = Math.max(Math.hypot(pullX, pullY), 1);
              orb.vx += (pullX / pullDist) * 0.18;
              orb.vy += (pullY / pullDist) * 0.18;
            }

            const speed = Math.hypot(orb.vx, orb.vy);
            const cap = boss.phase >= 2 ? 4.2 : 2.5;
            if (speed > cap) {
              orb.vx = (orb.vx / speed) * cap;
              orb.vy = (orb.vy / speed) * cap;
            }
          }

          const dist = Math.hypot(orbs[0].x - orbs[1].x, orbs[0].y - orbs[1].y);
          if (dist < 36) {
            deadlockResolvedRef.current = resolveDefeat(boss.id);
          } else {
            setBossOrbs(orbs.map((orb) => ({ x: orb.x, y: orb.y })));
          }
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    if (activeBoss.behavior === "teleport") {
      const doTeleport = () => {
        const boss = bossRef.current;
        if (!boss) return;

        boss.x = Math.random() * (window.innerWidth - 120) + 60;
        boss.y = Math.random() * (window.innerHeight * 0.6) + 60;
        setActiveBoss((prev) => (prev ? { ...prev, x: boss.x, y: boss.y } : null));

        const cadence = boss.phase >= 2
          ? 900 + Math.random() * 500
          : 1800 + Math.random() * 1200;
        teleportTimerRef.current = setTimeout(doTeleport, cadence);
      };

      teleportTimerRef.current = setTimeout(doTeleport, 2000);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(teleportTimerRef.current);
    };
  }, [active, activeBoss, applyPhase, resolveDefeat]);

  const hitBoss = useCallback((sourceX, sourceY) => {
    const boss = bossRef.current;
    if (!boss || boss.behavior !== "jitter") return null;

    const dist = Math.hypot(sourceX - boss.x, sourceY - boss.y);
    if (dist > boss.size + 30) return null;

    boss.currentHp -= 1;
    if (boss.currentHp <= 0) {
      return resolveDefeat(boss.id);
    }

    if (boss.phase < 2 && boss.currentHp <= Math.ceil(boss.hp * 0.5)) {
      applyPhase(boss, "hp");
    } else {
      setActiveBoss((prev) => (prev ? { ...prev, currentHp: boss.currentHp } : null));
    }
    playSound?.("impact");
    return "hit";
  }, [applyPhase, playSound, resolveDefeat]);

  const clickBoss = useCallback((clickX, clickY) => {
    const boss = bossRef.current;
    if (!boss || boss.behavior !== "teleport") return null;

    const dist = Math.hypot(clickX - boss.x, clickY - boss.y);
    if (dist > boss.size + 20) return null;

    boss.currentHp -= 1;
    if (boss.currentHp <= 0) {
      return resolveDefeat(boss.id);
    }

    if (boss.phase < 2 && boss.currentHp <= Math.ceil(boss.hp * 0.5)) {
      applyPhase(boss, "hp");
    } else {
      setActiveBoss((prev) => (prev ? { ...prev, currentHp: boss.currentHp } : null));
    }

    playSound?.("impact");
    return "hit";
  }, [applyPhase, playSound, resolveDefeat]);

  const checkDeadlockOrbs = useCallback(() => {
    const result = deadlockResolvedRef.current;
    if (result) {
      deadlockResolvedRef.current = null;
      return result;
    }
    return null;
  }, []);

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

  const dragOrb = useCallback((clientX, clientY) => {
    const orbs = orbsRef.current;
    for (const orb of orbs) {
      if (orb.dragging) {
        orb.x = clientX;
        orb.y = clientY;
      }
    }
  }, []);

  const releaseDragOrb = useCallback((vx, vy) => {
    const orbs = orbsRef.current;
    for (const orb of orbs) {
      if (orb.dragging) {
        orb.dragging = false;
        orb.vx = Math.max(-4.8, Math.min(4.8, (vx || 0) * 0.3));
        orb.vy = Math.max(-4.8, Math.min(4.8, (vy || 0) * 0.3));
      }
    }
  }, []);

  const clearReward = useCallback(() => {
    setRewardDrop(null);
  }, []);

  const resetBosses = useCallback(() => {
    spawnedRef.current = {};
    bossRef.current = null;
    orbsRef.current = [];
    deadlockResolvedRef.current = null;
    arenaEffectRef.current = null;
    setActiveBoss(null);
    setBossOrbs([]);
    setArenaEffect(null);
    setRewardDrop(null);
  }, []);

  return {
    activeBoss,
    bossOrbs,
    arenaEffect,
    rewardDrop,
    hitBoss,
    clickBoss,
    checkDeadlockOrbs,
    startDragOrb,
    dragOrb,
    releaseDragOrb,
    clearReward,
    resetBosses,
    BOSS_DEFS,
  };
}
