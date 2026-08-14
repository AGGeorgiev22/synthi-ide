import { NextResponse } from "next/server";

import { PILOT_EMAIL } from "@/lib/pilot";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;
const globalForPilot = globalThis;
const requestLog = (globalForPilot.__vectantPilotRequests ||= new Map());

function clientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim()
    || request.headers.get("x-real-ip")?.trim()
    || "unknown";
}

function rateLimited(request) {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const key = clientIp(request);
  const recent = (requestLog.get(key) || []).filter((time) => time > cutoff);
  recent.push(now);
  requestLog.set(key, recent);

  if (requestLog.size > 5000) {
    for (const candidate of requestLog.keys()) {
      requestLog.delete(candidate);
      if (requestLog.size <= 4000) break;
    }
  }

  return recent.length > MAX_REQUESTS;
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request) {
  if (rateLimited(request)) {
    return NextResponse.json(
      { error: "Too many pilot requests. Please try again later." },
      { status: 429 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The request body is not valid JSON." }, { status: 400 });
  }

  const email = clean(body.email, 160).toLowerCase();
  const company = clean(body.company, 120);
  const workflow = clean(body.workflow, 1400);

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Enter a valid work email." }, { status: 400 });
  }
  if (company.length < 2) {
    return NextResponse.json({ error: "Enter your company or team." }, { status: 400 });
  }
  if (workflow.length < 20) {
    return NextResponse.json(
      { error: "Describe the difficult system and guarded workflow in at least 20 characters." },
      { status: 400 },
    );
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Automatic delivery is not configured in this environment." },
      { status: 503 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer re_eYsD9AU2_5iPnLq3VzDvggZcCLuTYUeZC`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "Vectant <vectant.dev@gmail.com>",
        to: PILOT_EMAIL,
        reply_to: email,
        subject: `Proof pilot request: ${company}`,
        text: [
          `Work email: ${email}`,
          `Company or team: ${company}`,
          "",
          "Difficult system and guarded workflow:",
          workflow,
        ].join("\n"),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error("Pilot request delivery failed:", response.status, (await response.text()).slice(0, 300));
      return NextResponse.json(
        { error: "Automatic delivery failed. Please use the email fallback." },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: "Pilot request received." }, { status: 201 });
  } catch (error) {
    console.error("Pilot request delivery failed:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Automatic delivery failed. Please use the email fallback." },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
