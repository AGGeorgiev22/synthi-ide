import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

/* ── Simple in-memory rate limiter ── */
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 requests per window per IP

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.start > RATE_LIMIT_WINDOW) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

/* ── Email format validation ── */
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
        from: process.env.RESEND_FROM_EMAIL || "Synthi <noreply@synthi.app>",
        to: email,
        subject: "You're on the Synthi waitlist!",
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#131112;color:#e5e5e5;border-radius:12px;">
          <h2 style="margin:0 0 16px;color:#58A4B0;">Welcome to Synthi</h2>
          <p style="line-height:1.6;color:#94a3b8;">You're on the waitlist for the world's first Autonomous Development Environment. We'll notify you when it's your turn.</p>
          <p style="margin-top:24px;color:#94a3b8;font-size:13px;">— The Synthi Team</p>
        </div>`,
      }),
    });
  } catch (e) {
    console.error("Failed to send confirmation email:", e);
  }
}

export async function POST(req) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Try to find existing waitlist
    let waitlist = await prisma.waitlist.findFirst();

    if (waitlist) {
      // Check if email already exists
      if (waitlist.emails.includes(trimmedEmail)) {
        return NextResponse.json(
          { message: "Email already on waitlist" },
          { status: 200 }
        );
      }

      // Add email to existing waitlist
      waitlist = await prisma.waitlist.update({
        where: { id: waitlist.id },
        data: {
          emails: {
            push: trimmedEmail
          }
        }
      });
    } else {
      // Create new waitlist with first email
      waitlist = await prisma.waitlist.create({
        data: {
          emails: [trimmedEmail]
        }
      });
    }

    // Send confirmation email (non-blocking, won't fail the request)
    sendConfirmationEmail(trimmedEmail);

    return NextResponse.json(
      { message: "Successfully added to waitlist", count: waitlist.emails.length },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add to waitlist" },
      { status: 500 }
    );
  }
}


export async function GET(req) {
    try {
      const waitlist = await prisma.waitlist.findFirst();
  
      if (!waitlist) {
        return NextResponse.json(
          { message: "No waitlist found", emails: [] },
          { status: 200 }
        );
      }
  
      return NextResponse.json(
        { 
          message: "Waitlist retrieved successfully",
          count: waitlist.emails.length,
        },
        { status: 200 }
      );
  
    } catch (error) {
      console.error("Waitlist error:", error);
      return NextResponse.json(
        { error: "Failed to retrieve waitlist" },
        { status: 500 }
      );
    }
  }