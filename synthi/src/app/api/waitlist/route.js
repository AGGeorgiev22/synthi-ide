import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const globalForPrisma = globalThis;

function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}

function getPrismaClient() {
  if (!process.env.DATABASE_URL) return null;
  try {
    if (!globalForPrisma.__vectantPrisma) {
      globalForPrisma.__vectantPrisma = new PrismaClient();
    }
  } catch (error) {
    console.error("Prisma client initialization failed:", getErrorMessage(error));
    return null;
  }
  return globalForPrisma.__vectantPrisma;
}

/* ── Sliding-window rate limiter ──────────────────────────────────────────
   State lives on globalThis so it survives Next dev hot-reloads (otherwise a
   fresh Map + a new setInterval would leak on every edit). Per-IP we keep the
   timestamps of recent hits and count only those inside the window.
   NOTE: in-memory means per-instance. On multi-instance/serverless hosting
   (e.g. Vercel) move this to a shared store (Upstash/Redis) for a global limit. */
const WINDOW_MS = 60 * 1000;
const LIMITS = { POST: 5, GET: 40 };

const store = (globalForPrisma.__vectantRate ||= new Map());

if (!globalForPrisma.__vectantRateSweep) {
  globalForPrisma.__vectantRateSweep = setInterval(() => {
    const cutoff = Date.now() - WINDOW_MS;
    for (const [key, hits] of store) {
      const live = hits.filter((t) => t > cutoff);
      if (live.length) store.set(key, live);
      else store.delete(key);
    }
  }, 5 * 60 * 1000);
  // don't keep the process alive just for the sweep (Node runtime)
  globalForPrisma.__vectantRateSweep?.unref?.();
}

function getClientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(req, method) {
  const max = LIMITS[method] ?? 30;
  const key = `${method}:${getClientIp(req)}`;
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const hits = (store.get(key) || []).filter((t) => t > cutoff);
  hits.push(now);
  store.set(key, hits);
  // guard against unbounded growth from a flood of unique IPs
  if (store.size > 10000) {
    for (const k of store.keys()) {
      store.delete(k);
      if (store.size <= 8000) break;
    }
  }
  return hits.length > max;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ── Optional: send confirmation email via Resend ── */
async function sendConfirmationEmail(email) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // skip if not configured
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "Vectant <vectant.dev@gmail.com>",
        to: email,
        subject: "You're on the Vectant waitlist!",
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#131112;color:#e5e5e5;border-radius:12px;">
          <h2 style="margin:0 0 16px;color:#58A4B0;">Welcome to Vectant</h2>
          <p style="line-height:1.6;color:#94a3b8;">You're on the waitlist for the world's first Fully Autonomous Agentic Runtime Environment (FAARE). We'll notify you when it's your turn.</p>
          <p style="margin-top:24px;color:#94a3b8;font-size:13px;">- The Vectant Team</p>
        </div>`,
      }),
    });
  } catch (e) {
    console.error("Failed to send confirmation email:", e);
  }
}

export async function POST(req) {
  try {
    if (isRateLimited(req, "POST")) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json(
        { error: "Waitlist is unavailable until DATABASE_URL is configured." },
        { status: 503 }
      );
    }

    let waitlist = await prisma.waitlist.findFirst();

    if (waitlist) {
      if (waitlist.emails.includes(trimmedEmail)) {
        return NextResponse.json(
          { message: "Email already on waitlist", count: waitlist.emails.length },
          { status: 200 }
        );
      }
      waitlist = await prisma.waitlist.update({
        where: { id: waitlist.id },
        data: { emails: { push: trimmedEmail } },
      });
    } else {
      waitlist = await prisma.waitlist.create({ data: { emails: [trimmedEmail] } });
    }

    // fire-and-forget; never fails the request
    sendConfirmationEmail(trimmedEmail);

    return NextResponse.json(
      { message: "Successfully added to waitlist", count: waitlist.emails.length },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist write error:", error);
    return NextResponse.json(
      { error: "Waitlist is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }
}

export async function GET(req) {
  try {
    if (isRateLimited(req, "GET")) {
      return NextResponse.json({ message: "Too many requests", count: 0 }, { status: 429 });
    }

    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json(
        { message: "Waitlist unavailable in this environment", count: 0 },
        { status: 200 }
      );
    }

    const waitlist = await prisma.waitlist.findFirst();
    return NextResponse.json(
      {
        message: waitlist ? "Waitlist retrieved successfully" : "No waitlist found",
        count: waitlist ? waitlist.emails.length : 0,
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Waitlist read error:", error);
    return NextResponse.json({ message: "Waitlist temporarily unavailable", count: 0 }, { status: 200 });
  }
}
