import { NextResponse } from "next/server";

/**
 * Daily Seed API — returns a deterministic seed based on today's date (UTC).
 * GET /api/daily-seed
 * Response: { seed: number, date: string }
 */
export async function GET() {
  const today = new Date();
  const dateStr = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`;
  // Simple hash from date string
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
  }
  return NextResponse.json({ seed: Math.abs(hash), date: dateStr });
}
