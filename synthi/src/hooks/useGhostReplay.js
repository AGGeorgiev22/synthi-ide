"use client";
import { useState, useCallback, useRef } from "react";

/**
 * Ghost Replay System — records toy positions every N frames during a run,
 * saves to localStorage, and replays as translucent ghost overlays.
 */
const RECORD_INTERVAL = 3; // record every 3 frames (~20 samples/sec at 60fps)
const MAX_FRAMES = 600; // max ~30 seconds of recording
const STORAGE_KEY = "synthi_ghost_replay";

export default function useGhostReplay(playgroundMode) {
  const [recording, setRecording] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const [hasGhost, setHasGhost] = useState(() => {
    if (typeof window === "undefined") return false;
    try { return !!localStorage.getItem(STORAGE_KEY); } catch { return false; }
  });

  const recordBufferRef = useRef([]);
  const frameCountRef = useRef(0);
  const replayDataRef = useRef(null);
  const replayFrameRef = useRef(0);
  const ghostPositionsRef = useRef([]); // current frame ghost positions for rendering
  const [ghostPositions, setGhostPositions] = useState([]);

  const startRecording = useCallback(() => {
    recordBufferRef.current = [];
    frameCountRef.current = 0;
    setRecording(true);
  }, []);

  /** Called in RAF loop every frame while recording */
  const recordFrame = useCallback((bodies) => {
    if (!recording) return;
    frameCountRef.current++;
    if (frameCountRef.current % RECORD_INTERVAL !== 0) return;
    if (recordBufferRef.current.length >= MAX_FRAMES) return;

    const frame = [];
    for (const [id, body] of Object.entries(bodies)) {
      if (!id.startsWith("spawn-")) continue;
      frame.push({
        x: Math.round(body.x),
        y: Math.round(body.y),
        a: +(body.angle || 0).toFixed(2),
        w: body.width || 132,
        h: body.height || 95,
      });
    }
    recordBufferRef.current.push(frame);
  }, [recording]);

  const stopRecording = useCallback(() => {
    setRecording(false);
    if (recordBufferRef.current.length > 10) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recordBufferRef.current));
        setHasGhost(true);
      } catch {}
    }
  }, []);

  const startReplay = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      replayDataRef.current = JSON.parse(raw);
      replayFrameRef.current = 0;
      setReplaying(true);
    } catch {}
  }, []);

  /** Called in RAF loop every frame while replaying */
  const replayFrame = useCallback(() => {
    if (!replaying || !replayDataRef.current) return;
    const data = replayDataRef.current;
    const idx = replayFrameRef.current;
    if (idx >= data.length) {
      // Loop or stop
      setReplaying(false);
      setGhostPositions([]);
      ghostPositionsRef.current = [];
      replayDataRef.current = null;
      return;
    }
    ghostPositionsRef.current = data[idx];
    // Only update React state every 3 frames for perf
    if (idx % 3 === 0) setGhostPositions(data[idx]);
    replayFrameRef.current++;
  }, [replaying]);

  const stopReplay = useCallback(() => {
    setReplaying(false);
    setGhostPositions([]);
    ghostPositionsRef.current = [];
    replayDataRef.current = null;
  }, []);

  const clearGhost = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setHasGhost(false);
    stopReplay();
  }, [stopReplay]);

  return {
    recording,
    replaying,
    hasGhost,
    ghostPositions,
    startRecording,
    recordFrame,
    stopRecording,
    startReplay,
    replayFrame,
    stopReplay,
    clearGhost,
  };
}
