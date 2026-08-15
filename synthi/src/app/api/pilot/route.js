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

function formatReceivedAt(value) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(value);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function pilotEmailHtml({ email, company, workflow, receivedAt }) {
  const safeEmail = escapeHtml(email);
  const safeCompany = escapeHtml(company);
  const safeWorkflow = escapeHtml(workflow).replace(/\r?\n/g, "<br />");
  const safeReceivedAt = escapeHtml(receivedAt);
  const logoUrl = process.env.EMAIL_LOGO_URL || "https://vectant.dev/Vectant_v3_nobg.png";
  const safeLogoUrl = escapeHtml(logoUrl);
  const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: Proof pilot request from ${company}`)}`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <title>Proof pilot request from ${safeCompany}</title>
  </head>
  <body style="margin:0; padding:0; background:#0B0C10; color:#F4F4F5; font-family:'Helvetica Neue', Arial, sans-serif;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
      Proof pilot request from ${safeCompany}.
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0B0C10;">
      <tr>
        <td align="center" style="padding:52px 20px 44px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px; text-align:left;">
            <tr>
              <td style="padding:0 0 58px;">
                <img src="${safeLogoUrl}" alt="Vectant" width="180" style="display:block; width:180px; height:auto; border:0;" />
                <div style="padding-top:6px; font-size:14px; line-height:1.3; color:#A1A1AA;">Proof Pilot</div>
              </td>
            </tr>
            <tr>
              <td>
                <div style="font-size:30px; line-height:1.15; letter-spacing:-0.02em; font-weight:600; color:#F4F4F5;">${safeCompany}</div>
                <div style="padding-top:8px; font-size:13px; line-height:1.5; color:#A1A1AA; font-family:'IBM Plex Mono', 'SFMono-Regular', Menlo, Consolas, monospace;">${safeEmail}</div>
              </td>
            </tr>
            <tr>
              <td style="padding-top:50px;">
                <div style="font-size:15px; line-height:1.5; color:#A1A1AA;">wants to test</div>
                <div style="padding-top:10px; max-width:570px; font-size:16px; line-height:1.6; color:#F4F4F5;">${safeWorkflow}</div>
              </td>
            </tr>
            <tr>
              <td style="padding-top:34px;">
                <a href="${replyHref}" style="font-size:15px; line-height:1.5; font-weight:600; color:#F4F4F5; text-decoration:none;">Reply to ${safeCompany} <span style="color:#B545FF;">&rarr;</span></a>
              </td>
            </tr>
            <tr>
              <td style="padding-top:56px; border-bottom:1px solid #292B35;"></td>
            </tr>
            <tr>
              <td style="padding-top:16px;">
                <div style="font-size:11px; line-height:1.5; color:#A1A1AA; font-family:'IBM Plex Mono', 'SFMono-Regular', Menlo, Consolas, monospace;">Received ${safeReceivedAt} &middot; proof pilot form</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
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
  const company = clean(body.company, 120).replace(/\s+/g, " ");
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

  const receivedAt = formatReceivedAt(new Date());

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
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "Vectant <pilot@vectant.dev>",
        to: PILOT_EMAIL,
        reply_to: email,
        subject: `Proof pilot request from ${company}`,
        html: pilotEmailHtml({ email, company, workflow, receivedAt }),
        text: [
          company,
          email,
          "",
          "wants to test",
          "",
          workflow,
          "",
          `Reply to ${company} ->`,
          "",
          `Received ${receivedAt} · proof pilot form`,
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

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(
    pilotEmailHtml({
      email: "dev@synthi.app",
      company: "Synthi Systems",
      workflow: "A guarded workflow that lets an agent inspect a difficult repository, propose a change, and preserve a reviewable proof bundle before anything reaches production.",
      receivedAt: formatReceivedAt(new Date()),
    }),
    {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
}
