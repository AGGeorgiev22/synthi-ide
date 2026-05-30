"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Cloud, Zap, Eye, Pencil } from "lucide-react";
import { SectionHeading } from "@/components/Section";
import { StatusPill } from "@/components/workspace/parts";
import { AvatarStack } from "@/components/workspace/presence";
import { useReducedMotion, useActive } from "@/components/lib/useMotion";
import { cn } from "@/lib/utils";

/* Same fluent sketch API across languages so the preview parser works
   everywhere — proof that the workspace runs whatever you write. */
const SNIPPETS = {
  Rust: `// live cloud workspace - edit any value.
fn sketch(rt: &Runtime) -> Scene {
    Scene::new()
        .particles(140)
        .accent(0x2dd4ee)
        .speed(1.0)
        .shape(Shape::Orbit)
}`,
  TypeScript: `// live cloud workspace - edit any value.
export function sketch(rt: Runtime): Scene {
  return scene()
    .particles(140)
    .accent("#2dd4ee")
    .speed(1.0)
    .shape("orbit");
}`,
  Python: `# live cloud workspace - edit any value.
def sketch(rt: Runtime) -> Scene:
    return (Scene()
        .particles(140)
        .accent("#2dd4ee")
        .speed(1.0)
        .shape("orbit"))`,
  Go: `// live cloud workspace - edit any value.
func sketch(rt *Runtime) Scene {
    return NewScene().
        Particles(140).
        Accent("#2dd4ee").
        Speed(1.0).
        Shape("orbit")
}`,
  "C++": `// live cloud workspace - edit any value.
Scene sketch(Runtime& rt) {
  return Scene()
    .particles(140)
    .accent(0x2dd4ee)
    .speed(1.0)
    .shape("orbit");
}`,
};
const LANGS = Object.keys(SNIPPETS);

const KEYWORDS = [
  "fn", "let", "pub", "const", "use", "move", "async", "await", "mut", "struct",
  "impl", "return", "self", "def", "function", "export", "func", "class", "new",
  "var", "void", "int", "float",
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Shared box metrics for the overlay editor. The <pre> and <textarea> must be
// pixel-identical: same padding, wrapping, and — crucially — the same font,
// since a <textarea> does NOT inherit font-family/size from its parent.
const EDITOR_METRICS = "absolute inset-0 m-0 box-border overflow-auto whitespace-pre-wrap break-words p-4";
const EDITOR_STYLE = { fontFamily: "var(--font-mono)", fontSize: "12.5px", lineHeight: "1.65", tabSize: 2 };

/** Cosmetic highlighter — tokenizes RAW source, escapes per-segment. Never throws. */
function highlight(src) {
  try {
    const re = /(\/\/[^\n]*|#[^\n]*)|("(?:[^"\\]|\\.)*")|(0x[0-9a-fA-F]+|\d+(?:\.\d+)?)|([a-z_][A-Za-z0-9_]*)(?=\s*\()|([A-Z][A-Za-z0-9_]*)|([a-z_][A-Za-z0-9_]*)/g;
    let out = "";
    let last = 0;
    let m;
    while ((m = re.exec(src)) !== null) {
      out += esc(src.slice(last, m.index));
      const t = m[0];
      let cls = "";
      if (m[1]) cls = "tok-com";
      else if (m[2]) cls = "tok-str";
      else if (m[3]) cls = "tok-num";
      else if (m[4]) cls = KEYWORDS.includes(m[4]) ? "tok-kw" : "tok-fn";
      else if (m[5]) cls = "tok-type";
      else if (m[6]) cls = KEYWORDS.includes(m[6]) ? "tok-kw" : "tok-prop";
      out += cls ? `<span class="${cls}">${esc(t)}</span>` : esc(t);
      last = m.index + t.length;
      if (t.length === 0) re.lastIndex++;
    }
    out += esc(src.slice(last));
    return out;
  } catch {
    return esc(src);
  }
}

function parseParams(src) {
  const numOf = (re, d) => {
    const m = src.match(re);
    return m ? Number(m[1]) : d;
  };
  const count = Math.max(1, Math.min(420, Math.round(numOf(/particles\s*[([=:]\s*"?(\d+)/i, 140))));
  const speed = Math.max(0, Math.min(4, numOf(/speed\s*[([=:]\s*"?([\d.]+)/i, 1)));
  const hexM = src.match(/(?:accent|color)\s*[([=:]\s*["']?(?:0x|#)([0-9a-fA-F]{6})/i) || src.match(/(?:0x|#)([0-9a-fA-F]{6})/);
  const accent = hexM ? `#${hexM[1]}` : "#2dd4ee";
  const shapeM = src.match(/Shape[:.]{1,2}([A-Za-z]+)/) || src.match(/shape\s*[([=:]\s*["']?([A-Za-z]+)/i);
  const shape = shapeM ? shapeM[1].toLowerCase() : "orbit";
  return { count, speed, accent, shape };
}

const rand = (i) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export function LivePlayground() {
  const reduced = useReducedMotion();
  const [hostRef, active] = useActive("0px 0px -10% 0px");
  const [lang, setLang] = useState("Rust");
  const [code, setCode] = useState(SNIPPETS.Rust);
  const [builds, setBuilds] = useState(0);
  const [fresh, setFresh] = useState(false);
  const [editing, setEditing] = useState(false);

  const params = useMemo(() => parseParams(code), [code]);
  const html = useMemo(() => highlight(code), [code]);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const canvasRef = useRef(null);
  const taRef = useRef(null);
  const preRef = useRef(null);

  useEffect(() => {
    if (builds === 0) return;
    setFresh(true);
    const id = setTimeout(() => setFresh(false), 900);
    return () => clearTimeout(id);
  }, [code, builds]);

  // canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let t = 0;
    const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(r.width * dpr));
      canvas.height = Math.max(1, Math.floor(r.height * dpr));
    };
    resize();

    const frame = () => {
      const w = canvas.width;
      const h = canvas.height;
      const { count, speed, accent, shape } = paramsRef.current;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const base = Math.min(w, h);
      for (let i = 0; i < count; i++) {
        const f = i / count;
        let x;
        let y;
        if (shape === "grid") {
          const cols = Math.ceil(Math.sqrt(count));
          const rows = Math.ceil(count / cols);
          const gx = i % cols;
          const gy = Math.floor(i / cols);
          x = ((gx + 0.5) / cols) * w;
          y = ((gy + 0.5) / rows) * h + Math.sin(t * speed + i * 0.6) * (base * 0.012);
        } else if (shape === "wave") {
          x = f * w;
          y = cy + Math.sin(f * Math.PI * 5 + t * speed * 2) * h * 0.32;
        } else if (shape === "scatter") {
          x = rand(i + 1) * w + Math.cos(t * speed + i) * (base * 0.02);
          y = rand(i + 99) * h + Math.sin(t * speed + i) * (base * 0.02);
        } else {
          const ring = 1 + (i % 3);
          const a = f * Math.PI * 2 * ring + t * speed * (0.35 + (i % 3) * 0.12);
          const r = (0.16 + 0.2 * (i % 3)) * base;
          x = cx + Math.cos(a) * r;
          y = cy + Math.sin(a) * r;
        }
        ctx.globalAlpha = 0.35 + 0.6 * f;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(x, y, 1.7 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduced && active) {
        t += 0.016;
        raf = requestAnimationFrame(frame);
      }
    };

    frame();
    window.addEventListener("resize", resize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced, active]);

  const onChange = (e) => {
    setCode(e.target.value);
    setBuilds((b) => b + 1);
  };
  const switchLang = (l) => {
    setLang(l);
    setCode(SNIPPETS[l]);
    setBuilds((b) => b + 1);
  };
  const syncScroll = () => {
    if (preRef.current && taRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  return (
    <section id="playground" className="relative scroll-mt-24 py-20 sm:py-24">
      <div ref={hostRef} className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Live · cloud workspace"
          align="center"
          maxWidth="max-w-3xl"
          title={
            <>
              Instant feedback. <span className="serif-accent text-ink-dim">No matter what you build.</span>
            </>
          }
          subtitle="This is a real cloud workspace, not a video. Pick a language, edit the source, and the preview hot-reloads as you type - no setup, no cold start."
        />

        <div className="surface-dark mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl border border-line-2 bg-panel shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)]">
          {/* language tabs */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-line bg-bg-2/80 px-3 py-2">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => switchLang(l)}
                className={cn(
                  "shrink-0 rounded-md border border-transparent px-2.5 py-1 font-mono text-[11px] transition-colors",
                  l === lang ? "border-cyan/40 bg-transparent text-cyan" : "text-ink-faint hover:text-ink-dim"
                )}
              >
                {l}
              </button>
            ))}
            <span className="ml-auto inline-flex items-center gap-1.5 pl-2 font-mono text-[10.5px] text-cyan">
              <Cloud size={12} /> cloud
            </span>
            <AvatarStack size={20} live={false} className="ml-3 hidden sm:flex" />
          </div>

          {/* status row */}
          <div className="flex items-center gap-2 border-b border-line px-4 py-2">
            <span className="font-mono text-[11px] text-ink-dim">sketch.{({ Rust: "rs", TypeScript: "ts", Python: "py", Go: "go", "C++": "cpp" })[lang]}</span>
            <div className="ml-auto flex items-center gap-2">
              <StatusPill tone={fresh ? "ok" : "run"} pulse>
                {fresh ? "hot-reloaded · instant" : "watching"}
              </StatusPill>
              <span className="hidden font-mono text-[10.5px] text-ink-faint sm:inline">reload #{builds}</span>
            </div>
          </div>

          {/* editor | preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative border-b border-line lg:border-b-0 lg:border-r">
              <div
                className={cn(
                  "code-overlay relative h-[300px] transition-shadow",
                  editing ? "ring-2 ring-inset ring-cyan/40" : "ring-1 ring-inset ring-transparent"
                )}
              >
                {/* The highlighted <pre> and the editable <textarea> MUST share
                    identical box metrics or the transparent text drifts. */}
                <pre
                  ref={preRef}
                  aria-hidden="true"
                  className={cn(EDITOR_METRICS, "pointer-events-none text-ink")}
                  style={EDITOR_STYLE}
                  dangerouslySetInnerHTML={{ __html: html + "\n" }}
                />
                <textarea
                  ref={taRef}
                  value={code}
                  onChange={onChange}
                  onScroll={syncScroll}
                  onFocus={() => setEditing(true)}
                  onBlur={() => setEditing(false)}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  aria-label={`Live ${lang} playground source - editable`}
                  className={cn(EDITOR_METRICS, "h-full w-full resize-none bg-transparent text-transparent caret-cyan outline-none")}
                  style={{ ...EDITOR_STYLE, caretColor: "#2dd4ee" }}
                />
                {/* editability affordance */}
                <span
                  className={cn(
                    "pointer-events-none absolute bottom-2 right-3 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-sans text-[10px] transition-all duration-300",
                    editing
                      ? "border-cyan/40 bg-cyan/10 text-cyan opacity-100"
                      : "border-line bg-bg-2/80 text-ink-faint opacity-100"
                  )}
                >
                  <Pencil size={10} /> {editing ? "editing - type anything" : "click to edit"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 border-t border-line px-3 py-2.5 font-mono text-[10.5px] text-ink-faint">
                <span className="text-ink-dim">try:</span>
                <span className="rounded border border-line bg-white/[0.02] px-1.5 py-0.5">shape → wave</span>
                <span className="rounded border border-line bg-white/[0.02] px-1.5 py-0.5">particles 300</span>
                <span className="rounded border border-line bg-white/[0.02] px-1.5 py-0.5">#ff5c2a</span>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 border-b border-line px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-ok shadow-[0_0_8px_#46e0a0]" />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">live preview</span>
                <span className="ml-auto font-mono text-[10px] text-ink-faint">localhost:5173</span>
              </div>
              <div className="relative h-[300px] bg-[#070708]">
                <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:22px_22px]" />
                <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
                <div className="absolute bottom-2 left-3 flex items-center gap-3 font-mono text-[10px] text-ink-faint">
                  <span style={{ color: params.accent }}>● {params.shape}</span>
                  <span>{params.count} particles</span>
                  <span>{params.speed.toFixed(1)}×</span>
                </div>
              </div>
            </div>
          </div>

          {/* agent observation footer */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line bg-bg-2/40 px-4 py-3 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 text-cyan">
              <Eye size={12} /> agent · observing render
            </span>
            <span className="text-ink-faint">{lang} · {params.count} particles · {params.shape}</span>
            <span className="ml-auto inline-flex items-center gap-1.5 text-ink-dim">
              <Zap size={12} className="text-warn" /> no local setup · no cold starts
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

