import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { profileInput } from "@/lib/profile-validation";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request); if (denied) return denied;
  const items = await db.profile.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, slug: true, name: true, age: true, city: true, hub: true, categories: true, hourlyRate: true, dailyRate: true, whatsappNumber: true, galleryUrls: true, verified: true, available: true, active: true, createdAt: true } });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request); if (denied) return denied;
  let body: unknown; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = profileInput.safeParse(body); if (!parsed.success) return NextResponse.json({ error: "Invalid profile", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  try { const item = await db.profile.create({ data: parsed.data }); return NextResponse.json({ item }, { status: 201 }); }
  catch (error: unknown) { if (error && typeof error === "object" && "code" in error && error.code === "P2002") return NextResponse.json({ error: "Slug already exists" }, { status: 409 }); throw error; }
}

