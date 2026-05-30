"use client";

import { useState } from "react";
import { toast } from "sonner";
import { track } from "@vercel/analytics";
import { ArrowRight, Loader2, Mail, Rocket } from "lucide-react";

import { useReducedMotion } from "@/components/lib/useMotion";
import { cn } from "@/lib/utils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// subdued burst palette for success feedback
const BURST = ["#4d5056", "#6f747d", "#8f95a0", "#5e646f", "#6d6f74", "#3f4650"];

/**
 * Waitlist signup. Posts { email } to /api/waitlist - the contract preserved
 * from the previous site. Variants: "hero" (light field) and "inline".
 * On success it plays a one-shot celebration (drawn check + brand confetti).
 */
export function WaitlistForm({ variant = "hero", className, autoFocus = false }) {
  const reduced = useReducedMotion();
  const isHero = variant === "hero";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [joined, setJoined] = useState(false);
  const [already, setAlready] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const target = email.trim();
    if (!target) {
      toast.error("Please enter your email");
      return;
    }
    if (!EMAIL_REGEX.test(target)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    const req = fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: target }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join waitlist");
      return data;
    });

    toast.promise(req, {
      loading: "Joining...",
      success: (data) => {
        const isAlready = data.message === "Email already on waitlist";
        setStatus("done");
        setAlready(isAlready);
        setJoined(true);
        setEmail("");
        // Attribute the conversion to the hero A/B bucket (set by useHeadlineVariant).
        try {
          const variant = localStorage.getItem("vt-headline") || "unknown";
          track("waitlist_join", { variant, already: isAlready });
        } catch {}
        return isAlready
          ? "You're already on the waitlist."
          : "You're on the list. We'll be in touch.";
      },
      error: (err) => {
        setStatus("idle");
        return err.message || "Something went wrong. Please try again.";
      },
    });
  }

  if (joined) {
    return <Celebration className={className} reduced={reduced} already={already} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "group relative flex w-full flex-col gap-2 rounded-2xl border border-line/70 bg-surface/65 p-1 backdrop-blur-md",
        "before:pointer-events-none before:absolute before:inset-px before:-z-10 before:rounded-[calc(1rem-2px)] before:opacity-0 before:transition before:duration-500",
        "before:bg-line/25 hover:before:opacity-100",
        "hover:border-line/95 hover:shadow-[0_0_0_1px_rgba(120,128,145,0.18)]",
        isHero ? "sm:flex-row sm:items-start sm:gap-0" : "sm:flex-row sm:items-center",
        className
      )}
      noValidate
    >
      <label htmlFor={`wl-${variant}`} className="sr-only">
        Work email
      </label>
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 text-ink-faint sm:block">
          <Mail size={16} />
        </span>
        <input
          id={`wl-${variant}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus={autoFocus}
          placeholder="you@company.dev"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            "w-full rounded-xl border border-line/80 bg-bg-2/90 px-4 py-3.5 text-[15px] text-ink outline-none transition placeholder:text-ink-faint",
            "focus:border-cyan/55 focus:ring-2 focus:ring-cyan/20",
            isHero ? "border-transparent pl-11 sm:pl-11" : "border-line pl-11 sm:pl-11"
          )}
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line/80 bg-transparent px-5 py-3 text-[15px] font-medium text-ink transition duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/30",
          "hover:border-line-2 active:scale-[0.985] active:brightness-95 disabled:opacity-60 disabled:bg-transparent",
          isHero ? "sm:w-auto sm:min-w-[170px] sheen" : "sm:w-auto sm:min-w-[155px] sheen"
        )}
      >
        {status === "loading" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Joining...
          </>
        ) : (
          <>
            Join waitlist
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

/* One-shot success celebration: a stroke-drawn checkmark inside a ring that
   pops in, with a muted confetti burst. Honors reduced motion
   (static check, no burst). */
function Celebration({ className, reduced, already }) {
  const pieces = reduced
    ? []
    : Array.from({ length: 16 }, (_, i) => {
        const ang = (i / 16) * Math.PI * 2 + (i % 2 ? 0.2 : 0);
        const dist = 42 + (i % 3) * 16;
        return {
          dx: `${Math.cos(ang) * dist}px`,
          dy: `${Math.sin(ang) * dist}px`,
          color: BURST[i % BURST.length],
          delay: `${(i % 5) * 18}ms`,
          square: i % 2 === 0,
        };
      });

  return (
    <div className={cn("relative", className)}>
      {/* rocket launch - lives in the non-clipping wrapper so it can fly past
          the card's top edge (the card keeps overflow-hidden to clip confetti) */}
      {!reduced && (
        <span className="vt-rocket pointer-events-none absolute left-7 top-2 z-10" aria-hidden="true">
          <span className="relative block text-line">
            {/* lucide Rocket points up-right by default; rotate so the nose
                faces straight up to match the vertical launch */}
            <Rocket size={18} className="relative z-10 -rotate-45" />
            <span className="absolute left-1/2 top-full h-5 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-line/65 to-transparent blur-[1px]" />
          </span>
        </span>
      )}
      <div
        className={cn(
          "flex w-full items-center gap-3.5 overflow-hidden rounded-xl border border-line/35 bg-bg-2/40 px-4 py-3.5 text-sm",
          !reduced && "vt-pop"
        )}
      >
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
          {/* confetti burst */}
          {pieces.map((p, i) => (
            <span
              key={i}
              className="vt-confetti pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5"
              style={{
                "--dx": p.dx,
                "--dy": p.dy,
                background: p.color,
                borderRadius: p.square ? "1px" : "9999px",
                animationDelay: p.delay,
              }}
              aria-hidden="true"
            />
          ))}
          {/* ring + drawn check */}
          <span className="absolute inset-0 rounded-full border border-line/35 bg-bg-2/55" />
          <svg viewBox="0 0 24 24" className="relative h-5 w-5 text-ink" fill="none" aria-hidden="true">
            <path
              d="M5 12.5 L10 17.5 L19 7"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={reduced ? undefined : "vt-check"}
              style={reduced ? undefined : { strokeDasharray: 28, strokeDashoffset: 28 }}
            />
          </svg>
        </div>
        <span className="text-ink">
          {already
            ? "You're already on the waitlist - we'll reach out as access opens."
            : "You're on the waitlist. We'll reach out as access opens."}
        </span>
      </div>
    </div>
  );
}
