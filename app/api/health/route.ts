import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "vansh-portfolio",
    timestamp: new Date().toISOString(),
    node: process.version,
    env: process.env.VERCEL ? "vercel" : "local",
  });
}
