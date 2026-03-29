"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Rocket, Zap, Shield, Users, Cloud, Linkedin, Play } from "lucide-react";
import { toast } from "sonner";

const BUILD_LOGS = [
  { text: "Allocating cloud node...", delay: 0 },
  { text: "Compiling dependencies...", delay: 400 },
  { text: "Building project...", delay: 900 },
];

/* ---------- Language detection + syntax highlighting ---------- */
const INITIAL_CODE = `Write here!`;

const LANG_OUTPUTS = {
  TSX: "Dashboard rendered \u2014 3 charts loaded in 12ms",
  JavaScript: "Server listening on port 3000",
  Python: "INFO: Uvicorn running on http://0.0.0.0:8000 \u2014 200 OK",
  Rust: "Compiling synthi-server v0.1.0 \u2014 Finished release in 0.04s",
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
  const [scrollY, setScrollY] = useState(0);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [businessVisible, setBusinessVisible] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [secondLineText, setSecondLineText] = useState("");
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [email, setEmail] = useState("");
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

  /* ---------- Derive language from editor content ---------- */
  const detectedLang = detectLanguage(editorCode);
  const langGlow = LANG_GLOWS[detectedLang] || LANG_GLOWS["Plain Text"];
  const langOutput = LANG_OUTPUTS[detectedLang] || LANG_OUTPUTS["Plain Text"];
  const aiSuggestion = AI_SUGGESTIONS[detectedLang] || AI_SUGGESTIONS["Plain Text"];
  const editorLines = editorCode.split('\n');

  /* Generate static star field (seeded PRNG for SSR consistency) */
  const stars = React.useMemo(() => {
    let t = 42;
    const rand = () => { t = (t + 0x6D2B79F5) | 0; let v = Math.imul(t ^ (t >>> 15), 1 | t); v ^= v + Math.imul(v ^ (v >>> 7), 61 | v); return ((v ^ (v >>> 14)) >>> 0) / 4294967296; };
    return Array.from({ length: 120 }, () => ({ x: rand() * 100, y: rand() * 100, size: rand() * 1.2 + 0.4, opacity: rand() * 0.07 + 0.03 }));
  }, []);

  /* Ghost typing: types out INITIAL_CODE on mount */
  useEffect(() => {
    if (!mounted) return;
    let i = 0;
    typingRef.current = setInterval(() => {
      i += 2;
      if (i >= INITIAL_CODE.length) {
        i = INITIAL_CODE.length;
        clearInterval(typingRef.current);
        typingRef.current = null;
        setGhostTypingDone(true);
        setTimeout(() => setShowAiSuggestion(true), 600);
      }
      setEditorCode(INITIAL_CODE.slice(0, i));
    }, 20);
    return () => { if (typingRef.current) clearInterval(typingRef.current); };
  }, [mounted]);

  /* Shooting star — fires every 8-15s */
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

  /* Compile sequence */
  const handleRunClick = useCallback(() => {
    if (isCompiling) return;
    setRocketLaunched(true);
    setBorderPulse(true);
    setIsCompiling(true);
    setShowOutput(false);
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
  }, [isCompiling]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
      if (compileTimeoutRef.current) clearTimeout(compileTimeoutRef.current);
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
      if (shootingStarRef.current) clearTimeout(shootingStarRef.current);
      if (hmrTimerRef.current) clearTimeout(hmrTimerRef.current);
    };
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
      setTimeout(() => setShowAiSuggestion(true), 400);
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

  /* Mouse spotlight handler for bento cards */
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  /**
   * Typewriter strings for hero
   */
  const firstLine = "The Cloud IDE for Everybody,";
  const secondLine = "Build the Impossible, Instantly.";

  /* ---------- Efficient scroll handling (single rAF-driven listener) ---------- */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = scrollHeight > 0 ? (y / scrollHeight) * 100 : 0;
          setScrollY(y);
          setScrollProgress(progress);
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
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial
    return () => window.removeEventListener("scroll", onScroll);
  }, [featuresVisible]);

  /* ---------- Mount: stars + typewriter ---------- */
  useEffect(() => {
    setMounted(true);
    fetchWaitlistCount();
    // first-line typewriter
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
  }, []);

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
  const handleSubmit = async () => {
    if (!email || !email.trim()) {
      toast.error("Please enter a valid email");
      return;
    }
    const fetchPromise = fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
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
        fetchWaitlistCount();
        return "Successfully joined the waitlist 🎉";
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

  return (
    <div className="relative min-h-screen">
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

        /* Bug fix animation */
        @keyframes bugFixReveal { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 24px; } }
        .bug-fix-new { animation: bugFixReveal 0.5s ease-out 1.5s both; overflow: hidden; }
        @keyframes bugFixBadge { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
        .bug-fix-badge { animation: bugFixBadge 0.4s ease-out 2s both; }

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
      `}</style>

      {/* Top nav */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#131112]/80 backdrop-blur-md border-b border-[#E5E5E5]/5">
        <div className="px-8 py-4 flex items-center">
          <div className="flex items-center gap-3">
            <img
              src="/synthi-logo.svg"
              alt="Synthi 26 Logo"
              className="h-6 inline-block object-contain"
            />
            <span className="text-[#E5E5E5] font-semibold text-sm -ml-2 -mt-2 tracking-tight">26'</span>
          </div>
        </div>
      </div>

      {/* Floating rocket progress indicator */}
      <div
        className="fixed right-4 z-50 transition-all duration-300 ease-out"
        style={{
          top: `${Math.min(scrollProgress * 0.8 + 10, 85)}%`,
          opacity: scrollProgress > 5 ? 1 : 0,
        }}
      >
        <div className="relative">
          <Rocket
            className="text-[#58A4B0] transform rotate-180"
            size={32}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(88, 164, 176, 0.6))',
            }}
          />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-[#58A4B0] to-transparent opacity-60" />
        </div>
      </div>

      {/* Base dark background */}
      <div className="fixed inset-0 bg-[#131112]" />

      {/* Deep space — static star field */}
      <div className="fixed inset-0 pointer-events-none">
        {mounted && stars.map((s, i) => (
          <div key={i} className="absolute rounded-full bg-white" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity }} />
        ))}
      </div>

      {/* Nebula dust cloud — massive soft teal glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[30%] w-[800px] h-[800px] bg-[#58A4B0] opacity-[0.04] rounded-full blur-[200px]" />
        <div className="absolute bottom-[10%] right-[15%] w-[600px] h-[600px] bg-[#327464] opacity-[0.05] rounded-full blur-[180px]" />
      </div>

      {/* Shooting star */}
      {shootingStar && (
        <div key={shootingStar.id} className="fixed pointer-events-none z-0 shooting-star" style={{ left: `${shootingStar.x}%`, top: `${shootingStar.y}%` }} />
      )}

      {/* Subtle gradient for depth */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#131112]/50 to-[#131112] pointer-events-none" />

      {/* Scroll-driven darkness overlay (capped so it never becomes pure black) */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none transition-opacity duration-300"
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
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 md:px-12 lg:px-20">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Left: text content */}
          <div className="flex flex-col items-start">
            {/* Operational status indicator */}
            <div
              className={`flex items-center gap-2 mb-2 ml-0.5 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '0ms' }}
            >
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className="text-emerald-400 text-sm font-medium">All systems operational</span>
            </div>
            {/* Headline with typewriter effect */}
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
                {typewriterText}
                {!showSecondLine && typewriterText.length < firstLine.length && <span className="cursor-blink text-white">|</span>}
              </h1>
              {showSecondLine && (
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
                  {secondLineText}
                  {!typewriterComplete && secondLineText.length < secondLine.length && <span className="cursor-blink text-white">|</span>}
                  {typewriterComplete && <span className="cursor-blink text-white">|</span>}
                </h1>
              )}
            </div>
            {/* Subheading */}
            <p
              className={`text-slate-400 text-lg md:text-xl mt-6 max-w-xl leading-relaxed transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '600ms' }}
            >
              Built so you can focus on your ideas. It handles the rest itself. You&apos;ll love it.
            </p>
            {/* Join waitlist button */}
            <div
              className={`flex gap-4 mt-6 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: '800ms' }}
            >
              <button
                onClick={scrollToBottom}
                className="group relative px-6 md:px-8 py-3.5 bg-white text-black font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <span className="relative z-10 font-mono text-sm tracking-wide">JOIN WAITLIST</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#E5E5E5] to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>

          {/* Right: Interactive IDE Window */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            {/* "Click to edit" tooltip */}
            {ghostTypingDone && !isEditorActive && !isCompiling && (
              <div className="absolute -top-10 right-4 z-20 magic-tooltip">
                <div className="bg-[#58A4B0]/20 text-[#58A4B0] border border-[#58A4B0]/50 px-3 py-1 rounded-full text-xs font-bold animate-pulse whitespace-nowrap">
                  ⌨ Click to edit — language auto-detects
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
                  <div className="px-3 py-1 text-xs font-mono rounded-md text-white bg-white/10 border-b-2 border-[#58A4B0] transition-all duration-300">
                    {detectedLang}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">auto-detected</span>
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
              <div className="relative min-h-[260px]">
                {/* Highlighted display layer */}
                <div className="absolute inset-0 py-4 pl-2 pr-4 font-mono text-[13px] leading-6 overflow-hidden pointer-events-none" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {renderHighlightedCode()}
                  {showAiSuggestion && (
                    <div className="ai-line-reveal mt-1">
                      <div className="flex">
                        <span className="w-8 text-right text-slate-600 select-none flex-shrink-0 pr-3">{editorLines.length + 1}</span>
                        <span className="text-[#58A4B0]/50 italic">{`// ✦ Synthi AI: ${aiSuggestion.comment}`}</span>
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
                  className="relative w-full min-h-[260px] py-4 pl-10 pr-4 font-mono text-[13px] leading-6 bg-transparent text-transparent caret-[#58A4B0] resize-none outline-none z-10"
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
                    <span className="text-[#58A4B0]">Synthi Cloud</span>
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

              {/* Bottom status bar */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 bg-[#1A1A1A]/60 text-xs text-slate-500 font-mono">
                <span>Ln {editorLines.length}, Col 1</span>
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

      {/* Business Model */}
      <div ref={businessRef} className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-20 py-20 md:py-32">
        <div className="max-w-6xl w-full space-y-16">
          <div className="text-center space-y-6">
            <h2
              className={`text-4xl md:text-6xl font-bold text-[#E5E5E5] tracking-tight transition-all duration-1000 ${businessVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              style={{ transitionDelay: "200ms" }}
            >
              <br />
              <span className="text-3xl md:text-5xl text-slate-400">
                Synthi is where <span className="text-[#58A4B0]">everybody</span> builds, <span className="inline-block relative whitespace-nowrap">
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
              className={`text-slate-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto transition-all duration-1000 ${businessVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
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
            <div className="relative group bg-[#1a1a1a] border border-[#E5E5E5]/10 rounded-2xl p-8 hover:border-[#58A4B0]/30 transition-all duration-300">
              <div className="absolute -top-3 left-6">
                <span className="bg-[#58A4B0] text-black px-4 py-1 rounded-full text-sm font-bold">FREE FOREVER</span>
              </div>
              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="text-3xl font-bold text-[#E5E5E5] mb-2">Core</h3>
                  <p className="text-slate-400">Everything you need to build great software.</p>
                </div>
                <div className="space-y-3">
                  {[
                    "Real-time code analysis",
                    "Cloud-based compilation",
                    "Smart code suggestions",
                    "Seamless collaboration",
                    "Unlimited projects"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#58A4B0]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#58A4B0]" />
                      </div>
                      <span className="text-[#E5E5E5]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Tier */}
            <div className="relative group bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#58A4B0] rounded-2xl p-8 shadow-lg shadow-[#58A4B0]/20">
              <div className="absolute -top-3 left-6">
                <span className="bg-gradient-to-r from-[#58A4B0] to-[#327464] text-white px-4 py-1 rounded-full text-sm font-bold">PREMIUM</span>
              </div>
              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="text-3xl font-bold text-[#E5E5E5] mb-2">Pro</h3>
                  <p className="text-slate-400">For developers who demand more.</p>
                </div>
                <div className="space-y-3">
                  {[
                    "Everything in Core",
                    "Advanced AI reasoning",
                    "Priority compilation",
                    "Enhanced model access",
                    "Premium support"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#58A4B0] flex items-center justify-center mt-0.5 flex-shrink-0">
                        <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[#E5E5E5] font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
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
            <p className="text-slate-400 text-sm mt-4 max-w-2xl mx-auto">
              No lock-in, no proprietary traps.
              Export or self-host your work at any time.
              Synthi strengthens your workflow — without holding it hostage.
            </p>
          </div>
        </div>
      </div>

      {/* Features - Bento Grid */}
      <div
        ref={featuresRef}
        className="relative z-10 px-6 md:px-20 py-20 md:py-32"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section header */}
          <div className="text-center space-y-4">
            <h2
              className={`text-4xl md:text-6xl font-bold text-white tracking-tight transition-all duration-1000 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            >
              Code <span className="text-[#327464]">Beyond Hardware</span>,<br />
              <span className="inline-block mt-2">Build at Instant.</span>
            </h2>
            <p
              className={`text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            >
              Your code, accelerated. AI that understands context, predicts errors, and delivers intelligent suggestions.
            </p>
          </div>

          {/* Bento grid — asymmetric layout with spotlight */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-5 transition-all duration-1000 delay-300 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            {/* ── AI Pair Programmer — wide hero card ── */}
            <div
              className="spotlight-card md:col-span-2 group relative bg-[#141414] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#58A4B0]/30"
              onMouseMove={handleCardMouseMove}
            >
              <div className="spotlight-overlay" />
              {/* Micro-UI: AI suggestion flow */}
              <div className="h-44 relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-[#58A4B0]/[0.03] to-transparent p-5">
                <div className="font-mono text-[11px] leading-[22px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <div><span className="text-slate-700 mr-3">1</span><span className="text-[#C678DD]">const</span><span className="text-slate-500"> data = </span><span className="text-[#61AFEF]">fetchMetrics</span><span className="text-slate-500">()</span></div>
                  <div><span className="text-slate-700 mr-3">2</span><span className="text-slate-600">&nbsp;</span></div>
                  <div className="ai-suggest-line"><span className="text-slate-700 mr-3">3</span><span className="text-[#58A4B0]/60 italic">{"// ✦ optimize: memoize expensive computation"}</span></div>
                  <div className="ai-suggest-line" style={{ animationDelay: '0.5s' }}><span className="text-slate-700 mr-3">4</span><span className="text-[#58A4B0]/60">{"const cached = "}</span><span className="text-[#61AFEF]">useMemo</span><span className="text-[#58A4B0]/60">{"(() => calc(data), [data])"}</span></div>
                  <div className="ai-suggest-line" style={{ animationDelay: '1s' }}><span className="text-slate-700 mr-3">5</span><span className="text-[#58A4B0]/60">&nbsp;</span></div>
                  <div className="ai-suggest-line" style={{ animationDelay: '1.2s' }}><span className="text-slate-700 mr-3">6</span><span className="text-[#C678DD]">return</span><span className="text-[#58A4B0]/60">{" cached."}</span><span className="text-[#61AFEF]">filter</span><span className="text-[#58A4B0]/60">(isValid)</span></div>
                </div>
                <div className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-[#58A4B0]/10 border border-[#58A4B0]/20 flex items-center justify-center ai-icon-float">
                  <span className="text-[#58A4B0] text-xs">✦</span>
                </div>
              </div>
              <div className="relative z-[3] p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] flex items-center justify-center shadow-lg shadow-black/20">
                  <Users className="text-[#58A4B0]" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">AI Pair Programmer</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Integrated AI assistants help optimize, refactor, and guide your code — so your ideas come to life faster and smarter.</p>
              </div>
            </div>

            {/* ── Waitlist — gradient glow border card ── */}
            <div
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
                  />
                  <button
                    onClick={handleSubmit}
                    className="w-full group/btn relative px-5 py-2.5 bg-white text-black font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span className="relative z-10 font-mono text-xs tracking-wide">JOIN WAITLIST</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E5E5E5] to-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <div className="w-1.5 h-1.5 bg-emerald-400 animate-pulse rounded-full" />
                  <span>
                    <strong className="text-white">{waitlistCount}</strong> developers on the list
                  </span>
                </div>
              </div>
            </div>

            {/* ── Bugs Fixed — small card ── */}
            <div
              className="spotlight-card group relative bg-[#141414] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#58A4B0]/30"
              onMouseMove={handleCardMouseMove}
            >
              <div className="spotlight-overlay" />
              {/* Micro-UI: bug → fix */}
              <div className="h-36 relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-red-500/[0.03] to-emerald-500/[0.03] p-5">
                <div className="font-mono text-[10px] leading-[20px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <div><span className="text-slate-700 mr-2">7</span><span className="text-slate-500">{"  if ("}</span><span className="text-[#E06C75]">user.role</span><span className="text-slate-500">{" === "}</span><span className="text-[#98C379]">{'"admin"'}</span><span className="text-slate-500">{")"}</span></div>
                  <div className="opacity-40 line-through"><span className="text-slate-700 mr-2">8</span><span className="text-red-400/80">{"    return data.unfiltered()"}</span></div>
                  <div className="bug-fix-new"><span className="text-slate-700 mr-2">8</span><span className="text-emerald-400">{"    return data.filtered(scope)"}</span></div>
                  <div><span className="text-slate-700 mr-2">9</span><span className="text-slate-500">{"  }"}</span></div>
                </div>
                <div className="absolute bottom-3 right-3 bug-fix-badge">
                  <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 text-[9px] text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Fixed
                  </div>
                </div>
              </div>
              <div className="relative z-[3] p-5 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] flex items-center justify-center shadow-lg shadow-black/20">
                  <Shield className="text-[#58A4B0]" size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Bugs Fixed Before You Notice.</h3>
                <p className="text-slate-400 text-xs leading-relaxed">Real-time scanning detects errors and offers intelligent fixes for cleaner code.</p>
              </div>
            </div>

            {/* ── Cloud Compile — small card ── */}
            <div
              className="spotlight-card group relative bg-[#141414] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#58A4B0]/30"
              onMouseMove={handleCardMouseMove}
            >
              <div className="spotlight-overlay" />
              {/* Micro-UI: cloud transfer */}
              <div className="h-36 relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-[#58A4B0]/[0.03] to-transparent flex items-center justify-center">
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
                    <span className="text-[8px] text-[#58A4B0] font-mono">synthi cloud</span>
                  </div>
                </div>
              </div>
              <div className="relative z-[3] p-5 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] flex items-center justify-center shadow-lg shadow-black/20">
                  <Cloud className="text-[#58A4B0]" size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Code Without Hardware Limits.</h3>
                <p className="text-slate-400 text-xs leading-relaxed">Cloud compilation with instant delivery — infinitely scalable, zero local strain.</p>
              </div>
            </div>

            {/* ── Collaboration — small card ── */}
            <div
              className="spotlight-card group relative bg-[#141414] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#58A4B0]/30"
              onMouseMove={handleCardMouseMove}
            >
              <div className="spotlight-overlay" />
              {/* Micro-UI: multiplayer cursors */}
              <div className="h-36 relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-purple-500/[0.02] to-[#58A4B0]/[0.03] p-5">
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
              <div className="relative z-[3] p-5 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] flex items-center justify-center shadow-lg shadow-black/20">
                  <Zap className="text-[#58A4B0]" size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Seamless Collaboration</h3>
                <p className="text-slate-400 text-xs leading-relaxed">Work together in real time with AI-enhanced insights across the cloud.</p>
              </div>
            </div>

            {/* ── HMR for Compiled Languages — wide card (live animation) ── */}
            <div
              className="spotlight-card md:col-span-2 group relative bg-[#141414] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#58A4B0]/30"
              onMouseMove={handleCardMouseMove}
            >
              <div className="spotlight-overlay" />
              {/* Micro-UI: live editing → HMR → preview */}
              <div className="h-44 relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-emerald-500/[0.03] to-[#58A4B0]/[0.03] p-5">
                <div className="flex gap-4 items-start">
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
              <div className="relative z-[3] p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] flex items-center justify-center shadow-lg shadow-black/20">
                  <Rocket className="text-[#58A4B0]" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Hot Reload for Compiled Languages</h3>
                <p className="text-slate-400 text-sm leading-relaxed">See changes instantly — whether you&apos;re building an OS kernel, a game engine, or a systems server. Compiled HMR, seamless.</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-[#E5E5E5]/10">
        <div className="px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <p className="text-slate-400 text-sm">
            <span className="text-white font-semibold">Expect soon.</span> Inquiries: dev@synthi.app
          </p>
          {/* LinkedIn social link */}
          <a
            href="https://www.linkedin.com/in/amkolev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-400 hover:text-[#58A4B0] transition-all duration-300 hover:-translate-y-1"
          >
            <Linkedin size={20} />
            <span className="hidden md:inline">Follow on LinkedIn</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
