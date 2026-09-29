import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

const schema = z.object({
  heroImageUrl: z.union([z.literal(""), z.string().url().max(2048).refine((value) => value.startsWith("https://"), "Image URL must use HTTPS")]).nullable(),
  heroImageAlt: z.string().trim().min(3).max(160),
});

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request); if (denied) return denied;
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  return NextResponse.json({ settings: settings ?? { heroImageUrl: "", heroImageAlt: "Mumbai profile directory preview" } });
}

export async function PUT(request: NextRequest) {
  const denied = requireAdmin(request); if (denied) return denied;
  let body: unknown; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid hero image settings", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  const settings = await db.siteSettings.upsert({ where: { id: "main" }, create: { id: "main", heroImageUrl: parsed.data.heroImageUrl || null, heroImageAlt: parsed.data.heroImageAlt }, update: { heroImageUrl: parsed.data.heroImageUrl || null, heroImageAlt: parsed.data.heroImageAlt } });
  return NextResponse.json({ settings });
}
