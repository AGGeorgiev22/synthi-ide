"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const VOID_PROGRESS_KEY = "synthi_void_progress";

const VOID_RELIC_POOL = [
  { id: "echo_seed", name: "Echo Seed", desc: "Start each void run one layer deeper.", color: "#34D399", minDepth: 1 },
  { id: "abyssal_lens", name: "Abyssal Lens", desc: "Gain extra time whenever a depth collapses.", color: "#60A5FA", minDepth: 2 },
  { id: "null_anchor", name: "Null Anchor", desc: "Void drift becomes easier to stabilize.", color: "#A78BFA", minDepth: 3 },
  { id: "shard_forge", name: "Shard Forge", desc: "Void scoring ramps faster at high depth.", color: "#F472B6", minDepth: 4 },
  { id: "anomaly_key", name: "Anomaly Key", desc: "Chaos loadouts gain an extra authored slot.", color: "#FBBF24", minDepth: 5 },
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function loadVoidProgress() {
  if (typeof window === "undefined") {
    return { bestDepth: 0, relics: {} };
  }

  try {
    const parsed = JSON.parse(localStorage.getItem(VOID_PROGRESS_KEY) || "null");
    return {
      bestDepth: Number(parsed?.bestDepth || 0),
      relics: parsed?.relics && typeof parsed.relics === "object" ? parsed.relics : {},
    };
  } catch {
    return { bestDepth: 0, relics: {} };
  }
}

function saveVoidProgress(progress) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(VOID_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage failures.
  }
}

function buildNullEntity(depth) {
  const radius = clamp(34 - depth * 1.6, 18, 34);
  return {
    x: Math.random() * (window.innerWidth - 120) + 60,
    y: Math.random() * (window.innerHeight * 0.62) + 60,
    radius,
    visible: false,
    hp: 2 + depth,
    maxHp: 2 + depth,
    speed: 2.4 + depth * 0.55,
    depth,
    phase: depth >= 4 ? 2 : 1,
    orbitSeed: Math.random() * Math.PI * 2,
  };
}

function chooseRelicDrop(depth, ownedRelics, prestigeLevel) {
  const ownedIds = new Set(Object.keys(ownedRelics));
  const unseen = VOID_RELIC_POOL.filter((relic) => relic.minDepth <= depth && !ownedIds.has(relic.id));
  const available = unseen.length > 0
    ? unseen
    : VOID_RELIC_POOL.filter((relic) => relic.minDepth <= Math.max(depth - 1, 1));

  if (available.length === 0) return null;

  const weightedIndex = Math.min(
    available.length - 1,
    Math.floor(Math.random() * Math.max(1, available.length - Math.min(prestigeLevel, available.length - 1))),
  );
  return available[weightedIndex];
}

export function useVoidDimension(active, playSound, prestigeLevel = 0) {
  const persistedProgress = useRef(loadVoidProgress()).current;

  const [inVoid, setInVoid] = useState(false);
  const [voidTimer, setVoidTimer] = useState(60);
  const [voidScore, setVoidScore] = useState(0);
  const [voidDepth, setVoidDepth] = useState(0);
  const [bestDepth, setBestDepth] = useState(persistedProgress.bestDepth || 0);
  const [nullEntity, setNullEntity] = useState(null);
  const [latestDrop, setLatestDrop] = useState(null);
  const [relicInventory, setRelicInventory] = useState(persistedProgress.relics || {});

  const timerRef = useRef(null);
  const entityRef = useRef(null);
  const entityMoveRef = useRef(null);
  const flickerRef = useRef(null);
  const spawnDelayRef = useRef(null);
  const voidScoreRef = useRef(0);
  const depthRef = useRef(0);
  const relicsRef = useRef(persistedProgress.relics || {});

  const entryScoreThreshold = Math.max(4200, 6000 - prestigeLevel * 250);

  const clearEntityLoops = useCallback(() => {
    clearInterval(entityMoveRef.current);
    clearTimeout(flickerRef.current);
    clearTimeout(spawnDelayRef.current);
    entityMoveRef.current = null;
    flickerRef.current = null;
    spawnDelayRef.current = null;
  }, []);

  useEffect(() => {
    relicsRef.current = relicInventory;
    saveVoidProgress({ bestDepth, relics: relicInventory });
  }, [bestDepth, relicInventory]);

  const spawnEntity = useCallback((depth, delayMs = 900) => {
    clearEntityLoops();

    spawnDelayRef.current = setTimeout(() => {
      const entity = buildNullEntity(depth);
      entityRef.current = entity;
      setNullEntity({ ...entity });

      entityMoveRef.current = setInterval(() => {
        const current = entityRef.current;
        if (!current) return;

        const time = Date.now() / 1000;
        const sway = Math.sin(time * (1.3 + depth * 0.08) + current.orbitSeed);
        const driftX = sway * current.speed + (Math.random() - 0.5) * current.speed * 0.8;
        const driftY = Math.cos(time * 0.8 + current.orbitSeed) * current.speed * 0.55 + (Math.random() - 0.5) * current.speed * 0.65;

        current.x = clamp(current.x + driftX, 40, window.innerWidth - 40);
        current.y = clamp(current.y + driftY, 40, window.innerHeight - 40);

        setNullEntity({ ...current });
      }, 160);

      const flicker = () => {
        const current = entityRef.current;
        if (!current) return;

        current.visible = true;
        setNullEntity((prev) => (prev ? { ...prev, visible: true } : null));

        const visibleWindow = Math.max(180, 430 - depth * 24);
        setTimeout(() => {
          if (!entityRef.current) return;
          entityRef.current.visible = false;
          setNullEntity((prev) => (prev ? { ...prev, visible: false } : null));
        }, visibleWindow);

        flickerRef.current = setTimeout(flicker, Math.max(750, 2100 - depth * 130) + Math.random() * 800);
      };

      flickerRef.current = setTimeout(flicker, Math.max(900, 1800 - depth * 80));
    }, delayMs);
  }, [clearEntityLoops]);

  const cleanupVoid = useCallback(() => {
    setInVoid(false);
    clearInterval(timerRef.current);
    timerRef.current = null;
    clearEntityLoops();
    entityRef.current = null;
    setNullEntity(null);
    setVoidDepth(0);
    depthRef.current = 0;
  }, [clearEntityLoops]);

  const exitVoid = useCallback(() => {
    const score = voidScoreRef.current;
    cleanupVoid();
    playSound?.("unlock_rare");
    return score;
  }, [cleanupVoid, playSound]);

  const addVoidScore = useCallback((points) => {
    setVoidScore((prev) => {
      const depth = Math.max(depthRef.current, 1);
      const scoreMultiplier = 1 + (depth - 1) * 0.12 + (relicsRef.current.shard_forge ? 0.16 : 0);
      const next = prev + Math.round(points * scoreMultiplier);
      voidScoreRef.current = next;
      return next;
    });
  }, []);

  const awardRelic = useCallback((clearedDepth) => {
    const drop = chooseRelicDrop(clearedDepth, relicsRef.current, prestigeLevel);
    if (!drop) return;

    setLatestDrop({ ...drop, depth: clearedDepth, foundAt: Date.now() });

    if (relicsRef.current[drop.id]) return;

    setRelicInventory((prev) => {
      const next = {
        ...prev,
        [drop.id]: {
          id: drop.id,
          name: drop.name,
          desc: drop.desc,
          color: drop.color,
          foundAt: Date.now(),
          depth: clearedDepth,
        },
      };
      relicsRef.current = next;
      return next;
    });
  }, [prestigeLevel]);

  const advanceDepth = useCallback(() => {
    const clearedDepth = depthRef.current;
    const nextDepth = clearedDepth + 1;

    awardRelic(clearedDepth);
    setBestDepth((prev) => Math.max(prev, clearedDepth));
    setVoidDepth(nextDepth);
    depthRef.current = nextDepth;
    setVoidTimer((prev) => Math.min(99, prev + 12 + prestigeLevel * 2 + (relicsRef.current.abyssal_lens ? 4 : 0)));

    spawnEntity(nextDepth, 900);
  }, [awardRelic, prestigeLevel, spawnEntity]);

  const enterVoid = useCallback(() => {
    if (inVoid) return;

    const relicStartDepthBonus = relicsRef.current.echo_seed ? 1 : 0;
    const prestigeStartDepthBonus = Math.min(2, Math.floor(prestigeLevel / 3));
    const initialDepth = 1 + relicStartDepthBonus + prestigeStartDepthBonus;
    const baseTimer = 60 + prestigeLevel * 4 + (relicsRef.current.abyssal_lens ? 6 : 0);

    setInVoid(true);
    setLatestDrop(null);
    setVoidScore(0);
    voidScoreRef.current = 0;
    setVoidDepth(initialDepth);
    depthRef.current = initialDepth;
    setVoidTimer(baseTimer);
    playSound?.("unlock_mythic");
    spawnEntity(initialDepth, 1300);
  }, [inVoid, playSound, prestigeLevel, spawnEntity]);

  useEffect(() => {
    if (!inVoid) return;

    timerRef.current = setInterval(() => {
      setVoidTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [inVoid]);

  useEffect(() => {
    if (!active && inVoid) {
      cleanupVoid();
    }
  }, [active, cleanupVoid, inVoid]);

  useEffect(() => {
    if (inVoid && voidTimer <= 0) {
      cleanupVoid();
      playSound?.("unlock_rare");
    }
  }, [cleanupVoid, inVoid, playSound, voidTimer]);

  const hitNullEntity = useCallback((x, y) => {
    const entity = entityRef.current;
    if (!entity) return null;

    const dist = Math.hypot(x - entity.x, y - entity.y);
    if (dist > entity.radius + 20) return null;

    entity.hp -= 1;

    if (entity.hp <= 0) {
      entityRef.current = null;
      clearEntityLoops();
      setNullEntity(null);
      addVoidScore(420 + depthRef.current * 180);
      playSound?.("unlock_legendary");
      advanceDepth();
      return "null_entity";
    }

    playSound?.("impact");
    setNullEntity({ ...entity });
    return "hit";
  }, [addVoidScore, advanceDepth, clearEntityLoops, playSound]);

  const getPhysicsMods = useCallback(() => {
    if (!inVoid) return null;

    const depth = Math.max(depthRef.current, 1);
    const pulse = (Math.sin(Date.now() / (600 - Math.min(depth * 30, 240))) + 1) / 2;

    return {
      gravityBias: -(0.045 + depth * 0.012),
      lateralDrift: (depth % 2 === 0 ? 0.05 : -0.05) * (1 + pulse * 0.6),
      maxSpeedMul: 1 + Math.min(0.5, depth * 0.08),
      jitterChance: Math.min(0.18, 0.03 + depth * 0.018),
      jitterForce: 0.07 + depth * 0.022,
      dragMul: relicsRef.current.null_anchor ? 0.94 : 0.98,
      scoreMul: 1 + depth * 0.1,
    };
  }, [inVoid]);

  return {
    inVoid,
    voidTimer,
    voidScore,
    voidDepth,
    bestDepth,
    entryScoreThreshold,
    nullEntity,
    latestDrop,
    relicInventory,
    enterVoid,
    exitVoid,
    addVoidScore,
    hitNullEntity,
    getPhysicsMods,
  };
}
