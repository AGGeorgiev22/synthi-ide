"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChevronDown, Rocket, Zap, Shield, Users, Cloud, Linkedin, Play, Unlock, Terminal, ArrowRight, Clock, Check, Star, GitBranch, Globe, Cpu, Code, Sparkles, Volume2, VolumeX, Home, Layers, HelpCircle, DollarSign, GripVertical, ArrowUp, Trophy } from "lucide-react";
import { toast } from "sonner";
import { usePlaygroundCollection, COLLECTIBLE_ITEMS, RARITY } from "@/hooks/usePlaygroundCollection";
import PlaygroundJournal from "@/components/PlaygroundJournal";
import { useWeatherSystem } from "@/hooks/useWeatherSystem";
import { useBossSystem } from "@/hooks/useBossSystem";
import { useConstellationSystem } from "@/hooks/useConstellationSystem";
import { useSpeedrunChallenge } from "@/hooks/useSpeedrunChallenge";
import { useAmbientDrone } from "@/hooks/useAmbientDrone";
import { useVoidDimension } from "@/hooks/useVoidDimension";
import useDailySeedChallenge from "@/hooks/useDailySeedChallenge";
import useGhostReplay from "@/hooks/useGhostReplay";

const BUILD_LOGS = [
  { text: "Allocating cloud node...", delay: 0 },
  { text: "Compiling dependencies...", delay: 400 },
  { text: "Building project...", delay: 900 },
];

/* ---------- Crate modifier definitions ---------- */
const CRATE_MODIFIERS = [
  { id: 'zero_friction',  label: 'ZERO FRICTION',   desc: 'everything slides like ice',       color: '#38bdf8', icon: '🧊', duration: 12000 },
  { id: 'mega_bounce',    label: 'MEGA BOUNCE',     desc: '3x restitution on impacts',        color: '#f472b6', icon: '🔴', duration: 12000 },
  { id: 'gravity_flip',   label: 'GRAVITY FLIP',    desc: 'what goes down must come up',       color: '#a78bfa', icon: '🔄', duration: 10000 },
  { id: 'clone_storm',    label: 'CLONE STORM',     desc: 'collisions spawn new toys',         color: '#34d399', icon: '🧬', duration: 10000 },
  { id: 'phantom_mode',   label: 'PHANTOM MODE',    desc: 'objects phase through each other',  color: '#94a3b8', icon: '👻', duration: 10000 },
  { id: 'score_surge',    label: 'SCORE SURGE',     desc: '5x score multiplier',               color: '#fbbf24', icon: '⚡', duration: 15000 },
  { id: 'magnet_pulse',   label: 'MAGNET PULSE',    desc: 'everything pulls toward cursor',    color: '#fb923c', icon: '🧲', duration: 12000 },
  { id: 'hyper_spin',     label: 'HYPER SPIN',      desc: 'all objects spin like crazy',        color: '#e879f9', icon: '🌀', duration: 10000 },
  { id: 'time_warp',      label: 'TIME WARP',       desc: 'physics run at 2x speed',           color: '#2dd4bf', icon: '⏩', duration: 10000 },
  { id: 'explosive_touch',label: 'EXPLOSIVE TOUCH', desc: 'collisions blast objects apart',     color: '#ef4444', icon: '💥', duration: 10000 },
];

const CREATOR_STORAGE_KEYS = {
  challenges: 'synthi_creator_challenges',
  modifierPacks: 'synthi_creator_modifier_packs',
  anomalyLoadouts: 'synthi_creator_anomaly_loadouts',
  presets: 'synthi_sandbox_presets',
};

const CREATOR_CHALLENGE_METRICS = [
  { id: 'score', label: 'Score Delta', mode: 'delta' },
  { id: 'collects', label: 'Collectibles', mode: 'delta' },
  { id: 'collisions', label: 'Collisions', mode: 'delta' },
  { id: 'combo', label: 'Combo Peak', mode: 'absolute' },
  { id: 'orbiters', label: 'Orbiters', mode: 'absolute' },
  { id: 'pins', label: 'Pinned', mode: 'absolute' },
];

const CHAOS_OBJECTIVE_POOL = [
  { metric: 'score', gen: () => ({ target: 200 + Math.floor(Math.random() * 600), label: (t) => `Score ${t}+ during the event` }) },
  { metric: 'collects', gen: () => ({ target: 2 + Math.floor(Math.random() * 6), label: (t) => `Collect ${t} fragments` }) },
  { metric: 'collisions', gen: () => ({ target: 5 + Math.floor(Math.random() * 12), label: (t) => `Trigger ${t} collisions` }) },
  { metric: 'combo', gen: () => ({ target: 2 + Math.floor(Math.random() * 5), label: (t) => `Hit a x${t} combo` }) },
  { metric: 'orbiters', gen: () => ({ target: 2 + Math.floor(Math.random() * 3), label: (t) => `Hold ${t} orbiters at once` }) },
  { metric: 'pins', gen: () => ({ target: 2 + Math.floor(Math.random() * 4), label: (t) => `Pin ${t} items` }) },
];

const generateRandomObjective = () => {
  const pick = CHAOS_OBJECTIVE_POOL[Math.floor(Math.random() * CHAOS_OBJECTIVE_POOL.length)];
  const { target, label } = pick.gen();
  return { metric: pick.metric, target, label: label(target) };
};

const CHAOS_EVENTS = [
  {
    id: 'black_sun',
    name: 'BLACK SUN',
    desc: 'Reverse drift. Code shards and satellites flood the arena.',
    color: '#f59e0b',
    icon: '☀',
    duration: 32000,
    reward: { kind: 'modifier', modifierId: 'gravity_flip', label: 'SUN SHARD' },
    effects: {
      gravityOverride: 'reverse',
      lateralDrift: 0.08,
      scoreMultiplier: 1.3,
      spawnKinds: ['code', 'satellite'],
    },
  },
  {
    id: 'mirror_cache',
    name: 'MIRROR CACHE',
    desc: 'Collisions duplicate pressure patterns across the room.',
    color: '#60a5fa',
    icon: '◫',
    duration: 28000,
    reward: { kind: 'modifier', modifierId: 'clone_storm', label: 'CACHE GHOST' },
    effects: {
      forceOverride: 'magnet',
      scoreMultiplier: 1.15,
      collisionImpulseMul: 1.2,
      spawnKinds: ['relay', 'code'],
    },
  },
  {
    id: 'signal_bloom',
    name: 'SIGNAL BLOOM',
    desc: 'Relays blossom into a combo-rich attract field.',
    color: '#34d399',
    icon: '✦',
    duration: 30000,
    reward: { kind: 'modifier', modifierId: 'magnet_pulse', label: 'BLOOM CORE' },
    effects: {
      forceOverride: 'magnet',
      scoreMultiplier: 1.2,
      spawnKinds: ['relay', 'toast'],
    },
  },
  {
    id: 'orbital_harvest',
    name: 'ORBITAL HARVEST',
    desc: 'The arena wants structure. Orbiters pay out in surplus score.',
    color: '#a78bfa',
    icon: '◎',
    duration: 34000,
    reward: { kind: 'modifier', modifierId: 'score_surge', label: 'HARVEST KEY' },
    effects: {
      gravityOverride: 'zero',
      scoreMultiplier: 1.35,
      spawnKinds: ['satellite', 'toast'],
    },
  },
];

const readStoredList = (key) => {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStoredList = (key, list) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Ignore storage failures.
  }
};

const PLAYGROUND_HUD_STORAGE_KEY = 'synthi_playground_hud_position';
const PLAYGROUND_HUD_MARGIN = 16;
const PLAYGROUND_HUD_TOP_CLEARANCE = 76;
const PLAYGROUND_MAX_FLING_SPEED = 30;
const PLAYGROUND_MAX_TRAVEL_SPEED = 28;
const PLAYGROUND_THROWAWAY_SPEED = 14;
const PLAYGROUND_THROWAWAY_SPIN = 0.12;
const PLAYGROUND_MAX_ANGULAR_SPEED = 0.26;
const PLAYGROUND_DRAG_STIFFNESS = 0.22;
const PLAYGROUND_DRAG_DAMPING = 0.18;
const PLAYGROUND_DRAG_TORQUE = 0.0011;
const PLAYGROUND_POSITIONAL_SLOP = 0.6;
const PLAYGROUND_POSITIONAL_CORRECTION = 0.82;
const PLAYGROUND_SLEEP_LINEAR_THRESHOLD = 0.035;
const PLAYGROUND_SLEEP_ANGULAR_THRESHOLD = 0.0008;
const PLAYGROUND_SLEEP_FRAMES = 18;
const PLAYGROUND_BROADPHASE_CELL_SIZE = 220;
const PLAYGROUND_CONTACT_CACHE_TTL = 220;
const PLAYGROUND_WARM_START_SCALE = 0.72;
const PLAYGROUND_POINTER_FLING_BLEND = 1.04;

const clampNumber = (value, min, max) => Math.min(Math.max(value, min), max);

const rotateVector = (x, y, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos,
  };
};

const dotProduct = (ax, ay, bx, by) => (ax * bx) + (ay * by);
const crossProduct = (ax, ay, bx, by) => (ax * by) - (ay * bx);

const normalizeVector = (x, y) => {
  const length = Math.hypot(x, y);
  if (length <= 0.00001) return { x: 0, y: 0, length: 0 };
  return { x: x / length, y: y / length, length };
};

const getObbVertices = (centerX, centerY, width, height, angle) => {
  const halfW = width / 2;
  const halfH = height / 2;
  const corners = [
    { x: -halfW, y: -halfH },
    { x: halfW, y: -halfH },
    { x: halfW, y: halfH },
    { x: -halfW, y: halfH },
  ];
  return corners.map((corner) => {
    const rotated = rotateVector(corner.x, corner.y, angle);
    return {
      x: centerX + rotated.x,
      y: centerY + rotated.y,
    };
  });
};

const projectVerticesOntoAxis = (vertices, axisX, axisY) => {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  vertices.forEach((vertex) => {
    const projection = dotProduct(vertex.x, vertex.y, axisX, axisY);
    if (projection < min) min = projection;
    if (projection > max) max = projection;
  });
  return { min, max };
};

const getSupportPoint = (vertices, dirX, dirY) => {
  let bestVertex = vertices[0];
  let bestProjection = Number.NEGATIVE_INFINITY;
  vertices.forEach((vertex) => {
    const projection = dotProduct(vertex.x, vertex.y, dirX, dirY);
    if (projection > bestProjection) {
      bestProjection = projection;
      bestVertex = vertex;
    }
  });
  return bestVertex;
};

const getObbCollisionData = (a, b) => {
  const aVertices = getObbVertices(a.centerX, a.centerY, a.width, a.height, a.angle);
  const bVertices = getObbVertices(b.centerX, b.centerY, b.width, b.height, b.angle);
  const aAxisX = rotateVector(1, 0, a.angle);
  const aAxisY = rotateVector(0, 1, a.angle);
  const bAxisX = rotateVector(1, 0, b.angle);
  const bAxisY = rotateVector(0, 1, b.angle);
  const axes = [aAxisX, aAxisY, bAxisX, bAxisY];

  let minOverlap = Number.POSITIVE_INFINITY;
  let normalX = 0;
  let normalY = 0;

  for (const axis of axes) {
    const normal = normalizeVector(axis.x, axis.y);
    const aProjection = projectVerticesOntoAxis(aVertices, normal.x, normal.y);
    const bProjection = projectVerticesOntoAxis(bVertices, normal.x, normal.y);
    const overlap = Math.min(aProjection.max, bProjection.max) - Math.max(aProjection.min, bProjection.min);
    if (overlap <= 0) return null;
    if (overlap < minOverlap) {
      minOverlap = overlap;
      normalX = normal.x;
      normalY = normal.y;
    }
  }

  const deltaX = b.centerX - a.centerX;
  const deltaY = b.centerY - a.centerY;
  if (dotProduct(deltaX, deltaY, normalX, normalY) < 0) {
    normalX *= -1;
    normalY *= -1;
  }

  const supportA = getSupportPoint(aVertices, normalX, normalY);
  const supportB = getSupportPoint(bVertices, -normalX, -normalY);

  return {
    depth: minOverlap,
    normalX,
    normalY,
    contactX: (supportA.x + supportB.x) / 2,
    contactY: (supportA.y + supportB.y) / 2,
  };
};

const getPlaygroundPairKey = (a, b) => (a < b ? `${a}::${b}` : `${b}::${a}`);

/* ---------- Language detection + syntax highlighting ---------- */
const INITIAL_CODE = `Write here!`;

const LANG_OUTPUTS = {
  TSX: "Dashboard rendered \u2014 3 charts loaded in 12ms",
  JavaScript: "Server listening on port 3000",
  Python: "INFO: Uvicorn running on http://0.0.0.0:8000 \u2014 200 OK",
  Rust: "Compiling vectant-server v0.1.0 \u2014 Finished release in 0.04s",
  Go: "Build successful \u2014 running main.go",
  "Plain Text": "Output complete",
};

const LANG_GLOWS = {
  TSX: "rgba(88, 164, 176, 0.3)",
  JavaScript: "rgba(88, 164, 176, 0.25)",
  Python: "rgba(55, 118, 171, 0.35)",
  Rust: "rgba(222, 120, 53, 0.3)",
  Go: "rgba(0, 173, 216, 0.3)",
  "Plain Text": "rgba(88, 164, 176, 0.15)",
};

const AI_SUGGESTIONS = {
  TSX: { comment: "memoize to avoid re-paint", code: "const chart = useMemo(() => buildChart(data), [data])" },
  JavaScript: { comment: "cache result to prevent redundant fetches", code: "const cached = memoize(fetchData, [key])" },
  Python: { comment: "add rate-limit to prevent abuse", code: "await rate_limit(request, max_calls=100)" },
  Rust: { comment: "add graceful shutdown handler", code: "tokio::signal::ctrl_c().await?;" },
  Go: { comment: "add context timeout", code: "ctx, cancel := context.WithTimeout(ctx, 5*time.Second)" },
  "Plain Text": { comment: "optimization available", code: "..." },
};

const PLAYGROUND_TOYS = [
  { kind: 'satellite', label: 'SAT-01', body: 'Micro node online', accent: '#58A4B0' },
  { kind: 'toast', label: 'Build ✓', body: 'Edge deploy stable', accent: '#34D399' },
  { kind: 'code', label: 'const orbit = true;', body: 'Fragmented code shard', accent: '#60A5FA' },
  { kind: 'relay', label: 'EDGE', body: 'Signal relay attached', accent: '#F472B6' },
];

/* Phase 3: Fusion recipes — [kindA, kindB] => result */
const FUSION_RECIPES = {
  'code+satellite': { kind: 'fused', label: 'NULL PTR', body: 'Core Dump', accent: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #60A5FA)' },
  'satellite+toast': { kind: 'fused', label: 'ORBITAL', body: 'Deploy Orbit', accent: '#2dd4bf', gradient: 'linear-gradient(135deg, #58A4B0, #34D399)' },
  'code+relay': { kind: 'fused', label: 'SIGNAL', body: 'Data Stream', accent: '#a78bfa', gradient: 'linear-gradient(135deg, #60A5FA, #F472B6)' },
  'relay+toast': { kind: 'fused', label: 'MESH', body: 'Edge Mesh', accent: '#fbbf24', gradient: 'linear-gradient(135deg, #F472B6, #34D399)' },
  'code+toast': { kind: 'fused', label: 'CI/CD', body: 'Pipeline Shard', accent: '#34d399', gradient: 'linear-gradient(135deg, #60A5FA, #34D399)' },
  'satellite+relay': { kind: 'fused', label: 'ARRAY', body: 'Satellite Array', accent: '#f472b6', gradient: 'linear-gradient(135deg, #58A4B0, #F472B6)' },
};
function getFusionKey(kindA, kindB) {
  return [kindA, kindB].sort().join('+');
}

/* Phase 3: Achievement Chains — multi-step in-session achievements */
const ACHIEVEMENT_CHAINS = [
  {
    id: 'chaos_theory',
    name: 'Chaos Theory',
    steps: [
      { label: 'Activate Clone Storm', check: 'clone_storm_active' },
      { label: '10 collisions in 5s', check: 'ten_collisions_5s' },
      { label: 'Defeat a boss', check: 'boss_defeated' },
      { label: 'Score 500+', check: 'score_500' },
    ],
  },
  {
    id: 'architects_dream',
    name: "Architect's Dream",
    steps: [
      { label: 'Pin 6 items', check: 'pin_6' },
      { label: 'Form a constellation', check: 'constellation_formed' },
      { label: 'Place a gravity well', check: 'gravity_well_placed' },
      { label: 'Attract 3 items to well', check: 'well_attract_3' },
    ],
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    steps: [
      { label: 'Activate Time Warp', check: 'time_warp_active' },
      { label: 'Build 5x combo', check: 'combo_5' },
      { label: 'Complete a speedrun', check: 'speedrun_done' },
    ],
  },
];

function detectLanguage(code) {
  if (/\b(fn\s|let\s+mut|impl\s|struct\s|pub\s+fn|->|::)/.test(code)) return 'Rust';
  if (/\b(def\s|from\s+\w+\s+import|class\s+\w+.*:|print\s*\(|self\.)/.test(code)) return 'Python';
  if (/\b(package\s+main|func\s+\w|fmt\.|:=)/.test(code)) return 'Go';
  if (/<[A-Z]\w*[\s>\/]|import.*from\s+['"]|export\s+(default\s+)?function/.test(code)) return 'TSX';
  if (/\b(function\s+\w|var\s+|let\s+|const\s+)/.test(code)) return 'JavaScript';
  return 'Plain Text';
}

const KW_SET = new Set(['import','from','export','default','function','const','let','var','return','if','else','for','while','class','extends','new','async','await','try','catch','throw','typeof','instanceof','in','of','def','self','print','fn','mut','pub','use','struct','impl','enum','match','mod','crate','super','where','trait','type','as','ref','loop','break','continue','move','yield','static','dyn','unsafe','extern','package','func','go','defer','chan','select','interface','range','switch','case']);

function tokenizeLine(text) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    const rest = text.slice(i);
    if (ch === '/' && text[i + 1] === '/') { tokens.push({ text: rest, c: '#5C6370' }); break; }
    if (ch === '#' && (i === 0 || /\s/.test(text[i - 1]))) {
      if (text[i + 1] === '[') { const end = text.indexOf(']', i); const s = end >= 0 ? text.slice(i, end + 1) : rest; tokens.push({ text: s, c: '#61AFEF' }); i += s.length; continue; }
      tokens.push({ text: rest, c: '#5C6370' }); break;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      let j = i + 1; while (j < text.length && text[j] !== ch) { if (text[j] === '\\') j++; j++; }
      const s = text.slice(i, Math.min(j + 1, text.length)); tokens.push({ text: s, c: '#98C379' }); i += s.length; continue;
    }
    const wm = rest.match(/^[a-zA-Z_]\w*/);
    if (wm) {
      const w = wm[0];
      if (KW_SET.has(w)) tokens.push({ text: w, c: '#C678DD' });
      else if (/^[A-Z]/.test(w)) tokens.push({ text: w, c: '#E5C07B' });
      else if (i + w.length < text.length && text[i + w.length] === '(') tokens.push({ text: w, c: '#61AFEF' });
      else tokens.push({ text: w, c: '#ABB2BF' });
      i += w.length; continue;
    }
    const nm = rest.match(/^\d+\.?\d*/);
    if (nm) { tokens.push({ text: nm[0], c: '#D19A66' }); i += nm[0].length; continue; }
    if (ch === '<' && /[A-Za-z/]/.test(text[i + 1] || '')) {
      const tm = rest.match(/^<\/?[a-zA-Z][a-zA-Z0-9.]*/);
      if (tm) { tokens.push({ text: tm[0], c: '#E06C75' }); i += tm[0].length; continue; }
    }
    tokens.push({ text: ch, c: '#ABB2BF' }); i++;
  }
  return tokens;
}

export default function ModernHome() {
  /**
   * General page state
   */
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0..100
  const scrollYRef = useRef(0);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [businessVisible, setBusinessVisible] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [secondLineText, setSecondLineText] = useState("");
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(null); // null = loading
  const [email, setEmail] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState(null);
  const [positionCountUp, setPositionCountUp] = useState(0);

  /* Deploy terminal animation */
  const [deployPhase, setDeployPhase] = useState(0); // 0=idle, 1=typing cmd, 2=logs1, 3=logs2, 4=logs3, 5=live, 6=confetti
  const [deployTriggered, setDeployTriggered] = useState(false);
  const [deployTypedChars, setDeployTypedChars] = useState(0);
  const deployRef = useRef(null);
  const deployCmd = 'vectant deploy --prod';

  /* Playground mode */
  const [playgroundMode, setPlaygroundMode] = useState(false);
  const [playgroundForceMode, setPlaygroundForceMode] = useState('none');
  const [playgroundGravityMode, setPlaygroundGravityMode] = useState('zero');
  const [playgroundOrbitMode, setPlaygroundOrbitMode] = useState(false);
  const [playgroundPaused, setPlaygroundPaused] = useState(false);
  const [playgroundSlowMo, setPlaygroundSlowMo] = useState(false);
  const [playgroundStats, setPlaygroundStats] = useState({ launches: 0, spawns: 0, collisions: 0, pinned: 0, orbiters: 0 });
  const [playgroundSpawns, setPlaygroundSpawns] = useState([]);
  const [playgroundBursts, setPlaygroundBursts] = useState([]);
  const [playgroundMastered, setPlaygroundMastered] = useState(false);
  const [playgroundScore, setPlaygroundScore] = useState(0);
  const [playgroundCombo, setPlaygroundCombo] = useState(0);
  const [playgroundCollectibles, setPlaygroundCollectibles] = useState(0);
  const [playgroundSfxOn] = useState(true);
  const [playgroundHumOn, setPlaygroundHumOn] = useState(false);
  const [playgroundHudMin, setPlaygroundHudMin] = useState(false);
  const [playgroundHudPosition, setPlaygroundHudPosition] = useState(null);
  const [playgroundHudDragging, setPlaygroundHudDragging] = useState(false);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef(null);
  const playgroundNodesRef = useRef({});
  const playgroundBodiesRef = useRef({});
  const playgroundContactCacheRef = useRef(new Map());
  const playgroundDragRef = useRef(null);
  const playgroundSuppressedClickRef = useRef({});
  const playgroundHudRef = useRef(null);
  const playgroundHudDragStateRef = useRef(null);
  const playgroundHudPositionRef = useRef(null);
  const playgroundRafRef = useRef(null);
  const playgroundSpawnIdRef = useRef(0);
  const playgroundBurstIdRef = useRef(0);
  const playgroundCollisionGateRef = useRef(0);
  const playgroundPointerRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, lastX: 0, lastY: 0, lastT: 0 });
  const playgroundAudioRef = useRef(null);
  const playPlaygroundSoundRef = useRef(null);
  const playgroundLastCollectRef = useRef(0);
  const playgroundComboResetRef = useRef(null);
  const playgroundForceTimeoutRef = useRef(null);

  /* Phase 2: Portal Pairs */
  const [portalPlacementMode, setPortalPlacementMode] = useState(false); // P key toggles
  const [portalPairs, setPortalPairs] = useState([]); // [{id, a:{x,y}, b:{x,y}}] max 2 pairs
  const portalPairsRef = useRef([]); // mirror for RAF
  const portalPendingRef = useRef(null); // first click position while placing
  const portalCooldownRef = useRef({}); // {bodyId: timestamp} 200ms re-entry cooldown
  const portalIdRef = useRef(0);

  /* Phase 2: Gravity Wells */
  const [gravityWells, setGravityWells] = useState([]); // [{id, x, y, strength}] max 3
  const gravityWellsRef = useRef([]); // mirror for RAF
  const [gravityWellPlacementMode, setGravityWellPlacementMode] = useState(false); // G key toggles
  const gravityWellIdRef = useRef(0);

  /* Phase 2: Arena Mutations */
  const [arenaMutation, setArenaMutation] = useState(null); // { type, name, startTime, duration } or null
  const arenaMutationRef = useRef(null); // mirror for RAF
  const arenaMutationTimerRef = useRef(null); // next mutation scheduled
  const arenaMutationCooldownRef = useRef(0); // timestamp of last mutation end

  /* Phase 3: Toy Fusion */
  const fusionOverlapRef = useRef({}); // { "idA|idB": startTime } tracking orbit overlap
  const fusionCountRef = useRef(0); // total fusions this session

  /* Phase 3: Achievement Chains */
  const [achievementProgress, setAchievementProgress] = useState({}); // { chainId: stepIndex }
  const achievementDataRef = useRef({ collisionsIn5s: [], cloneStormActive: false, pinnedCount: 0 });

  /* Phase 3: Prestige System */
  const [prestigeLevel, setPrestigeLevel] = useState(() => {
    if (typeof window === 'undefined') return 0;
    try { return parseInt(localStorage.getItem('synthi_prestige_level') || '0', 10); } catch { return 0; }
  });
  const [prestigeAvailable, setPrestigeAvailable] = useState(false);
  const creatorTier = useMemo(() => Math.min(4, prestigeLevel), [prestigeLevel]);

  /* Phase 4: Creator Studio */
  const [creatorStudioOpen, setCreatorStudioOpen] = useState(false);
  const [creatorPresetName, setCreatorPresetName] = useState('');
  const [creatorChallengeDraft, setCreatorChallengeDraft] = useState({ name: 'Deep Run', metric: 'score', target: 1200, timeLimit: 25 });
  const [creatorModifierPackName, setCreatorModifierPackName] = useState('');
  const [creatorModifierPackDraft, setCreatorModifierPackDraft] = useState(['score_surge', 'time_warp']);
  const [creatorLoadoutName, setCreatorLoadoutName] = useState('');
  const [creatorLoadoutDraft, setCreatorLoadoutDraft] = useState(['black_sun']);
  const [creatorChallenges, setCreatorChallenges] = useState(() => readStoredList(CREATOR_STORAGE_KEYS.challenges));
  const [creatorModifierPacks, setCreatorModifierPacks] = useState(() => readStoredList(CREATOR_STORAGE_KEYS.modifierPacks));
  const [creatorAnomalyLoadouts, setCreatorAnomalyLoadouts] = useState(() => readStoredList(CREATOR_STORAGE_KEYS.anomalyLoadouts));
  const [activeCreatorChallenge, setActiveCreatorChallenge] = useState(null);
  const [creatorChallengeResult, setCreatorChallengeResult] = useState(null);
  const [creatorChallengeTick, setCreatorChallengeTick] = useState(0);
  const creatorLoadoutQueueRef = useRef([]);

  /* Phase 4: Sandbox Presets */
  const [presetMenuOpen, setPresetMenuOpen] = useState(false);

  /* Phase 4: Curated Chaos */
  const [chaosEvent, setChaosEvent] = useState(null);
  const [chaosEventResult, setChaosEventResult] = useState(null);
  const [chaosEventTick, setChaosEventTick] = useState(0);
  const chaosEventRef = useRef(null);
  const chaosEventTimerRef = useRef(null);

  /* Boss rewards */
  const [bossRewardToast, setBossRewardToast] = useState(null);

  /* Crate / Modifier system */
  const [playgroundCrates, setPlaygroundCrates] = useState([]); // active crates on screen
  const [activeModifiers, setActiveModifiers] = useState([]); // max 2 active { ...modifier, expiresAt, startedAt }
  const crateSpawnTimerRef = useRef(null);
  const crateIdRef = useRef(0);
  const activeModifiersRef = useRef([]); // mirror for RAF access without re-renders
  const playgroundCratesRef = useRef([]); // mirror for RAF access

  /* Collection / Journal */
  const [journalOpen, setJournalOpen] = useState(false);
  const [journalSnapshot, setJournalSnapshot] = useState(null);
  const [collectionToast, setCollectionToast] = useState(null); // { item, rarity }
  const [mythicCinematic, setMythicCinematic] = useState(false);

  /* Tutorial & Help */
  const [helpPanelOpen, setHelpPanelOpen] = useState(false);
  const [utilityHintVisible, setUtilityHintVisible] = useState(false);
  const [pgBootLines, setPgBootLines] = useState([]); // playground boot sequence lines
  const [ghostHint, setGhostHint] = useState(null); // contextual floating hint
  const ghostHintShownRef = useRef({}); // track which hints have been shown
  const bootTimerRef = useRef(null);
  const ghostTimerRef = useRef(null);
  const utilityHintTimerRef = useRef(null);
  const utilityHintSeenRef = useRef(false);
  const [editorHelpOutput, setEditorHelpOutput] = useState(null); // man vectant output

  const utilityHintEligible = playgroundCollectibles > 0;
  const utilityHintActive = utilityHintVisible && !journalOpen && !helpPanelOpen;

  playgroundHudPositionRef.current = playgroundHudPosition;

  const handleCollectionUnlock = useCallback((item) => {
    const r = RARITY[item.rarity];
    toast.success(`${r.label} unlocked: ${item.name}`, { icon: item.icon });
    setCollectionToast({ item, rarity: item.rarity });
    setTimeout(() => setCollectionToast(null), 2500);
    // play rarity sound after a tick (audio context may need resuming)
    setTimeout(() => {
      const soundKey = item.rarity === 'common' ? 'unlock' : `unlock_${item.rarity}`;
      playPlaygroundSoundRef.current?.(soundKey);
    }, 50);
  }, []);

  const collection = usePlaygroundCollection(handleCollectionUnlock);

  /* ─── Wave 2 systems ─── */
  const weather = useWeatherSystem(playgroundMode, collection.onWeatherChange);
  const bosses = useBossSystem(playgroundMode, playgroundScore, playPlaygroundSoundRef.current);
  const advanceAchievementRef = useRef(null);
  const constellationCallback = useCallback((...args) => {
    collection.onConstellationFormed(...args);
    if (advanceAchievementRef.current) advanceAchievementRef.current('constellation_formed');
  }, [collection]);
  const constellations = useConstellationSystem(playgroundMode, playgroundBodiesRef, playgroundNodesRef, constellationCallback);
  const speedrun = useSpeedrunChallenge(playgroundMode, playPlaygroundSoundRef.current);
  const ambient = useAmbientDrone(playgroundMode && playgroundHumOn, playgroundSfxOn, weather.stage);
  const voidDim = useVoidDimension(playgroundMode, playPlaygroundSoundRef.current, prestigeLevel);
  const dailySeed = useDailySeedChallenge(playgroundMode);
  const ghostReplay = useGhostReplay(playgroundMode);

  const featuresRef = useRef(null);
  const businessRef = useRef(null);

  /* Interactive editor state */
  const [editorCode, setEditorCode] = useState('');
  const [isEditorActive, setIsEditorActive] = useState(false);
  const [ghostTypingDone, setGhostTypingDone] = useState(false);
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [buildLogIndex, setBuildLogIndex] = useState(0);
  const [rocketLaunched, setRocketLaunched] = useState(false);
  const [borderPulse, setBorderPulse] = useState(false);
  const [cloudCpu, setCloudCpu] = useState(0);
  const typingRef = useRef(null);
  const compileTimeoutRef = useRef(null);
  const editorRef = useRef(null);
  const aiTimeoutRef = useRef(null);
  const shootingStarRef = useRef(null);
  const hmrTimerRef = useRef(null);
  const [shootingStar, setShootingStar] = useState(null);
  const [hmrStep, setHmrStep] = useState(0);
  const [bugFixStep, setBugFixStep] = useState(0);
  const bugFixRef = useRef(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const mousePosRef = useRef({ x: 0.5, y: 0.5 }); // normalised 0..1

  /* Boot sequence */
  const [bootPhase, setBootPhase] = useState(0); // 0=booting, 1=progress, 2=done
  const [bootLines, setBootLines] = useState([]);
  const [bootProgress, setBootProgress] = useState(0);

  /* Parallax DOM refs (direct manipulation, no re-renders) */
  const parallaxPlanetRef = useRef(null);
  const parallaxStarsRef = useRef(null);
  const parallaxClustersRef = useRef(null);
  const parallaxAuroraRef = useRef(null);
  const parallaxNebulaRef = useRef(null);
  const overlayRef = useRef(null);

  /* Shortcut sheet */
  const [showShortcuts, setShowShortcuts] = useState(false);

  /* Language carousel */
  const [langIndex, setLangIndex] = useState(0);

  /* Sticky CTA */
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [stickyEmail, setStickyEmail] = useState('');

  /* Section visibility for scroll reveals */
  const [comparisonVisible, setComparisonVisible] = useState(false);
  const [roadmapVisible, setRoadmapVisible] = useState(false);
  const [personasVisible, setPersonasVisible] = useState(false);
  const comparisonRef = useRef(null);
  const roadmapRef = useRef(null);
  const personasRef = useRef(null);

  /* Stats counter */
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  /* Animated counter values */
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const STAT_TARGETS = useMemo(() => [
    { value: 200, prefix: '<', suffix: 'ms', label: 'Compile time', decimals: 0 },
    { value: 40, prefix: '', suffix: '+', label: 'Languages', decimals: 0 },
    { value: 0, prefix: '', suffix: '', label: 'Tracking scripts', decimals: 0 },
    { value: 99.9, prefix: '', suffix: '%', label: 'Uptime target', decimals: 1 },
  ], []);
  useEffect(() => {
    if (!statsVisible) return;
    const duration = 1600; // ms
    const fps = 60;
    const totalFrames = Math.round(duration / (1000 / fps));
    let frame = 0;
    const ease = (t) => 1 - Math.pow(1 - t, 3); // ease-out cubic
    const timer = setInterval(() => {
      frame++;
      const progress = ease(Math.min(frame / totalFrames, 1));
      setCounterValues(STAT_TARGETS.map(s => {
        const current = s.value * progress;
        return s.decimals > 0 ? parseFloat(current.toFixed(s.decimals)) : Math.round(current);
      }));
      if (frame >= totalFrames) clearInterval(timer);
    }, 1000 / fps);
    return () => clearInterval(timer);
  }, [statsVisible, STAT_TARGETS]);

  /* Before/after slider */
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  /* Ambient sound */
  const [ambientOn, setAmbientOn] = useState(false);
  const ambientRef = useRef(null);

  /* Section particle bursts - track which sections already burst */
  const [burstSections, setBurstSections] = useState(new Set());

  /* Konami code easter egg */
  const [konamiActive, setKonamiActive] = useState(false);
  const konamiBuffer = useRef([]);

  /* Tracking badge tooltip */
  const [badgeTooltip, setBadgeTooltip] = useState(false);

  /* Sasha easter egg */
  const [sashaEaster, setSashaEaster] = useState(false);

  /* Nav dots - section list */
  const SECTIONS = useMemo(() => [
    { id: 'hero', label: 'Home' },
    { id: 'business', label: 'Pricing' },
    { id: 'features', label: 'Features' },
    { id: 'comparison', label: 'Compare' },
    { id: 'roadmap', label: 'Migration' },
    { id: 'faq', label: 'FAQ' },
  ], []);
  const [activeSection, setActiveSection] = useState('hero');
  const heroRef = useRef(null);
  const faqRef = useRef(null);

  /* ---------- Derive language from editor content ---------- */
  const detectedLang = detectLanguage(editorCode);
  const langGlow = LANG_GLOWS[detectedLang] || LANG_GLOWS["Plain Text"];
  const langOutput = LANG_OUTPUTS[detectedLang] || LANG_OUTPUTS["Plain Text"];
  const aiSuggestion = AI_SUGGESTIONS[detectedLang] || AI_SUGGESTIONS["Plain Text"];
  const editorLines = editorCode.split('\n');

  /* Generate static star field (seeded PRNG for SSR consistency) */
  const { stars, driftParticles, auroraRibbons, starClusters } = React.useMemo(() => {
    let t = 42;
    const rand = () => { t = (t + 0x6D2B79F5) | 0; let v = Math.imul(t ^ (t >>> 15), 1 | t); v ^= v + Math.imul(v ^ (v >>> 7), 61 | v); return ((v ^ (v >>> 14)) >>> 0) / 4294967296; };
    const _stars = Array.from({ length: 80 }, (_, i) => ({
      x: rand() * 100, y: rand() * 100, size: rand() * 1.5 + 1, opacity: rand() * 0.12 + 0.08,
      twinkle: i % 5 === 0, // ~16 stars twinkle
      twinkleDelay: rand() * 6, twinkleDuration: rand() * 3 + 2,
    }));
    // Star clusters - 3 dense groupings of 15 stars each
    const clusterCenters = [{ cx: 15, cy: 25 }, { cx: 72, cy: 18 }, { cx: 55, cy: 70 }];
    const _clusters = clusterCenters.flatMap(({ cx, cy }) =>
      Array.from({ length: 8 }, () => ({
        x: cx + (rand() - 0.5) * 12, y: cy + (rand() - 0.5) * 10,
        size: rand() * 1.2 + 0.5, opacity: rand() * 0.15 + 0.06,
        twinkle: rand() > 0.6, twinkleDelay: rand() * 8, twinkleDuration: rand() * 4 + 2,
      }))
    );
    // Drifting particles - 25 tiny motes
    const _drift = Array.from({ length: 25 }, () => ({
      x: rand() * 100, y: rand() * 100, size: rand() * 1.5 + 0.5,
      opacity: rand() * 0.06 + 0.02, duration: rand() * 30 + 25, delay: rand() * 20,
      dx: (rand() - 0.5) * 30, dy: rand() * -20 - 10, // drift up-ish
    }));
    // Aurora ribbons - 3 ribbons
    const _aurora = Array.from({ length: 3 }, (_, i) => ({
      top: 15 + i * 25 + rand() * 10, // spread across viewport
      left: -10, width: 120, height: rand() * 80 + 60,
      hue: i === 0 ? '88, 164, 176' : i === 1 ? '50, 116, 100' : '100, 180, 160',
      duration: rand() * 8 + 12, delay: i * 3,
      opacity: rand() * 0.02 + 0.015,
    }));
    return { stars: _stars, driftParticles: _drift, auroraRibbons: _aurora, starClusters: _clusters };
  }, []);

  /* Ghost typing: types out INITIAL_CODE after boot finishes */
  useEffect(() => {
    if (!mounted || bootPhase !== 2) return;
    let i = 0;
    typingRef.current = setInterval(() => {
      i += 2;
      if (i >= INITIAL_CODE.length) {
        i = INITIAL_CODE.length;
        clearInterval(typingRef.current);
        typingRef.current = null;
        setGhostTypingDone(true);
        // Only auto-show AI suggestion on non-mobile screens
        if (window.innerWidth >= 768) {
          setTimeout(() => setShowAiSuggestion(true), 600);
        }
      }
      setEditorCode(INITIAL_CODE.slice(0, i));
    }, 20);
    return () => { if (typingRef.current) clearInterval(typingRef.current); };
  }, [mounted, bootPhase]);

  /* Shooting star - fires every 8-15s */
  useEffect(() => {
    if (!mounted) return;
    const fire = () => {
      const x = Math.random() * 60 + 10;
      const y = Math.random() * 50;
      setShootingStar({ x, y, id: Date.now() });
      setTimeout(() => setShootingStar(null), 1200);
    };
    const schedule = () => {
      shootingStarRef.current = setTimeout(() => { fire(); schedule(); }, Math.random() * 7000 + 8000);
    };
    schedule();
    return () => clearTimeout(shootingStarRef.current);
  }, [mounted]);

  /* HMR card animation cycle: 0=original, 1=editing, 2=preview flash */
  useEffect(() => {
    const DURATIONS = [2500, 1200, 2000];
    let current = 0;
    const advance = () => { current = (current + 1) % 3; setHmrStep(current); hmrTimerRef.current = setTimeout(advance, DURATIONS[current]); };
    hmrTimerRef.current = setTimeout(advance, DURATIONS[0]);
    return () => clearTimeout(hmrTimerRef.current);
  }, []);

  /* Bug fix card animation cycle: 0=normal, 1=strikethrough, 2=fix slides in, 3=badge */
  useEffect(() => {
    const DURATIONS = [2000, 800, 800, 2000];
    let step = 0;
    const advance = () => { step = (step + 1) % 4; setBugFixStep(step); bugFixRef.current = setTimeout(advance, DURATIONS[step]); };
    bugFixRef.current = setTimeout(advance, DURATIONS[0]);
    return () => clearTimeout(bugFixRef.current);
  }, []);

  /* Compile sequence */
  const handleRunClick = useCallback(() => {
    if (isCompiling) return;

    const command = editorCode.trim().toLowerCase();

    setEditorHelpOutput(null);
    setShowOutput(false);

    // Sasha easter egg
    if (command === 'sasha') {
      setSashaEaster(true);
      setTimeout(() => setSashaEaster(false), 5000);
      if (playgroundMode) collection.onSashaEgg();
      return;
    }

    // man vectant / help command
    if (playgroundMode && (command === 'help' || command === 'man vectant')) {
      setEditorHelpOutput([
        '$ man vectant',
        '',
        'VECTANT(1)        PLAYGROUND MANUAL        VECTANT(1)',
        '',
        'SYNOPSIS',
        '  Physics sandbox with ' + COLLECTIBLE_ITEMS.length + ' embedded anomalies.',
        '',
        'HIDDEN PROTOCOLS',
        '  "The void opens for those who push past 6000."',
        '  "Two chained orbs drift apart. Only you can reunite them."',
        '  "A duck hides where the price is right."',
        '  "Dates break at the millennium boundary."',
        '  "Chaos, three times invoked, deletes everything."',
        '  "Eight satellites form a constellation of creation."',
        '  "The stars remember who clicks them."',
        '  "End every statement with conviction."',
        '  "Authority is granted to those who sudo."',
        '',
        'KEYBOARD',
        '  Shift .... slow-mo    Space .... freeze',
        '  V ........ the void   T ........ speedrun',
        '  Ctrl+K ... cmd palette',
        '  ↑↑↓↓←→←→BA ......... [CLASSIFIED]',
        '',
        'SEE ALSO',
        '  sasha(1), collect(1), sudo(8)',
        '',
        '                  — end of line —',
      ]);
      setTimeout(() => setEditorHelpOutput(null), 12000);
      return;
    }

    // Golden Semicolon collectible
    if (playgroundMode && command === 'collect;') {
      collection.onEditorCollectSemicolon();
    }

    setRocketLaunched(true);
    setBorderPulse(true);
    setIsCompiling(true);
    setBuildLogIndex(0);
    setCloudCpu(0);

    // Animate build logs
    BUILD_LOGS.forEach((log, i) => {
      setTimeout(() => setBuildLogIndex(i + 1), log.delay + 200);
    });

    // Animate cloud CPU
    let cpu = 0;
    const cpuInterval = setInterval(() => {
      cpu += Math.random() * 30 + 10;
      if (cpu > 95) cpu = 97;
      setCloudCpu(Math.round(cpu));
    }, 300);

    // Finish compile
    compileTimeoutRef.current = setTimeout(() => {
      clearInterval(cpuInterval);
      setCloudCpu(100);
      setIsCompiling(false);
      setShowOutput(true);
      setBorderPulse(false);
      setRocketLaunched(false);
      setTimeout(() => setCloudCpu(0), 2000);
    }, 1800);
  }, [collection, editorCode, isCompiling, playgroundMode]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
      if (compileTimeoutRef.current) clearTimeout(compileTimeoutRef.current);
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
      if (shootingStarRef.current) clearTimeout(shootingStarRef.current);
      if (hmrTimerRef.current) clearTimeout(hmrTimerRef.current);
      if (bugFixRef.current) clearTimeout(bugFixRef.current);
      if (cometRef.current) clearTimeout(cometRef.current);
      if (bootTimerRef.current) clearTimeout(bootTimerRef.current);
      if (ghostTimerRef.current) clearTimeout(ghostTimerRef.current);
      if (utilityHintTimerRef.current) clearTimeout(utilityHintTimerRef.current);
    };
  }, []);

  /* Ctrl+K Easter egg - command palette */
  const [cmdPaletteInput, setCmdPaletteInput] = useState('');
  const cmdPaletteTimerRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
        setCmdPaletteInput('');
        if (cmdPaletteTimerRef.current) clearTimeout(cmdPaletteTimerRef.current);
        // Keep open longer in playground mode for typing
        cmdPaletteTimerRef.current = setTimeout(() => setShowCommandPalette(false), playgroundMode ? 8000 : 2800);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [playgroundMode]);

  const handleCmdPaletteSubmit = useCallback((value) => {
    const v = value.trim().toLowerCase();
    if (playgroundMode) {
      if (v === 'sudo collect') collection.onRootShell();
      if (v === 'vectant') collection.onCommandPaletteSynthi();
      if (v === 'help' || v === 'man vectant' || v === 'man') setHelpPanelOpen(true);
    }
    setShowCommandPalette(false);
    if (cmdPaletteTimerRef.current) clearTimeout(cmdPaletteTimerRef.current);
  }, [collection, playgroundMode]);

  /* Mouse tracking for nebula parallax (ref-based, no re-renders) */
  useEffect(() => {
    if (!mounted) return;
    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;
      mousePosRef.current = { x: nx, y: ny };
      if (parallaxNebulaRef.current) {
        const y = scrollYRef.current;
        parallaxNebulaRef.current.style.transform = `translateY(${y * 0.08}px) translate(${(nx - 0.5) * -20}px, ${(ny - 0.5) * -15}px)`;
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mounted]);

  /* Proximity glitch for hidden secret elements */
  useEffect(() => {
    if (!mounted || !playgroundMode) return;
    let raf = null;
    const PROXIMITY_RADIUS = 150;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const els = document.querySelectorAll('[data-secret-proximity]');
        const cx = e.clientX;
        const cy = e.clientY;
        els.forEach(el => {
          const rect = el.getBoundingClientRect();
          const ex = rect.left + rect.width / 2;
          const ey = rect.top + rect.height / 2;
          const dist = Math.sqrt((cx - ex) ** 2 + (cy - ey) ** 2);
          if (dist < PROXIMITY_RADIUS) {
            const intensity = 1 - dist / PROXIMITY_RADIUS;
            el.style.animation = `proximityGlitch ${0.8 + (1 - intensity) * 1.5}s steps(1) infinite`;
            el.style.opacity = String(parseFloat(el.dataset.baseOpacity || '0.15') + intensity * 0.45);
          } else {
            el.style.animation = el.dataset.defaultAnimation || '';
            el.style.opacity = el.dataset.baseOpacity || '0.15';
          }
        });
        raf = null;
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mounted, playgroundMode]);

  /* Comet - fires every 20-35s (separate from shooting stars) */
  const [comet, setComet] = useState(null);
  const cometRef = useRef(null);
  useEffect(() => {
    if (!mounted) return;
    const fire = () => {
      const x = Math.random() * 40 + 5;
      const y = Math.random() * 30;
      setComet({ x, y, id: Date.now() });
      setTimeout(() => setComet(null), 3000);
    };
    const schedule = () => {
      cometRef.current = setTimeout(() => { fire(); schedule(); }, Math.random() * 15000 + 20000);
    };
    // first comet after 10s
    cometRef.current = setTimeout(() => { fire(); schedule(); }, 10000);
    return () => clearTimeout(cometRef.current);
  }, [mounted]);

  /* Boot sequence - 2.5s terminal animation before revealing page */
  const BOOT_LINES = useMemo(() => [
    { text: '$ vectant init', delay: 0 },
    { text: '  → Loading cloud runtime...', delay: 300 },
    { text: '  → Connecting to Vectant Edge Network...', delay: 700 },
    { text: '  → AI modules ready', delay: 1100 },
    { text: '  → Workspace synced ✓', delay: 1500 },
    { text: '  → All systems operational', delay: 1900 },
  ], []);
  useEffect(() => {
    if (bootPhase !== 0) return;
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => setBootLines(prev => [...prev, line.text]), line.delay);
    });
    // progress bar
    const pInterval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) { clearInterval(pInterval); return 100; }
        return Math.min(prev + Math.random() * 15 + 5, 100);
      });
    }, 150);
    // transition to done
    setTimeout(() => { clearInterval(pInterval); setBootProgress(100); setBootPhase(1); }, 2200);
    setTimeout(() => setBootPhase(2), 2800);
    return () => clearInterval(pInterval);
  }, [bootPhase, BOOT_LINES]);

  /* "?" shortcut sheet */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        setShowShortcuts(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowShortcuts(false);
        deactivatePlayground();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* Track void auto-exit */
  const wasInVoidRef = useRef(false);
  useEffect(() => {
    if (!wasInVoidRef.current && voidDim.inVoid) {
      collection.onLifetimeVoidTrip();
    }
    if (wasInVoidRef.current && !voidDim.inVoid) {
      collection.onVoidExit(voidDim.voidScore);
    }
    wasInVoidRef.current = voidDim.inVoid;
  }, [voidDim.inVoid, voidDim.voidScore, collection]);

  /* Konami code: ↑↑↓↓←→←→BA */
  const playgroundComboRef = useRef(0);
  playgroundComboRef.current = playgroundCombo;
  const playgroundScoreRef = useRef(0);
  playgroundScoreRef.current = playgroundScore;
  const playgroundCollectiblesRef = useRef(0);
  playgroundCollectiblesRef.current = playgroundCollectibles;
  const playgroundStatsRef = useRef(playgroundStats);
  playgroundStatsRef.current = playgroundStats;
  useEffect(() => {
    const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    const handler = (e) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      const buf = konamiBuffer.current;
      buf.push(e.key);
      if (buf.length > KONAMI.length) buf.shift();
      if (buf.length === KONAMI.length && buf.every((k, i) => k === KONAMI[i])) {
        buf.length = 0;
        setKonamiActive(true);
        setTimeout(() => setKonamiActive(false), 3000);
        if (playgroundMode) collection.onKonami(playgroundComboRef.current);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [collection, playgroundMode]);

  /* Deploy terminal animation - triggers when scrolled into view */
  useEffect(() => {
    if (!mounted || deployTriggered) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setDeployTriggered(true);
        obs.disconnect();

        // Phase 1: start typing after short pause
        let charIndex = 0;
        const typeTimer = setTimeout(() => {
          setDeployPhase(1);
          const typeInterval = setInterval(() => {
            charIndex++;
            setDeployTypedChars(charIndex);
            if (charIndex >= deployCmd.length) {
              clearInterval(typeInterval);
              // After typing done, stagger the log lines
              setTimeout(() => setDeployPhase(2), 500);  // "Enumerating objects..."
              setTimeout(() => setDeployPhase(3), 1200);  // "Compressing objects..."
              setTimeout(() => setDeployPhase(4), 1900);  // "remote: Building..."
              setTimeout(() => setDeployPhase(5), 3000);  // "remote: Deploying..." + LIVE
              setTimeout(() => setDeployPhase(6), 3600);  // confetti
            }
          }, 55 + Math.random() * 30);
        }, 400);

        return () => clearTimeout(typeTimer);
      }
    }, { threshold: 0.4 });
    if (deployRef.current) obs.observe(deployRef.current);
    return () => obs.disconnect();
  }, [mounted, deployTriggered]);

  /* Waitlist position count-up animation */
  useEffect(() => {
    if (waitlistPosition === null) return;
    const duration = 1200;
    const fps = 60;
    const totalFrames = Math.round(duration / (1000 / fps));
    let frame = 0;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const timer = setInterval(() => {
      frame++;
      const progress = ease(Math.min(frame / totalFrames, 1));
      setPositionCountUp(Math.round(waitlistPosition * progress));
      if (frame >= totalFrames) clearInterval(timer);
    }, 1000 / fps);
    return () => clearInterval(timer);
  }, [waitlistPosition]);

  const isPlaygroundItemId = useCallback((id) => {
    if (!id) return false;
    return id.startsWith('spawn-')
      || /^stats-card-\d+$/.test(id)
      || /^roadmap-\d+$/.test(id)
      || /^faq-\d+$/.test(id)
      || [
        'pricing-core',
        'pricing-pro',
        'feature-ai',
        'feature-waitlist',
        'feature-bugs',
        'feature-cloud',
        'feature-collab',
        'feature-freedom',
        'feature-hmr',
        'language-showcase',
        'before-after',
        'comparison-table',
        'deploy-terminal',
        'persona-solo',
        'persona-startup',
        'persona-enterprise',
      ].includes(id);
  }, []);

  const applyPlaygroundBodyMaterial = useCallback((id, body) => {
    if (!body) return body;
    const isSpawn = id?.startsWith('spawn-');
    const isCrate = id?.startsWith('crate-');
    const defaultWidth = isSpawn ? 132 : isCrate ? 100 : 220;
    const defaultHeight = isSpawn ? 78 : isCrate ? 92 : 140;
    body.width = body.width || defaultWidth;
    body.height = body.height || defaultHeight;
    body.materialType = body.materialType || (isSpawn ? 'toy' : isCrate ? 'crate' : 'card');
    body.density = body.density ?? (isSpawn ? 0.62 : isCrate ? 2.4 : 1.28);
    body.restitution = body.restitution ?? (isSpawn ? 0.62 : isCrate ? 0.1 : 0.24);
    body.surfaceFriction = body.surfaceFriction ?? (isSpawn ? 0.18 : isCrate ? 0.82 : 0.46);
    body.linearDamping = body.linearDamping ?? (isSpawn ? 0.996 : isCrate ? 0.988 : 0.993);
    body.angularDamping = body.angularDamping ?? (isSpawn ? 0.992 : isCrate ? 0.976 : 0.985);
    body.maxSpeed = body.maxSpeed ?? (isSpawn ? 46 : isCrate ? 18 : 30);
    body.throwBoost = body.throwBoost ?? (isSpawn ? 1.28 : isCrate ? 0.72 : 1.06);
    body.impactBoost = body.impactBoost ?? (isSpawn ? 1.22 : isCrate ? 0.84 : 1.02);
    body.impactSpinBoost = body.impactSpinBoost ?? (isSpawn ? 1.35 : isCrate ? 0.55 : 0.94);
    body.impactBurstScale = body.impactBurstScale ?? (isSpawn ? 1.2 : isCrate ? 1.45 : 1.05);
    body.fixed = body.fixed ?? (isSpawn || isCrate);
    body.baseX = body.baseX ?? 0;
    body.baseY = body.baseY ?? 0;
    body.sleepFrames = body.sleepFrames ?? 0;
    body.sleeping = body.sleeping ?? false;
    const area = Math.max(body.width * body.height, 1);
    const computedMass = (area / 20000) * body.density;
    body.mass = isSpawn
      ? clampNumber(computedMass, 0.42, 1.12)
      : isCrate
        ? clampNumber(computedMass, 3.8, 7.2)
        : clampNumber(computedMass, 1.8, 4.4);
    body.invMass = body.mass > 0 ? 1 / body.mass : 0;
    body.inertia = Math.max((body.mass * ((body.width * body.width) + (body.height * body.height))) / 120000, 0.02);
    body.invInertia = body.inertia > 0 ? 1 / body.inertia : 0;
    return body;
  }, []);

  const createPlaygroundBody = useCallback((id, overrides = {}) => {
    const body = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      angle: 0,
      spin: 0,
      pinned: false,
      orbit: false,
      orbitAngle: Math.random() * Math.PI * 2,
      orbitRadius: 90 + Math.random() * 110,
      escapeArmed: false,
      ...overrides,
    };
    return applyPlaygroundBodyMaterial(id, body);
  }, [applyPlaygroundBodyMaterial]);

  const syncPlaygroundBodyNodeMetrics = useCallback((id, node, body = playgroundBodiesRef.current[id]) => {
    if (!body || !node || typeof window === 'undefined') return body;
    const rect = node.getBoundingClientRect();
    body.width = node.offsetWidth || rect.width || body.width || 1;
    body.height = node.offsetHeight || rect.height || body.height || 1;
    if (id.startsWith('spawn-')) {
      body.fixed = true;
      body.baseX = 0;
      body.baseY = 0;
    } else if (id.startsWith('crate-')) {
      body.fixed = true;
      body.baseX = rect.left - body.x;
      body.baseY = rect.top - body.y;
    } else {
      body.fixed = false;
      body.baseX = rect.left + window.scrollX - body.x;
      body.baseY = rect.top + window.scrollY - body.y;
    }
    body.sleeping = false;
    body.sleepFrames = 0;
    return applyPlaygroundBodyMaterial(id, body);
  }, [applyPlaygroundBodyMaterial]);

  const getPlaygroundBodyViewportRect = useCallback((body) => {
    const scrollX = typeof window === 'undefined' ? 0 : window.scrollX;
    const scrollY = typeof window === 'undefined' ? 0 : window.scrollY;
    const baseLeft = body.fixed ? body.baseX : body.baseX - scrollX;
    const baseTop = body.fixed ? body.baseY : body.baseY - scrollY;
    const left = baseLeft + body.x;
    const top = baseTop + body.y;
    return {
      left,
      top,
      width: body.width,
      height: body.height,
      centerX: left + body.width / 2,
      centerY: top + body.height / 2,
    };
  }, []);

  const getPlaygroundBodyViewportPoint = useCallback((body, localX = 0, localY = 0) => {
    const rect = getPlaygroundBodyViewportRect(body);
    const rotated = rotateVector(localX, localY, body.angle);
    return {
      x: rect.centerX + rotated.x,
      y: rect.centerY + rotated.y,
    };
  }, [getPlaygroundBodyViewportRect]);

  const registerPlaygroundNode = useCallback((id, node) => {
    if (!id) return;
    if (!node) {
      delete playgroundNodesRef.current[id];
      return;
    }
    playgroundNodesRef.current[id] = node;
    node.dataset.playgroundItem = id;
    if (playgroundMode) {
      // Physics-driven items need transform updates to apply immediately.
      node.style.transition = 'opacity 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease, background-color 0.2s ease, color 0.2s ease';
    } else {
      node.style.transition = '';
    }
    if (!playgroundBodiesRef.current[id]) {
      playgroundBodiesRef.current[id] = createPlaygroundBody(id);
    }
    syncPlaygroundBodyNodeMetrics(id, node, playgroundBodiesRef.current[id]);
  }, [createPlaygroundBody, playgroundMode, syncPlaygroundBodyNodeMetrics]);

  const syncPlaygroundMeta = useCallback(() => {
    const bodies = Object.entries(playgroundBodiesRef.current).filter(([id]) => isPlaygroundItemId(id));
    const orbiters = bodies.filter(([, body]) => body?.orbit).length;
    setPlaygroundStats(prev => ({
      ...prev,
      pinned: bodies.filter(([, body]) => body?.pinned).length,
      orbiters,
    }));
    collection.onOrbitChange(orbiters);
    speedrun.updateProgress('orbiters', orbiters);
  }, [collection, isPlaygroundItemId, speedrun]);

  const resetPlaygroundLayout = useCallback(({ clearSpawns = false } = {}) => {
    playgroundDragRef.current = null;
    playgroundSuppressedClickRef.current = {};
    playgroundContactCacheRef.current.clear();
    Object.entries(playgroundBodiesRef.current).forEach(([id, body]) => {
      if (!body) return;
      if (clearSpawns && id.startsWith('spawn-')) {
        delete playgroundBodiesRef.current[id];
        return;
      }
      body.x = 0;
      body.y = 0;
      body.vx = 0;
      body.vy = 0;
      body.angle = 0;
      body.spin = 0;
      body.pinned = false;
      body.orbit = false;
      body.escapeArmed = false;
      body.sleeping = false;
      body.sleepFrames = 0;
    });
    Object.values(playgroundNodesRef.current).forEach((node) => {
      if (!node) return;
      node.style.transform = '';
      node.style.transition = '';
      node.style.zIndex = '';
      node.style.boxShadow = '';
      node.style.filter = '';
      node.style.cursor = '';
      node.style.touchAction = '';
    });
    if (clearSpawns) {
      setPlaygroundSpawns([]);
      setPlaygroundBursts([]);
    }
    setPlaygroundStats(prev => ({ ...prev, pinned: 0, orbiters: 0 }));
  }, []);

  const deactivatePlayground = useCallback(() => {
    resetPlaygroundLayout({ clearSpawns: true });
    playgroundHudDragStateRef.current = null;
    setPlaygroundHudDragging(false);
    setPlaygroundMode(false);
    setPlaygroundForceMode('none');
    setPlaygroundGravityMode('zero');
    setPlaygroundOrbitMode(false);
    setPlaygroundPaused(false);
    setPlaygroundSlowMo(false);
    setPlaygroundMastered(false);
    setPlaygroundStats({ launches: 0, spawns: 0, collisions: 0, pinned: 0, orbiters: 0 });
    setPlaygroundScore(0);
    setPlaygroundCombo(0);
    setPlaygroundCollectibles(0);
    playgroundPointerRef.current = { x: 0, y: 0, vx: 0, vy: 0, lastX: 0, lastY: 0, lastT: 0 };
    playgroundSpawnIdRef.current = 0;
    playgroundBurstIdRef.current = 0;
    playgroundCollisionGateRef.current = 0;
    playgroundContactCacheRef.current.clear();
    playgroundLastCollectRef.current = 0;
    if (playgroundComboResetRef.current) clearTimeout(playgroundComboResetRef.current);
    if (playgroundForceTimeoutRef.current) clearTimeout(playgroundForceTimeoutRef.current);
    // Clear crates/modifiers
    setPlaygroundCrates([]);
    setActiveModifiers([]);
    activeModifiersRef.current = [];
    if (crateSpawnTimerRef.current) clearTimeout(crateSpawnTimerRef.current);
    // Phase 2: Clear portals, gravity wells, arena mutations
    setPortalPairs([]);
    portalPairsRef.current = [];
    portalPendingRef.current = null;
    portalCooldownRef.current = {};
    setPortalPlacementMode(false);
    setGravityWells([]);
    gravityWellsRef.current = [];
    setGravityWellPlacementMode(false);
    arenaMutationRef.current = null;
    setArenaMutation(null);
    if (arenaMutationTimerRef.current) clearTimeout(arenaMutationTimerRef.current);
  }, [resetPlaygroundLayout]);

  const playPlaygroundSound = useCallback((kind = 'impact') => {
    if (!playgroundSfxOn || typeof window === 'undefined') return;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    try {
      if (!playgroundAudioRef.current) playgroundAudioRef.current = new AudioCtor();
      const ctx = playgroundAudioRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const preset = {
        impact: { start: 240, end: 120, duration: 0.05, type: 'triangle', volume: 0.022 },
        spawn: { start: 520, end: 760, duration: 0.09, type: 'sine', volume: 0.018 },
        collect: { start: 620, end: 980, duration: 0.12, type: 'triangle', volume: 0.028 },
        explode: { start: 180, end: 50, duration: 0.18, type: 'sawtooth', volume: 0.025 },
        unlock: { start: 440, end: 880, duration: 0.16, type: 'triangle', volume: 0.03 },
        unlock_rare: { start: 520, end: 1040, duration: 0.2, type: 'sine', volume: 0.035 },
        unlock_epic: { start: 660, end: 1320, duration: 0.25, type: 'triangle', volume: 0.04 },
        unlock_legendary: { start: 440, end: 1760, duration: 0.35, type: 'sine', volume: 0.045 },
        unlock_mythic: { start: 220, end: 1760, duration: 0.5, type: 'sine', volume: 0.05 },
        unlock_transcendent: { start: 110, end: 2200, duration: 0.7, type: 'sine', volume: 0.055 },
        unlock_secret: { start: 330, end: 660, duration: 0.4, type: 'triangle', volume: 0.04 },
        crate_open: { start: 300, end: 900, duration: 0.2, type: 'sawtooth', volume: 0.035 },
        crate_spawn: { start: 150, end: 300, duration: 0.12, type: 'triangle', volume: 0.02 },
      }[kind] || { start: 260, end: 180, duration: 0.05, type: 'triangle', volume: 0.02 };
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = preset.type;
      oscillator.frequency.setValueAtTime(preset.start, now);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(preset.end, 40), now + preset.duration);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(preset.volume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + preset.duration);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(now);
      oscillator.stop(now + preset.duration + 0.02);
    } catch {
      // Ignore audio failures in browsers that block autoplay contexts.
    }
  }, [playgroundSfxOn]);
  playPlaygroundSoundRef.current = playPlaygroundSound;

  const getPlaygroundHudBounds = useCallback(() => {
    const rect = playgroundHudRef.current?.getBoundingClientRect();
    return {
      width: rect?.width ?? (playgroundHudMin ? 180 : 320),
      height: rect?.height ?? 120,
    };
  }, [playgroundHudMin]);

  const clampPlaygroundHudPosition = useCallback((position, bounds = getPlaygroundHudBounds()) => {
    if (!position || typeof window === 'undefined') return position;
    const maxX = Math.max(PLAYGROUND_HUD_MARGIN, window.innerWidth - bounds.width - PLAYGROUND_HUD_MARGIN);
    const maxY = Math.max(PLAYGROUND_HUD_TOP_CLEARANCE, window.innerHeight - bounds.height - PLAYGROUND_HUD_MARGIN);
    return {
      x: Math.min(Math.max(position.x, PLAYGROUND_HUD_MARGIN), maxX),
      y: Math.min(Math.max(position.y, PLAYGROUND_HUD_TOP_CLEARANCE), maxY),
    };
  }, [getPlaygroundHudBounds]);

  const getDefaultPlaygroundHudPosition = useCallback((bounds = getPlaygroundHudBounds()) => {
    if (typeof window === 'undefined') {
      return { x: PLAYGROUND_HUD_MARGIN, y: PLAYGROUND_HUD_TOP_CLEARANCE };
    }
    return clampPlaygroundHudPosition({
      x: window.innerWidth - bounds.width - PLAYGROUND_HUD_MARGIN,
      y: PLAYGROUND_HUD_TOP_CLEARANCE,
    }, bounds);
  }, [clampPlaygroundHudPosition, getPlaygroundHudBounds]);

  const startPlaygroundHudDrag = useCallback((event) => {
    if (!playgroundMode || !playgroundHudPositionRef.current) return;
    const point = event.touches ? event.touches[0] : event;
    if (!point) return;
    const bounds = getPlaygroundHudBounds();
    playgroundHudDragStateRef.current = {
      startX: point.clientX,
      startY: point.clientY,
      originX: playgroundHudPositionRef.current.x,
      originY: playgroundHudPositionRef.current.y,
      width: bounds.width,
      height: bounds.height,
    };
    setPlaygroundHudDragging(true);
    if (event.cancelable) event.preventDefault();
    event.stopPropagation();
  }, [getPlaygroundHudBounds, playgroundMode]);

  useEffect(() => {
    if (!mounted || !playgroundMode) return;
    const frame = window.requestAnimationFrame(() => {
      let nextPosition = playgroundHudPositionRef.current;
      if (!nextPosition) {
        try {
          const saved = window.localStorage.getItem(PLAYGROUND_HUD_STORAGE_KEY);
          nextPosition = saved ? JSON.parse(saved) : null;
        } catch {
          nextPosition = null;
        }
      }
      nextPosition = nextPosition
        ? clampPlaygroundHudPosition(nextPosition)
        : getDefaultPlaygroundHudPosition();
      setPlaygroundHudPosition((prev) => (
        prev && prev.x === nextPosition.x && prev.y === nextPosition.y ? prev : nextPosition
      ));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [clampPlaygroundHudPosition, getDefaultPlaygroundHudPosition, mounted, playgroundHudMin, playgroundMode]);

  useEffect(() => {
    if (!playgroundMode) return;
    const handleResize = () => {
      const current = playgroundHudPositionRef.current;
      if (!current) return;
      setPlaygroundHudPosition(clampPlaygroundHudPosition(current));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampPlaygroundHudPosition, playgroundMode]);

  useEffect(() => {
    if (!mounted || !playgroundMode || !playgroundHudPosition || playgroundHudDragging) return;
    try {
      window.localStorage.setItem(PLAYGROUND_HUD_STORAGE_KEY, JSON.stringify(playgroundHudPosition));
    } catch {
      // Ignore localStorage persistence failures.
    }
  }, [mounted, playgroundHudDragging, playgroundHudPosition, playgroundMode]);

  useEffect(() => {
    if (!playgroundHudDragging) return;
    const handleMove = (event) => {
      const drag = playgroundHudDragStateRef.current;
      if (!drag) return;
      const point = event.touches ? event.touches[0] : event;
      if (!point) return;
      const nextPosition = clampPlaygroundHudPosition({
        x: drag.originX + (point.clientX - drag.startX),
        y: drag.originY + (point.clientY - drag.startY),
      }, { width: drag.width, height: drag.height });
      setPlaygroundHudPosition((prev) => (
        prev && prev.x === nextPosition.x && prev.y === nextPosition.y ? prev : nextPosition
      ));
      if (event.cancelable) event.preventDefault();
    };
    const stopDrag = () => {
      playgroundHudDragStateRef.current = null;
      setPlaygroundHudDragging(false);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', stopDrag);
    window.addEventListener('touchcancel', stopDrag);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', stopDrag);
      window.removeEventListener('touchcancel', stopDrag);
    };
  }, [clampPlaygroundHudPosition, playgroundHudDragging]);

  const spawnImpactBurst = useCallback((x, y, scale = 1) => {
    const id = ++playgroundBurstIdRef.current;
    setPlaygroundBursts(prev => [...prev, { id, x, y, scale }]);
    window.setTimeout(() => {
      setPlaygroundBursts(prev => prev.filter((burst) => burst.id !== id));
    }, 420);
  }, []);

  /* ─── Phase 3: Achievement chain advancement ─── */
  const advanceAchievement = useCallback((checkId) => {
    setAchievementProgress(prev => {
      const next = { ...prev };
      let changed = false;
      for (const chain of ACHIEVEMENT_CHAINS) {
        const currentStep = next[chain.id] || 0;
        if (currentStep >= chain.steps.length) continue; // already complete
        if (chain.steps[currentStep].check === checkId) {
          next[chain.id] = currentStep + 1;
          changed = true;
          if (currentStep + 1 >= chain.steps.length) {
            // Chain complete!
            toast.success(`Achievement: ${chain.name} complete!`, { icon: '🏆' });
          }
        }
      }
      return changed ? next : prev;
    });
  }, []);
  advanceAchievementRef.current = advanceAchievement;

  /* ─── Phase 3: Prestige System ─── */
  const PRESTIGE_THRESHOLD = 34; // items needed to prestige
  const prestigeBuffs = useMemo(() => ({
    scoreMultiplier: 1 + prestigeLevel * 0.15,  // P1=+15%, P2=+30%, etc.
    crateSpeedMul: Math.max(0.4, 1 - prestigeLevel * 0.1), // faster crates
    modifierDurationMul: 1 + prestigeLevel * 0.12, // longer modifiers
    startWithModifier: prestigeLevel >= 4, // P4+: start with random modifier
    bonusScorePerLevel: Math.max(0, (prestigeLevel - 4) * 0.05), // P5+: +5% stacking
  }), [prestigeLevel]);
  const creatorPermissions = useMemo(() => ({
    customPresets: creatorTier >= 1,
    customChallenges: creatorTier >= 2,
    modifierPacks: creatorTier >= 3,
    anomalyLoadouts: creatorTier >= 4,
    anomalySlots: creatorTier >= 4 ? (voidDim.relicInventory?.anomaly_key ? 4 : 3) : 0,
  }), [creatorTier, voidDim.relicInventory]);

  // Check if prestige is available
  useEffect(() => {
    if (!playgroundMode) return;
    setPrestigeAvailable(collection.count() >= PRESTIGE_THRESHOLD);
  }, [playgroundMode, collection]);

  // Phase 4: Load sandbox from URL hash on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (!hash.includes('sandbox=')) return;
    try {
      const encoded = hash.split('sandbox=')[1];
      const json = atob(encoded);
      const state = JSON.parse(json);
      if (state.v === 1) {
        // Will apply when playground activates
        window.__synthiSandboxImport = state;
        toast.info('Sandbox preset detected in URL. Activate playground to load it.', { icon: '🎛️' });
      }
    } catch {}
  }, []);

  const performPrestige = useCallback(() => {
    if (collection.count() < PRESTIGE_THRESHOLD) return;
    const newLevel = prestigeLevel + 1;
    setPrestigeLevel(newLevel);
    try { localStorage.setItem('synthi_prestige_level', String(newLevel)); } catch {}
    collection.onPrestige();
    collection.resetCollection();
    setAchievementProgress({});
    achievementDataRef.current = { collisionsIn5s: [], wellAttracted: new Set() };
    setPrestigeAvailable(false);
    toast.success(`Prestige ${newLevel}! Collection reset. Permanent buffs active.`, { icon: '⭐' });
    advanceAchievement('prestige_done');
  }, [advanceAchievement, collection, prestigeLevel]);

  /* ─── Phase 4: Sandbox Presets & Share ─── */
  const SANDBOX_PRESETS = useMemo(() => [
    { name: 'Chaos Arena', gravity: 'zero', force: 'repel', portals: 2, wells: 2, desc: 'Zero-G repel with portals & wells' },
    { name: 'Orbital Lab', gravity: 'center', force: 'none', portals: 0, wells: 1, desc: 'Center gravity with a single well' },
    { name: 'Pinball', gravity: 'down', force: 'attract', portals: 1, wells: 3, desc: 'Downward gravity, max wells' },
    { name: 'Void Storm', gravity: 'zero', force: 'attract', portals: 2, wells: 0, desc: 'Zero-G attract + portal maze' },
  ], []);

  const serializePlaygroundState = useCallback(() => {
    const bodies = playgroundBodiesRef.current;
    const spawns = [];
    for (const [id, body] of Object.entries(bodies)) {
      if (!id.startsWith('spawn-')) continue;
      spawns.push({ x: Math.round(body.x), y: Math.round(body.y), a: +(body.angle || 0).toFixed(2), p: body.pinned ? 1 : 0, o: body.orbit ? 1 : 0 });
    }
    return {
      v: 1,
      g: playgroundGravityMode,
      f: playgroundForceMode,
      s: spawns,
      pp: portalPairs.map(p => ({ a: { x: Math.round(p.a.x), y: Math.round(p.a.y) }, b: { x: Math.round(p.b.x), y: Math.round(p.b.y) } })),
      gw: gravityWells.map(w => ({ x: Math.round(w.x), y: Math.round(w.y) })),
    };
  }, [playgroundForceMode, playgroundGravityMode, portalPairs, gravityWells]);

  const sharePlaygroundState = useCallback(() => {
    const state = serializePlaygroundState();
    try {
      const json = JSON.stringify(state);
      const encoded = btoa(json);
      const url = `${window.location.origin}${window.location.pathname}#sandbox=${encoded}`;
      navigator.clipboard.writeText(url).then(() => {
        toast.success('Sandbox link copied to clipboard!', { icon: '📋' });
      }).catch(() => {
        toast.info('Could not copy — check console for link.');
      });
    } catch {}
  }, [serializePlaygroundState]);

  const savePresetToLocal = useCallback((nameOverride = '') => {
    if (!creatorPermissions.customPresets) {
      toast.info('Prestige 1 unlocks custom presets.', { icon: '⭐' });
      return null;
    }

    const state = serializePlaygroundState();
    try {
      const presets = readStoredList(CREATOR_STORAGE_KEYS.presets);
      const name = (nameOverride || creatorPresetName || `Custom ${presets.length + 1}`).trim() || `Custom ${presets.length + 1}`;
      const next = [...presets, { name, state, savedAt: Date.now() }];
      writeStoredList(CREATOR_STORAGE_KEYS.presets, next);
      setCreatorPresetName('');
      toast.success(`Preset "${name}" saved!`, { icon: '💾' });
      return name;
    } catch {
      toast.error('Could not save preset.');
      return null;
    }
  }, [creatorPermissions.customPresets, creatorPresetName, serializePlaygroundState]);

  const loadPreset = useCallback((preset) => {
    setPlaygroundGravityMode(preset.gravity || 'zero');
    setPlaygroundForceMode(preset.force || 'none');
    // Clear existing portals and wells
    setPortalPairs([]);
    portalPairsRef.current = [];
    setGravityWells([]);
    gravityWellsRef.current = [];
    // Auto-place portals
    if (preset.portals > 0) {
      const W = window.innerWidth, H = window.innerHeight;
      const newPairs = [];
      for (let i = 0; i < Math.min(preset.portals, 2); i++) {
        const pair = { id: ++portalIdRef.current, a: { x: 100 + i * 200, y: H * 0.3 }, b: { x: W - 100 - i * 200, y: H * 0.7 } };
        newPairs.push(pair);
      }
      setPortalPairs(newPairs);
      portalPairsRef.current = newPairs;
    }
    // Auto-place wells
    if (preset.wells > 0) {
      const W = window.innerWidth, H = window.innerHeight;
      const newWells = [];
      for (let i = 0; i < Math.min(preset.wells, 3); i++) {
        newWells.push({ id: ++gravityWellIdRef.current, x: W * (0.3 + i * 0.2), y: H * 0.5, strength: 800 });
      }
      setGravityWells(newWells);
      gravityWellsRef.current = newWells;
    }
    setPresetMenuOpen(false);
    toast.success(`Loaded preset: ${preset.name}`, { icon: '🎛️' });
  }, []);

  const despawnPlaygroundToy = useCallback((id) => {
    delete playgroundBodiesRef.current[id];
    delete playgroundNodesRef.current[id];
    delete playgroundSuppressedClickRef.current[id];
    setPlaygroundSpawns(prev => prev.filter((item) => item.id !== id));
  }, []);

  const spawnPlaygroundToy = useCallback((x, y, overrideTemplate = null) => {
    const id = `spawn-${++playgroundSpawnIdRef.current}`;
    const activeChaosEvent = chaosEventRef.current;
    const memoryLetter = overrideTemplate ? null : collection.shouldSpawnMemoryLetter();
    const chaosPool = activeChaosEvent?.effects?.spawnKinds?.map((kind) => PLAYGROUND_TOYS.find((toy) => toy.kind === kind)).filter(Boolean) || [];
    const template = overrideTemplate
      || (memoryLetter
        ? { icon: memoryLetter, label: 'Memory Fragment', accent: '#FBBF24', _memoryLetter: memoryLetter }
        : chaosPool[Math.floor(Math.random() * chaosPool.length)]
          || PLAYGROUND_TOYS[(playgroundSpawnIdRef.current - 1) % PLAYGROUND_TOYS.length]);
    if (memoryLetter) collection.onMemoryLetterSpawned(id);
    playgroundBodiesRef.current[id] = {
      x: x - 64,
      y: y - 36,
      vx: (Math.random() - 0.5) * 3,
      vy: -2 - Math.random() * 2,
      angle: 0,
      spin: (Math.random() - 0.5) * 0.16,
      pinned: false,
      orbit: false,
      orbitAngle: Math.random() * Math.PI * 2,
      orbitRadius: 90 + Math.random() * 110,
      fixed: true,
      baseX: 0,
      baseY: 0,
      width: 132,
      height: 78,
      escapeArmed: false,
    };
    setPlaygroundSpawns(prev => {
      const next = [...prev, { id, ...template, _spawnTime: Date.now(), _chaosEventId: activeChaosEvent?.id || null }];
      if (next.length > 8) {
        const oldest = next[0];
        delete playgroundBodiesRef.current[oldest.id];
        return next.slice(1);
      }
      return next;
    });
    setPlaygroundStats(prev => ({ ...prev, spawns: prev.spawns + 1 }));
    spawnImpactBurst(x, y, 1.1);
    playPlaygroundSound('spawn');
    applyPlaygroundBodyMaterial(id, playgroundBodiesRef.current[id]);
  }, [applyPlaygroundBodyMaterial, collection, playPlaygroundSound, spawnImpactBurst]);

  /* ─── Crate system ─── */
  const spawnCrate = useCallback(() => {
    const id = `crate-${crateIdRef.current++}`;
    // Pick a random modifier not currently active
    const activeIds = activeModifiersRef.current.map(m => m.id);
    const available = CRATE_MODIFIERS.filter(m => !activeIds.includes(m.id));
    const modifier = available[Math.floor(Math.random() * available.length)] || CRATE_MODIFIERS[Math.floor(Math.random() * CRATE_MODIFIERS.length)];
    const x = 80 + Math.random() * (window.innerWidth - 160);
    const y = 80 + Math.random() * (window.innerHeight * 0.6);
    // Register physics body for the crate
    playgroundBodiesRef.current[id] = createPlaygroundBody(id, {
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 2,
      vy: 0.3 + Math.random() * 0.5,
      angle: 0,
      spin: (Math.random() - 0.5) * 0.04,
      pinned: false,
      orbit: false,
      orbitAngle: 0,
      orbitRadius: 0,
      fixed: true,
      baseX: x,
      baseY: y,
      width: 100,
      height: 92,
    });
    setPlaygroundCrates(prev => {
      const next = [...prev, { id, x, y, modifier, spawnedAt: Date.now() }];
      // Max 3 crates at a time
      if (next.length > 3) {
        const oldest = next[0];
        delete playgroundBodiesRef.current[oldest.id];
        return next.slice(1);
      }
      return next;
    });
    playPlaygroundSound('crate_spawn');
  }, [createPlaygroundBody, playPlaygroundSound]);

  const activateModifier = useCallback((modifier, crateId) => {
    // Remove the crate
    setPlaygroundCrates(prev => prev.filter(c => c.id !== crateId));
    delete playgroundBodiesRef.current[crateId];
    if (playgroundNodesRef.current[crateId]) delete playgroundNodesRef.current[crateId];

    const now = Date.now();
    const buffedDuration = modifier.duration * prestigeBuffs.modifierDurationMul;
    setActiveModifiers(prev => {
      // If already active, refresh duration
      const existing = prev.find(m => m.id === modifier.id);
      if (existing) {
        const refreshed = prev.map(m => m.id === modifier.id ? { ...m, expiresAt: now + buffedDuration, startedAt: now } : m);
        activeModifiersRef.current = refreshed;
        return refreshed;
      }
      // Max 2: drop the oldest if full
      let next = [...prev];
      if (next.length >= 2) {
        next = next.slice(1);
      }
      next = [...next, { ...modifier, startedAt: now, expiresAt: now + buffedDuration }];
      activeModifiersRef.current = next;
      return next;
    });
    spawnImpactBurst(window.innerWidth / 2, window.innerHeight / 2, 2);
    playPlaygroundSound('crate_open');
    // Phase 3: Achievement chain triggers
    if (modifier.id === 'clone_storm') advanceAchievement('clone_storm_active');
    if (modifier.id === 'time_warp') advanceAchievement('time_warp_active');
  }, [advanceAchievement, playPlaygroundSound, prestigeBuffs.modifierDurationMul, spawnImpactBurst]);

  // Helper: check if a modifier is active (for physics loop via ref)
  const hasModifier = useCallback((modId) => {
    return activeModifiersRef.current.some(m => m.id === modId && Date.now() < m.expiresAt);
  }, []);

  const addPortalRewardPair = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const newPair = {
      id: ++portalIdRef.current,
      a: { x: 110, y: H * 0.32 },
      b: { x: W - 110, y: H * 0.68 },
    };
    setPortalPairs((prev) => {
      const next = [...prev, newPair].slice(-2);
      portalPairsRef.current = next;
      return next;
    });
    return newPair;
  }, []);

  const injectModifier = useCallback((modifierId, source = 'system') => {
    const modifier = CRATE_MODIFIERS.find((entry) => entry.id === modifierId);
    if (!modifier) return null;
    activateModifier(modifier, `virtual-${source}-${Date.now()}`);
    return modifier;
  }, [activateModifier]);

  const buildTrackedObjective = useCallback((template) => ({
    ...template,
    instanceId: `${template.name}-${Date.now()}`,
    startedAt: Date.now(),
    progress: 0,
    completed: false,
    baselines: {
      score: playgroundScoreRef.current,
      collects: playgroundCollectiblesRef.current,
      collisions: playgroundStatsRef.current.collisions,
    },
  }), []);

  const computeObjectiveProgress = useCallback((objective) => {
    if (!objective) return 0;
    switch (objective.metric) {
      case 'score':
        return Math.max(0, playgroundScoreRef.current - (objective.baselines?.score || 0));
      case 'collects':
        return Math.max(0, playgroundCollectiblesRef.current - (objective.baselines?.collects || 0));
      case 'collisions':
        return Math.max(0, playgroundStatsRef.current.collisions - (objective.baselines?.collisions || 0));
      case 'combo':
        return playgroundComboRef.current;
      case 'orbiters':
        return playgroundStatsRef.current.orbiters;
      case 'pins':
        return playgroundStatsRef.current.pinned;
      default:
        return 0;
    }
  }, []);

  const saveCreatorChallenge = useCallback(() => {
    if (!creatorPermissions.customChallenges) {
      toast.info('Prestige 2 unlocks challenge cards.', { icon: '⭐' });
      return;
    }
    const name = creatorChallengeDraft.name.trim() || `Challenge ${creatorChallenges.length + 1}`;
    const next = [
      ...creatorChallenges,
      {
        ...creatorChallengeDraft,
        name,
        target: Math.max(1, Number(creatorChallengeDraft.target) || 1),
        timeLimit: Math.max(5, Number(creatorChallengeDraft.timeLimit) || 5),
        savedAt: Date.now(),
      },
    ];
    setCreatorChallenges(next);
    writeStoredList(CREATOR_STORAGE_KEYS.challenges, next);
    toast.success(`Challenge card "${name}" saved.`, { icon: '🃏' });
  }, [creatorChallengeDraft, creatorChallenges, creatorPermissions.customChallenges]);

  const startCreatorChallenge = useCallback((template) => {
    if (!creatorPermissions.customChallenges) return false;
    const tracked = buildTrackedObjective(template);
    setActiveCreatorChallenge(tracked);
    setCreatorChallengeResult(null);
    toast.success(`Creator challenge: ${template.name}`, { icon: '🃏' });
    return true;
  }, [buildTrackedObjective, creatorPermissions.customChallenges]);

  const toggleModifierPackDraft = useCallback((modifierId) => {
    setCreatorModifierPackDraft((prev) => {
      if (prev.includes(modifierId)) return prev.filter((id) => id !== modifierId);
      if (prev.length >= 2) return [...prev.slice(1), modifierId];
      return [...prev, modifierId];
    });
  }, []);

  const saveModifierPack = useCallback(() => {
    if (!creatorPermissions.modifierPacks) {
      toast.info('Prestige 3 unlocks modifier packs.', { icon: '⭐' });
      return;
    }
    if (creatorModifierPackDraft.length === 0) {
      toast.info('Select at least one modifier.');
      return;
    }
    const name = creatorModifierPackName.trim() || `Pack ${creatorModifierPacks.length + 1}`;
    const next = [...creatorModifierPacks, { name, modifierIds: creatorModifierPackDraft, savedAt: Date.now() }];
    setCreatorModifierPacks(next);
    writeStoredList(CREATOR_STORAGE_KEYS.modifierPacks, next);
    setCreatorModifierPackName('');
    toast.success(`Modifier pack "${name}" saved.`, { icon: '🧪' });
  }, [creatorModifierPackDraft, creatorModifierPackName, creatorModifierPacks, creatorPermissions.modifierPacks]);

  const runModifierPack = useCallback((pack) => {
    if (!pack?.modifierIds?.length) return;
    pack.modifierIds.forEach((modifierId) => injectModifier(modifierId, `pack-${pack.name}`));
    toast.success(`Modifier pack "${pack.name}" injected.`, { icon: '⚡' });
  }, [injectModifier]);

  const toggleLoadoutDraftEvent = useCallback((eventId) => {
    setCreatorLoadoutDraft((prev) => {
      if (prev.includes(eventId)) return prev.filter((id) => id !== eventId);
      if (prev.length >= creatorPermissions.anomalySlots) return [...prev.slice(1), eventId];
      return [...prev, eventId];
    });
  }, [creatorPermissions.anomalySlots]);

  const startChaosEvent = useCallback((eventId, source = 'scheduler') => {
    const definition = CHAOS_EVENTS.find((entry) => entry.id === eventId);
    if (!definition) return false;

    const objective = generateRandomObjective();
    const tracked = buildTrackedObjective({
      ...definition,
      metric: objective.metric,
      target: objective.target,
    });
    const next = {
      ...definition,
      ...tracked,
      objective,
      source,
    };
    chaosEventRef.current = next;
    setChaosEvent(next);
    setChaosEventResult(null);
    toast.success(`${definition.name} online.`, { icon: definition.icon });
    return true;
  }, [buildTrackedObjective]);

  const saveAnomalyLoadout = useCallback(() => {
    if (!creatorPermissions.anomalyLoadouts) {
      toast.info('Prestige 4 unlocks anomaly loadouts.', { icon: '⭐' });
      return;
    }
    if (creatorLoadoutDraft.length === 0) {
      toast.info('Select at least one chaos event.');
      return;
    }
    const trimmedIds = creatorLoadoutDraft.slice(0, creatorPermissions.anomalySlots);
    const name = creatorLoadoutName.trim() || `Loadout ${creatorAnomalyLoadouts.length + 1}`;
    const next = [...creatorAnomalyLoadouts, { name, eventIds: trimmedIds, savedAt: Date.now() }];
    setCreatorAnomalyLoadouts(next);
    writeStoredList(CREATOR_STORAGE_KEYS.anomalyLoadouts, next);
    setCreatorLoadoutName('');
    toast.success(`Anomaly loadout "${name}" saved.`, { icon: '🌀' });
  }, [creatorAnomalyLoadouts, creatorLoadoutDraft, creatorLoadoutName, creatorPermissions.anomalyLoadouts, creatorPermissions.anomalySlots]);

  const runAnomalyLoadout = useCallback((loadout) => {
    if (!loadout?.eventIds?.length) return false;
    creatorLoadoutQueueRef.current = loadout.eventIds.slice(1);
    const started = startChaosEvent(loadout.eventIds[0], `loadout:${loadout.name}`);
    if (started) toast.success(`Loadout "${loadout.name}" engaged.`, { icon: '🌀' });
    return started;
  }, [startChaosEvent]);

  const resolveBossReward = useCallback((reward) => {
    if (!reward) return;
    if (reward.kind === 'modifier' && reward.modifierId) {
      injectModifier(reward.modifierId, `boss-${reward.bossId}`);
    }
    if (reward.kind === 'portals') {
      addPortalRewardPair();
    }
    setBossRewardToast(reward);
    window.setTimeout(() => setBossRewardToast(null), 3200);
    toast.success(`${reward.label}: ${reward.desc}`, { icon: '🏆' });
  }, [addPortalRewardPair, injectModifier]);

  useEffect(() => {
    if (!bosses.rewardDrop) return;
    resolveBossReward(bosses.rewardDrop);
    bosses.clearReward();
  }, [bosses.clearReward, bosses.rewardDrop, resolveBossReward]);

  useEffect(() => {
    if (!activeCreatorChallenge) return;
    const interval = setInterval(() => setCreatorChallengeTick((tick) => tick + 1), 200);
    return () => clearInterval(interval);
  }, [activeCreatorChallenge]);

  useEffect(() => {
    if (!activeCreatorChallenge) return;

    const progress = computeObjectiveProgress(activeCreatorChallenge);
    if (progress !== activeCreatorChallenge.progress) {
      setActiveCreatorChallenge((prev) => (prev ? { ...prev, progress } : prev));
      if (progress >= activeCreatorChallenge.target) {
        setCreatorChallengeResult({ type: 'success', label: activeCreatorChallenge.name });
        setActiveCreatorChallenge(null);
        toast.success(`Creator challenge complete: ${activeCreatorChallenge.name}`, { icon: '🃏' });
        injectModifier('score_surge', 'creator-challenge');
      }
      return;
    }

    const elapsed = (Date.now() - activeCreatorChallenge.startedAt) / 1000;
    if (elapsed >= activeCreatorChallenge.timeLimit) {
      setCreatorChallengeResult({ type: 'fail', label: activeCreatorChallenge.name });
      setActiveCreatorChallenge(null);
      toast.error(`Creator challenge failed: ${activeCreatorChallenge.name}`);
    }
  }, [activeCreatorChallenge, computeObjectiveProgress, creatorChallengeTick, injectModifier, playgroundCollectibles, playgroundCombo, playgroundScore, playgroundStats]);

  useEffect(() => {
    chaosEventRef.current = chaosEvent;
  }, [chaosEvent]);

  useEffect(() => {
    if (!playgroundMode) {
      if (chaosEventTimerRef.current) clearTimeout(chaosEventTimerRef.current);
      chaosEventRef.current = null;
      setChaosEvent(null);
      return;
    }

    if (chaosEvent) {
      const tick = setInterval(() => setChaosEventTick((value) => value + 1), 250);
      chaosEventTimerRef.current = setTimeout(() => {
        setChaosEvent(null);
        chaosEventRef.current = null;
        const nextQueued = creatorLoadoutQueueRef.current.shift();
        if (nextQueued) {
          window.setTimeout(() => startChaosEvent(nextQueued, 'loadout-chain'), 1200);
        }
      }, chaosEvent.duration);
      return () => {
        clearInterval(tick);
        if (chaosEventTimerRef.current) clearTimeout(chaosEventTimerRef.current);
      };
    }

    chaosEventTimerRef.current = setTimeout(() => {
      const randomEvent = CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)];
      startChaosEvent(randomEvent.id, 'scheduler');
    }, 120000 + Math.random() * 60000);

    return () => {
      if (chaosEventTimerRef.current) clearTimeout(chaosEventTimerRef.current);
    };
  }, [chaosEvent, playgroundMode, startChaosEvent]);

  useEffect(() => {
    if (!chaosEvent) return;
    if (chaosEvent.completed) return;

    const progress = computeObjectiveProgress(chaosEvent);
    if (progress === chaosEvent.progress) return;

    const next = { ...chaosEvent, progress };
    if (progress >= chaosEvent.objective.target) {
      next.completed = true;
      chaosEventRef.current = next;
      setChaosEvent(next);
      setChaosEventResult({ type: 'success', label: chaosEvent.reward.label, eventName: chaosEvent.name });
      if (chaosEvent.reward.kind === 'modifier') {
        injectModifier(chaosEvent.reward.modifierId, `chaos-${chaosEvent.id}`);
      }
      toast.success(`${chaosEvent.name} stabilized. Reward: ${chaosEvent.reward.label}`, { icon: chaosEvent.icon });
      return;
    }

    chaosEventRef.current = next;
    setChaosEvent(next);
  }, [chaosEvent, chaosEventTick, computeObjectiveProgress, injectModifier, playgroundCollectibles, playgroundCombo, playgroundScore, playgroundStats]);

  // Crate spawn timer (prestige buff: crateSpeedMul makes crates faster)
  useEffect(() => {
    if (!playgroundMode) return;
    const scheduleNext = () => {
      const delay = (25000 + Math.random() * 35000) * prestigeBuffs.crateSpeedMul; // 25-60s base
      crateSpawnTimerRef.current = setTimeout(() => {
        spawnCrate();
        scheduleNext();
      }, delay);
    };
    // First crate after 15-25s
    crateSpawnTimerRef.current = setTimeout(() => {
      spawnCrate();
      scheduleNext();
    }, (15000 + Math.random() * 10000) * prestigeBuffs.crateSpeedMul);
    return () => { if (crateSpawnTimerRef.current) clearTimeout(crateSpawnTimerRef.current); };
  }, [playgroundMode, prestigeBuffs.crateSpeedMul, spawnCrate]);

  // Expire modifiers
  useEffect(() => {
    if (activeModifiers.length === 0) return;
    const soonest = Math.min(...activeModifiers.map(m => m.expiresAt));
    const remaining = soonest - Date.now();
    if (remaining <= 0) {
      const now = Date.now();
      const alive = activeModifiers.filter(m => m.expiresAt > now);
      setActiveModifiers(alive);
      activeModifiersRef.current = alive;
      return;
    }
    const timer = setTimeout(() => {
      const now = Date.now();
      const alive = activeModifiers.filter(m => m.expiresAt > now);
      setActiveModifiers(alive);
      activeModifiersRef.current = alive;
    }, remaining + 50);
    return () => clearTimeout(timer);
  }, [activeModifiers]);

  // Tick for modifier HUD countdown bars
  const [modifierTick, setModifierTick] = useState(0);
  useEffect(() => {
    if (activeModifiers.length === 0) return;
    const iv = setInterval(() => setModifierTick(t => t + 1), 200);
    return () => clearInterval(iv);
  }, [activeModifiers.length]);

  // Keep crates ref in sync for RAF (physics loop) access
  useEffect(() => { playgroundCratesRef.current = playgroundCrates; }, [playgroundCrates]);

  const sendNearestItemToOrbit = useCallback((x, y) => {
    let nearest = null;
    let nearestDist = Number.POSITIVE_INFINITY;
    Object.entries(playgroundBodiesRef.current).forEach(([id, body]) => {
      if (!body || id.startsWith('spawn-') || !isPlaygroundItemId(id)) return;
      const center = getPlaygroundBodyViewportRect(body);
      const distance = Math.hypot(center.centerX - x, center.centerY - y);
      if (distance < nearestDist) {
        nearest = { id, cx: center.centerX, cy: center.centerY };
        nearestDist = distance;
      }
    });
    if (!nearest) return;
    const body = playgroundBodiesRef.current[nearest.id];
    if (!body) return;
    const coreX = window.innerWidth / 2;
    const coreY = window.innerHeight * 0.35;
    body.orbit = true;
    body.pinned = false;
    body.vx = 0;
    body.vy = 0;
    body.orbitRadius = Math.max(110, Math.min(230, Math.hypot(nearest.cx - coreX, nearest.cy - coreY)));
    body.orbitAngle = Math.atan2(nearest.cy - coreY, nearest.cx - coreX);
    body.spin = 0.03;
    body.sleeping = false;
    body.sleepFrames = 0;
    syncPlaygroundMeta();
  }, [getPlaygroundBodyViewportRect, isPlaygroundItemId, syncPlaygroundMeta]);

  const suppressPlaygroundClick = useCallback((id) => {
    playgroundSuppressedClickRef.current[id] = Date.now() + 320;
  }, []);

  const consumeSuppressedPlaygroundClick = useCallback((id) => {
    const suppressedUntil = playgroundSuppressedClickRef.current[id];
    if (!suppressedUntil) return false;
    delete playgroundSuppressedClickRef.current[id];
    return suppressedUntil > Date.now();
  }, []);

  const collectPlaygroundToy = useCallback((id, event) => {
    if (!playgroundMode || playgroundOrbitMode) return;
    if (consumeSuppressedPlaygroundClick(id)) {
      if (event) {
        if (event.cancelable) event.preventDefault();
        event.stopPropagation();
      }
      return;
    }
    const spawn = playgroundSpawns.find((item) => item.id === id);
    if (!spawn) return;
    if (event) {
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();
    }
    const node = playgroundNodesRef.current[id];
    const body = playgroundBodiesRef.current[id];
    const rect = body ? getPlaygroundBodyViewportRect(body) : null;
    const centerX = rect ? rect.centerX : window.innerWidth / 2;
    const centerY = rect ? rect.centerY : window.innerHeight / 2;

    despawnPlaygroundToy(id);

    const now = Date.now();
    const nextCombo = now - playgroundLastCollectRef.current < 2200 ? playgroundCombo + 1 : 1;
    playgroundLastCollectRef.current = now;
    setPlaygroundCombo(nextCombo);
    setPlaygroundCollectibles(prev => prev + 1);
    if (playgroundComboResetRef.current) clearTimeout(playgroundComboResetRef.current);
    playgroundComboResetRef.current = setTimeout(() => setPlaygroundCombo(0), 2600);

    const baseScore = { satellite: 180, toast: 120, code: 160, relay: 140 }[spawn.kind] || 100;
    const prestigeScoreMul = prestigeBuffs.scoreMultiplier + prestigeBuffs.bonusScorePerLevel;
    const chaosScoreMul = chaosEventRef.current?.effects?.scoreMultiplier || 1;
    const voidScoreMul = voidDim.inVoid ? (voidDim.getPhysicsMods()?.scoreMul || 1) : 1;
    const newScore = playgroundScore + Math.round((baseScore + Math.min(nextCombo, 5) * 25) * prestigeScoreMul * chaosScoreMul * voidScoreMul);
    collection.onScoreChange(playgroundScore, newScore);
    setPlaygroundScore(newScore);
    // Phase 3: Achievement chain triggers
    if (newScore >= 500) advanceAchievement('score_500');
    if (nextCombo >= 5) advanceAchievement('combo_5');
    dailySeed.updateDailyProgress('score', newScore);
    dailySeed.updateDailyProgress('collect', 1);
    dailySeed.updateDailyProgress('combo', nextCombo);
    spawnImpactBurst(centerX, centerY, 1.25);
    playPlaygroundSound('collect');

    // Collection tracking
    collection.onToyCollected(spawn, newScore, nextCombo, playgroundSpawns);

    // Speedrun + Void score
    const challengeResult = speedrun.updateProgress('collects', 1);
    speedrun.updateProgress('score', newScore);
    speedrun.updateProgress('combo', nextCombo);
    if (challengeResult) {
      collection.onSpeedrunCompleted(challengeResult.challengeId);
      advanceAchievement('speedrun_done');
    }
    if (voidDim.inVoid) voidDim.addVoidScore(baseScore);

    if (spawn.kind === 'satellite') {
      sendNearestItemToOrbit(centerX, centerY);
      toast.success('Satellite captured: nearest card sent into orbit.');
    }
    if (spawn.kind === 'toast') {
      setPlaygroundGravityMode('zero');
      toast.success('Stability pickup: gravity neutralized.');
    }
    if (spawn.kind === 'code') {
      spawnPlaygroundToy(centerX + 36, centerY - 22);
      spawnPlaygroundToy(centerX - 36, centerY + 22);
      toast.success('Code shard split into two more fragments.');
    }
    if (spawn.kind === 'relay') {
      setPlaygroundForceMode('magnet');
      if (playgroundForceTimeoutRef.current) clearTimeout(playgroundForceTimeoutRef.current);
      playgroundForceTimeoutRef.current = setTimeout(() => setPlaygroundForceMode('none'), 4500);
      toast.success('Relay captured: temporary magnet field active.');
    }

    // Memory Leak letter collection
    if (spawn._memoryLetter) {
      collection.onMemoryLetterCollected(spawn._memoryLetter);
      toast.success(`Memory fragment collected: "${spawn._memoryLetter}"`);
    }

    // Check mythic / transcendent after every collect
    const mythicResult = collection.checkMythic();
    if (mythicResult === 'mythic' || mythicResult === 'transcendent') {
      setMythicCinematic(mythicResult);
      setTimeout(() => setMythicCinematic(false), mythicResult === 'transcendent' ? 5000 : 3500);
    }
  }, [collection, consumeSuppressedPlaygroundClick, despawnPlaygroundToy, getPlaygroundBodyViewportRect, playPlaygroundSound, playgroundCombo, playgroundMode, playgroundOrbitMode, playgroundScore, playgroundSpawns, sendNearestItemToOrbit, spawnImpactBurst, spawnPlaygroundToy, speedrun, voidDim]);

  const togglePlaygroundPin = useCallback((id, event) => {
    if (!playgroundMode || !isPlaygroundItemId(id)) return;
    if (event) {
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();
    }
    const body = playgroundBodiesRef.current[id];
    if (!body) return;
    body.pinned = !body.pinned;
    if (body.pinned) {
      body.vx = 0;
      body.vy = 0;
      body.spin = 0;
      body.orbit = false;
    } else {
      body.vx += (Math.random() - 0.5) * 1;
      body.vy -= 0.5;
    }
    body.sleeping = false;
    body.sleepFrames = 0;
    collection.onPinToggle(id);
    if (body.pinned) speedrun.updateProgress('pins', 1);
    // Phase 3: Achievement - pin count
    if (body.pinned) {
      const pinnedCount = Object.values(playgroundBodiesRef.current).filter(b => b && b.pinned).length;
      if (pinnedCount >= 6) advanceAchievement('pin_6');
      dailySeed.updateDailyProgress('pin', pinnedCount);
    }
    syncPlaygroundMeta();
  }, [collection, isPlaygroundItemId, playgroundMode, speedrun, syncPlaygroundMeta]);

  const togglePlaygroundOrbit = useCallback((id, event) => {
    if (!playgroundMode || !isPlaygroundItemId(id)) return false;
    if (event) {
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();
    }
    const body = playgroundBodiesRef.current[id];
    if (!body) return false;
    const rect = getPlaygroundBodyViewportRect(body);
    const coreX = window.innerWidth / 2;
    const coreY = window.innerHeight * 0.35;
    body.orbit = !body.orbit;
    body.pinned = false;
    if (body.orbit) {
      body.orbitRadius = Math.max(100, Math.min(220, Math.hypot(rect.centerX - coreX, rect.centerY - coreY)));
      body.orbitAngle = Math.atan2(rect.centerY - coreY, rect.centerX - coreX);
      body.vx = 0;
      body.vy = 0;
      body.spin = 0.008 + Math.random() * 0.012;
    }
    body.sleeping = false;
    body.sleepFrames = 0;
    syncPlaygroundMeta();
    return true;
  }, [getPlaygroundBodyViewportRect, isPlaygroundItemId, playgroundMode, syncPlaygroundMeta]);

  const handlePlaygroundItemCapture = useCallback((id, event) => {
    if (consumeSuppressedPlaygroundClick(id)) {
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (!playgroundMode || !playgroundOrbitMode) return;
    togglePlaygroundOrbit(id, event);
  }, [consumeSuppressedPlaygroundClick, playgroundMode, playgroundOrbitMode, togglePlaygroundOrbit]);

  /* Playground mode - triple-click logo */
  const handleLogoClick = useCallback(() => {
    logoClickCount.current += 1;
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    if (logoClickCount.current >= 3) {
      logoClickCount.current = 0;
      if (playgroundMode) {
        deactivatePlayground();
        toast.success('Playground closed');
        return;
      }
      resetPlaygroundLayout({ clearSpawns: true });
      setPlaygroundForceMode('none');
      setPlaygroundGravityMode('zero');
      setPlaygroundOrbitMode(false);
      setPlaygroundPaused(false);
      setPlaygroundSlowMo(false);
      setPlaygroundMastered(false);
      setPlaygroundStats({ launches: 0, spawns: 0, collisions: 0, pinned: 0, orbiters: 0 });
      setPlaygroundScore(0);
      setPlaygroundCombo(0);
      setPlaygroundCollectibles(0);
      // Re-randomize objectives
      const newIndices = ALL_OBJECTIVES.current.map((_, i) => i).sort(() => Math.random() - 0.5);
      setObjectiveIndices(newIndices.slice(0, 4));
      setPlaygroundMode(true);
      collection.onSessionStart();
      // Phase 3: Prestige P4+ — start with a random modifier
      if (prestigeBuffs.startWithModifier) {
        setTimeout(() => {
          const randomMod = CRATE_MODIFIERS[Math.floor(Math.random() * CRATE_MODIFIERS.length)];
          const fakeId = `crate-prestige-${Date.now()}`;
          setPlaygroundCrates(prev => [...prev, { id: fakeId, x: -999, y: -999, modifier: randomMod, spawnedAt: Date.now() }]);
          activateModifier(randomMod, fakeId);
        }, 1500);
      }
      // Boot sequence — terminal-style init in the corner
      {
        const lines = [
          '> SYSTEM OVERRIDE ACCEPTED',
          '> initializing physics_engine.sh... [OK]',
          '> enabling drag_and_fling... [OK]',
          '> loading double_click_to_pin... [OK]',
          '> spawning toy_elements... [OK]',
          '> unlocking force_modes... [OK]',
          `> WARNING: ${COLLECTIBLE_ITEMS.length} anomalies detected in DOM`,
          '> all systems armed. proceed with caution.',
        ];
        setPgBootLines([]);
        let i = 0;
        const tick = () => {
          if (i < lines.length) {
            const currentLine = lines[i];
            setPgBootLines(prev => [...prev, currentLine]);
            i++;
            bootTimerRef.current = setTimeout(tick, 180 + Math.random() * 120);
          } else {
            bootTimerRef.current = setTimeout(() => setPgBootLines([]), 2800);
          }
        };
        bootTimerRef.current = setTimeout(tick, 400);
      }
      // Ghost hint — first contextual hint
      if (typeof window !== 'undefined' && !localStorage.getItem('synthi_tutorial_done')) {
        ghostHintShownRef.current = {};
        setGhostHint('try dragging a card...');
      }
      playPlaygroundSound('unlock');
      toast.success('Playground unlocked. Drag cards, double-click to pin, click empty space to spawn toys.');
      return;
    }
    logoClickTimer.current = setTimeout(() => { logoClickCount.current = 0; }, 400);
  }, [deactivatePlayground, playgroundMode, playPlaygroundSound, resetPlaygroundLayout]);

  const playgroundDragStart = useCallback((id, event) => {
    if (!playgroundMode || !isPlaygroundItemId(id) || playgroundOrbitMode) return;
    if (event.target.closest('input, button, a, textarea, label, [data-playground-control]')) return;
    const point = event.touches ? event.touches[0] : event;
    const now = performance.now();
    registerPlaygroundNode(id, event.currentTarget);
    const body = playgroundBodiesRef.current[id];
    if (!body) return;
    body.pinned = false;
    body.orbit = false;
    body.escapeArmed = false;
    body.sleeping = false;
    body.sleepFrames = 0;
    body.vx = 0;
    body.vy = 0;
    body.spin = 0;
    event.currentTarget.style.transition = 'none';
    const rect = getPlaygroundBodyViewportRect(body);
    const offsetX = point.clientX - rect.centerX;
    const offsetY = point.clientY - rect.centerY;
    const localOffset = rotateVector(offsetX, offsetY, -body.angle);
    playgroundPointerRef.current = {
      x: point.clientX,
      y: point.clientY,
      vx: 0,
      vy: 0,
      lastX: point.clientX,
      lastY: point.clientY,
      lastT: now,
    };
    playgroundDragRef.current = {
      id,
      startX: point.clientX,
      startY: point.clientY,
      engaged: false,
      grabRadius: Math.max(Math.hypot(offsetX, offsetY), 18),
      grabLocalX: localOffset.x,
      grabLocalY: localOffset.y,
      lastAngularVelocity: 0,
      releaseVx: 0,
      releaseVy: 0,
      releaseSpin: 0,
    };
    // Disable touch scrolling only on the actively dragged element
    event.currentTarget.style.touchAction = 'none';
    syncPlaygroundMeta();
    if (event.cancelable) event.preventDefault();
  }, [getPlaygroundBodyViewportRect, isPlaygroundItemId, playgroundMode, playgroundOrbitMode, registerPlaygroundNode, syncPlaygroundMeta]);

  // Ghost hint progression — advance contextual hints based on actions
  useEffect(() => {
    if (!playgroundMode || !ghostHint) return;
    const g = ghostHintShownRef.current;
    const s = playgroundStats;
    let nextHint = null;
    let delay = 800;
    if (!g.drag && s.launches > 0) {
      g.drag = true;
      nextHint = 'click empty space to spawn something...';
    } else if (!g.spawn && g.drag && s.spawns > 0) {
      g.spawn = true;
      nextHint = 'double-click a card to pin it in place...';
    } else if (!g.pin && g.spawn && s.pinned > 0) {
      g.pin = true;
      nextHint = 'check the HUD. change gravity. break things.';
    } else if (!g.collide && g.pin && s.collisions > 2) {
      g.collide = true;
      nextHint = `${COLLECTIBLE_ITEMS.length} anomalies are watching. type "man vectant" in the editor.`;
      delay = 1200;
    } else if (g.collide && s.collisions > 5 && !g.done) {
      g.done = true;
      localStorage.setItem('synthi_tutorial_done', '1');
      if (ghostTimerRef.current) clearTimeout(ghostTimerRef.current);
      ghostTimerRef.current = setTimeout(() => setGhostHint(null), 3000);
      return;
    }
    if (nextHint) {
      if (ghostTimerRef.current) clearTimeout(ghostTimerRef.current);
      // brief fade gap
      setGhostHint(null);
      ghostTimerRef.current = setTimeout(() => setGhostHint(nextHint), delay);
    }
  }, [playgroundMode, ghostHint, playgroundStats]);

  useEffect(() => {
    if (!playgroundMode) {
      if (utilityHintTimerRef.current) clearTimeout(utilityHintTimerRef.current);
      setUtilityHintVisible(false);
      return;
    }
    if (!utilityHintEligible) {
      if (utilityHintTimerRef.current) clearTimeout(utilityHintTimerRef.current);
      setUtilityHintVisible(false);
      return;
    }
    if (journalOpen || helpPanelOpen) {
      utilityHintSeenRef.current = true;
      if (utilityHintTimerRef.current) clearTimeout(utilityHintTimerRef.current);
      setUtilityHintVisible(false);
      return;
    }
    if (utilityHintSeenRef.current) return;
    if (utilityHintTimerRef.current) clearTimeout(utilityHintTimerRef.current);
    utilityHintTimerRef.current = setTimeout(() => {
      if (!utilityHintSeenRef.current) setUtilityHintVisible(true);
    }, 2200);
    return () => {
      if (utilityHintTimerRef.current) clearTimeout(utilityHintTimerRef.current);
    };
  }, [helpPanelOpen, journalOpen, playgroundMode, utilityHintEligible]);

  useEffect(() => {
    if (!playgroundMode) return;
    const updatePointerFromEvent = (point, now, { preserveVelocityIfStationary = false } = {}) => {
      if (!point) return;
      const pointer = playgroundPointerRef.current;
      const deltaX = point.clientX - pointer.lastX;
      const deltaY = point.clientY - pointer.lastY;
      if (pointer.lastT) {
        const pointerDt = Math.max((now - pointer.lastT) / 16.67, 0.5);
        const moved = Math.hypot(deltaX, deltaY) > 0.5;
        const keepRecentVelocity = preserveVelocityIfStationary && !moved && (now - pointer.lastT) <= 90;
        if (!keepRecentVelocity) {
          pointer.vx = moved ? deltaX / pointerDt : 0;
          pointer.vy = moved ? deltaY / pointerDt : 0;
        }
      }
      pointer.x = point.clientX;
      pointer.y = point.clientY;
      pointer.lastX = point.clientX;
      pointer.lastY = point.clientY;
      pointer.lastT = now;
    };

    const finishDrag = (dragState = playgroundDragRef.current) => {
      if (!dragState) return;
      const body = playgroundBodiesRef.current[dragState.id];
      const dragNode = playgroundNodesRef.current[dragState.id];
      if (body) {
        body.sleeping = false;
        body.sleepFrames = 0;
        if (!dragState.engaged) {
          body.vx = 0;
          body.vy = 0;
          body.spin = 0;
        } else {
          const throwBoost = body.throwBoost ?? 1;
          body.vx = (body.vx * 0.28) + (dragState.releaseVx * PLAYGROUND_POINTER_FLING_BLEND * throwBoost);
          body.vy = (body.vy * 0.28) + (dragState.releaseVy * PLAYGROUND_POINTER_FLING_BLEND * throwBoost);
          const maxReleaseSpeed = Math.max(PLAYGROUND_MAX_FLING_SPEED, (body.maxSpeed ?? PLAYGROUND_MAX_TRAVEL_SPEED) * 1.08);
          const flingSpeed = Math.hypot(body.vx, body.vy);
          if (flingSpeed > maxReleaseSpeed) {
            body.vx *= maxReleaseSpeed / flingSpeed;
            body.vy *= maxReleaseSpeed / flingSpeed;
          }
          body.spin = clampNumber(
            (dragState.lastAngularVelocity || body.spin) * 0.42 + (dragState.releaseSpin || 0) * (0.95 * (body.impactSpinBoost ?? 1)),
            -PLAYGROUND_MAX_ANGULAR_SPEED,
            PLAYGROUND_MAX_ANGULAR_SPEED,
          );
          body.escapeArmed = dragState.id.startsWith('spawn-')
            && (Math.hypot(body.vx, body.vy) >= PLAYGROUND_THROWAWAY_SPEED || Math.abs(body.spin) >= PLAYGROUND_THROWAWAY_SPIN);
          if (flingSpeed > 5) {
            setPlaygroundStats(prev => ({ ...prev, launches: prev.launches + 1 }));
          }
          suppressPlaygroundClick(dragState.id);
        }
      }
      if (dragNode) {
        dragNode.style.touchAction = '';
        dragNode.style.transition = 'opacity 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease, background-color 0.2s ease, color 0.2s ease';
      }
      playgroundDragRef.current = null;
    };

    const onMove = (event) => {
      const point = event.touches ? event.touches[0] : event;
      if (!point) return;
      const now = performance.now();
      updatePointerFromEvent(point, now);

      const drag = playgroundDragRef.current;
      if (!drag) return;
      if (!event.touches && event.buttons === 0) {
        finishDrag(drag);
        return;
      }
      // Require minimum 4px movement before engaging drag (prevents click-fling)
      if (!drag.engaged) {
        if (Math.hypot(point.clientX - drag.startX, point.clientY - drag.startY) < 4) return;
        drag.engaged = true;
      }
      const body = playgroundBodiesRef.current[drag.id];
      if (!body) return;
      body.sleeping = false;
      body.sleepFrames = 0;
      drag.lastAngularVelocity = body.spin;
      drag.releaseVx = playgroundPointerRef.current.vx;
      drag.releaseVy = playgroundPointerRef.current.vy;
      const rect = getPlaygroundBodyViewportRect(body);
      const radialX = point.clientX - rect.centerX;
      const radialY = point.clientY - rect.centerY;
      const radialDist = Math.max(Math.hypot(radialX, radialY), 1);
      const tangentX = -radialY / radialDist;
      const tangentY = radialX / radialDist;
      drag.releaseSpin = ((playgroundPointerRef.current.vx * tangentX) + (playgroundPointerRef.current.vy * tangentY)) / Math.max(drag.grabRadius, 18);
      if (event.cancelable) event.preventDefault();
    };
    const onUp = (event) => {
      const point = event.changedTouches ? event.changedTouches[0] : event;
      if (point) updatePointerFromEvent(point, performance.now(), { preserveVelocityIfStationary: true });
      const drag = playgroundDragRef.current;
      if (drag) {
        drag.releaseVx = playgroundPointerRef.current.vx;
        drag.releaseVy = playgroundPointerRef.current.vy;
      }
      finishDrag();
    };
    const onKeyDown = (event) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
      if (event.key === 'Shift') { setPlaygroundSlowMo(true); collection.onSlowMo(); }
      if (event.code === 'Space') {
        event.preventDefault();
        setPlaygroundPaused(true);
      }
      // Void: press V to enter when score threshold is met
      if (event.key === 'v' || event.key === 'V') {
        if (playgroundScoreRef.current >= voidDim.entryScoreThreshold && !voidDim.inVoid) voidDim.enterVoid();
      }
      // Speedrun: press T to start timed challenge
      if (event.key === 't' || event.key === 'T') {
        speedrun.startChallenge();
      }
      // Phase 2: Portal placement mode
      if (event.key === 'p' || event.key === 'P') {
        setPortalPlacementMode(prev => {
          if (prev) portalPendingRef.current = null; // cancel pending click
          return !prev;
        });
        setGravityWellPlacementMode(false); // exclusive modes
      }
      // Phase 2: Gravity well placement mode
      if (event.key === 'g' || event.key === 'G') {
        setGravityWellPlacementMode(prev => {
          return !prev;
        });
        setPortalPlacementMode(false); // exclusive modes
        portalPendingRef.current = null;
      }
    };
    const onKeyUp = (event) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
      if (event.key === 'Shift') setPlaygroundSlowMo(false);
      if (event.code === 'Space') setPlaygroundPaused(false);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    window.addEventListener('touchcancel', onUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('touchcancel', onUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [getPlaygroundBodyViewportRect, playgroundMode, suppressPlaygroundClick]);

  useEffect(() => {
    if (!playgroundMode) {
      if (playgroundRafRef.current) cancelAnimationFrame(playgroundRafRef.current);
      return;
    }
    let last = performance.now();
    const step = (now) => {
      const rawDt = Math.min((now - last) / 16.67, 2.25);
      last = now;
      const dt = playgroundPaused ? 0 : rawDt * (playgroundSlowMo ? 0.22 : 1) * (hasModifier('time_warp') ? 2 : 1);
      const weatherMods = weather.getPhysicsMods();
      const voidMods = voidDim.getPhysicsMods();
      const chaosEffects = chaosEventRef.current?.effects || null;
      const bossArenaEffect = bosses.arenaEffect;
      const mods = activeModifiersRef.current.filter(m => Date.now() < m.expiresAt);
      const hasMod = (id) => mods.some(m => m.id === id);
      const draggedId = playgroundDragRef.current?.id;
      const coreX = window.innerWidth / 2;
      const coreY = window.innerHeight * 0.35;
      const bodies = Object.entries(playgroundNodesRef.current)
        .filter(([id, node]) => node && node.isConnected && (isPlaygroundItemId(id) || id.startsWith('crate-')))
        .map(([id, node]) => {
          const body = playgroundBodiesRef.current[id] ?? (playgroundBodiesRef.current[id] = createPlaygroundBody(id));
          if (!body.width || !body.height || (!body.fixed && (body.baseX === undefined || body.baseY === undefined))) {
            syncPlaygroundBodyNodeMetrics(id, node, body);
          }
          return { id, node, body };
        });

      if (dt > 0) {
        bodies.forEach((item) => {
          const { id, body } = item;
          const dragging = draggedId === id;
          const rect = getPlaygroundBodyViewportRect(body);
          const radius = Math.hypot(body.width, body.height) / 2;
          const inViewport = rect.centerX + radius > -220
            && rect.centerX - radius < window.innerWidth + 220
            && rect.centerY + radius > -220
            && rect.centerY - radius < window.innerHeight + 220;

          if (!inViewport && body.sleeping && !dragging && !body.orbit && !body.pinned) return;

          if (body.orbit) {
            body.orbitAngle += 0.012 * dt;
            const targetX = coreX + Math.cos(body.orbitAngle) * body.orbitRadius;
            const targetY = coreY + Math.sin(body.orbitAngle) * (body.orbitRadius * 0.55);
            body.vx = (targetX - rect.centerX) * 0.16;
            body.vy = (targetY - rect.centerY) * 0.16;
            body.x += body.vx * dt;
            body.y += body.vy * dt;
            body.angle += 0.012 * dt;
            body.sleeping = false;
            body.sleepFrames = 0;
            return;
          }

          if (!body.pinned) {
            const effectiveGravityMode = chaosEffects?.gravityOverride || playgroundGravityMode;
            const effectiveForceMode = chaosEffects?.forceOverride || playgroundForceMode;

            if (effectiveGravityMode === 'down') body.vy += 0.16 * dt;
            if (effectiveGravityMode === 'reverse') body.vy -= 0.16 * dt;
            if (hasMod('gravity_flip')) body.vy -= 0.32 * dt;
            if (voidMods?.gravityBias) body.vy += voidMods.gravityBias * dt;
            if (voidMods?.lateralDrift) body.vx += voidMods.lateralDrift * dt;
            if (chaosEffects?.lateralDrift) body.vx += chaosEffects.lateralDrift * dt;
            if (voidMods?.jitterChance && Math.random() < voidMods.jitterChance * 0.1 * dt) {
              body.vx += (Math.random() - 0.5) * voidMods.jitterForce * dt;
              body.vy += (Math.random() - 0.5) * voidMods.jitterForce * dt;
            }

            if (bossArenaEffect?.type === 'segfault_field') {
              body.vx += (Math.random() - 0.5) * 0.22 * dt * bossArenaEffect.intensity;
              body.vy += (Math.random() - 0.5) * 0.22 * dt * bossArenaEffect.intensity;
            }
            if (bossArenaEffect?.type === 'lockfield') {
              const lockDx = coreX - rect.centerX;
              const lockDy = coreY - rect.centerY;
              const lockDist = Math.max(Math.hypot(lockDx, lockDy), 1);
              body.vx += (lockDx / lockDist) * 0.2 * dt * bossArenaEffect.intensity;
              body.vy += (lockDy / lockDist) * 0.2 * dt * bossArenaEffect.intensity;
            }
            if (bossArenaEffect?.type === 'time_skew' && Math.random() < 0.03 * dt) {
              body.vx *= 1 + 0.02 * bossArenaEffect.intensity;
              body.vy *= 1 + 0.02 * bossArenaEffect.intensity;
              body.spin += (Math.random() - 0.5) * 0.015 * dt;
            }

            if (effectiveForceMode !== 'none' || hasMod('magnet_pulse')) {
              const forceOriginX = playgroundPointerRef.current.x || coreX;
              const forceOriginY = playgroundPointerRef.current.y || coreY;
              const dx = forceOriginX - rect.centerX;
              const dy = forceOriginY - rect.centerY;
              const dist = Math.max(Math.hypot(dx, dy), 1);
              if (dist < 600) {
                const direction = (effectiveForceMode === 'magnet' || hasMod('magnet_pulse')) ? 1 : -1;
                const force = (1 - dist / 600) * 0.65 * dt * (hasMod('magnet_pulse') ? 1.6 : 1);
                body.vx += direction * (dx / dist) * force;
                body.vy += direction * (dy / dist) * force;
              }
            }

            if (weatherMods?.gravityPulse) body.vy += weatherMods.gravityPulse * dt;
            if (weatherMods?.solarDrift) body.vy += weatherMods.solarDrift * dt;

            // Phase 2: Gravity wells — inverse-square attraction, slingshot eject at <25px
            const wells = gravityWellsRef.current;
            for (let wi = 0; wi < wells.length; wi++) {
              const well = wells[wi];
              const wdx = well.x - rect.centerX;
              const wdy = well.y - rect.centerY;
              const wDist = Math.max(Math.hypot(wdx, wdy), 1);
              if (wDist < 300) {
                const isSolar = weather.stage === 'solar';
                const stormMul = weather.stage === 'storm' ? 1.5 : 1;
                if (wDist < 25) {
                  // Slingshot eject — strong push away
                  const ejectForce = 6 * dt * stormMul;
                  body.vx -= (wdx / wDist) * ejectForce;
                  body.vy -= (wdy / wDist) * ejectForce;
                  // Phase 3: count items sucked into well
                  const aD = achievementDataRef.current;
                  if (!aD.wellAttracted) aD.wellAttracted = new Set();
                  aD.wellAttracted.add(id);
                  if (aD.wellAttracted.size >= 3) advanceAchievement('well_attract_3');
                } else {
                  const strength = well.strength * stormMul / (wDist * wDist);
                  const dir = isSolar ? -1 : 1; // solar = push instead of pull
                  body.vx += dir * (wdx / wDist) * strength * dt;
                  body.vy += dir * (wdy / wDist) * strength * dt;
                }
              }
            }

            if (dragging && playgroundDragRef.current?.engaged) {
              const drag = playgroundDragRef.current;
              const grabPoint = getPlaygroundBodyViewportPoint(body, drag.grabLocalX, drag.grabLocalY);
              const rX = grabPoint.x - rect.centerX;
              const rY = grabPoint.y - rect.centerY;
              const pointVelX = body.vx - body.spin * rY;
              const pointVelY = body.vy + body.spin * rX;
              const errorX = playgroundPointerRef.current.x - grabPoint.x;
              const errorY = playgroundPointerRef.current.y - grabPoint.y;
              const targetVelX = playgroundPointerRef.current.vx + errorX * PLAYGROUND_DRAG_STIFFNESS;
              const targetVelY = playgroundPointerRef.current.vy + errorY * PLAYGROUND_DRAG_STIFFNESS;
              const correctionX = (targetVelX - pointVelX) * PLAYGROUND_DRAG_DAMPING * dt;
              const correctionY = (targetVelY - pointVelY) * PLAYGROUND_DRAG_DAMPING * dt;
              body.vx += correctionX;
              body.vy += correctionY;
              body.spin += crossProduct(rX, rY, correctionX, correctionY) * body.invInertia * PLAYGROUND_DRAG_TORQUE;
              body.sleeping = false;
              body.sleepFrames = 0;
            }

            const damping = (hasMod('zero_friction') ? Math.min(body.linearDamping + 0.006, 0.9985) : body.linearDamping) * (weatherMods?.frictionMul ?? 1) * (voidMods?.dragMul ?? 1);
            body.vx *= Math.pow(damping, dt);
            body.vy *= Math.pow(damping, dt);
            body.spin *= Math.pow(body.angularDamping, dt);
            if (hasMod('hyper_spin')) body.spin += (Math.random() - 0.5) * 0.04 * dt;

            const speed = Math.hypot(body.vx, body.vy);
            const maxSpeed = (body.maxSpeed ?? PLAYGROUND_MAX_TRAVEL_SPEED) * (voidMods?.maxSpeedMul ?? 1);
            if (speed > maxSpeed) {
              body.vx *= maxSpeed / speed;
              body.vy *= maxSpeed / speed;
            }
            body.spin = clampNumber(body.spin, -PLAYGROUND_MAX_ANGULAR_SPEED, PLAYGROUND_MAX_ANGULAR_SPEED);

            if (Math.abs(body.vx) < 0.01) body.vx = 0;
            if (Math.abs(body.vy) < 0.01) body.vy = 0;
            if (Math.abs(body.spin) < 0.00015) body.spin = 0;

            body.x += body.vx * dt;
            body.y += body.vy * dt;
            body.angle += body.spin * dt;

            // Phase 2: Portal teleportation
            const pPairs = portalPairsRef.current;
            if (pPairs.length > 0 && !body.pinned) {
              const pRect = getPlaygroundBodyViewportRect(body);
              const pcx = pRect.centerX, pcy = pRect.centerY;
              const cooldownKey = id;
              const cooldownTime = portalCooldownRef.current[cooldownKey] || 0;
              if (now - cooldownTime > 200) {
                for (let pi = 0; pi < pPairs.length; pi++) {
                  const pair = pPairs[pi];
                  const PORTAL_RADIUS = 35;
                  const distA = Math.hypot(pcx - pair.a.x, pcy - pair.a.y);
                  const distB = Math.hypot(pcx - pair.b.x, pcy - pair.b.y);
                  if (distA < PORTAL_RADIUS) {
                    body.x += pair.b.x - pair.a.x;
                    body.y += pair.b.y - pair.a.y;
                    portalCooldownRef.current[cooldownKey] = now;
                    collection.onPortalTraversal();
                    break;
                  } else if (distB < PORTAL_RADIUS) {
                    body.x += pair.a.x - pair.b.x;
                    body.y += pair.a.y - pair.b.y;
                    portalCooldownRef.current[cooldownKey] = now;
                    collection.onPortalTraversal();
                    break;
                  }
                }
              }
            }
          }

          if (body.fixed) {
            const nextRect = getPlaygroundBodyViewportRect(body);
            const nextLeft = nextRect.left;
            const nextTop = nextRect.top;
            const canEscape = id.startsWith('spawn-') && body.escapeArmed;
            const escapePaddingX = body.width * 0.75;
            const escapePaddingY = body.height * 0.75;
            const fullyOutside = nextLeft + body.width < -escapePaddingX
              || nextLeft > window.innerWidth + escapePaddingX
              || nextTop + body.height < -escapePaddingY
              || nextTop > window.innerHeight + escapePaddingY;
            if (canEscape && fullyOutside) {
              despawnPlaygroundToy(id);
              return;
            }
            let impacted = false;
            if (!(canEscape && nextLeft < 12 && body.vx < 0) && nextLeft < 12) {
              body.x += 12 - nextLeft;
              body.vx = Math.abs(body.vx) * 0.65;
              body.spin += body.vy * 0.003;
              body.escapeArmed = false;
              body.sleeping = false;
              body.sleepFrames = 0;
              impacted = true;
            }
            if (!(canEscape && nextLeft + body.width > window.innerWidth - 12 && body.vx > 0) && nextLeft + body.width > window.innerWidth - 12) {
              body.x -= (nextLeft + body.width) - (window.innerWidth - 12);
              body.vx = -Math.abs(body.vx) * 0.65;
              body.spin -= body.vy * 0.003;
              body.escapeArmed = false;
              body.sleeping = false;
              body.sleepFrames = 0;
              impacted = true;
            }
            if (!(canEscape && nextTop < 12 && body.vy < 0) && nextTop < 12) {
              body.y += 12 - nextTop;
              body.vy = Math.abs(body.vy) * 0.65;
              body.spin += body.vx * 0.003;
              body.escapeArmed = false;
              body.sleeping = false;
              body.sleepFrames = 0;
              impacted = true;
            }
            if (!(canEscape && nextTop + body.height > window.innerHeight - 12 && body.vy > 0) && nextTop + body.height > window.innerHeight - 12) {
              body.y -= (nextTop + body.height) - (window.innerHeight - 12);
              body.vy = -Math.abs(body.vy) * 0.65;
              body.spin += body.vx * 0.003;
              body.escapeArmed = false;
              body.sleeping = false;
              body.sleepFrames = 0;
              impacted = true;
            }

            if (impacted && now - playgroundCollisionGateRef.current > 90) {
              playgroundCollisionGateRef.current = now;
              spawnImpactBurst(
                Math.min(Math.max(nextRect.centerX, 24), window.innerWidth - 24),
                Math.min(Math.max(nextRect.centerY, 24), window.innerHeight - 24),
                1,
              );
              playPlaygroundSound('impact');
              setPlaygroundStats(prev => ({ ...prev, collisions: prev.collisions + 1 }));
            }
          }

          if (dragging || body.orbit || body.pinned) {
            body.sleeping = false;
            body.sleepFrames = 0;
          } else if (Math.hypot(body.vx, body.vy) < PLAYGROUND_SLEEP_LINEAR_THRESHOLD && Math.abs(body.spin) < PLAYGROUND_SLEEP_ANGULAR_THRESHOLD) {
            body.sleepFrames += 1;
            if (body.sleepFrames >= PLAYGROUND_SLEEP_FRAMES) {
              body.sleeping = true;
              body.vx = 0;
              body.vy = 0;
              body.spin = 0;
            }
          } else {
            body.sleeping = false;
            body.sleepFrames = 0;
          }
        });

        const bodyById = new Map();
        const broadphaseGrid = new Map();
        const candidatePairs = new Set();
        const contactCache = playgroundContactCacheRef.current;
        const touchedContacts = new Set();

        bodies.forEach((item) => {
          const rect = getPlaygroundBodyViewportRect(item.body);
          const halfExtent = Math.hypot(item.body.width, item.body.height) * 0.5;
          item.currentRect = rect;
          bodyById.set(item.id, item);

          const minCellX = Math.floor((rect.centerX - halfExtent) / PLAYGROUND_BROADPHASE_CELL_SIZE);
          const maxCellX = Math.floor((rect.centerX + halfExtent) / PLAYGROUND_BROADPHASE_CELL_SIZE);
          const minCellY = Math.floor((rect.centerY - halfExtent) / PLAYGROUND_BROADPHASE_CELL_SIZE);
          const maxCellY = Math.floor((rect.centerY + halfExtent) / PLAYGROUND_BROADPHASE_CELL_SIZE);

          for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
            for (let cellY = minCellY; cellY <= maxCellY; cellY++) {
              const cellKey = `${cellX}:${cellY}`;
              const occupants = broadphaseGrid.get(cellKey) ?? [];
              occupants.forEach((otherId) => candidatePairs.add(getPlaygroundPairKey(item.id, otherId)));
              occupants.push(item.id);
              broadphaseGrid.set(cellKey, occupants);
            }
          }
        });

        candidatePairs.forEach((pairKey) => {
          const [aId, bId] = pairKey.split('::');
          const a = bodyById.get(aId);
          const b = bodyById.get(bId);
          if (!a || !b) return;

          const aRect = a.currentRect ?? getPlaygroundBodyViewportRect(a.body);
          const bRect = b.currentRect ?? getPlaygroundBodyViewportRect(b.body);
          const dx = bRect.centerX - aRect.centerX;
          const dy = bRect.centerY - aRect.centerY;
          const radiusLimit = (Math.hypot(a.body.width, a.body.height) + Math.hypot(b.body.width, b.body.height)) * 0.55;
          if ((dx * dx) + (dy * dy) > radiusLimit * radiusLimit) return;

          const collision = getObbCollisionData(
            { centerX: aRect.centerX, centerY: aRect.centerY, width: a.body.width, height: a.body.height, angle: a.body.angle },
            { centerX: bRect.centerX, centerY: bRect.centerY, width: b.body.width, height: b.body.height, angle: b.body.angle },
          );
          if (!collision) return;

          const aIsCrate = a.id.startsWith('crate-');
          const bIsCrate = b.id.startsWith('crate-');
          if (aIsCrate || bIsCrate) {
            const crateItem = aIsCrate ? a : b;
            const crateData = playgroundCratesRef.current.find(c => c.id === crateItem.id);
            if (crateData && now - (crateData._lastHit || 0) > 300) {
              crateData._lastHit = now;
              activateModifier(crateData.modifier, crateItem.id);
            }
            return;
          }

          if (hasMod('phantom_mode')) return;

          const invMassA = a.body.pinned ? 0 : a.body.invMass;
          const invMassB = b.body.pinned ? 0 : b.body.invMass;
          const invInertiaA = a.body.pinned ? 0 : a.body.invInertia;
          const invInertiaB = b.body.pinned ? 0 : b.body.invInertia;
          const invMassSum = invMassA + invMassB;
          if (invMassSum <= 0) return;

          const correctionMagnitude = Math.max(collision.depth - PLAYGROUND_POSITIONAL_SLOP, 0) / invMassSum * PLAYGROUND_POSITIONAL_CORRECTION;
          const correctionX = collision.normalX * correctionMagnitude;
          const correctionY = collision.normalY * correctionMagnitude;

          if (!a.body.pinned) {
            a.body.x -= correctionX * invMassA;
            a.body.y -= correctionY * invMassA;
          }
          if (!b.body.pinned) {
            b.body.x += correctionX * invMassB;
            b.body.y += correctionY * invMassB;
          }

          const updatedARect = getPlaygroundBodyViewportRect(a.body);
          const updatedBRect = getPlaygroundBodyViewportRect(b.body);
          const rAx = collision.contactX - updatedARect.centerX;
          const rAy = collision.contactY - updatedARect.centerY;
          const rBx = collision.contactX - updatedBRect.centerX;
          const rBy = collision.contactY - updatedBRect.centerY;

          const cachedContact = contactCache.get(pairKey);
          if (cachedContact && now - cachedContact.updatedAt <= PLAYGROUND_CONTACT_CACHE_TTL) {
            const normalAlignment = dotProduct(cachedContact.normalX, cachedContact.normalY, collision.normalX, collision.normalY);
            if (normalAlignment > 0.55) {
              const warmImpulseX = (cachedContact.normalImpulseX + cachedContact.frictionImpulseX) * PLAYGROUND_WARM_START_SCALE;
              const warmImpulseY = (cachedContact.normalImpulseY + cachedContact.frictionImpulseY) * PLAYGROUND_WARM_START_SCALE;
              if (!a.body.pinned) {
                a.body.vx -= warmImpulseX * invMassA;
                a.body.vy -= warmImpulseY * invMassA;
                a.body.spin -= crossProduct(rAx, rAy, warmImpulseX, warmImpulseY) * invInertiaA;
              }
              if (!b.body.pinned) {
                b.body.vx += warmImpulseX * invMassB;
                b.body.vy += warmImpulseY * invMassB;
                b.body.spin += crossProduct(rBx, rBy, warmImpulseX, warmImpulseY) * invInertiaB;
              }
            }
          }

          const velAX = a.body.vx - a.body.spin * rAy;
          const velAY = a.body.vy + a.body.spin * rAx;
          const velBX = b.body.vx - b.body.spin * rBy;
          const velBY = b.body.vy + b.body.spin * rBx;
          const relVelX = velBX - velAX;
          const relVelY = velBY - velAY;
          const velAlongNormal = dotProduct(relVelX, relVelY, collision.normalX, collision.normalY);

          let normalImpulseX = 0;
          let normalImpulseY = 0;
          let frictionImpulseX = 0;
          let frictionImpulseY = 0;

            const pairImpactBoost = ((a.body.impactBoost ?? 1) + (b.body.impactBoost ?? 1)) * 0.5;
            const pairSpinBoost = ((a.body.impactSpinBoost ?? 1) + (b.body.impactSpinBoost ?? 1)) * 0.5;
            const burstScale = hasMod('explosive_touch') ? 2.5 : Math.max(a.body.impactBurstScale ?? 1, b.body.impactBurstScale ?? 1);

            if (velAlongNormal < 0) {
            const normalCrossA = crossProduct(rAx, rAy, collision.normalX, collision.normalY);
            const normalCrossB = crossProduct(rBx, rBy, collision.normalX, collision.normalY);
            const denom = invMassSum + (normalCrossA * normalCrossA * invInertiaA) + (normalCrossB * normalCrossB * invInertiaB);
            if (denom > 0.00001) {
                const baseRestitution = ((a.body.restitution ?? 0.2) + (b.body.restitution ?? 0.2)) * 0.5;
                const restitution = clampNumber(baseRestitution * pairImpactBoost * (hasMod('mega_bounce') ? 2.35 : 1), 0.06, 0.96);
                const explosiveMul = (hasMod('explosive_touch') ? 1.85 : 1) * pairImpactBoost * (chaosEffects?.collisionImpulseMul ?? 1);
              const impulseScalar = (-(1 + restitution) * velAlongNormal / denom) * explosiveMul;
              normalImpulseX = collision.normalX * impulseScalar;
              normalImpulseY = collision.normalY * impulseScalar;

              if (!a.body.pinned) {
                a.body.vx -= normalImpulseX * invMassA;
                a.body.vy -= normalImpulseY * invMassA;
                  a.body.spin -= crossProduct(rAx, rAy, normalImpulseX, normalImpulseY) * invInertiaA * pairSpinBoost;
              }
              if (!b.body.pinned) {
                b.body.vx += normalImpulseX * invMassB;
                b.body.vy += normalImpulseY * invMassB;
                  b.body.spin += crossProduct(rBx, rBy, normalImpulseX, normalImpulseY) * invInertiaB * pairSpinBoost;
              }

              const tangentRawX = relVelX - (collision.normalX * velAlongNormal);
              const tangentRawY = relVelY - (collision.normalY * velAlongNormal);
              const tangent = normalizeVector(tangentRawX, tangentRawY);
              if (tangent.length > 0.0001) {
                const tangentCrossA = crossProduct(rAx, rAy, tangent.x, tangent.y);
                const tangentCrossB = crossProduct(rBx, rBy, tangent.x, tangent.y);
                const tangentDenom = invMassSum + (tangentCrossA * tangentCrossA * invInertiaA) + (tangentCrossB * tangentCrossB * invInertiaB);
                if (tangentDenom > 0.00001) {
                  let frictionScalar = -dotProduct(relVelX, relVelY, tangent.x, tangent.y) / tangentDenom;
                  const frictionLimit = impulseScalar * Math.sqrt(a.body.surfaceFriction * b.body.surfaceFriction);
                  frictionScalar = clampNumber(frictionScalar, -frictionLimit, frictionLimit);
                  frictionImpulseX = tangent.x * frictionScalar;
                  frictionImpulseY = tangent.y * frictionScalar;

                  if (!a.body.pinned) {
                    a.body.vx -= frictionImpulseX * invMassA;
                    a.body.vy -= frictionImpulseY * invMassA;
                      a.body.spin -= crossProduct(rAx, rAy, frictionImpulseX, frictionImpulseY) * invInertiaA * pairSpinBoost;
                  }
                  if (!b.body.pinned) {
                    b.body.vx += frictionImpulseX * invMassB;
                    b.body.vy += frictionImpulseY * invMassB;
                      b.body.spin += crossProduct(rBx, rBy, frictionImpulseX, frictionImpulseY) * invInertiaB * pairSpinBoost;
                  }
                }
              }
            }
          }

          contactCache.set(pairKey, {
            updatedAt: now,
            normalX: collision.normalX,
            normalY: collision.normalY,
            normalImpulseX,
            normalImpulseY,
            frictionImpulseX,
            frictionImpulseY,
          });
          touchedContacts.add(pairKey);

          a.body.sleeping = false;
          a.body.sleepFrames = 0;
          b.body.sleeping = false;
          b.body.sleepFrames = 0;

            if (now - playgroundCollisionGateRef.current > 90) {
            playgroundCollisionGateRef.current = now;
            const mx = collision.contactX;
            const my = collision.contactY;
              spawnImpactBurst(mx, my, burstScale);
            playPlaygroundSound('impact');
            const scoreAdd = hasMod('score_surge') ? 5 : 1;
            setPlaygroundStats(prev => ({ ...prev, collisions: prev.collisions + scoreAdd }));
            collection.onCollision(a.id, b.id, playgroundBodiesRef.current);
            collection.onLifetimeCollision();
            // Phase 3: Track collisions for achievement chain
            const aData = achievementDataRef.current;
            aData.collisionsIn5s.push(now);
            aData.collisionsIn5s = aData.collisionsIn5s.filter(t => now - t < 5000);
            if (aData.collisionsIn5s.length >= 10) advanceAchievement('ten_collisions_5s');
            const bossHit = bosses.hitBoss(mx, my);
            if (bossHit && bossHit !== 'hit') {
              collection.onBossDefeated(bossHit);
              collection.onLifetimeBossDefeat();
              advanceAchievement('boss_defeated');
            }
            if (hasMod('clone_storm') && Math.random() < 0.35) {
              const toyCount = Object.keys(playgroundBodiesRef.current).filter(k => k.startsWith('spawn-')).length;
              if (toyCount < 8) spawnPlaygroundToy(mx, my);
            }
          }
        });

        contactCache.forEach((entry, key) => {
          if (!touchedContacts.has(key) && now - entry.updatedAt > PLAYGROUND_CONTACT_CACHE_TTL) {
            contactCache.delete(key);
          }
        });
      }

      // Phase 2: Gravity well collectible check
      if (gravityWellsRef.current.length >= 3) {
        let caughtInWells = 0;
        bodies.forEach(({ body }) => {
          if (body.pinned || body.sleeping) return;
          const bRect = getPlaygroundBodyViewportRect(body);
          for (const well of gravityWellsRef.current) {
            if (Math.hypot(bRect.centerX - well.x, bRect.centerY - well.y) < 300) { caughtInWells++; break; }
          }
        });
        collection.onGravityWellCheck(gravityWellsRef.current.length, caughtInWells);
      }

      /* ─── Phase 3: Toy Fusion detection ─── */
      const orbitingToys = bodies.filter(b => b.body.orbit && b.id.startsWith('spawn-'));
      const overlapMap = fusionOverlapRef.current;
      const touchedOverlaps = new Set();
      for (let fi = 0; fi < orbitingToys.length; fi++) {
        for (let fj = fi + 1; fj < orbitingToys.length; fj++) {
          const ta = orbitingToys[fi], tb = orbitingToys[fj];
          const ra = getPlaygroundBodyViewportRect(ta.body);
          const rb = getPlaygroundBodyViewportRect(tb.body);
          const dist = Math.hypot(ra.centerX - rb.centerX, ra.centerY - rb.centerY);
          const overlapThreshold = (ta.body.width + tb.body.width) * 0.35;
          const key = ta.id < tb.id ? `${ta.id}|${tb.id}` : `${tb.id}|${ta.id}`;
          touchedOverlaps.add(key);
          if (dist < overlapThreshold) {
            if (!overlapMap[key]) overlapMap[key] = now;
            else if (now - overlapMap[key] >= 500) {
              // Fuse! Find spawn data for both
              const spawnA = playgroundSpawns.find(s => s.id === ta.id);
              const spawnB = playgroundSpawns.find(s => s.id === tb.id);
              if (spawnA && spawnB) {
                const fusionKey = getFusionKey(spawnA.kind, spawnB.kind);
                const recipe = FUSION_RECIPES[fusionKey];
                const fusedTemplate = recipe || { kind: 'fused', label: 'ALLOY', body: 'Unknown Fusion', accent: '#94a3b8', gradient: 'linear-gradient(135deg, #94a3b8, #64748b)' };
                // Remove both toys, spawn fused toy at midpoint
                const mx = (ra.centerX + rb.centerX) / 2;
                const my = (ra.centerY + rb.centerY) / 2;
                despawnPlaygroundToy(ta.id);
                despawnPlaygroundToy(tb.id);
                // Spawn the fused toy
                const fusedId = `spawn-${++playgroundSpawnIdRef.current}`;
                playgroundBodiesRef.current[fusedId] = {
                  x: mx - 80, y: my - 45, vx: 0, vy: -1,
                  angle: 0, spin: 0.02,
                  pinned: false, orbit: false,
                  orbitAngle: Math.random() * Math.PI * 2, orbitRadius: 100,
                  fixed: true, baseX: 0, baseY: 0,
                  width: 160, height: 95, escapeArmed: false,
                  mass: 2.5, // heavier
                };
                applyPlaygroundBodyMaterial(fusedId, playgroundBodiesRef.current[fusedId]);
                setPlaygroundSpawns(prev => [...prev, { id: fusedId, ...fusedTemplate, _fused: true, _spawnTime: Date.now() }]);
                spawnImpactBurst(mx, my, 2.0);
                fusionCountRef.current++;
                collection.onToyFusion(recipe || 'Alloy');
                dailySeed.updateDailyProgress('fuse', 1);
                delete overlapMap[key];
              }
              break;
            }
          } else {
            delete overlapMap[key];
          }
        }
      }
      // Clean stale overlaps
      for (const k in overlapMap) {
        if (!touchedOverlaps.has(k)) delete overlapMap[k];
      }

      /* ─── Phase 2: Arena Mutations ─── */
      const mutation = arenaMutationRef.current;
      if (mutation && dt > 0) {
        const elapsed = now - mutation.startTime;
        if (elapsed > mutation.duration) {
          arenaMutationRef.current = null;
          setArenaMutation(null);
          arenaMutationCooldownRef.current = now;
          collection.onArenaMutationSurvived();
          dailySeed.updateDailyProgress('mutation', 1);
        } else {
          const progress = elapsed / mutation.duration;
          const activeBodies = bodies.filter(b => !b.body.sleeping || mutation.type === 'earthquake');

          switch (mutation.type) {
            case 'earthquake':
              // Wake all sleeping bodies, apply random impulse (strongest at start)
              if (progress < 0.1) {
                bodies.forEach(({ body }) => {
                  body.sleeping = false;
                  body.sleepFrames = 0;
                  if (!body.pinned) {
                    body.vx += (Math.random() - 0.5) * 4;
                    body.vy += (Math.random() - 0.5) * 4;
                  }
                });
              } else {
                bodies.forEach(({ body }) => {
                  if (!body.pinned && !body.sleeping) {
                    body.vx += (Math.random() - 0.5) * 1.5 * (1 - progress) * dt;
                    body.vy += (Math.random() - 0.5) * 1.5 * (1 - progress) * dt;
                  }
                });
              }
              break;
            case 'solar_flare':
              // Radial push from center
              activeBodies.forEach(({ body }) => {
                if (body.pinned) return;
                const r = getPlaygroundBodyViewportRect(body);
                const fdx = r.centerX - coreX;
                const fdy = r.centerY - coreY;
                const fDist = Math.max(Math.hypot(fdx, fdy), 1);
                const pushForce = 2.5 * (1 - progress * 0.7) * dt;
                body.vx += (fdx / fDist) * pushForce;
                body.vy += (fdy / fDist) * pushForce;
              });
              break;
            case 'data_corruption':
              // Swap body positions at the start (once)
              if (!mutation._swapped) {
                mutation._swapped = true;
                const swappable = activeBodies.filter(b => !b.body.pinned && !b.body.orbit);
                const count = Math.min(swappable.length, 6);
                for (let si = 0; si < count - 1; si += 2) {
                  const a = swappable[si].body, b = swappable[si + 1].body;
                  const tmpX = a.x, tmpY = a.y;
                  a.x = b.x; a.y = b.y;
                  b.x = tmpX; b.y = tmpY;
                }
              }
              break;
            case 'magnetic_storm':
              // Pairwise body attraction
              for (let ai = 0; ai < activeBodies.length; ai++) {
                const ab = activeBodies[ai].body;
                if (ab.pinned) continue;
                const ar = getPlaygroundBodyViewportRect(ab);
                for (let bi = ai + 1; bi < activeBodies.length; bi++) {
                  const bb = activeBodies[bi].body;
                  if (bb.pinned) continue;
                  const br = getPlaygroundBodyViewportRect(bb);
                  const mdx = br.centerX - ar.centerX;
                  const mdy = br.centerY - ar.centerY;
                  const mDist = Math.max(Math.hypot(mdx, mdy), 30);
                  if (mDist < 400) {
                    const pull = 0.15 * dt * (1 - mDist / 400);
                    ab.vx += (mdx / mDist) * pull;
                    ab.vy += (mdy / mDist) * pull;
                    bb.vx -= (mdx / mDist) * pull;
                    bb.vy -= (mdy / mDist) * pull;
                  }
                }
              }
              break;
          }
        }
      }

      bodies.forEach(({ id, node, body }) => {
        const dragging = playgroundDragRef.current?.id === id;
        node.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) rotate(${body.angle}rad) scale(${dragging ? 1.03 : body.pinned ? 1.02 : 1})`;
        node.style.zIndex = dragging ? '90' : body.orbit ? '80' : body.pinned ? '70' : (id.startsWith('spawn-') || id.startsWith('crate-')) ? '66' : '40';
        node.style.cursor = dragging ? 'grabbing' : 'grab';
        node.style.boxShadow = body.orbit ? '0 0 36px rgba(88,164,176,0.16)' : body.pinned ? '0 0 0 1px rgba(52,211,153,0.55)' : '';
        node.style.filter = body.orbit ? 'drop-shadow(0 0 20px rgba(88,164,176,0.35))' : body.pinned ? 'drop-shadow(0 0 12px rgba(52,211,153,0.18))' : '';
      });

      // Check deadlock orb resolution
      const deadlockResult = bosses.checkDeadlockOrbs();
      if (deadlockResult) { collection.onBossDefeated(deadlockResult); collection.onLifetimeBossDefeat(); }

      // Phase 4: Ghost replay — record positions, advance playback
      ghostReplay.recordFrame(playgroundBodiesRef.current);
      ghostReplay.replayFrame();

      playgroundRafRef.current = requestAnimationFrame(step);
    };
    playgroundRafRef.current = requestAnimationFrame(step);
    return () => {
      if (playgroundRafRef.current) cancelAnimationFrame(playgroundRafRef.current);
    };
  }, [activateModifier, bosses, collection, createPlaygroundBody, despawnPlaygroundToy, getPlaygroundBodyViewportPoint, getPlaygroundBodyViewportRect, hasModifier, isPlaygroundItemId, playgroundForceMode, playgroundGravityMode, playgroundMode, playgroundPaused, playgroundSlowMo, playPlaygroundSound, spawnImpactBurst, spawnPlaygroundToy, syncPlaygroundBodyNodeMetrics, voidDim, weather]);

  /* ─── Phase 2: Arena Mutation scheduler ─── */
  useEffect(() => {
    if (!playgroundMode) {
      if (arenaMutationTimerRef.current) clearTimeout(arenaMutationTimerRef.current);
      arenaMutationRef.current = null;
      setArenaMutation(null);
      return;
    }
    const MUTATION_TYPES = [
      { type: 'earthquake',      name: 'EARTHQUAKE',      duration: 6000 },
      { type: 'solar_flare',     name: 'SOLAR FLARE',     duration: 7000 },
      { type: 'data_corruption', name: 'DATA CORRUPTION', duration: 5000 },
      { type: 'magnetic_storm',  name: 'MAGNETIC STORM',  duration: 8000 },
    ];
    const scheduleMutation = () => {
      const delay = 90000 + Math.random() * 60000; // 90-150s
      arenaMutationTimerRef.current = setTimeout(() => {
        if (!arenaMutationRef.current) {
          const mt = MUTATION_TYPES[Math.floor(Math.random() * MUTATION_TYPES.length)];
          const m = { ...mt, startTime: performance.now() };
          arenaMutationRef.current = m;
          setArenaMutation(m);
        }
        scheduleMutation();
      }, delay);
    };
    scheduleMutation();
    return () => {
      if (arenaMutationTimerRef.current) clearTimeout(arenaMutationTimerRef.current);
    };
  }, [playgroundMode]);

  const explodePlaygroundItems = useCallback(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.45;
    Object.entries(playgroundBodiesRef.current).forEach(([id, physicsBody]) => {
      if (!physicsBody || !isPlaygroundItemId(id)) return;
      const rect = getPlaygroundBodyViewportRect(physicsBody);
      const dx = rect.centerX - centerX;
      const dy = rect.centerY - centerY;
      const dist = Math.max(Math.hypot(dx, dy), 1);
      physicsBody.pinned = false;
      physicsBody.orbit = false;
      physicsBody.sleeping = false;
      physicsBody.sleepFrames = 0;
      physicsBody.vx = (dx / dist) * (4 + Math.random() * 5);
      physicsBody.vy = (dy / dist) * (3.5 + Math.random() * 4.5);
      physicsBody.spin = (Math.random() - 0.5) * 0.1;
    });
    syncPlaygroundMeta();
    spawnImpactBurst(centerX, centerY, 1.6);
    playPlaygroundSound('explode');
  }, [getPlaygroundBodyViewportRect, isPlaygroundItemId, playPlaygroundSound, spawnImpactBurst, syncPlaygroundMeta]);

  const shufflePlaygroundItems = useCallback(() => {
    Object.entries(playgroundBodiesRef.current).forEach(([id, body]) => {
      if (!isPlaygroundItemId(id) || !body) return;
      body.pinned = false;
      body.orbit = false;
      body.sleeping = false;
      body.sleepFrames = 0;
      body.x += (Math.random() - 0.5) * 180;
      body.y += (Math.random() - 0.5) * 120;
      body.vx = (Math.random() - 0.5) * 3;
      body.vy = (Math.random() - 0.5) * 3;
      body.spin = (Math.random() - 0.5) * 0.06;
    });
    syncPlaygroundMeta();
  }, [isPlaygroundItemId, syncPlaygroundMeta]);

  const stackPlaygroundItems = useCallback(() => {
    const entries = Object.entries(playgroundBodiesRef.current).filter(([id, body]) => body && isPlaygroundItemId(id));
    const cols = window.innerWidth < 900 ? 2 : 4;
    entries.forEach(([, physicsBody], index) => {
      const rect = getPlaygroundBodyViewportRect(physicsBody);
      const row = Math.floor(index / cols);
      const col = index % cols;
      const targetX = 120 + (col * 190);
      const targetY = 120 + (row * 132);
      const currentX = rect.centerX;
      const currentY = rect.centerY;
      physicsBody.pinned = false;
      physicsBody.orbit = false;
      physicsBody.sleeping = false;
      physicsBody.sleepFrames = 0;
      physicsBody.vx = 0;
      physicsBody.vy = 0;
      physicsBody.spin = 0;
      physicsBody.angle = 0;
      physicsBody.x += targetX - currentX;
      physicsBody.y += targetY - currentY;
    });
    syncPlaygroundMeta();
  }, [getPlaygroundBodyViewportRect, isPlaygroundItemId, syncPlaygroundMeta]);

  const chaosRain = useCallback(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.42;
    explodePlaygroundItems();
    spawnPlaygroundToy(centerX - 96, centerY - 42);
    spawnPlaygroundToy(centerX + 96, centerY - 10);
    spawnPlaygroundToy(centerX, centerY + 68);
    setPlaygroundForceMode('repel');
    collection.onRepelActivated();
    collection.onChaosRain();
    if (playgroundForceTimeoutRef.current) clearTimeout(playgroundForceTimeoutRef.current);
    playgroundForceTimeoutRef.current = setTimeout(() => setPlaygroundForceMode('none'), 3500);
  }, [collection, explodePlaygroundItems, spawnPlaygroundToy]);

  const handlePlaygroundSurfaceClick = useCallback((event) => {
    if (!playgroundMode || playgroundDragRef.current) return;
    const target = event.target;
    if (target.closest('[data-playground-control], [data-playground-item], button, input, textarea, a, label, kbd')) return;

    // Phase 2: Portal placement mode
    if (portalPlacementMode) {
      const px = event.clientX, py = event.clientY;
      if (portalPendingRef.current) {
        // Second click - complete the pair
        const a = portalPendingRef.current;
        const dist = Math.hypot(px - a.x, py - a.y);
        if (dist < 60) return; // too close, ignore
        const newPair = { id: ++portalIdRef.current, a, b: { x: px, y: py } };
        setPortalPairs(prev => {
          const next = [...prev, newPair].slice(-2); // max 2 pairs
          portalPairsRef.current = next;
          return next;
        });
        portalPendingRef.current = null;
        setPortalPlacementMode(false);
        return;
      } else {
        // First click - mark pending
        portalPendingRef.current = { x: px, y: py };
        return;
      }
    }

    // Phase 2: Gravity well placement mode
    if (gravityWellPlacementMode) {
      const wx = event.clientX, wy = event.clientY;
      // Check if clicking near existing well to remove it
      const existingIdx = gravityWellsRef.current.findIndex(w => Math.hypot(wx - w.x, wy - w.y) < 40);
      if (existingIdx >= 0) {
        setGravityWells(prev => {
          const next = prev.filter((_, i) => i !== existingIdx);
          gravityWellsRef.current = next;
          return next;
        });
        return;
      }
      if (gravityWellsRef.current.length >= 3) return; // max 3
      const newWell = { id: ++gravityWellIdRef.current, x: wx, y: wy, strength: 800 };
      setGravityWells(prev => {
        const next = [...prev, newWell];
        gravityWellsRef.current = next;
        return next;
      });
      advanceAchievement('gravity_well_placed');
      return;
    }

    // Boss click (race_condition)
    const bossResult = bosses.clickBoss(event.clientX, event.clientY);
    if (bossResult && bossResult !== 'hit') {
      collection.onBossDefeated(bossResult);
      collection.onLifetimeBossDefeat();
      return;
    }
    // Void entity click
    if (voidDim.inVoid && voidDim.nullEntity) {
      const entityResult = voidDim.hitNullEntity(event.clientX, event.clientY);
      if (entityResult && entityResult !== 'hit') {
        collection.onBossDefeated(entityResult);
        return;
      }
    }
    spawnPlaygroundToy(event.clientX, event.clientY);
  }, [bosses, collection, playgroundMode, spawnPlaygroundToy, voidDim, portalPlacementMode, gravityWellPlacementMode]);

  const getDragStyle = useCallback((id) => {
    if (!playgroundMode || !isPlaygroundItemId(id)) return {};
    return {
      cursor: 'grab',
      userSelect: 'none',
      touchAction: 'none',
      outline: '1px dashed rgba(88,164,176,0.28)',
      outlineOffset: '4px',
      borderRadius: '16px',
      willChange: 'transform',
    };
  }, [isPlaygroundItemId, playgroundMode]);

  const withPlaygroundStyle = useCallback((id, baseStyle = {}) => ({
    ...baseStyle,
    ...getDragStyle(id),
  }), [getDragStyle]);

  const getPlaygroundItemProps = useCallback((id) => {
    if (!playgroundMode || !isPlaygroundItemId(id)) return {};
    return {
      ref: (node) => registerPlaygroundNode(id, node),
      style: getDragStyle(id),
      onMouseDown: (event) => playgroundDragStart(id, event),
      onTouchStart: (event) => playgroundDragStart(id, event),
      onDoubleClick: (event) => togglePlaygroundPin(id, event),
      onClickCapture: (event) => handlePlaygroundItemCapture(id, event),
      onClick: id.startsWith('spawn-') ? (event) => collectPlaygroundToy(id, event) : undefined,
      'data-playground-item': id,
    };
  }, [collectPlaygroundToy, getDragStyle, handlePlaygroundItemCapture, isPlaygroundItemId, playgroundDragStart, playgroundMode, registerPlaygroundNode, togglePlaygroundPin]);

  /* Language showcase carousel - auto-rotate every 3s */
  const LANG_SHOWCASE = useMemo(() => [
    { name: 'TypeScript', color: '#3178c6', snippet: 'const app = express();\napp.get("/", handler);' },
    { name: 'Rust', color: '#dea584', snippet: 'fn main() {\n  println!("blazing fast");\n}' },
    { name: 'Python', color: '#3776ab', snippet: 'async def serve():\n  await uvicorn.run(app)' },
    { name: 'Go', color: '#00ADD8', snippet: 'func main() {\n  http.ListenAndServe()\n}' },
  ], []);
  useEffect(() => {
    const timer = setInterval(() => setLangIndex(prev => (prev + 1) % LANG_SHOWCASE.length), 3000);
    return () => clearInterval(timer);
  }, [LANG_SHOWCASE]);

  /* Magnetic button handler */
  const handleMagneticMove = useCallback((e) => {
    if (playgroundMode) return;
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  }, [playgroundMode]);
  const handleMagneticLeave = useCallback((e) => {
    if (playgroundMode) return;
    e.currentTarget.style.transform = 'translate(0, 0)';
  }, [playgroundMode]);

  /* Before/after slider drag */
  const handleSliderDrag = useCallback((clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => handleSliderDrag(e.touches ? e.touches[0].clientX : e.clientX);
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onUp); };
  }, [isDragging, handleSliderDrag]);

  /* Ambient sound */
  const toggleAmbient = useCallback(() => {
    if (!ambientRef.current) {
      ambientRef.current = new Audio('data:audio/wav;base64,UklGRl9vT19teleVJaw==');
      // We'll use the Web Audio API for a generated hum instead
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 85;
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      // Add a second oscillator for texture
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 127.5;
      const gain2 = ctx.createGain();
      gain2.gain.value = 0;
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      ambientRef.current = { ctx, gains: [gain, gain2] };
    }
    const { gains } = ambientRef.current;
    if (ambientOn) {
      gains.forEach(g => g.gain.linearRampToValueAtTime(0, g.context.currentTime + 0.5));
    } else {
      gains[0].gain.linearRampToValueAtTime(0.015, gains[0].context.currentTime + 0.5);
      gains[1].gain.linearRampToValueAtTime(0.008, gains[1].context.currentTime + 0.5);
    }
    setAmbientOn(!ambientOn);
  }, [ambientOn]);

  /* Section nav dot click handler */
  const scrollToSection = useCallback((id) => {
    const refs = { hero: heroRef, business: businessRef, features: featuresRef, comparison: comparisonRef, roadmap: roadmapRef, faq: faqRef };
    refs[id]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  /* Editor event handlers */
  const handleEditorChange = (e) => {
    const val = e.target.value;
    setEditorCode(val);
    setIsEditorActive(true);
    setShowAiSuggestion(false);
    if (typingRef.current) { clearInterval(typingRef.current); typingRef.current = null; setGhostTypingDone(true); }
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    aiTimeoutRef.current = setTimeout(() => { if (val.trim().length > 10) setShowAiSuggestion(true); }, 1500);
  };

  const handleEditorFocus = () => {
    if (!ghostTypingDone) {
      if (typingRef.current) clearInterval(typingRef.current);
      setEditorCode(INITIAL_CODE);
      setGhostTypingDone(true);
      if (window.innerWidth >= 768) {
        setTimeout(() => setShowAiSuggestion(true), 400);
      }
    }
    setIsEditorActive(true);
  };

  /* Render syntax-highlighted code */
  const renderHighlightedCode = () => {
    return editorLines.map((line, i) => (
      <div key={i} className="flex">
        <span className="w-8 text-right text-slate-600 select-none flex-shrink-0 pr-3">{i + 1}</span>
        <span>{line.length === 0 ? <span>&nbsp;</span> : tokenizeLine(line).map((t, ti) => (
          <span key={ti} style={{ color: t.c }}>{t.text}</span>
        ))}</span>
      </div>
    ));
  };

  /* Section particle burst - generates 12 teal particles on first visibility */
  const renderBurst = (sectionId, isVisible) => {
    if (!isVisible) return null;
    if (!burstSections.has(sectionId)) {
      // Schedule state update outside render
      setTimeout(() => setBurstSections(prev => new Set(prev).add(sectionId)), 0);
    }
    if (burstSections.has(sectionId)) return null; // already burst, don't render again
    return (
      <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 5 }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const dist = 40 + Math.random() * 40;
          return (
            <div
              key={i}
              className="burst-particle"
              style={{
                left: '50%', top: '50%',
                '--bx': `${Math.cos(angle) * dist}px`,
                '--by': `${Math.sin(angle) * dist}px`,
                animationDelay: `${i * 30}ms`,
              }}
            />
          );
        })}
      </div>
    );
  };

  /* Mouse spotlight handler for bento cards */
  const handleCardMouseMove = (e) => {
    if (playgroundMode) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  /* Pricing Pro card: spotlight + 3D magnetic tilt */
  const handleProCardMouseMove = (e) => {
    if (playgroundMode) return;
    handleCardMouseMove(e);
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -3;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 3;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  const handleProCardMouseLeave = (e) => {
    if (playgroundMode) return;
    e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  };

  /**
   * Typewriter strings for hero
   */
  const firstLine = "Welcome to Vectant.";
  const secondLine = "The world's first ADE."
  /* ---------- Efficient scroll handling (single rAF-driven listener) ---------- */
  useEffect(() => {
    let ticking = false;
    let prevProgressInt = -1;
    const onScroll = () => {
      const y = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          scrollYRef.current = y;
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = scrollHeight > 0 ? (y / scrollHeight) * 100 : 0;

          // Direct DOM updates for parallax layers (no React re-render)
          if (parallaxPlanetRef.current) parallaxPlanetRef.current.style.transform = `translateY(${y * 0.02}px)`;
          if (parallaxStarsRef.current) parallaxStarsRef.current.style.transform = `translateY(${y * 0.05}px)`;
          if (parallaxClustersRef.current) parallaxClustersRef.current.style.transform = `translateY(${y * 0.04}px)`;
          if (parallaxAuroraRef.current) parallaxAuroraRef.current.style.transform = `translateY(${y * 0.03}px)`;
          if (parallaxNebulaRef.current) {
            const m = mousePosRef.current;
            parallaxNebulaRef.current.style.transform = `translateY(${y * 0.08}px) translate(${(m.x - 0.5) * -20}px, ${(m.y - 0.5) * -15}px)`;
          }

          // Direct DOM update for scroll overlay (no re-render)
          if (overlayRef.current) {
            const extra = Math.min((progress / 100) * 0.7, 0.7);
            overlayRef.current.style.background = `linear-gradient(180deg, rgba(0,0,0,${(extra * 0.35).toFixed(3)}) 0%, rgba(0,0,0,${extra.toFixed(3)}) 100%)`;
          }

          // Throttle React re-renders: only update state on integer % change
          const progressInt = Math.round(progress);
          if (progressInt !== prevProgressInt) {
            prevProgressInt = progressInt;
            setScrollProgress(progressInt);
          }

          // Sticky CTA: show after scrolling past hero
          if (progress > 8 && progress < 92) setShowStickyCta(true);
          else setShowStickyCta(false);
          if (featuresRef.current) {
            const rect = featuresRef.current.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
            if (isVisible && !featuresVisible) setFeaturesVisible(true);
          }
          if (businessRef.current) {
            const rect = businessRef.current.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
            if (isVisible && !businessVisible) setBusinessVisible(true);
          }
          if (comparisonRef.current) {
            const rect = comparisonRef.current.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0 && !comparisonVisible) setComparisonVisible(true);
          }
          if (roadmapRef.current) {
            const rect = roadmapRef.current.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0 && !roadmapVisible) setRoadmapVisible(true);
          }
          if (personasRef.current) {
            const rect = personasRef.current.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0 && !personasVisible) setPersonasVisible(true);
          }
          if (statsRef.current) {
            const rect = statsRef.current.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0 && !statsVisible) setStatsVisible(true);
          }
          // Active section detection for nav dots
          const sectionRefs = { hero: heroRef, business: businessRef, features: featuresRef, comparison: comparisonRef, roadmap: roadmapRef, faq: faqRef };
          let current = 'hero';
          for (const [id, ref] of Object.entries(sectionRefs)) {
            if (ref.current) {
              const rect = ref.current.getBoundingClientRect();
              if (rect.top < window.innerHeight * 0.5) current = id;
            }
          }
          setActiveSection(current);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial
    return () => window.removeEventListener("scroll", onScroll);
  }, [featuresVisible]);

  /* ---------- Mount ---------- */
  useEffect(() => {
    setMounted(true);
    fetchWaitlistCount();
  }, []);

  /* ---------- Hero typewriter - starts after boot finishes ---------- */
  useEffect(() => {
    if (bootPhase !== 2) return;
    let i = 0;
    const firstLineInterval = setInterval(() => {
      if (i < firstLine.length) {
        setTypewriterText(firstLine.slice(0, i + 1));
        i++;
      } else {
        clearInterval(firstLineInterval);
        setShowSecondLine(true);
      }
    }, 45);
    return () => clearInterval(firstLineInterval);
  }, [bootPhase]);

  useEffect(() => {
    if (showSecondLine) {
      let j = 0;
      const secondLineInterval = setInterval(() => {
        if (j < secondLine.length) {
          setSecondLineText(secondLine.slice(0, j + 1));
          j++;
        } else {
          clearInterval(secondLineInterval);
          setTypewriterComplete(true);
        }
      }, 45);
      return () => clearInterval(secondLineInterval);
    }
  }, [showSecondLine]);

  /**
   * Waitlist APIs
   */
  const fetchWaitlistCount = async () => {
    try {
      const response = await fetch("/api/waitlist");
      const data = await response.json();
      setWaitlistCount(data.count || 0);
    } catch (error) {
      console.error("Failed to fetch waitlist count:", error);
    }
  };
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const handleSubmit = async (submitEmail) => {
    const targetEmail = (submitEmail || email || "").trim();
    if (!targetEmail) {
      toast.error("Please enter your email");
      return;
    }
    if (!EMAIL_REGEX.test(targetEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    const fetchPromise = fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: targetEmail }),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to join waitlist");
      return data;
    });
    toast.promise(fetchPromise, {
      loading: "Joining waitlist...",
      success: (data) => {
        if (data.message === "Email already on waitlist") return "You're already on the waitlist!";
        setEmail("");
        setWaitlistPosition(data.count || 0);
        setPositionCountUp(0);
        fetchWaitlistCount();
        setShowShareModal(true);
        return "Successfully joined the waitlist!";
      },
      error: (error) => error.message || "Something went wrong. Please try again.",
    });
  };
  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  /* ---------- Overlay opacity: darkens with scroll BUT never pure black ---------- */
  const baseOpacity = 0; // transparent at top
  const extraFromScroll = Math.min((scrollProgress / 100) * 0.7, 0.7); // max 0.7
  const overlayOpacity = Math.min(baseOpacity + extraFromScroll, 0.7);
  const showScrollIndicator = scrollProgress < 3;
  const ALL_OBJECTIVES = useRef((() => {
    const r = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
    return [
      { metric: 'launches',   gen: () => { const t = r(2, 10); return { label: `Launch ${t} objects`, target: t, get: (s, c, sc) => Math.min(s.launches, t) }; } },
      { metric: 'pinned',     gen: () => { const t = r(1, 6);  return { label: `Pin ${t} objects`, target: t, get: (s, c, sc) => Math.min(s.pinned, t) }; } },
      { metric: 'collects',   gen: () => { const t = r(1, 8);  return { label: `Collect ${t} toys`, target: t, get: (s, c, sc) => Math.min(c, t) }; } },
      { metric: 'orbiters',   gen: () => { const t = r(1, 5);  return { label: `Orbit ${t} objects`, target: t, get: (s, c, sc) => Math.min(s.orbiters, t) }; } },
      { metric: 'collisions', gen: () => { const t = r(5, 25); return { label: `${t} collisions`, target: t, get: (s, c, sc) => Math.min(s.collisions, t) }; } },
      { metric: 'spawns',     gen: () => { const t = r(3, 12); return { label: `${t} spawns`, target: t, get: (s, c, sc) => Math.min(s.spawns, t) }; } },
      { metric: 'score',      gen: () => { const t = r(100, 800); return { label: `Score ${t} points`, target: t, get: (s, c, sc) => Math.min(sc, t) }; } },
    ].map(entry => entry.gen());
  })());
  const [objectiveIndices, setObjectiveIndices] = useState([0, 1, 2, 3]);
  useEffect(() => {
    const indices = ALL_OBJECTIVES.current.map((_, i) => i).sort(() => Math.random() - 0.5);
    setObjectiveIndices(indices.slice(0, 4));
  }, []);
  const playgroundObjectives = useMemo(() =>
    objectiveIndices.map(i => {
      const obj = ALL_OBJECTIVES.current[i];
      return {
        label: obj.label,
        value: obj.get(playgroundStats, playgroundCollectibles, playgroundScore),
        target: obj.target,
      };
    })
  , [objectiveIndices, playgroundCollectibles, playgroundStats, playgroundScore]);

  useEffect(() => {
    if (!playgroundMode || playgroundMastered) return;
    if (playgroundObjectives.every((objective) => objective.value >= objective.target)) {
      setPlaygroundMastered(true);
      toast.success('Playground master unlocked.');
    }
  }, [playgroundMastered, playgroundMode, playgroundObjectives]);

  return (
    <div className="relative min-h-screen" onClickCapture={handlePlaygroundSurfaceClick} style={playgroundMode ? { outline: '2px dashed rgba(88,164,176,0.3)', animation: 'playgroundBorder 3s linear infinite' } : undefined}>
      {playgroundMode && (
        <>


          {/* ─── Phase 2: Portal Pairs ─── */}
          {portalPairs.length > 0 && (
            <div className="fixed inset-0 z-[37] pointer-events-none">
              {portalPairs.map(pair => (
                <React.Fragment key={pair.id}>
                  <div className="absolute rounded-full" style={{
                    left: pair.a.x - 18, top: pair.a.y - 18, width: 36, height: 36,
                    border: '2px solid rgba(167,139,250,0.6)',
                    boxShadow: '0 0 20px rgba(167,139,250,0.3), inset 0 0 12px rgba(167,139,250,0.2)',
                    animation: 'deployLivePulse 2s ease-in-out infinite',
                    background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)',
                  }} />
                  <div className="absolute rounded-full" style={{
                    left: pair.b.x - 18, top: pair.b.y - 18, width: 36, height: 36,
                    border: '2px solid rgba(167,139,250,0.6)',
                    boxShadow: '0 0 20px rgba(167,139,250,0.3), inset 0 0 12px rgba(167,139,250,0.2)',
                    animation: 'deployLivePulse 2s ease-in-out infinite',
                    background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)',
                  }} />
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                    <line x1={pair.a.x} y1={pair.a.y} x2={pair.b.x} y2={pair.b.y}
                      stroke="rgba(167,139,250,0.15)" strokeWidth="1" strokeDasharray="6,8" />
                  </svg>
                </React.Fragment>
              ))}
            </div>
          )}
          {/* ─── Phase 2: Portal placement pending indicator ─── */}
          {portalPlacementMode && portalPendingRef.current && (
            <div className="fixed z-[37] pointer-events-none rounded-full" style={{
              left: portalPendingRef.current.x - 18, top: portalPendingRef.current.y - 18, width: 36, height: 36,
              border: '2px dashed rgba(167,139,250,0.8)',
              animation: 'deployLivePulse 1s ease-in-out infinite',
            }} />
          )}
          {/* ─── Phase 2: Gravity Wells ─── */}
          {gravityWells.length > 0 && (
            <div className="fixed inset-0 z-[36] pointer-events-none">
              {gravityWells.map(well => (
                <div key={well.id} className="absolute" style={{
                  left: well.x - 24, top: well.y - 24, width: 48, height: 48,
                }}>
                  <div className="absolute inset-0 rounded-full" style={{
                    background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, rgba(251,191,36,0.08) 40%, transparent 70%)',
                    boxShadow: '0 0 30px rgba(251,191,36,0.15)',
                    animation: 'deployLivePulse 3s ease-in-out infinite',
                  }} />
                  <div className="absolute rounded-full" style={{
                    left: 16, top: 16, width: 16, height: 16,
                    background: 'radial-gradient(circle, rgba(251,191,36,0.8), rgba(251,191,36,0.3))',
                    boxShadow: '0 0 12px rgba(251,191,36,0.5)',
                  }} />
                  {/* Range indicator */}
                  <div className="absolute rounded-full" style={{
                    left: 24 - 150, top: 24 - 150, width: 300, height: 300,
                    border: '1px solid rgba(251,191,36,0.06)',
                    borderRadius: '50%',
                  }} />
                </div>
              ))}
            </div>
          )}
          {/* ─── Phase 2: Arena Mutation flash ─── */}
          {arenaMutation && (
            <div className="fixed inset-0 z-[130] pointer-events-none flex items-center justify-center" style={{
              animation: 'arenaMutationFlash 0.6s ease-out both',
            }}>
              <div className="text-center">
                <div className="font-mono text-3xl font-black tracking-[0.4em] text-white/90" style={{
                  textShadow: '0 0 40px rgba(255,107,107,0.5), 0 0 80px rgba(255,107,107,0.2)',
                  animation: 'arenaMutationText 5s ease-out both',
                }}>
                  ⚡ {arenaMutation.name} ⚡
                </div>
              </div>
            </div>
          )}
          {chaosEvent && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[142] pointer-events-none" style={{ animation: 'collectionToastIn 0.45s ease-out both' }}>
              <div className="px-5 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl" style={{ borderColor: `${chaosEvent.color}55`, background: `linear-gradient(135deg, ${chaosEvent.color}22, rgba(8,12,18,0.95))`, boxShadow: `0 0 28px ${chaosEvent.color}35` }}>
                <div className="flex items-center gap-3">
                  <span className="text-lg" style={{ color: chaosEvent.color }}>{chaosEvent.icon}</span>
                  <div>
                    <div className="text-[10px] font-mono tracking-[0.3em]" style={{ color: chaosEvent.color }}>CURATED CHAOS</div>
                    <div className="text-sm font-mono text-white">{chaosEvent.name}</div>
                    <div className="text-[10px] text-slate-400">{chaosEvent.desc}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {bossRewardToast && (
            <div className="fixed top-36 right-4 z-[142] pointer-events-none" style={{ animation: 'collectionToastIn 0.45s ease-out both' }}>
              <div className="px-4 py-3 rounded-2xl border border-amber-400/30 bg-amber-500/10 backdrop-blur-xl shadow-2xl max-w-[260px]">
                <div className="text-[10px] font-mono tracking-[0.24em] text-amber-300">BOSS DROP</div>
                <div className="text-sm font-mono text-white mt-1">{bossRewardToast.label}</div>
                <div className="text-[10px] text-slate-400 mt-1">{bossRewardToast.desc}</div>
              </div>
            </div>
          )}
          {creatorChallengeResult && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[142] pointer-events-none" style={{ animation: 'collectionToastIn 0.45s ease-out both' }}>
              <div className={`px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl ${creatorChallengeResult.success ? 'border-emerald-400/30 bg-emerald-500/10' : 'border-rose-400/30 bg-rose-500/10'}`}>
                <div className="text-[10px] font-mono tracking-[0.24em] text-white/70">CREATOR CHALLENGE</div>
                <div className="text-sm font-mono text-white mt-1">{creatorChallengeResult.name}</div>
                <div className="text-[10px] text-slate-300 mt-1">{creatorChallengeResult.summary}</div>
              </div>
            </div>
          )}
          {chaosEventResult && (
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[142] pointer-events-none" style={{ animation: 'collectionToastIn 0.45s ease-out both' }}>
              <div className="px-4 py-3 rounded-2xl border border-rose-400/30 bg-rose-500/12 backdrop-blur-xl shadow-2xl">
                <div className="text-[10px] font-mono tracking-[0.24em] text-rose-200">CHAOS RESOLVED</div>
                <div className="text-sm font-mono text-white mt-1">{chaosEventResult.name}</div>
                <div className="text-[10px] text-slate-300 mt-1">{chaosEventResult.summary}</div>
              </div>
            </div>
          )}
          {/* Phase 4: Ghost Replay Overlay */}
          {ghostReplay.replaying && ghostReplay.ghostPositions.length > 0 && (
            ghostReplay.ghostPositions.map((ghost, i) => (
              <div
                key={`ghost-${i}`}
                className="fixed z-[60] pointer-events-none rounded-2xl border border-cyan-400/15"
                style={{
                  left: 0, top: 0,
                  width: ghost.w || 132,
                  height: ghost.h || 95,
                  transform: `translate(${ghost.x}px, ${ghost.y}px) rotate(${ghost.a || 0}rad)`,
                  background: 'rgba(88, 164, 176, 0.06)',
                  boxShadow: '0 0 16px rgba(88, 164, 176, 0.1)',
                  opacity: 0.4,
                }}
              />
            ))
          )}
          <div
            ref={playgroundHudRef}
            className={`fixed z-[120] rounded-2xl border border-[#58A4B0]/20 bg-[#0d1114]/90 backdrop-blur-xl shadow-2xl p-4 ease-out ${playgroundHudDragging ? 'transition-none' : 'transition-all duration-300'} ${playgroundHudMin ? 'w-auto' : 'w-[320px] space-y-4'}`}
            data-playground-control
            style={{
              animation: 'playgroundHudIn 0.35s ease-out both',
              top: playgroundHudPosition?.y ?? PLAYGROUND_HUD_TOP_CLEARANCE,
              left: playgroundHudPosition?.x,
              right: playgroundHudPosition ? 'auto' : PLAYGROUND_HUD_MARGIN,
              maxHeight: 'calc(100vh - 32px)',
              overflowY: 'auto',
            }}
          >
            <div className="flex items-center justify-between gap-3" data-playground-control>
              <div className="flex items-center gap-2" data-playground-control>
                <div className="w-2 h-2 rounded-full bg-[#58A4B0] shrink-0" style={{ animation: 'deployLivePulse 2s ease-in-out infinite' }} />
                <span className="font-mono text-[11px] text-[#58A4B0] tracking-[0.28em] font-bold">PLAYGROUND</span>
                {playgroundHudMin && (
                  <span className="text-[10px] font-mono text-slate-500 ml-1">{playgroundScore}pts</span>
                )}
              </div>
              <div className="flex items-center gap-1.5" data-playground-control>
                <div
                  className={`flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-mono select-none ${playgroundHudDragging ? 'cursor-grabbing border-[#58A4B0]/40 text-[#58A4B0]' : 'cursor-grab border-white/10 text-slate-500 hover:text-white hover:border-white/20 transition-colors'}`}
                  onMouseDown={startPlaygroundHudDrag}
                  onTouchStart={startPlaygroundHudDrag}
                  data-playground-control
                  style={{ touchAction: 'none' }}
                  title="Drag to reposition"
                  aria-label="Drag playground panel"
                >
                  <GripVertical size={10} />
                  <span>move</span>
                </div>
                <button
                  className={`flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-mono transition-colors ${playgroundHumOn ? 'border-[#58A4B0]/40 bg-[#58A4B0]/10 text-[#58A4B0]' : 'border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}
                  onClick={() => setPlaygroundHumOn(prev => !prev)}
                  data-playground-control
                  title={playgroundHumOn ? 'Disable ambient hum' : 'Enable ambient hum'}
                  aria-label={playgroundHumOn ? 'Disable ambient hum' : 'Enable ambient hum'}
                >
                  {playgroundHumOn ? <Volume2 size={10} /> : <VolumeX size={10} />}
                  <span>{playgroundHumOn ? 'hum on' : 'hum off'}</span>
                </button>
                <button className="px-2 py-0.5 rounded-lg border border-white/10 text-[10px] font-mono text-slate-400 hover:text-white hover:border-white/20 transition-colors" onClick={() => setPlaygroundHudMin(prev => !prev)} data-playground-control>
                  {playgroundHudMin ? '▲' : '▼'}
                </button>
                <button className="px-2 py-0.5 rounded-lg border border-white/10 text-[10px] font-mono text-slate-400 hover:text-white hover:border-white/20 transition-colors" onClick={deactivatePlayground} data-playground-control>
                  ✕
                </button>
              </div>
            </div>

            {!playgroundHudMin && (
            <p className="text-[11px] text-slate-400 leading-relaxed">Zero-g sandbox. Drag cards, double-click to pin, click empty space to spawn toys.</p>
            )}

            {!playgroundHudMin && (
            <>
            <div className="grid grid-cols-3 gap-2" data-playground-control>
              {[
                ['zero', 'Zero-G'],
                ['down', 'Gravity'],
                ['reverse', 'Reverse'],
              ].map(([mode, label]) => (
                <button
                  key={mode}
                  className={`rounded-xl px-3 py-2 text-[11px] font-mono border transition-colors ${playgroundGravityMode === mode ? 'border-[#58A4B0]/40 bg-[#58A4B0]/10 text-[#58A4B0]' : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'}`}
                  onClick={() => setPlaygroundGravityMode(mode)}
                  data-playground-control
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2" data-playground-control>
              {[
                ['none', 'Neutral'],
                ['magnet', 'Magnet'],
                ['repel', 'Repel'],
              ].map(([mode, label]) => (
                <button
                  key={mode}
                  className={`rounded-xl px-3 py-2 text-[11px] font-mono border transition-colors ${playgroundForceMode === mode ? 'border-[#58A4B0]/40 bg-[#58A4B0]/10 text-[#58A4B0]' : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'}`}
                  onClick={() => setPlaygroundForceMode(mode)}
                  data-playground-control
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2" data-playground-control>
              <button className={`rounded-xl px-3 py-2 text-[11px] font-mono border transition-colors ${playgroundOrbitMode ? 'border-[#58A4B0]/40 bg-[#58A4B0]/10 text-[#58A4B0]' : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-white'}`} onClick={() => setPlaygroundOrbitMode(prev => !prev)} data-playground-control>
                {playgroundOrbitMode ? 'Orbit: armed' : 'Orbit: click card'}
              </button>
              <button className="rounded-xl px-3 py-2 text-[11px] font-mono border border-white/10 text-slate-400 hover:border-white/20 hover:text-white transition-colors" onClick={explodePlaygroundItems} data-playground-control>
                Explode all
              </button>
              <button className="rounded-xl px-3 py-2 text-[11px] font-mono border border-white/10 text-slate-400 hover:border-white/20 hover:text-white transition-colors" onClick={shufflePlaygroundItems} data-playground-control>
                Shuffle
              </button>
              <button className="rounded-xl px-3 py-2 text-[11px] font-mono border border-white/10 text-slate-400 hover:border-white/20 hover:text-white transition-colors" onClick={stackPlaygroundItems} data-playground-control>
                Stack neatly
              </button>
              <button className="rounded-xl px-3 py-2 text-[11px] font-mono border border-white/10 text-slate-400 hover:border-white/20 hover:text-white transition-colors" onClick={() => resetPlaygroundLayout({ clearSpawns: false })} data-playground-control>
                Return layout
              </button>
              <button className="rounded-xl px-3 py-2 text-[11px] font-mono border border-white/10 text-slate-400 hover:border-white/20 hover:text-white transition-colors" onClick={() => resetPlaygroundLayout({ clearSpawns: true })} data-playground-control>
                Reset sandbox
              </button>
              <button className="rounded-xl px-3 py-2 text-[11px] font-mono border border-white/10 text-slate-400 hover:border-white/20 hover:text-white transition-colors" onClick={chaosRain} data-playground-control>
                Chaos rain
              </button>

            </div>

            <div className="flex flex-wrap gap-2" data-playground-control>
              <span className={`px-2 py-1 rounded-full text-[10px] font-mono border ${playgroundSlowMo ? 'border-amber-400/40 text-amber-300 bg-amber-500/10' : 'border-white/10 text-slate-500'}`}>Shift = slow-mo</span>
              <span className={`px-2 py-1 rounded-full text-[10px] font-mono border ${playgroundPaused ? 'border-[#58A4B0]/40 text-[#58A4B0] bg-[#58A4B0]/10' : 'border-white/10 text-slate-500'}`}>Space = freeze</span>
              <span className={`px-2 py-1 rounded-full text-[10px] font-mono border cursor-pointer select-none ${portalPlacementMode ? 'border-purple-400/40 text-purple-300 bg-purple-500/10' : 'border-white/10 text-slate-500 hover:text-white hover:border-white/20'}`} onClick={() => { setPortalPlacementMode(p => { if (p) portalPendingRef.current = null; return !p; }); setGravityWellPlacementMode(false); }} data-playground-control>P = portals ({portalPairs.length}/2)</span>
              <span className={`px-2 py-1 rounded-full text-[10px] font-mono border cursor-pointer select-none ${gravityWellPlacementMode ? 'border-amber-400/40 text-amber-300 bg-amber-500/10' : 'border-white/10 text-slate-500 hover:text-white hover:border-white/20'}`} onClick={() => { setGravityWellPlacementMode(p => !p); setPortalPlacementMode(false); portalPendingRef.current = null; }} data-playground-control>G = wells ({gravityWells.length}/3)</span>
            </div>
            {/* Phase 3: Achievement Chains HUD */}
            {ACHIEVEMENT_CHAINS.some(c => (achievementProgress[c.id] || 0) > 0 && (achievementProgress[c.id] || 0) < c.steps.length) && (
              <div className="mt-2 space-y-1.5" data-playground-control>
                {ACHIEVEMENT_CHAINS.filter(c => (achievementProgress[c.id] || 0) > 0 && (achievementProgress[c.id] || 0) < c.steps.length).map(chain => {
                  const step = achievementProgress[chain.id] || 0;
                  return (
                    <div key={chain.id} className="text-[10px] font-mono text-slate-400">
                      <span className="text-amber-300">🏆 {chain.name}</span>{' '}
                      <span className="text-slate-500">{step}/{chain.steps.length}</span>{' '}
                      <span className="text-slate-500">→ {chain.steps[step]?.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Phase 3: Prestige System */}
            {prestigeLevel > 0 && (
              <div className="mt-2 text-[10px] font-mono text-amber-300" data-playground-control>
                {'⭐'.repeat(Math.min(prestigeLevel, 5))} Prestige {prestigeLevel} — {Math.round((prestigeBuffs.scoreMultiplier - 1) * 100)}% score bonus
              </div>
            )}
            {prestigeAvailable && (
              <button
                className="mt-2 w-full rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-1.5 text-[10px] font-mono text-amber-300 hover:bg-amber-500/20 transition-colors"
                onClick={performPrestige}
                data-playground-control
              >
                ⭐ PRESTIGE (reset collection for permanent buffs)
              </button>
            )}
            {/* Phase 4: Daily Seed Challenge */}
            {dailySeed.dailyChallenge && !dailySeed.dailyActive && !dailySeed.dailyCompleted && (
              <button
                className="mt-2 w-full rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-mono text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                onClick={() => {
                  const cfg = dailySeed.startDaily();
                  if (cfg) {
                    setPlaygroundGravityMode(cfg.gravityMode);
                    setPlaygroundForceMode(cfg.forceMode);
                    toast.success('Daily Challenge started! Complete all objectives.', { icon: '📅' });
                  }
                }}
                data-playground-control
              >
                📅 DAILY CHALLENGE
              </button>
            )}
            {dailySeed.dailyCompleted && (
              <div className="mt-2 text-[10px] font-mono text-emerald-300" data-playground-control>
                ✅ Daily challenge complete! Best: {dailySeed.dailyBestScore}
              </div>
            )}
            {dailySeed.dailyActive && dailySeed.dailyChallenge && (
              <div className="mt-2 space-y-1 border border-cyan-500/20 rounded-lg p-2 bg-cyan-500/5" data-playground-control>
                <div className="text-[10px] font-mono text-cyan-300 font-bold">📅 DAILY CHALLENGE</div>
                {dailySeed.dailyChallenge.objectives.map(obj => {
                  const current = dailySeed.dailyProgress[obj.id] || 0;
                  const done = obj.target ? current >= obj.target : current > 0;
                  return (
                    <div key={obj.id} className={`text-[9px] font-mono ${done ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {done ? '✅' : '⬜'} {obj.label} {obj.target ? `(${Math.min(current, obj.target)}/${obj.target})` : ''}
                    </div>
                  );
                })}
              </div>
            )}
            </>
            )}
            {/* Phase 4: Ghost Replay Controls */}
            <div className="mt-2 flex gap-1.5 flex-wrap" data-playground-control>
              {!ghostReplay.recording && !ghostReplay.replaying && (
                <button className="px-2 py-1 rounded-lg border border-rose-400/20 bg-rose-500/5 text-[9px] font-mono text-rose-300 hover:bg-rose-500/15 transition-colors" onClick={ghostReplay.startRecording} data-playground-control>
                  ⏺ REC
                </button>
              )}
              {ghostReplay.recording && (
                <button className="px-2 py-1 rounded-lg border border-rose-400/30 bg-rose-500/15 text-[9px] font-mono text-rose-300 animate-pulse" onClick={ghostReplay.stopRecording} data-playground-control>
                  ⏹ STOP REC
                </button>
              )}
              {ghostReplay.hasGhost && !ghostReplay.replaying && !ghostReplay.recording && (
                <button className="px-2 py-1 rounded-lg border border-cyan-400/20 bg-cyan-500/5 text-[9px] font-mono text-cyan-300 hover:bg-cyan-500/15 transition-colors" onClick={ghostReplay.startReplay} data-playground-control>
                  👻 GHOST
                </button>
              )}
              {ghostReplay.replaying && (
                <button className="px-2 py-1 rounded-lg border border-cyan-400/30 bg-cyan-500/15 text-[9px] font-mono text-cyan-300" onClick={ghostReplay.stopReplay} data-playground-control>
                  ⏹ STOP GHOST
                </button>
              )}
            </div>
            {/* Phase 4: Sandbox Presets & Share */}
            <div className="mt-1 flex gap-1.5 flex-wrap" data-playground-control>
              <button className="px-2 py-1 rounded-lg border border-violet-400/20 bg-violet-500/5 text-[9px] font-mono text-violet-300 hover:bg-violet-500/15 transition-colors" onClick={() => setPresetMenuOpen(p => !p)} data-playground-control>
                🎛️ PRESETS
              </button>
              <button className={`px-2 py-1 rounded-lg border text-[9px] font-mono transition-colors ${creatorTier > 0 ? 'border-rose-400/20 bg-rose-500/5 text-rose-300 hover:bg-rose-500/15' : 'border-white/10 text-slate-500 hover:text-white hover:border-white/20'}`} onClick={() => setCreatorStudioOpen(prev => !prev)} data-playground-control>
                ⭐ CREATOR {creatorTier > 0 ? `P${creatorTier}` : 'LOCKED'}
              </button>
              <button className="px-2 py-1 rounded-lg border border-emerald-400/20 bg-emerald-500/5 text-[9px] font-mono text-emerald-300 hover:bg-emerald-500/15 transition-colors" onClick={sharePlaygroundState} data-playground-control>
                📋 SHARE
              </button>
              <button className="px-2 py-1 rounded-lg border border-amber-400/20 bg-amber-500/5 text-[9px] font-mono text-amber-300 hover:bg-amber-500/15 transition-colors" onClick={savePresetToLocal} data-playground-control>
                💾 SAVE
              </button>
            </div>
            {presetMenuOpen && (
              <div className="mt-1 space-y-1 border border-violet-500/20 rounded-lg p-2 bg-violet-500/5" data-playground-control>
                {SANDBOX_PRESETS.map(preset => (
                  <button key={preset.name} className="w-full text-left px-2 py-1.5 rounded-lg text-[9px] font-mono text-violet-200 hover:bg-violet-500/15 transition-colors" onClick={() => loadPreset(preset)} data-playground-control>
                    <div className="font-bold">{preset.name}</div>
                    <div className="text-slate-500">{preset.desc}</div>
                  </button>
                ))}
                {(() => {
                  try {
                    const custom = readStoredList(CREATOR_STORAGE_KEYS.presets);
                    return custom.map((p, i) => (
                      <button key={`custom-${i}`} className="w-full text-left px-2 py-1.5 rounded-lg text-[9px] font-mono text-amber-200 hover:bg-amber-500/15 transition-colors" onClick={() => {
                        setPlaygroundGravityMode(p.state.g || 'zero');
                        setPlaygroundForceMode(p.state.f || 'none');
                        if (p.state.pp) { setPortalPairs(p.state.pp.map((pp, idx) => ({ id: ++portalIdRef.current, a: pp.a, b: pp.b }))); portalPairsRef.current = p.state.pp.map((pp, idx) => ({ id: idx + 1, a: pp.a, b: pp.b })); }
                        if (p.state.gw) { const nw = p.state.gw.map(w => ({ id: ++gravityWellIdRef.current, x: w.x, y: w.y, strength: 800 })); setGravityWells(nw); gravityWellsRef.current = nw; }
                        setPresetMenuOpen(false);
                        toast.success(`Loaded: ${p.name}`, { icon: '🎛️' });
                      }} data-playground-control>
                        <div className="font-bold">💾 {p.name}</div>
                      </button>
                    ));
                  } catch { return null; }
                })()}
              </div>
            )}
            {creatorStudioOpen && (
              <div className="mt-1 space-y-2 border border-rose-500/20 rounded-lg p-2 bg-rose-500/5" data-playground-control>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-mono text-rose-300">Creator Studio</div>
                    <div className="text-[9px] text-slate-500">Prestige unlocks authorship instead of pure buffs.</div>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">P{prestigeLevel}</div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono text-slate-500">
                  <div className={creatorPermissions.customPresets ? 'text-emerald-300' : ''}>P1 presets</div>
                  <div className={creatorPermissions.customChallenges ? 'text-emerald-300' : ''}>P2 challenge cards</div>
                  <div className={creatorPermissions.modifierPacks ? 'text-emerald-300' : ''}>P3 modifier packs</div>
                  <div className={creatorPermissions.anomalyLoadouts ? 'text-emerald-300' : ''}>P4 anomaly loadouts</div>
                </div>

                {creatorPermissions.customPresets && (
                  <div className="space-y-1.5">
                    <div className="text-[9px] font-mono text-rose-200">Named preset</div>
                    <div className="flex gap-1.5">
                      <input value={creatorPresetName} onChange={(e) => setCreatorPresetName(e.target.value)} placeholder="Preset name" className="flex-1 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-[9px] font-mono text-white outline-none" data-playground-control />
                      <button className="px-2 py-1 rounded-lg border border-rose-400/20 text-[9px] font-mono text-rose-300 hover:bg-rose-500/15 transition-colors" onClick={() => savePresetToLocal(creatorPresetName)} data-playground-control>
                        save
                      </button>
                    </div>
                  </div>
                )}

                {creatorPermissions.customChallenges && (
                  <div className="space-y-1.5 border-t border-white/5 pt-2">
                    <div className="text-[9px] font-mono text-rose-200">Challenge cards</div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input value={creatorChallengeDraft.name} onChange={(e) => setCreatorChallengeDraft(prev => ({ ...prev, name: e.target.value }))} placeholder="Challenge name" className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-[9px] font-mono text-white outline-none" data-playground-control />
                      <select value={creatorChallengeDraft.metric} onChange={(e) => setCreatorChallengeDraft(prev => ({ ...prev, metric: e.target.value }))} className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-[9px] font-mono text-white outline-none" data-playground-control>
                        {CREATOR_CHALLENGE_METRICS.map(metric => <option key={metric.id} value={metric.id}>{metric.label}</option>)}
                      </select>
                      <input type="number" min="1" value={creatorChallengeDraft.target} onChange={(e) => setCreatorChallengeDraft(prev => ({ ...prev, target: e.target.value }))} placeholder="Target" className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-[9px] font-mono text-white outline-none" data-playground-control />
                      <input type="number" min="5" value={creatorChallengeDraft.timeLimit} onChange={(e) => setCreatorChallengeDraft(prev => ({ ...prev, timeLimit: e.target.value }))} placeholder="Seconds" className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-[9px] font-mono text-white outline-none" data-playground-control />
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      <button className="px-2 py-1 rounded-lg border border-rose-400/20 text-[9px] font-mono text-rose-300 hover:bg-rose-500/15 transition-colors" onClick={saveCreatorChallenge} data-playground-control>
                        save card
                      </button>
                      {creatorChallenges.slice(-3).map((challenge) => (
                        <button key={challenge.name + challenge.savedAt} className="px-2 py-1 rounded-lg border border-white/10 text-[9px] font-mono text-slate-300 hover:border-white/20" onClick={() => startCreatorChallenge(challenge)} data-playground-control>
                          {challenge.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {creatorPermissions.modifierPacks && (
                  <div className="space-y-1.5 border-t border-white/5 pt-2">
                    <div className="text-[9px] font-mono text-rose-200">Modifier packs</div>
                    <input value={creatorModifierPackName} onChange={(e) => setCreatorModifierPackName(e.target.value)} placeholder="Pack name" className="w-full rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-[9px] font-mono text-white outline-none" data-playground-control />
                    <div className="flex flex-wrap gap-1">
                      {CRATE_MODIFIERS.map((modifier) => (
                        <button key={modifier.id} className={`px-2 py-1 rounded-lg border text-[8px] font-mono transition-colors ${creatorModifierPackDraft.includes(modifier.id) ? 'border-rose-400/30 bg-rose-500/10 text-rose-200' : 'border-white/10 text-slate-500 hover:text-white hover:border-white/20'}`} onClick={() => toggleModifierPackDraft(modifier.id)} data-playground-control>
                          {modifier.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      <button className="px-2 py-1 rounded-lg border border-rose-400/20 text-[9px] font-mono text-rose-300 hover:bg-rose-500/15 transition-colors" onClick={saveModifierPack} data-playground-control>
                        save pack
                      </button>
                      {creatorModifierPacks.slice(-2).map((pack) => (
                        <button key={pack.name + pack.savedAt} className="px-2 py-1 rounded-lg border border-white/10 text-[9px] font-mono text-slate-300 hover:border-white/20" onClick={() => runModifierPack(pack)} data-playground-control>
                          {pack.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {creatorPermissions.anomalyLoadouts && (
                  <div className="space-y-1.5 border-t border-white/5 pt-2">
                    <div className="text-[9px] font-mono text-rose-200">Anomaly loadouts ({creatorPermissions.anomalySlots} slots)</div>
                    <input value={creatorLoadoutName} onChange={(e) => setCreatorLoadoutName(e.target.value)} placeholder="Loadout name" className="w-full rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-[9px] font-mono text-white outline-none" data-playground-control />
                    <div className="flex flex-wrap gap-1">
                      {CHAOS_EVENTS.map((eventDef) => (
                        <button key={eventDef.id} className={`px-2 py-1 rounded-lg border text-[8px] font-mono transition-colors ${creatorLoadoutDraft.includes(eventDef.id) ? 'border-rose-400/30 bg-rose-500/10 text-rose-200' : 'border-white/10 text-slate-500 hover:text-white hover:border-white/20'}`} onClick={() => toggleLoadoutDraftEvent(eventDef.id)} data-playground-control>
                          {eventDef.name}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      <button className="px-2 py-1 rounded-lg border border-rose-400/20 text-[9px] font-mono text-rose-300 hover:bg-rose-500/15 transition-colors" onClick={saveAnomalyLoadout} data-playground-control>
                        save loadout
                      </button>
                      {creatorAnomalyLoadouts.slice(-2).map((loadout) => (
                        <button key={loadout.name + loadout.savedAt} className="px-2 py-1 rounded-lg border border-white/10 text-[9px] font-mono text-slate-300 hover:border-white/20" onClick={() => runAnomalyLoadout(loadout)} data-playground-control>
                          {loadout.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!playgroundHudMin && (
            <>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono" data-playground-control>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2"><div className="text-slate-500">score</div><div className="text-white mt-1">{playgroundScore}</div></div>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2"><div className="text-slate-500">combo</div><div className={`mt-1 ${playgroundCombo > 1 ? 'text-[#58A4B0]' : 'text-white'}`}>{playgroundCombo > 0 ? `x${playgroundCombo}` : '-'}</div></div>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2"><div className="text-slate-500">loot</div><div className="text-white mt-1">{playgroundCollectibles}</div></div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono" data-playground-control>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2"><div className="text-slate-500">launches</div><div className="text-white mt-1">{playgroundStats.launches}</div></div>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2"><div className="text-slate-500">spawns</div><div className="text-white mt-1">{playgroundStats.spawns}</div></div>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2"><div className="text-slate-500">impacts</div><div className="text-white mt-1">{playgroundStats.collisions}</div></div>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2"><div className="text-slate-500">pinned</div><div className="text-white mt-1">{playgroundStats.pinned}</div></div>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2"><div className="text-slate-500">orbiters</div><div className="text-white mt-1">{playgroundStats.orbiters}</div></div>
              <div className={`rounded-xl border px-3 py-2 ${playgroundMastered ? 'border-emerald-400/30 bg-emerald-500/10' : 'border-white/8 bg-white/[0.03]'}`}><div className="text-slate-500">status</div><div className={`mt-1 ${playgroundMastered ? 'text-emerald-300' : 'text-white'}`}>{playgroundMastered ? 'mastered' : 'live'}</div></div>
            </div>

            {/* Wave 2 stats row */}
            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono" data-playground-control>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2"><div className="text-slate-500">weather</div><div className="text-white mt-1">{weather.stage}</div></div>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2"><div className="text-slate-500">speedruns</div><div className="text-white mt-1">{speedrun.completedCount}</div></div>
              <div className={`rounded-xl border px-3 py-2 ${voidDim.inVoid ? 'border-emerald-400/30 bg-emerald-500/10' : 'border-white/8 bg-white/[0.03]'}`}><div className="text-slate-500">void</div><div className={`mt-1 ${voidDim.inVoid ? 'text-emerald-300' : 'text-white'}`}>{voidDim.inVoid ? `${voidDim.voidTimer}s` : playgroundScore >= voidDim.entryScoreThreshold ? 'ready' : 'locked'}</div></div>
            </div>
            {chaosEvent && (
              <div className="rounded-xl border px-3 py-2 border-rose-400/20 bg-rose-500/8" data-playground-control>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-mono" style={{ color: chaosEvent.color }}>{chaosEvent.icon} {chaosEvent.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{chaosEvent.progress}/{chaosEvent.objective.target}</span>
                </div>
                <div className="text-[9px] text-slate-500 mt-1">{chaosEvent.objective.label}</div>
                <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-200" style={{ width: `${Math.min(100, (chaosEvent.progress / chaosEvent.objective.target) * 100)}%`, background: chaosEvent.color }} />
                </div>
              </div>
            )}
            {voidDim.bestDepth > 0 && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/6 px-3 py-2" data-playground-control>
                <div className="flex items-center justify-between gap-3 text-[10px] font-mono">
                  <span className="text-emerald-300">VOID DEPTH</span>
                  <span className="text-slate-300">best {voidDim.bestDepth}</span>
                </div>
                <div className="text-[9px] text-slate-500 mt-1">Relics: {Object.keys(voidDim.relicInventory || {}).length}</div>
              </div>
            )}
            {activeCreatorChallenge && (
              <div className="rounded-xl border border-rose-400/20 bg-rose-500/8 px-3 py-2" data-playground-control>
                <div className="flex items-center justify-between gap-3 text-[10px] font-mono">
                  <span className="text-rose-200">{activeCreatorChallenge.name}</span>
                  <span className="text-slate-400">{Math.max(0, activeCreatorChallenge.timeLeft)}s</span>
                </div>
                <div className="text-[9px] text-slate-500 mt-1">{activeCreatorChallenge.objective.label}</div>
                <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-rose-300 transition-all duration-200" style={{ width: `${Math.min(100, (activeCreatorChallenge.progress / activeCreatorChallenge.objective.target) * 100)}%` }} />
                </div>
              </div>
            )}
            </>
            )}

            {!playgroundHudMin && (
            <>
            <div className="space-y-2" data-playground-control>
              <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-slate-500">Hidden objectives</div>
              {playgroundObjectives.map((objective) => {
                const done = objective.value >= objective.target;
                return (
                  <div key={objective.label} className={`rounded-xl border px-3 py-2 ${done ? 'border-emerald-400/25 bg-emerald-500/8' : 'border-white/8 bg-white/[0.02]'}`} data-playground-control>
                    <div className="flex items-center justify-between gap-3 text-[11px]">
                      <span className={done ? 'text-emerald-300' : 'text-slate-300'}>{objective.label}</span>
                      <span className={done ? 'text-emerald-300 font-mono' : 'text-slate-500 font-mono'}>{objective.value}/{objective.target}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                      <div className={`h-full rounded-full ${done ? 'bg-emerald-400' : 'bg-[#58A4B0]'}`} style={{ width: `${(objective.value / objective.target) * 100}%`, transition: 'width 0.25s ease-out' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-slate-500 font-mono leading-relaxed" data-playground-control>
              Double-click an item to pin it. Orbit mode captures the next card you click. Click spawned toys to collect them and trigger powers.
            </p>
            </>
            )}
          </div>

          <div className="fixed left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[60]" style={{ opacity: playgroundOrbitMode ? 1 : 0.55 }}>
            <div className="w-28 h-28 rounded-full border border-[#58A4B0]/20 bg-[#58A4B0]/[0.03] backdrop-blur-sm" style={{ animation: 'playgroundCorePulse 3s ease-in-out infinite' }} />
            <div className="absolute inset-4 rounded-full border border-[#58A4B0]/30" />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono tracking-[0.28em] text-[#58A4B0]/80">CORE</div>
          </div>

          {playgroundSpawns.map((spawn) => (
            <div
              key={spawn.id}
              {...getPlaygroundItemProps(spawn.id)}
              className={`fixed left-0 top-0 z-[65] rounded-2xl border backdrop-blur-xl p-3 shadow-2xl ${spawn._fused ? 'w-[160px] border-white/20' : 'w-[132px] border-white/10'}`}
              style={withPlaygroundStyle(spawn.id, {
                backgroundImage: spawn._fused && spawn.gradient
                  ? spawn.gradient
                  : `linear-gradient(135deg, ${spawn.accent}20, rgba(255,255,255,0.02))`,
                background: spawn._fused ? `${spawn.gradient || `linear-gradient(135deg, ${spawn.accent}20, rgba(15,18,22,0.92))`}` : undefined,
                boxShadow: spawn._fused ? `0 0 24px ${spawn.accent}40, inset 0 0 16px ${spawn.accent}15` : undefined,
              })}
            >
              <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.24em] text-slate-500">
                <span>{spawn._fused ? '⚛ fused' : spawn.kind}</span>
                <span style={{ color: spawn.accent }}>+</span>
              </div>
              <div className={`mt-2 font-semibold text-white ${spawn._fused ? 'text-base' : 'text-sm'}`}>{spawn.label}</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{spawn.body}</p>
            </div>
          ))}

          {/* ─── Crates ─── */}
          {playgroundCrates.map((crate) => (
            <div
              key={crate.id}
              ref={(el) => registerPlaygroundNode(crate.id, el)}
              className="fixed left-0 top-0 z-[66] w-[100px] select-none pointer-events-none"
              style={{
                left: crate.x,
                top: crate.y,
                animation: 'crateGlitchIn 0.4s ease-out both',
              }}
            >
              <div className="relative rounded-xl border-2 p-3 backdrop-blur-md" style={{
                borderColor: crate.modifier.color + '80',
                background: `linear-gradient(135deg, ${crate.modifier.color}15, rgba(15,18,22,0.92))`,
                boxShadow: `0 0 20px ${crate.modifier.color}30, inset 0 0 12px ${crate.modifier.color}10`,
              }}>
                <div className="text-center font-mono text-lg" style={{ color: crate.modifier.color, textShadow: `0 0 8px ${crate.modifier.color}60` }}>
                  {crate.modifier.icon}
                </div>
                <div className="mt-1 text-center text-[8px] font-mono uppercase tracking-[0.3em] text-slate-400" style={{ animation: 'crateTextFlicker 2s infinite' }}>
                  [PAYLOAD]
                </div>
                <div className="absolute inset-0 rounded-xl pointer-events-none" style={{
                  background: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${crate.modifier.color}08 3px, ${crate.modifier.color}08 4px)`,
                }} />
              </div>
            </div>
          ))}

          {/* ─── Active modifier HUD ─── */}
          {activeModifiers.length > 0 && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[130] flex gap-3 pointer-events-none" style={{ animation: 'playgroundHudIn 0.3s ease-out both' }}>
              {activeModifiers.map((mod) => {
                void modifierTick; // force re-render for countdown
                const total = mod.duration || 12000;
                const remaining = Math.max(0, mod.expiresAt - Date.now());
                const pct = (remaining / total) * 100;
                return (
                  <div key={mod.id} className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl border backdrop-blur-xl" style={{
                    borderColor: mod.color + '40',
                    background: `linear-gradient(180deg, ${mod.color}18, rgba(13,17,20,0.92))`,
                    boxShadow: `0 0 18px ${mod.color}25`,
                    minWidth: 120,
                  }}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{mod.icon}</span>
                      <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: mod.color }}>{mod.label}</span>
                    </div>
                    <div className="text-[8px] font-mono text-slate-500 text-center leading-tight">{mod.desc}</div>
                    <div className="w-full h-[2px] rounded-full mt-1" style={{ background: mod.color + '20' }}>
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: mod.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {playgroundBursts.map((burst) => (
            <div key={burst.id} className="fixed pointer-events-none z-[110]" style={{ left: burst.x, top: burst.y, transform: 'translate(-50%, -50%)', animation: 'playgroundSpark 0.45s ease-out forwards' }}>
              <div className="relative" style={{ width: 28 * burst.scale, height: 28 * burst.scale }}>
                <div className="absolute inset-0 rounded-full border border-[#58A4B0]/50" />
                <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#58A4B0] to-transparent -translate-x-1/2" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#58A4B0] to-transparent -translate-y-1/2" />
              </div>
            </div>
          ))}

          {utilityHintActive && (
            <div className="fixed bottom-16 left-4 z-[126] pointer-events-none" style={{ animation: 'playgroundHudIn 0.35s ease-out both' }}>
              <div className="relative rounded-xl border border-[#58A4B0]/20 bg-[#081012]/92 px-3 py-2 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#58A4B0]" style={{ animation: 'deployLivePulse 2s ease-in-out infinite' }} />
                  <span className="text-[10px] font-mono text-[#58A4B0] tracking-wide">first anomaly logged.</span>
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-1">trophies, hints, strange docs ↙</div>
                <div className="absolute left-8 top-full h-4 w-px bg-gradient-to-b from-[#58A4B0]/60 to-transparent" />
              </div>
            </div>
          )}

          {/* ─── Journal toggle button ─── */}
          <button
            onClick={() => { setJournalOpen(prev => !prev); setJournalSnapshot(collection.getSnapshot()); }}
            className={`fixed bottom-4 left-4 z-[125] flex items-center gap-2 px-3 py-2 rounded-xl border bg-[#0d1114]/90 backdrop-blur-xl shadow-xl transition-colors ${utilityHintActive ? 'border-[#58A4B0]/45 hover:border-[#58A4B0]/60' : 'border-[#58A4B0]/20 hover:border-[#58A4B0]/40'}`}
            data-playground-control
            style={{ animation: utilityHintActive ? 'playgroundHudIn 0.35s ease-out both, utilityDockPulse 1.8s ease-in-out infinite 0.45s' : 'playgroundHudIn 0.35s ease-out both' }}
          >
            <Trophy size={14} className="text-[#58A4B0]" />
            <span className="text-[10px] font-mono text-slate-300">{collection.count()}/{COLLECTIBLE_ITEMS.length}</span>
          </button>

          {/* ─── Help panel toggle ─── */}
          <button
            onClick={() => setHelpPanelOpen(prev => !prev)}
            className={`fixed bottom-4 left-[120px] z-[125] flex items-center gap-1.5 px-3 py-2 rounded-xl border bg-[#0d1114]/90 backdrop-blur-xl shadow-xl transition-colors ${utilityHintActive ? 'border-emerald-500/35 hover:border-emerald-400/45' : 'border-white/10 hover:border-emerald-500/30'}`}
            data-playground-control
            style={{ animation: utilityHintActive ? 'playgroundHudIn 0.35s ease-out 0.1s both, utilityDockPulse 1.8s ease-in-out infinite 0.75s' : 'playgroundHudIn 0.35s ease-out 0.1s both' }}
          >
            <span className="text-[10px] font-mono text-emerald-400/70">[?]</span>
            <span className="text-[10px] font-mono text-slate-500">man</span>
          </button>

          {/* ─── Journal panel ─── */}
          {journalOpen && journalSnapshot && (
            <PlaygroundJournal
              snapshot={journalSnapshot}
              canSeeRareHints={collection.canSeeRareHints()}
              canSeeEpicHints={collection.canSeeEpicHints()}
              canSeeLegendaryHints={collection.canSeeLegendaryHints()}
              prestigeLevel={prestigeLevel}
              onReset={() => { collection.resetCollection(); setJournalSnapshot(collection.getSnapshot()); }}
              onClose={() => setJournalOpen(false)}
            />
          )}

          {/* ─── Help panel ─── */}
          {helpPanelOpen && (
            <div className="fixed bottom-16 left-4 z-[135] w-[340px] max-h-[60vh] overflow-y-auto rounded-2xl border border-emerald-500/15 bg-[#080c08]/95 backdrop-blur-xl shadow-2xl" data-playground-control style={{ animation: 'journalSlideIn 0.3s ease-out both' }}>
              <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-emerald-500/10 bg-[#080c08]/95 backdrop-blur-xl z-10">
                <span className="text-sm font-mono font-bold text-emerald-400/80">$ man vectant</span>
                <button onClick={() => setHelpPanelOpen(false)} className="text-slate-600 hover:text-emerald-400 text-xs font-mono">[x]</button>
              </div>
              <div className="p-4 space-y-4 text-[11px] font-mono text-slate-400">
                <div>
                  <h4 className="text-emerald-400/70 font-bold mb-1">[INPUT] controls</h4>
                  <ul className="space-y-0.5 text-slate-500">
                    <li>triple-click logo .... toggle playground</li>
                    <li>drag any card ....... fling it</li>
                    <li>double-click card ... pin/unpin</li>
                    <li>click empty space ... spawn toy</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-emerald-400/70 font-bold mb-1">[KEYS] shortcuts</h4>
                  <ul className="space-y-0.5 text-slate-500">
                    <li>Shift ......... slow-mo</li>
                    <li>Space ......... freeze/unfreeze</li>
                    <li>V ............. enter the void</li>
                    <li>T ............. speedrun timer</li>
                    <li>Ctrl+K ........ cmd palette</li>
                    <li>konami code ... [CLASSIFIED]</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-emerald-400/70 font-bold mb-1">[PHYSICS] force modes</h4>
                  <ul className="space-y-0.5 text-slate-500">
                    <li>gravity: zero-g / fall / float / orbit. pick your poison.</li>
                    <li>forces: none / attract / repel / vortex. each breaks differently.</li>
                    <li>orbit: cards orbit your cursor. you are the sun.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-emerald-400/70 font-bold mb-1">[THREAT] boss encounters</h4>
                  <ul className="space-y-0.5 text-slate-500">
                    <li><span className="text-red-400/80">segfault</span> (1000pt) — 5 collision hits to kill</li>
                    <li><span className="text-purple-400/80">deadlock</span> (2500pt) — reunite the chained orbs</li>
                    <li><span className="text-amber-400/80">race condition</span> (4000pt) — click before it teleports</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-emerald-400/70 font-bold mb-1">[SYS] anomalies</h4>
                  <ul className="space-y-0.5 text-slate-500">
                    <li>{COLLECTIBLE_ITEMS.length} items. 7 rarity tiers. hidden everywhere.</li>
                    <li>journal (trophy icon) tracks progress + hints.</li>
                    <li>some things only appear when you are not looking.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-emerald-400/70 font-bold mb-1">[ENV] dynamic systems</h4>
                  <ul className="space-y-0.5 text-slate-500">
                    <li>weather shifts every 30s. affects physics.</li>
                    <li>constellations form between orbiting cards.</li>
                    <li>shooting stars appear. click them if you can.</li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-emerald-500/10 text-[10px] text-slate-600">
                  type &quot;man vectant&quot; in the editor for hidden protocols.
                </div>
              </div>
            </div>
          )}

          {/* ─── Boot sequence overlay ─── */}
          {pgBootLines.length > 0 && (
            <div className="fixed bottom-16 right-4 z-[130] w-[340px] pointer-events-none" style={{ animation: 'playgroundHudIn 0.3s ease-out both' }}>
              <div className="rounded-xl border border-emerald-500/20 bg-[#050a05]/90 backdrop-blur-sm p-3 font-mono text-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {pgBootLines.map((line, i) => (
                  <div key={i} className="log-appear" style={{
                    color: line.includes('[OK]') ? '#34d399' : line.includes('WARNING') ? '#f59e0b' : line.startsWith('>') ? '#22c55e' : '#64748b',
                    opacity: 0.85,
                    animationDelay: `${i * 0.05}s`,
                  }}>{line}</div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Ghost hint ─── */}
          {ghostHint && (
            <div className="fixed left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-[120] pointer-events-none text-center">
              <span className="font-mono text-sm tracking-wide" style={{
                color: 'rgba(52, 211, 153, 0.35)',
                textShadow: '0 0 20px rgba(52, 211, 153, 0.15)',
                animation: 'whisperFade 4s ease-in-out infinite',
                letterSpacing: '0.15em',
              }}>{ghostHint}</span>
            </div>
          )}

          {/* ─── Collection toast ─── */}
          {collectionToast && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[140] pointer-events-none" style={{ animation: 'collectionToastIn 0.5s ease-out both' }}>
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl" style={{
                borderColor: RARITY[collectionToast.rarity].border,
                background: `linear-gradient(135deg, ${RARITY[collectionToast.rarity].glow}, rgba(13,17,20,0.95))`,
                boxShadow: `0 0 30px ${RARITY[collectionToast.rarity].glow}`,
              }}>
                <span className="text-2xl">{collectionToast.item.icon}</span>
                <div>
                  <div className="text-xs font-mono font-bold" style={{ color: RARITY[collectionToast.rarity].color }}>{collectionToast.item.name}</div>
                  <div className="text-[10px] font-mono" style={{ color: RARITY[collectionToast.rarity].color }}>{RARITY[collectionToast.rarity].label}</div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Overflow glitch: score >= 5000 ─── */}
          {playgroundScore >= 5000 && !collection.has('overflow') && (
            <div
              className="fixed top-4 right-[345px] z-[121] cursor-pointer"
              onClick={() => collection.onOverflowClick(playgroundScore)}
              data-playground-control
              style={{ animation: 'glitchFlicker 0.15s infinite' }}
            >
              <div className="px-3 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] font-mono">
                ⚠ SCORE OVERFLOW
              </div>
            </div>
          )}

          {/* ─── Whisper hints (Compiler's Key chain) ─── */}
          {collection.canSeeLegendaryHints() && collection.countByRarity('epic') >= 3 && !collection.has('compilers_key') && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none" style={{ animation: 'whisperFade 4s ease-in-out infinite' }}>
              <span className="text-[11px] font-mono italic text-[#58A4B0]/30">
                {(() => {
                  const snap = collection.getSnapshot();
                  if (snap.compilerKeyStep >= 1) return '"Speak the name to the machine" — Ctrl+K';
                  return `"Where the stars are born, count the sparks" — ${snap.starClicks}/7`;
                })()}
              </span>
            </div>
          )}

          {/* ─── Mythic / Transcendent cinematic ─── */}
          {mythicCinematic && (
            <div className="fixed inset-0 z-[200] pointer-events-none" style={{ animation: 'mythicAuroraIn 3s ease-out forwards' }}>
              <div className="absolute inset-0" style={{ background: mythicCinematic === 'transcendent'
                ? 'linear-gradient(to top, rgba(52,211,153,0.15), rgba(96,165,250,0.1), rgba(244,114,182,0.1))'
                : 'linear-gradient(to top, rgba(244,114,182,0.1), rgba(167,139,250,0.1), rgba(96,165,250,0.1))'
              }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div style={{ animation: 'mythicItemReveal 2s ease-out 1s both' }}>
                  <div className="text-6xl mb-4 text-center">{mythicCinematic === 'transcendent' ? '🌊' : '💎'}</div>
                  <div className="text-2xl font-bold text-center font-mono" style={{ background: mythicCinematic === 'transcendent'
                    ? 'linear-gradient(90deg, #34D399, #60A5FA, #A78BFA, #F472B6, #FBBF24, #34D399)'
                    : 'linear-gradient(90deg, #F472B6, #A78BFA, #60A5FA, #34D399, #FBBF24)',
                    backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', backgroundSize: '300% 100%', animation: 'journalRainbow 2s linear infinite' }}>
                    {mythicCinematic === 'transcendent' ? 'THE DEEP END' : 'THE SOURCE CODE'}
                  </div>
                  <div className="text-sm text-center text-slate-300 mt-2 font-mono">
                    {mythicCinematic === 'transcendent' ? 'The abyss stares back. You are complete.' : 'You found everything.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Weather overlay ─── */}
          {weather.stage !== 'clear' && (
            <div className="fixed inset-0 z-[55] pointer-events-none">
              {/* Rain / Storm particles */}
              {(weather.stage === 'rain' || weather.stage === 'storm') && weather.raindrops.map(drop => (
                <div key={drop.id} className="absolute w-px rounded-full" style={{
                  left: `${drop.x}%`,
                  top: '-8px',
                  height: weather.stage === 'storm' ? '28px' : '18px',
                  background: weather.stage === 'storm'
                    ? 'linear-gradient(to bottom, transparent, rgba(147,197,253,0.5))'
                    : 'linear-gradient(to bottom, transparent, rgba(148,163,184,0.3))',
                  opacity: drop.opacity,
                  animation: `rainFall ${drop.speed}s linear ${drop.delay}s forwards`,
                }} />
              ))}
              {/* Lightning flash */}
              {weather.lightning && (
                <div className="absolute inset-0 bg-white/5" style={{ animation: 'lightningFlash 0.12s ease-out' }} />
              )}
              {/* Solar glow */}
              {weather.stage === 'solar' && (
                <div className="absolute inset-0" style={{
                  background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(251,191,36,0.06), transparent)',
                  animation: 'solarPulse 4s ease-in-out infinite',
                }} />
              )}
              {/* Weather indicator */}
              <div className="absolute top-4 left-4 z-[121] flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 bg-[#0d1114]/70 backdrop-blur-md" data-playground-control>
                <span className="text-sm">{weather.stage === 'rain' ? '🌧️' : weather.stage === 'storm' ? '⛈️' : '☀️'}</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">{weather.stage}</span>
              </div>
            </div>
          )}

          {/* ─── Constellation lines SVG ─── */}
          {constellations.lines.length > 0 && (
            <svg className="fixed inset-0 z-[56] pointer-events-none" width="100%" height="100%">
              {constellations.lines.map((line, i) => (
                <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                  stroke="rgba(96,165,250,0.2)" strokeWidth="1" strokeDasharray="4 4"
                  style={{ animation: 'constellationFade 2s ease-in-out infinite alternate' }} />
              ))}
            </svg>
          )}
          {constellations.activePattern && (
            <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[141] pointer-events-none" style={{ animation: 'collectionToastIn 0.5s ease-out both' }}>
              <div className="px-5 py-3 rounded-2xl border border-blue-400/30 bg-blue-500/10 backdrop-blur-xl shadow-2xl">
                <div className="text-sm font-mono font-bold text-blue-300 text-center">
                  ⭐ Constellation: {constellations.activePattern === 'triangle' ? 'Triforce' : 'Polaris'}
                </div>
              </div>
            </div>
          )}

          {/* ─── Boss encounter ─── */}
          {bosses.activeBoss && (
            <div
              className="fixed z-[130] pointer-events-auto cursor-pointer"
              data-playground-control
              onClick={(e) => {
                const result = bosses.clickBoss(e.clientX, e.clientY);
                if (result && result !== 'hit') { collection.onBossDefeated(result); collection.onLifetimeBossDefeat(); }
              }}
              style={{
                left: bosses.activeBoss.x - bosses.activeBoss.size / 2,
                top: bosses.activeBoss.y - bosses.activeBoss.size / 2,
                width: bosses.activeBoss.size,
                height: bosses.activeBoss.size,
                animation: bosses.activeBoss.behavior === 'jitter' ? 'bossJitter 0.1s infinite' : bosses.activeBoss.behavior === 'teleport' ? 'bossTeleport 0.3s ease-out' : 'bossFloat 2s ease-in-out infinite',
              }}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center border-2" style={{
                borderColor: bosses.activeBoss.color,
                background: `radial-gradient(circle, ${bosses.activeBoss.color}20, transparent)`,
                boxShadow: `0 0 30px ${bosses.activeBoss.color}40`,
              }}>
                <span className="text-2xl">{bosses.activeBoss.icon}</span>
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <div className="text-[9px] font-mono px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-center" style={{ color: bosses.activeBoss.color }}>
                  <div>{bosses.activeBoss.name} — HP: {bosses.activeBoss.currentHp}/{bosses.activeBoss.hp}</div>
                  <div className="text-[8px] text-slate-300">phase {bosses.activeBoss.phase}{bosses.arenaEffect ? ` • ${bosses.arenaEffect.label}` : ''}</div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Deadlock orbs ─── */}
          {bosses.activeBoss?.behavior === 'linked' && bosses.bossOrbs.length === 2 && (
            <>
              {/* Chain line between orbs */}
              <svg className="fixed inset-0 z-[129] pointer-events-none" style={{ width: '100vw', height: '100vh' }}>
                <line
                  x1={bosses.bossOrbs[0].x} y1={bosses.bossOrbs[0].y}
                  x2={bosses.bossOrbs[1].x} y2={bosses.bossOrbs[1].y}
                  stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4"
                />
              </svg>
              {bosses.bossOrbs.map((orb, i) => (
                <div
                  key={`deadlock-orb-${i}`}
                  className="fixed z-[131] pointer-events-auto cursor-grab active:cursor-grabbing select-none"
                  data-playground-control
                  style={{
                    left: orb.x - 18,
                    top: orb.y - 18,
                    width: 36,
                    height: 36,
                    animation: 'bossFloat 2s ease-in-out infinite',
                    animationDelay: `${i * 0.5}s`,
                    touchAction: 'none',
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    if (bosses.startDragOrb(e.clientX, e.clientY)) {
                      const onMove = (ev) => bosses.dragOrb(ev.clientX, ev.clientY);
                      const onUp = (ev) => {
                        bosses.releaseDragOrb(ev.movementX, ev.movementY);
                        window.removeEventListener('mousemove', onMove);
                        window.removeEventListener('mouseup', onUp);
                      };
                      window.addEventListener('mousemove', onMove);
                      window.addEventListener('mouseup', onUp);
                    }
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    const touch = e.touches[0];
                    if (bosses.startDragOrb(touch.clientX, touch.clientY)) {
                      let lastX = touch.clientX, lastY = touch.clientY;
                      const onMove = (ev) => {
                        const t = ev.touches[0];
                        lastX = t.clientX; lastY = t.clientY;
                        bosses.dragOrb(t.clientX, t.clientY);
                      };
                      const onEnd = () => {
                        bosses.releaseDragOrb(0, 0);
                        window.removeEventListener('touchmove', onMove);
                        window.removeEventListener('touchend', onEnd);
                      };
                      window.addEventListener('touchmove', onMove, { passive: false });
                      window.addEventListener('touchend', onEnd);
                    }
                  }}
                >
                  <div className="w-full h-full rounded-full flex items-center justify-center border-2" style={{
                    borderColor: i === 0 ? '#A78BFA' : '#7C3AED',
                    background: `radial-gradient(circle, ${i === 0 ? '#A78BFA' : '#7C3AED'}30, transparent)`,
                    boxShadow: `0 0 20px ${i === 0 ? '#A78BFA' : '#7C3AED'}50`,
                  }}>
                    <span className="text-sm">{i === 0 ? '🔒' : '🔑'}</span>
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-[8px] font-mono text-purple-300/60">{i === 0 ? 'LOCK' : 'KEY'}</span>
                  </div>
                </div>
              ))}
              {/* Hint text */}
              <div className="fixed z-[128] bottom-28 left-1/2 -translate-x-1/2 pointer-events-none" data-playground-control>
                <span className="text-[10px] font-mono text-purple-400/50 px-3 py-1 bg-black/40 rounded-full backdrop-blur-sm">
                  ⛓️ Drag the orbs into each other to break the deadlock
                </span>
              </div>
            </>
          )}

          {/* ─── Speedrun challenge HUD ─── */}
          {speedrun.challenge && (
            <div className="fixed bottom-20 right-4 z-[125] w-[220px] rounded-2xl border border-amber-500/20 bg-[#0d1114]/90 backdrop-blur-xl shadow-2xl p-3" data-playground-control style={{ animation: 'playgroundHudIn 0.35s ease-out both' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">⏱ {speedrun.challenge.name}</span>
                <span className="text-[10px] font-mono text-amber-300">{speedrun.getTimeLeft().toFixed(1)}s</span>
              </div>
              <div className="text-[11px] font-mono text-slate-300 mb-2">{speedrun.challenge.desc}</div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-200" style={{ width: `${Math.min(100, (speedrun.challenge.progress / speedrun.challenge.target) * 100)}%` }} />
              </div>
              <div className="text-right text-[9px] font-mono text-amber-400/60 mt-1">{speedrun.challenge.progress}/{speedrun.challenge.target}</div>
            </div>
          )}
          {speedrun.showResult && (
            <div className="fixed bottom-44 right-4 z-[141] pointer-events-none" style={{ animation: 'collectionToastIn 0.5s ease-out both' }}>
              <div className={`px-4 py-2 rounded-xl border backdrop-blur-xl font-mono text-sm font-bold ${speedrun.showResult === 'success' ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300' : 'border-red-400/30 bg-red-500/10 text-red-300'}`}>
                {speedrun.showResult === 'success' ? '✓ Challenge Complete!' : '✗ Time\'s Up!'}
              </div>
            </div>
          )}

          {/* ─── Void dimension overlay ─── */}
          {voidDim.inVoid && (
            <div className="fixed inset-0 z-[50] pointer-events-none" style={{ animation: 'voidEnter 1s ease-out forwards' }}>
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.05), transparent 70%)' }} />
              {/* Void HUD */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[131] flex items-center gap-4 px-4 py-3 rounded-2xl border border-emerald-500/20 bg-black/70 backdrop-blur-xl pointer-events-auto" data-playground-control>
                <div>
                  <div className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider">🕳️ THE VOID</div>
                  <div className="text-[9px] font-mono text-emerald-200/60 mt-1">Depth {voidDim.voidDepth} • Best {voidDim.bestDepth} • Score {voidDim.voidScore}</div>
                </div>
                <span className="text-[10px] font-mono text-emerald-300">{voidDim.voidTimer}s</span>
                <div className="text-[9px] font-mono text-slate-400">
                  Relics {Object.keys(voidDim.relicInventory || {}).length}
                  {voidDim.latestDrop ? <div className="text-emerald-200 mt-1">Latest: {voidDim.latestDrop.label}</div> : null}
                </div>
                <button onClick={() => { const vs = voidDim.exitVoid(); collection.onVoidExit(vs); }} className="px-2 py-0.5 text-[9px] font-mono text-slate-400 border border-white/10 rounded hover:text-white">EXIT</button>
              </div>
              {/* Null Entity */}
              {voidDim.nullEntity && (
                <div className="absolute pointer-events-auto cursor-crosshair" style={{
                  left: voidDim.nullEntity.x - voidDim.nullEntity.radius,
                  top: voidDim.nullEntity.y - voidDim.nullEntity.radius,
                  width: voidDim.nullEntity.radius * 2,
                  height: voidDim.nullEntity.radius * 2,
                  opacity: voidDim.nullEntity.visible ? 0.7 : 0.05,
                  transition: 'opacity 0.2s',
                }}>
                  <div className="w-full h-full rounded-full border border-emerald-400/40 flex items-center justify-center" style={{
                    background: 'radial-gradient(circle, rgba(52,211,153,0.15), transparent)',
                    boxShadow: voidDim.nullEntity.visible ? '0 0 40px rgba(52,211,153,0.3)' : 'none',
                  }}>
                    <span className="text-lg">👁️</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Void eligible hint ─── */}
          {playgroundScore >= voidDim.entryScoreThreshold && !voidDim.inVoid && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] pointer-events-none" style={{ animation: 'whisperFade 4s ease-in-out infinite' }}>
              <span className="text-[10px] font-mono italic text-emerald-400/30">Press V to descend into The Void...</span>
            </div>
          )}

          {/* ─── Speedrun hint ─── */}
          {!speedrun.challenge && playgroundScore >= 500 && (
            <div className="fixed bottom-4 right-4 z-[60] pointer-events-none" style={{ animation: 'whisperFade 6s ease-in-out infinite', animationDelay: '2s' }}>
              <span className="text-[10px] font-mono italic text-amber-400/20">Press T for timed challenge ({speedrun.completedCount} done)</span>
            </div>
          )}
        </>
      )}
      {/* ═══ Boot sequence overlay ═══ */}
      {bootPhase < 2 && (
        <div className={`fixed inset-0 z-[200] bg-[#0a0a0a] flex items-center justify-center ${bootPhase === 1 ? 'boot-fade-out' : ''}`}>
          <div className="w-full max-w-md px-8 space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Terminal className="text-[#58A4B0]" size={18} />
              <span className="text-[#58A4B0] font-mono text-sm font-bold">vectant</span>
            </div>
            <div className="font-mono text-xs space-y-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {bootLines.map((line, i) => (
                <div key={i} className="boot-line-in text-slate-400" style={{ animationDelay: `${i * 0.05}s` }}>
                  {line.includes('\u2713') ? <span className="text-emerald-400">{line}</span> : line}
                </div>
              ))}
            </div>
            <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#58A4B0] to-[#327464] rounded-full transition-all duration-200" style={{ width: `${bootProgress}%` }} />
            </div>
            <div className="text-right text-[10px] font-mono text-slate-600">{Math.round(bootProgress)}%</div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; }
        @keyframes scroll-bounce {
          0%,100% { opacity: 0; transform: translateY(-6px); }
          50% { opacity: 1; transform: translateY(6px); }
        }
        @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
        .cursor-blink { animation: blink 1s infinite; }
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-16px) } }
        .float-animation { animation: float 6s ease-in-out infinite; }

        /* Editor cursor blink */
        .editor-cursor {
          color: #58A4B0;
          animation: blink 0.8s step-end infinite;
          font-weight: 300;
        }

        /* AI line reveal */
        @keyframes aiReveal {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ai-line-reveal { animation: aiReveal 0.4s ease-out both; }
        .ai-line-reveal:nth-child(2) { animation-delay: 0.15s; }

        /* AI badge bloom */
        @keyframes badgeBloom {
          0% { opacity: 0; transform: scale(0.7); }
          60% { opacity: 1; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        .ai-badge-bloom { animation: badgeBloom 0.5s ease-out both; }

        /* Try magic tooltip */
        @keyframes magicAppear {
          0% { opacity: 0; transform: translateY(6px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .magic-tooltip { animation: magicAppear 0.5s ease-out both; }

        /* Rocket launch */
        @keyframes rocketLaunch {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          40% { transform: translateY(-30px) rotate(-5deg); opacity: 1; }
          100% { transform: translateY(-80px) rotate(0deg); opacity: 0; }
        }
        .rocket-launch { animation: rocketLaunch 0.7s ease-in forwards; }

        /* Vapor trail */
        @keyframes vaporFade {
          0% { opacity: 0.8; height: 0px; }
          30% { opacity: 0.6; height: 20px; }
          100% { opacity: 0; height: 40px; }
        }
        .vapor-trail { animation: vaporFade 1s ease-out forwards; }

        /* Border pulse for compile */
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(88, 164, 176, 0.3); box-shadow: 0 0 40px -15px rgba(88, 164, 176, 0.2); }
          50% { border-color: rgba(88, 164, 176, 0.7); box-shadow: 0 0 60px -10px rgba(88, 164, 176, 0.5); }
        }
        .border-pulse { animation: borderGlow 0.8s ease-in-out infinite; }

        /* Terminal slide up */
        @keyframes terminalSlide {
          from { max-height: 0; opacity: 0; }
          to { max-height: 200px; opacity: 1; }
        }
        .terminal-slide { animation: terminalSlide 0.4s ease-out both; }

        /* Build log line appear */
        @keyframes logAppear {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .log-appear { animation: logAppear 0.3s ease-out both; }

        /* CPU meter fill */
        @keyframes cpuFlare {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .cpu-flare { animation: cpuFlare 0.6s ease-in-out infinite; }

        /* Tab dissolve */
        @keyframes codeFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .code-dissolve { animation: codeFadeIn 0.35s ease-out; }

        /* Glowing border effect for premium plan */
        .glow-border { position: relative; }
        .glow-border::before {
          content: '';
          position: absolute;
          bottom: 0; left: 50%;
          height: 2px; width: 0;
          border-radius: 1px;
          background: linear-gradient(90deg, #58A4B0, #327464, #58A4B0);
          transform: translateX(-50%);
          animation: grow-line 1.2s ease-out forwards, pulse-line 3s ease-in-out infinite 1.2s;
        }
        @keyframes grow-line { from { width: 0; } to { width: 100%; left: 0; transform: translateX(0); } }
        @keyframes pulse-line { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }

        /* Animated underline for pricing section title */
        @keyframes drawLine { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
        .draw-line-animated path { animation: drawLine 2s ease-in-out 1.2s forwards; }

        /* Fade in and slide up */
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in-up { animation: fadeInUp 0.5s ease-out; }

        /* ─── Bento spotlight cards ─── */
        .spotlight-card { --mouse-x: 0px; --mouse-y: 0px; }
        .spotlight-overlay {
          position: absolute; inset: 0; border-radius: inherit;
          background: radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(88,164,176,0.08), transparent 40%);
          opacity: 0; transition: opacity 0.4s; pointer-events: none; z-index: 2;
        }
        .spotlight-card:hover .spotlight-overlay { opacity: 1; }

        /* AI code suggestion flow */
        @keyframes aiSuggest { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .ai-suggest-line { animation: aiSuggest 0.6s ease-out both; }
        @keyframes aiIconFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .ai-icon-float { animation: aiIconFloat 3s ease-in-out infinite; }

        /* AI bento card looping typewriter */
        @keyframes aiLineReveal {
          0% { opacity: 0; clip-path: inset(0 100% 0 0); }
          15% { opacity: 1; clip-path: inset(0 0 0 0); }
          75% { opacity: 1; clip-path: inset(0 0 0 0); }
          100% { opacity: 0; clip-path: inset(0 100% 0 0); }
        }
        .ai-line-loop {
          opacity: 0;
          animation: aiLineReveal var(--line-dur) ease-out var(--line-delay) infinite;
        }
        @keyframes aiCursorBlink {
          0%,100% { opacity: 0; } 20%,80% { opacity: 1; }
        }
        .ai-bento-cursor {
          animation: aiCursorBlink 0.8s step-end infinite;
        }

        /* Bug fix animation */
        @keyframes bugFixStrike { from { opacity: 1; } to { opacity: 0.35; } }
        .bug-strike { animation: bugFixStrike 0.3s ease-out both; }
        @keyframes bugFixSlideIn { from { opacity: 0; max-height: 0; transform: translateY(-4px); } to { opacity: 1; max-height: 24px; transform: translateY(0); } }
        .bug-slide-in { animation: bugFixSlideIn 0.4s ease-out both; }
        @keyframes bugBadgePop { 0% { opacity: 0; transform: scale(0.7); } 100% { opacity: 1; transform: scale(1); } }
        .bug-badge-pop { animation: bugBadgePop 0.35s ease-out both; }

        /* Cloud data flow */
        @keyframes cloudPulseMini { 0%,100% { box-shadow: 0 0 0 0 rgba(88,164,176,0.2); } 50% { box-shadow: 0 0 12px 4px rgba(88,164,176,0.15); } }
        .cloud-pulse-mini { animation: cloudPulseMini 2s ease-in-out infinite; }
        @keyframes dotFlow { 0% { transform: translateX(-12px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(12px); opacity: 0; } }
        .cloud-dot-flow { animation: dotFlow 1.5s ease-in-out infinite; }

        /* Collaboration cursors */
        @keyframes collabBlink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        .collab-blink { animation: collabBlink 1s step-end infinite; }
        @keyframes collabPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        .collab-pulse { animation: collabPulse 2s ease-in-out infinite; }

        /* Waitlist card glow */
        @keyframes waitlistGlow { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        .waitlist-glow-border { animation: waitlistGlow 3s ease-in-out infinite; }

        /* Shooting star */
        @keyframes shootingStarTravel {
          0% { transform: translate(0, 0) rotate(215deg) scaleX(1); opacity: 0.8; }
          60% { opacity: 0.6; }
          100% { transform: translate(280px, 280px) rotate(215deg) scaleX(1.6); opacity: 0; }
        }
        .shooting-star {
          height: 1px; width: 60px;
          background: linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0.1), transparent);
          border-radius: 1px;
          animation: shootingStarTravel 1.2s linear forwards;
        }

        /* HMR card animations */
        @keyframes hmrPulseDot { 0%, 100% { opacity: 0.4; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.3); } }
        .hmr-pulse-dot { animation: hmrPulseDot 1.2s ease-in-out infinite; }
        @keyframes hmrPreviewFlash { 0%, 100% { border-color: rgba(88,164,176,0.2); } 50% { border-color: rgba(88,164,176,0.5); box-shadow: 0 0 16px rgba(88,164,176,0.15); } }
        .hmr-preview-flash { animation: hmrPreviewFlash 2s ease-in-out infinite; }
        @keyframes hmrSlideIn { from { opacity: 0; max-height: 0; transform: translateY(-4px); } to { opacity: 1; max-height: 24px; transform: translateY(0); } }
        .hmr-slide-in { animation: hmrSlideIn 0.4s ease-out both; }
        @keyframes hmrStrike { from { opacity: 1; } to { opacity: 0.35; } }
        .hmr-strike { animation: hmrStrike 0.3s ease-out both; }

        /* ─── Pricing card spotlight + micro-grid ─── */
        .pricing-card { --mouse-x: 0px; --mouse-y: 0px; position: relative; }
        .pricing-spotlight {
          position: absolute; inset: 0; border-radius: inherit;
          background: radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(88,164,176,0.06), transparent 45%);
          opacity: 0; transition: opacity 0.5s; pointer-events: none; z-index: 2;
        }
        .pricing-card:hover .pricing-spotlight { opacity: 1; }
        .pricing-grid {
          position: absolute; inset: 0; border-radius: inherit; overflow: hidden;
          pointer-events: none; z-index: 1;
        }
        .pricing-grid::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 24px 24px;
          mask-image: radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), black 0%, transparent 70%);
          -webkit-mask-image: radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), black 0%, transparent 70%);
          opacity: 0; transition: opacity 0.5s;
        }
        .pricing-card:hover .pricing-grid::before { opacity: 1; }

        /* Animated teal border for Pro card */
        @keyframes proEdgeFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        .pro-card-border { position: relative; }
        .pro-card-border::before {
          content: ''; position: absolute; inset: -1px; border-radius: inherit; z-index: 0;
          background: linear-gradient(90deg, rgba(88,164,176,0.15), rgba(88,164,176,0.5), rgba(50,116,100,0.5), rgba(88,164,176,0.15), rgba(88,164,176,0.5));
          background-size: 300% 100%;
          animation: proEdgeFlow 4s linear infinite;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: xor;
          padding: 1px;
        }

        /* ─── Cascading value reveal ─── */
        .cascade-check {
          transform: scale(0.85); opacity: 0.5;
          transition: transform 0.5s ease-out, opacity 0.5s ease-out;
        }
        .cascade-text {
          opacity: 0.6; transform: translateX(-3px);
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        }
        @keyframes cascadePing {
          0% { transform: scale(0.85); opacity: 0.5; }
          50% { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pricing-card:hover .cascade-check { animation: cascadePing 0.35s ease-out forwards; }
        .pricing-card:hover .cascade-text { opacity: 1; transform: translateX(0); }
        .pricing-card:hover .cascade-item:nth-child(1) .cascade-check { animation-delay: 0s; }
        .pricing-card:hover .cascade-item:nth-child(1) .cascade-text { transition-delay: 0s; }
        .pricing-card:hover .cascade-item:nth-child(2) .cascade-check { animation-delay: 0.07s; }
        .pricing-card:hover .cascade-item:nth-child(2) .cascade-text { transition-delay: 0.07s; }
        .pricing-card:hover .cascade-item:nth-child(3) .cascade-check { animation-delay: 0.14s; }
        .pricing-card:hover .cascade-item:nth-child(3) .cascade-text { transition-delay: 0.14s; }
        .pricing-card:hover .cascade-item:nth-child(4) .cascade-check { animation-delay: 0.21s; }
        .pricing-card:hover .cascade-item:nth-child(4) .cascade-text { transition-delay: 0.21s; }
        .pricing-card:hover .cascade-item:nth-child(5) .cascade-check { animation-delay: 0.28s; }
        .pricing-card:hover .cascade-item:nth-child(5) .cascade-text { transition-delay: 0.28s; }

        /* ─── Magnetic tilt for Pro card ─── */
        .pro-tilt { transition: transform 0.15s ease-out; will-change: transform; transform-style: preserve-3d; }

        /* ─── FAQ accordion ─── */
        .faq-answer {
          display: grid; grid-template-rows: 0fr;
          transition: grid-template-rows 0.35s ease-out, opacity 0.3s ease-out;
          opacity: 0;
        }
        .faq-answer.open { grid-template-rows: 1fr; opacity: 1; }
        .faq-answer > div { overflow: hidden; }

        /* ─── Command palette Easter egg ─── */
        @keyframes cmdPaletteIn {
          0% { opacity: 0; transform: translateY(-12px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cmdPaletteOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: translateY(-8px) scale(0.97); }
        }
        .cmd-palette-in { animation: cmdPaletteIn 0.25s ease-out forwards; }
        .cmd-palette-out { animation: cmdPaletteOut 0.3s ease-in forwards; }
        @keyframes cmdScan {
          0% { width: 0%; } 100% { width: 100%; }
        }
        .cmd-scan-bar { animation: cmdScan 2s ease-out forwards; }

        /* ─── No-tracking badge ─── */
        @keyframes badgeSlideUp {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .badge-slide-up { animation: badgeSlideUp 0.4s ease-out both; }

        /* ─── Star twinkle ─── */
        @keyframes starTwinkle {
          0%, 100% { opacity: var(--base-opacity); transform: scale(1); }
          50% { opacity: calc(var(--base-opacity) + 0.2); transform: scale(1.6); filter: blur(0.5px); }
        }

        /* ─── Nebula breathing ─── */
        @keyframes nebulaBreath {
          0%, 100% { transform: scale(1); opacity: var(--base-o); }
          50% { transform: scale(1.08); opacity: calc(var(--base-o) + 0.015); }
        }

        /* ─── Aurora wave ─── */
        @keyframes auroraWave {
          0% { transform: translateX(-5%) skewX(-3deg) scaleY(1); opacity: var(--a-opacity); }
          25% { transform: translateX(2%) skewX(2deg) scaleY(1.15); opacity: calc(var(--a-opacity) + 0.01); }
          50% { transform: translateX(5%) skewX(-1deg) scaleY(0.9); opacity: var(--a-opacity); }
          75% { transform: translateX(-2%) skewX(3deg) scaleY(1.1); opacity: calc(var(--a-opacity) + 0.008); }
          100% { transform: translateX(-5%) skewX(-3deg) scaleY(1); opacity: var(--a-opacity); }
        }

        /* ─── Drifting particles ─── */
        @keyframes driftFloat {
          0% { transform: translate(0, 0); opacity: var(--d-opacity); }
          50% { opacity: calc(var(--d-opacity) + 0.03); }
          100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
        }

        /* ─── Comet ─── */
        @keyframes cometTravel {
          0% { transform: translate(0, 0) rotate(210deg) scaleX(1); opacity: 0; }
          8% { opacity: 0.9; }
          70% { opacity: 0.5; }
          100% { transform: translate(500px, 500px) rotate(210deg) scaleX(2); opacity: 0; }
        }
        .comet {
          height: 2px; width: 120px;
          background: linear-gradient(90deg, rgba(88,164,176,0.9), rgba(88,164,176,0.4), rgba(255,255,255,0.1), transparent);
          border-radius: 2px;
          animation: cometTravel 3s linear forwards;
          filter: blur(0.5px);
        }
        .comet::before {
          content: ''; position: absolute; left: -3px; top: -2px;
          width: 6px; height: 6px; border-radius: 50%;
          background: radial-gradient(circle, rgba(88,164,176,0.8), transparent);
          filter: blur(1px);
        }

        /* ─── Boot sequence ─── */
        @keyframes bootFadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.02); pointer-events: none; }
        }
        @keyframes bootLineIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .boot-line-in { animation: bootLineIn 0.25s ease-out both; }
        @keyframes bootProgressFill {
          from { width: 0%; }
        }
        .boot-fade-out { animation: bootFadeOut 0.6s ease-in forwards; }

        /* ─── Section divider morphs ─── */
        @keyframes dividerDraw {
          from { stroke-dashoffset: 800; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes dividerPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        /* ─── Scroll text reveal / cipher decode ─── */
        @keyframes revealChar {
          0% { opacity: 0; transform: translateY(8px) rotateX(40deg); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) rotateX(0deg); filter: blur(0); }
        }
        .text-reveal span { display: inline-block; opacity: 0; animation: revealChar 0.5s ease-out forwards; }
        .text-reveal-hidden span { opacity: 0; }

        /* ─── Sticky CTA ─── */
        @keyframes stickySlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes stickySlideDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }

        /* ─── Language carousel ─── */
        @keyframes langSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ─── Roadmap timeline ─── */
        @keyframes timelineDotPing {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        /* ─── Shortcut sheet ─── */
        @keyframes sheetIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes sheetOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.95) translateY(8px); }
        }

        /* ─── Share modal ─── */
        @keyframes shareModalIn {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          60% { opacity: 1; transform: scale(1.02) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shareBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shareBtnIn {
          from { opacity: 0; transform: translateY(12px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shareCheckPop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shareRing {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes shareSparkle {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--sx), var(--sy)) scale(0); opacity: 0; }
        }
        @keyframes shareGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(88,164,176,0.15); }
          50% { box-shadow: 0 0 40px rgba(88,164,176,0.3); }
        }

        /* ─── Waitlist position ─── */
        @keyframes positionPop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes positionBar {
          from { width: 0%; }
          to { width: 100%; }
        }

        /* ─── Deploy terminal ─── */
        @keyframes deployLineIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes deployBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes deployConfetti {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(var(--cx), var(--cy)) rotate(var(--cr)) scale(0); opacity: 0; }
        }
        @keyframes deployLivePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4); }
          50% { box-shadow: 0 0 12px 4px rgba(52, 211, 153, 0.2); }
        }

        /* ─── Playground mode ─── */
        @keyframes playgroundBorder {
          0%, 100% { border-color: rgba(88,164,176,0.3); }
          50% { border-color: rgba(88,164,176,0.6); }
        }
        @keyframes playgroundHudIn {
          0% { transform: translateY(-10px) scale(0.98); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes utilityDockPulse {
          0%, 100% { transform: translateY(0) scale(1); box-shadow: 0 12px 28px rgba(0,0,0,0.18); }
          50% { transform: translateY(-2px) scale(1.02); box-shadow: 0 0 0 6px rgba(88,164,176,0.08), 0 0 26px rgba(88,164,176,0.18); }
        }
        @keyframes playgroundBadge {
          0% { transform: translateY(-10px) scale(0.9); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes playgroundCorePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(88,164,176,0.08), 0 0 40px rgba(88,164,176,0.08); }
          50% { box-shadow: 0 0 0 14px rgba(88,164,176,0.02), 0 0 60px rgba(88,164,176,0.14); }
        }
        @keyframes playgroundSpark {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(0.6); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.3); }
        }

        /* ─── Phase 2: Arena Mutation animations ─── */
        @keyframes arenaMutationFlash {
          0% { background: rgba(255,107,107,0.15); }
          100% { background: transparent; }
        }
        @keyframes arenaMutationText {
          0% { opacity: 0; transform: scale(1.3); }
          10% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: scale(0.95) translateY(-10px); }
        }

        /* ─── Crate animations ─── */
        @keyframes crateGlitchIn {
          0% { opacity: 0; transform: scale(0.3) rotate(-15deg); filter: blur(6px) hue-rotate(90deg); }
          30% { opacity: 1; transform: scale(1.15) rotate(3deg); filter: blur(0) hue-rotate(0deg); }
          50% { transform: scale(0.95) rotate(-1deg) skewX(2deg); }
          70% { transform: scale(1.04) rotate(0.5deg) skewX(-1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg) skewX(0deg); filter: none; }
        }
        @keyframes crateTextFlicker {
          0%, 100% { opacity: 0.6; }
          5% { opacity: 0.1; }
          6% { opacity: 0.7; }
          48% { opacity: 0.6; }
          50% { opacity: 0.15; }
          52% { opacity: 0.6; }
          80% { opacity: 0.6; }
          82% { opacity: 0.2; }
          84% { opacity: 0.7; }
        }

        /* ─── Milestone counter ─── */
        @keyframes milestoneGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(88,164,176,0); }
          50% { box-shadow: 0 0 20px 4px rgba(88,164,176,0.15); }
        }

        /* ─── Stats counter spring ─── */
        @keyframes countSlideUp {
          0% { opacity: 0; transform: translateY(20px); }
          60% { opacity: 1; transform: translateY(-3px); }
          80% { transform: translateY(1px); }
          100% { transform: translateY(0); }
        }

        /* ─── Section particle burst ─── */
        @keyframes particleBurst {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--bx), var(--by)) scale(0); }
        }
        .burst-particle {
          position: absolute;
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(88, 164, 176, 0.8);
          animation: particleBurst 0.8s ease-out forwards;
          pointer-events: none;
        }

        /* ─── Nav dot pulse ─── */
        @keyframes navDotPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(88,164,176,0.4); }
          50% { box-shadow: 0 0 8px 3px rgba(88,164,176,0.2); }
        }

        /* ─── Before/after slider glow ─── */
        @keyframes sliderGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(88,164,176,0.3); }
          50% { box-shadow: 0 0 16px rgba(88,164,176,0.6); }
        }

        /* ─── Mobile dock ─── */
        @keyframes dockSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* ─── Konami Matrix rain ─── */
        @keyframes matrixFadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes matrixFadeOut {
          from { opacity: 1; } to { opacity: 0; }
        }
        @keyframes matrixDrop {
          0% { transform: translateY(-100%); opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .matrix-overlay {
          animation: matrixFadeIn 0.3s ease-out;
        }
        .matrix-overlay.fading {
          animation: matrixFadeOut 0.6s ease-in forwards;
        }
        .matrix-col {
          animation: matrixDrop var(--drop-dur) linear var(--drop-delay) infinite;
        }

        /* ─── Sasha easter egg ─── */
        @keyframes sashaFlash {
          0% { opacity: 0; }
          8% { opacity: 1; }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
        .sasha-bg { animation: sashaFlash 5s ease-in-out forwards; }

        /* ─── Back to top ─── */
        @keyframes bttFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bttFadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(8px); }
        }

        /* ─── Collection system animations ─── */
        @keyframes journalSlideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes journalRainbow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        @keyframes collectionToastIn {
          0% { opacity: 0; transform: translate(-50%, -20px) scale(0.9); }
          60% { opacity: 1; transform: translate(-50%, 4px) scale(1.02); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        @keyframes glitchFlicker {
          0%, 90%, 100% { opacity: 0.15; }
          92% { opacity: 0.6; transform: translateX(2px); }
          94% { opacity: 0.1; transform: translateX(-1px); }
          96% { opacity: 0.5; }
          98% { opacity: 0.2; transform: translateX(1px); }
        }
        @keyframes whisperFade {
          0%, 100% { opacity: 0; }
          40%, 60% { opacity: 0.3; }
        }
        @keyframes proximityGlitch {
          0%, 85%, 100% { opacity: var(--prox-base, 0.15); transform: translate(0, 0); }
          87% { opacity: 0.6; transform: translate(1px, -1px) skewX(1deg); }
          89% { opacity: 0.1; transform: translate(-2px, 1px); }
          91% { opacity: 0.7; transform: translate(2px, 0) skewX(-0.5deg); }
          93% { opacity: 0.15; transform: translate(-1px, -1px); }
          95% { opacity: 0.5; transform: translate(0, 2px); }
        }
        @keyframes mythicAuroraIn {
          0% { opacity: 0; }
          30% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes mythicItemReveal {
          0% { opacity: 0; transform: scale(0.3); filter: blur(20px); }
          60% { opacity: 1; transform: scale(1.1); filter: blur(0); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }

        /* ─── Wave 2 keyframes ─── */
        @keyframes rainFall {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes lightningFlash {
          0% { opacity: 0.8; }
          50% { opacity: 0.3; }
          100% { opacity: 0; }
        }
        @keyframes solarPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes bossJitter {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 1px); }
          50% { transform: translate(1px, -2px); }
          75% { transform: translate(2px, 1px); }
        }
        @keyframes bossTeleport {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes bossFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes constellationFade {
          0% { opacity: 0.1; }
          100% { opacity: 0.35; }
        }
        @keyframes voidEnter {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* Top nav */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#131112]/80 backdrop-blur-md border-b border-[#E5E5E5]/5">
        <div className="px-8 py-4 flex items-center">
          <div className="flex items-center cursor-pointer select-none" onClick={handleLogoClick}>
            <img
              src="/Vectant-logo-full-black.svg"
              alt="Vectant logo"
              className="h-7 w-auto max-w-[180px] inline-block object-contain"
            />
          </div>
          {/* Playground mode badge */}
          {playgroundMode && (
            <div className="ml-3 px-2.5 py-1 bg-[#58A4B0]/10 border border-[#58A4B0]/30 rounded-full text-[10px] font-mono text-[#58A4B0] tracking-wider" style={{ animation: 'playgroundBadge 0.3s ease-out' }}>
              PLAYGROUND
            </div>
          )}
          {/* Ambient sound toggle */}
          <button
            onClick={toggleAmbient}
            className="ml-auto text-slate-500 hover:text-[#58A4B0] transition-colors p-1.5 rounded-lg hover:bg-white/[0.04]"
            aria-label={ambientOn ? 'Mute ambient sound' : 'Enable ambient sound'}
          >
            {ambientOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>
      </div>

      {/* Floating rocket progress indicator */}
      <div
        className="fixed right-4 z-50 transition-all duration-300 ease-out hidden md:flex flex-col items-center gap-3"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: scrollProgress > 3 ? 1 : 0,
        }}
      >
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollToSection(s.id)}
            className="group relative flex items-center"
            aria-label={`Navigate to ${s.label} section`}
          >
            <span className={`block w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === s.id
                ? 'bg-[#58A4B0] scale-125'
                : 'bg-white/20 hover:bg-white/40'
            }`} style={activeSection === s.id ? { animation: 'navDotPulse 2s ease-in-out infinite' } : {}} />
            <span className="absolute right-5 bg-[#1a1a1a]/90 border border-white/10 rounded px-2 py-1 text-[10px] text-slate-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {s.label}
            </span>
          </button>
        ))}
        {/* Thin progress line with rocket */}
        <div className="relative mt-1 flex flex-col items-center">
          <div className="w-px h-8 bg-white/[0.06] rounded-full overflow-hidden relative">
            <div className="w-full bg-[#58A4B0]/40 rounded-full transition-all duration-300" style={{ height: `${scrollProgress}%` }} />
          </div>
          <Rocket size={10} className="text-[#58A4B0] mt-1.5 transition-all duration-300" style={{ opacity: 0.6 + scrollProgress * 0.004, transform: `rotate(${-45 + scrollProgress * 0.9}deg)` }} />
        </div>
      </div>

      {/* Base dark background */}
      <div
        className={`fixed inset-0 transition-opacity duration-500 ${sashaEaster ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundColor: '#131112' }}
      />

      {/* Grain texture overlay (no mix-blend-mode for perf) */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: 'url(/noise.svg)',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.025,
        }}
      />
      {sashaEaster && (
        <div
          className="sasha-bg fixed inset-0"
          style={{
            backgroundImage: 'url(/sasha.png)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}

      {/* Distant planet - large blurred sphere */}
      <div ref={parallaxPlanetRef} className="fixed inset-0 pointer-events-none overflow-hidden" style={{ willChange: 'transform' }}>
        <div className="absolute" style={{ top: '12%', right: '8%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, rgba(88,164,176,0.06), rgba(50,116,100,0.03) 50%, transparent 70%)', filter: 'blur(40px)' }} />
        {/* subtle ring */}
        <div className="absolute" style={{ top: 'calc(12% + 120px)', right: 'calc(8% - 40px)', width: 360, height: 30, borderRadius: '50%', border: '1px solid rgba(88,164,176,0.03)', transform: 'rotateX(75deg)' }} />
      </div>

      {/* Deep space - static star field with twinkling */}
      <div ref={parallaxStarsRef} className="fixed inset-0 pointer-events-none" style={{ willChange: 'transform' }}>
        {mounted && stars.map((s, i) => (
          <div key={i} className="absolute rounded-full bg-white" style={{
            left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size,
            opacity: s.opacity,
            '--base-opacity': s.opacity,
            ...(s.twinkle ? { animation: `starTwinkle ${s.twinkleDuration}s ease-in-out ${s.twinkleDelay}s infinite` } : {}),
          }} />
        ))}
      </div>

      {/* Star clusters - denser regions */}
      <div ref={parallaxClustersRef} className="fixed inset-0 pointer-events-none" style={{ willChange: 'transform' }}>
        {mounted && starClusters.map((s, i) => (
          <div key={`cl-${i}`} className="absolute rounded-full bg-white" style={{
            left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size,
            opacity: s.opacity,
            '--base-opacity': s.opacity,
            ...(s.twinkle ? { animation: `starTwinkle ${s.twinkleDuration}s ease-in-out ${s.twinkleDelay}s infinite` } : {}),
          }} />
        ))}
      </div>

      {/* Aurora ribbons - slow undulating gradient bands */}
      <div ref={parallaxAuroraRef} className="fixed inset-0 pointer-events-none overflow-hidden" style={{ willChange: 'transform' }}>
        {mounted && auroraRibbons.map((r, i) => (
          <div key={`aurora-${i}`} className="absolute" style={{
            top: `${r.top}%`, left: `${r.left}%`, width: `${r.width}%`, height: r.height,
            background: `linear-gradient(90deg, transparent, rgba(${r.hue},${r.opacity}), rgba(${r.hue},${r.opacity * 1.5}), rgba(${r.hue},${r.opacity}), transparent)`,
            filter: 'blur(60px)',
            '--a-opacity': r.opacity,
            animation: `auroraWave ${r.duration}s ease-in-out ${r.delay}s infinite`,
          }} />
        ))}
      </div>

      {/* Nebula dust clouds - with breathing + mouse parallax */}
      <div ref={parallaxNebulaRef} className="fixed inset-0 overflow-hidden pointer-events-none" style={{
        willChange: 'transform',
        transition: 'transform 0.3s ease-out',
      }}>
        <div className="absolute top-[20%] left-[30%] w-[800px] h-[800px] bg-[#58A4B0] rounded-full blur-[200px]"
          style={{ '--base-o': '0.04', opacity: 0.04, animation: 'nebulaBreath 18s ease-in-out infinite' }} />
        <div className="absolute bottom-[10%] right-[15%] w-[600px] h-[600px] bg-[#327464] rounded-full blur-[180px]"
          style={{ '--base-o': '0.05', opacity: 0.05, animation: 'nebulaBreath 22s ease-in-out 4s infinite' }} />
      </div>

      {/* Drifting particles - tiny floating motes (reduced on mobile) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden hidden sm:block">
        {mounted && driftParticles.map((p, i) => (
          <div key={`drift-${i}`} className="absolute rounded-full bg-white/80" style={{
            left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
            '--d-opacity': p.opacity, '--dx': `${p.dx}px`, '--dy': `${p.dy}px`,
            opacity: p.opacity,
            animation: `driftFloat ${p.duration}s linear ${p.delay}s infinite`,
          }} />
        ))}
      </div>

      {/* Shooting star */}
      {shootingStar && (
        <div
          key={shootingStar.id}
          className={`fixed z-0 shooting-star ${playgroundMode ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'}`}
          style={{ left: `${shootingStar.x}%`, top: `${shootingStar.y}%`, width: playgroundMode ? '40px' : undefined, height: playgroundMode ? '40px' : undefined }}
          onClick={playgroundMode ? () => collection.onShootingStarClick() : undefined}
        />
      )}

      {/* Comet - longer, glowing, rarer */}
      {comet && (
        <div key={comet.id} className="fixed pointer-events-none z-0 comet" style={{ left: `${comet.x}%`, top: `${comet.y}%` }} />
      )}

      {/* Subtle gradient for depth */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#131112]/50 to-[#131112] pointer-events-none" />

      {/* Scroll-driven darkness overlay (capped so it never becomes pure black) */}
      <div
        ref={overlayRef}
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,${overlayOpacity * 0.35}) 0%, rgba(0,0,0,${overlayOpacity}) 100%)`,
        }}
      />

      {/* Scroll indicator (chevron) */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 bottom-5 z-60 transition-all duration-400 ${showScrollIndicator ? 'opacity-100' : 'opacity-0 -translate-y-6 pointer-events-none'
          }`}
        aria-hidden={!showScrollIndicator}
      >
        <div className="flex flex-col items-center">
          <div className="rounded-full -pb-4 text-[#AFAFAF]">
            <ChevronDown className="animate-scroll-bounce animate-bounce" size={22} />
          </div>
        </div>
      </div>

      {/* Main content - hero section */}
      <div ref={heroRef} className="relative z-10 flex items-center justify-center min-h-screen px-6 md:px-12 lg:px-20">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Left: text content */}
          <div className="flex flex-col items-start">
            {/* Operational status indicator */}
            <div
              className={`flex items-center gap-2 mb-2 ml-0.5 transition-all duration-700 ease-out ${bootPhase === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className="text-emerald-400 text-sm font-medium">All systems operational</span>
              {/* Ghost Process collectible */}
              {playgroundMode && !collection.has('ghost_process') && (
                <span
                  onClick={(e) => { e.stopPropagation(); collection.onGhostProcess(); }}
                  className="ml-2 text-[10px] font-mono cursor-pointer select-none"
                  data-secret-proximity="true"
                  data-base-opacity="0.15"
                  data-default-animation="whisperFade 6s ease-in-out infinite 2s"
                  style={{ color: '#A78BFA', opacity: 0.15, animation: 'whisperFade 6s ease-in-out infinite', animationDelay: '2s' }}
                >PID 0</span>
              )}
            </div>
            {/* Headline with typewriter effect */}
            <div
              className={`space-y-2 pr-12 transition-all duration-700 ease-out ${bootPhase === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <h1 className="text-xl sm:text-xl md:text-2xl lg:text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight leading-[1.05]">
                {typewriterText}
                {!showSecondLine && typewriterText.length < firstLine.length && <span className="cursor-blink text-white">|</span>}
              </h1>
              {showSecondLine && (
                <h1 className="text-xl sm:text-xl md:text-2xl lg:text-7xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight leading-[1.05]">
                  {secondLineText}
                  {!typewriterComplete && secondLineText.length < secondLine.length && <span className="cursor-blink text-white">|</span>}
                  {typewriterComplete && <span className="cursor-blink text-white">|</span>}
                </h1>
              )}
            </div>
            {/* Subheading */}
            <p
              className={`text-slate-400 text-lg md:text-xl mt-6 max-w-xl leading-relaxed transition-all duration-700 ease-out ${bootPhase === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '400ms' }}
            >
              Built so you can focus on your ideas. It handles the rest itself. You&apos;ll love it.
            </p>
            {/* Join waitlist button */}
            <div
              className={`flex gap-4 mt-6 transition-all duration-700 ease-out ${bootPhase === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '600ms' }}
            >
              <button
                onClick={scrollToBottom}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="group relative px-6 md:px-8 py-3.5 bg-white text-black font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                style={{ transition: 'transform 0.2s ease-out' }}
              >
                <span className="relative z-10 font-mono text-sm tracking-wide">JOIN WAITLIST</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#E5E5E5] to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>

          {/* Right: Interactive IDE Window */}
          <div
            className={`relative transition-all duration-700 ease-out ${bootPhase === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '800ms' }}
          >
            {/* "Click to edit" tooltip */}
            {ghostTypingDone && !isEditorActive && !isCompiling && (
              <div className="absolute -top-10 right-4 z-20 magic-tooltip">
                <div className="bg-[#58A4B0]/20 text-[#58A4B0] border border-[#58A4B0]/50 px-3 py-1 rounded-full text-xs font-bold animate-pulse whitespace-nowrap">
                  ⌨ Click to edit - language auto-detects
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#58A4B0]/50" />
              </div>
            )}

            <div
              className={`relative bg-[#1A1A1A]/80 backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${borderPulse ? 'border-pulse border-[#58A4B0]/50' : 'border-white/10'}`}
              style={{ boxShadow: `0 0 80px -20px ${langGlow}` }}
            >
              {/* Title bar: dots + detected language + run button */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#1A1A1A]/60">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-3">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">auto-detects language</span>
                </div>
                <div className="relative">
                  <button
                    onClick={handleRunClick}
                    disabled={isCompiling}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all duration-300 cursor-pointer ${
                      isCompiling
                        ? 'bg-[#58A4B0]/30 text-[#58A4B0]/60'
                        : 'bg-[#58A4B0] text-black hover:bg-[#6BB8C4] hover:shadow-lg hover:shadow-[#58A4B0]/30'
                    }`}
                  >
                    <span className={`relative ${rocketLaunched ? 'rocket-launch' : ''}`}>
                      <Rocket size={13} />
                    </span>
                    {rocketLaunched && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#58A4B0]/60 to-transparent vapor-trail" />
                    )}
                    <Play size={11} />
                    <span>{isCompiling ? 'Running...' : 'Run'}</span>
                  </button>
                </div>
              </div>

              {/* Code editor: highlighted display + textarea overlay */}
              <div className="relative min-h-[180px] sm:min-h-[260px]">
                {/* Highlighted display layer */}
                <div className="absolute inset-0 py-4 pl-2 pr-4 font-mono text-[11px] sm:text-[13px] leading-5 sm:leading-6 overflow-hidden pointer-events-none" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {renderHighlightedCode()}
                  {showAiSuggestion && (
                    <div className="ai-line-reveal mt-1">
                      <div className="flex">
                        <span className="w-8 text-right text-slate-600 select-none flex-shrink-0 pr-3">{editorLines.length + 1}</span>
                        <span className="text-[#58A4B0]/50 italic">{`// ✦ Vectant AI: ${aiSuggestion.comment}`}</span>
                      </div>
                      <div className="flex">
                        <span className="w-8 text-right text-slate-600 select-none flex-shrink-0 pr-3">{editorLines.length + 2}</span>
                        <span className="text-[#58A4B0]/50 italic">{aiSuggestion.code}</span>
                      </div>
                      <span className="inline-flex items-center bg-[#58A4B0]/20 text-[#58A4B0] border border-[#58A4B0]/40 px-2 py-0.5 rounded text-[10px] font-bold ai-badge-bloom ml-10 mt-1">AI Optimized</span>
                    </div>
                  )}
                </div>
                {/* Editable textarea layer */}
                <textarea
                  ref={editorRef}
                  className="relative w-full min-h-[180px] sm:min-h-[260px] py-4 pl-10 pr-4 font-mono text-[11px] sm:text-[13px] leading-5 sm:leading-6 bg-transparent text-transparent caret-[#58A4B0] resize-none outline-none z-10"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  value={editorCode}
                  onChange={handleEditorChange}
                  onFocus={handleEditorFocus}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                />
              </div>

              {/* Hardware visualizer widget (appears during compile) */}
              {(isCompiling || cloudCpu > 0) && (
                <div className="absolute top-14 right-3 bg-[#0d0d0d]/90 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono space-y-1.5 z-10" style={{ backdropFilter: 'blur(8px)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Local CPU</span>
                    <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-600 rounded-full" style={{ width: '1%' }} />
                    </div>
                    <span className="text-slate-500 w-6 text-right">1%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#58A4B0]">Vectant Cloud</span>
                    <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full bg-[#58A4B0] rounded-full transition-all duration-300 ${isCompiling ? 'cpu-flare' : ''}`} style={{ width: `${cloudCpu}%` }} />
                    </div>
                    <span className="text-[#58A4B0] w-6 text-right">{cloudCpu}%</span>
                  </div>
                </div>
              )}

              {/* Terminal output tray */}
              {(isCompiling || showOutput) && (
                <div className="border-t border-white/5 bg-[#0d0d0d] terminal-slide">
                  <div className="flex items-center gap-2 px-4 py-1.5 border-b border-white/5">
                    <span className="text-[10px] font-mono text-slate-500">TERMINAL</span>
                  </div>
                  <div className="px-4 py-3 font-mono text-xs space-y-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {BUILD_LOGS.slice(0, buildLogIndex).map((log, i) => (
                      <div key={i} className="log-appear" style={{ animationDelay: `${i * 0.1}s` }}>
                        <span className="text-slate-500">$ </span>
                        <span className="text-slate-400">{log.text}</span>
                      </div>
                    ))}
                    {showOutput && (
                      <div className="log-appear mt-1">
                        <span className="text-emerald-400 font-bold">✓ </span>
                        <span className="text-emerald-400">{langOutput}</span>
                      </div>
                    )}
                    {isCompiling && !showOutput && (
                      <span className="inline-block w-2 h-3.5 bg-[#58A4B0] animate-pulse" />
                    )}
                  </div>
                </div>
              )}

              {/* man vectant output */}
              {editorHelpOutput && (
                <div className="border-t border-emerald-500/20 bg-[#0a0f0a]" style={{ maxHeight: 320, overflowY: 'auto' }}>
                  <div className="px-4 py-3 font-mono text-xs space-y-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {editorHelpOutput.map((line, i) => (
                      <div key={i} className="log-appear" style={{ animationDelay: `${i * 0.03}s` }}>
                        <span style={{ color: line.startsWith('$') ? '#34d399' : line.startsWith('  "') ? '#64748b' : line === line.toUpperCase() && line.trim() ? '#94a3b8' : '#cbd5e1' }}>{line || '\u00A0'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom status bar */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 bg-[#1A1A1A]/60 text-xs text-slate-500 font-mono">
                <span>Ln {editorLines.length}</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${showAiSuggestion ? 'bg-[#58A4B0]' : 'bg-slate-600'}`} />
                    {showAiSuggestion ? 'AI Active' : 'AI Ready'}
                  </span>
                  <span>UTF-8</span>
                  <span>{detectedLang}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Animated Stats Counter Bar ═══ */}
      <div ref={statsRef} className="relative z-10 py-16 px-6 md:px-20" style={getDragStyle('stats')} onMouseDown={(e) => playgroundDragStart('stats', e)} onTouchStart={(e) => playgroundDragStart('stats', e)}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {STAT_TARGETS.map((stat, i) => (
            <div
              key={i}
              {...getPlaygroundItemProps(`stats-card-${i}`)}
              className="text-center"
              style={withPlaygroundStyle(`stats-card-${i}`, {
                animation: statsVisible ? `countSlideUp 0.7s ease-out ${i * 120}ms both` : 'none',
                opacity: statsVisible ? undefined : 0,
              })}
            >
              <div className="text-3xl md:text-4xl font-bold text-white font-mono">
                {stat.prefix}{stat.decimals > 0 ? counterValues[i].toFixed(stat.decimals) : counterValues[i]}{stat.suffix}
              </div>
              <div className="text-slate-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Section divider: Hero → Business ═══ */}
      <div className="relative z-10 w-full overflow-hidden" style={{ height: 60 }}>
        <svg className="w-full h-full" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none">
          <path d="M0,30 C200,10 400,50 600,30 C800,10 1000,50 1200,30" stroke="url(#divGrad1)" strokeWidth="1" strokeDasharray="800" style={{ animation: businessVisible ? 'dividerDraw 2s ease-out forwards' : 'none', strokeDashoffset: 800 }} />
          <defs><linearGradient id="divGrad1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="rgba(88,164,176,0)" /><stop offset="50%" stopColor="rgba(88,164,176,0.3)" /><stop offset="100%" stopColor="rgba(88,164,176,0)" /></linearGradient></defs>
        </svg>
      </div>

      {/* Business Model */}
      <div ref={businessRef} className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-20 py-20 md:py-32" style={getDragStyle('pricing')} onMouseDown={(e) => playgroundDragStart('pricing', e)} onTouchStart={(e) => playgroundDragStart('pricing', e)}>
        <div className="max-w-7xl w-full space-y-16">
          <div className="text-center space-y-6 relative">
            {renderBurst('business', businessVisible)}
            <h2
              className={`text-4xl md:text-6xl font-bold text-[#E5E5E5] tracking-tight transition-all duration-1000 ${businessVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              style={{ transitionDelay: "200ms" }}
            >
              <br />
              <span className="text-3xl md:text-5xl text-slate-400">
                Vectant is where <span className="text-[#58A4B0]">everybody</span> builds, <span className="inline-block relative whitespace-nowrap">
                  faster
                  <svg
                    className={`absolute left-0 -bottom-2 w-full h-3 pointer-events-none ${businessVisible ? 'draw-line-animated' : ''}`}
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#58A4B0' }} />
                        <stop offset="100%" style={{ stopColor: '#327464' }} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M2,8 Q25,4 50,7 T100,8 T150,7 T198,8"
                      fill="none"
                      stroke="url(#underlineGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="1000"
                      strokeDashoffset="1000"
                      style={{ opacity: 1 }}
                    />
                  </svg>
                </span>.
              </span>
            </h2>

            <p
              className={`text-slate-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto transition-all duration-1000 ${businessVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              style={{ transitionDelay: "400ms" }}
            >
              Start building for free. Unlock advanced AI reasoning when you&apos;re ready to scale.
            </p>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-1000 ${businessVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            style={{ transitionDelay: "600ms" }}
          >
            {/* Free Tier */}
            <div
              {...getPlaygroundItemProps('pricing-core')}
              className="pricing-card relative group bg-[#141414]/95 border border-white/[0.08] rounded-2xl p-10 hover:border-[#58A4B0]/30 transition-all duration-300"
              onMouseMove={handleCardMouseMove}
            >
              <div className="pricing-spotlight" />
              <div className="pricing-grid" />
              <div className="absolute -top-3 left-6 z-[3]">
                <span className="bg-[#58A4B0] text-black px-4 py-1 rounded-full text-sm font-bold">FREE FOREVER</span>
              </div>
              <div className="relative z-[3] space-y-6 mt-4">
                <div>
                  <h3 className="text-3xl font-bold text-[#E5E5E5] mb-2">Core</h3>
                  <p className="text-slate-300">Everything you need to build great software.</p>
                </div>
                <div className="space-y-3">
                  {[
                    "Real-time code analysis",
                    "Cloud-based compilation",
                    "Smart code suggestions",
                    "Seamless collaboration",
                    "Unlimited projects"
                  ].map((feature, i) => (
                    <div key={i} className="cascade-item flex items-start gap-3">
                      <div className="cascade-check w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center mt-0.5 flex-shrink-0">
                        <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="cascade-text text-[#E5E5E5]">{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={scrollToBottom}
                  className="w-full py-3 rounded-lg border border-white/20 text-white font-semibold font-mono text-sm tracking-wide hover:bg-white/[0.05] transition-all duration-300 cursor-pointer"
                >
                  Join Free
                </button>
                {/* Secret: Rubber Duck */}
                {playgroundMode && !collection.has('rubber_duck') && (
                  <span
                    onClick={(e) => { e.stopPropagation(); collection.onRubberDuckClick(); }}
                    className="absolute bottom-3 right-3 text-[10px] cursor-pointer select-none"
                    data-secret-proximity="true"
                    data-base-opacity="0.12"
                    data-default-animation=""
                    style={{ opacity: 0.12, filter: 'grayscale(0.8)', transition: 'opacity 0.3s' }}
                    title="quack?"
                  >🦆</span>
                )}
              </div>
            </div>

            {/* Premium Tier */}
            <div
              {...getPlaygroundItemProps('pricing-pro')}
              className="pricing-card pro-card-border pro-tilt relative group bg-[#141414]/95 rounded-2xl p-10"
              onMouseMove={handleProCardMouseMove}
              onMouseLeave={handleProCardMouseLeave}
              style={withPlaygroundStyle('pricing-pro', { boxShadow: '0 0 80px -20px rgba(88, 164, 176, 0.25)' })}
            >
              <div className="pricing-spotlight" />
              <div className="pricing-grid" />
              <div className="absolute -top-3 left-6 z-[3]">
                <span className="bg-gradient-to-r from-[#58A4B0] to-[#327464] text-white px-4 py-1 rounded-full text-sm font-bold">PREMIUM</span>
              </div>
              <div className="relative z-[3] space-y-6 mt-4">
                <div>
                  <h3 className="text-3xl font-bold text-[#E5E5E5] mb-2">Pro</h3>
                  <p className="text-slate-300">For developers who demand more.</p>
                </div>
                <div className="space-y-3">
                  {[
                    "Everything in Core",
                    "Advanced AI reasoning",
                    "Priority compilation",
                    "Enhanced model access",
                    "Premium support"
                  ].map((feature, i) => (
                    <div key={i} className="cascade-item flex items-start gap-3">
                      <div className="cascade-check w-5 h-5 rounded-full bg-[#58A4B0]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <svg className="w-3 h-3 text-[#58A4B0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="cascade-text text-[#E5E5E5] font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={scrollToBottom}
                  className="w-full py-3 rounded-lg bg-[#58A4B0] text-black font-semibold font-mono text-sm tracking-wide hover:bg-[#6BB8C4] transition-all duration-300 cursor-pointer"
                >
                  Get Pro Access
                </button>
              </div>
            </div>
          </div>

          {/* Bottom guarantee */}
          <div
            className={`text-center transition-all duration-1000 ${businessVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            style={{ transitionDelay: "800ms" }}
          >
            <div className="inline-flex items-center gap-3 bg-[#1a1a1a] border border-[#E5E5E5]/10 rounded-full px-8 py-4">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#E5E5E5] text-lg font-semibold">Your work is yours. Forever.</span>
            </div>
            <p className="text-slate-300 text-base mt-4 max-w-2xl mx-auto">
              No lock-in, no proprietary traps.
              Export or self-host your work at any time.
              Vectant strengthens your workflow - without holding it hostage.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Section divider: Business → Features ═══ */}
      <div className="relative z-10 w-full overflow-hidden" style={{ height: 60 }}>
        <svg className="w-full h-full" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none">
          <path d="M0,30 Q300,5 600,30 Q900,55 1200,30" stroke="url(#divGrad2)" strokeWidth="1" strokeDasharray="800" style={{ animation: featuresVisible ? 'dividerDraw 2s ease-out forwards' : 'none', strokeDashoffset: 800 }} />
          <defs><linearGradient id="divGrad2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="rgba(50,116,100,0)" /><stop offset="50%" stopColor="rgba(50,116,100,0.3)" /><stop offset="100%" stopColor="rgba(50,116,100,0)" /></linearGradient></defs>
        </svg>
      </div>

      {/* Features - Bento Grid */}
      <div
        ref={featuresRef}
        className="relative z-10 px-6 md:px-20 py-20 md:py-32"
        style={getDragStyle('features')}
        onMouseDown={(e) => playgroundDragStart('features', e)}
        onTouchStart={(e) => playgroundDragStart('features', e)}
      >
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section header */}
          <div className="text-center space-y-4 relative">
            {renderBurst('features', featuresVisible)}
            <h2
              className={`text-4xl md:text-6xl font-bold text-white tracking-tight transition-all duration-1000 relative inline-block ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            >
              Code <span className="text-[#327464]">Beyond Hardware</span>,<br />
              {/* Phantom Deploy collectible */}
              {playgroundMode && !collection.has('phantom_deploy') && (
                <span
                  onClick={(e) => { e.stopPropagation(); collection.onPhantomDeploy(); }}
                  className="absolute -right-10 top-2 text-lg cursor-pointer select-none"
                  data-secret-proximity="true"
                  data-base-opacity="0.12"
                  data-default-animation="whisperFade 5s ease-in-out infinite"
                  style={{ color: '#A78BFA', opacity: 0.12, animation: 'whisperFade 5s ease-in-out infinite' }}
                >🚀</span>
              )}
              <span className="inline-block mt-2">Build at Instant.</span>
            </h2>
            <p
              className={`text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            >
              Your code, accelerated. AI that understands context, predicts errors, and delivers intelligent suggestions.
            </p>
          </div>

          {/* Bento grid - asymmetric layout with spotlight */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-5 transition-all duration-1000 delay-300 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            {/* ── AI Pair Programmer - wide hero card ── */}
            <div
              {...getPlaygroundItemProps('feature-ai')}
              className="spotlight-card md:col-span-2 group relative bg-[#141414] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#58A4B0]/30"
              onMouseMove={handleCardMouseMove}
            >
              <div className="spotlight-overlay" />
              {/* Micro-UI: AI suggestion flow */}
              <div className="h-28 sm:h-44 relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-[#58A4B0]/[0.03] to-transparent p-3 sm:p-5">
                <div className="font-mono text-[10px] sm:text-[11px] leading-[18px] sm:leading-[22px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <div><span className="text-slate-700 mr-3">1</span><span className="text-[#C678DD]">const</span><span className="text-slate-500"> data = </span><span className="text-[#61AFEF]">fetchMetrics</span><span className="text-slate-500">()</span></div>
                  <div><span className="text-slate-700 mr-3">2</span><span className="text-slate-600">&nbsp;</span></div>
                  <div className="ai-line-loop" style={{ '--line-dur': '6s', '--line-delay': '0s' }}><span className="text-slate-700 mr-3">3</span><span className="text-[#58A4B0]/60 italic">{"// ✦ optimize: memoize expensive computation"}</span><span className="ai-bento-cursor text-[#58A4B0] ml-0.5">|</span></div>
                  <div className="ai-line-loop" style={{ '--line-dur': '6s', '--line-delay': '0.4s' }}><span className="text-slate-700 mr-3">4</span><span className="text-[#58A4B0]/60">{"const cached = "}</span><span className="text-[#61AFEF]">useMemo</span><span className="text-[#58A4B0]/60">{"(() => calc(data), [data])"}</span></div>
                  <div className="ai-line-loop" style={{ '--line-dur': '6s', '--line-delay': '0.8s' }}><span className="text-slate-700 mr-3">5</span><span className="text-[#58A4B0]/60">&nbsp;</span></div>
                  <div className="ai-line-loop" style={{ '--line-dur': '6s', '--line-delay': '1.2s' }}><span className="text-slate-700 mr-3">6</span><span className="text-[#C678DD]">return</span><span className="text-[#58A4B0]/60">{" cached."}</span><span className="text-[#61AFEF]">filter</span><span className="text-[#58A4B0]/60">(isValid)</span></div>
                </div>
                <div className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-[#58A4B0]/10 border border-[#58A4B0]/20 flex items-center justify-center ai-icon-float">
                  <span className="text-[#58A4B0] text-xs">✦</span>
                </div>
              </div>
              <div className="relative z-[3] p-6 space-y-3 cursor-pointer" onClick={() => setExpandedCard(expandedCard === 'ai' ? null : 'ai')}>
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] flex items-center justify-center shadow-lg shadow-black/20">
                  <Users className="text-[#58A4B0]" size={20} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">AI Pair Programmer</h3>
                  <ChevronDown className={`text-slate-500 transition-transform duration-300 ${expandedCard === 'ai' ? 'rotate-180' : ''}`} size={16} />
                </div>
                <div style={{ maxHeight: expandedCard === 'ai' ? '80px' : '0', opacity: expandedCard === 'ai' ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease-out, opacity 0.3s ease-out' }}>
                  <p className="text-slate-400 text-sm leading-relaxed">Integrated AI assistants help optimize, refactor, and guide your code - so your ideas come to life faster and smarter.</p>
                </div>
              </div>
            </div>

            {/* ── Waitlist - gradient glow border card ── */}
            <div
              {...getPlaygroundItemProps('feature-waitlist')}
              className="spotlight-card group relative rounded-2xl overflow-hidden transition-all duration-300"
              onMouseMove={handleCardMouseMove}
            >
              <div className="spotlight-overlay" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#58A4B0]/30 via-[#327464]/20 to-[#58A4B0]/10 waitlist-glow-border" />
              <div className="relative bg-[#141414] m-[1px] rounded-[15px] h-full flex flex-col justify-center p-6 space-y-5 z-[3]">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Get Early Access</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Be among the first to experience the future of coding.</p>
                </div>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.12] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#58A4B0] focus:ring-1 focus:ring-[#58A4B0] transition-all duration-300 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); } }}
                  />
                  <button
                    onClick={() => handleSubmit()}
                    className="w-full group/btn relative px-5 py-2.5 bg-white text-black font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span className="relative z-10 font-mono text-xs tracking-wide">JOIN WAITLIST</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E5E5E5] to-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <div className="w-1.5 h-1.5 bg-emerald-400 animate-pulse rounded-full" />
                  <span>
                    {waitlistCount === null
                      ? <span className="inline-block w-20 h-3 bg-white/[0.06] rounded animate-pulse" />
                      : <><strong className="text-white">{waitlistCount}</strong> developers on the list</>
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* ── Bugs Fixed - small card ── */}
            <div
              {...getPlaygroundItemProps('feature-bugs')}
              className="spotlight-card group relative bg-[#141414] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#58A4B0]/30"
              onMouseMove={handleCardMouseMove}
            >
              <div className="spotlight-overlay" />
              {/* Micro-UI: bug → fix (live cycling) */}
              <div className="h-28 sm:h-36 relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-red-500/[0.03] to-emerald-500/[0.03] p-3 sm:p-5">
                <div className="font-mono text-[9px] sm:text-[10px] leading-[18px] sm:leading-[20px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <div><span className="text-slate-700 mr-2">7</span><span className="text-slate-500">{"  if ("}</span><span className="text-[#E06C75]">user.role</span><span className="text-slate-500">{" === "}</span><span className="text-[#98C379]">{'"admin"'}</span><span className="text-slate-500">{")"}</span></div>
                  {bugFixStep === 0 ? (
                    <div><span className="text-slate-700 mr-2">8</span><span className="text-slate-500">{"    return data.unfiltered()"}</span></div>
                  ) : (
                    <>
                      <div className={bugFixStep >= 1 ? 'bug-strike line-through' : ''}><span className="text-slate-700 mr-2">8</span><span className="text-red-400/80">{"    return data.unfiltered()"}</span></div>
                      {bugFixStep >= 2 && (
                        <div className="bug-slide-in"><span className="text-slate-700 mr-2">8</span><span className="text-emerald-400">{"    return data.filtered(scope)"}</span></div>
                      )}
                    </>
                  )}
                  <div><span className="text-slate-700 mr-2">9</span><span className="text-slate-500">{"  }"}</span></div>
                </div>
                {bugFixStep >= 3 && (
                  <div className="absolute bottom-3 right-3 bug-badge-pop">
                    <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 text-[9px] text-emerald-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Fixed
                    </div>
                  </div>
                )}
              </div>
              <div className="relative z-[3] p-5 space-y-2.5 cursor-pointer" onClick={() => setExpandedCard(expandedCard === 'bugs' ? null : 'bugs')}>
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] flex items-center justify-center shadow-lg shadow-black/20">
                  <Shield className="text-[#58A4B0]" size={20} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Bugs Fixed Before You Notice.</h3>
                  <ChevronDown className={`text-slate-500 transition-transform duration-300 ${expandedCard === 'bugs' ? 'rotate-180' : ''}`} size={16} />
                </div>
                <div style={{ maxHeight: expandedCard === 'bugs' ? '80px' : '0', opacity: expandedCard === 'bugs' ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease-out, opacity 0.3s ease-out' }}>
                  <p className="text-slate-400 text-xs leading-relaxed">Real-time scanning detects errors and offers intelligent fixes for cleaner code.</p>
                </div>
              </div>
            </div>

            {/* ── Cloud Compile - small card ── */}
            <div
              {...getPlaygroundItemProps('feature-cloud')}
              className="spotlight-card group relative bg-[#141414] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#58A4B0]/30"
              onMouseMove={handleCardMouseMove}
            >
              <div className="spotlight-overlay" />
              {/* Micro-UI: cloud transfer */}
              <div className="h-28 sm:h-36 relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-[#58A4B0]/[0.03] to-transparent flex items-center justify-center">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-sm bg-slate-600" />
                    </div>
                    <span className="text-[8px] text-slate-600 font-mono">local</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-[1px] bg-gradient-to-r from-slate-600 to-[#58A4B0]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#58A4B0] cloud-dot-flow" />
                    <div className="w-6 h-[1px] bg-gradient-to-r from-[#58A4B0] to-[#58A4B0]/40" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-xl bg-[#58A4B0]/10 border border-[#58A4B0]/20 flex items-center justify-center cloud-pulse-mini">
                      <Cloud className="text-[#58A4B0]" size={18} />
                    </div>
                    <span className="text-[8px] text-[#58A4B0] font-mono">vectant cloud</span>
                  </div>
                </div>
              </div>
              <div className="relative z-[3] p-5 space-y-2.5 cursor-pointer" onClick={() => setExpandedCard(expandedCard === 'cloud' ? null : 'cloud')}>
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] flex items-center justify-center shadow-lg shadow-black/20">
                  <Cloud className="text-[#58A4B0]" size={20} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Code Without Hardware Limits.</h3>
                  <ChevronDown className={`text-slate-500 transition-transform duration-300 ${expandedCard === 'cloud' ? 'rotate-180' : ''}`} size={16} />
                </div>
                <div style={{ maxHeight: expandedCard === 'cloud' ? '80px' : '0', opacity: expandedCard === 'cloud' ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease-out, opacity 0.3s ease-out' }}>
                  <p className="text-slate-400 text-xs leading-relaxed">Cloud compilation with instant delivery - infinitely scalable, zero local strain.</p>
                </div>
              </div>
            </div>

            {/* ── Collaboration - small card ── */}
            <div
              {...getPlaygroundItemProps('feature-collab')}
              className="spotlight-card group relative bg-[#141414] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#58A4B0]/30"
              onMouseMove={handleCardMouseMove}
            >
              <div className="spotlight-overlay" />
              {/* Micro-UI: multiplayer cursors */}
              <div className="h-28 sm:h-36 relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-purple-500/[0.02] to-[#58A4B0]/[0.03] p-3 sm:p-5">
                <div className="font-mono text-[10px] leading-[20px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <div className="text-slate-500"><span className="text-slate-700 mr-2">1</span>{"function "}<span className="text-[#61AFEF]">render</span>{"() {"}</div>
                  <div className="text-slate-500"><span className="text-slate-700 mr-2">2</span>{"  return <"}<span className="text-[#E06C75]">View</span>{">"}<span className="text-purple-400 ml-1 collab-blink">{"│"}</span></div>
                  <div className="text-slate-500"><span className="text-slate-700 mr-2">3</span>{"    <"}<span className="text-[#E06C75]">Text</span>{">Hello</>"}<span className="text-amber-400 ml-1 collab-blink" style={{ animationDelay: '0.3s' }}>{"│"}</span></div>
                  <div className="text-slate-500"><span className="text-slate-700 mr-2">4</span>{"  </"}<span className="text-[#E06C75]">View</span>{">"}</div>
                </div>
                <div className="absolute bottom-3 right-3 flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/40 collab-pulse" />
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 collab-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="w-5 h-5 rounded-full bg-[#58A4B0]/20 border border-[#58A4B0]/40 collab-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>
              <div className="relative z-[3] p-5 space-y-2.5 cursor-pointer" onClick={() => setExpandedCard(expandedCard === 'collab' ? null : 'collab')}>
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] flex items-center justify-center shadow-lg shadow-black/20">
                  <Zap className="text-[#58A4B0]" size={20} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Seamless Collaboration</h3>
                  <ChevronDown className={`text-slate-500 transition-transform duration-300 ${expandedCard === 'collab' ? 'rotate-180' : ''}`} size={16} />
                </div>
                <div style={{ maxHeight: expandedCard === 'collab' ? '80px' : '0', opacity: expandedCard === 'collab' ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease-out, opacity 0.3s ease-out' }}>
                  <p className="text-slate-400 text-xs leading-relaxed">Work together in real time with AI-enhanced insights across the cloud.</p>
                </div>
              </div>
            </div>

            {/* ── AI Tools Freedom - small card ── */}
            <div
              {...getPlaygroundItemProps('feature-freedom')}
              className="spotlight-card group relative bg-[#141414] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#58A4B0]/30"
              onMouseMove={handleCardMouseMove}
            >
              <div className="spotlight-overlay" />
              {/* Micro-UI: tool badges */}
              <div className="h-28 sm:h-36 relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-purple-500/[0.02] to-[#58A4B0]/[0.03] flex items-center justify-center">
                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center px-3 sm:px-4">
                  {['Claude Code', 'Codex', 'Cursor', 'GPT'].map((tool, i) => (
                    <div key={i} className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[9px] sm:text-[10px] font-mono text-slate-400">
                      {tool}
                    </div>
                  ))}
                </div>
                <div className="absolute top-3 right-3">
                  <Unlock className="text-[#58A4B0]/40" size={14} />
                </div>
              </div>
              <div className="relative z-[3] p-5 space-y-2.5 cursor-pointer" onClick={() => setExpandedCard(expandedCard === 'freedom' ? null : 'freedom')}>
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] flex items-center justify-center shadow-lg shadow-black/20">
                  <Unlock className="text-[#58A4B0]" size={20} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Your Tools, Your Choice.</h3>
                  <ChevronDown className={`text-slate-500 transition-transform duration-300 ${expandedCard === 'freedom' ? 'rotate-180' : ''}`} size={16} />
                </div>
                <div style={{ maxHeight: expandedCard === 'freedom' ? '80px' : '0', opacity: expandedCard === 'freedom' ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease-out, opacity 0.3s ease-out' }}>
                  <p className="text-slate-400 text-xs leading-relaxed">Vectant doesn&apos;t lock you in. Use Claude Code, Codex, or any AI tool you prefer - we integrate, not isolate.</p>
                </div>
              </div>
            </div>

            {/* ── HMR for Compiled Languages - wide card (live animation) ── */}
            <div
              {...getPlaygroundItemProps('feature-hmr')}
              className="spotlight-card md:col-span-2 group relative bg-[#141414] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#58A4B0]/30"
              onMouseMove={handleCardMouseMove}
            >
              <div className="spotlight-overlay" />
              {/* Micro-UI: live editing → HMR → preview */}
              <div className="h-32 sm:h-44 relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-emerald-500/[0.03] to-[#58A4B0]/[0.03] p-3 sm:p-5">
                <div className="flex gap-2 sm:gap-4 items-start">
                  {/* Code change side */}
                  <div className="flex-1 font-mono text-[10px] leading-[20px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    <div className="text-[9px] text-slate-600 mb-1.5 font-sans font-medium">kernel/render.rs</div>
                    <div><span className="text-slate-700 mr-2">42</span><span className="text-[#C678DD]">fn</span><span className="text-slate-500"> </span><span className="text-[#61AFEF]">draw_frame</span><span className="text-slate-500">{"(&mut self) {"}</span></div>
                    {hmrStep === 0 ? (
                      <div><span className="text-slate-700 mr-2">43</span><span className="text-slate-500">{"  self.buffer.clear(BLACK)"}</span></div>
                    ) : (
                      <>
                        <div className="hmr-strike line-through"><span className="text-slate-700 mr-2">43</span><span className="text-red-400/80">{"  self.buffer.clear(BLACK)"}</span></div>
                        <div className="hmr-slide-in"><span className="text-slate-700 mr-2">43</span><span className="text-emerald-400">{"  self.buffer.clear(DARK_TEAL)"}</span></div>
                      </>
                    )}
                    <div><span className="text-slate-700 mr-2">44</span><span className="text-slate-500">{"  self.compositor.flush()"}</span></div>
                  </div>
                  {/* HMR transfer arrow */}
                  <div className="flex flex-col items-center gap-1 pt-6">
                    <div className={`w-8 h-[1px] transition-all duration-300 ${hmrStep >= 1 ? 'bg-gradient-to-r from-slate-600 to-emerald-500' : 'bg-slate-700'}`} />
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${hmrStep >= 1 ? 'bg-emerald-400 hmr-pulse-dot' : 'bg-slate-600'}`} />
                    <div className={`w-8 h-[1px] transition-all duration-300 ${hmrStep >= 1 ? 'bg-gradient-to-r from-emerald-500 to-emerald-500/40' : 'bg-slate-700'}`} />
                    <span className={`text-[8px] font-mono mt-0.5 transition-all duration-300 ${hmrStep >= 1 ? 'text-emerald-400' : 'text-slate-600'}`}>HMR</span>
                  </div>
                  {/* Preview side */}
                  <div className="flex-1">
                    <div className="text-[9px] text-slate-600 mb-1.5 font-sans font-medium">Preview</div>
                    <div className={`w-full h-20 rounded-lg bg-[#0a0a0a] border overflow-hidden relative transition-all duration-500 ${hmrStep === 2 ? 'border-[#58A4B0]/50 shadow-[0_0_16px_rgba(88,164,176,0.15)]' : 'border-white/5'}`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-12 h-12 rounded-lg border transition-all duration-500 ${hmrStep === 2 ? 'bg-gradient-to-br from-[#58A4B0]/30 to-[#327464]/30 border-[#58A4B0]/40 scale-105' : 'bg-gradient-to-br from-[#58A4B0]/10 to-[#327464]/10 border-[#58A4B0]/10'}`} />
                      </div>
                      <div className="absolute top-1.5 left-2 flex gap-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF5F57]/60" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FEBC2E]/60" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#28C840]/60" />
                      </div>
                      <div className={`absolute bottom-1.5 right-2 text-[7px] font-mono transition-all duration-300 ${hmrStep === 2 ? 'text-emerald-400' : 'text-slate-600'}`}>{hmrStep === 2 ? '~2ms' : 'idle'}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative z-[3] p-6 space-y-3 cursor-pointer" onClick={() => setExpandedCard(expandedCard === 'hmr' ? null : 'hmr')}>
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] flex items-center justify-center shadow-lg shadow-black/20">
                  <Rocket className="text-[#58A4B0]" size={20} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Hot Reload for Compiled Languages</h3>
                  <ChevronDown className={`text-slate-500 transition-transform duration-300 ${expandedCard === 'hmr' ? 'rotate-180' : ''}`} size={16} />
                </div>
                <div style={{ maxHeight: expandedCard === 'hmr' ? '80px' : '0', opacity: expandedCard === 'hmr' ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease-out, opacity 0.3s ease-out' }}>
                  <p className="text-slate-400 text-sm leading-relaxed">See changes instantly - whether you&apos;re building an OS kernel, a game engine, or a systems server. Compiled HMR, seamless.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Language Showcase Carousel ═══ */}
      <div className="relative z-10 px-6 md:px-20 py-20 md:py-28" style={getDragStyle('carousel')} onMouseDown={(e) => playgroundDragStart('carousel', e)} onTouchStart={(e) => playgroundDragStart('carousel', e)}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#58A4B0] font-mono text-xs tracking-widest uppercase mb-3 block">Polyglot by design</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight text-reveal">
              {'Any language. One IDE.'.split('').map((c, i) => (
                <span key={i} style={{ animationDelay: `${i * 40}ms` }}>{c === ' ' ? '\u00A0' : c}</span>
              ))}
            </h2>
          </div>
          <div {...getPlaygroundItemProps('language-showcase')} className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            {/* Language tabs */}
            <div className="flex border-b border-white/[0.06]">
              {LANG_SHOWCASE.map((lang, i) => (
                <button key={lang.name} onClick={() => setLangIndex(i)} className={`flex-1 px-4 py-3 text-sm font-mono transition-all duration-300 ${langIndex === i ? 'text-white bg-white/[0.04]' : 'text-slate-500 hover:text-slate-300'}`}>
                  <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: lang.color, opacity: langIndex === i ? 1 : 0.4 }} />
                  {lang.name}
                </button>
              ))}
            </div>
            {/* Code display */}
            <div className="p-6 min-h-[200px] relative">
              <pre key={langIndex} className="text-sm md:text-base font-mono text-slate-300 leading-relaxed" style={{ animation: 'langSlideIn 0.4s ease-out' }}>
                <code>{LANG_SHOWCASE[langIndex].snippet}</code>
              </pre>
              <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-slate-600 font-mono">
                <Code size={12} />
                {LANG_SHOWCASE[langIndex].name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Before / After IDE Slider ═══ */}
      <div className="relative z-10 px-6 md:px-20 py-16 md:py-24" style={getDragStyle('slider')} onMouseDown={(e) => playgroundDragStart('slider', e)} onTouchStart={(e) => playgroundDragStart('slider', e)}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#58A4B0] font-mono text-xs tracking-widest uppercase mb-3 block">See the difference</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Drag to compare</h2>
          </div>
          <div
            ref={sliderRef}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] h-[280px] md:h-[340px] select-none"
            onMouseDown={(e) => { setIsDragging(true); handleSliderDrag(e.clientX); }}
            onTouchStart={(e) => { setIsDragging(true); handleSliderDrag(e.touches[0].clientX); }}
          >
            {/* Left side: Local IDE (full width, clipped) */}
            <div className="absolute inset-0 bg-[#1a1a1a]">
              <div className="p-6 md:p-8 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="text-slate-500 text-xs font-mono">Local IDE</span>
                </div>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex items-center gap-2"><Clock size={12} className="text-red-400" /><span className="text-slate-400">Build time:</span><span className="text-red-400">47.2s</span></div>
                  <div className="flex items-center gap-2"><Cpu size={12} className="text-orange-400" /><span className="text-slate-400">CPU usage:</span><span className="text-orange-400">98%</span></div>
                  <div className="flex items-center gap-2"><Zap size={12} className="text-red-400" /><span className="text-slate-400">Fan noise:</span><span className="text-red-400">Jet engine</span></div>
                  <div className="flex items-center gap-2"><Cloud size={12} className="text-slate-600" /><span className="text-slate-400">HMR:</span><span className="text-slate-600">Not supported</span></div>
                  <div className="mt-4 text-xs text-red-400/60 font-mono">⚠ Out of memory - restart required</div>
                </div>
              </div>
            </div>
            {/* Right side: Vectant (clipped by slider position) */}
            <div className="absolute inset-0 bg-[#0d1117]" style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}>
              <div className="p-6 md:p-8 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-[#58A4B0] text-xs font-mono">Vectant Cloud</span>
                </div>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex items-center gap-2"><Clock size={12} className="text-emerald-400" /><span className="text-slate-400">Build time:</span><span className="text-emerald-400">0.18s</span></div>
                  <div className="flex items-center gap-2"><Cpu size={12} className="text-emerald-400" /><span className="text-slate-400">CPU usage:</span><span className="text-emerald-400">2%</span></div>
                  <div className="flex items-center gap-2"><Zap size={12} className="text-emerald-400" /><span className="text-slate-400">Fan noise:</span><span className="text-emerald-400">Silent</span></div>
                  <div className="flex items-center gap-2"><Cloud size={12} className="text-emerald-400" /><span className="text-slate-400">HMR:</span><span className="text-emerald-400">Instant</span></div>
                  <div className="mt-4 text-xs text-emerald-400/60 font-mono">✓ All systems operational</div>
                </div>
              </div>
            </div>
            {/* Drag handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#58A4B0] z-10"
              style={{ left: `${sliderPos}%`, animation: 'sliderGlow 2s ease-in-out infinite' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#58A4B0]/20 border border-[#58A4B0]/40 backdrop-blur-sm flex items-center justify-center cursor-grab active:cursor-grabbing">
                <GripVertical size={14} className="text-[#58A4B0]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Comparison Table ═══ */}
      <div ref={comparisonRef} className="relative z-10 px-6 md:px-20 py-20 md:py-28" style={getDragStyle('comparison')} onMouseDown={(e) => playgroundDragStart('comparison', e)} onTouchStart={(e) => playgroundDragStart('comparison', e)}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#58A4B0] font-mono text-xs tracking-widest uppercase mb-3 block">The honest comparison</span>
            <h2 className={`text-3xl md:text-5xl font-bold text-white tracking-tight relative inline-block ${comparisonVisible ? 'text-reveal' : 'text-reveal-hidden'}`}>
              {'Vectant vs. the rest'.split('').map((c, i) => (
                <span key={i} style={{ animationDelay: `${i * 40}ms` }}>{c === ' ' ? '\u00A0' : c}</span>
              ))}
              {/* Kernel Patch collectible */}
              {playgroundMode && !collection.has('kernel_patch') && (
                <span
                  onClick={(e) => { e.stopPropagation(); collection.onKernelPatch(); }}
                  className="absolute -right-8 top-1/2 -translate-y-1/2 text-base cursor-pointer select-none"
                  data-secret-proximity="true"
                  data-base-opacity="0.2"
                  data-default-animation="glitchFlicker 2.5s ease-in-out infinite"
                  style={{ color: '#A78BFA', opacity: 0.2, animation: 'glitchFlicker 2.5s ease-in-out infinite' }}
                >🩹</span>
              )}
            </h2>
          </div>
          <div {...getPlaygroundItemProps('comparison-table')} className={`overflow-x-auto rounded-2xl border border-white/[0.06] transition-all duration-1000 ${comparisonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <table className="w-full text-left text-xs sm:text-sm min-w-[480px]">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="px-6 py-4 text-slate-400 font-medium">Feature</th>
                  <th className="px-6 py-4 text-[#58A4B0] font-semibold">Vectant</th>
                  <th className="px-6 py-4 text-slate-400 font-medium">VS Code</th>
                  <th className="px-6 py-4 text-slate-400 font-medium">Replit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Cloud Compile', true, false, true],
                  ['Built-in AI', true, false, true],
                  ['Compiled HMR', true, false, false],
                  ['Real-time Collab', true, false, true],
                  ['Full Offline Mode', true, true, false],
                  ['Free Forever Tier', true, true, false],
                ].map(([feature, vectant, vscode, replit], i) => (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors" style={{ transitionDelay: comparisonVisible ? `${i * 80}ms` : '0ms', opacity: comparisonVisible ? 1 : 0, transform: comparisonVisible ? 'translateX(0)' : 'translateX(-20px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' }}>
                    <td className="px-6 py-3.5 text-slate-300">{feature}</td>
                    <td className="px-6 py-3.5">{vectant ? <Check size={16} className="text-emerald-400" /> : <span className="text-slate-600">-</span>}</td>
                    <td className="px-6 py-3.5">{vscode ? <Check size={16} className="text-slate-400" /> : <span className="text-slate-600">-</span>}</td>
                    <td className="px-6 py-3.5">{replit ? <Check size={16} className="text-slate-400" /> : <span className="text-slate-600">-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═══ Merge with Vectant - Migration Roadmap ═══ */}
      <div ref={roadmapRef} className="relative z-10 px-6 md:px-20 py-20 md:py-28" style={getDragStyle('roadmap')} onMouseDown={(e) => playgroundDragStart('roadmap', e)} onTouchStart={(e) => playgroundDragStart('roadmap', e)}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#58A4B0] font-mono text-xs tracking-widest uppercase mb-3 block">Switch in minutes</span>
            <h2 className={`text-3xl md:text-5xl font-bold text-white tracking-tight ${roadmapVisible ? 'text-reveal' : 'text-reveal-hidden'}`}>
              {'Merge with Vectant'.split('').map((c, i) => (
                <span key={i} style={{ animationDelay: `${i * 40}ms` }}>{c === ' ' ? '\u00A0' : c}</span>
              ))}
            </h2>
            <p className={`text-slate-400 text-lg mt-4 transition-all duration-1000 delay-300 ${roadmapVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>Your workflow, your extensions, your settings - nothing left behind.</p>
            {/* Secret: Y2K Bug — hidden timestamp */}
            {playgroundMode && !collection.has('y2k_bug') && (
              <span
                onClick={(e) => { e.stopPropagation(); collection.onY2kBugClick(); }}
                className="inline-block mt-2 cursor-pointer select-none font-mono"
                data-secret-proximity="true"
                data-base-opacity="0.2"
                data-default-animation=""
                style={{ fontSize: '8px', color: '#334155', opacity: 0.2, transition: 'opacity 0.3s' }}
                title="01/01/2000 00:00:00"
              >01/01/2000 00:00:00</span>
            )}
          </div>
          <div className={`relative transition-all duration-1000 ${roadmapVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Vertical line */}
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#58A4B0]/40 via-[#327464]/20 to-transparent" />
            {[
              { step: '01', title: 'Sign up & open Vectant', desc: 'One click - your cloud workspace is ready in seconds. No installs, no setup.', done: true },
              { step: '02', title: 'Import your project', desc: 'Clone from Git, drag & drop a folder, or connect your existing repo. It just works.', done: true },
              { step: '03', title: 'Bring your extensions', desc: 'Install any VS Code extension via our VSIX tool. Your entire extension library carries over.', done: true },
              { step: '04', title: 'Sync settings & keybinds', desc: 'Import your settings.json and keybindings. Vectant feels exactly like home.', done: true },
              { step: '05', title: 'Build - faster than before', desc: 'Cloud compile kicks in automatically. Same project, dramatically faster builds.', done: true },
            ].map((item, i) => (
              <div key={i} {...getPlaygroundItemProps(`roadmap-${i}`)} className="relative pl-12 md:pl-16 pb-10 last:pb-0" style={withPlaygroundStyle(`roadmap-${i}`, { transitionDelay: roadmapVisible ? `${i * 150}ms` : '0ms', opacity: roadmapVisible ? 1 : 0, transform: roadmapVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease-out, transform 0.6s ease-out' })}>
                {/* Dot */}
                <div className="absolute left-2.5 md:left-4.5 top-1.5 w-3 h-3 rounded-full border-2 bg-[#58A4B0] border-[#58A4B0]">
                  <div className="absolute inset-0 rounded-full" style={{ animation: 'timelineDotPing 2s ease-out infinite', animationDelay: `${i * 300}ms` }} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#58A4B0]">{item.step}</span>
                <h3 className="text-white font-semibold mt-1">{item.title}</h3>
                <p className="text-slate-400 text-sm mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* ═══ Who Is This For? — Persona Cards ═══ */}
      <div ref={personasRef} className="relative z-10 px-6 md:px-20 py-20 md:py-28" style={getDragStyle('personas')} onMouseDown={(e) => playgroundDragStart('personas', e)} onTouchStart={(e) => playgroundDragStart('personas', e)}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#58A4B0] font-mono text-xs tracking-widest uppercase mb-3 block">Built for every builder</span>
            <h2 className={`text-3xl md:text-5xl font-bold text-white tracking-tight transition-all duration-1000 ${personasVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              Who is Vectant for?
            </h2>
            <p className={`text-slate-400 text-lg mt-4 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${personasVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Whether you&apos;re shipping side projects or scaling to millions of users.
            </p>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 delay-300 ${personasVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {/* Solo Devs */}
            <div
              {...getPlaygroundItemProps('persona-solo')}
              className="pricing-card group relative bg-white/[0.03] rounded-2xl p-8"
              onMouseMove={handleCardMouseMove}
            >
              <div className="pricing-spotlight" />
              <div className="pricing-grid" />
              <div className="relative z-[3] space-y-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#58A4B0]/20 to-[#327464]/10 border border-[#58A4B0]/20 flex items-center justify-center">
                  <Code className="text-[#58A4B0]" size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#E5E5E5] mb-1">Solo Devs</h3>
                  <p className="text-slate-400 text-sm">Side projects & freelance</p>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Stop waiting for builds on your laptop. Vectant compiles in the cloud so your hardware doesn&apos;t matter — ship side projects, freelance gigs, and experiments at full speed.
                </p>
                <div className="space-y-3 pt-2">
                  {['Free forever tier', 'Instant cloud builds', 'AI pair programmer'].map((f, i) => (
                    <div key={i} className="cascade-item flex items-start gap-3">
                      <div className="cascade-check w-5 h-5 rounded-full bg-[#58A4B0]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <svg className="w-3 h-3 text-[#58A4B0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="cascade-text text-[#E5E5E5] font-medium text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Startup Teams — featured card with animated border + 3D tilt */}
            <div
              {...getPlaygroundItemProps('persona-startup')}
              className="pricing-card pro-card-border group relative bg-white/[0.03] rounded-2xl p-8"
              onMouseMove={handleProCardMouseMove}
              onMouseLeave={handleProCardMouseLeave}
              style={withPlaygroundStyle('persona-startup', { boxShadow: '0 0 80px -20px rgba(88, 164, 176, 0.2)', transitionDelay: personasVisible ? '100ms' : '0ms' })}
            >
              <div className="pricing-spotlight" />
              <div className="pricing-grid" />
              <div className="absolute -top-3 left-6 z-[3]">
                <span className="bg-gradient-to-r from-[#58A4B0] to-[#327464] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide">MOST POPULAR</span>
              </div>
              <div className="relative z-[3] space-y-5 mt-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-[#58A4B0]/10 border border-purple-500/20 flex items-center justify-center">
                  <Users className="text-purple-400" size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#E5E5E5] mb-1">Startup Teams</h3>
                  <p className="text-slate-400 text-sm">Move fast, ship faster</p>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Real-time collaboration with AI insights across your entire codebase. Onboard new devs instantly — no local environment setup, no &quot;works on my machine&quot; problems.
                </p>
                <div className="space-y-3 pt-2">
                  {['Real-time multiplayer', 'Shared cloud workspace', 'Hot reload for any language'].map((f, i) => (
                    <div key={i} className="cascade-item flex items-start gap-3">
                      <div className="cascade-check w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <svg className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="cascade-text text-[#E5E5E5] font-medium text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enterprise */}
            <div
              {...getPlaygroundItemProps('persona-enterprise')}
              className="pricing-card group relative bg-white/[0.03] rounded-2xl p-8"
              onMouseMove={handleCardMouseMove}
              style={withPlaygroundStyle('persona-enterprise', { transitionDelay: personasVisible ? '200ms' : '0ms' })}
            >
              <div className="pricing-spotlight" />
              <div className="pricing-grid" />
              <div className="relative z-[3] space-y-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Globe className="text-amber-400" size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#E5E5E5] mb-1">Enterprise</h3>
                  <p className="text-slate-400 text-sm">Scale with confidence</p>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Zero tracking, no data training, full export anytime. Vectant gives your org cloud-native development infrastructure without vendor lock-in or compliance headaches.
                </p>
                <div className="space-y-3 pt-2">
                  {['Self-host option', 'Priority compilation', 'Advanced AI reasoning'].map((f, i) => (
                    <div key={i} className="cascade-item flex items-start gap-3">
                      <div className="cascade-check w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <svg className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="cascade-text text-[#E5E5E5] font-medium text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Command Palette Easter Egg (Ctrl+K) */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] pointer-events-none">
          <div className="cmd-palette-in w-[480px] bg-[#1a1a1a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto" style={{ boxShadow: '0 0 80px -20px rgba(88,164,176,0.3)' }}>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <div className="text-[#58A4B0] text-sm font-mono">✦</div>
              {playgroundMode ? (
                <input
                  autoFocus
                  className="flex-1 bg-transparent text-white text-sm font-mono outline-none placeholder:text-white/30"
                  placeholder="Type a command..."
                  value={cmdPaletteInput}
                  onChange={(e) => setCmdPaletteInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCmdPaletteSubmit(cmdPaletteInput); if (e.key === 'Escape') setShowCommandPalette(false); }}
                />
              ) : (
                <span className="text-white/40 text-sm font-mono flex-1">Vectant AI - what would you like to build?</span>
              )}
              <kbd className="text-[10px] text-slate-500 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 font-mono">Esc</kbd>
            </div>
            <div className="px-5 py-3 space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {playgroundMode ? 'Try: sudo collect, vectant' : 'Scanning workspace...'}
              </div>
              <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#58A4B0] to-[#327464] cmd-scan-bar rounded-full"></div>
              </div>
              <div className="text-[10px] text-slate-600 font-mono mt-1">{playgroundMode ? 'Commands unlock collectibles.' : 'Try it when Vectant launches. Press Ctrl+K anytime.'}</div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div ref={faqRef} className="relative z-10 px-6 md:px-20 py-20 md:py-32" style={getDragStyle('faq')} onMouseDown={(e) => playgroundDragStart('faq', e)} onTouchStart={(e) => playgroundDragStart('faq', e)}>
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight relative inline-block">Questions?
              {playgroundMode && !collection.has('four_oh_four') && (
                <span
                  onClick={(e) => { e.stopPropagation(); collection.on404Click(); }}
                  className="absolute -right-6 top-0 text-lg cursor-pointer select-none"
                  data-secret-proximity="true"
                  data-base-opacity="0.25"
                  data-default-animation="glitchFlicker 3s ease-in-out infinite"
                  style={{ color: '#A78BFA', opacity: 0.25, animation: 'glitchFlicker 3s ease-in-out infinite', textShadow: '0 0 8px rgba(167,139,250,0.5)' }}
                  title="?"
                >?</span>
              )}
            </h2>
            <p className="text-slate-400 text-lg">Quick answers to what you&apos;re probably wondering.</p>
          </div>
          <div className="space-y-3">
            {[
              { q: "Is Vectant really free?", a: "Yes. The Core plan is free forever - real-time analysis, cloud compilation, AI suggestions, collaboration, and unlimited projects. No credit card, no trials, no tricks." },
              { q: "When does it launch?", a: "We're in closed alpha. Join the waitlist to secure early access - the first wave of invites goes out soon." },
              { q: "Can I use my own AI tools?", a: "Absolutely. Vectant integrates with Claude Code, Codex, Cursor, and more. We're a platform, not a walled garden - use whatever makes you productive." },
              { q: "What about my data?", a: "Your code stays yours. No training on your data, no telemetry surprises. Export or self-host at any time - zero lock-in, guaranteed." },
              { q: "What makes this different from VS Code or Cursor?", a: "Vectant compiles in the cloud, not on your machine. That means instant builds regardless of your hardware, native HMR for compiled languages, and AI that understands your entire project context - not just the open file." },
            ].map((item, i) => (
              <div
                key={i}
                {...getPlaygroundItemProps(`faq-${i}`)}
                className="group bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden hover:border-[#58A4B0]/20 transition-colors duration-300 cursor-pointer"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                role="button"
                aria-expanded={openFaq === i}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenFaq(openFaq === i ? null : i); } }}
              >
                <div className="flex items-center justify-between px-6 py-4">
                  <span className="text-[#E5E5E5] font-medium text-sm md:text-base">{item.q}</span>
                  <ChevronDown className={`text-slate-500 flex-shrink-0 ml-4 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} size={16} />
                </div>
                <div className={`faq-answer ${openFaq === i ? 'open' : ''}`}>
                  <div>
                    <div className="px-6 pb-4 text-slate-400 text-sm leading-relaxed">{item.a}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* No-tracking badge with tooltip */}
      <div className="relative z-10 flex justify-center pb-12">
        <div
          className="badge-slide-up inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-full px-5 py-2.5 relative"
          onMouseEnter={() => setBadgeTooltip(true)}
          onMouseLeave={() => setBadgeTooltip(false)}
        >
          <Shield className="text-emerald-400" size={14} />
          <span className="text-slate-400 text-xs font-medium">Zero tracking. No cookies. We respect developers.</span>
          {badgeTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-4 py-2.5 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/[0.08] rounded-lg shadow-2xl whitespace-nowrap" style={{ animation: 'badgeSlideUp 0.2s ease-out' }}>
              <div className="text-emerald-400 text-xs font-semibold mb-1">Verified Privacy</div>
              <div className="text-slate-400 text-[11px] leading-relaxed">No Google Analytics. No Mixpanel.<br/>No cookies. No fingerprinting.</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a1a1a]/95 border-r border-b border-white/[0.08] rotate-45 -mt-1" />
            </div>
          )}
        </div>
      </div>

      {/* ═══ Shortcut Sheet Modal (press ?) ═══ */}
      {showShortcuts && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowShortcuts(false)}>
          <div className="sheet-in w-[380px] bg-[#141414]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-sm">Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="text-slate-500 hover:text-white transition-colors text-xs font-mono">ESC</button>
            </div>
            <div className="space-y-3">
              {[
                ['?', 'Toggle this sheet'],
                ['Ctrl + K', 'Command palette'],
                ['↑ ↓', 'Scroll sections'],
                ['Tab', 'Navigate elements'],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">{desc}</span>
                  <kbd className="bg-white/[0.06] border border-white/[0.08] rounded px-2 py-0.5 text-xs font-mono text-slate-300">{key}</kbd>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-white/[0.06] text-center text-[10px] text-slate-600 font-mono">
              Press <kbd className="bg-white/[0.06] rounded px-1.5 py-0.5 text-slate-400">?</kbd> anywhere to toggle
            </div>
          </div>
        </div>
      )}

      {/* ═══ Sticky Bottom CTA Bar ═══ */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 hidden md:block ${showStickyCta ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} style={{ animation: showStickyCta ? 'stickySlideUp 0.5s ease-out' : 'none' }}>
        <div className="bg-[#0a0a0a]/95 backdrop-blur-sm border-t border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
            <span className="text-white text-sm font-medium hidden md:block">Ready to build the future?</span>
            <div className="flex-1 md:flex-none flex items-center gap-2">
              <input
                type="email"
                value={stickyEmail}
                onChange={e => setStickyEmail(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (stickyEmail.trim()) { handleSubmit(stickyEmail); setStickyEmail(''); } } }}
                placeholder="your@email.com"
                aria-label="Email for waitlist"
                className="flex-1 md:w-56 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#58A4B0]/40 transition-colors"
              />
              <button
                onClick={async () => { if (stickyEmail.trim()) { await handleSubmit(stickyEmail); setStickyEmail(''); }}}
                className="bg-white text-black text-sm font-medium px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 whitespace-nowrap font-mono font-semibold uppercase tracking-wider"
              >
                Join <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 pb-20 md:pb-8 border-t border-[#E5E5E5]/10">
        <div className="px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <p className="text-slate-400 text-sm">
            <span className="text-white font-semibold">Expect soon.</span> Inquiries: vectant.dev@gmail.com
          </p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Privacy</a>
            {/* LinkedIn social link */}
            <a
              href="https://www.linkedin.com/in/amkolev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-[#58A4B0] transition-all duration-300 hover:-translate-y-1"
              aria-label="Follow on LinkedIn"
            >
              <Linkedin size={20} />
              <span className="hidden md:inline">Follow on LinkedIn</span>
            </a>
          </div>
        </div>
      </footer>

      {/* ═══ Share / Referral Modal ═══ */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => setShowShareModal(false)} style={{ animation: 'shareBackdropIn 0.3s ease-out' }}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          {/* Sparkle particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i / 16) * 360;
              const dist = 60 + Math.random() * 80;
              const sx = Math.cos((angle * Math.PI) / 180) * dist;
              const sy = Math.sin((angle * Math.PI) / 180) * dist;
              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 rounded-full"
                  style={{
                    width: 3 + Math.random() * 4,
                    height: 3 + Math.random() * 4,
                    background: i % 3 === 0 ? '#58A4B0' : i % 3 === 1 ? '#7EC8D4' : '#ffffff',
                    '--sx': `${sx}px`,
                    '--sy': `${sy}px`,
                    animation: `shareSparkle ${0.5 + Math.random() * 0.4}s ease-out ${0.1 + Math.random() * 0.2}s forwards`,
                    opacity: 0,
                  }}
                />
              );
            })}
          </div>

          {/* Modal card */}
          <div
            className="relative w-[440px] max-w-[90vw] bg-[#161616]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-8 overflow-hidden"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'shareModalIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, shareGlow 3s ease-in-out 0.6s infinite' }}
          >
            {/* Subtle top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#58A4B0]/50 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-[#58A4B0]/10 blur-2xl rounded-full" />

            {/* Expanding ring behind checkmark */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="absolute inset-0 m-auto w-12 h-12 rounded-full border border-[#58A4B0]/30" style={{ animation: 'shareRing 1s ease-out 0.3s forwards' }} />
                <div className="absolute inset-0 m-auto w-12 h-12 rounded-full border border-[#58A4B0]/20" style={{ animation: 'shareRing 1s ease-out 0.5s forwards' }} />
                <div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-[#58A4B0] to-[#327464] flex items-center justify-center"
                  style={{ animation: 'shareCheckPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both' }}
                >
                  <Check size={22} className="text-white" strokeWidth={3} />
                </div>
              </div>
            </div>

            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold text-white" style={{ animation: 'shareBtnIn 0.4s ease-out 0.25s both' }}>You&apos;re on the list!</h3>
              
              {/* Waitlist position reveal */}
              {waitlistPosition && (
                <div className="py-3" style={{ animation: 'shareBtnIn 0.5s ease-out 0.3s both' }}>
                  <div className="inline-flex items-baseline gap-1">
                    <span className="text-slate-500 text-sm">You&apos;re</span>
                    <span className="text-3xl font-bold font-mono text-[#58A4B0]" style={{ animation: 'positionPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both' }}>
                      #{positionCountUp}
                    </span>
                    <span className="text-slate-500 text-sm">on the waitlist</span>
                  </div>
                </div>
              )}

              <p className="text-slate-400 text-sm leading-relaxed" style={{ animation: 'shareBtnIn 0.4s ease-out 0.35s both' }}>
                Share Vectant with friends to help us grow. The bigger the community, the sooner we launch.
              </p>

              <div className="flex gap-2 justify-center pt-4">
                <a
                  href="https://twitter.com/intent/tweet?text=Just%20joined%20the%20waitlist%20for%20Vectant%20-%20the%20world%27s%20first%20Autonomous%20Development%20Environment.%20Cloud-compiled%2C%20AI-native.%20Check%20it%20out%3A%20https%3A%2F%2Fvectant.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-slate-300 hover:bg-white/[0.1] hover:border-[#58A4B0]/40 hover:text-white transition-all duration-300 hover:scale-105"
                  style={{ animation: 'shareBtnIn 0.4s ease-out 0.45s both' }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Post
                </a>
                <a
                  href="https://www.linkedin.com/sharing/share-offsite/?url=https://vectant.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-slate-300 hover:bg-white/[0.1] hover:border-[#58A4B0]/40 hover:text-white transition-all duration-300 hover:scale-105"
                  style={{ animation: 'shareBtnIn 0.4s ease-out 0.55s both' }}
                >
                  <Linkedin size={16} />
                  Share
                </a>
                <button
                  onClick={() => { navigator.clipboard.writeText('https://vectant.dev'); toast.success('Link copied!'); }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-slate-300 hover:bg-white/[0.1] hover:border-[#58A4B0]/40 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ animation: 'shareBtnIn 0.4s ease-out 0.65s both' }}
                >
                  <Globe size={16} />
                  Copy link
                </button>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="mt-5 text-slate-500 text-xs hover:text-slate-300 transition-colors cursor-pointer"
                style={{ animation: 'shareBtnIn 0.4s ease-out 0.75s both' }}
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Konami code Matrix rain ═══ */}
      {konamiActive && (
        <div className="matrix-overlay fixed inset-0 z-[250] pointer-events-none overflow-hidden bg-black/40">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className="matrix-col absolute top-0 text-green-400 font-mono text-xs leading-tight select-none"
              style={{
                left: `${(i / 30) * 100 + Math.random() * 3}%`,
                '--drop-dur': `${1.5 + Math.random() * 2}s`,
                '--drop-delay': `${Math.random() * 1.2}s`,
                opacity: 0.4 + Math.random() * 0.5,
                fontSize: `${10 + Math.random() * 6}px`,
              }}
            >
              {Array.from({ length: 20 }, () => String.fromCharCode(0x30A0 + Math.random() * 96)).join('\n')}
            </div>
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-green-400 font-mono text-2xl font-bold tracking-widest" style={{ textShadow: '0 0 20px rgba(0,255,0,0.5)' }}>KONAMI</span>
          </div>
        </div>
      )}

      {/* ═══ Back to Top ═══ */}
      <div
        className="fixed bottom-6 left-6 z-40 hidden md:block"
        style={{
          animation: scrollProgress > 50 ? 'bttFadeIn 0.3s ease-out forwards' : 'bttFadeOut 0.3s ease-in forwards',
          pointerEvents: scrollProgress > 50 ? 'auto' : 'none',
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-2 bg-[#141414]/80 backdrop-blur-xl border border-white/[0.08] rounded-full pl-3 pr-4 py-2 text-slate-400 hover:text-[#58A4B0] hover:border-[#58A4B0]/30 transition-all duration-300 shadow-lg"
          aria-label="Back to top"
        >
          <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
          <span className="text-xs font-medium">Top</span>
        </button>
      </div>

      {/* ═══ Mobile Dock Nav ═══ */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 md:hidden" style={{ animation: 'dockSlideUp 0.5s ease-out', opacity: scrollProgress > 3 ? 1 : 0, transition: 'opacity 0.3s' }}>
        <div className="flex items-center gap-1 bg-[#131112]/95 backdrop-blur-sm border border-white/[0.08] rounded-full px-2 py-1.5 shadow-2xl">
          {[
            { id: 'hero', icon: Home, label: 'Home' },
            { id: 'business', icon: DollarSign, label: 'Pricing' },
            { id: 'features', icon: Layers, label: 'Features' },
            { id: 'faq', icon: HelpCircle, label: 'FAQ' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`flex flex-col items-center px-3 py-1.5 rounded-full transition-all duration-200 ${
                activeSection === id ? 'bg-[#58A4B0]/15 text-[#58A4B0]' : 'text-slate-500'
              }`}
            >
              <Icon size={16} />
              <span className="text-[9px] mt-0.5 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
