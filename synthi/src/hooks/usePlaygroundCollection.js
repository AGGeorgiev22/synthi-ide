"use client";
import { useCallback, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   COLLECTIBLE ITEMS — 25 items across 5 rarity tiers
   ═══════════════════════════════════════════════════════════════════════════ */

export const RARITY = {
  common:       { label: 'Common',       color: '#94A3B8', glow: 'rgba(148,163,184,0.35)', border: 'rgba(148,163,184,0.4)' },
  rare:         { label: 'Rare',         color: '#60A5FA', glow: 'rgba(96,165,250,0.4)',   border: 'rgba(96,165,250,0.5)' },
  epic:         { label: 'Epic',         color: '#A78BFA', glow: 'rgba(167,139,250,0.45)', border: 'rgba(167,139,250,0.5)' },
  legendary:    { label: 'Legendary',    color: '#FBBF24', glow: 'rgba(251,191,36,0.45)',  border: 'rgba(251,191,36,0.5)' },
  mythic:       { label: 'Mythic',       color: '#F472B6', glow: 'rgba(244,114,182,0.5)',  border: 'rgba(244,114,182,0.6)' },
  transcendent: { label: 'Transcendent', color: '#34D399', glow: 'rgba(52,211,153,0.55)',  border: 'rgba(52,211,153,0.65)' },
  secret:        { label: '????',         color: '#FF6B6B', glow: 'rgba(255,107,107,0.5)',   border: 'rgba(255,107,107,0.6)' },
};

export const COLLECTIBLE_ITEMS = [
  // ── Common (8) — playground basics ──
  { id: 'null_pointer',  name: 'Null Pointer',      rarity: 'common', icon: '⛔', hint: 'Every journey starts with a single click.' },
  { id: 'syntax_token',  name: 'Syntax Token {}',    rarity: 'common', icon: '{ }', hint: 'Curly braces hold more than code.' },
  { id: 'stack_frame',   name: 'Stack Frame',        rarity: 'common', icon: '▦',  hint: 'When worlds collide, traces are left behind.' },
  { id: 'binary_star',   name: 'Binary Star',        rarity: 'common', icon: '✦',  hint: 'Two lights circle the same darkness.' },
  { id: 'cache_hit',     name: 'Cache Hit',          rarity: 'common', icon: '⚡', hint: 'Speed is the key. Be faster than the machine.' },
  { id: 'debug_probe',   name: 'Debug Probe',        rarity: 'common', icon: '🔍', hint: 'Pin, unpin, repeat. Persistence is a virtue.' },
  { id: 'pixel_dust',    name: 'Pixel Dust',         rarity: 'common', icon: '✨', hint: 'Hold the world still — even for a moment.' },
  { id: 'heat_sink',     name: 'Heat Sink',          rarity: 'common', icon: '🔥', hint: 'Chain reactions generate heat.' },

  // ── Rare (6) — playground advanced ──
  { id: 'quantum_lock',  name: 'Quantum Lock',       rarity: 'rare', icon: '🔒', hint: 'All four elements must exist at once.' },
  { id: 'event_horizon', name: 'Event Horizon',      rarity: 'rare', icon: '🌀', hint: 'Five lights, one center, infinite pull.' },
  { id: 'merge_conflict',name: 'Merge Conflict',     rarity: 'rare', icon: '💥', hint: 'Orbiting paths were never meant to cross.' },
  { id: 'cold_boot',     name: 'Cold Boot',          rarity: 'rare', icon: '🧊', hint: 'A round number, exactly reached.' },
  { id: 'zero_day',      name: 'Zero-Day',           rarity: 'rare', icon: '⏱️', hint: 'Five catches, ten seconds. No hesitation.' },
  { id: 'dark_matter',   name: 'Dark Matter',        rarity: 'rare', icon: '🌑', hint: 'Push them away, then grab them back.' },

  // ── Epic (6) — page-wide scavenger hunt ──
  { id: 'golden_semicolon', name: 'Golden Semicolon',  rarity: 'epic', icon: ';',  hint: 'End your statement with conviction in the editor.' },
  { id: 'four_oh_four',     name: '404 Fragment',      rarity: 'epic', icon: '?',  hint: 'Something glitches where questions are answered.' },
  { id: 'root_shell',       name: 'Root Shell',        rarity: 'epic', icon: '#',  hint: 'The command palette understands authority.' },
  { id: 'ghost_process',    name: 'Ghost Process',     rarity: 'epic', icon: '👻', hint: 'A phantom line flickers where the system boots.' },
  { id: 'phantom_deploy',   name: 'Phantom Deploy',    rarity: 'epic', icon: '🚀', hint: 'Catch the exact moment the deploy lands.' },
  { id: 'kernel_patch',     name: 'Kernel Patch',      rarity: 'epic', icon: '🩹', hint: 'A glitch hides in the comparison grid header.' },

  // ── Legendary (4) — puzzle chains ──
  { id: 'compilers_key',  name: "The Compiler's Key",  rarity: 'legendary', icon: '🔑', hint: 'Three epics unlock the first clue. Follow the stars. Speak the name.' },
  { id: 'infinite_loop',  name: 'Infinite Loop',       rarity: 'legendary', icon: '∞',  hint: 'An ancient code, entered at peak momentum.' },
  { id: 'memory_leak',    name: 'Memory Leak',         rarity: 'legendary', icon: '💧', hint: 'Letters spill from the machine after enough is gathered.' },
  { id: 'overflow',       name: 'Overflow',            rarity: 'legendary', icon: '📈', hint: 'When the score breaks, click the cracks.' },

  // ── Mythic (1) — the ultimate (wave 1) ──
  { id: 'source_code',    name: 'The Source Code',     rarity: 'mythic', icon: '💎', hint: 'Collect everything. Then witness the origin.' },

  // ══════════════ Wave 2 — "The Deep End" ══════════════

  // ── Common (2) — boss + weather ──
  { id: 'segfault_handler', name: 'Segfault Handler',  rarity: 'common', icon: '🛡️', hint: 'Defeat the jittering intruder at 1000.' },
  { id: 'stormchaser',      name: 'Stormchaser',       rarity: 'common', icon: '⛈️', hint: 'Witness three skies in a single session.' },

  // ── Rare (3) — constellations + boss ──
  { id: 'triforce',          name: 'Triforce',          rarity: 'rare', icon: '🔺', hint: 'Three points of light, none in a line.' },
  { id: 'polaris',           name: 'Polaris',           rarity: 'rare', icon: '⭐', hint: 'Five fixed stars and one wanderer.' },
  { id: 'deadlock_breaker',  name: 'Deadlock Breaker',  rarity: 'rare', icon: '⛓️', hint: 'Two linked orbs — make them meet.' },

  // ── Epic (2) — boss + speedrun ──
  { id: 'race_winner',   name: 'Race Winner',    rarity: 'epic', icon: '🏁', hint: 'Catch the one that teleports. Slow time helps.' },
  { id: 'speedrunner',   name: 'Speedrunner',    rarity: 'epic', icon: '⏱️', hint: 'Complete five different timed challenges.' },

  // ── Legendary (2) — void ──
  { id: 'void_walker',    name: 'Void Walker',     rarity: 'legendary', icon: '🕳️', hint: 'In the dark dimension, defeat the invisible.' },
  { id: 'void_architect', name: 'Void Architect',  rarity: 'legendary', icon: '🏗️', hint: 'Score 2000 in a single trip to the other side.' },

  // ── Transcendent (1) — the true ultimate ──
  { id: 'the_deep_end', name: 'The Deep End', rarity: 'transcendent', icon: '🌊', hint: 'All 34 fragments. The abyss stares back.' },

  // ══════════════ Wave 4 — "Phase 2 Mechanics" ══════════════

  // ── Rare (1) — arena mutations ──
  { id: 'chaos_surfer', name: 'Chaos Surfer', rarity: 'rare', icon: '🏄', hint: 'Survive three arena mutations in a single session.' },

  // ── Epic (1) — portals ──
  { id: 'wormhole_weaver', name: 'Wormhole Weaver', rarity: 'epic', icon: '🌀', hint: 'Send five objects through a portal pair.' },

  // ── Legendary (1) — gravity wells ──
  { id: 'singularity', name: 'Singularity', rarity: 'legendary', icon: '⚫', hint: 'Three wells active, eight objects caught in their pull.' },

  // ══════════════ Wave 5 — "Phase 3 Progression" ══════════════

  // ── Epic (1) — toy fusion ──
  { id: 'alchemist', name: 'Alchemist', rarity: 'epic', icon: '⚗️', hint: 'Discover a named fusion recipe.' },

  // ── Legendary (1) — fusion mastery ──
  { id: 'philosophers_stone', name: "Philosopher's Stone", rarity: 'legendary', icon: '🪨', hint: 'Perform five fusions in a single session.' },

  // ── Transcendent (1) — prestige ──
  { id: 'eternal_return', name: 'Eternal Return', rarity: 'transcendent', icon: '♾️', hint: 'Reset everything to grow stronger.' },

  // ── ???? (5) — secret ──
  { id: 'sasha',          name: '???',            rarity: 'secret', icon: '🐱', hint: 'Type something special in the editor...' },
  { id: 'rubber_duck',    name: 'Rubber Duck',    rarity: 'secret', icon: '🦆', hint: 'Talk it out. Click the lone duck where pricing lives.' },
  { id: 'y2k_bug',        name: 'Y2K Bug',        rarity: 'secret', icon: '🪲', hint: 'Dates are dangerous. Find the hidden timestamp.' },
  { id: 'rm_rf',          name: 'rm -rf /',        rarity: 'secret', icon: '💀', hint: 'The most dangerous command. Chaos brings it forth.' },
  { id: 'its_alive',      name: "It's Alive!",     rarity: 'secret', icon: '⚡', hint: 'Bring 8 orbiters to life at once.' },
];

const STORAGE_KEY = 'synthi_playground_collection';
const SESSION_STATS_KEY = 'synthi_playground_stats';
const STORAGE_VERSION = 2;

/* ─── localStorage read/write ───────────────────────────────────────────── */

function loadCollection() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Accept v1 data (just items) — migrate up
    if (parsed?.version === 1 || parsed?.version === STORAGE_VERSION) return parsed;
    return null;
  } catch {
    return null;
  }
}

function saveCollection(data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, version: STORAGE_VERSION }));
  } catch {
    // quota exceeded — silently fail
  }
}

/* ─── Session stats persistence ──────────────────────────────────────── */

function loadSessionStats() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_STATS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSessionStats(stats) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_STATS_KEY, JSON.stringify(stats));
  } catch {}
}

/* ═══════════════════════════════════════════════════════════════════════════
   usePlaygroundCollection — centralized state via ref + imperative updates
   ───────────────────────────────────────────────────────────────────────────
   Performance strategy:
   - All mutable game state lives in a single ref (no React re-renders for
     tracking logic that runs every frame).
   - React state is only updated when an item is actually unlocked (rare event)
     or the journal is opened.
   - The `check()` helper is called from existing playground callbacks
     (collectToy, collision handler, etc.) — it does NOT run every RAF frame.
   - Sequential chain state (e.g. Memory Leak letters) is tracked via
     the same ref, no additional useEffects.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Generate randomized unlock thresholds for this session */
function generateSessionThresholds() {
  const rand = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  return {
    syntaxTokenCollects: rand(2, 5),        // common: session collects to unlock syntax_token
    heatSinkCombo: rand(2, 5),              // common: combo needed for heat_sink
    cacheHitWindow: rand(300, 800),         // common: ms window to collect after spawn for cache_hit
    quantumLockKinds: rand(3, 4),           // rare: unique kinds needed for quantum_lock
    zeroDayCollects: rand(3, 7),            // rare: collects within window for zero_day
    darkMatterCollects: rand(2, 5),         // rare: collects after repel for dark_matter
    debugProbeToggles: rand(4, 8),          // common: pin toggles for debug_probe
    binaryStarOrbiters: rand(2, 3),         // common: orbiters for binary_star
    eventHorizonOrbiters: rand(4, 7),       // rare: orbiters for event_horizon
    itsAliveOrbiters: rand(6, 10),          // secret: orbiters for it's_alive
    coldBootScore: rand(800, 1500),         // rare: score threshold for cold_boot
    portalTraversals: rand(3, 7),           // epic: portal traversals for wormhole_weaver
    chaosWellCount: rand(2, 4),             // legendary: well count for singularity
    chaosCaughtCount: rand(5, 10),          // legendary: caught count for singularity
    mutationsSurvived: rand(2, 5),          // rare: mutations for chaos_surfer
    fusionCountStone: rand(3, 7),           // legendary: fusions for philosopher's stone
    chaosRainCount: rand(2, 5),             // secret: chaos rains for rm_rf
    starClicks: rand(5, 10),               // legendary: star clicks for compiler's key chain
    speedrunCompletions: rand(3, 7),        // epic: speedrun completions for speedrunner
    voidArchitectScore: rand(1500, 3000),   // legendary: void score for void_architect
    weatherStagesSeen: rand(2, 4),          // common: weather stages for stormchaser
  };
}

export function usePlaygroundCollection(onUnlock) {
  // ── persistent ref for all mutable tracking state ──
  const stateRef = useRef(null);

  // Lazy init from localStorage
  if (stateRef.current === null) {
    const saved = loadCollection();
    const savedStats = loadSessionStats();
    stateRef.current = {
      // Randomized thresholds for this session
      thresholds: generateSessionThresholds(),
      // items: { [itemId]: { unlockedAt: number } }
      items: saved?.items ?? {},
      // per-session volatile trackers (not persisted across page loads)
      sessionCollects: 0,
      sessionFirstCollectTime: 0,
      recentCollectTimes: [],      // timestamps of recent toy collections (for Zero-Day: 5 in 10s)
      pinToggles: {},              // { [itemId]: count } — track per-item pin toggles for Debug Probe
      usedSlowMo: false,
      starClicks: 0,               // shooting star clicks (for Compiler's Key chain)
      memoryLeakLetters: [],        // letters collected so far for Memory Leak
      memoryLeakNextIndex: 0,       // next letter index to spawn
      memoryLeakCurrentSpawnId: null, // active letter spawn ID
      compilerKeyStep: 0,          // 0=not started, 1=clicked 7 stars, 2=typed vectant
      cmdPaletteInput: '',         // captured typed text in command palette
      overflowClicked: false,
      // clue progression gates
      epicHintsShown: false,
      legendaryHintsShown: false,
      // force mode tracking for Dark Matter
      lastRepelActivation: 0,
      collectsSinceRepel: 0,
      // ── Wave 2 trackers ──
      weatherStagesSeen: new Set(),   // weather stages witnessed this session
      bossesDefeated: {},             // { bossId: true }
      constellationsFormed: {},       // { pattern: true }
      speedrunCompleted: {},          // { challengeId: true }
      voidVisits: 0,
      voidBestScore: 0,
      // ── Secret trackers ──
      chaosRainCount: 0,             // rm_rf: triggered by 3 chaos rains in a session
      // ── Persistent session stats (survive page reload) ──
      lifetimeStats: savedStats ?? {
        totalScore: 0,
        bestScore: 0,
        totalCollisions: 0,
        totalLaunches: 0,
        totalToys: 0,
        bossesDefeated: 0,
        sessionsPlayed: 0,
        totalPlaytimeMs: 0,
        bestCombo: 0,
        voidTrips: 0,
        speedrunsCompleted: 0,
      },
    };
  }

  const s = stateRef.current;

  /* ─── core helpers ────────────────────────────────────────────────────── */

  const has = useCallback((id) => !!s.items[id], [s]);

  const count = useCallback(() => Object.keys(s.items).length, [s]);

  const countByRarity = useCallback((rarity) =>
    COLLECTIBLE_ITEMS.filter(i => i.rarity === rarity && s.items[i.id]).length
  , [s]);

  const unlock = useCallback((id) => {
    if (s.items[id]) return false; // already unlocked
    const item = COLLECTIBLE_ITEMS.find(i => i.id === id);
    if (!item) return false;
    s.items[id] = { unlockedAt: Date.now() };
    saveCollection({ items: s.items });
    if (onUnlock) onUnlock(item);
    return true;
  }, [s, onUnlock]);

  /* ─── tier gates ──────────────────────────────────────────────────────── */

  const canSeeRareHints = useCallback(() => countByRarity('common') >= 5, [countByRarity]);
  const canSeeEpicHints = useCallback(() => countByRarity('rare') >= 3, [countByRarity]);
  const canSeeLegendaryHints = useCallback(() => countByRarity('epic') >= 3, [countByRarity]);

  /* ─── event handlers (called from page.js at specific moments) ──────── */

  /** Called when a toy is collected. Handles Common + Rare checks. */
  const onToyCollected = useCallback((spawn, currentScore, currentCombo, allSpawns) => {
    s.sessionCollects++;
    const now = Date.now();
    if (s.sessionCollects === 1) s.sessionFirstCollectTime = now;

    // Track recent collect times for Zero-Day
    s.recentCollectTimes.push(now);
    // Prune old entries (older than 10s)
    s.recentCollectTimes = s.recentCollectTimes.filter(t => now - t < 10000);

    // ── Common triggers ──
    unlock('null_pointer'); // first collect ever
    if (s.sessionCollects >= s.thresholds.syntaxTokenCollects) unlock('syntax_token');
    if (currentCombo >= s.thresholds.heatSinkCombo) unlock('heat_sink');

    // Cache Hit: collected within threshold ms of spawn
    if (spawn._spawnTime && now - spawn._spawnTime < s.thresholds.cacheHitWindow) unlock('cache_hit');

    // ── Rare triggers ──
    // Quantum Lock: enough toy kinds on screen at once
    const kinds = new Set(allSpawns.map(s2 => s2.kind));
    kinds.add(spawn.kind);
    if (kinds.size >= s.thresholds.quantumLockKinds) unlock('quantum_lock');

    // Zero-Day: N collects in 10 seconds
    if (s.recentCollectTimes.length >= s.thresholds.zeroDayCollects) unlock('zero_day');

    // Dark Matter: used repel, then collect N within 2s of repel activation
    if (s.lastRepelActivation && now - s.lastRepelActivation < 2000) {
      s.collectsSinceRepel++;
      if (s.collectsSinceRepel >= s.thresholds.darkMatterCollects) unlock('dark_matter');
    }
  }, [s, unlock]);

  /** Called when a collision occurs in the RAF loop. */
  const onCollision = useCallback((aId, bId, bodies) => {
    unlock('stack_frame');
    // Merge Conflict: both items are orbiting
    const aBody = bodies[aId];
    const bBody = bodies[bId];
    if (aBody?.orbit && bBody?.orbit) unlock('merge_conflict');
  }, [s, unlock]);

  /** Called when orbit count changes. */
  const onOrbitChange = useCallback((orbitCount) => {
    if (orbitCount >= s.thresholds.binaryStarOrbiters) unlock('binary_star');
    if (orbitCount >= s.thresholds.eventHorizonOrbiters) unlock('event_horizon');
    if (orbitCount >= s.thresholds.itsAliveOrbiters) unlock('its_alive');
  }, [s, unlock]);

  /** Called when an item is pinned/unpinned. */
  const onPinToggle = useCallback((id) => {
    s.pinToggles[id] = (s.pinToggles[id] || 0) + 1;
    if (s.pinToggles[id] >= s.thresholds.debugProbeToggles) unlock('debug_probe');
  }, [s, unlock]);

  /** Called when slow-mo is activated. */
  const onSlowMo = useCallback(() => {
    if (!s.usedSlowMo) {
      s.usedSlowMo = true;
      unlock('pixel_dust');
    }
  }, [s, unlock]);

  /** Called when score changes. */
  const onScoreChange = useCallback((prevScore, newScore) => {
    // Cold Boot: score crosses threshold
    if (prevScore < s.thresholds.coldBootScore && newScore >= s.thresholds.coldBootScore) unlock('cold_boot');
    // Overflow: score >= 5000 (just marks eligibility — clicking the glitch unlocks it)
    // (handled in page.js via overflowEligible)
  }, [unlock]);

  /** Called when repel force is activated. */
  const onRepelActivated = useCallback(() => {
    s.lastRepelActivation = Date.now();
    s.collectsSinceRepel = 0;
  }, [s]);

  /** Phase 2: Called when a body teleports through a portal. */
  const onPortalTraversal = useCallback(() => {
    s.portalTraversals = (s.portalTraversals || 0) + 1;
    if (s.portalTraversals >= s.thresholds.portalTraversals) unlock('wormhole_weaver');
  }, [s, unlock]);

  /** Phase 2: Called to check gravity well collectible (3 wells, 8+ objects in pull). */
  const onGravityWellCheck = useCallback((wellCount, caughtCount) => {
    if (wellCount >= s.thresholds.chaosWellCount && caughtCount >= s.thresholds.chaosCaughtCount) unlock('singularity');
  }, [unlock]);

  /** Phase 2: Called when an arena mutation completes. */
  const onArenaMutationSurvived = useCallback(() => {
    s.mutationsSurvived = (s.mutationsSurvived || 0) + 1;
    if (s.mutationsSurvived >= s.thresholds.mutationsSurvived) unlock('chaos_surfer');
  }, [s, unlock]);

  /** Phase 3: Called when a toy fusion is performed. */
  const onToyFusion = useCallback((recipeName) => {
    s.fusionCount = (s.fusionCount || 0) + 1;
    if (recipeName !== 'Alloy') unlock('alchemist'); // named recipe = alchemist
    if (s.fusionCount >= s.thresholds.fusionCountStone) unlock('philosophers_stone');
  }, [s, unlock]);

  /** Phase 3: Called when player prestiges. */
  const onPrestige = useCallback(() => {
    unlock('eternal_return');
  }, [unlock]);

  /* ─── Epic triggers (called from page-wide interactions) ──────────── */

  const onEditorCollectSemicolon = useCallback(() => unlock('golden_semicolon'), [unlock]);
  const onSashaEgg = useCallback(() => unlock('sasha'), [unlock]);
  const on404Click = useCallback(() => unlock('four_oh_four'), [unlock]);
  const onRootShell = useCallback(() => unlock('root_shell'), [unlock]);
  const onGhostProcess = useCallback(() => unlock('ghost_process'), [unlock]);
  const onPhantomDeploy = useCallback(() => unlock('phantom_deploy'), [unlock]);
  const onKernelPatch = useCallback(() => unlock('kernel_patch'), [unlock]);

  /* ─── Secret triggers ─────────────────────────────────────────────── */
  const onRubberDuckClick = useCallback(() => unlock('rubber_duck'), [unlock]);
  const onY2kBugClick = useCallback(() => unlock('y2k_bug'), [unlock]);
  const onChaosRain = useCallback(() => {
    s.chaosRainCount++;
    if (s.chaosRainCount >= s.thresholds.chaosRainCount) unlock('rm_rf');
  }, [s, unlock]);

  /* ─── Legendary triggers ────────────────────────────────────────────── */

  /** Compiler's Key chain: step tracking */
  const onShootingStarClick = useCallback(() => {
    if (!canSeeLegendaryHints() || s.compilerKeyStep !== 0) return;
    if (countByRarity('epic') < 3) return;
    s.starClicks++;
    if (s.starClicks >= s.thresholds.starClicks) {
      s.compilerKeyStep = 1;
    }
  }, [s, canSeeLegendaryHints, countByRarity]);

  const onCommandPaletteSynthi = useCallback(() => {
    if (s.compilerKeyStep === 1) {
      s.compilerKeyStep = 2;
      unlock('compilers_key');
    }
  }, [s, unlock]);

  /** Infinite Loop: Konami while playground active with combo >= 5 */
  const onKonami = useCallback((currentCombo) => {
    if (currentCombo >= 5) unlock('infinite_loop');
  }, [unlock]);

  /** Memory Leak: letter spawns after 15+ items */
  const MEMORY_LETTERS = useMemo(() => ['S', 'Y', 'N', 'T', 'H', 'I'], []);

  const shouldSpawnMemoryLetter = useCallback(() => {
    if (has('memory_leak')) return null;
    if (count() < 15) return null;
    if (s.memoryLeakCurrentSpawnId) return null; // one at a time
    if (s.memoryLeakNextIndex >= MEMORY_LETTERS.length) return null;
    return MEMORY_LETTERS[s.memoryLeakNextIndex];
  }, [s, has, count, MEMORY_LETTERS]);

  const onMemoryLetterSpawned = useCallback((spawnId) => {
    s.memoryLeakCurrentSpawnId = spawnId;
  }, [s]);

  const onMemoryLetterCollected = useCallback((letter) => {
    s.memoryLeakLetters.push(letter);
    s.memoryLeakCurrentSpawnId = null;
    s.memoryLeakNextIndex++;
    if (s.memoryLeakLetters.length >= MEMORY_LETTERS.length) {
      unlock('memory_leak');
    }
  }, [s, MEMORY_LETTERS, unlock]);

  /** Overflow: score >= 5000 makes display glitchy, clicking it unlocks */
  const onOverflowClick = useCallback((currentScore) => {
    if (currentScore >= 5000 && !s.overflowClicked) {
      s.overflowClicked = true;
      unlock('overflow');
    }
  }, [s, unlock]);

  /* ─── Wave 2 triggers ──────────────────────────────────────────────── */

  /** Weather: track stages witnessed this session */
  const onWeatherChange = useCallback((stage) => {
    s.weatherStagesSeen.add(stage);
    if (s.weatherStagesSeen.size >= s.thresholds.weatherStagesSeen) unlock('stormchaser');
  }, [s, unlock]);

  /** Boss defeated */
  const onBossDefeated = useCallback((bossId) => {
    s.bossesDefeated[bossId] = true;
    if (bossId === 'segfault') unlock('segfault_handler');
    if (bossId === 'deadlock') unlock('deadlock_breaker');
    if (bossId === 'race_condition') unlock('race_winner');
    if (bossId === 'null_entity') unlock('void_walker');
  }, [s, unlock]);

  /** Constellation formed */
  const onConstellationFormed = useCallback((pattern) => {
    if (s.constellationsFormed[pattern]) return;
    s.constellationsFormed[pattern] = true;
    if (pattern === 'triangle') unlock('triforce');
    if (pattern === 'star') unlock('polaris');
  }, [s, unlock]);

  /** Speedrun challenge completed */
  const onSpeedrunCompleted = useCallback((challengeId) => {
    s.speedrunCompleted[challengeId] = true;
    if (Object.keys(s.speedrunCompleted).length >= s.thresholds.speedrunCompletions) unlock('speedrunner');
  }, [s, unlock]);

  /** Void visit stats */
  const onVoidExit = useCallback((voidScore) => {
    s.voidVisits++;
    if (voidScore > s.voidBestScore) s.voidBestScore = voidScore;
    if (voidScore >= s.thresholds.voidArchitectScore) unlock('void_architect');
  }, [s, unlock]);

  /* ─── Mythic + Transcendent ──────────────────────────────────────────── */

  const WAVE1_COUNT = 24; // non-mythic wave 1 items
  const TOTAL_NON_TRANSCENDENT = COLLECTIBLE_ITEMS.filter(i => i.rarity !== 'transcendent').length;

  const checkMythic = useCallback(() => {
    // Source Code: all 24 wave-1 non-mythic items
    if (!has('source_code')) {
      const w1Items = COLLECTIBLE_ITEMS.filter(i => i.rarity !== 'mythic' && i.rarity !== 'transcendent' && i.rarity !== 'secret' && i.id !== 'the_deep_end' && !['segfault_handler','stormchaser','triforce','polaris','deadlock_breaker','race_winner','speedrunner','void_walker','void_architect'].includes(i.id));
      const collected = w1Items.filter(i => s.items[i.id]).length;
      if (collected >= w1Items.length) {
        unlock('source_code');
        return 'mythic';
      }
    }
    // The Deep End: all items except itself and secret rarity
    if (!has('the_deep_end')) {
      const all = COLLECTIBLE_ITEMS.filter(i => i.id !== 'the_deep_end' && i.rarity !== 'secret');
      const collected = all.filter(i => s.items[i.id]).length;
      if (collected >= all.length) {
        unlock('the_deep_end');
        return 'transcendent';
      }
    }
    return false;
  }, [s, has, unlock]);

  /* ─── Journal data (snapshot for rendering) ─────────────────────────── */

  const getSnapshot = useCallback(() => ({
    items: { ...s.items },
    totalCollected: Object.keys(s.items).length,
    compilerKeyStep: s.compilerKeyStep,
    starClicks: s.starClicks,
    memoryLeakLetters: [...s.memoryLeakLetters],
    lifetimeStats: { ...s.lifetimeStats },
  }), [s]);

  /* ─── Session stats persistence ─────────────────────────────────────── */

  const updateLifetimeStat = useCallback((key, delta) => {
    s.lifetimeStats[key] = (s.lifetimeStats[key] || 0) + delta;
    saveSessionStats(s.lifetimeStats);
  }, [s]);

  const updateLifetimeBest = useCallback((key, value) => {
    if (value > (s.lifetimeStats[key] || 0)) {
      s.lifetimeStats[key] = value;
      saveSessionStats(s.lifetimeStats);
    }
  }, [s]);

  const onSessionStart = useCallback(() => {
    updateLifetimeStat('sessionsPlayed', 1);
  }, [updateLifetimeStat]);

  const onSessionEnd = useCallback((sessionScore, sessionDurationMs) => {
    updateLifetimeStat('totalScore', sessionScore);
    updateLifetimeBest('bestScore', sessionScore);
    updateLifetimeStat('totalPlaytimeMs', sessionDurationMs);
  }, [updateLifetimeStat, updateLifetimeBest]);

  const onLifetimeCollision = useCallback(() => {
    updateLifetimeStat('totalCollisions', 1);
  }, [updateLifetimeStat]);

  const onLifetimeLaunch = useCallback(() => {
    updateLifetimeStat('totalLaunches', 1);
  }, [updateLifetimeStat]);

  const onLifetimeToyCollect = useCallback(() => {
    updateLifetimeStat('totalToys', 1);
  }, [updateLifetimeStat]);

  const onLifetimeBossDefeat = useCallback(() => {
    updateLifetimeStat('bossesDefeated', 1);
  }, [updateLifetimeStat]);

  const onLifetimeCombo = useCallback((combo) => {
    updateLifetimeBest('bestCombo', combo);
  }, [updateLifetimeBest]);

  const onLifetimeVoidTrip = useCallback(() => {
    updateLifetimeStat('voidTrips', 1);
  }, [updateLifetimeStat]);

  const onLifetimeSpeedrun = useCallback(() => {
    updateLifetimeStat('speedrunsCompleted', 1);
  }, [updateLifetimeStat]);

  /** Reset collection (for journal reset button) */
  const resetCollection = useCallback(() => {
    s.items = {};
    s.sessionCollects = 0;
    s.recentCollectTimes = [];
    s.pinToggles = {};
    s.usedSlowMo = false;
    s.starClicks = 0;
    s.memoryLeakLetters = [];
    s.memoryLeakNextIndex = 0;
    s.memoryLeakCurrentSpawnId = null;
    s.compilerKeyStep = 0;
    s.overflowClicked = false;
    s.lastRepelActivation = 0;
    s.collectsSinceRepel = 0;
    s.weatherStagesSeen = new Set();
    s.bossesDefeated = {};
    s.constellationsFormed = {};
    s.speedrunCompleted = {};
    s.voidVisits = 0;
    s.voidBestScore = 0;
    s.chaosRainCount = 0;
    s.fusionCount = 0;
    s.mutationsSurvived = 0;
    s.lifetimeStats = {
      totalScore: 0, bestScore: 0, totalCollisions: 0, totalLaunches: 0,
      totalToys: 0, bossesDefeated: 0, sessionsPlayed: 0, totalPlaytimeMs: 0,
      bestCombo: 0, voidTrips: 0, speedrunsCompleted: 0,
    };
    saveCollection({ items: {} });
    saveSessionStats(s.lifetimeStats);
  }, [s]);

  return useMemo(() => ({
    has, count, countByRarity, unlock, getSnapshot, resetCollection,
    canSeeRareHints, canSeeEpicHints, canSeeLegendaryHints,
    // event handlers
    onToyCollected, onCollision, onOrbitChange, onPinToggle, onSlowMo,
    onScoreChange, onRepelActivated,
    // epic
    onEditorCollectSemicolon, onSashaEgg, on404Click, onRootShell, onGhostProcess,
    onPhantomDeploy, onKernelPatch,
    // legendary
    onShootingStarClick, onCommandPaletteSynthi, onKonami,
    shouldSpawnMemoryLetter, onMemoryLetterSpawned, onMemoryLetterCollected,
    onOverflowClick,
    // mythic
    checkMythic,
    // wave 2
    onWeatherChange, onBossDefeated, onConstellationFormed,
    onSpeedrunCompleted, onVoidExit,
    // wave 4 (phase 2)
    onPortalTraversal, onGravityWellCheck, onArenaMutationSurvived,
    // wave 5 (phase 3)
    onToyFusion, onPrestige,
    // constants
    MEMORY_LETTERS,
    // new secret triggers
    onRubberDuckClick, onY2kBugClick, onChaosRain,
    // lifetime stats
    onSessionStart, onSessionEnd, onLifetimeCollision, onLifetimeLaunch,
    onLifetimeToyCollect, onLifetimeBossDefeat, onLifetimeCombo,
    onLifetimeVoidTrip, onLifetimeSpeedrun,
    updateLifetimeStat, updateLifetimeBest,
  }), [
    MEMORY_LETTERS,
    canSeeEpicHints,
    canSeeLegendaryHints,
    canSeeRareHints,
    checkMythic,
    count,
    countByRarity,
    getSnapshot,
    has,
    on404Click,
    onArenaMutationSurvived,
    onBossDefeated,
    onChaosRain,
    onCollision,
    onCommandPaletteSynthi,
    onConstellationFormed,
    onEditorCollectSemicolon,
    onGhostProcess,
    onGravityWellCheck,
    onKernelPatch,
    onKonami,
    onLifetimeBossDefeat,
    onLifetimeCollision,
    onLifetimeCombo,
    onLifetimeLaunch,
    onLifetimeSpeedrun,
    onLifetimeToyCollect,
    onLifetimeVoidTrip,
    onMemoryLetterCollected,
    onMemoryLetterSpawned,
    onOrbitChange,
    onOverflowClick,
    onPhantomDeploy,
    onPinToggle,
    onPortalTraversal,
    onPrestige,
    onRepelActivated,
    onRootShell,
    onRubberDuckClick,
    onScoreChange,
    onSessionEnd,
    onSessionStart,
    onSashaEgg,
    onShootingStarClick,
    onSlowMo,
    onSpeedrunCompleted,
    onToyCollected,
    onToyFusion,
    onVoidExit,
    onWeatherChange,
    onY2kBugClick,
    resetCollection,
    shouldSpawnMemoryLetter,
    unlock,
    updateLifetimeBest,
    updateLifetimeStat,
  ]);
}
