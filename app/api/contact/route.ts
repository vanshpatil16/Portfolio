import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

// Vercel Functions: Fluid Compute, Node.js runtime, generous timeout.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  website?: string; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Very small in-memory rate-limit per warm Fluid instance (defense-in-depth — real
// abuse is caught by upstream providers + honeypot). Resets when the instance recycles.
const HITS = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function ipFromHeaders(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = HITS.get(ip);
  if (!entry || now - entry.first > WINDOW_MS) {
    HITS.set(ip, { count: 1, first: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function persistLocally(payload: Required<Omit<Body, "website">> & { ip: string; at: string }) {
  // Vercel functions have a read-only filesystem except /tmp.
  const isVercel = !!process.env.VERCEL;
  const dir = isVercel ? "/tmp" : path.join(process.cwd(), ".data");
  try {
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, "contact-log.jsonl");
    await fs.appendFile(file, JSON.stringify(payload) + "\n", "utf8");
  } catch (e) {
    // Last-resort: log to stdout so it shows up in Vercel runtime logs.
    console.error("[contact] failed to persist locally", e);
    console.log("[contact-msg]", JSON.stringify(payload));
  }
}

async function sendEmail(payload: { name: string; email: string; subject: string; message: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return { sent: false, reason: "email-not-configured" as const };

  try {
    // Dynamic import keeps the bundle slim when not configured.
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const subject = payload.subject?.trim() || `New portfolio message from ${payload.name}`;

    const html = `
      <div style="font-family: ui-monospace, monospace; line-height: 1.5;">
        <h2 style="margin:0 0 12px">New signal — vanshpatil.dev</h2>
        <p><strong>From:</strong> ${escapeHtml(payload.name)} &lt;${escapeHtml(payload.email)}&gt;</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:16px 0" />
        <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(payload.message)}</pre>
      </div>`;

    const { error } = await resend.emails.send({
      from,
      to,
      subject: `[portfolio] ${subject}`,
      replyTo: payload.email,
      html,
      text: `From: ${payload.name} <${payload.email}>\nSubject: ${subject}\n\n${payload.message}`,
    });
    if (error) {
      console.error("[contact] resend error:", error);
      return { sent: false, reason: "resend-error" as const, detail: error.message };
    }
    return { sent: true, reason: "ok" as const };
  } catch (e) {
    const detail = e instanceof Error ? e.message : "Unknown email error";
    console.error("[contact] sendEmail threw:", e);
    return { sent: false, reason: "send-failed" as const, detail };
  }
}

export async function POST(req: Request) {
  try {
    const ip = ipFromHeaders(req.headers);

    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Try again in a minute." },
        { status: 429 },
      );
    }

    let body: Body;
    try {
      body = (await req.json()) as Body;
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }

    // honeypot: if the hidden `website` field has content, silently 200 (don't tip off bots)
    if (body.website && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true, delivered: false, configured: false, note: "honeypot" });
    }

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const subject = (body.subject || "").trim();
    const message = (body.message || "").trim();

    if (name.length < 2 || name.length > 120) {
      return NextResponse.json({ ok: false, error: "Name looks off." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email) || email.length > 200) {
      return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
    }
    if (message.length < 10 || message.length > 4000) {
      return NextResponse.json(
        { ok: false, error: "Message must be 10-4000 chars." },
        { status: 400 },
      );
    }

    const payload = { name, email, subject, message, ip, at: new Date().toISOString() };

    // Persist + email in parallel. Use allSettled so one failing doesn't tank the request.
    const [, emailSettled] = await Promise.allSettled([persistLocally(payload), sendEmail(payload)]);
    const emailResult =
      emailSettled.status === "fulfilled"
        ? emailSettled.value
        : ({
            sent: false,
            reason: "send-failed" as const,
            detail: emailSettled.reason instanceof Error ? emailSettled.reason.message : String(emailSettled.reason),
          });

    const note = emailResult.sent
      ? "Email delivered."
      : emailResult.reason === "email-not-configured"
        ? "Stored locally — set RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL to deliver via email."
        : `Stored locally — email delivery failed${"detail" in emailResult && emailResult.detail ? `: ${emailResult.detail}` : ""}.`;

    return NextResponse.json({
      ok: true,
      delivered: emailResult.sent,
      configured: emailResult.reason !== "email-not-configured",
      note,
    });
  } catch (e) {
    console.error("[contact] unhandled error:", e);
    return NextResponse.json({ ok: false, error: "Server error. Please try again." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/contact",
    method: "POST",
    fields: ["name", "email", "subject", "message"],
  });
}
