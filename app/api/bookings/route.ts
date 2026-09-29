import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { limitInquiry } from "@/lib/rate-limit";

export const runtime = "nodejs";
const schema = z.object({
  profileId: z.string().cuid(),
  clientName: z.string().trim().min(2).max(100),
  clientEmail: z.string().trim().email().max(254),
  clientPhone: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/),
  preferredAt: z.string().datetime({ offset: true }).refine((s) => new Date(s) > new Date(), "Date must be in the future"),
  selectedLocation: z.string().trim().min(2).max(120),
  message: z.string().trim().max(1000).optional(),
  // Honeypot field: real users leave this blank.
  website: z.string().max(0).optional(),
});

function getClientIp(request: NextRequest) {
  // Trust only the proxy header configured by your ingress. Configure Nginx to
  // overwrite X-Real-IP; never trust arbitrary X-Forwarded-For from clients.
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const origin = process.env.APP_ORIGIN;
  if (origin && request.headers.get("origin") !== origin)
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = schema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: "Invalid inquiry details", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true }, { status: 201 });
  try {
    const limit = await limitInquiry(getClientIp(request));
    if (!limit.success) return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000))) } });
  } catch {
    return NextResponse.json({ error: "Inquiry service temporarily unavailable" }, { status: 503 });
  }
  const profile = await db.profile.findFirst({ where: { id: parsed.data.profileId, active: true, available: true }, select: { id: true } });
  if (!profile) return NextResponse.json({ error: "Profile unavailable" }, { status: 404 });
  const { website: _website, ...data } = parsed.data;
  const inquiry = await db.inquiry.create({ data: { ...data, preferredAt: new Date(data.preferredAt) }, select: { id: true, status: true, createdAt: true } });
  return NextResponse.json({ inquiry }, { status: 201 });
}
