"use client";
import { useCallback, useRef, useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   Constellation System — connect pinned items to form star patterns
   ───────────────────────────────────────────────────────────────────────────
   Detected patterns:
     triangle  — 3 pinned items forming a triangle (min area)
     star      — 5+ pinned + 1 orbiting within the polygon
     line      — 3+ pinned items roughly collinear (not a collectible trigger)
   ═══════════════════════════════════════════════════════════════════════════ */

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function triangleArea(a, b, c) {
  return Math.abs((a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2);
}

function isPointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    if ((yi > point.y) !== (yj > point.y) && point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function areCollinear(points, threshold = 15) {
  if (points.length < 3) return false;
  const [a, b] = [points[0], points[points.length - 1]];
  const lineLen = dist(a, b);
  if (lineLen < 40) return false;
  return points.slice(1, -1).every(p => {
    const d = Math.abs((b.y - a.y) * p.x - (b.x - a.x) * p.y + b.x * a.y - b.y * a.x) / lineLen;
    return d < threshold;
  });
}

export function useConstellationSystem(active, bodiesRef, nodesRef, onPatternFormed) {
  const [lines, setLines] = useState([]); // SVG lines between pinned
  const [activePattern, setActivePattern] = useState(null);
  const detectedRef = useRef({});
  const checkIntervalRef = useRef(null);

  const checkPatterns = useCallback(() => {
    if (!bodiesRef.current || !nodesRef.current) return;

    const pinned = [];
    const orbiting = [];

    Object.entries(bodiesRef.current).forEach(([id, body]) => {
      const node = nodesRef.current[id];
      if (!node || !node.isConnected) return;
      const rect = node.getBoundingClientRect();
      const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, id };
      if (body.pinned) pinned.push(center);
      if (body.orbit) orbiting.push(center);
    });

    // Generate constellation lines between nearby pinned items
    const newLines = [];
    for (let i = 0; i < pinned.length; i++) {
      for (let j = i + 1; j < pinned.length; j++) {
        if (dist(pinned[i], pinned[j]) < 400) {
          newLines.push({ x1: pinned[i].x, y1: pinned[i].y, x2: pinned[j].x, y2: pinned[j].y });
        }
      }
    }
    setLines(newLines);

    // Triangle detection
    if (pinned.length >= 3 && !detectedRef.current.triangle) {
      for (let i = 0; i < pinned.length; i++) {
        for (let j = i + 1; j < pinned.length; j++) {
          for (let k = j + 1; k < pinned.length; k++) {
            const area = triangleArea(pinned[i], pinned[j], pinned[k]);
            if (area > 3000) { // minimum area to be a real triangle
              detectedRef.current.triangle = true;
              setActivePattern('triangle');
              onPatternFormed?.('triangle');
              setTimeout(() => setActivePattern(null), 3000);
              return;
            }
          }
        }
      }
    }

    // Star pattern: 5+ pinned + at least 1 orbiting inside convex hull
    if (pinned.length >= 5 && orbiting.length >= 1 && !detectedRef.current.star) {
      // Simple check: any orbiter inside bounding box of pinned items
      const minX = Math.min(...pinned.map(p => p.x));
      const maxX = Math.max(...pinned.map(p => p.x));
      const minY = Math.min(...pinned.map(p => p.y));
      const maxY = Math.max(...pinned.map(p => p.y));
      const orbitInside = orbiting.some(o => o.x > minX && o.x < maxX && o.y > minY && o.y < maxY);
      if (orbitInside) {
        detectedRef.current.star = true;
        setActivePattern('star');
        onPatternFormed?.('star');
        setTimeout(() => setActivePattern(null), 3000);
      }
    }
  }, [bodiesRef, nodesRef, onPatternFormed]);

  useEffect(() => {
    if (!active) {
      clearInterval(checkIntervalRef.current);
      setLines([]);
      setActivePattern(null);
      detectedRef.current = {};
      return;
    }
    // Check every 500ms
    checkIntervalRef.current = setInterval(checkPatterns, 500);
    return () => clearInterval(checkIntervalRef.current);
  }, [active, checkPatterns]);

  const resetConstellations = useCallback(() => {
    detectedRef.current = {};
    setLines([]);
    setActivePattern(null);
  }, []);

  return { lines, activePattern, resetConstellations };
}
